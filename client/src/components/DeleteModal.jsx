import React from 'react'

export default function DeleteModal({handleDeleteUser, handleCloseDeleteModal, loading}) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h3 className="text-lg font-medium text-gray-900 mb-5">Delete User</h3>
        <hr className="border-t border-gray-300 w-full mb-6" />

        <p className="text-gray-600 mb-6">
          Are you sure you want to delete your account? This action cannot be
          undone and all your data will be permanently removed.
        </p>
        <div className="flex justify-end gap-4">
          <button
            type="button"
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-200 cursor-pointer transition"
            onClick={handleCloseDeleteModal}
          >
            No, Cancel
          </button>
          <button
            type="button"
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 cursor-pointer transition"
            onClick={handleDeleteUser}
          >
            {loading ? "Deleting..." : "Yes, Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
