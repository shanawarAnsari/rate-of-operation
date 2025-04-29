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

const AppRoutes: React.FC = () => {

  return (

    <Routes>
      <Route path="/login/callback" element={<LoginCallback />} />
      <Route path="/" element={<AuthGuard><Dashboard /></AuthGuard>} />
      <Route path="/operations/rate-of-operation" element={<AuthGuard><RateOfOperation /></AuthGuard>} />
      <Route path="/operations/wrenchtime" element={<AuthGuard><Wrenchtime /></AuthGuard>} />
      <Route path="/operations/financial-rate" element={<AuthGuard><FinancialRate /></AuthGuard>} />
      <Route path="/super-user/review-status" element={<AuthGuard><ReviewStatus /></AuthGuard>} />
      <Route path="/super-user/user-management" element={<AuthGuard><UserManagement /></AuthGuard>} />
      <Route path="/super-user/exclusion-list" element={<AuthGuard><ExclusionList /></AuthGuard>} />
    </Routes>

  );
};

export default AppRoutes;
