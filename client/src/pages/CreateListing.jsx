import React, { useState } from "react";
import { supabase } from "../supabaseClient";
import { fetchWithAuth } from "../../../api/utils/fetchWithAuth";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function CreateListing() {
  const { currentUser } = useSelector((state) => state.user);
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(null);
  const [imageUrls, setImageUrls] = useState([]);
  const [formData, setFormData] = useState({
    imageUrls,
    name: "",
    description: "",
    address: "",
    type: "rent",
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 100,
    discountPrice: 0,
    offer: false,
    parking: false,
    furnished: false,
  });
  console.log(formData);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleImageSubmit = async () => {
    if (files.length > 0 && files.length < 7) {
      setUploading(true);
      setUploadError(null);
      const promises = files.map((file) => storeImage(file));

      try {
        const urls = await Promise.all(promises);
        if (formData.regularPrice < formData.discountPrice)
          return setError("Discount price must be lower than regular price");
        setImageUrls(urls);
        setFormData((prevFormData) => ({
          ...prevFormData,
          imageUrls: urls,
        }));
        setUploadError(null);
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
      throw new Error(`File ${file.name} exceeds the 2MB size limit`);
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
    const updatedUrls = imageUrls.filter((_, i) => i !== index);
    setImageUrls(updatedUrls);
    setFormData({
      ...formData,
      imageUrls: updatedUrls,
    });
  };

  const handleChange = (e) => {
    if (e.target.id === "sale" || e.target.id === "rent") {
      setFormData({
        ...formData,
        type: e.target.id,
      });
    }

    if (
      e.target.id === "parking" ||
      e.target.id === "furnished" ||
      e.target.id === "offer"
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.checked,
      });
    }

    if (
      e.target.type === "number" ||
      e.target.type === "text" ||
      e.target.type === "textarea"
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await fetchWithAuth(
        "/api/listing/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...formData,
            userRef: currentUser?._id,
          }),
        },
        dispatch,
        navigate
      );

      const data = await res.json();
      setLoading(false);

      if (data.success === false) {
        setError(false);
      }

      navigate(`/listing/${data._id}`)
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <main className="font-lato min-h-screen py-6 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-cyan-100 to-cyan-50">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl text-cyan-950 font-semibold text-center my-7">
          Create a Listing
        </h1>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 sm:flex-row"
        >
          <div className="flex flex-col gap-4 flex-1">
            <input
              type="text"
              placeholder="Name"
              className="border border-cyan-300 p-3 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-300"
              id="name"
              maxLength="62"
              minLength="10"
              required
              onChange={handleChange}
              value={formData.name}
            />
            <textarea
              type="text"
              placeholder="Description"
              className="border border-cyan-300 p-3 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-300"
              id="description"
              required
              onChange={handleChange}
              value={formData.description}
            />
            <input
              type="text"
              placeholder="Address"
              className="border border-cyan-300 p-3 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-300"
              id="address"
              required
              onChange={handleChange}
              value={formData.address}
            />

            <div className="flex gap-6 flex-wrap">
              <div className="flex gap-2">
                <input
                  type="checkbox"
                  id="sale"
                  className="w-5"
                  onChange={handleChange}
                  checked={formData.type === "sale"}
                />
                Sell
              </div>
              <div className="flex gap-2">
                <input
                  type="checkbox"
                  id="rent"
                  className="w-5"
                  onChange={handleChange}
                  checked={formData.type === "rent"}
                />
                Rent
              </div>
              <div className="flex gap-2">
                <input
                  type="checkbox"
                  id="parking"
                  className="w-5"
                  onChange={handleChange}
                  checked={formData.parking}
                />
                Parking spot
              </div>
              <div className="flex gap-2">
                <input
                  type="checkbox"
                  id="furnished"
                  className="w-5"
                  onChange={handleChange}
                  checked={formData.furnished}
                />
                Furnished
              </div>
              <div className="flex gap-2">
                <input
                  type="checkbox"
                  id="offer"
                  className="w-5"
                  onChange={handleChange}
                  checked={formData.offer}
                />
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
                  onChange={handleChange}
                  value={formData.bedrooms}
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
                  onChange={handleChange}
                  value={formData.bathrooms}
                />
                <p>Baths</p>
              </div>

              <div className=" flex items-center gap-2">
                <input
                  type="number"
                  id="regularPrice"
                  min="100"
                  max="1000000"
                  className="bg-white focus:outline-none focus:ring-2 focus:ring-cyan-300 rounded-lg text-center p-3"
                  required
                  onChange={handleChange}
                  value={formData.regularPrice}
                />
                <p className="flex flex-col items-center">
                  Regular price <span className="text-xs">($/Month)</span>
                </p>
              </div>
              {formData.offer && (
                <div className=" flex items-center gap-2">
                  <input
                    type="number"
                    id="discountPrice"
                    min="0"
                    max="500000"
                    className="bg-white focus:outline-none focus:ring-2 focus:ring-cyan-300 rounded-lg text-center p-3"
                    required
                    onChange={handleChange}
                    value={formData.discountPrice}
                  />
                  <p className="flex flex-col items-center">
                    Discounted price <span className="text-xs">($/Month)</span>
                  </p>
                </div>
              )}
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
                  const selectedFiles = Array.from(e.target.files);
                  const maxSize = 2 * 1024 * 1024;

                  const oversizedFiles = selectedFiles.filter(
                    (file) => file.size > maxSize
                  );

                  if (oversizedFiles.length > 0) {
                    setUploadError(
                      `Some files exceed the 2MB limit: ${oversizedFiles
                        .map((f) => f.name)
                        .join(", ")}`
                    );
                    e.target.value = "";
                  } else {
                    setUploadError(null);
                    setFiles(selectedFiles);
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
              <div className="flex justify-between items-center" key={index}>
                <img
                  src={url}
                  alt={`Uploaded ${index + 1}`}
                  className="bg-white p-3 w-20 h-20 object-cover rounded-xl border border-cyan-500"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="bg-black text-red-600 uppercase px-4 py-2 border-0 hover:opacity-85 rounded-lg cursor-pointer"
                >
                  Delete
                </button>
              </div>
            ))}
            <button
              className="p-3 bg-indigo-950 text-gray-100 cursor-pointer hover:opacity-95 duration-300 transition rounded-sm"
              type="submit"
              disabled={loading || uploading}
            >
              {loading ? "Creating..." : "Create listing"}
            </button>
            {error && <p className="text-red-700 text-sm">{error}</p>}
          </div>
        </form>
      </div>
    </main>
  );
}
