import React, { useContext, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import axios from "axios";
import { toast } from "react-toastify";

const ResetPassword = () => {
  const { navigate, backendUrl } = useContext(ShopContext);
  axios.defaults.withCredentials = true;
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isEmailSent, setIsEmailSent] = useState("");
  const [otp, setOtp] = useState("");
  const [isOtpSubmitted, setIsOtpSubmitted] = useState("");

  const inputRefs = React.useRef([]);
  const handleInput = (e, index) => {
    if (e.target.value.length > 0 && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };
  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && e.target.value === "" && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };
  const handlePaste = (e) => {
    const paste = e.clipboardData.getData("text");
    const pasteArray = paste.split("");
    pasteArray.forEach((char, index) => {
      if (inputRefs.current[index]) {
        inputRefs.current[index].value = char;
      }
    });
  };

  const onSubmitEmail = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        backendUrl + "/api/user/send-reset-otp",
        { email }
      );
      data.success ? toast.success(data.message) : toast.error(data.message);
      data.success && setIsEmailSent(true);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const onSubmitOtp = async (event) => {
    event.preventDefault();
    const otpArray = inputRefs.current.map((e) => e.value);
    setOtp(otpArray.join(""));
    setIsOtpSubmitted(true);
  };

  const onSubmitNewPassword = async (event) => {
    event.preventDefault();
    try {
      const { data } = await axios.post(
        backendUrl + "/api/user/reset-password",
        {
          email,
          otp,
          newPassword,
          confirmPassword,
        }
      );
      data.success ? toast.success(data.message) : toast.error(data.message);
      data.success && navigate("/login");
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  return (
    <div>
      {!isEmailSent && (
        <form
          onSubmit={onSubmitEmail}
          className="flex flex-col items-center w-[90%] border p-10 rounded-2xl sm:max-w-96 m-auto mt-14 gap-4 text-gray-800"
        >
          <h1 className="text-2xl font-semibold text-center mb-2">
            Reset Password
          </h1>
          <p className="mb-2 text-gray-600">
            Enter email to send the 6-digit code to your email.
          </p>
          <div className="flex items-center gap-3 w-full px-5 py-2.5 rounded-full">
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              className="w-full px-3 py-2 border rounded-xl border-gray-800"
              required
              type="email"
              placeholder="Email"
            />
          </div>
          <button
            type="submit"
            className="bg-black cursor-pointer text-white font-light px-8 py-2 mt-2 rounded-full w-full"
          >
            Submit
          </button>
        </form>
      )}
      {/* OTP Input form */}
      {!isOtpSubmitted && isEmailSent && (
        <form
          onSubmit={onSubmitOtp}
          className="flex flex-col items-center w-[90%] border p-10 rounded-2xl sm:max-w-96 m-auto mt-14 gap-4 text-gray-800"
        >
          <h1 className="text-2xl font-semibold text-center mb-3">
            Reset Password OTP
          </h1>
          <p className="mb-6 text-gray-600">
            Enter the 6-digit code sent to your email.
          </p>
          <div
            className="mb-4 flex justify-center items-center gap-3 w-full px-5 py-2.5 rounded-full"
            onPaste={handlePaste}
          >
            {Array(6)
              .fill(0)
              .map((_, index) => (
                <input
                  type="text"
                  maxLength={1}
                  key={index}
                  required
                  className="w-10 h-10 sm:w-12 sm:h-12 text-gray-800 text-center border text-xl rounded-md"
                  ref={(e) => (inputRefs.current[index] = e)}
                  onInput={(e) => handleInput(e, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                />
              ))}
          </div>

          <button
            type="submit"
            className="bg-black cursor-pointer text-white font-light px-8 py-2 mt-4 rounded-full w-full"
          >
            Submit
          </button>
        </form>
      )}
      {/* Reset Password */}
      {isOtpSubmitted && isEmailSent && (
        <form
          onSubmit={onSubmitNewPassword}
          className="flex flex-col items-center w-[90%] border p-10 rounded-2xl sm:max-w-96 m-auto mt-14 gap- text-gray-800"
        >
          <h1 className="text-2xl font-semibold text-center mb-6">
            New Password
          </h1>
          <p className="mb-6 text-gray-600">Enter the new password below</p>
          <div className="flex flex-col gap-1 w-full px-5 py-2.5 rounded-full">
            <p>New Password</p>
            <input
              onChange={(e) => setNewPassword(e.target.value)}
              value={newPassword}
              className="w-full px-3 py-2 border rounded-xl border-gray-800"
              required
              type="password"
              placeholder="New Password"
            />
          </div>
          <div className="flex flex-col gap-1 w-full px-5 py-2.5 rounded-full">
            <p>Confirm Password</p>
            <input
              onChange={(e) => setConfirmPassword(e.target.value)}
              value={confirmPassword}
              className="w-full px-3 py-2 border rounded-xl border-gray-800"
              required
              type="password"
              placeholder="Confirm Password"
            />
          </div>
          <button
            type="submit"
            className="bg-black cursor-pointer text-white font-light px-8 py-2 mt-4 rounded-full w-full"
          >
            Submit
          </button>
        </form>
      )}
    </div>
  );
};

export default ResetPassword;
