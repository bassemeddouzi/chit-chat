import React, { useCallback, useEffect, useRef, useState } from "react";
import defaultAvatar from "../../assets/avatar.png";
import debounce from "lodash.debounce";
import { useDispatch, useSelector } from "react-redux";
import { search_users } from "../../api/user";
import { startConversation } from "../../api/chat";
import { Loader } from "lucide-react";

function SearchInput({ onSelectConversation }) {
  const dispatch = useDispatch();
  const wrapperRef = useRef(null);

  const token = useSelector((state) => state.user.token);
  const searchResults = useSelector((state) => state.user.search_users) || [];
  const conversations = useSelector((state) => state.chat.conversations);
  const my_profil = useSelector((state) => state.user.user);
  const loading = useSelector((state) => state.user.search_users_loading);

  const [searchOpen, setSearchOpen] = useState(false);
  const [search, setSearch] = useState("");

  const debouncedSearch = useCallback(
    debounce((value) => sendSearchRequest(value), 500),
    []
  );

  const sendSearchRequest = (searchUser) => {
    if (!searchUser) {
      setSearchOpen(false);
      dispatch({ type: "SEARCH_USERS_CLEANUP" });
      return;
    }
    setSearchOpen(true);
    dispatch(search_users(token, searchUser));
  };

  const selectDiscussion = (email) => {
    let existingConv = conversations.find(
      (c) => c.participant1.email === email || c.participant2.email === email
    );
    if (existingConv) {
      dispatch({ type: "OPEN_CONVERSATION", payload: existingConv });
    } else {
      dispatch(startConversation(token, email));
    }
    setSearchOpen(false);
    setSearch("");
    dispatch({ type: "SEARCH_USERS_CLEANUP" });
  };

  useEffect(() => {
    if (searchResults.length > 0) {
      setSearchOpen(true);
    }
  }, [searchResults]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={wrapperRef} className="relative">
      <input
        type="text"
        placeholder="Search..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          debouncedSearch(e.target.value);
        }}
        className="bg-gray-800 text-white px-3 py-1 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
      />
      {searchOpen && (
        <div className="absolute left-0 mt-2 w-full bg-white text-gray-800 rounded-md shadow-lg z-20">
          {loading ? (
            <div className="w-full  px-4 py-2  flex items-center justify-center space-x-2">
              <Loader className="animate-spin" />
            </div>
          ) : (
            searchResults &&
            (searchResults.length === 0 ? (
              <p className="text-center font-semibold sm:text-sm py-2">
                No results found ...
              </p>
            ) : (
              searchResults.map((user) => (
                <div
                  key={user.email}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center space-x-2"
                  onClick={() => {
                    selectDiscussion(user.email);
                  }}
                >
                  <div className="relative">
                    <img
                      src={
                        user.avatar
                          ? "http://localhost:5000/media/avatars/" + user.avatar
                          : defaultAvatar
                      }
                      alt={user.name}
                      className="w-8 h-8 rounded-full"
                    />
                    {user.status.connected ? (
                      <div className="absolute bottom-0 right-0 w-2 h-2 bg-green-500 rounded-full" />
                    ) : (
                      <div className="absolute bottom-0 right-0 w-2 h-2 bg-red-500 rounded-full" />
                    )}
                  </div>
                  <span className="text-sm text-gray-500 overflow-hidden">
                    {user.name}
                  </span>

                  <span className="text-xs text-gray-500">
                    {user._id === my_profil._id && "(You)"}
                  </span>
                </div>
              ))
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default SearchInput;
