import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../../api/user";
import { ChevronDown, User, LogOut } from "lucide-react";
import defaultAvatar from "../../assets/avatar.png";
import SearchInput from "./SearchInput";

const NavBar = ({ onSelectConversation }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const user = useSelector((state) => state.user.user);
  const token = useSelector((state) => state.user.token);

  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    setDropdownOpen(false);
    dispatch(logoutUser(token));
    navigate("/");
  };
  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <nav className="bg-gray-900 text-white px-6 py-4 flex justify-between items-center shadow-md">
      <div
        onClick={() => {
          navigate("/home");
          setDropdownOpen(false);
        }}
        className="cursor-pointer text-2xl font-semibold tracking-tight"
      >
        ChatApp
      </div>

      <div className="flex items-center space-x-4">
        <SearchInput onSelectConversation={onSelectConversation} />

        <div ref={dropdownRef} className="relative">
          <button
            onClick={() => setDropdownOpen((prev) => !prev)}
            className="flex items-center space-x-1 bg-gray-800 hover:bg-gray-700 px-3 py-1 rounded-md"
          >
            <ChevronDown />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white text-gray-800 rounded-md shadow-lg z-20">
              <div className="p-2 border-b border-gray-200 flex items-center space-x-2">
                <div className="relative">
                <img
                  src={user?.avatar ? `http://localhost:5000/media/avatars/${user.avatar}` : defaultAvatar}
                  alt="Profile"
                  className="w-8 h-8 rounded-full"
                />
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
                </div>
                  <p className="font-semibold">{user?.name}</p>
              </div>
              <button
                onClick={() => {
                  navigate("/home/profile");
                  setDropdownOpen(false);
                }}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center space-x-2"
              >
                <User />
                <span>Profil</span>
              </button>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center space-x-2"
              >
                <LogOut />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
