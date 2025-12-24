"use client";
import Image from "next/image";
import { AadharInput } from "./AadharInput";
import TermsCondition from "./TermsCondition";

export default function Consent({
  setCurrentStep,
  currentStep,
  handleCancel,
  ...props
}) {
  return (
    <>
      <div className="">
        <div className="mt-4 mb-4">
          <Image
            width={440}
            height={440}
            src="/consent_img.svg"
            alt="consent_img"
            className="mx-auto"
          />
        </div>
        <div className="">
          <h1 className="text-lg md:text-xl font-semibold text-gray-800">
            Consent Collection
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Create ABHA Number Using Aadhaar Card
          </p>

          <div className="mt-6">
            <AadharInput {...props} />
          </div>
          <div className="sm:col-span-3">
            <TermsCondition {...props} />
          </div>
        </div>
      </div>
      <div className="w-full absolute bottom-0 inset-x-0 px-6 max-[375px]:px-4 py-4 bg-white flex items-center justify-center gap-x-4 shadow-top">
        <button
          type="button"
          className="sm:w-60 w-full rounded-lg bg-white ring-1 ring-gray-300 active:bg-gray-100 px-3 py-2.5 text-sm font-semibold 
                text-gray-700 hover:shadow-sm gap-1.5 icon-20"
          onClick={handleCancel}
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={() => setCurrentStep(currentStep + 1)}
          className="sm:w-60 w-full rounded-lg bg-blue-600 px-3 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        >
          Next
        </button>
      </div>
    </>
  );
}
