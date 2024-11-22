import React from "react";
import { useNavigate } from "react-router-dom";
import { CircleUserRound } from "lucide-react";
import logo from "../assets/logo4.jpg";
import LogoutAlert from "@/hooks/logOut.jsx";


const DashboardsNavBar = ({profilePageString}) => {
  const navigate = useNavigate();
  return (
    <div className="sticky top-0 z-10 shadow mx-auto bg-white w-full h-auto flex justify-between items-center mb-4">
      <div>
        <div className="flex items-center">
          <img className="w-20 h-15 " src={logo} alt="" />
          <h1 className="text-2xl font-bold self-center">TravelM8</h1>
        </div>
      </div>
      <div className="flex items-center">
        <button>
          <LogoutAlert/>
        </button>
        <CircleUserRound
          className="cursor-pointer h-10 w-10 m-4"
          onClick={() => navigate(profilePageString)}
        />
      </div>
    </div>
  );
};

export default DashboardsNavBar;
