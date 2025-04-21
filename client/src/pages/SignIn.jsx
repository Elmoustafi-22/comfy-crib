import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useSnackbar } from "notistack";
import { useDispatch, useSelector } from 'react-redux'
import { signInStart, signInSuccess, signInFailure } from '../redux/userSlice';

function SignIn() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  // const [loading, setLoading] = useState(false);
  const { loading } = useSelector((state) => state.user)
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const dispatch = useDispatch()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
    // Clear error when user starts typing
    if (errors[e.target.id]) {
      setErrors({
        ...errors,
        [e.target.id]: "",
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email || formData.email.trim() === "") {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;
    try {
      dispatch(signInStart())
      const res = await fetch("/api/auth/sign-in", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok || data.success === false) {
        dispatch(signInFailure(data.message))
        enqueueSnackbar(`${data.message}` || "Registration failed", {
          variant: "error",
        });
        return;
      }
      dispatch(signInSuccess(data))
      navigate("/");
      enqueueSnackbar("Signed in successfully", { variant: "success" });
    } catch (error) {
      dispatch(signInFailure(error.message))
      enqueueSnackbar(`${error.message}` || "Something went wrong", {
        variant: "error",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-cyan-100 to-cyan-50">
      <div className="flex flex-col items-center bg-gradient-to-r from-cyan-700 to-cyan-500  p-8 rounded-lg shadow-xl w-full max-w-md">
        <h1 className="font-lato font-bold text-3xl text-cyan-950 mb-2">
          Sign in
        </h1>
        <h3 className="font-lato text-base text-gray-200 text-shadow-cyan-100 mb-6">
          Welcome to ComfyCrib
        </h3>
        <hr className="border-t border-gray-300 w-full mb-6" />
        <form onSubmit={handleSubmit} className="w-full space-y-2">
          <div>
            <label
              htmlFor="email"
              className="font-lato text-gray-100 text-sm mb-1 block"
            >
              Email
            </label>
            <input
              type="text"
              id="email"
              className="bg-white font-lato w-full text-gray-500 px-4 py-2 rounded border-1 border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-400"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              aria-invalid={errors.email ? "true" : "false"}
            />
            {errors.email && (
              <span className="text-red-300 text-xs mt-1">{errors.email}</span>
            )}
          </div>
          <div>
            <label
              htmlFor="password"
              className=" font-lato text-gray-100 text-sm mb-1 block"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              className="bg-white font-lato w-full text-gray-500 px-4 py-2 rounded border-1 border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-400"
              placeholder="Password (min 6 characters)"
              value={formData.password}
              onChange={handleChange}
              aria-invalid={errors.password ? "true" : "false"}
            />
            {errors.password && (
              <span className="text-red-300 text-xs mt-1">
                {errors.password}
              </span>
            )}
          </div>
          <button
            disabled={loading}
            className="uppercase w-full bg-cyan-950 hover:opacity-95 disabled:opacity-80 cursor-pointer py-2 px-4 rounded transition duration-300 text-xl text-white mt-4"
            type="submit"
            aria-busy={loading}
          >
            {loading ? "Loading..." : "Sign In"}
          </button>
          <p className="font-lato text-center text-gray-100 mt-2">
            Don&#39;t have an account? &nbsp;
            <Link
              to="/sign-up"
              className="text-cyan-950 font-bold hover:underline"
            >
              Sign Up
            </Link>
          </p>
          
        </form>
      </div>
    </div>
  );
}

export default SignIn;
