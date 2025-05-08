import React, { useState } from "react";
import { supabase } from "../supabaseClient";

export default function CreateListing() {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [imageUrls, setImageUrls] = useState([]);
  const [formData, setFormData] = useState({
    imageUrls,
  });

  //   console.log(imageUrls);
  console.log(formData);

  const handleImageSubmit = async () => {
    if (files.length > 0 && files.length < 7) {
      setUploading(true);
      setUploadError(null);
      const promises = files.map((file) => storeImage(file));

      try {
        const urls = await Promise.all(promises);
        setImageUrls(urls);
        setFormData((prevFormData) => ({
          ...prevFormData,
          imageUrls: urls,
        }));
        setUploadError(null);
        document.getElementById('image').value = ''
      } catch (error) {
        setUploadError("Image upload failed. Please try again");
        console.error("Upload error", error);
      } finally {
        setUploading(false);
      }
    } else {
      setUploadError("Please select between 1 and 6 images");
    }
  };

  const storeImage = async (file) => {
    if (!file.type.includes("image")) {
      throw new Error("Only image files are allowed");
    }

    const maxSize = 2 * 1024 * 1024;

    if (file.size > maxSize) {
        throw new Error(`File ${file.name} exceeds the 2MB size limit`)
    }

    const fileName = `listing-${Date.now()}=${file.name}`;

    const { data, error } = await supabase.storage
      .from("comfy-crib-listings")
      .upload(fileName, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      throw error;
    }

    const { data: publicUrlData } = supabase.storage
      .from("comfy-crib-listings")
      .getPublicUrl(fileName);

    return publicUrlData.publicUrl;
  };

  const handleRemoveImage = (index) => {
    const updatedUrls = imageUrls.filter((_, i) => i !== index)
    setImageUrls(updatedUrls);
    setFormData({
        ...formData,
        imageUrls: updatedUrls
    })
  }

  return (
    <main className="font-lato min-h-screen py-6 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-cyan-100 to-cyan-50">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl text-cyan-950 font-semibold text-center my-7">
          Create a Listing
        </h1>
        <form className="flex flex-col gap-4 sm:flex-row">
          <div className="flex flex-col gap-4 flex-1">
            <input
              type="text"
              placeholder="Name"
              className="border border-cyan-300 p-3 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-300"
              id="name"
              maxLength="62"
              minLength="10"
              required
            />
            <input
              type="text"
              placeholder="Description"
              className="border border-cyan-300 p-3 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-300"
              id="description"
              required
            />
            <input
              type="text"
              placeholder="Address"
              className="border border-cyan-300 p-3 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-300"
              id="address"
              required
            />

            <div className="flex gap-6 flex-wrap">
              <div className="flex gap-2">
                <input type="checkbox" id="sale" className="w-5" />
                Sell
              </div>
              <div className="flex gap-2">
                <input type="checkbox" id="rent" className="w-5" />
                Rent
              </div>
              <div className="flex gap-2">
                <input type="checkbox" id="parking" className="w-5" />
                Parking spot
              </div>
              <div className="flex gap-2">
                <input type="checkbox" id="furnished" className="w-5" />
                Furnished
              </div>
              <div className="flex gap-2">
                <input type="checkbox" id="offer" className="w-5" />
                Offer
              </div>
            </div>

            <div className=" flex gap-6 flex-wrap">
              <div className=" flex items-center gap-2">
                <input
                  type="number"
                  id="bedrooms"
                  min="1"
                  max="10"
                  className="bg-white focus:outline-none focus:ring-2 focus:ring-cyan-300 rounded-lg text-center p-3"
                  required
                />
                <p>Beds</p>
              </div>
              <div className=" flex items-center gap-2">
                <input
                  type="number"
                  id="bathrooms"
                  min="1"
                  max="10"
                  className="bg-white focus:outline-none focus:ring-2 focus:ring-cyan-300 rounded-lg text-center p-3"
                  required
                />
                <p>Baths</p>
              </div>

              <div className=" flex items-center gap-2">
                <input
                  type="number"
                  id="regularPrice"
                  min="1"
                  max="10"
                  className="bg-white focus:outline-none focus:ring-2 focus:ring-cyan-300 rounded-lg text-center p-3"
                  required
                />
                <p className="flex flex-col items-center">
                  Regular price <span className="text-xs">($/Month)</span>
                </p>
              </div>
              <div className=" flex items-center gap-2">
                <input
                  type="number"
                  id="discountedPrice"
                  min="1"
                  max="10"
                  className="bg-white focus:outline-none focus:ring-2 focus:ring-cyan-300 rounded-lg text-center p-3"
                  required
                />
                <p className="flex flex-col items-center">
                  Discounted price <span className="text-xs">($/Month)</span>
                </p>
              </div>
            </div>
          </div>
          <div className=" flex flex-col flex-1 gap-4">
            <p className="font-semibold">
              Images:
              <span className="ml-2 text-gray-500 font-normal">
                The first image will be the cover (max 6)
              </span>
            </p>
            <div className="flex gap-4 items-center">
              <input
                type="file"
                id="image"
                className="border border-cyan-300 p-3 rounded-lg bg-white cursor-pointer"
                accept="image/*"
                multiple
                onChange={(e) => {
                    const selectedFiles = Array.from(e.target.files)
                    const maxSize = 2 * 1024 * 1024;

                    const oversizedFiles = selectedFiles.filter(file => file.size > maxSize)

                    if (oversizedFiles.length > 0) {
                        setUploadError(`Some files exceed the 2MB limit: ${oversizedFiles.map(f => f.name).join(', ')}`)
                        e.target.value = ''
                    } else {
                        setUploadError(null);
                        setFiles(selectedFiles)
                    }
                }}
                required
              />
              <button
                className="uppercase text-white font-semibold p-3 bg-cyan-700 border border-cyan-300 rounded-lg cursor-pointer hover:bg-cyan-800 transition duration-300"
                type="button"
                onClick={handleImageSubmit}
                disabled={uploading}
              >
                {uploading ? "Uploading..." : "Upload"}
              </button>
            </div>
            {uploadError && (
              <p className="text-red-600 text-sm">{uploadError}</p>
            )}

            {/* Display uploaded images */}
            {imageUrls.map((url, index) => (
              <div 
                className="flex justify-between items-center"
                key={index}
              >
                <img
                  src={url}
                  alt={`Uploaded ${index + 1}`}
                  className="bg-white p-3 w-20 h-20 object-cover rounded-xl border border-cyan-500"
                />
                <button 
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="bg-black text-red-600 uppercase px-4 py-2 border-0 hover:opacity-85 rounded-lg cursor-pointer"
                >Delete</button>
              </div>
            ))}
            <button
              className="p-3 bg-indigo-950 text-gray-100 cursor-pointer hover:opacity-95 duration-300 transition rounded-sm"
              type="submit"
            >
              Create Listing
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
