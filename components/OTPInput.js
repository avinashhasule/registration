"use client";
import { classNames } from "@/utils/CommonFunc";
import { useEffect, useMemo, useRef } from "react";
import ShowError from "./ShowError";

export default function OTPInput({
  otpLength = 6,
  handleResentOTP,
  otpError,
  seconds,
  minutes,
  setSeconds,
  setMinutes,
  otpText,
  setOtpText,
}) {
  const otpInputs = useMemo(() => {
    return new Array(otpLength).fill(0);
  }, [otpLength]);
  const inputRef = useRef([]);

  useEffect(() => {
    inputRef.current[0].focus();
  }, []);

  useEffect(() => {
    if (seconds || minutes) {
      const interval = setInterval(() => {
        if (seconds > 0) {
          setSeconds(seconds - 1);
        }

        if (seconds === 0) {
          if (minutes === 0) {
            clearInterval(interval);
          } else {
            setSeconds(59);
            setMinutes(minutes - 1);
          }
        }
      }, 1000);

      return () => {
        clearInterval(interval);
      };
    }
  }, [minutes, seconds, setSeconds, setMinutes]);

  const inputfocus = (elmnt) => {
    if (elmnt.key === "Delete" || elmnt.key === "Backspace") {
      const next = elmnt.target.tabIndex - 2;
      if (next > -1) {
        inputRef.current[next].focus();
      }
    } else {
      const next = elmnt.target.tabIndex;
      if (next <= 5) {
        inputRef.current[next].focus();
      }
    }
  };

  return (
    <div className="flex flex-col mb-4">
      <div className="text-center"></div>
      <div className="w-full flex flex-row items-center gap-2.5 min-[380px]:gap-4 justify-center otpcontainer">
        {otpInputs.map((data, index) => {
          return (
            <div className="" key={`${index}`}>
              <input
                className={classNames(
                  "w-10 h-10 min-[435px]:w-12 min-[435px]:h-12 min-[480px]:w-14 min-[480px]:h-14 block rounded-lg border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-blue-600 text-base text-center font-medium",
                  otpError &&
                  !otpText[`otp${index}`] &&
                  "ring-2 ring-red-500 focus:ring-red-600 rounded-lg"
                )}
                // autocomplete="off"
                type="text"
                ref={(el) => (inputRef.current[index] = el)}
                value={otpText[`${index}`] || ""}
                name={`${index}`}
                id={`${index}`}
                inputMode="numeric"
                tabIndex={index + 1}
                maxLength="1"
                onChange={(e) => {
                  setOtpText({ ...otpText, [`${index}`]: e.target.value });
                }}
                onPaste={(e) => {
                  e.preventDefault();
                  const paste = e.clipboardData.getData("text");
                  const otp = paste.split("");
                  let otpObj = {};
                  otp.forEach((data, index) => {
                    otpObj[index] = data;
                  });
                  inputRef.current[otp.length - 1].focus();
                  setOtpText(otpObj);
                }}
                onKeyUp={(e) => inputfocus(e)}
              />
            </div>
          );
        })}
      </div>
      <div className="text-center">
        <ShowError error={[otpError]} />
      </div>

      <div className="mt-4 flex flex-row flex-wrap justify-center items-center space-x-1 text-gray-500">
        <p className="text-sm font-normal">Didn&apos;t recieve OTP?</p>
        {seconds !== 0 && (
          <div className="text-sm font-normal text-gray-500">
            <span className="font-semibold text-blue-600">
              {`${minutes.toString().padStart(2, "0")}:${seconds
                .toString()
                .padStart(2, "0")}`}
            </span>
            <span className="p-1 font-normal text-grey-500">remaining</span>
          </div>
        )}
        <div className="font-semibold text-sm">
          <button
            type="button"
            className={classNames(
              seconds !== 0 &&
              minutes !== 0 &&
              "font-semibold text-sm text-grey-500 disabled:opacity-50 cursor-not-allowed",
              seconds === 0 &&
              minutes === 0 &&
              "font-semibold text-sm text-blue-600 hover:text-blue-700 cursor-pointer"
            )}
            disabled={seconds !== 0}
            onClick={handleResentOTP}
          // onClick={() => { setMinutes(1); seconds(30); handleVerifyMobileOtpNo() }}
          >
            Resend OTP
          </button>
        </div>
      </div>
    </div>
  );
}
