import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../../api/user";
import { useNavigate } from "react-router-dom";
import defafultAvatar from "../../assets/avatar.png";
import { Plus } from "lucide-react";

const Register = () => {
  const fileRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
  const error = useSelector((state) => state.user.error);


  
  const [form, setForm] = useState({
    email: "",
    name: "",
    password: "",
    avatar: null,
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
    if (!form.password) newErrors.password = "Password is required";
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    dispatch(registerUser(form));
  };

  useEffect(() => {
    if (isAuthenticated) {
      setForm({ email: "", name: "", password: "", avatar: null });
      navigate("/home");
    }
  }, [isAuthenticated, navigate]);

  return (
    <form onSubmit={handleSubmit}>
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
      <div className="mb-4">
        <label className="block mb-1 text-sm font-medium text-gray-700">
          Email
        </label>
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
      </div>

      <div className="mb-4">
        <label className="block mb-1 text-sm font-medium text-gray-700">
          Name
        </label>
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
      </div>

      <div className="mb-6">
        <label className="block mb-1 text-sm font-medium text-gray-700">
          Password
        </label>
        <input
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.password && (
          <p className="text-red-500 text-sm">{errors.password}</p>
        )}
      </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <br/>
      <button
        type="submit"
        className="w-full bg-gray-600 text-white py-2 rounded-md hover:bg-gray-900 transition-colors"
      >
        Register
      </button>
    </form>
  );
};

export default Register;
