import { useState } from "react";
import { useSnackbar } from "notistack";
import { Link } from "react-router-dom";

export default function Listing({ listings, handleShowListings, loading }) {
  const [showModal, setShowModal] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  console.log(listings);

  const deleteImage = async (listingId) => {
    try {
      const res = await fetch(`/api/listing/delete/${listingId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res) return;

      const data = await res.json();

      if (data.success === false) {
        console.log(data.message);
        return;
      }
      await handleShowListings();
    } catch (error) {
      console.log(error);
    }
    console.log(listingId);
  };

  const handleDeleteImage = async (listingId) => {
    try {
      await deleteImage(listingId);
      setShowModal(false);
      enqueueSnackbar("Image deleted ✔", { variant: "success" });
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleOpenModal = () => setShowModal(true);

  const handleCloseModal = () => setShowModal(false);

  return (
    <div className="font-lato bg-white shadow-lg rounded-lg mb-6 p-6">
      {listings.map((listing) => (
        <div key={listing._id} className="flex flex-col gap-4 mb-4">
          <div className="flex justify-between items-center">
            <div className="">
              <Link
                to={`/listing/${listing._id}`}
                className="group flex gap-4 items-center font-semibold text-gray-700 hover:underline hover:text-violet-800 transition-all"
              >
                <img
                  src={listing.imageUrls[0]}
                  className="group-hover:border-violet-800 w-24 h-20 border-2 rounded-lg border-cyan-300"
                />
                <span className="transition-all">{listing.name}</span>
              </Link>
            </div>
            <div className="flex flex-col gap-3 items-center justify-center">
              <button
                type="button"
                className="text-green-500 font-semibold cursor-pointer text-sm"
              >
                Edit
              </button>
              <button
                type="button"
                className="text-red-500 font-semibold cursor-pointer text-sm"
                onClick={() => handleOpenModal()}
              >
                Delete
              </button>
            </div>
          </div>
          {showModal && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 max-w-md w-full">
                <h3 className="text-lg font-medium text-gray-900 mb-5">
                  Delete User
                </h3>
                <hr className="border-t border-gray-300 w-full mb-6" />

                <p className="text-gray-600 mb-6">
                  Are you sure you want to delete this list?
                </p>
                <div className="flex justify-end gap-4">
                  <button
                    type="button"
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-200 cursor-pointer transition"
                    onClick={() => handleCloseModal()}
                  >
                    No, Cancel
                  </button>
                  <button
                    type="button"
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 cursor-pointer transition"
                    onClick={() => handleDeleteImage(listing._id)}
                  >
                    {loading ? "Deleting..." : "Yes, Delete"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
