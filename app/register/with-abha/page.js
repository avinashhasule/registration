"use client";
import Consent from "./Consent";
import { AadharAuthentication } from "./AadharAuth";
import { useCallback, useMemo, useState } from "react";
import AbhaCommunication from "./AbhaCommunication";
import AbhaAddress from "./AbhaAddress";
import Toast from "@/components/Toast";
import { ToastType, useToast } from "@/hooks/useToast";
import { apihelper, includeToken } from "@/utils/Client";
import { useRouter } from "next/navigation";
import LinearLoader from "@/components/LinearLoader";
import { usePatient } from "@/context/PatientContext";
import { scrollTo } from "@/utils/CommonFunc";

const steps = {
  0: {
    title: "Consent Collection",
    description: "Create ABHA Number Using Aadhaar Card",
    component: Consent,
    buttonText: "Next",
  },
  1: {
    title: "Aadhaar Authentication",
    description: "Enter OTP to authenticate your Aadhaar",
    component: AadharAuthentication,
    buttonText: "Verify",
  },
  2: {
    title: "ABHA Communication",
    description:
      "This mobile number will be used for all the communications related to ABHA.",
    component: AbhaCommunication,
  },
  3: {
    title: "ABHA Address",
    description: "",
    component: AbhaAddress,
  },
};

function getCurrentStepComp(currentStep) {
  return steps[currentStep].component;
}

