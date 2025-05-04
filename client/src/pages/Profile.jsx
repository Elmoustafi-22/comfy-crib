import { useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom'
import ProfileForm from "../components/ProfileForm";

export default function Profile() {
  
  const { currentUser } = useSelector((state) => state.user);
  
  const navigate = useNavigate()
  console.log(currentUser)

 

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

 

  
  if (!currentUser || !currentUser._id) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-4">
          <h2 className="text-lg font-semibold text-red-600">
            Authentication Error
          </h2>
          <p className="mt-2">Please log in again to continue.</p>
          <button
            onClick={() => navigate("/sign-in")}
            className="mt-4 px-4 py-2 bg-cyan-600 text-white rounded hover:bg-cyan-700"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }
  return (
    <div className="font-lato bg-gradient-to-r from-cyan-100 to-cyan-50 min-h-screen py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <h1 className="text-xl font-semibold text-cyan-950">
            Account and Settings
          </h1>
          <p className="text-sm text-gray-500">Last updated: {formattedDate}</p>
        </div>

        {/* Basic Details */}
        <ProfileForm/>
        
      </div>
    </div>
  );
}
