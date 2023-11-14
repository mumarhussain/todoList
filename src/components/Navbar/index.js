import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
export default function Navbar() {
  const [isShow, setIsShow] = useState(false);
  return (
    <div className="bg-[#2194F6] text-white fixed top-0 left-0 right-0 z-50">
      <div className="flex justify-between lg:container mx-auto items-center py-7 px-6 lg:px-0">
        <div>
          <p className="font-bold text-xl">TODO APP</p>
        </div>

        <div className="lg:hidden">
          <FontAwesomeIcon
            icon={faBars}
            size="lg"
            className="h-7 text-white lg:invisible"
            onClick={() => setIsShow((prev) => !prev)}
          />
        </div>

        <div className="hidden lg:flex items-center space-x-10">
          <ul className="flex space-x-10 font-semibold">
            <li className="cursor-pointer px-3">Current Todos</li>
            <li className="cursor-pointer px-3">Upcoming Todos</li>
            <li className="cursor-pointer px-3">Completed Todo</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
