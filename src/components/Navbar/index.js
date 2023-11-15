import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import CompletedTodos from "../../pages/completedTodos";
import CurrentTodos from "../../pages/currentTodos";

export default function Navbar() {
  const [isShow, setIsShow] = useState(false);

  return (
    <Router>
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
              <li className="cursor-pointer px-3">
                <Link to="/">Current Todos</Link>
              </li>
              <li className="cursor-pointer px-3">
                <Link to="/completedTodos">Completed Todos</Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <Routes>
        <Route path="/" element={<CurrentTodos />} />
        <Route path="/completedTodos" element={<CompletedTodos />} />
      </Routes>
    </Router>
  );
}
