import { Link } from "react-router-dom";
import { FaGoogle } from "react-icons/fa";
import { useState } from "react";

function SignUp() {
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await fetch("/api/auth/sign-up", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success === false) {
        setLoading(false);
        setError(data.message);
        return;
      }
      setLoading(false);
    } catch (error) {
      setLoading(false)
      setError(error.message)
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-r from-cyan-100 to-cyan-50">
      <div className="flex flex-col items-center bg-gradient-to-r from-cyan-700 to-cyan-500  p-8 rounded-lg shadow-xl w-full max-w-md">
        <h1 className="font-lato font-bold text-3xl text-cyan-950 mb-2">
          Sign up
        </h1>
        <h3 className="font-lato text-base text-gray-200 text-shadow-cyan-100 mb-6">
          Welcome to ComfyCrib - Let's create your account
        </h3>
        <hr className="border-t border-gray-300 w-full mb-6" />
        <form onSubmit={handleSubmit} className="w-full space-y-2">
          <div>
            <label
              htmlFor="userName"
              className=" font-lato text-gray-100 text-sm mb-1"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              className="bg-white font-lato w-full text-gray-500 px-4 py-2 rounded border-1 border-gray-300 focus:outline-cyan-400"
              placeholder="Username"
              onChange={handleChange}
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="font-lato text-gray-100 text-sm mb-1"
            >
              Email
            </label>
            <input
              type="text"
              id="email"
              className="bg-white font-lato w-full text-gray-500 px-4 py-2 rounded border-1 border-gray-300 focus:outline-cyan-400"
              placeholder="Email"
              onChange={handleChange}
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className=" font-lato text-gray-100 text-sm mb-1"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              className="bg-white font-lato w-full text-gray-500 px-4 py-2 rounded border-1 border-gray-300 focus:outline-cyan-400"
              placeholder="Password"
              onChange={handleChange}
            />
          </div>
          <button
            disabled={loading}
            className="uppercase w-full bg-cyan-950 hover:opacity-95 disabled:opacity-80 cursor-pointer py-2 px-4 rounded transition duration-300 text-xl text-white mt-1"
            type="submit"
          >
            {loading ? "Loading..." : "Sign Up"}
          </button>
          <p className="font-lato text-center text-gray-100">
            Already have an account? &nbsp;
            <Link to="/sign-in" className="text-cyan-950 font-bold">
              Log In
            </Link>
          </p>
          <div className="py-2 flex items-center text-lg text-gray-100 before:flex-1 before:border-t before:border-gray-200 before:me-6 after:flex-1 after:border-t after:border-gray-200 after:ms-6 dark:text-white dark:before:border-neutral-600 dark:after:border-neutral-600">
            or
          </div>
          <button
            className="flex items-center hover:opacity-95 justify-center text-center w-full bg-red-500 text-white cursor-pointer py-2 px-4 rounded transition duration-300 text-x"
            type="submit"
          >
            Continue with &nbsp; <FaGoogle />
            oogle
          </button>
        </form>
      {error && <p className="text-red-600 mt-5 font-lato text-center text-lg italic">{error}</p>}
      </div>
    </div>
  );
}

export default SignUp;
