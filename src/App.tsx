"use client";

import HomePage from "@/modules/home/pages/HomePage";
import { Route, Routes } from "react-router";
import ConversionContainer from "./modules/conversion/ConversionContainer";
import DashboardContainer from "./modules/dashboard/DashboardContainer";
import SignInContainer from "./modules/sign-in/SignInContainer";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/sign-in/*" element={<SignInContainer />} />
      <Route path="/conversion/*" element={<ConversionContainer />} />
      <Route path="/dashboard/*" element={<DashboardContainer />} />
    </Routes>
  );
}
