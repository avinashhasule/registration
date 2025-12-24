"use client";
import Image from "next/image";

const ABHACarouselImages = [
  {
    src: "/onboard_1.svg",
    title: "Unique & Trustable Identity",
    description:
      "Establish unique identity across different healthcare providers within the healthcare ecosystem.",
  },
  {
    src: "/onboard_2.svg",
    title: "Share Health Records",
    description:
      "Share health records with healthcare providers and other stakeholders.",
  },
  {
    src: "/onboard_3.svg",
    title: "Access Health Records",
    description:
      "Access health records from healthcare providers and other stakeholders.",
  },
];

export default function ABHACarousel({ index }) {
  const currentImage = ABHACarouselImages[index];
  return (
    <div className="flex flex-col justify-center pt-4 sm:pt-16 h-full relative z-10">
      <Image
        width={320}
        height={320}
        src={`${currentImage.src}`}
        className="mx-auto p-6 sm:p-10 sm:bg-gradient-to-r sm:from-blue-600 sm:to-blue-500 sm:rounded-full sm:w-80 sm:h-80 overflow-visible"
        alt={currentImage.title}
      />
      <div className="text-center pt-4 sm:pt-10">
        <h2 className="text-2xl max-[340px]:text-xl font-medium leading-7 text-white sm:text-gray-800 pb-2">
          {currentImage.title}
        </h2>
        <p className="w-4/5 max-w-full mx-auto text-base max-[340px]:text-sm font-normal text-white sm:text-gray-500">
          {currentImage.description}
        </p>
      </div>
    </div>
  );
}
