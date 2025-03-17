import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Import pages
import Dashboard from "../pages/Dashboard";
import RateOfOperation from "../pages/Operations/RateOfOperation";
import Wrenchtime from "../pages/Operations/Wrenchtime";
import FinancialRate from "../pages/Operations/FinancialRate/index";
import SuperUser from "../pages/SuperUser";
import ReviewStatus from "../pages/SuperUser/ReviewStatus";
import UserManagement from "../pages/SuperUser/UserManagement";

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/operations/rate-of-operation" element={<RateOfOperation />} />
      <Route path="/operations/wrenchtime" element={<Wrenchtime />} />
      <Route path="/operations/financial-rate" element={<FinancialRate />} />
      <Route path="/super-user" element={<SuperUser />} />
      <Route path="/super-user/review-status" element={<ReviewStatus />} />
      <Route path="/super-user/user-management" element={<UserManagement />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
