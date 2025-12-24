"use client";

import moment from "moment";
import { ConfirmAppointmentIcon } from "@/components/Icons";
import { get12hrTime } from "@/utils/CommonFunc";
import { useState } from "react";

export default function ConfirmSubmitModel({
  isReschedule,
  bookConfirm,
  toggleModal,
  dt,
}) {
  const [reason, setReason] = useState("");
  return (
    <div
      id="popup-modal"
      tabIndex="-1"
      className="fixed inset-0 z-50 items-center justify-center w-full overflow-x-hidden overflow-y-auto transition-opacity bg-gray-800/75"
    >
      <div className="flex items-center justify-center min-h-full p-4 text-center sm:p-0">
        <div className="relative p-5 transition-all transform bg-white rounded-lg shadow-xl sm:p-6">
          <div className="">
            <div className="flex justify-center mb-4">
              <ConfirmAppointmentIcon className="mx-auto" />
            </div>
            <div className="text-center">
              <p className="text-lg font-semibold text-gray-800">{`${dt.doctName}`}</p>
              <p className="text-sm text-orange-600">{`(${dt.name})`}</p>
            </div>
            <div className="inline-block px-3 py-1 mt-3 text-sm text-center rounded-lg bg-green-50">
              <p className="font-medium text-green-600">
                {`${moment(dt.dateValue).format("Do MMM YYYY")}`} at{" "}
                {`${dt.displayTime} - ${get12hrTime(dt.toTime)}`}
              </p>
            </div>

            <h3 className="w-4/5 pt-3 mx-auto text-sm font-normal text-gray-500">
              Are you sure you want to book an appointment?
            </h3>
            {isReschedule && (
              <div className="flex flex-col items-start w-full mt-2">
                <label
                  htmlFor="branchName"
                  className="block text-sm font-medium leading-6 text-gray-600"
                >
                  Reschedule Reason
                  <span className="ml-1 text-red-600">*</span>
                </label>
                <div className="relative w-full form-item">
                  <textarea
                    type="text"
                    name="reason"
                    id="reason"
                    maxLength={50}
                    placeholder="Type here..."
                    value={reason || ""}
                    onChange={(e) => setReason(e.target.value)}
                    className={
                      "block w-full rounded-lg border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-blue-600 text-sm leading-6 font-medium"
                    }
                  />
                </div>
              </div>
            )}
            <div className="mt-6 sm:flex sm:flex-row-reverse">
              <button
                data-modal-hide="popup-modal"
                type="button"
                disabled={isReschedule ? !reason.trim() : false}
                onClick={() =>
                  bookConfirm({
                    ...dt,
                    statusChangeReason: isReschedule
                      ? reason.trim()
                      : undefined,
                  })
                }
                className="inline-flex w-full justify-center rounded-lg bg-blue-600 px-3 py-2.5 text-sm font-semibold  text-white shadow-sm hover:bg-blue-700 sm:ml-3 sm:w-100"
              >
                Yes, I&lsquo;m sure
              </button>
              <button
                data-modal-hide="popup-modal"
                type="button"
                onClick={() => toggleModal({})}
                className="mt-3 inline-flex w-full justify-center rounded-lg bg-white px-3 py-2.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-100"
              >
                No, cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
