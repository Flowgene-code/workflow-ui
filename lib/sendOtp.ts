import { auth } from "./firebaseConfig";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";

export const sendOtp = async (
  phoneNumber: string,
  setOtpSent: (sent: boolean) => void,
  setError: (msg: string) => void
) => {
  try {
    const formattedPhone = phoneNumber.startsWith("+") ? phoneNumber : `+91${phoneNumber}`;

    const recaptcha = new RecaptchaVerifier(auth, "recaptcha-container", {
      size: "invisible",
      callback: (response: any) => {
        // reCAPTCHA solved
      },
      "expired-callback": () => {
        setError("Recaptcha expired. Please try again.");
      },
    });

    const confirmationResult = await signInWithPhoneNumber(auth, formattedPhone, recaptcha);
    window.confirmationResult = confirmationResult;
    setOtpSent(true);
  } catch (error: any) {
    console.error(error);
    setError(error.message || "Something went wrong while sending OTP");
  }
};
