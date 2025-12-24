"use client";
import { CheckCircleIcon } from "@/components/Icons";
import { classNames } from "@/utils/CommonFunc";
import { RadioGroup } from "@headlessui/react";
import { useState } from "react";

export function ABHAAccount({
  multipleAccounts,
  showLoader,
  handleVerifyUser,
}) {
  const [selected, setSelected] = useState(multipleAccounts[0]?.abhaNumber);

  const handleOnChange = (val) => setSelected(val);

  return (
    <div className="flex flex-col justify-between min-h-[calc(100vh-53px)] relative overflow-hidden pt-20 bg-white">
      <div className="max-h-[calc(100vh-210px)] internal-scroll overflow-auto px-6 max-[375px]:px-4 pb-2">
        <div className="max-w-lg w-full mx-auto mt-6 mb-3">
          <h2 className="text-xl text-center font-semibold leading-7 text-gray-800">
            Select the ABHA Profile
          </h2>
          <div className="mt-6">
            <RadioGroup value={selected} onChange={handleOnChange}>
              <div className="space-y-6">
                {multipleAccounts.map((abhaCard) => (
                  <RadioGroup.Option
                    key={abhaCard?.abhaNumber}
                    value={abhaCard?.abhaNumber}
                    className={({ active }) =>
                      classNames(
                        active ? "" : "border-gray-300",
                        "relative flex cursor-pointer rounded-2xl border bg-white p-6 outline-none"
                      )
                    }
                  >
                    {({ active, checked }) => (
                      <>
                        <div className="flex items-center">
                          <div className="flex gap-4">
                            <div className="w-[120px] h-[140px] object-fill overflow-hidden border-2 border-white bg-gray-100 shadow-md rounded-lg">
                              <RadioGroup.Label
                                as="span"
                                className="text-base font-medium text-gray-800 mb-4 leading-6"
                              >
                                <img
                                  className="w-full h-full object-cover object-center"
                                  src={`data:image/png;base64,${abhaCard?.profilePhoto}`}
                                  alt={abhaCard?.name}
                                />
                              </RadioGroup.Label>
                            </div>
                            <div className="">
                              <RadioGroup.Label
                                as="div"
                                className="text-base font-medium text-gray-800 mb-4 leading-6"
                              >
                                {abhaCard?.name}
                              </RadioGroup.Label>
                              <RadioGroup.Description as="div" className="">
                                <div className="mb-2">
                                  <p className="text-xs font-normal text-gray-500">
                                    ABHA Address:
                                  </p>
                                  <p className="text-sm font-medium text-orange-600">
                                    {abhaCard?.preferredAbhaAddress}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-xs font-normal text-gray-500">
                                    ABHA Number:{" "}
                                  </p>
                                  <p className="text-sm font-medium text-blue-900">
                                    {abhaCard?.abhaNumber}
                                  </p>
                                </div>
                              </RadioGroup.Description>
                            </div>
                          </div>
                        </div>
                        <span
                          className={classNames(
                            active ? "border-2" : "border-2",
                            checked
                              ? "border border-blue-600 shadow-xl card-selected"
                              : "border-transparent",
                            "pointer-events-none absolute -inset-px rounded-2xl"
                          )}
                          aria-hidden="true"
                        />
                        <div className="selected text-gray-300 absolute right-2 top-2">
                          <CheckCircleIcon
                            className={classNames(
                              !checked
                                ? "invisible text-gray-300"
                                : "text-gray-300",
                              "text-blue-600"
                            )}
                            aria-hidden="true"
                          />
                        </div>
                      </>
                    )}
                  </RadioGroup.Option>
                ))}
              </div>
            </RadioGroup>
          </div>
          <div className="w-full absolute bottom-0 inset-x-0 px-6 max-[375px]:px-4 py-4 bg-white flex items-center justify-center gap-x-4 shadow-top">
            <button
              type="button"
              className="sm:w-60 w-full rounded-lg bg-blue-600 px-3 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
              onClick={() => handleVerifyUser(selected)}
              disabled={showLoader}
            >
              View Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
