import { Route, Routes } from "react-router";
import ConversionPage from "./pages/ConversionPage";
import SignUpPage from "./pages/SignUpPage";
import VerifyPage from "./pages/VerifyPage";
import EmailOtpPage from "./pages/EmailOtpPage";

export default function ConversionContainer() {
  return (
    <Routes>
      <Route path="/" element={<ConversionPage />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/verify" element={<VerifyPage />} />
      <Route path="/email-otp" element={<EmailOtpPage />} />
    </Routes>
  );
}
