import React from "react";
import { useSelector } from "react-redux";

export default function Profile() {
  const { currentUser } = useSelector((state) => state.user);
  const date = new Date(currentUser.updatedAt);
  const formattedDate = date.toLocaleString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZoneName: "short",
  });

  return (
    <div className="font-lato bg-gradient-to-r from-cyan-100 to-cyan-50 min-h-screen py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <h1 className="text-xl font-semibold text-cyan-950">Account and Settings</h1>
          <p className="text-sm text-gray-500">Last updated: {formattedDate}</p>
        </div>

        {/* Basic Details */}

        <form>
          <div className="bg-white shadow-lg rounded-lg mb-6 p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-6">
              Basic Details
            </h2>
            <hr className="border-t border-gray-300 w-full mb-6" />

            <div className="flex items-center mb-8">
              <div className="mr-4">
                <div className="flex flex-col">
                  <div className="flex flex-row justify-between mb-4">
                    <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-100">
                      <img
                        src={currentUser.avatar}
                        alt="Profile picture"
                        className="w-full h-full object-cover cursor-pointer mt-2"
                      />
                    </div>
                    <button className="font-semibold text-cyan-700 text-sm cursor-pointer">
                      Change
                    </button>
                  </div>
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
                      placeholder="Username"                
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
                      placeholder="Email"
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
                    />
                  </div>
                </div>
              </div>
            </div>
            {/* buttons */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <button className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 cursor-pointer transition">
                UPDATE
              </button>
              <button className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 cursor-pointer transition">
                CREATE LISTING
              </button>
            </div>

            <div className="mt-6">
              <hr className="border-t border-gray-300 w-full mb-6" />
            </div>

            <div className="flex justify-between">
              <button className="cursor-pointer text-red-600  font-medium">
                Delete Account
              </button>

              <button className="cursor-pointer text-green-600 text-sm font-medium">
                Show listings
              </button>
              <button className="cursor-pointer text-red-600 text-sm font-medium">
                Sign out
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
