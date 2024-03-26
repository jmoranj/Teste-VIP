import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { createRoot } from "react-dom";

import CpfAuth from "./pgs/CpfAuth";
import KeyAuth from "./pgs/KeyAuth";
import SecondAuth from "./pgs/SecondAuth";
import Confirmation from "./pgs/Confirmation";
import "./style.css"

const contentor = document.getElementById("root");
const origin = createRoot(contentor);

const App = () => {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<CpfAuth />} />
        <Route path="/keyAuth" element={<KeyAuth />} />
        <Route path="/secAuth" element={<SecondAuth />} />
        <Route path="/confirmation" element={<Confirmation />} />
      </Routes>
    </Router>
  );
};

origin.render(<App />);