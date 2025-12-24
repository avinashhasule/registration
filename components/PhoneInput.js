"use client";
import { classNames } from "@/utils/CommonFunc";
import ShowError from "./ShowError";

export default function PhoneInput({
  type = "text",
  name = "phoneNumber",
  id,
  disabled,
  value,
  onChange,
  error,
}) {
  return (
    <>
      <label
        htmlFor="phone-number"
        className="block text-sm font-medium leading-6 text-gray-600">
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
          type={type}
          name={name}
          id={id}
          value={value}
          inputMode="numeric"
          onChange={onChange}
          className={classNames(
            "block w-full rounded-lg border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-blue-600 text-sm leading-6 font-medium pl-16",
            error && "ring-2 ring-red-500 focus:ring-red-600 rounded-lg"
          )}
          placeholder="Mobile Number"
          maxLength={10}
          disabled={disabled}
        />
        <ShowError error={[error]} />
      </div>
      <p
        className="flex gap-2 mt-3 text-sm text-blue-600"
        id="abha-communication-no"
      >
        <span className="text-blue-600 icon-20">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
            />
          </svg>
        </span>
        <div>
          This mobile number will be used for all the communications related to
          ABHA.
        </div>
      </p>
    </>
  );
}
