"use client";
import Image from "next/image";
import Select from "react-select";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import ShowError from "@/components/ShowError";
import { useAuth } from "@/context/AuthProvider";
import { apihelper } from "@/utils/Client";
import { NUMBER_CHECK_REGEX, classNames } from "@/utils/CommonFunc";
import { ToastType, useToast } from "@/hooks/useToast";
import Toast from "@/components/Toast";
import LinearLoader from "@/components/LinearLoader";
import NewOtpInput from "@/components/NewOtpInput";

export default function Login({ params }) {
  const router = useRouter();
  const { toastProp, setToastProp, closeToast } = useToast();
  const { handleLogin, setUser, user } = useAuth();
  const [otpText, setOtpText] = useState("");
  const [otpMessage, setOtpMessage] = useState(null);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState({});
  const [locationList, setLocationList] = useState([]);
  const [formData, setFormData] = useState({
    "notification-method": "aadhaarotp",
    loginId: "",
    location: null,
  });
  const [requestOtp, setRequestOtp] = useState(false);
  const [showLocation, setShowLocation] = useState(false);

  useEffect(() => {
    if (user?.mobileNumber) {
      router.push("/patient");
    }
  }, []);

  useEffect(() => {
    const getOrgnizations = async () => {
      setIsLoading(true);
      const response = await apihelper(
        `patientportal/Login/GetOrganizationList`
      );
      if (response.success) {
        const locationListRes =
          response.success.map(({ organizationName, organizationId }) => {
            return {
              value: organizationId,
              label: organizationName,
            };
          }) || [];
        if (locationListRes.length > 0) {
          const locationId = params?.locationid;
          const locationValid = locationListRes.find(
            (l) => l.label.toLowerCase() === (locationId || "").toLowerCase()
          );
          setShowLocation(!locationValid);
          setFormData({
            ...formData,
            location: locationValid ? locationValid.value : null,
          });
          setLocationList(locationListRes);
        }
      }
      setIsLoading(false);
    };
    if (locationList.length === 0) getOrgnizations();
  }, [locationList, params, formData]);

  const handleSelectChange = useCallback(
    (value, action) => {
      setFormData((prev) => ({ ...prev, [action.name]: value?.value }));
    },
    [setFormData]
  );

  const validateLoginForm = useCallback(() => {
    const errorObj = {};
    if (!formData["phone-number"]) {
      errorObj["phone-number"] = ["Please enter your mobile number"];
    } else if (formData["phone-number"].length !== 10) {
      errorObj["phone-number"] = ["Please enter valid mobile number"];
    }
    if (!NUMBER_CHECK_REGEX.test(formData["phone-number"])) {
      errorObj["phone-number"] = ["Please enter valid mobile number"];
    }
    if (!NUMBER_CHECK_REGEX.test(formData["phone-number"])) {
      errorObj["phone-number"] = ["Please enter valid mobile number"];
    }
    if (!formData["location"]) {
      errorObj["location"] = ["Please select location"];
    }
    setError(errorObj);
    return Object.keys(errorObj).length === 0;
  }, [formData]);

  const handleSendOtp = useCallback(async () => {
    const isValid = validateLoginForm();
    if (!isValid) return;
    setIsLoading(true);
    const response = await apihelper(
      `patientportal/Login/SendOTP/${formData["phone-number"]}/${formData["location"]}`
    );
    if (response.status) {
      setRequestOtp(true);
      setOtpMessage(
        `We just sent an OTP on the Mobile Number ${formData["phone-number"]}. Enter the OTP below to proceed`
      );
      setMinutes(1);
      setSeconds(30);
    } else {
      setToastProp({
        show: true,
        type: ToastType.ERROR,
        header: response?.error?.message || "Something went wrong",
      });
    }
    setIsLoading(false);
  }, [formData, validateLoginForm, setToastProp]);

  const resendOTP = useCallback(async () => {
    setIsLoading(true);
    const response = await apihelper(
      `patientportal/Login/ResendOTP/${formData["phone-number"]}/${formData["location"]}`
    );
    if (response.success) {
      setRequestOtp(true);
      setOtpMessage(
        `We just sent an OTP on the Mobile Number ${formData["phone-number"]}. Enter the OTP below to proceed`
      );
      setMinutes(1);
      setSeconds(30);
    } else {
      setToastProp({
        show: true,
        type: ToastType.ERROR,
        header: response?.error?.message || "Something went wrong",
      });
    }
    setIsLoading(false);
  }, [
    formData,
    setRequestOtp,
    setOtpMessage,
    setMinutes,
    setSeconds,
    setIsLoading,
    setToastProp,
  ]);

  const validateOTP = useCallback(() => {
    if (!otpText || otpText.length < 6) {
      setError({
        ...error,
        ["otp"]: ["Please enter OTP"],
      });
      return null;
    }
    return otpText;
  }, [error, otpText]);

  const verifyOtp = useCallback(async () => {
    const otpValue = validateOTP();
    if (!otpValue) return;
    setIsLoading(true);
    const response = await apihelper("patientportal/Login/VerifyOTP", {
      method: "POST",
      headers: {},
      data: {
        mobileNumber: formData["phone-number"],
        otpValue: otpValue,
        organizationId: formData["location"],
      },
    });
    if (response.status) {
      handleLogin(response?.success?.token);
      setUser({
        mobileNumber: formData["phone-number"],
      });
      router.push("/patient");
    } else {
      setToastProp({
        show: true,
        type: ToastType.ERROR,
        header: response?.error?.message || "Something went wrong",
      });
      if (response?.error?.code === "ExceedOtp") {
        setRequestOtp(false);
        setOtpMessage(false);
        setOtpText("");
        setMinutes(0);
        setSeconds(0);
      }
    }
    setIsLoading(false);
  }, [formData, router, handleLogin, validateOTP, setToastProp, setUser]);

  return (
    <div className="flex flex-col justify-center flex-1 min-h-full">
      {isLoading && <LinearLoader />}
      {toastProp.show && <Toast {...toastProp} closeToast={closeToast} />}
      <div className="auth-banner relative overflow-hidden mx-auto max-w-lg w-full bg-[#00275b] px-6 py-12">
        <Image
          className="w-auto h-16 mx-auto"
          src="/Logo.png"
          alt="Jupiter"
          height={500}
          width={500}
        />
        <div className="relative mt-6">
          <p className="text-lg font-medium text-center text-white">
            Welcome to
          </p>
          <h2 className="mt-2 text-3xl font-bold text-center text-white">
            Jupiter Hospital
          </h2>
        </div>
      </div>

      <div className="w-full max-w-lg px-4 py-8 mx-auto sm:px-6">
        <div className="space-y-6">
          <div>
            <span className="block text-xl font-semibold leading-6 text-gray-800">
              Log In / Register
            </span>
          </div>

          <div className="space-y-4">
            <div className="form-item">
              <label
                htmlFor="phone-number"
                className="block text-sm font-medium leading-6 text-gray-600"
              >
                Mobile Number
              </label>
              <div className="relative mt-2 rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 flex items-center">
                  <label htmlFor="country" className="sr-only">
                    Country
                  </label>
                  <select
                    id="country"
                    name="country"
                    // autoComplete="country"
                    disabled={true}
                    className="h-10 py-0 pl-2 pr-0 text-sm text-gray-500 bg-transparent border-0 rounded-md focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-600"
                  >
                    <option>+91</option>
                  </select>
                </div>
                <input
                  type="text"
                  name="phone-number"
                  onKeyDown={(_event) => {
                    if (
                      _event.code === "Enter" ||
                      _event.code === "NumpadEnter"
                    ) {
                      _event.preventDefault();
                      if (otpMessage) {
                        verifyOtp();
                      } else {
                        handleSendOtp();
                      }
                    }
                  }}
                  id="phone-number"
                  inputMode="numeric"
                  className={classNames(
                    "block w-full rounded-lg border-0 pl-16 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-blue-600 text-sm leading-6 font-medium",
                    error["phone-number"]?.length > 0 &&
                      "ring-2 ring-red-500 focus:ring-red-600"
                  )}
                  placeholder="Enter your mobile number"
                  disabled={otpMessage}
                  maxLength={10}
                  value={formData["phone-number"] || ""}
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      ["phone-number"]: e.target.value,
                    });
                    if (error["phone-number"])
                      setError({ ...error, ["phone-number"]: [] });
                  }}
                />
              </div>
              <ShowError error={error["phone-number"]} />
            </div>
            {showLocation && (
              <div className="form-item">
                <label
                  htmlFor="location"
                  className="block text-sm font-medium leading-6 text-gray-600"
                >
                  Location
                </label>
                <Select
                  options={locationList}
                  className={classNames(
                    "mt-2 basic-single font-normal rounded-lg",
                    error["location"]?.length > 0 &&
                      "ring-2 ring-red-500 focus:ring-red-600"
                  )}
                  isDisabled={otpMessage}
                  placeholder="Select Location"
                  isLoading={isLoading}
                  name="location"
                  value={
                    locationList.find(
                      (l) => l.value === formData["location"]
                    ) || ""
                  }
                  onChange={handleSelectChange}
                />
                <ShowError error={error["location"]} />
              </div>
            )}
          </div>

          {requestOtp && (
            <div className="pt-6 border-t border-gray-300 border-dashed form-item">
              <label
                htmlFor="otp"
                className="block mb-4 text-sm font-medium text-center text-gray-500"
              >
                {otpMessage || "We have sent an OTP to your mobile number"}
              </label>
              <NewOtpInput
                setOtpText={(value) => {
                  setError({ ...error, ["otp"]: [] });
                  setOtpText(value);
                }}
                otpText={otpText}
                otpError={error["otp"]}
                minutes={minutes}
                seconds={seconds}
                setMinutes={setMinutes}
                setSeconds={setSeconds}
                handleResentOTP={resendOTP}
                renderInput={(props) => <input {...props} />}
                renderSeparator={<span>-</span>}
              />
            </div>
          )}

          <div className="sticky bottom-0">
            <button
              type="button"
              disabled={isLoading}
              onClick={!otpMessage ? handleSendOtp : verifyOtp}
              className="w-full rounded-lg bg-blue-600 px-3 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 capitalize"
            >
              {!otpMessage ? `Send OTP` : `Submit`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
