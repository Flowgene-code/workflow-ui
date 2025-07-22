export const verifyOtp = async (
  otp: string,
  setSuccess: (success: boolean) => void,
  setError: (msg: string) => void
) => {
  try {
    const confirmationResult = (window as any).confirmationResult;
    if (!confirmationResult) {
      setError("No OTP request found. Please request OTP again.");
      return;
    }

    await confirmationResult.confirm(otp);
    setSuccess(true);
  } catch (error: any) {
    console.error(error);
    setError(error.message || "OTP verification failed");
  }
};
