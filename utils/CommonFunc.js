import { CalenderIcon } from "@/components/Icons";
import moment from "moment";
import { forwardRef } from "react";

export function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export const blobToByteArray = async (blob) => {
  const arrayBuffer = await blob.arrayBuffer();
  return new Uint8Array(arrayBuffer);
};

export function blobToBase64(blob) {
  return new Promise((resolve, _) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.readAsDataURL(blob);
  });
}

export const getGender = (val) => {
  if (val === "M") {
    return "Male";
  } else if (val === "F") {
    return "Female";
  }
  return "Other";
};

export const getOTPMessage = (method, message) => {
  if (method === "aadhaarotp") {
    const mobileVal = message?.split(" ").pop();
    return mobileVal
      ? `We just sent an OTP on the Mobile Number ${mobileVal} linked with Aadhaar. Enter the OTP below to proceed with ABHA verification`
      : `We just sent an OTP on the Mobile Number linked with Aadhaar. Enter the OTP below to proceed with ABHA verification`;
  } else if (method === "mobileotp") {
    const mobileVal = message?.split(" ").pop();
    return mobileVal
      ? `We just sent an OTP on the Mobile Number ${mobileVal} provided in ABHA application. Enter the OTP below to proceed with ABHA verification`
      : `We just sent an OTP on the Mobile Number provided in ABHA application. Enter the OTP below to proceed with ABHA verification`;
  }
  return message;
};

export const validateFormHelper = (name, value, fieldValidations) => {
  const validation = fieldValidations.validation || [];
  const error = [];
  validation.forEach((item) => {
    switch (item.type) {
      case "maxLength":
        if (value.length > item.value) error.push(item.message);
        break;
      case "minLength":
        if (value.length < item.value) error.push(item.message);
        break;
      case "characters":
        if (!item.regex.test(value)) error.push(item.message);
        break;
      case "numeric":
        if (!item.regex.test(value)) error.push(item.message);
        break;
      case "email":
        if (!item.regex.test(value)) error.push(item.message);
        break;
      case "alphaNumeric":
        if (!item.regex.test(value)) error.push(item.message);
        break;
      case "alphaNumericWithSpecialChar":
        if (!item.regex.test(value)) error.push(item.message);
      default:
        break;
    }
  });
  return error;
};

export const validateFormRequiredFields = (fields, data) => {
  let errors = {};
  fields.forEach((field) => {
    if (Array.isArray(data[field]) && data[field].length === 0) {
      errors[field] = ["This field is required"];
    }
    if (!data[field]) {
      errors[field] = ["This field is required"];
    }
  });
  return errors;
};

export const validateAllFormValidations = (schema, formData) => {
  let errors = {};
  schema.forEach((key) => {
    if (key.isRequired) {
      if (
        Array.isArray(formData[key.name]) &&
        formData[key.name].length === 0
      ) {
        errors[key.name] = ["This field is required"];
      }
      if (!formData[key.name]) {
        errors[key.name] = ["This field is required"];
      }
    }
    const error = formData[key.name]
      ? validateFormHelper(key.name, formData[key.name], key)
      : [];
    if (error.length > 0) {
      errors[key.name] = error;
    }
  });
  return errors;
};

export const ABHA_API_URL = process.env.NEXT_PUBLIC_API_URL;

export const NUMBER_CHECK_REGEX = /^[0-9]*$/;

export const CHARACTERS_CHECK_REGEX = /^[A-Za-z ]*$/;

export const ALPHANUMERIC_CHECK_REGEX = /^[A-Za-z0-9 ]*$/;

