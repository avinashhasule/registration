"use client";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  ArrowLeftIcon,
} from "@/components/Icons";
import Select from "react-select";
import { use, useCallback, useEffect, useMemo, useState } from "react";

import { ToastType, useToast } from "@/hooks/useToast";
import LinearLoader from "@/components/LinearLoader";
import { apihelper } from "@/utils/Client";
import ConfirmSubmitModel from "../ConfirmSubmitModal";
import Toast from "@/components/Toast";
import { useRouter } from "next/navigation";
import "../../../../assets/datepicker.css";
import { DoctorCard } from "./DoctorCard";
import moment from "moment";

export default function Appointment(props) {
  const router = useRouter();
  const MRNO = props?.params?.id[0] || "";
  const DOCT_ID = props?.params?.id[1] || "";
  const APPT_ID = props?.params?.id[2] || "";
  const [expanded, setExpanded] = useState(false);
  const { toastProp, setToastProp, closeToast } = useToast();
  const [loader, setLoader] = useState(false);
  const [doctorsSpeciality, setDoctorsSpeciality] = useState([]);
  const [formData, setFormData] = useState({});
  const [drList, setDrList] = useState([]);
  const [modal, setModal] = useState(false);
  const [doctorList, setDoctorList] = useState([]);
  const [filteredDoctorList, setFilteredDoctorList] = useState(null);

  const toggleExpanded = () => {
    if (expanded && !formData.doctorId && !formData.clinicId) {
      setFilteredDoctorList(null);
    }
    setExpanded((current) => !current);
  };

  const getDoctorsSpeciality = useCallback(async () => {
    setLoader(true);
    const response = await apihelper("patientportal/Schedule/specialitylist");
    if (response.success) {
      const sortedDta = response.success.map(({ id, name }) => ({
        value: id,
        label: name,
      }));
      setDoctorsSpeciality(sortedDta);
      const drResponse = await apihelper(
        "patientportal/schedule/GetDrForAppointment/"
      );
      if (drResponse.success) {
        setDrList(
          drResponse.success.map((l) => ({
            label: l.doctName,
            value: l.doctorId,
            ...l,
          }))
        );
      } else {
        setToastProp({
          show: true,
          header: response?.error?.message || "Something went wrong.",
          type: ToastType.ERROR,
        });
      }
    } else {
      setToastProp({
        show: true,
        header: response?.error?.message || "Something went wrong.",
        type: ToastType.ERROR,
      });
    }
    setLoader(false);
  }, [setToastProp]);

  const bookAppointment = async (inputData) => {
    setLoader(true);
    const apptDate = moment(inputData.dateValue).format("YYYY-MM-DD");
    if (apptDate && new Date() > new Date(`${apptDate} ${inputData.slot}`)) {
      setToastProp({
        show: true,
        header: "Sorry, past date/time appoitment booking is not allowed",
        type: ToastType.ERROR,
      });
      setModal({});
      setLoader(false);
      return;
    }
    const response = await apihelper(
      "patientportal/Schedule/addOrRescheduleAppointment",
      {
        method: "POST",
        headers: {},
        data: {
          mrno: MRNO,
          appointmentId: APPT_ID || undefined,
          appointmentDate: apptDate,
          fromTime: inputData.slot,
          doctorCode: inputData.doctCode,
          clinicCode: inputData.code,
          toTime: inputData.toTime,
          doctorId: inputData.doctorId,
          clinicId: inputData.clinicId,
          doctorName: inputData.doctName,
          clinicName: inputData.name,
          reason: "",
          statusChangeReason: inputData?.statusChangeReason,
        },
      }
    );
    if (response.status) {
      setLoader(false);
      setToastProp({
        show: true,
        header: ToastType.SUCCESS,
        body: response?.success?.message || "Appointment booked successfully",
        type: ToastType.SUCCESS,
      });
      setModal({});
      router.push(`/patient/details/${MRNO}`);
    } else {
      setModal({});
      setToastProp({
        show: true,
        header: response?.error?.message || "Something went wrong.",
        type: ToastType.ERROR,
      });
    }
    setLoader(false);
  };

  useEffect(() => {
    if (!doctorsSpeciality.length) getDoctorsSpeciality();
  }, [doctorsSpeciality, getDoctorsSpeciality]);

  useEffect(() => {
    if (DOCT_ID && drList.length) {
      const filteredDoctor = drList.filter(
        (a) => a.doctorId === parseInt(DOCT_ID)
      );
      setDoctorList(filteredDoctor);
    } else {
      setDoctorList(drList);
    }
  }, [drList, DOCT_ID]);

  const getSpeciaityList = useMemo(() => {
    if (!formData.doctorId) {
      return doctorsSpeciality;
    }
    const currClinicIds = drList.filter(
      ({ value }) => value == formData.doctorId
    );
    return doctorsSpeciality.filter(({ value }) =>
      formData.doctorId
        ? currClinicIds?.find(({ clinicId }) => value == clinicId)
        : true
    );
  }, [drList, doctorsSpeciality, formData.doctorId]);

  useEffect(() => {
    if (formData.doctorId && !formData.clinicId) {
      setFormData((prev) => ({
        ...prev,
        clinicId: getSpeciaityList.length ? getSpeciaityList[0].value : "",
      }));
    }
  }, [formData.doctorId, formData.clinicId, getSpeciaityList, setFormData]);

  const searchDrbySpeciality = () => {
    let tempDr = [...drList];
    if (formData.doctorId) {
      tempDr = [...drList].filter((l) =>
        l.doctorId === formData.doctorId && formData.clinicId
          ? l.clinicId === formData.clinicId
          : l.doctorId === formData.doctorId
      );
    } else if (formData.clinicId) {
      tempDr = [...drList].filter((l) => l.clinicId === formData.clinicId);
    }
    setFilteredDoctorList(tempDr);
    toggleExpanded();
  };

  const onSpecialityChange = useCallback(
    (value, { action, name }) => {
      if (action === "clear") {
        setFormData((prev) => ({
          ...prev,
          [name]: value?.value,
          doctorId: "",
        }));
      } else
        setFormData((prev) => ({
          ...prev,
          [name]: value?.value,
        }));
    },
    [setFormData]
  );

  const onDoctorChange = useCallback(
    (value, action) => {
      setFormData((prev) => ({
        ...prev,
        doctorId: value?.value || "",
      }));
    },
    [setFormData]
  );

  const getDoctorList = useMemo(() => {
    if (formData.clinicId) {
      return doctorList.filter(({ clinicId }) =>
        formData.clinicId ? clinicId === formData.clinicId : true
      );
    } else {
      return [
        ...new Map(doctorList.map((item) => [item.value, item])).values(),
      ];
    }
  }, [doctorList, formData.clinicId]);

  const getDoctorValue = useMemo(() => {
    if (!formData.doctorId) {
      return [];
    }
    return getDoctorList.find(({ value }) => {
      return value === formData.doctorId;
    });
  }, [formData.doctorId, getDoctorList]);

  const doctorCardList = useMemo(() => {
    if (expanded && !filteredDoctorList) return doctorList;
    if ((filteredDoctorList || []).length) return filteredDoctorList;
    return doctorList.filter((doc) =>
      formData.doctorId
        ? doc.value === formData.doctorId
        : true && formData.clinicId
        ? doc.clinicId === formData.clinicId
        : true && !expanded
    );
  }, [
    doctorList,
    formData.doctorId,
    formData.clinicId,
    filteredDoctorList,
    expanded,
  ]);

  const doctorLabel =
    doctorCardList.length === 1
      ? `${doctorCardList.length} DOCTOR AVAILABLE`
      : `${doctorCardList.length} DOCTORS AVAILABLE`;

  return (
    <div className="flex flex-col justify-between min-h-[calc(100vh-53px)] relative overflow-hidden pt-20 bg-white">
      {loader && <LinearLoader />}
      {toastProp.show && <Toast {...toastProp} closeToast={closeToast} />}
      {modal.open && (
        <ConfirmSubmitModel
          isReschedule={!!APPT_ID}
          bookConfirm={bookAppointment}
          toggleModal={setModal}
          dt={modal.data}
        />
      )}
      <div className="h-[calc(100vh-134px)] internal-scroll overflow-auto pb-4">
        <div className="w-full max-w-lg mx-auto">
          <div className="relative">
            <div className="sticky top-0 z-20 bg-white">
              <div className="flex max-[400px]:flex-col justify-between max-[400px]:items-start items-center gap-5 pt-6 pb-4 sm:pb-6 px-6 max-[375px]:px-4">
                <div className="flex items-center">
                  <button
                    type="button"
                    onClick={() => router.push("/patient")}
                    className="relative -ml-px inline-flex items-center gap-x-1.5 rounded-lg mr-3 p-1.5 text-sm font-semibold text-gray-800 bg-gray-100 border shadow-sm hover:shadow-md ease-in duration-300"
                  >
                    <span className="icon-20">
                      <ArrowLeftIcon />
                    </span>
                  </button>
                  <h1 className="text-lg font-semibold text-gray-800 md:text-xl">
                    Doctors List
                  </h1>
                </div>
                {!DOCT_ID && (
                  <div className="max-[400px]:w-full">
                    <button
                      onClick={() => {
                        toggleExpanded();
                      }}
                      className={`border border-gray-300 rounded-lg items-center select-none flex justify-between flex-row gap-2 px-1.5 py-0.5 cursor-pointer max-[400px]:w-full ${
                        expanded ? "bg-gray-700 text-white " : "text-gray-700"
                      }`}
                    >
                      <h6 className="flex items-center text-sm font-medium leading-5 ps-1.5">
                        Find a Doctor
                      </h6>
                      <div className="flex-none">
                        <span className="flex items-center justify-center w-8 h-8 rounded-lg">
                          {expanded ? <ChevronUpIcon /> : <ChevronDownIcon />}
                        </span>
                      </div>
                    </button>
                    <div
                      className={`rounded-lg max-[375px]:mx-4 mx-6 mt-2 transition-[max-height] duration-500 ease-in bg-gray-700 absolute top-auto left-0 right-0 z-10 ${
                        expanded ? "max-h-64" : "max-h-0 overflow-hidden"
                      }`}
                    >
                      <div
                        className={`py-5 px-4 space-y-4 transition-all duration-500 ease-in ${
                          expanded ? "opacity-100" : "opacity-0"
                        }`}
                      >
                        <div className="form-item">
                          <Select
                            options={getSpeciaityList}
                            className={"basic-single font-normal"}
                            placeholder="Speciality"
                            isLoading={false}
                            isClearable={true}
                            name="clinicId"
                            value={
                              doctorsSpeciality.find(
                                (item) => item.value === formData["clinicId"]
                              ) || []
                            }
                            onChange={onSpecialityChange}
                          />
                        </div>
                        <div className="form-item">
                          <Select
                            options={getDoctorList}
                            className={"basic-single font-normal"}
                            placeholder="Doctor Name"
                            isLoading={false}
                            isClearable={true}
                            name="doctorId"
                            value={getDoctorValue}
                            onChange={onDoctorChange}
                          />
                        </div>
                        <div className="">
                          <button
                            type="button"
                            onClick={searchDrbySpeciality}
                            className="w-full rounded-lg bg-blue-600 px-3 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 capitalize"
                          >
                            Search
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div className="flex items-center justify-center px-4 py-1.5 bg-gray-200 rounded-lg mx-6 max-[375px]:mx-4">
                <h6 className="flex-1 text-center sm:text-sm text-[12px] font-medium leading-6 text-gray-500 uppercase">
                  {doctorList.length ? doctorLabel : "No Doctors Available"}
                </h6>
              </div>
            </div>
            <div className="grid md:gap-5 gap-4 mt-4 px-6 max-[375px]:px-4">
              {doctorCardList.map((doc) => (
                <DoctorCard
                  key={`${doc.label}-${doc.clinicId}-${doc.doctorId}-${doc.name}`}
                  cardData={doc}
                  setLoader={setLoader}
                  toggleModal={setModal}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
