import React from "react";
import { useSelector } from "react-redux";
import {
  Navigate,
  Routes,
  Route,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { Loader } from "lucide-react";

import Login from "../layout/Auth/Login";
import Register from "../layout/Auth/Register";
import FadePage from "../components/animation_Instance/FadePage";

function Auth() {
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
  const loading = useSelector((state) => state.user.loading);
  const navigate = useNavigate();
  const location = useLocation();

  if (isAuthenticated) return <Navigate to="/home" />;

  const isLogin = location.pathname.endsWith("/login");

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md relative">
        {loading && (
          <div className="absolute backdrop-blur-sm w-full h-full top-0 left-0 z-10 flex items-center justify-center">
            <Loader className="animate-spin text-gray-700" />
          </div>
        )}

        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
          {isLogin ? "Login" : "Register"}
        </h1>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Navigate to="login" />} />
            <Route
              path="login"
              element={
                <FadePage>
                  <Login />
                </FadePage>
              }
            />
            <Route
              path="register"
              element={
                <FadePage>
                  <Register />
                </FadePage>
              }
            />
          </Routes>
        </AnimatePresence>

        <p className="mt-4 text-center text-sm text-gray-600">
          {isLogin ? (
            <>
              Don’t have an account?{" "}
              <button
                onClick={() => navigate("/auth/register")}
                className="text-gray-900 hover:underline font-medium"
              >
                Register
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button
                onClick={() => navigate("/auth/login")}
                className="text-gray-900 hover:underline font-medium"
              >
                Login
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
}

export default Auth;
