import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import ShowError from "./ShowError";
import { classNames } from "@/utils/CommonFunc";

// type AllowedInputTypes = 'password' | 'text' | 'number' | 'tel';

const isStyleObject = (obj) => typeof obj === "object" && obj !== null;

const NewOtpInput = ({
  otpText = "",
  numInputs = 6,
  setOtpText = () => {},
  onPaste,
  renderInput = (props) => <input {...props} />,
  shouldAutoFocus = false,
  inputType = "number",
  renderSeparator = <span>-</span>,
  placeholder,
  containerStyle,
  otpError,
  seconds,
  minutes,
  setSeconds,
  setMinutes,
  handleResentOTP,
}) => {
  const [activeInput, setActiveInput] = useState(0);
  const inputRefs = useRef([]);

  const getOTPValue = () => (otpText ? otpText.toString().split("") : []);

  const isInputNum = inputType === "number" || inputType === "tel";

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

  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, numInputs);
  }, [numInputs]);

  useEffect(() => {
    if (shouldAutoFocus) {
      inputRefs.current[0]?.focus();
    }
  }, [shouldAutoFocus]);

  const getPlaceholderValue = () => {
    if (typeof placeholder === "string") {
      if (placeholder.length === numInputs) {
        return placeholder;
      }

      if (placeholder.length > 0) {
        console.error(
          "Length of the placeholder should be equal to the number of inputs."
        );
      }
    }
    return undefined;
  };

  const isInputValueValid = (value) => {
    const isTypeValid = isInputNum
      ? !isNaN(Number(value))
      : typeof value === "string";
    return isTypeValid && value.trim().length === 1;
  };

  const handleChange = (event) => {
    const { value } = event.target;

    if (isInputValueValid(value)) {
      changeCodeAtFocus(value);
      focusInput(activeInput + 1);
    }
  };

  const handleInputChange = (event) => {
    const { nativeEvent } = event;
    const value = event.target.value;

    if (!isInputValueValid(value)) {
      // Pasting from the native autofill suggestion on a mobile device can pass
      // the pasted string as one long input to one of the cells. This ensures
      // that we handle the full input and not just the first character.
      if (value.length === numInputs) {
        const hasInvalidInput = value
          .split("")
          .some((cellInput) => !isInputValueValid(cellInput));
        if (!hasInvalidInput) {
          handleOTPChange(value.split(""));
          focusInput(numInputs - 1);
        }
      }

      if (
        nativeEvent.data === null &&
        nativeEvent.inputType === "deleteContentBackward"
      ) {
        event.preventDefault();
        changeCodeAtFocus("");
        focusInput(activeInput - 1);
      }

      // Clear the input if it's not valid value because firefox allows
      // pasting non-numeric characters in a number type input
      event.target.value = "";
    }
  };

  const handleFocus = (event) => (index) => {
    setActiveInput(index);
    event.target.select();
  };

  const handleBlur = () => {
    setActiveInput(activeInput - 1);
  };

  const handleKeyDown = (event) => {
    const otp = getOTPValue();
    if ([event.code, event.key].includes("Backspace")) {
      event.preventDefault();
      changeCodeAtFocus("");
      focusInput(activeInput - 1);
    } else if (event.code === "Delete") {
      event.preventDefault();
      changeCodeAtFocus("");
    } else if (event.code === "ArrowLeft") {
      event.preventDefault();
      focusInput(activeInput - 1);
    } else if (event.code === "ArrowRight") {
      event.preventDefault();
      focusInput(activeInput + 1);
    }
    // React does not trigger onChange when the same value is entered
    // again. So we need to focus the next input manually in this case.
    else if (event.key === otp[activeInput]) {
      event.preventDefault();
      focusInput(activeInput + 1);
    } else if (
      event.code === "Spacebar" ||
      event.code === "Space" ||
      event.code === "ArrowUp" ||
      event.code === "ArrowDown"
    ) {
      event.preventDefault();
    }
  };

  const focusInput = (index) => {
    const activeInput = Math.max(Math.min(numInputs - 1, index), 0);

    if (inputRefs.current[activeInput]) {
      inputRefs.current[activeInput]?.focus();
      inputRefs.current[activeInput]?.select();
      setActiveInput(activeInput);
    }
  };

  const changeCodeAtFocus = (value) => {
    const otp = getOTPValue();
    otp[activeInput] = value[0];
    handleOTPChange(otp);
  };

  const handleOTPChange = (otp) => {
    const otpValue = otp.join("");
    setOtpText(otpValue);
  };

  const handlePaste = (event) => {
    event.preventDefault();

    const otp = getOTPValue();
    let nextActiveInput = activeInput;

    // Get pastedData in an array of max size (num of inputs - current position)
    const pastedData = event.clipboardData
      .getData("text/plain")
      .slice(0, numInputs - activeInput)
      .split("");

    // Prevent pasting if the clipboard data contains non-numeric values for number inputs
    if (isInputNum && pastedData.some((otpText) => isNaN(Number(otpText)))) {
      return;
    }

    // Paste data from focused input onwards
    for (let pos = 0; pos < numInputs; ++pos) {
      if (pos >= activeInput && pastedData.length > 0) {
        otp[pos] = pastedData.shift() ?? "";
        nextActiveInput++;
      }
    }

    focusInput(nextActiveInput);
    handleOTPChange(otp);
  };

  return (
    <>
      <div
        style={Object.assign(
          {
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "4px",
            color: "#575757",
          },
          isStyleObject(containerStyle) && containerStyle
        )}
        className={
          typeof containerStyle === "string" ? containerStyle : undefined
        }
        onPaste={onPaste}
      >
        {Array.from({ length: numInputs }, (_, index) => index).map((index) => (
          <Fragment key={index}>
            {renderInput(
              {
                value: getOTPValue()[index] ?? "",
                placeholder: getPlaceholderValue()?.[index] ?? undefined,
                ref: (element) => (inputRefs.current[index] = element),
                onChange: handleChange,
                onFocus: (event) => handleFocus(event)(index),
                onBlur: handleBlur,
                onKeyDown: handleKeyDown,
                onPaste: handlePaste,
                autoComplete: "off",
                "aria-label": `Please enter OTP character ${index + 1}`,
                className:
                  "input-otp text-center text-sm font-medium rounded-lg text-gray-900 shadow-sm leading-6 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-500 focus:ring-2 p-2 focus:ring-inset focus:ring-blue-600 min-[480px]:w-[48px] min-[480px]:h-12 w-[40px] h-10",
                type: inputType,
                inputMode: isInputNum ? "numeric" : "text",
                onInput: handleInputChange,
              },
              index
            )}
            {index < numInputs - 1 &&
              (typeof renderSeparator === "function"
                ? renderSeparator(index)
                : renderSeparator)}
          </Fragment>
        ))}
      </div>
      <div className="pl-4 text-center">
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
    </>
  );
};

// export type { OTPInputProps, InputProps, AllowedInputTypes };
export default NewOtpInput;
