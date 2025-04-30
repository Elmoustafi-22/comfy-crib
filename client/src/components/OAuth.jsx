import { FaGoogle } from "react-icons/fa";
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import { app } from "../firebase";
import { useDispatch } from "react-redux";
import { useNavigate } from 'react-router-dom'
import { useSnackbar } from 'notistack';
import { signInStart, signInSuccess } from "../redux/userSlice";
import { useState } from "react";

export default function OAuth() {
    const { enqueueSnackbar } = useSnackbar();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false)

    const handleGoogleClick = async () => {
        try {
            setLoading(true)
            dispatch(signInStart())
            const provider = new GoogleAuthProvider();
            const auth = getAuth(app)

            const result = await signInWithPopup(auth, provider);

            const res = await fetch('/api/auth/google', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 
                    name: result.user.displayName,
                    email: result.user.email,
                    avatar: result.user.photoURL
                })
            })
            const data = await res.json()
            setLoading(false)
            console.log(data)
            dispatch(signInSuccess(data))
            navigate('/')
            enqueueSnackbar('Signed in with google', { variant: 'success' })
        } catch (error) {
            setLoading(false)
            console.log("could not sign in with google", error)
            enqueueSnackbar('Google sign-in failed', { variant: 'error' })
        }
    }

  return (
    <button
      onClick={handleGoogleClick}
      className="flex items-center hover:opacity-95 justify-center text-center w-full bg-red-500 text-white cursor-pointer py-2 px-4 rounded transition duration-300"
      type="button"
    >
      {loading ? (
        "LOADING"
      ) : (
        <>
          Continue with &nbsp; <FaGoogle />
          oogle
        </>
      )}
    </button>
  );
}
