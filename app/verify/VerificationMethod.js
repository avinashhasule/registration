"use client";
import { classNames } from "@/utils/CommonFunc";
import { LOGIN_METHOD_LIST } from "@/utils/Constant";
import { RadioGroup } from "@headlessui/react";
import Image from "next/image";

export default function VerificationMethod({
  selectedLoginMethod,
  setSelectedLoginMethod,
  otpMessage,
}) {
  return (
    <RadioGroup
      disabled={otpMessage ? true : false}
      value={selectedLoginMethod}
      onChange={setSelectedLoginMethod}
    >
      <div className="mb-6 grid grid-cols-2 gap-4">
        {LOGIN_METHOD_LIST.map((opt) => (
          <RadioGroup.Option
            key={opt.id}
            value={opt}
            className={({ active }) =>
              classNames(
                active ? "" : "border-gray-300",
                "relative flex cursor-pointer rounded-2xl border bg-white p-6 outline-none"
              )
            }
          >
            {({ checked, active }) => (
              <>
                <div className="w-full flex flex-col items-center">
                  <RadioGroup.Label
                    as="span"
                    className="block bg-gradient-to-tr from-blue-600 to-blue-500 rounded-full border border-white shadow-md p-2.5"
                  >
                    <Image
                      width={32}
                      height={32}
                      src={opt.imagesrc}
                      alt={opt.alText}
                    />
                  </RadioGroup.Label>
                  <RadioGroup.Description
                    as="span"
                    className="mt-4 font-medium text-center text-sm text-gray-700"
                  >
                    {opt.title}
                  </RadioGroup.Description>
                  {/* <RadioGroup.Description
                    as="span"
                    className="mt-6 text-sm font-medium text-gray-900"
                >
                    {opt.users}
                </RadioGroup.Description> */}
                </div>
                {/* <CheckCircleIcon
                  className={classNames(
                    !checked ? "invisible" : "",
                    "h-5 w-5 text-blue-600"
                  )}
                  aria-hidden="true"
                /> */}
                <span
                  className={classNames(
                    active ? "border-2" : "border-2",
                    checked
                      ? "border border-blue-600 shadow-xl"
                      : "border-transparent",
                    "pointer-events-none absolute -inset-px rounded-2xl"
                  )}
                  aria-hidden="true"
                />
              </>
            )}
          </RadioGroup.Option>
        ))}
      </div>
    </RadioGroup>
  );
}
