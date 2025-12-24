"use client";
import {
  AppointmentIcon,
  BookAppointmentIcon,
  CloudDownloadIcon,
  ConsultationIcon,
  CancelAppIcon,
  IPIcon,
  LabReportIcon,
  OPIcon,
  ViewEyeIcon,
} from "@/components/Icons";
import { apihelper } from "@/utils/Client";
import { classNames, get12hrTime } from "@/utils/CommonFunc";
import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import Toast from "@/components/Toast";
import { ToastType, useToast } from "@/hooks/useToast";
import moment from "moment";
import CancelApptModel from "../CancelApptModel";
import dynamic from "next/dynamic";

const ViewPDF = dynamic(() => import("./ViewPdf"), { ssr: false });

const getMonthDate = (dt) => {
  return moment(dt, "DD/MM/YYYY").format("Do MMM YYYY");
};

export default function History({
  historyData,
  setLoading,
  mrNo,
  getPatientHistoricalData,
  isDeceased,
}) {
  const router = useRouter();
  const [viewPdf, setViewPdf] = useState({});
  const { toastProp, setToastProp, closeToast } = useToast();
  const [modal, setModal] = useState({});

  const downLoadPdf = useCallback(
    async (trsnNo, FLAG = "L") => {
      setLoading(true);
      const response = await apihelper(
        `patientportal/Hospital/getFileFromAPI/${trsnNo}/${FLAG}`,
        {
          requestType: "blob",
        }
      );
      if (response) {
        const url = window.URL.createObjectURL(response);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "file.pdf"); //or any other extension
        document.body.appendChild(link);
        link.click();
      } else {
        setToastProp({
          show: true,
          header: response?.error?.message || "Something went wrong.",
          type: ToastType.ERROR,
        });
      }
      setLoading(false);
    },
    [setLoading, setToastProp]
  );

  const cancelAppoitment = useCallback(
    async ({ tranNo, reason }) => {
      setLoading(true);
      const response = await apihelper(
        `patientportal/Schedule/cancelAppointment/${tranNo}?reason=CancelFromPatient&`,
        {
          method: "PUT",
          data: {
            reason: reason,
          },
        }
      );
      if (response.status) {
        setToastProp({
          show: true,
          header: ToastType.SUCCESS,
          body:
            response?.success?.message || "Appointment canceled successfully",
          type: ToastType.SUCCESS,
        });
        setModal({});
        getPatientHistoricalData(mrNo);
      } else {
        setToastProp({
          show: true,
          header: response?.error?.message || "Something went wrong.",
          type: ToastType.ERROR,
        });
        setModal({});
      }
      setLoading(false);
    },
    [getPatientHistoricalData, mrNo, setLoading, setToastProp]
  );

  return (
    <div className="flow-root">
      {viewPdf.open && (
        <ViewPDF
          setViewPdf={setViewPdf}
          dt={viewPdf.dt}
          setToastProp={setToastProp}
        />
      )}
      {toastProp.show && <Toast {...toastProp} closeToast={closeToast} />}
      {modal.open && (
        <CancelApptModel
          cancelConfirm={(dt) => cancelAppoitment(dt)}
          setModal={setModal}
          dt={modal.data}
        />
      )}
      <ul>
        {historyData.map((item, eventIdx) => (
          <li key={item.tranNo}>
            <div className="relative">
              <div className="relative ms-6">
                <div
                  className={classNames(
                    "",
                    "ring-8 ring-white rounded-full absolute -start-5 z-10"
                  )}
                >
                  <FlagIcon flag={item.flag} />
                </div>
                <div className="relative border-gray-200 border-s-2 dark:border-gray-700">
                  <div
                    className={classNames(
                      getFlagContainerColor(item.flag),
                      "border rounded-lg px-4 py-5 ms-10 mb-4 max-[480px]:pt-11"
                    )}
                  >
                    <div
                      className={classNames(
                        "sm:flex justify-between rounded-lg"
                      )}
                    >
                      <div>
                        <div className="flex pb-2">
                          <div className="max-[480px]:text-base text-lg font-semibold text-gray-800 capitalize leading-none">
                            {getHeader(item.flag)}
                          </div>
                        </div>
                        <div className="flex flex-col items-start gap-1 divide-gray-300 lg:flex-row lg:items-center lg:divide-x lg:gap-3 ph-list">
                          {item.ipNo && (
                            <p className="text-sm font-normal text-gray-700 sm:text-base lg:ps-3">
                              IP NO:
                              <span className="pl-1 font-semibold text-blue-700">
                                {item.ipNo}
                              </span>
                            </p>
                          )}
                          {item?.doctName && item.flag === "Appointments" && (
                            <div className="flex pt-1">
                              <div className="flex flex-wrap items-center gap-1">
                                <p className="text-base max-[375px]:text-basmse text-blue-600 font-semibold">
                                  Dr. {`${item.doctName}`}
                                </p>
                                <p className="text-sm font-medium text-orange-600">{`(${item.speciality})`}</p>
                              </div>
                            </div>
                          )}

                          {item?.testName && (
                            <p
                              className={classNames(
                                "sm:text-base text-sm font-normal text-gray-700 lg:ps-3",
                                (item?.doctName || item?.ipNo) && ""
                              )}
                            >
                              Test Performed:
                              <span className="pl-1 font-semibold text-blue-700 capitalize">
                                {item?.testName}
                              </span>
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col gap-3">
                        <div className="whitespace-nowrap text-sm font-medium text-gray-500 sm:text-right sm:relative sm:top-0 sm:right-0 absolute max-[480px]:right-auto top-5 right-5">
                          <time dateTime={item.tranTime}>
                            {getMonthDate(item?.tranDate)},{" "}
                            {get12hrTime(item?.tranTime)}
                          </time>
                        </div>
                        {(item.buttonType || "").toLowerCase() ===
                          "follow-up" &&
                          !isDeceased && (
                            <div className="flex items-center max-[480px]:flex-col sm:mt-0 mt-5 sm:gap-4 gap-3">
                              <button
                                className="w-full flex items-center justify-center rounded-lg bg-blue-600 px-2 sm:px-3 py-2 sm:py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 gap-2"
                                onClick={() => {
                                  router.push(
                                    `/patient/appointment/${mrNo}/${item.doctCode}`
                                  );
                                }}
                              >
                                <BookAppointmentIcon
                                  className=""
                                  aria-hidden="true"
                                />
                                <span className="">Follow-up</span>
                              </button>
                            </div>
                          )}

                        {(item.flag || "").toLowerCase() === "ipbills" &&
                          (item.buttonType || "").toLowerCase() === "pdf" && (
                            <div className="flex items-center max-[480px]:flex-col sm:mt-0 mt-2 sm:gap-4 gap-3">
                              <button
                                onClick={() =>
                                  setViewPdf({ open: true, dt: item })
                                }
                                className="w-full flex items-center justify-center rounded-lg bg-white ring-1 ring-gray-300 active:bg-gray-100 px-2 sm:px-3 py-2 sm:py-2.5 text-sm font-semibold text-gray-700 hover:shadow-sm gap-2"
                              >
                                <span className="icon-20">
                                  <ViewEyeIcon />
                                </span>
                                View
                              </button>
                              <button
                                onClick={() =>
                                  downLoadPdf(item.tranNo, item.labCode)
                                }
                                className="w-full flex items-center justify-center rounded-lg bg-blue-600 px-2 sm:px-3 py-2 sm:py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 gap-2"
                              >
                                <span className="icon-20">
                                  <CloudDownloadIcon />
                                </span>
                                Download
                              </button>
                            </div>
                          )}

                        {item.flag === "Appointments" && !isDeceased && (
                          <div className="flex items-center max-[375px]:flex-col sm:mt-0 mt-5 gap-3">
                            <button
                              className="w-full inline-flex items-center justify-center rounded-lg bg-red-600 px-2 sm:px-3 py-2 sm:py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-red-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 gap-2"
                              onClick={() =>
                                setModal({ open: true, data: item })
                              }
                            >
                              <span className="icon-20">
                                <CancelAppIcon
                                  className=""
                                  aria-hidden="true"
                                />
                              </span>
                              Cancel
                            </button>
                            <button
                              className="w-full flex items-center justify-center rounded-lg bg-blue-600 px-2 sm:px-3 py-2 sm:py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 gap-2"
                              onClick={() =>
                                router.push(
                                  `/patient/appointment/${mrNo}/${item.doctCode}/${item.tranNo}`
                                )
                              }
                            >
                              <span className="icon-20">
                                <BookAppointmentIcon
                                  className=""
                                  aria-hidden="true"
                                />
                              </span>
                              Reschedule
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-x-4">
                      {item?.billDeatils?.map((l) => (
                        <div
                          key={l.labType}
                          className="flex px-4 py-5 mt-4 bg-white rounded-lg w-80"
                        >
                          <div className="flex-col items-start justify-between w-full gap-5 rounded-lg sm:flex">
                            <div className="flex">
                              <div className="flex flex-col">
                                <div className="text-sm max-[375px]:text-base font-bold text-gray-800 uppercase leading-none pb-2">
                                  {l.labType}
                                </div>
                                {l?.doctName && (
                                  <div className="">
                                    {/* <div className="text-center">
                                                    <p className="font-semibold text-gray-800 text-md">Dr. </p>
                                                </div> */}
                                    <div className="flex flex-wrap items-center gap-1">
                                      <p className="text-base max-[375px]:text-sm text-blue-600 font-semibold">
                                        Dr. {`${l.doctName}`}
                                      </p>
                                      <p className="text-sm font-medium text-orange-600">{`(${l.speciality})`}</p>
                                    </div>
                                  </div>
                                )}
                                <ul className="ml-5 text-orange-600">
                                  {l.testName.map((f, index) => (
                                    <li
                                      className="list-disc list-disclosure-close"
                                      key={index}
                                    >
                                      <span className="text-xs font-semibold text-orange-600">
                                        {f.testName}
                                      </span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                            {(item.buttonType || "").toLowerCase() ===
                              "pdf" && (
                              <div className="w-full flex items-center max-[375px]:flex-col sm:mt-0 mt-5 gap-3">
                                <button
                                  onClick={() =>
                                    setViewPdf({ open: true, dt: l })
                                  }
                                  className="w-full flex items-center justify-center rounded-lg bg-white ring-1 ring-gray-300 active:bg-gray-100 px-2 sm:px-3 py-2 sm:py-2.5 text-sm font-semibold text-gray-700 hover:shadow-sm gap-2"
                                >
                                  <span className="icon-20">
                                    <ViewEyeIcon />
                                  </span>
                                  View
                                </button>
                                <button
                                  onClick={() =>
                                    downLoadPdf(l.tranNo, l.labCode)
                                  }
                                  className="w-full flex items-center justify-center rounded-lg bg-blue-600 px-2 sm:px-3 py-2 sm:py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 gap-2"
                                >
                                  <span className="icon-20">
                                    <CloudDownloadIcon />
                                  </span>
                                  Download
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

const getFlagContainerColor = (flag = "") => {
  switch (flag.toLowerCase()) {
    case "consultations":
      return "bg-purple-600/10";

    case "appointments":
      return "bg-orange-600/10";

    case "opbills":
      return "bg-green-600/10";

    case "OPBILL":
      return "bg-green-600/10";

    case "labs":
      return "bg-yellow-600/10";

    case "ipbills":
      return "bg-blue-600/10";

    default:
      return "";
  }
};

const getHeader = (flag = "") => {
  switch (flag.toLowerCase()) {
    case "opbills":
      return "Outpatient";
    case "appointments":
      return "Appointment";
    case "ipbills":
      return "Inpatient";
    default:
      return "";
  }
};

const FlagIcon = ({ flag = "" }) => {
  switch (flag.toLowerCase()) {
    case "consultations":
      return (
        <span className="bg-purple-600 max-[480px]:w-10 max-[480px]:h-10 h-11 w-11 rounded-full flex items-center justify-center">
          <ConsultationIcon
            cssclass="max-[480px]:w-7 max-[480px]:h-7 h-8 w-8 text-white"
            aria-hidden="true"
          />
        </span>
      );
    case "appointments":
      return (
        <span className="bg-orange-600 max-[480px]:w-10 max-[480px]:h-10 h-11 w-11 rounded-full flex items-center justify-center">
          <AppointmentIcon
            cssclass="max-[480px]:w-6 max-[480px]:h-6 h-7 w-7 text-white"
            aria-hidden="true"
          />
        </span>
      );
    case "opbills":
    case "opbill":
      return (
        <span className="bg-green-600 max-[480px]:w-10 max-[480px]:h-10 h-11 w-11 rounded-full flex items-center justify-center">
          <OPIcon cssclass="h-7 w-7 text-white" aria-hidden="true" />
        </span>
      );
    case "labs":
      return (
        <span className="bg-yellow-600 max-[480px]:w-10 max-[480px]:h-10 h-11 w-11 rounded-full flex items-center justify-center">
          <LabReportIcon
            cssclass="max-[480px]:w-8 max-[480px]:h-8 h-9 w-9 text-white"
            aria-hidden="true"
          />
        </span>
      );
    case "ipbills":
    case "inpatient-ongoing":
      return (
        <span className="bg-blue-600 max-[480px]:w-10 max-[480px]:h-10 h-11 w-11 rounded-full flex items-center justify-center">
          <IPIcon
            cssclass="max-[480px]:w-7 max-[480px]:h-7 h-8 w-8 text-white"
            aria-hidden="true"
          />
        </span>
      );
    default:
      return null;
  }
};
