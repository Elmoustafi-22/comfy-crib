import React from "react";

export default function CreateListing() {
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
                required
              />
              <button
                className="uppercase text-white font-semibold p-3 bg-cyan-700 border border-cyan-300 rounded-lg cursor-pointer hover:bg-cyan-800 transition duration-300"
                type="button"
              >
                Upload
              </button>
            </div>
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
