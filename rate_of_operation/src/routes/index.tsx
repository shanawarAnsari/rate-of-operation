import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import { oktaAuth } from '../configs/oktaConfig'
// Import pages
import Dashboard from "../pages/Dashboard";
import RateOfOperation from "../pages/Operations/RateOfOperation";
import Wrenchtime from "../pages/Operations/Wrenchtime";
import FinancialRate from "../pages/Operations/FinancialRate/index";
import ReviewStatus from "../pages/SuperUser/ReviewStatus";
import UserManagement from "../pages/SuperUser/UserManagement";
import { ExclusionList } from "../pages/SuperUser/ExclusionList";
import LoginCallback from "../components/LoginCallback";
import ProtectedRoute from "../components/LoginCallback/ProtectedRoute";

const AppRoutes: React.FC = () => {

  return (

    <Routes>
      <Route path="/login/callback" element={<LoginCallback />} />
      <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/operations/rate-of-operation" element={<ProtectedRoute><RateOfOperation /></ProtectedRoute>} />
      <Route path="/operations/wrenchtime" element={<Wrenchtime />} />
      <Route path="/operations/financial-rate" element={<FinancialRate />} />
      <Route path="/super-user/review-status" element={<ReviewStatus />} />
      <Route path="/super-user/user-management" element={<UserManagement />} />
      <Route path="/super-user/exclusion-list" element={<ExclusionList />} />
    </Routes>

  );
};

export default AppRoutes;
