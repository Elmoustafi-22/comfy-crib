import { useSelector, useDispatch } from "react-redux";
import { useRef, useState } from "react";
import { supabase } from "../supabaseClient";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserSuccess,
  deleteUserFailure,
  signOutFailure,
  signOutSuccess,
} from "../redux/userSlice";
import { fetchWithAuth } from "../../../api/utils/fetchWithAuth";
import DeleteModal from "./DeleteModal";

export default function ProfileForm() {
  const fileRef = useRef(null);
  const { currentUser } = useSelector((state) => state.user);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState(currentUser.avatar);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      const res = await fetch("/api/auth/sign-out", {
        method: "POST",
        credentials: "include",
      });

      const data = await res.json();
      console.log(data)
      if (data.success === false) {
        dispatch(signOutFailure(data.message));
        return;
      }
      dispatch(signOutSuccess());
    } catch (error) {
      dispatch(signOutFailure(error.message));
      enqueueSnackbar(error.message, { variant: "error" });
    }
  };

  const handleFileChange = async (e) => {
    try {
      dispatch(updateUserStart());
      const file = e.target.files[0];
      if (!file) return;

      if (!file.type.includes("image")) {
        setUploadError("please select an image");
        return;
      }

      setUploading(true);
      setUploadError(null);

      const fileName = `avatar-${currentUser._id}-${Date.now()}.${file.name
        .split(".")
        .pop()}`;

      const { data, error } = await supabase.storage
        .from("comfy-crib-avatars")
        .upload(fileName, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (error) {
        throw new Error(error.message);
      }

      const { data: publicUrlData } = supabase.storage
        .from("comfy-crib-avatars")
        .getPublicUrl(fileName);

      const avatarUrl = publicUrlData.publicUrl;

      const response = await fetchWithAuth(
        `/api/user/upload-avatar/${currentUser._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ avatarUrl }),
          credentials: "include",
        },
        dispatch,
        navigate
      );

      if (!response) return;
      const data2 = await response.json();

      if (!response.ok) {
        throw new Error(data2.message || "Failed to update avatar");
      }

      setAvatarUrl(avatarUrl);

      const img = new Image();
      img.src = avatarUrl;
      img.onload = () => {
        setUploading(false);
      };

      dispatch(
        updateUserSuccess({
          ...currentUser,
          avatar: avatarUrl,
          updatedAt: new Date().toISOString(),
        })
      );
    } catch (error) {
      setUploadError(error.message);
      console.error("Error uploading avatar:", error);
      setUploading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      avatar: avatarUrl,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      dispatch(updateUserStart());
      const res = await fetchWithAuth(
        `/api/user/update/${currentUser._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        },
        dispatch,
        navigate
      );

      if (!res) return;

      const data = await res.json();

      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }
      setLoading(false);
      console.log(data);
      dispatch(updateUserSuccess(data));
      enqueueSnackbar("Update successfully!", { variant: "success" });
    } catch (error) {
      setLoading(false);
      dispatch(updateUserFailure(error.message));
    }
  };

  const handleDeleteUser = async () => {
    try {
      setLoading(true);
      const res = await fetchWithAuth(
        `/api/user/delete/${currentUser._id}`,
        {
          method: "DELETE",
        },
        dispatch,
        navigate
      );

      if (!res) return;

      const data = await res.json();

      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      setLoading(false);
      setShowDeleteModal(false);
      dispatch(deleteUserSuccess(data));
      enqueueSnackbar("User deleted ✔", { variant: "success" });
    } catch (error) {
      setLoading(false);
      dispatch(deleteUserFailure(error.message));
    }
  };

  const handleOpenDeleteModal = () => {
    setShowDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className="bg-white shadow-lg rounded-lg mb-6 p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-6">
            Basic Details
          </h2>
          <hr className="border-t border-gray-300 w-full mb-6" />

          <div className="flex items-center mb-8">
            <div className="mr-4">
              <div className="flex flex-col">
                <div className="flex flex-row justify-between mb-4">
                  <input
                    type="file"
                    ref={fileRef}
                    hidden
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                  <img
                    src={avatarUrl}
                    alt="Profile picture"
                    className="w-16 h-16 object-cover cursor-pointer mt-2 border-3 border-cyan-400 rounded-full"
                    onClick={() => fileRef.current.click()}
                  />

                  <button
                    type="button"
                    onClick={() => fileRef.current.click()}
                    className={`font-semibold text-cyan-700 text-sm cursor-pointer disabled:text-gray-300 flex items-center gap-2 ${
                      uploading ? "opacity-50" : "opacity-100"
                    }`}
                    disabled={uploading}
                  >
                    {uploading ? (
                      <>
                        <svg
                          className="animate-spin h-4 w-4 text-cyan-600"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                          ></path>
                        </svg>
                        Uploading...
                      </>
                    ) : (
                      "Change"
                    )}
                  </button>
                </div>
                {uploadError && (
                  <p className="text-red-500 text-sm mb-2">{uploadError}</p>
                )}

                {/* Username */}
                <div className="mb-6">
                  <label
                    htmlFor="username"
                    className="block text-sm font-semibold text-cyan-950 mb-2"
                  >
                    Username
                  </label>
                  <input
                    type="text"
                    id="username"
                    className="p-2 shadow-sm text-gray-600 focus:outline-none focus:ring-cyan-600 focus:ring-2 block w-full sm:text-sm rounded"
                    defaultValue={currentUser.username}
                    placeholder="Username"
                    onChange={handleChange}
                  />
                </div>

                {/* Email */}
                <div className="mb-6">
                  <label
                    htmlFor="email"
                    className="block text-sm font-semibold text-cyan-950 mb-2"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="p-2 shadow-sm text-gray-600 focus:outline-none focus:ring-cyan-600 focus:ring-2 block w-full sm:text-sm rounded"
                    defaultValue={currentUser.email}
                    placeholder="Email"
                    onChange={handleChange}
                  />
                </div>
                {/* Password */}
                <div className="mb-6">
                  <label
                    htmlFor="password"
                    className="block text-sm font-semibold text-cyan-950 mb-2 "
                  >
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    className="p-2 shadow-sm text-gray-600 focus:outline-none focus:ring-cyan-600 focus:ring-2 block w-full sm:text-sm rounded"
                    placeholder="Password"
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
          </div>
          {/* buttons */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <button
              type="submit"
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 cursor-pointer transition"
            >
              {loading ? "LOADING" : "UPDATE"}
            </button>
            <button className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 cursor-pointer transition">
              CREATE LISTING
            </button>
          </div>

          <div className="mt-6">
            <hr className="border-t border-gray-300 w-full mb-6" />
          </div>

          <div className="flex justify-between">
            <button
              type="button"
              className="cursor-pointer text-red-600  font-medium"
              onClick={handleOpenDeleteModal}
            >
              Delete Account
            </button>

            <button className="cursor-pointer text-green-600 text-sm font-medium">
              Show listings
            </button>
            <button
              type="button"
              className="cursor-pointer text-red-600 text-sm font-medium"
              onClick={handleSignOut}
            >
              Sign out
            </button>
          </div>
        </div>
      </form>
      {showDeleteModal && (
        <DeleteModal
          handleCloseDeleteModal={handleCloseDeleteModal}
          handleDeleteUser={handleDeleteUser}
          loading={loading}
        />
      )}
    </>
  );
}
