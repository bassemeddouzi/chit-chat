import React, { useEffect, useRef } from "react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { updateProfile } from "../../api/user";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import defafultAvatar from "../../assets/avatar.png";
import { Plus } from "lucide-react";


const UpdateProfile = () => {
  const fileRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector((state) => state.user.user);
  const loading = useSelector((state) => state.user.loading);
  const error = useSelector((state) => state.user.error);

  const [form, setForm] = useState({
    email: user?.email || "",
    name: user?.name || "",
    avatar: user?.avatar || null,
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors({ ...errors, [name]: null });
  };
  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Name is required";
    if (!form.email.includes("@")) newErrors.email = "Enter a valid email";
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    dispatch(updateProfile(form));
    navigate("/home");
  };

  return (
    <div className="flex items-center justify-center w-full mt-10">
      <form
        onSubmit={handleSubmit}
        className="w-1/2 bg-white rounded-lg shadow-lg p-6"
      >
        <h2 className="text-3xl font-bold mb-4 text-center">Update Profile</h2>
        <div className="mb-4 relative">
          <div className="relative w-32 h-32 rounded-full mx-auto mb-4">
            <Plus
              onClick={() => fileRef.current.click()}
              className="absolute rounded-full w-20 h-20 bg-slate-300 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 text-gray-800 hover:opacity-40"
            />
            <img
              src={
                form.avatar ? URL.createObjectURL(form.avatar) : defafultAvatar
              }
              alt="avatar"
              className="w-full h-full object-cover rounded-full"
            />
            <input
              type="file"
              ref={fileRef}
              onChange={(e) => setForm({ ...form, avatar: e.target.files[0] })}
              accept="image/*"
              className="hidden"
            />
          </div>
        </div>
        <div className="flex flex-col mb-4">
          <label className="mb-2" htmlFor="name">
            Name
          </label>
          <input
            type="text"
            id="name"
            value={form.name}
            onChange={(e) => handleChange(e)}
            className="border border-gray-300 rounded-lg p-2 w-full"
          />
        </div>
        {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}

        <div className="flex flex-col mb-4">
          <label className="mb-2" htmlFor="email">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={form.email}
            onChange={(e) => handleChange(e)}
            className="border border-gray-300 rounded-lg p-2 w-full"
          />
        </div>
        {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg w-full"
        >
          Update
        </button>
      </form>
    </div>
  );
};

export default UpdateProfile;
