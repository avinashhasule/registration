"use client";
import { ExclamationCircleIcon } from "@/components/Icons";
import ShowError from "@/components/ShowError";
import { classNames } from "@/utils/CommonFunc";
import { ViewEyeIcon, HideEyeSlashIcon } from "@/components/Icons";
import { useState } from "react";

export function AadharInput(props) {
  const [showAadhaar, setShowAadhaar] = useState(true);
  const {
    label = "Aadhaar Number",
    placeholder = "0000 0000 0000",
    className,
    description = "Please ensure that mobile number is linked with Aadhaar as it will be required for OTP authentication.",
    value = "",
    onChange,
    formData = {},
    error,
  } = props;

  return (
    <div className="border-b border-dashed border-gray-300 mb-6 pb-6">
      <label
        htmlFor="aadharno"
        className="block text-sm font-medium leading-6 text-gray-600"
      >
        {label}
      </label>
      <div className="relative mt-2">
        <div className="form-item relative">
          <input
            type="aadharno"
            name="aadharno"
            inputMode="numeric"
            id="aadharno"
            className={classNames(
              "block w-full rounded-lg border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-blue-600 text-sm leading-6 font-medium",
              error.aadharno &&
                "ring-2 ring-red-500 focus:ring-red-600 rounded-lg",
              showAadhaar && "pw"
            )}
            placeholder={placeholder}
            value={
              showAadhaar && formData["aadharno"]
                ? formData["aadharno"].replaceAll(" ", "")
                : formData["aadharno"]
            }
            onChange={(e) => {
              onChange({
                target: {
                  name: "aadharno",
                  value: e.target.value
                    .replace(/\D/g, "")
                    .split(/(?:([\d]{4}))/g)
                    .filter((s) => s.length > 0)
                    .join(" "),
                },
              });
            }}
            maxLength={showAadhaar ? 12 : 14}
            aria-invalid="true"
            aria-describedby="aadharno-error"
          />
          <div className="text-gray-500 cursor-pointer absolute inset-y-0 right-0 flex items-center pr-3 icon-20">
            {showAadhaar && (
              <button onClick={() => setShowAadhaar(false)}>
                <HideEyeSlashIcon className="h-5 w-5" aria-hidden="true" />
              </button>
            )}
            {!showAadhaar && (
              <button onClick={() => setShowAadhaar(true)}>
                <ViewEyeIcon className="h-5 w-5" aria-hidden="true" />
              </button>
            )}
          </div>
        </div>
        <ShowError error={[error.aadharno]} />
      </div>
      {description && (
        <p className="flex gap-2 mt-3 text-sm text-blue-600" id="email-error">
          <span className="text-blue-600 icon-20">
            <ExclamationCircleIcon className="" aria-hidden="true" />
          </span>
          {description}
        </p>
      )}
    </div>
  );
}
