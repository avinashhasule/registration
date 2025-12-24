"use client";
import { Fragment, useEffect, useState } from "react";
import { Transition } from "@headlessui/react";
import { XMarkIcon, CheckCircleIcon, CloseIcon } from "./Icons";
import { ToastType } from "@/hooks/useToast";

export default function Toast({
  type,
  show,
  header = "Successfully saved!",
  body = "",
  closeToast: handleClose,
}) {
  const divBorderClass =
    type === ToastType.SUCCESS
      ? "border-green-700 bg-green-50"
      : "border-red-700 bg-red-50";

  return (
    <>
      <div
        aria-live="assertive"
        className="toast-pop pointer-events-none fixed inset-0 flex px-4 py-6 items-start sm:p-6 z-30"
      >
        <div className="flex w-full flex-col space-y-4 items-end">
          <Transition
            show={show}
            as={Fragment}
            enter="transform ease-out duration-300 transition"
            enterFrom="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
            enterTo="translate-y-0 opacity-100 sm:translate-x-0"
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div
              className={`pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg border-l-2 ${divBorderClass} shadow-lg`}
            >
              <div className="p-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <ToastIcon type={type} />
                  </div>
                  <ToastContent
                    type={type}
                    header={header}
                    body={body}
                    handleClose={handleClose}
                  />
                </div>
              </div>
            </div>
          </Transition>
        </div>
      </div>
    </>
  );
}

const ToastIcon = ({ type }) => {
  switch (type) {
    case ToastType.SUCCESS:
      return <CheckCircleIcon cssclass="text-green-500" aria-hidden="true" />;
    case ToastType.ERROR:
      return <XMarkIcon cssclass="text-red-500" aria-hidden="true" />;
    default:
      return null;
  }
};

const ToastContent = ({ type, header, body, handleClose }) => {
  switch (type) {
    case ToastType.SUCCESS:
      return (
        <>
          <div className="ml-3 w-0 flex-1 pt-0.5">
            <p className="text-sm font-semibold text-green-700">{header}</p>
            <p className="mt-1 text-sm font-normal text-green-600">{body}</p>
          </div>
          <div className="ml-4 flex flex-shrink-0">
            <button
              type="button"
              className="inline-flex rounded-md  w-5 h-5 hover:text-green-700 text-green-700/70 icon-20 outline-none"
              onClick={handleClose}
            >
              <span className="sr-only">Close</span>
              <CloseIcon className="" aria-hidden="true" />
            </button>
          </div>
        </>
      );
    case ToastType.ERROR:
      return (
        <>
          <div className="ml-3 w-0 flex-1 pt-0.5">
            <p className="text-sm font-semibold text-red-700">{header}</p>
            <p className="mt-1 text-sm font-normal text-red-600">{body}</p>
          </div>
          <div className="ml-4 flex flex-shrink-0">
            <button
              type="button"
              className="inline-flex rounded-md w-5 h-5 hover:text-red-700 text-red-700/70 icon-20 outline-none"
              onClick={handleClose}
            >
              <span className="sr-only">Close</span>
              <CloseIcon className="" aria-hidden="true" />
            </button>
          </div>
        </>
      );
    default:
      return null;
  }
};
