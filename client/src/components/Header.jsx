import { FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

function Header() {
  const { currentUser } = useSelector((state) => state.user);
  return (
    <header className="bg-gradient-to-r from-cyan-700 via-cyan-600 to-cyan-500 border-b-2 border-b-cyan-200/50 shadow-md">
      <div className="flex justify-between items-center max-w-7xl mx-auto p-3">
        {/* Logo  */}
        <Link to="/">
          <h1 className="font-lato font-extrabold text-sm sm:text-xl flex flex-wrap">
            <span className="text-cyan-400">Comfy</span>
            <span className="text-cyan-950">Crib</span>
          </h1>
        </Link>

        {/* Search Bar  */}
        <form className="w-60 lg:w-120 px-2 py-2 border border-cyan-400 bg-white rounded-4xl items-center relative">
          <input
            className="font-lato text-slate-600 bg-transparent w-full focus:ring-0 focus:outline-0 relative"
            type="text"
            placeholder="Find your perfect home..."
          />
          <FaSearch className="text-slate-600 absolute right-3 top-3 size-4" />
        </form>

        {/* Nav links  */}
        <ul className="flex gap-4 items-center">
          <Link to="/">
            <li className="hidden sm:inline text-slate-700 py-1 px-1 relative group">
              Home
              <span className="absolute bottom-0 right-0 w-0 h-0.5 bg-cyan-400 transition-all group-hover:w-full group-hover:right-auto group-hover:left-0 duration-300"></span>
            </li>
          </Link>
          <Link to="/about">
            <li className="hidden sm:inline text-slate-700 py-1 px-1 relative group">
              About
              <span className="absolute bottom-0 right-0 w-0 h-0.5 bg-cyan-400 transition-all group-hover:w-full group-hover:right-auto group-hover:left-0 duration-300"></span>
            </li>
          </Link>
          
          <Link to="/profile" className="bg-slate-50 border-2 border-cyan-400 rounded-full">
            {currentUser ? 
              <img
                src={currentUser.avatar}
                alt="avatar"
                className="w-10 h-10 rounded-full object-cover border-2 border-cyan-400"
              />
             : (
              <li className="text-slate-700 py-1 px-1 relative group">
                Sign in
                <span className="absolute bottom-0 right-0 w-0 h-0.5 bg-cyan-400 transition-all group-hover:w-full group-hover:right-auto group-hover:left-0 duration-300"></span>
              </li>
            )}
          </Link>
        </ul>
      </div>
    </header>
  );
}

export default Header;
