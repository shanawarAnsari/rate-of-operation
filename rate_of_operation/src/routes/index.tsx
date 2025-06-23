import React from "react";
import { Routes, Route } from "react-router-dom";
// Import pages
import Dashboard from "../pages/Dashboard";
import RateOfOperation from "../pages/Operations/RateOfOperation";
import Wrenchtime from "../pages/Operations/Wrenchtime";
import FinancialRate from "../pages/Operations/FinancialRate/index";
import ReviewStatus from "../pages/SuperUser/ReviewStatus";
import UserManagement from "../pages/SuperUser/UserManagement";
import { ExclusionList } from "../pages/SuperUser/ExclusionList";
import LoginCallback from "../components/Login/callback";
import AuthGuard from "../components/Login/AuthGuard";
import LoginCallbackError from "../components/Login/LoginCallbackError";

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/login/callback" element={<LoginCallback />} />
      <Route path="/login/callbackError" element={<LoginCallbackError />} />
      <Route path="/" element={<Dashboard />} />
      <Route path="/operations/rate-of-operation" element={<RateOfOperation />} />
      <Route path="/operations/wrenchtime" element={<Wrenchtime />} />
      <Route path="/operations/financial-rate" element={<FinancialRate />} />
      <Route path="/super-user/review-status" element={<ReviewStatus />} />
      <Route path="/super-user/user-management" element={<UserManagement />} />
      <Route path="/super-user/exclusion-list" element={<ExclusionList />} />
    </Routes>
  );
};

export default AppRoutes;
