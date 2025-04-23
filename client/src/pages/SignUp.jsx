import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useSnackbar } from 'notistack'
import OAuth from "../components/OAuth";

function SignUp() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar()
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
    // Clear error when user starts typing
    if (errors[e.target.id]){
      setErrors({
        ...errors,
        [e.target.id]: ''
      })
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.username || formData.username.trim() === '') {
      newErrors.username = 'Username is required';
    }

    if (!formData.email || formData.email.trim() === '') {
      newErrors.email = 'Email is required'; 
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.password){
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;
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

      if (!res.ok || data.success === false) {
        setLoading(false);
        enqueueSnackbar(`${data.message}` || 'Registration failed', {variant: 'error'})
        return;
      }
      setLoading(false);
      navigate('/sign-in')
      enqueueSnackbar('Signed up successfully', { variant: 'success' })
    } catch (error) {
      setLoading(false)
      enqueueSnackbar(`${error.message}` || 'Something went wrong', { variant: 'error' })
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-cyan-100 to-cyan-50">
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
              className=" font-lato text-gray-100 text-sm mb-1 block"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              className="bg-white font-lato w-full text-gray-500 px-4 py-2 rounded border-1 border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-400"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              aria-invalid={errors.username ? "true": "false"}
            />
            {errors.username && (
              <span className="text-red-300 text-xs mt-1">{errors.username}</span>
            )}
          </div>
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
              aria-invalid={errors.email ? "true": "false"}
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
              <span className="text-red-300 text-xs mt-1">{errors.password}</span>
            )}
          </div>
          <button
            disabled={loading}
            className="uppercase w-full bg-cyan-950 hover:opacity-95 disabled:opacity-80 cursor-pointer py-2 px-4 rounded transition duration-300 text-xl text-white mt-4"
            type="submit"
            aria-busy= {loading}
          >
            {loading ? "Loading..." : "Sign Up"}
          </button>
          
          <p className="font-lato text-center text-gray-100 mt-2">
            Already have an account? &nbsp;
            <Link to="/sign-in" className="text-cyan-950 font-bold hover:underline">
              Log In
            </Link>
          </p>
          <div className="py-2 flex items-center text-lg text-gray-100 before:flex-1 before:border-t before:border-gray-200 before:me-6 after:flex-1 after:border-t after:border-gray-200 after:ms-6 dark:text-white dark:before:border-neutral-600 dark:after:border-neutral-600">
            or
          </div>
          <OAuth />
        </form>
      </div>
    </div>
  );
}

export default SignUp;
