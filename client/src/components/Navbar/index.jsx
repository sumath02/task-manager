import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./style.css";
import Profile from "../Profile";
import { getUserProfileApi } from "./Api/api";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { ClipLoader } from "react-spinners";

export default function Navbar() {
  const navigate = useNavigate();
  const path = location.pathname;
  const active = path.includes("/sign-in");
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");
  const [userProfile, setUserProfile] = useState(null);
  const [loader, setLoader] = useState(false);

  const getUserProfile = useQuery({
    queryKey: ["getUserProfile"],
    queryFn: () => getUserProfileApi(userId, token),
    refetchOnWindowFocus: false,
    refetchOnmount: false,
    refetchOnReconnect: false,
    retry: false,
    enabled: userId !== null && token !== null,
    onSuccess: (response) => {
      if (response.status === 200) {
        setUserProfile(response.data);
      } else {
        toast.error(response?.response?.data?.message);
      }
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  useEffect(() => {
    setLoader(getUserProfile?.isFetching);
  }, [getUserProfile?.isFetching]);

  const handleLogin = () => {
    navigate("/login");
  };

  const handleSignup = () => {
    navigate("/sign-in");
  };

  return (
    <nav className="navbar">
      <div className="logo" onClick={() => navigate("/")}>
        <h1>Task Manager</h1>{" "}
      </div>
      <div className="nav-buttons">
        {!token ? (
          <>
            <button
              className={`nav-btn ${!active ? "active" : ""}`}
              onClick={handleLogin}
            >
              Login
            </button>
            <button
              className={`nav-btn ${active ? "active" : ""}`}
              onClick={handleSignup}
            >
              Sign Up
            </button>
          </>
        ) : (
          <div className="profile">
            {loader ? (
              <ClipLoader color={"#fff"} />
            ) : (
              <Profile userProfile={userProfile} />
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
