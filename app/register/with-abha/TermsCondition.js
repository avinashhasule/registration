"use client";
import ShowError from "@/components/ShowError";
import { classNames } from "@/utils/CommonFunc";
import { useCallback } from "react";

export default function TermsCondition(props) {
  const {
    header = "Terms and Conditions",
    label = "I Understand the terms of use",
    value = "",
    onChange = () => {},
    formData = {},
    error,
  } = props;

  let errorMessage = error["agreed1"] || "";
  if (error["agreed2"] && errorMessage === "") {
    errorMessage = error["agreed2"];
  } else if (error["agreed3"] && errorMessage === "") {
    errorMessage = error["agreed3"];
  } else if (error["agreed4"] && errorMessage === "") {
    errorMessage = error["agreed4"];
  } else if (error["agreed5"] && errorMessage === "") {
    errorMessage = error["agreed5"];
  } else if (error["agreed6"] && errorMessage === "") {
    errorMessage = error["agreed6"];
  }

  return (
    <div className="">
      <div className="block text-sm font-medium leading-6 text-gray-700">
        {header}
      </div>
      {/* <p
        className="mt-2 ms-3.5 text-sm text-gray-500 text-justify"
        id="email-error"
      >
       
      </p> */}

      <label className="text-sm font-normal text-gray-600 leading-6 cursor-pointer">
        <span> I hereby declare that</span>
      </label>

      <fieldset>
        <div className="mt-3">
          <div className="relative flex gap-x-3">
            <div className="flex items-center">
              <input
                id="agreed1"
                name="agreed1"
                type="checkbox"
                value={!!formData["agreed1"]}
                onChange={(event) =>
                  onChange({
                    target: { name: "agreed1", value: event.target.checked },
                  })
                }
                className={classNames(
                  "h-4 w-4 rounded border-gray-300 text-blue-600",
                  error["agreed1"] && "checkbox-error"
                )}
              />

              <label
                htmlFor="agreed1"
                className="text-sm font-normal text-gray-600 ml-2 leading-6 cursor-pointer text-justify"
              >
                <span>
                  I am voluntarily sharing my Aadhaar Number / Virtual ID issued
                  by the Unique Identification Authority of India (“
                  <span className="font-semibold">UIDAI</span>”), and my
                  demographic information for the purpose of creating an
                  Ayushman Bharat Health Account number (“
                  <span className="font-semibold">ABHA number</span>
                  ”) and Ayushman Bharat Health Account address (“
                  <span className="font-semibold">ABHA Address</span>”). I
                  authorize NHA to use my Aadhaar number / Virtual ID for
                  performing Aadhaar based authentication with UIDAI as per the
                  provisions of the Aadhaar (Targeted Delivery of Financial and
                  other Subsidies, Benefits and Services) Act, 2016 for the
                  aforesaid purpose. I understand that UIDAI will share my e-KYC
                  details, or response of “Yes” with NHA upon successful
                  authentication.I intend to create Ayushman Bharat Health
                  Account Number (“
                  <span className="font-semibold">ABHA number</span>”) and
                  Ayushman Bharat Health Account address (“ABHA Address”) using
                  document other than Aadhaar.
                </span>
              </label>
            </div>
          </div>
        </div>
      </fieldset>

      <fieldset>
        <div className="mt-3">
          <div className="relative flex gap-x-3">
            <div className="flex items-center">
              <input
                id="agreed2"
                name="agreed2"
                type="checkbox"
                value={!!formData["agreed2"]}
                onChange={(event) =>
                  onChange({
                    target: { name: "agreed2", value: event.target.checked },
                  })
                }
                className={classNames(
                  "h-4 w-4 rounded border-gray-300 text-blue-600",
                  error["agreed2"] && "checkbox-error"
                )}
              />

              <label
                htmlFor="agreed2"
                className="text-sm font-normal text-gray-600 ml-2 leading-6 cursor-pointer text-justify"
              >
                <span>
                  I intend to create Ayushman Bharat Health Account Number
                  (“ABHA number”) and Ayushman Bharat Health Account address (“
                  <span className="font-semibold">ABHA Address</span>”) using
                  document other than Aadhaar. (Click here to proceed further)
                </span>
              </label>
            </div>
          </div>
        </div>
      </fieldset>

      <fieldset>
        <div className="mt-3">
          <div className="relative flex gap-x-3">
            <div className="flex items-center">
              <input
                id="agreed3"
                name="agreed3"
                type="checkbox"
                value={!!formData["agreed3"]}
                onChange={(event) =>
                  onChange({
                    target: { name: "agreed3", value: event.target.checked },
                  })
                }
                className={classNames(
                  "h-4 w-4 rounded border-gray-300 text-blue-600",
                  error["agreed3"] && "checkbox-error"
                )}
              />

              <label
                htmlFor="agreed3"
                className="text-sm font-normal text-gray-600 ml-2 leading-6 cursor-pointer text-justify"
              >
                <span>
                  I consent to usage of my ABHA address and ABHA number for
                  linking of my legacy (past) government health records and
                  those which will be generated during this encounter.
                </span>
              </label>
            </div>
          </div>
        </div>
      </fieldset>
      <fieldset>
        <div className="mt-3">
          <div className="relative flex gap-x-3">
            <div className="flex items-center">
              <input
                id="agreed4"
                name="agreed4"
                type="checkbox"
                value={!!formData["agreed4"]}
                onChange={(event) =>
                  onChange({
                    target: { name: "agreed4", value: event.target.checked },
                  })
                }
                className={classNames(
                  "h-4 w-4 rounded border-gray-300 text-blue-600",
                  error["agreed4"] && "checkbox-error"
                )}
              />

              <label
                htmlFor="agreed4"
                className="text-sm font-normal text-gray-600 ml-2 leading-6 cursor-pointer text-justify"
              >
                <span>
                  I authorize the sharing of all my health records with
                  healthcare provider(s) for the purpose of providing healthcare
                  services to me during this encounter.
                </span>
              </label>
            </div>
          </div>
        </div>
      </fieldset>

      <ul>
        <li>
          <fieldset>
            <div className="mt-3">
              <div className="relative flex gap-x-3">
                <div className="flex items-center">
                  <input
                    id="agreed5"
                    name="agreed5"
                    type="checkbox"
                    value={!!formData["agreed5"]}
                    onChange={(event) =>
                      onChange({
                        target: {
                          name: "agreed5",
                          value: event.target.checked,
                        },
                      })
                    }
                    className={classNames(
                      "h-4 w-4 rounded border-gray-300 text-blue-600",
                      error["agreed5"] && "checkbox-error"
                    )}
                  />

                  <label
                    htmlFor="agreed5"
                    className="text-sm font-normal text-gray-600 ml-2 leading-6 cursor-pointer text-justify"
                  >
                    <span>
                      I consent to the anonymization and subsequent use of my
                      government health records for public health purposes.
                    </span>
                  </label>
                </div>
              </div>
            </div>
          </fieldset>
          <ul className="pl-8">
            <li>
              <fieldset>
                <div className="mt-3">
                  <div className="relative flex gap-x-3">
                    <div className="flex items-center">
                      <input
                        id="agreed6"
                        name="agreed6"
                        type="checkbox"
                        value={!!formData["agreed6"]}
                        onChange={(event) =>
                          onChange({
                            target: {
                              name: "agreed6",
                              value: event.target.checked,
                            },
                          })
                        }
                        className={classNames(
                          "h-4 w-4 rounded border-gray-300 text-blue-600",
                          error["agreed6"] && "checkbox-error"
                        )}
                      />

                      <label
                        htmlFor="agreed6"
                        className="text-sm font-normal text-gray-600 ml-2 leading-6 cursor-pointer text-justify"
                      >
                        <span>
                          I have been explained about the consent as stated
                          above and hereby provide my consent for the
                          aforementioned purposes.
                        </span>
                      </label>
                    </div>
                  </div>
                </div>
              </fieldset>
            </li>
          </ul>
        </li>
      </ul>
      <div className="text-sm font-medium text-gray-600 ml-6 leading-6 cursor-pointer">
        <ShowError error={[errorMessage]} />
      </div>
    </div>
  );
}
