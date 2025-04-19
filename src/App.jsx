import { Routes, Route } from "react-router-dom"
import Home from "./pages/Home";
import SignIn from "./pages/SignIn";
import SignOut from "./pages/SignOut";
import About from "./pages/About";
import Profile from "./pages/Profile";

function App() {

  return (
    <Routes>
      <Route path="/" element={<Home />}/>
      <Route path="/sign-in" element={<SignIn />}/>
      <Route path="/sign-out" element={<SignOut />}/>
      <Route path="/about" element={<About />} />
      <Route path="/profile" element={<Profile/>} />
    </Routes>
  );
}

export default App
