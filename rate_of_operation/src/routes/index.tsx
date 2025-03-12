import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Import pages
import Dashboard from "../pages/Dashboard";
import RateOfOperation from "../pages/Operations/RateOfOperation";
import Wrenchtime from "../pages/Operations/Wrenchtime";

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/operations/rate-of-operation" element={<RateOfOperation />} />
      <Route path="/operations/wrenchtime" element={<Wrenchtime />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
