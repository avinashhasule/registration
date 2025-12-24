"use client";
import {
  AddharCardIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  VerifyAbhaIcon,
  WithoutABHAIcon,
} from "@/components/Icons";
import { classNames } from "@/utils/CommonFunc";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import CreateAbhaTour from "./CreateAbhaTour";
import { usePatient } from "@/context/PatientContext";

// register
//   <>
//     <li>
//       Under Ayushman Bharat Digital Mission, Government of India is issuing a
//       unique Ayushman Bharat Health Account (ABHA) number to every citizen of
//       India.
//     </li>
//     <li>
//       ABHA number is a 14 digit number that will uniquely identify you as a
//       participant in India&apos;s digital healthcare ecosystem. ABHA number will
//       establish a strong and trustable identity for you that will be accepted by
//       healthcare providers across the country. Seamless sign up for PHR
//       (Personal Health Records) applications such as ABDM ABHA application for
//       Health data sharing.
//     </li>
//     <li>
//       In case you don&apos;t have ABHA number, Jupiter Hospital now gives you
//       ability to create your ABHA number, and in case you already have ABHA
//       number, you can use the same to create/link your medical record of Jupiter
//       Hospital with your ABHA number.
//     </li>
//   </>
// );

export default function Example({ className: cssClassName, ...props }) {
  const router = useRouter();
  const patientMRNo = props?.searchParams?.mrno || null;
  const [openTour, setOpenTour] = useState(false);
  const [openAccordian, setOpneAccordian] = useState(false);

  const { setCanEditABHAAddress } = usePatient();

  useEffect(() => {
    setCanEditABHAAddress(false);
  }, [setCanEditABHAAddress]);

  const handleCardClick = (event) => {
    event.stopPropagation();
    setOpenTour(!openTour);
  };

  return openTour ? (
    <CreateAbhaTour
      onSkipClip={() => setOpenTour(!openTour)}
      mrno={patientMRNo}
    />
  ) : (
    <div className="flex flex-col justify-between min-h-[calc(100vh-53px)] pt-20 bg-white">
      <div className="mx-auto lg:max-w-7xl w-full md:mt-4 max-[375px]:px-4 px-6 py-6">
        {/* <ul className="list-decimal ps-12 mb-6 space-y-3 text-[15px] text-gray-600 font-medium text-justify border hidden sm:block bg-blue-50 rounded-lg p-6">
          {termsList}
        </ul> */}

        <div
          id="accordion-collapse"
          className="block sm:hidden mb-2"
          data-accordion="collapse"
        >
          {/* <h2 id="accordion-collapse-heading-1">
            <button
              type="button"
              onClick={() => setOpneAccordian(!openAccordian)}
              className={`flex items-center justify-between w-full px-4 py-3 text-[15px] font-semibold rounded-lg text-gray-600 border gap-3 mb-2 ${
                openAccordian
                  ? "border-gray-200"
                  : "text-blue-600 bg-blue-50 border-blue-100"
              }`}
              data-accordion-target="#accordion-collapse-body-1"
              aria-expanded="true"
              aria-controls="accordion-collapse-body-1"
            >
              <span className="text-left">Ayushman Bharat Digital Mission</span>
              {openAccordian ? <ChevronDownIcon /> : <ChevronUpIcon />}
            </button>
          </h2> */}
          <div
            id="accordion-collapse-body-1"
            className={`rounded-lg transition-[max-height] duration-700 ease-in-out bg-white shadow-sm border ${
              openAccordian
                ? "opacity-0 max-h-0"
                : "opacity-100 max-h-screen mb-4"
            }`}
            aria-labelledby="accordion-collapse-heading-1"
          >
            {/* <ul className="list-decimal space-y-3 text-sm text-gray-500 font-medium text-justify rounded-lg ps-8 p-5">
              {termsList}
            </ul> */}
          </div>
        </div>

        <div className={`sm:grid sm:grid-cols-2 lg:grid-cols-3 sm:gap-6 `}>
          {/* <div
            className={classNames(
              "card-box w-card text-center mb-6 sm:mb-0 cursor-pointer overflow-hidden hover:from-white hover:to-white border border-white hover:border-gray-300 shadow-sm hover:shadow-xl rounded-2xl group relative p-6 outline-none ease-in-out duration-300 hover:scale-105",
              cssClassName
                ? cssClassName
                : "bg-gradient-to-tr from-green-600 to-green-500",
              ""
            )}
            role="button"
            onClick={handleCardClick}
          >
            <div
              className={
                "card-thumb min-h-[64px] flex justify-center items-center mb-4 ease-in-out duration-300"
              }
            >
              <AddharCardIcon className="" aria-hidden="true" />
            </div>
            <div className="text-center sm:h-[86px]">
              <h3 className="max-[480px]:text-base text-lg font-semibold text-white group-hover:text-gray-800 ease-in-out duration-300">
                <span>Create ABHA Number</span>
              </h3>
              <p className="text-sm md:text-base font-normal group-hover:text-gray-500 text-white ease-in-out duration-300 block pt-1">
                Don&apos;t have ABHA number, create <br />
                using Aadhaar.
              </p>
            </div>
            <div className="mt-6">
              <button
                type="button"
                className="w-full text-center rounded-lg bg-white px-3.5 py-2.5 text-sm font-semibold text-gray-700 shadow-sm outline-none focus-visible:outline-none ease-in-out duration-300"
              >
                Create
              </button>
            </div>
          </div>
          <div
            className={classNames(
              "card-box m-card text-center mb-6 sm:mb-0 cursor-pointer overflow-hidden hover:from-white hover:to-white border border-white hover:border-gray-300 shadow-sm hover:shadow-xl rounded-2xl group relative p-6 outline-none ease-in-out duration-300 hover:scale-105",
              cssClassName
                ? cssClassName
                : "bg-gradient-to-tr from-blue-700 to-blue-500",
              ""
            )}
            onClick={(event) => {
              event.stopPropagation();
              patientMRNo
                ? router.push(`/verify?mrno=${patientMRNo}`)
                : router.push("/verify");
            }}
          >
            <div
              className={
                "card-thumb min-h-[64px] flex justify-center items-center mb-4 ease-in-out duration-300"
              }
            >
              <VerifyAbhaIcon className="" aria-hidden="true" />
            </div>
            <div className="text-center sm:h-[86px]">
              <h3 className="max-[480px]:text-base text-lg font-semibold text-white group-hover:text-gray-800 ease-in-out duration-300">
                <span>Verify ABHA</span>
              </h3>
              <p className="max-[640px]:max-w-[300px] w-full mx-auto text-sm md:text-base font-normal group-hover:text-gray-500 text-white ease-in-out duration-300 block pt-1">
                Have ABHA number, link using ABHA number/address or Mobile
                number.
              </p>
            </div>
            <div className="mt-6">
              <button
                type="button"
                onClick={() =>
                  patientMRNo
                    ? router.push(`/verify?mrno=${patientMRNo}`)
                    : router.push("/verify")
                }
                className="w-full text-center rounded-lg bg-white px-3.5 py-2.5 text-sm font-semibold text-gray-700 shadow-sm outline-none focus-visible:outline-none ease-in-out duration-300"
              >
                Verify
              </button>
            </div>
          </div> */}
          {!patientMRNo && (
            <>
              {/* <div className="relative sm:hidden lg:hidden">
                <div
                  className="absolute inset-0 flex items-center justify-center"
                  aria-hidden="true"
                >
                  <div className="w-48 border-t border-dashed border-gray-300"></div>
                </div>
                <div className="relative flex justify-center py-2 mb-6">
                  <span className="bg-white px-4 text-sm text-gray-500 uppercase">
                    Or
                  </span>
                </div>
              </div> */}
              <div
                className={classNames(
                  "w-full sm:max-w-none max-w-xs mx-auto mb-6 sm:mb-0 text-center cursor-pointer overflow-hidden border border-red-300 shadow-sm hover:shadow-xl rounded-2xl group relative p-6 outline-none ease-in-out duration-300 hover:scale-105",
                  cssClassName ? cssClassName : "bg-red-50",
                  ""
                )}
                onClick={(event) => {
                  event.stopPropagation();
                  router.push("/patient/create");
                }}
              >
                <div
                  className={
                    "card-thumb lg:min-h-[64px] flex justify-center items-center mb-4 ease-in-out duration-300"
                  }
                >
                  <WithoutABHAIcon className="" aria-hidden="true" />
                </div>
                <div className="text-center sm:h-[86px]">
                  <h3 className="max-[480px]:text-base text-lg font-semibold text-gray-800 ease-in-out duration-300">
                    <span>Without ABHA</span>
                  </h3>
                  <p className="text-sm md:text-base font-normal text-gray-500 ease-in-out duration-300 block pt-1">
                    {" "}
                    Create without link to ABHA.
                  </p>
                </div>
                <div className="mt-6">
                  <button
                    type="button"
                    className="w-full text-center rounded-lg bg-red-600 hover:bg-red-700 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm outline-none focus-visible:outline-none ease-in-out duration-300"
                    onClick={() => router.push("/patient/create")}
                  >
                    Create Patient
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