export default function Page(props) {
  const patientMRNo = props?.searchParams?.mrno || null;
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const { toastProp, setToastProp, closeToast } = useToast();
  const [otpMessage, setOtpMessage] = useState(null);
  const [verifiedMobileNoOtp, setVerifiedMobileNoOtp] = useState(false);
  const [verifyMobileNo, setVerifyMobileNo] = useState(false);
  const [otpText, setOtpText] = useState("");
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [error, setError] = useState({});
  const [showOtp, setShowOtp] = useState(false);
  const { setCanEditABHAAddress } = usePatient();
  const [isNewABHAAccount, setIsNewABHAAccount] = useState(false);

  const router = useRouter();

  const handleCancel = useCallback(() => {
    router.push("/patient");
  }, [router]);

  const handleCloseToast = useCallback(() => {
    setToastProp({ show: false, header: "", body: "", type: "" });
    closeToast();
  }, [setToastProp, closeToast]);

  const CurrCompoment = useMemo(
    () => getCurrentStepComp(currentStep),
    [currentStep]
  );

  const onOtpChange = (val) => {
    setOtpText(val);
    setError({ ...error, ["otp"]: "" });
  };

  const onInputChange = useCallback(
    (event) => {
      const { name, value } = event.target;
      setFormData({ ...formData, [name]: value });
      setError({ ...error, [name]: "" });
    },
    [error, formData]
  );

  const handleAaadharAuthentication = useCallback(
    (otp, pageNo) => {
      if (verifiedMobileNoOtp) {
        const verifyMobileNoFn = async () => {
          setLoading(true);
          const verifyMobileNoRes = await apihelper(
            `patientportal/abha/verify/mobile/${formData["phoneNumber"]}/${otp}`
          );
          if (verifyMobileNoRes?.success) {
            if (!isNewABHAAccount) {
              setCanEditABHAAddress(true);
              if (patientMRNo) router.push(`/profile?mrno=${patientMRNo}`);
              else router.push("/profile");
            }
            // if (
            //   verifyMobileNoRes?.success?.ABHAProfile?.mobile ===
            //     formData["phoneNumber"] &&
            //   verifyMobileNoRes?.success?.isNew === false &&
            //   verifyMobileNoRes?.success?.message !==
            //     "Account created successfully"
            // ) {
            //   if (patientMRNo) router.push(`/profile?mrno=${patientMRNo}`);
            //   else router.push("/profile");
            // }
            else setCurrentStep(pageNo);
          } else {
            setToastProp({
              show: true,
              header:
                verifyMobileNoRes?.error?.message || "Something went wrong",
              type: ToastType.ERROR,
            });
          }
          setLoading(false);
        };
        verifyMobileNoFn();
      } else {
        const { phoneNumber } = formData;
        let errorMessage = {};
        if (!otp || !phoneNumber) {
          if (!otp) errorMessage = { ...errorMessage, otp: "Please enter OTP" };
          if (!phoneNumber)
            errorMessage = {
              ...errorMessage,
              phoneNumber: "Please enter mobile number",
            };
          setError({ ...error, ...errorMessage });
          return;
        } else if (
          otp &&
          phoneNumber &&
          (phoneNumber.length !== 10 || otp.length !== 6)
        ) {
          if (otp.length !== 6)
            setError({ ...error, ["otp"]: ["Please enter valid OTP"] });
          if (phoneNumber.length !== 10)
            setError({
              ...error,
              ["phoneNumber"]: ["Please enter valid mobile number"],
            });
          return;
        }
        const validateOTP = async () => {
          setLoading(true);
          const response = await apihelper(
            `patientportal/abha/verify/${phoneNumber}/${otp}`
          );
          if (!response?.success) {
            setToastProp({
              show: true,
              header: response?.error?.message || "Something went wrong",
              type: ToastType.ERROR,
            });
            setLoading(false);
            return;
          }
          if (
            response?.success?.abhaProfile?.mobile !== phoneNumber ||
            response?.success?.abhaProfile?.mobile === null
          ) {
            setIsNewABHAAccount(response?.success?.isNew);
            setVerifyMobileNo(true);
            setLoading(false);
            setOtpMessage("");
            setOtpText("");
            setFormData((prev) => ({
              ...prev,
              ["phoneNumber"]: phoneNumber,
            }));
            setCurrentStep(pageNo);
            return;
          } else {
            if (
              response?.success?.abhaProfile?.mobile === phoneNumber &&
              response?.success?.isNew === false &&
              response?.success?.message !== "Account created successfully"
            ) {
              setCanEditABHAAddress(true);
              if (patientMRNo) router.push(`/profile?mrno=${patientMRNo}`);
              else router.push("/profile");
              setLoading(false);
            } else setCurrentStep(pageNo + 1);
          }
        };
        validateOTP();
      }
    },
    [
      error,
      formData,
      router,
      setToastProp,
      verifiedMobileNoOtp,
      patientMRNo,
      setCanEditABHAAddress,
      setIsNewABHAAccount,
      isNewABHAAccount,
    ]
  );

  const handleResentOTP = () => {
    const updateMobileNo = async () => {
      const { phoneNumber } = formData;
      if (!phoneNumber) {
        if (!phoneNumber)
          setError({ ...error, phoneNumber: ["Please enter mobile number"] });
        return;
      } else if (phoneNumber && phoneNumber.length !== 10) {
        if (!phoneNumber)
          setError({ ...error, phoneNumber: ["Please enter mobile number"] });
        return;
      }
      setLoading(true);
      const reqRes = await apihelper(
        `patientportal/abha/request/mobile/${phoneNumber}`
      );
      setLoading(false);
      if (reqRes?.success) {
        setOtpMessage(reqRes?.success?.message);
        setVerifiedMobileNoOtp(true);
        setShowOtp(true);
        setSeconds(30);
        setMinutes(1);
        // setCurrentStep(pageNo);
      } else {
        setToastProp({
          show: true,
          header: reqRes?.error?.message || "Something went wrong",
          type: ToastType.ERROR,
        });
      }
    };
    updateMobileNo();
  };

  const onOTPResend = () => {
    let { aadharno = "" } = formData;
    aadharno = aadharno.replaceAll(" ", "");
    if (currentStep === 1) {
      requestOTP(aadharno, 1);
    } else {
      handleResentOTP();
    }
  };

  //// 1 SEND OTP TO ADHAR NO
  const requestOTP = async (adharNo, pageNo) => {
    setLoading(true);
    const response = await apihelper(`patientportal/abha/request/${adharNo}`);
    if (response?.success) {
      if (response?.success?.token && includeToken)
        window.localStorage.setItem(
          "patient-portal-token",
          JSON.stringify(response.success.token)
        );
      setOtpMessage(response?.success?.message);
      setMinutes(1);
      setSeconds(30);
      setCurrentStep(pageNo);
    } else {
      setToastProp({
        show: true,
        header: response?.error?.message || "Something went wrong",
        type: ToastType.ERROR,
      });
    }
    setLoading(false);
  };

  function validateAndSetCurrentStep(pageNo) {
    let error = false;
    switch (currentStep) {
      case 0:
        let {
          aadharno = "",
          agreed1,
          agreed2,
          agreed3,
          agreed4,
          agreed5,
          agreed6,
        } = formData;
        aadharno = aadharno.replaceAll(" ", "");
        let errorMessage = {};
        if (
          !aadharno ||
          aadharno.length !== 12 ||
          !agreed1 ||
          !agreed2 ||
          !agreed3 ||
          !agreed4 ||
          !agreed5 ||
          !agreed6
        ) {
          error = true;

          if (!aadharno) {
            errorMessage = {
              ...errorMessage,
              aadharno: "Please enter Aadhaar number",
            };
          }
          if (aadharno.length && aadharno.length !== 12) {
            errorMessage = {
              ...errorMessage,
              aadharno: "Please enter valid Aadhaar number",
            };
          }

          if (!agreed1) {
            errorMessage = {
              ...errorMessage,
              agreed1: "Please accept all terms and conditions",
            };
          }

          if (!agreed2) {
            errorMessage = {
              ...errorMessage,
              agreed2: "Please accept all terms and conditions",
            };
          }
          if (!agreed3) {
            errorMessage = {
              ...errorMessage,
              agreed3: "Please accept all terms and conditions",
            };
          }
          if (!agreed4) {
            errorMessage = {
              ...errorMessage,
              agreed4: "Please accept all terms and conditions",
            };
          }
          if (!agreed5) {
            errorMessage = {
              ...errorMessage,
              agreed5: "Please accept all terms and conditions",
            };
          }
          if (!agreed6) {
            errorMessage = {
              ...errorMessage,
              agreed6: "Please accept all terms and conditions",
            };
          }
          setError({
            ...error,
            ...errorMessage,
          });
          if (
            Object.keys({
              ...error,
              ...errorMessage,
            }).length > 0
          ) {
            scrollTo({
              ...error,
              ...errorMessage,
            });
          }
          return;
        } else {
          requestOTP(aadharno, pageNo);
        }
        break;

      case 1:
        const otpNew = Object.values(otpText).join("") || "";
        handleAaadharAuthentication(otpNew, pageNo);
        break;
      case 2:
        const tempOtp = { ...otpText };
        const otp = Object.values(tempOtp).join("") || "";

        if (!otp || otp.length !== 6) {
          error = true;
          setError({
            ...error,
            ["otp"]: ["Please enter valid OTP"],
          });
          return;
        } else {
          handleAaadharAuthentication(otp, pageNo);
        }
        break;

      default:
        break;
    }
  }

  return (
    <div className="flex flex-col justify-between min-h-[calc(100vh-53px)] relative overflow-hidden pt-20 bg-white">
      <div className="max-h-[calc(100vh-210px)] internal-scroll overflow-auto px-6 max-[375px]:px-4 pb-2">
        <div className="max-w-lg w-full mx-auto">
          {loading && <LinearLoader />}
          {toastProp.show && (
            <Toast {...toastProp} closeToast={handleCloseToast} />
          )}
          <CurrCompoment
            handleCancel={handleCancel}
            currentStep={currentStep}
            onChange={onInputChange}
            handleResentOTP={onOTPResend}
            formData={formData}
            setCurrentStep={validateAndSetCurrentStep}
            setLoading={setLoading}
            otpMessage={otpMessage}
            disabled={loading}
            verifyMobileNo={verifyMobileNo}
            setToastProp={setToastProp}
            otpText={otpText}
            setOtpText={onOtpChange}
            seconds={seconds}
            minutes={minutes}
            error={error}
            showOtp={showOtp}
            otpError={error["otp"]}
            setSeconds={setSeconds}
            setMinutes={setMinutes}
            patientMRNo={patientMRNo}
          />
        </div>
      </div>
    </div>
  );
}
