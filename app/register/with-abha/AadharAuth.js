"use client";
import NewOtpInput from "@/components/NewOtpInput";
import OTPInput from "@/components/OTPInput";
import PhoneInput from "@/components/PhoneInput";
import Image from "next/image";
import { useState } from "react";

export function AadharAuthentication({
  otpMessage = "We just sent an OTP on the Mobile Number ${mobileVal} linked with  Aadhaar. Enter the OTP below to proceed with ABHA creation",
  setCurrentStep,
  currentStep,
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
    name: "phoneNumber",
  };

  return (
    <>
      <div className="mt-4 mb-4">
        <Image
          width={440}
          height={440}
          src="/aadhaar_auth_img.svg"
          alt="Aadhaar Auth"
          className="mx-auto aadh_auth_img"
        />
      </div>
      <div className="relative">
        <h1 className="text-lg md:text-xl font-semibold text-gray-800">
          Aadhaar Authentication
        </h1>
        <p className="mt-1 text-sm text-gray-500">{otpMessage}</p>
        <div className="mt-6">
          <div className="">
            <NewOtpInput {...newProps} />
          </div>
          <div className="border-t border-dashed border-gray-300 mt-6 pt-6 mb-4">
            <PhoneInput {...newProps} />
          </div>
        </div>
      </div>
      <div className="w-full absolute bottom-0 inset-x-0 px-6 max-[375px]:px-4 py-4 bg-white flex items-center justify-center gap-x-4 shadow-top">
        <button
          type="button"
          onClick={() => setCurrentStep(currentStep + 1)}
          className="sm:w-60 w-full rounded-lg bg-blue-600 px-3 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        >
          Verify
        </button>
      </div>
    </>
  );
}