export const ALPHANUMERIC_CHECK_REGEX_WITH_SPECIAL_CHAR =
  /^[A-Za-z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/;

export const MONTHS_LIST = [
  {
    value: "01",
    label: "January",
  },
  {
    value: "02",
    label: "February",
  },
  {
    value: "03",
    label: "March",
  },
  {
    value: "04",
    label: "April",
  },
  {
    value: "05",
    label: "May",
  },
  {
    value: "06",
    label: "June",
  },
  {
    value: "07",
    label: "July",
  },
  {
    value: "08",
    label: "August",
  },
  {
    value: "09",
    label: "September",
  },
  {
    value: "10",
    label: "October",
  },
  {
    value: "11",
    label: "November",
  },
  {
    value: "12",
    label: "December",
  },
];

export const NO_DAYS_LIST = [
  "01",
  "02",
  "03",
  "04",
  "05",
  "06",
  "07",
  "08",
  "09",
  "10",
  "11",
  "12",
  "13",
  "14",
  "15",
  "16",
  "17",
  "18",
  "19",
  "20",
  "21",
  "22",
  "23",
  "24",
  "25",
  "26",
  "27",
  "28",
  "29",
  "30",
  "31",
];

export const getYears = () => {
  const yearFrom = 1900;
  const yearTo = new Date().getFullYear();
  const years = [];
  for (let i = yearFrom; i <= yearTo; i++) {
    years.push(i);
  }
  return years.sort((a, b) => b - a);
};

export const YEARS_LIST = getYears();

export const getMasterDropDownList = (masterKey, masterList) => {
  if (!masterKey || !masterList) return [];
  return masterList[masterKey]?.map((item) =>
    item?.yearcode
      ? {
          value: item.yearcode,
          label: item.yearcode,
          restProps: item,
        }
      : {
          value: item.code,
          label: item.name,
          restProps: item,
        }
  );
};

const handleClickScroll = (name) => {
  const element = document.getElementById(name);
  if (element) {
    element.scrollIntoView({ behavior: "smooth" });
  }
};

function getOffset(el) {
  const rect = el.getBoundingClientRect();
  return -(rect.top + window.scrollY);
}

export const scrollTo = (error) => {
  const eleList = {};
  for (let key in error) {
    eleList[key] = getOffset(document.getElementById(key));
  }
  const ald = Object.keys(error).length
    ? Object.keys(eleList).reduce((a, b) => (eleList[a] > eleList[b] ? a : b))
    : undefined;
  if (ald) handleClickScroll(ald);
};

export const copyToClipBoard = async (copyMe, callback) => {
  await navigator.clipboard.writeText(copyMe);
  callback(true);
};

export const get12hrTime = (tm) => {
  try {
    return new Date("1970-01-01T" + tm + "Z").toLocaleTimeString("en-US", {
      timeZone: "UTC",
      hour12: true,
      hour: "numeric",
      minute: "numeric",
    });
  } catch (error) {
    return tm;
  }
};

export const getAge = (birthDate) =>
  Math.floor((new Date() - new Date(birthDate).getTime()) / 3.15576e10);

export const convertTime12to24 = (time12h) => {
  const [time, modifier] = time12h.split(" ");

  let [hours, minutes] = time.split(":");

  if (hours === "12") {
    hours = "00";
  }

  if (modifier === "PM") {
    hours = parseInt(hours, 10) + 12;
  }

  return `${hours}:${minutes}`;
};

// export const isToday = (date) => {
//   debugger
//   let d1 = moment().format("YYYY-MM-DD");
//   const date1 = new Date(d1);
//   const date2 = new Date(date);
//   if (
//     date1.getDate() === date2.getDate() &&
//     date1.getFullYear() === date2.getFullYear() &&
//     date1.getMonth() === date2.getMonth()
//   ) {
//     return `Today ${moment(date, "YYYY-MM-DD").format("MMM Do")}`;
//   }
//   return ` ${moment(date).format("dddd")} ${moment(date, "YYYY-MM-DD").format(
//     "MMM Do"
//   )}`;
// };

export const is_weekend = function (date1, pass) {
  let returnFlag = true;
  if (pass.isOnSite) {
    const { availableDates } = pass;
    const availableDatesArr = availableDates.split(",") || [];
    const dateFormat = moment(date1).format("YYYY-MM-DD");
    returnFlag = availableDatesArr.indexOf(dateFormat) > -1;
  }
  var dt = new Date(date1);
  if (dt.getDay() === 0) {
    returnFlag = false;
  }
  return returnFlag;
};

export const isToday = (startDate) => {
  if (!startDate) {
    return false;
  }
  let isToday = false;
  const d1 = moment().format("YYYY-MM-DD");
  const date1 = new Date(d1);
  const momentDate = moment(startDate).format("YYYY-MM-DD");
  const date2 = new Date(momentDate);
  if (
    date1.getDate() === date2.getDate() &&
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth()
  ) {
    isToday = true;
  }
  return isToday;
};

export const isTomorrow = (startDate) => {
  let isTomm = false;
  const d1 = moment().format("YYYY-MM-DD");
  const date1 = new Date(d1);
  const momentDate = moment(startDate).format("YYYY-MM-DD");
  const date2 = new Date(momentDate);
  date1.setDate(date1.getDate() + 1);
  if (
    date1.getDate() === date2.getDate() &&
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth()
  ) {
    isTomm = true;
  }
  return isTomm;
};

export const ConvertDateToYYMMDDFormat = (inputDate) => {
  const mm = inputDate.getMonth() + 1; // getMonth() is zero-based
  const dd = inputDate.getDate();
  const date = [
    inputDate.getFullYear(),
    (mm > 9 ? "" : "0") + mm,
    (dd > 9 ? "" : "0") + dd,
  ].join("");
  return `${date} ${moment().format("HH:mm:ss")}`;
};

// eslint-disable-next-line react/display-name
export const ExampleCustom1 = forwardRef(
  ({ onClick, idToda, startDate }, ref) => (
    <div onClick={onClick} ref={ref} className="af-right" tabIndex={0}>
      <div
        className={`text-[13px] font-medium text-gray-700 rounded-lg shadow-sm ring-1 ring-inset ring-gray-300 bg-white placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-blue-600 p-1.5 flex flex-row-reverse justify-center items-center gap-1.5 f-row-reverse  ${
          !idToda ? "fhdmmd" : ""
        }`}
      >
        <span>
          <CalenderIcon />
        </span>
        {!startDate && (
          <div className="leading-none whitespace-nowrap">Filter By Date</div>
        )}
        <div className="more-date whitespace-nowrap text-[13px] font-medium leading-none">
          {startDate && moment(startDate, "YYYY-MM-DD").format("DD MMM YYYY")}
        </div>
      </div>
    </div>
  )
);

export const camelize = (inputStr) => {
  return inputStr
    ? inputStr.charAt(0).toUpperCase() + inputStr.slice(1).toLowerCase()
    : inputStr;
};
