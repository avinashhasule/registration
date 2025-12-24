"use client";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { ABHA_METHODS, LOGIN_METHOD_LIST } from "@/utils/Constant";
import { ToastType, useToast } from "@/hooks/useToast";
import { apihelper, includeToken } from "@/utils/Client";
import { classNames, getOTPMessage } from "@/utils/CommonFunc";
import Toast from "@/components/Toast";
import ShowError from "@/components/ShowError";
import PhoneInput from "@/components/PhoneInput";
import OTPInput from "@/components/OTPInput";
import NotificationMethod from "./NotificationMethod";
import VerificationMethod from "./VerificationMethod";
import { useRouter } from "next/navigation";
import { ABHAAccount } from "./ABHAAccount";
import LinearLoader from "@/components/LinearLoader";
import NewOtpInput from "@/components/NewOtpInput";

export default function Verify(props) {
  const router = useRouter();
  const abhaExtn = process.env.NEXT_PUBLIC_ABHA_ADDRESS_SUFFIX;
  const [formData, setFormData] = useState({
    "notification-method": "aadhaarotp",
    abhaAddNo: "abhaaddress",
    loginId: "",
  });
  const [otpMessage, setOtpMessage] = useState(null);
  const [selectedLoginMethod, setSelectedLoginMethod] = useState(
    LOGIN_METHOD_LIST[0]
  );
  const [error, setError] = useState({});
  const [showLoader, setShowLoader] = useState(false);
  const { toastProp, setToastProp, closeToast } = useToast();
  const [multipleAccounts, setMultipleAccounts] = useState([]);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [otpText, setOtpText] = useState("");
  const [otpAttempts, setOtpAttempts] = useState(0);

  useEffect(() => {
    setError({
      ...error,
      ["otp"]: "",
    });
  }, [otpText]);

  useEffect(() => {
    setFormData({
      ...formData,
      ["loginId"]: "",
    });
    setError({
      ...error,
      ["loginId"]: "",
    });
  }, [formData.abhaAddNo]);

  useEffect(() => {
    setFormData({ ...formData, loginId: "", abhaAddNo: "abhaaddress" });
  }, [selectedLoginMethod]);

  const handleCloseToast = useCallback(() => {
    setToastProp({ show: false, header: "", body: "", type: "" });
    closeToast();
  }, [setToastProp, closeToast]);

  useEffect(() => {
    setError({});
  }, [selectedLoginMethod]);

  const handleInputChange = useCallback(
    (event) => {
      const { name, value } = event.target;
      setFormData({ ...formData, [name]: value });
      setError({ ...error, [name]: "" });
    },
    [formData, error]
  );

  const redirectToProfile = useCallback(() => {
    if (props?.searchParams?.mrno)
      router.push(`/profile?mrno=${props?.searchParams?.mrno}`);
    else router.push("/profile");
  }, [router, props?.searchParams?.mrno]);

  const handleVerifyUser = useCallback(
    async (ABHANumber) => {
      if (!showLoader) setShowLoader(true);
      const response = await apihelper(
        `patientportal/ABHA/verification/userprofile/${ABHANumber}`
      );
      if (!response?.code) {
        redirectToProfile();
      } else {
        setFormData({
          aadhaarnumber: "",
          "notification-method": "aadhaarotp",
        });
        setOtpMessage(null);
        setToastProp({
          show: true,
          header: response?.error?.message || "Something went wrong",
          type: ToastType.ERROR,
        });
        setShowLoader(false);
      }
    },
    [setToastProp, setFormData, showLoader, redirectToProfile]
  );

  const onResentOTP = () => {
    if (otpAttempts < 2) {
      setOtpAttempts(otpAttempts + 1);
      requestOTP();
    }
  };

  const requestOTP = useCallback(async () => {
    let logErr = null;

    const dt = formData["loginId"];
    const abhaAdd = /^(?![_\.])[a-zA-Z0-9]+(?:[_\.][a-zA-Z0-9]+)*(?<![_\.])$/;
    const abhaNum = /^[0-9]*$/;
    if (!dt) {
      logErr =
        selectedLoginMethod.title === LOGIN_METHOD_LIST[1].title
          ? ["Please Enter Mobile number"]
          : [
              `Please Enter ${
                formData["abhaAddNo"] === "abhanumber"
                  ? "ABHA Number"
                  : "ABHA Address"
              }`,
            ];
    } else {
      if (
        selectedLoginMethod.title === LOGIN_METHOD_LIST[1].title &&
        (dt.length !== 10 || !abhaNum.test(dt))
      ) {
        logErr = ["Please Enter Valid Mobile Number"];
      } else {
        if (
          selectedLoginMethod.title === LOGIN_METHOD_LIST[0].title &&
          formData["abhaAddNo"] === "abhanumber" &&
          (!abhaNum.test(dt.replaceAll("-", "")) ||
            dt.replaceAll("-", "").length !== 14)
        ) {
          logErr = ["Please Enter Valid ABHA Number"];
        } else {
          if (
            formData["abhaAddNo"] === "abhaaddress" &&
            (dt.length > 18 || dt.length < 8)
          ) {
            logErr = [
              "Minimum length - 8 characters and Maximum length - 18 characters",
            ];
          } else if (
            formData["abhaAddNo"] === "abhaaddress" &&
            !abhaAdd.test(dt)
          ) {
            logErr = [
              "Special characters allowed - 1 dot (.) and/or 1 underscore (_) and cannot be in the beginning or at the end",
            ];
          }
        }
      }
    }
    if (logErr) {
      setError({ ...error, ["loginId"]: logErr });
      return;
    }
    setShowLoader(true);
    const response =
      selectedLoginMethod.title === LOGIN_METHOD_LIST[1].title
        ? await apihelper(
            `patientportal/ABHA/verification/request/abhamobile/${dt}`
          )
        : await apihelper(
            `patientportal/ABHA/verification/request/${
              formData["notification-method"]
            }/${formData["abhaAddNo"] === "abhanumber" ? dt : dt + abhaExtn}`
          );
    if (response.status) {
      setOtpMessage(
        getOTPMessage(
          formData["notification-method"],
          response?.success?.message
        )
      );
      if (response?.success?.token && includeToken)
        window.localStorage.setItem(
          "patient-portal-token",
          JSON.stringify(response.success.token)
        );
      setMinutes(1);
      setSeconds(30);
    } else {
      setFormData({
        ...formData,
        loginId: "",
        "notification-method": "aadhaarotp",
      });
      setOtpMessage(null);
      setToastProp({
        show: true,
        header: `${response?.error?.message}` || "Something went wrong",
        type: ToastType.ERROR,
      });
    }
    setShowLoader(false);
  }, [formData, selectedLoginMethod.title, abhaExtn, error, setToastProp]);

  const validateOTP = useCallback(async () => {
    const otp = Object.values(otpText).join("") || "";

    if (!otp || otp.length !== 6) {
      setError({
        ...error,
        ["otp"]: ["Please enter OTP"],
      });
      return;
    }
    setShowLoader(true);
    const response =
      selectedLoginMethod.title === LOGIN_METHOD_LIST[1].title
        ? await apihelper(
            `patientportal/ABHA/verification/otp/abhamobile/${
              formData["loginId"]
            }/${Object.values(otpText).join("")}`
          )
        : await apihelper(
            `patientportal/ABHA/verification/otp/${
              formData["notification-method"]
            }/${
              formData["abhaAddNo"] === "abhanumber"
                ? formData["loginId"]
                : formData["loginId"] + abhaExtn
            }/${Object.values(otpText).join("")}`
          );

    if (response.status) {
      if (selectedLoginMethod.title === LOGIN_METHOD_LIST[0].title) {
        redirectToProfile();
        return;
      }
      if (Array.isArray(response.success?.accounts)) {
        if (response.success?.accounts.length > 0) {
          if (response.success?.accounts.length === 1) {
            handleVerifyUser(response.success?.accounts[0]?.abhaNumber);
          } else {
            setMultipleAccounts(response.success?.accounts);
            setShowLoader(false);
          }
          return;
        }
      }
      if (
        !response.success?.code &&
        (response.success?.authResult || "") !== "failed"
      ) {
        setShowLoader(false);
        redirectToProfile();
        return;
      }
    } else {
      setShowLoader(false);
      // setFormData({
      //   aadhaarnumber: "",
      //   "notification-method": "aadhaarotp",
      // });
      // setOtpText({});
      // setOtpMessage(null);
      // setMultipleAccounts([]);
      setToastProp({
        show: true,
        header: response?.error?.message || "Something went wrong",
        type: ToastType.ERROR,
      });
    }
  }, [
    otpText,
    selectedLoginMethod.title,
    formData,
    abhaExtn,
    error,
    redirectToProfile,
    handleVerifyUser,
    setToastProp,
  ]);

  if (multipleAccounts.length > 0) {
    return (
      <>
        {showLoader && <LinearLoader />}
        {toastProp.show && (
          <Toast {...toastProp} closeToast={handleCloseToast} />
        )}
        <ABHAAccount
          multipleAccounts={multipleAccounts}
          handleVerifyUser={handleVerifyUser}
          showLoader={showLoader}
        />
      </>
    );
  }

  return (
    <>
      {showLoader && <LinearLoader />}
      {toastProp.show && <Toast {...toastProp} closeToast={handleCloseToast} />}
      <div className="flex flex-col justify-between min-h-[calc(100vh-53px)] relative overflow-hidden pt-20 bg-white">
        <div className="max-h-[calc(100vh-210px)] internal-scroll overflow-auto px-6 max-[375px]:px-4 pb-2">
          <div className="max-w-lg w-full mx-auto">
            <div className="mt-4 mb-4">
              <Image
                width={440}
                height={440}
                src={otpMessage ? "/verify_otp_img.svg" : "/verify_img.svg"}
                alt={otpMessage ? "/verify_otp_img.svg" : "/verify_img.svg"}
                className="mx-auto"
              />
            </div>
            <div className="">
              <h1 className="text-lg md:text-xl font-semibold text-gray-800">
                Verify ABHA
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Download or View ABHA Card
              </p>
              <div className="mt-6">
                <div className="">
                  <VerificationMethod
                    selectedLoginMethod={selectedLoginMethod}
                    setSelectedLoginMethod={setSelectedLoginMethod}
                    otpMessage={otpMessage}
                  />
                </div>
                {selectedLoginMethod.title === LOGIN_METHOD_LIST[0].title && (
                  <>
                    <div className="mb-4">
                      <div className="flex items-center space-x-2">
                        {ABHA_METHODS.map((notificationMethod) => (
                          <div
                            key={notificationMethod.id}
                            className="relative flex items-center"
                          >
                            <input
                              id={notificationMethod.id}
                              name="abhaAddNo"
                              type="radio"
                              value={notificationMethod.id}
                              checked={
                                formData["abhaAddNo"] === notificationMethod.id
                              }
                              onChange={() => {
                                if (otpMessage) return;
                                setFormData({
                                  ...formData,
                                  abhaAddNo: notificationMethod.id,
                                });
                              }}
                              className="relative rounded border-gray-300 text-blue-600 hidden"
                            />
                            <label
                              htmlFor={notificationMethod.id}
                              className={`verify-item text-center block text-sm font-medium p-3 border border-b-0 rounded-t-lg cursor-pointer leading-none ${
                                formData["abhaAddNo"] === notificationMethod.id
                                  ? "border-blue-600 bg-blue-600 text-white "
                                  : "text-gray-700 bg-gray-100"
                              }`}
                            >
                              {notificationMethod.title}
                            </label>
                          </div>
                        ))}
                      </div>
                      <div className="p-4 border rounded-tl-none border-gray-300 rounded-lg">
                        <label
                          htmlFor="loginId"
                          className="block text-sm font-medium leading-6 text-gray-600"
                        >
                          {formData["abhaAddNo"] === "abhaaddress"
                            ? "Please Enter Your ABHA Address"
                            : "Please Enter Your ABHA Number"}
                        </label>
                        <div className="mt-2 form-item flex items-center ring-1 rounded-lg ring-inset ring-gray-300">
                          <input
                            type="text"
                            name="loginId"
                            id="loginId"
                            maxLength={
                              formData["abhaAddNo"] === "abhaaddress" ? 18 : 18
                            }
                            disabled={otpMessage ? true : false}
                            value={formData["loginId"] || ""}
                            onChange={handleInputChange}
                            placeholder={
                              formData["abhaAddNo"] === "abhaaddress"
                                ? "ABHA Address"
                                : "ABHA Number"
                            }
                            className={`block w-full rounded-lg border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-blue-600 text-sm leading-6 font-medium ${
                              formData["abhaAddNo"] === "abhaaddress"
                                ? "rounded-e-none"
                                : ""
                            }`}
                          />
                          {formData["abhaAddNo"] === "abhaaddress" && (
                            <span className="rounded-lg rounded-s-none select-none items-center px-2 text-gray-500 text-sm font-medium outline-none">
                              {abhaExtn}
                            </span>
                          )}
                        </div>
                        <ShowError error={error["loginId"]} />
                        <NotificationMethod
                          formData={formData}
                          setFormData={setFormData}
                          otpMessage={otpMessage}
                        />
                      </div>
                    </div>
                  </>
                )}
                {selectedLoginMethod.title === LOGIN_METHOD_LIST[1].title && (
                  <div className="form-item mb-6">
                    {/* <PhoneInput
                      type="number"
                      name="loginId"
                      id="loginId"
                      disabled={otpMessage ? true : false}
                     
                      error={error["loginId"]}
                    /> */}

                    <>
                      <label
                        htmlFor="phone-number"
                        className="block text-sm font-medium leading-6 text-gray-600"
                      >
                        Mobile Number
                      </label>
                      <div className="relative mt-2">
                        <div className="absolute top-0 left-0 flex items-center">
                          <label htmlFor="country" className="sr-only">
                            Country
                          </label>
                          <select
                            id="country"
                            name="country"
                            // autoComplete="country"
                            disabled={true}
                            className="h-10 rounded-md border-0 bg-transparent py-0 pl-2 pr-0 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-600 text-sm"
                          >
                            <option>+91</option>
                          </select>
                        </div>
                        <input
                          type="text"
                          name={"loginId"}
                          maxLength={10}
                          id={"loginId"}
                          inputMode="numeric"
                          value={formData["loginId"] || ""}
                          onChange={handleInputChange}
                          className={classNames(
                            "block w-full rounded-lg border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-blue-600 text-sm leading-6 font-medium pl-16",
                            error["loginId"] &&
                              "ring-2 ring-red-500 focus:ring-red-600 rounded-lg"
                          )}
                          placeholder="Mobile Number"
                        />
                        <ShowError error={error["loginId"]} />
                      </div>
                    </>
                  </div>
                )}
                {otpMessage && (
                  <div className="border-t border-dashed border-gray-300 pt-6">
                    <label className="block pb-4 font-normal text-sm text-gray-500">
                      {otpMessage}
                    </label>
                    {/* <OTPInput
                      handleResentOTP={onResentOTP}
                      handleOTP={(value) => {
                        setFormData({ ...formData, otp: value });
                      }}
                      otpError={error["otp"]}
                      minutes={minutes}
                      seconds={seconds}
                      setMinutes={setMinutes}
                      setSeconds={setSeconds}
                      otpText={otpText}
                      setOtpText={setOtpText}
                    /> */}
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
                      handleResentOTP={onResentOTP}
                    />
                  </div>
                )}
              </div>
            </div>
            <div className="w-full absolute bottom-0 inset-x-0 px-6 max-[375px]:px-4 py-4 bg-white flex items-center justify-center gap-x-4 shadow-top">
              <button
                type="button"
                className="sm:w-60 w-full rounded-lg bg-white ring-1 ring-gray-300 active:bg-gray-100 px-3 py-2.5 text-sm font-semibold 
                  text-gray-700 hover:shadow-sm gap-1.5 icon-20"
                onClick={() => router.push("/patient")}
                disabled={showLoader}
              >
                Cancel
              </button>
              <button
                type="button"
                className="sm:w-60 w-full rounded-lg bg-blue-600 px-3 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                onClick={otpMessage ? validateOTP : requestOTP}
                disabled={showLoader}
              >
                {otpMessage ? "Verify" : "Submit"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
