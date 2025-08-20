import { Route, Routes } from 'react-router';
import SignInPage from './pages/SignInPage';
import MagicLinkPage from './pages/MagicLinkPage';
import EmailOtpPage from './pages/EmailOtpPage';
import PhoneOtpPage from './pages/PhoneOtpPage';

export default function SignInContainer() {
  return (
    <Routes>
      <Route path="/" element={<SignInPage />} />
      <Route path="/magic-link" element={<MagicLinkPage />} />
      <Route path="/email-otp" element={<EmailOtpPage />} />
      <Route path="/phone-otp" element={<PhoneOtpPage />} />
    </Routes>
  );
}
