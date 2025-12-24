"use client";
import NewOtpInput from "@/components/NewOtpInput";
import OTPInput from "@/components/OTPInput";
import PhoneInput from "@/components/PhoneInput";
import Image from "next/image";
import { useState } from "react";

export default function AbhaCommunication({
  otpMessage = "We just sent an OTP on the Mobile Number ${mobileVal} linked with  Aadhaar. Enter the OTP below to proceed with ABHA creation",
  setCurrentStep,
  currentStep,
  showOtp,
  ...props
}) {
  const [otpAttempts, setOtpAttempts] = useState(0);

  const onResentOTP = () => {
    if (otpAttempts < 2) {
      setOtpAttempts(otpAttempts + 1);
      props.handleResentOTP();
    }
  };
  const newProps = {
    ...props,
    error: props?.error?.phoneNumber,
    handleResentOTP: onResentOTP,
    value: props?.formData?.phoneNumber || "",
    disabled: showOtp,
  };
  return (
    <>
      <div className="">
        <Image
          width={440}
          height={440}
          src="/aadhaar_auth_img.svg"
          alt="aadhaar_auth_img"
        />
      </div>
      <div className="relative">
        <h1 className="text-lg md:text-xl font-semibold text-gray-800">
          Aadhaar Authentication
        </h1>
        <p className="mt-2 text-sm leading-6 text-gray-600">{otpMessage}</p>
        <div className="mt-2">
          <div className="sm:col-span-3 mt-1">
            <PhoneInput {...newProps} />
          </div>
          {showOtp && (
            <div className="sm:col-span-3">
              {/* <OTPInput {...newProps}  />*/}
              <NewOtpInput {...newProps} />
            </div>
          )}
        </div>
      </div>
      <div className="w-full absolute bottom-0 inset-x-0 px-6 max-[375px]:px-4 py-4 bg-white flex items-center justify-center gap-x-4 shadow-top">
        <button
          type="button"
          onClick={() => {
            if (showOtp) {
              setCurrentStep(currentStep + 1);
            } else {
              props.handleResentOTP();
            }
          }}
          className="sm:w-60 w-full rounded-lg bg-blue-600 px-3 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        >
          {!showOtp ? "Verify" : "Next"}
        </button>
      </div>
    </>
  );
}
