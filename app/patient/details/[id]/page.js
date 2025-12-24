"use client";
import {
  EditIcon,
  ArrowLeftIcon,
  BookAppointmentIcon,
} from "@/components/Icons";
import LinearLoader from "@/components/LinearLoader";
import { apihelper } from "@/utils/Client";
import { useCallback, useEffect, useMemo, useState } from "react";
import { usePatient } from "@/context/PatientContext";
import { useRouter } from "next/navigation";
import { ToastType, useToast } from "@/hooks/useToast";
import dynamic from "next/dynamic";
import "../../../../assets/datepicker.css";
import moment from "moment";
import { ExampleCustom1, isToday } from "@/utils/CommonFunc";
import ReactDatePicker from "react-datepicker";
import Toast from "@/components/Toast";

const History = dynamic(() => import("./History"), { ssr: false });

export default function PatientView(props) {
  const [loading, setLoading] = useState(false);
  const [historyData, setHistoryData] = useState([]);
  const [masterFilter, setMasterFilter] = useState([]);
  const [tags, setTags] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const { patient } = usePatient();
  const { setToastProp, toastProp, closeToast } = useToast();
  const router = useRouter();
  const [isDeceased, setIsDeceased] = useState(
    () => patient?.isDeceased || false
  );

  const getPatientHistoricalData = useCallback(
    async (mrNO, selectedDate = null) => {
      setLoading(true);
      if (Object.keys(patient).length === 0) {
        const response = await apihelper(
          `patientportal/Hospital/getPatientByMRNO/${mrNO}`
        );
        if (response.status) {
          if (response.success.length)
            setIsDeceased(response.success[0].isDeceased);
        }
      }
      const response = await apihelper(
        selectedDate
          ? `patientportal/Hospital/getPatientDetailsByMRNO/${mrNO}?date=${moment(
              selectedDate
            ).format("DD/MM/YYYY")}`
          : `patientportal/Hospital/getPatientDetailsByMRNO/${mrNO}`
      );
      if (response.status) {
        const sortedData = response.success
          .map((a) => ({
            ...a,
            trandatetime:
              a.tranDate &&
              a.tranTime &&
              moment(
                `${a.tranDate?.trim()} ${a.tranTime?.trim()}`,
                "DD/MM/YYYY HH:mm:ss"
              ),
          }))
          .sort((a, b) => {
            if (b.trandatetime && a.trandatetime)
              return moment(b.trandatetime) - moment(a.trandatetime);
            return 0;
          })
          .filter((a) => a.tranNo !== null);
        const flags = [];
        if (sortedData.length > 0) {
          sortedData.forEach((e) => {
            if (flags.find((l) => l.flag === e["flag"])) {
              if (e?.billDeatils?.length > 0) {
                const bills = e.billDeatils.map((l) => l.labType);
                flags.forEach((p, i) => {
                  if (p.flag === e["flag"]) {
                    flags[i] = { ...p, children: bills };
                  } else {
                    flags[i] = { ...p };
                  }
                });
              }
            } else {
              flags.push({ flag: e["flag"] });
            }
          });
        }
        setHistoryData(sortedData);
        if (flags.length > 1) setTags(flags);
        else setTags([]);
      } else {
        setToastProp({
          show: true,
          header: response?.error?.message || "Something went wrong.",
          type: ToastType.ERROR,
        });
      }
      setLoading(false);
    },
    [patient, setToastProp]
  );

  useEffect(() => {
    if (props?.params?.id) {
      getPatientHistoricalData(props?.params?.id);
    }
  }, [props?.params?.id, getPatientHistoricalData]);

  const handleFilterChange = useCallback(
    (flag) => {
      let tempFilter = [...masterFilter];
      if (masterFilter.indexOf(flag) > -1) {
        setMasterFilter(tempFilter.filter((l) => l !== flag));
      } else {
        setMasterFilter([...tempFilter, flag]);
      }
    },
    [masterFilter]
  );

  const clearFilter = useCallback(() => {
    setMasterFilter([]);
    if (startDate) {
      setStartDate(null);
      getPatientHistoricalData(patient.mrno || props?.params?.id);
    }
  }, [startDate, getPatientHistoricalData, patient.mrno, props?.params?.id]);

  const filteredHistoryData = useMemo(() => {
    if (masterFilter.length === 0) return historyData;
    return historyData.filter((l) => masterFilter.indexOf(l.flag) > -1);
  }, [historyData, masterFilter]);

  return (
    <>
      {loading && <LinearLoader />}
      {toastProp.show && <Toast {...toastProp} closeToast={closeToast} />}
      <div className="flex flex-col justify-between min-h-[calc(100vh-53px)] relative overflow-hidden pt-20 bg-white">
        <div className="max-h-[calc(100vh-134px)] internal-scroll overflow-auto px-6 max-[375px]:px-4 pb-4">
          <div className="max-w-7xl xl:px-4 w-full mx-auto mb-4">
            <div className="relative">
              <div className="sticky top-0 bg-white z-20">
                <div className="flex items-start justify-between mb-5 pt-6 pb-5 border-b">
                  <div className="flex items-start">
                    <button
                      type="button"
                      onClick={() => router.push("/patient")}
                      className="relative -ml-px inline-flex items-center gap-x-1.5 rounded-lg mr-3 sm:p-2 p-1.5 text-sm font-semibold text-gray-800 bg-gray-100 border shadow-sm hover:shadow-md ease-in duration-300"
                    >
                      <span className="icon-20">
                        <ArrowLeftIcon />
                      </span>
                    </button>
                    <div>
                      <h1 className="text-lg md:text-xl font-semibold text-gray-800">
                        Patient Details
                      </h1>
                      <div className="flex max-[400px]:items-start font-medium items-center max-[480px]:gap-2 gap-3 max-[400px]:gap-0.5 pt-1 max-[400px]:flex-col">
                        <div className="max-[480px]:text-[12px] text-sm text-gray-500 capitalize">
                          {patient?.firstName} {patient?.middleName}{" "}
                          {patient?.lastName}
                        </div>
                        <div className="max-[480px]:text-[12px] text-sm text-gray-500 max-[400px]:border-0 border-l border-gray-300 max-[480px]:ps-2 ps-3 max-[400px]:ps-0">
                          <span>
                            MR NO: {patient?.mrno || props?.params?.id}
                          </span>
                        </div>
                        {isDeceased && (
                          <div className="max-[480px]:text-[12px] text-sm text-red-500 max-[400px]:border-0 border-l border-gray-300 max-[480px]:ps-2 ps-3 max-[400px]:ps-0">
                            <span>Deceased</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  {!isDeceased && (
                    <div className="flex items-center gap-3 sm:gap-4">
                      <button
                        className="inline-flex items-center rounded-lg bg-white ring-1 ring-gray-300 active:bg-gray-100 px-2 sm:px-3 py-2 sm:py-2.5 text-sm font-semibold text-gray-700 hover:shadow-sm gap-2 icon-20"
                        onClick={() =>
                          router.push(`/patient/${props?.params?.id}`)
                        }
                      >
                        <EditIcon className="" aria-hidden="true" />
                        <span className="sm:block hidden">Edit Patient</span>
                      </button>
                      <button
                        className="inline-flex items-center rounded-lg bg-blue-600 px-2 sm:px-3 py-2 sm:py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 gap-2 icon-20"
                        onClick={() => {
                          router.push(
                            `/patient/appointment/${props?.params?.id}`
                          );
                        }}
                      >
                        <BookAppointmentIcon className="" aria-hidden="true" />
                        <span className="sm:block hidden">
                          Schedule Appointment
                        </span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
            {/* <div className="bg-red-50 p-4 pr-5 rounded-lg text-sm font-normal text-red-600 text-justify">
                    We apologize for any inconvenience caused. We&apos;re currently
                    improving our appointment booking system to provide better
                    service. During this upgrade, online booking is temporarily
                    unavailable. <strong className="md:grid md:grid-cols-3 block py-2"> 
                    <span className="col-span-full">Please call the following numbers to schedule your appointments:</span>
                    <div className="flex gap-3 pt-2">
                      <span className="w-14">Thane:</span>
                      <div>
                        <p> +91-22 2172 5555</p><p> +91-22 6297 5555</p> 
                      </div>
                    </div>
                    <div className="flex gap-3 pt-2">
                        <span className="w-14">Pune:</span>
                        <div><p>+91-20-2799 2799</p> <p>+91-20-6637 5555</p></div>
                      </div>
                    <div className="flex gap-3 pt-2">
                      <span className="w-14">Indore:</span>
                      <div><p>+91-73 1471 8111</p></div>
                    </div> 
                    </strong> 
                    Thank you for your understanding as we work to enhance your
                    experience.
                </div> */}
            <div className="pt-4">
              <div className="flex max-[575px]:flex-col items-start justify-between gap-2 pb-4 max-[575px]:pl-0 pl-16">
                <div className="flex items-center flex-wrap gap-2 max-[575px]:w-auto w-3/4">
                  {tags.length > 0 &&
                    tags.map(({ flag }, index) => (
                      <button
                        key={`${index}-${flag}`}
                        onClick={() => handleFilterChange(flag)}
                        className={`${
                          masterFilter.find((l) => l === flag)
                            ? "border-blue-600 bg-blue-600 hover:bg-blue-600 text-white"
                            : "border-gray-300 text-gray-600 hover:bg-gray-50"
                        } border center relative inline-block select-none whitespace-nowrap rounded-lg py-2 px-3.5 align-baseline text-xs font-medium uppercase leading-[14px]`}
                      >
                        {flag}
                      </button>
                    ))}
                </div>
                <div className="flex items-center flex-nowrap gap-2">
                  {!loading && (
                    <div className="text-[13px] font-medium text-gray-700 art-date cursor-pointer flex justify-end pd-datepicker">
                      <ReactDatePicker
                        selected={startDate}
                        onChange={(date) => {
                          setStartDate(date);
                          getPatientHistoricalData(
                            patient.mrno || props?.params?.id,
                            date
                          );
                        }}
                        customInput={
                          <ExampleCustom1
                            startDate={startDate}
                            idToda={isToday(startDate)}
                          />
                        }
                      />
                    </div>
                  )}
                  {(masterFilter.length > 0 || startDate) && (
                    <button
                      onClick={clearFilter}
                      className={
                        "border border-red-500 hover:bg-red-600 center relative inline-block select-none whitespace-nowrap rounded-lg py-2 px-3.5 align-baseline text-xs font-bold uppercase leading-[14px] text-red-600 hover:text-white"
                      }
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>
              <div>
                {historyData.length > 0 && (
                  <History
                    getPatientHistoricalData={getPatientHistoricalData}
                    setLoading={setLoading}
                    mrNo={patient.mrno || props?.params?.id}
                    historyData={filteredHistoryData}
                    isDeceased={isDeceased}
                  />
                )}
              </div>
              <div className="text-center text-gray-500 mt-6">
                {!loading && historyData.length === 0 && (
                  <>Historical Data Not Found</>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
