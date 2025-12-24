"use client";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import ABHACarousel from "./AbhaCarousel";
import {
  SkipArrowRightIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
  SplashOverlayImg,
} from "@/components/Icons";

export default function CreateAbhaTour(props) {
  const router = useRouter();
  const [index, setIndex] = useState(0);
  const intervalRef = useRef(null);
  const patientMRNo = props?.mrno || null;
  const incrementIndex = useCallback(() => {
    if (index === 2) {
      clearInterval(intervalRef.current);
    } else {
      setIndex((index) => index + 1);
    }
  }, [index]);

  useEffect(() => {
    intervalRef.current = setInterval(incrementIndex, 3000);
    return () => clearInterval(intervalRef.current);
  }, [incrementIndex]);

  const handleSkip = useCallback(
    () =>
      patientMRNo
        ? router.push(`/register/with-abha?mrno=${patientMRNo}`)
        : router.push("/register/with-abha"),
    [router, patientMRNo]
  );
  const handleNext = useCallback(
    () =>
      index === 2
        ? patientMRNo
          ? router.push(`/register/with-abha?mrno=${patientMRNo}`)
          : router.push("/register/with-abha")
        : setIndex((index) => index + 1),
    [index, router, patientMRNo]
  );
  const handleBack = useCallback(
    () => index >= 0 && setIndex((index) => index - 1),
    [index]
  );

  return (
    <div className="bg-gradient-to-r from-blue-600 to-blue-500 sm:from-transparent max-w-[640px] sm:max-w-lg w-full mx-auto flex flex-col justify-between sm:min-h-[calc(100vh-53px)] absolute z-50 inset-0 sm:z-0 sm:relative overflow-hidden sm:pt-20 pt-0">
      <div className="internal-scroll overflow-auto px-6 max-[375px]:px-4 pb-2 h-full">
        <div className="mt-6 text-right z-20 sm:relative absolute right-4">
          <button
            onClick={handleSkip}
            className="w-full flex items-center justify-end gap-0.5 text-sm font-normal uppercase text-white sm:text-gray-500 sm:hover:text-gray-700 icon-20"
          >
            <span>Skip</span>
            <SkipArrowRightIcon />
          </button>
        </div>
        <div className="flex flex-col gap-10 items-center justify-between h-full sm:min-h-[calc(100vh-200px)] relative z-10">
          <ABHACarousel index={index} />
          <div className="w-full flex items-center justify-between z-10 mb-4">
            <div>
              {index != 0 ? (
                <button
                  onClick={handleBack}
                  className="inline-flex items-center gap-2 justify-center rounded-lg bg-transparent sm:bg-white ring-1 ring-white/40 sm:ring-gray-300 active:bg-gray-100 px-3 py-2.5 text-sm font-semibold text-white sm:text-gray-700 hover:shadow-sm icon-20"
                >
                  <ArrowLeftIcon />
                  Back
                </button>
              ) : (
                <button
                  onClick={() => {
                    props.onSkipClip(false);
                  }}
                  className="inline-flex items-center gap-2 justify-center rounded-lg bg-transparent sm:bg-white ring-1 ring-white/40 sm:ring-gray-300 active:bg-gray-100 px-3 py-2.5 text-sm font-semibold text-white sm:text-gray-700 hover:shadow-sm icon-20"
                >
                  Cancel
                </button>
              )}
            </div>
            <div>
              <button
                onClick={handleNext}
                className="inline-flex items-center w-auto rounded-lg bg-white sm:bg-blue-600 sm:hover:bg-blue-700 ring-1 sm:ring-0 ring-gray-300 px-3 py-2.5 text-sm font-semibold text-gray-700 sm:text-white hover:shadow-sm gap-2 icon-20"
              >
                {index === 2 ? "Get Started" : "Next"}
                <ArrowRightIcon />
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="fixed h-screen inset-x-0 top-0 mx-auto overflow-hidden z-0">
        <SplashOverlayImg />
      </div>
    </div>
  );
}
