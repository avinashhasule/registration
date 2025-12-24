"use client";
import { GENDER_LIST, PATIENT_FORM_SCHEMA } from "@/utils/Constant";
import { useCallback, useEffect, useMemo, useState } from "react";
import ShowError from "@/components/ShowError";
import Select from "react-select";
import {
  NO_DAYS_LIST,
  camelize,
  classNames,
  getAge,
  getMasterDropDownList,
  scrollTo,
} from "@/utils/CommonFunc";
import useForm from "@/hooks/useForm";
import { useRouter } from "next/navigation";
import { apihelper } from "@/utils/Client";
import LinearLoader from "@/components/LinearLoader";
import Toast from "@/components/Toast";
import { ToastType, useToast } from "@/hooks/useToast";
import { usePatient } from "@/context/PatientContext";
import { useMaster } from "@/context/MastersProvider";
import { useAuth } from "@/context/AuthProvider";

export default function AddEditPatient(props) {
  const MRNO = props?.params?.id || "";
  const router = useRouter();
  const { patient, setPatient } = usePatient();
  const { toastProp, setToastProp, closeToast } = useToast();
  const { masters, setMasters } = useMaster();
  const [loader, setLoader] = useState(false);
  const [genderList, setGenderList] = useState(GENDER_LIST);
  const [futureDateError, setFutureDateError] = useState("");
  const [dayslist, _] = useState(() =>
    NO_DAYS_LIST.map((item) => ({
      value: item,
      label: item,
    }))
  );
  const { user } = useAuth();

  const {
    handleInputChange,
    handleSelectChange,
    validateForm,
    formData,
    setFormData,
    error,
    setError,
  } = useForm({
    ...patient,
    mobile: user?.mobileNumber,
    whatsappmobile: user?.mobileNumber,
  });

  const onSalutationChange = (value, action) => {
    if (!patient.gender) {
      setFormData({
        ...formData,
        gender: value.restProps.defasex,
        [action.name]: value?.value,
      });
      setError({ ...error, [action.name]: [], gender: [] });
    } else {
      handleSelectChange(value, action);
    }
  };

  useEffect(() => {
    if (user?.mobileNumber && !formData.mobile)
      setFormData({
        ...formData,
        mobile: user?.mobileNumber,
        whatsappmobile: user?.mobileNumber,
      });
  }, [user, formData, setFormData]);

  useEffect(() => {
    if (formData.title === "005") {
      setGenderList(GENDER_LIST.filter((l) => l.id !== "O"));
    } else {
      setGenderList(GENDER_LIST);
    }
  }, [formData.title]);

  useEffect(() => {
    const getMasters = async () => {
      setLoader(true);
      const response = await apihelper("patientportal/Masters/getMasters");
      if (response.status) {
        setMasters(response.success);
      } else
        setToastProp({
          show: true,
          header: response?.error?.message || "Something went wrong.",
          type: ToastType.ERROR,
        });
      setLoader(false);
    };
    if (!masters) getMasters();
  }, [masters, setMasters, setToastProp]);

  const getValueByName = useCallback((name, list) => {
    return list.find((item) => item.label == name)?.value || null;
  }, []);

  const stateList = useMemo(() => {
    return getMasterDropDownList("State", masters);
  }, [masters]);

  const districtList = useMemo(() => {
    return getMasterDropDownList("District", masters);
  }, [masters]);

  const getPatientData = useCallback(
    (patient) => {
      const age = getAge(
        `${patient.yearOfBirth}-${patient.monthOfBirth}-${patient.dayOfBirth}`
      );
      let title = patient.title;
      if (age && !patient.mrno) {
        if (patient.gender === "M") {
          title = age <= 18 ? "004" : "001";
        } else if (patient.gender === "F") {
          title = age <= 18 ? "003" : "002";
        }
      }
      return {
        ...patient,
        title: title,
        district: patient.districtName
          ? getValueByName(patient.districtName, districtList)
          : patient.district,
        state: patient.stateName
          ? getValueByName(patient.stateName, stateList)
          : patient.state,
      };
    },
    [districtList, getValueByName, stateList]
  );

  useEffect(() => {
    if (Object.keys(patient).length && masters) {
      setFormData(getPatientData(patient));
    }
  }, [patient, masters, setFormData, getPatientData]);

  useEffect(() => {
    if (
      Object.keys(patient).length === 0 &&
      MRNO &&
      MRNO.toLowerCase() !== "create"
    ) {
      const getPatientDataByMRNO = async () => {
        setLoader(true);
        const response = await apihelper(
          `patientportal/Hospital/getPatientByMRNO/${MRNO}`
        );
        if (response.status) {
          const patient = response.success[0] || {};
          setFormData((prev) => ({
            ...prev,
            mrno: patient.mrno,
            firstName: patient.patfname,
            middleName: patient.patmname,
            lastName: patient.patlname,
            dayOfBirth: patient.patdob.substring(6, 8),
            monthOfBirth: patient.patdob.substring(4, 6),
            yearOfBirth: patient.patdob.substring(0, 4),
            gender: patient.patsex,
            mobile: patient.patmobile,
            whatsappmobile: patient.whatsappnumber,
            emailAddress: patient.patemail,
            bldgname: patient.pataddR1,
            streetaddress: patient.pataddR2,
            area: patient.areaid,
            city: patient.cityid,
            district: patient.districtid,
            state: patient.regionid,
            country: patient.countryid,
            nationality: patient.nationality,
            pincode: patient.zip,
            title: patient.salutation,
            nextofkin: patient.nextofkin,
            nextofkinrelation: patient.nextofkinrelation,
            nickName: patient.nickName,
            occupation: patient.occupation,
          }));
        } else
          setToastProp({
            show: true,
            header: response?.error?.message || "Something went wrong.",
            type: ToastType.ERROR,
          });
        setLoader(false);
      };
      getPatientDataByMRNO();
    }
  }, [MRNO, setToastProp, setFormData, patient]);

  const countryList = useMemo(() => {
    return getMasterDropDownList("Country", masters);
  }, [masters]);
  const yearList = useMemo(() => {
    return getMasterDropDownList("Year", masters);
  }, [masters]);
  const areaList = useMemo(() => {
    return getMasterDropDownList("Area", masters);
  }, [masters]);
  const cityList = useMemo(() => {
    return getMasterDropDownList("City", masters);
  }, [masters]);
  const nationalityList = useMemo(() => {
    return getMasterDropDownList("Nationality", masters);
  }, [masters]);
  const salutationList = useMemo(() => {
    return getMasterDropDownList("Salutation", masters);
  }, [masters]);
  const monthList = useMemo(() => {
    return getMasterDropDownList("Month", masters);
  }, [masters]);

  const savePatient = useCallback(async () => {
    setLoader(true);
    const response = await apihelper("patientportal/Hospital/addPatients", {
      method: "POST",
      data: {
        ...(MRNO && MRNO.toLowerCase() !== "create" && { mrno: MRNO }),
        ...(formData.mrno && { mrno: formData.mrno }),
        ...(!formData.mrno && { campaigncode: formData.campaigncode }),
        firstName: formData.firstName || null,
        middleName: formData.middleName || null,
        lastName: formData.lastName || null,
        dayOfBirth: ("0" + formData.dayOfBirth || "").slice(-2) || null,
        monthOfBirth: ("0" + formData.monthOfBirth || "").slice(-2) || null,
        yearOfBirth: formData.yearOfBirth || null,
        gender: formData.gender || null,
        mobile: formData.mobile || null,
        whatsappmobile: formData.whatsappmobile || null,
        emailAddress: formData.emailAddress || "",
        bldgname: formData.bldgname || null,
        streetaddress: formData.streetaddress || null,
        area: formData.area || null,
        city: formData.city || "",
        district: formData.district || "",
        state: formData.state || null,
        country: formData.country || "",
        nationality: formData.nationality,
        pincode: formData.pincode || null,
        title: formData.title || null,
        nextofkin: formData.nextofkin || null,
        nextofkinrelation: formData.nextofkinrelation || null,
        nickName: formData.nickName || null,
        occupation: formData.occupation || "",
      },
    });
    if (response.status) {
      setLoader(false);
      setToastProp({
        show: true,
        title: "Success",
        header: formData.mrno
          ? "Patient details updated successfully."
          : "Patient details added successfully.",
        type: ToastType.SUCCESS,
      });
      setPatient({});
      router.push("/patient");
      return;
    }
    setLoader(false);
    setToastProp({
      show: true,
      header: response?.error?.message || "Something went wrong.",
      type: ToastType.ERROR,
    });
  }, [formData, router, setToastProp, MRNO, setPatient]);

  const handleFormSubmit = () => {
    const errorObject = validateForm(PATIENT_FORM_SCHEMA);

    const { dayOfBirth, monthOfBirth, yearOfBirth } = formData;
    let dateFlag = false;
    if (dayOfBirth && monthOfBirth && yearOfBirth) {
      const birthDate = new Date(
        `${monthOfBirth}-${dayOfBirth}-${yearOfBirth}`
      );
      let now = new Date();
      if (birthDate > now) {
        setFutureDateError("Please select valid Date of Birth");
        dateFlag = true;
      }
    }

    if (Object.keys(errorObject).length > 0 || dateFlag) {
      scrollTo(
        Object.keys(errorObject).length > 0
          ? errorObject
          : { dayOfBirth: "error" }
      );
      return;
    }
    savePatient();
  };

  const onCityChange = (value, action) => {
    if (action.action === "clear") {
      setFormData((prev) => ({
        ...prev,
        [action.name]: "",
      }));
    }
    if (value) {
      const lfdc = cityList.find((l) => l.value == value.value);
      if (lfdc.restProps) {
        setFormData((prev) => ({
          ...prev,
          [action.name]: value.value,
          country: lfdc.restProps.councode,
          state: lfdc.restProps.regicode,
          district: lfdc.restProps.distcode,
        }));
      }
    }
    if (error[action.name]) setError({ ...error, [action.name]: [] });
  };

  const onDistrictChange = (value, action) => {
    if (action.action === "clear") {
      setFormData((prev) => ({
        ...prev,
        [action.name]: "",
      }));
    }
    if (value) {
      const lfdc = cityList.find((l) => l.value == value.value);
      if (lfdc.restProps) {
        setFormData((prev) => ({
          ...prev,
          [action.name]: value.value,
          country: lfdc.restProps.councode,
          state: lfdc.restProps.regicode,
        }));
      }
    }
    if (error[action.name]) setError({ ...error, [action.name]: [] });
  };

  const onAreaChange = (value, action) => {
    if (action.action === "clear") {
      setFormData((prev) => ({
        ...prev,
        [action.name]: "",
      }));
    }
    if (value) {
      const lfdc = areaList.find((l) => l.value == value.value);
      if (lfdc.restProps) {
        setFormData((prev) => ({
          ...prev,
          [action.name]: value.value,
          country: lfdc.restProps.councode,
          state: lfdc.restProps.regicode,
          city: lfdc.restProps.citycode,
          district: lfdc.restProps.distcode,
        }));
      }
    }
    if (error[action.name]) setError({ ...error, [action.name]: [] });
  };

  const onNameChange = useCallback(
    (e) => {
      handleInputChange({
        target: {
          name: e.target.name,
          value: camelize(e.target.value).trim(),
        },
      });
    },
    [handleInputChange]
  );

  return (
    <div className="flex flex-col justify-between min-h-[calc(100vh-53px)] relative overflow-hidden pt-20 bg-white">
      {loader && <LinearLoader />}
      {toastProp.show && <Toast {...toastProp} closeToast={closeToast} />}
      <div className="max-h-[calc(100vh-210px)] internal-scroll overflow-auto px-6 max-[375px]:px-4 pb-2">
        <div className="w-full mx-auto mt-6 mb-4 max-w-7xl xl:px-4">
          <div className="relative">
            <div className="items-center justify-between block gap-2 lg:flex">
              <div className="relative">
                <h1 className="text-lg md:text-xl font-semibold text-gray-800">
                  Patient Registration
                </h1>
                <p className="mt-1 text-sm text-gray-500">
                  Complete our patient form for seamless visit.
                </p>
              </div>
              {patient.preferredAbhaAddress && patient.abhaNumber ? (
                <div className="w-full lg:w-auto flex max-[575px]:flex-col items-center gap-2.5 text-sm font-medium leading-6 text-gray-600 pt-2 lg:pt-0">
                  <p className="w-full px-3 py-1 text-orange-600 rounded-lg bg-orange-50">
                    {" "}
                    <span className="min-w-[100] block text-gray-500 font-normal">
                      ABHA Number:
                    </span>{" "}
                    {patient.abhaNumber}
                  </p>
                  <p className="w-full px-3 py-1 text-blue-800 rounded-lg bg-blue-50">
                    {" "}
                    <span className="min-w-[100] block text-gray-500 font-normal">
                      ABHA Address:
                    </span>{" "}
                    {patient.preferredAbhaAddress}
                  </p>
                </div>
              ) : (
                ""
              )}
            </div>
            <div className="grid gap-4 mt-6 sm:grid-cols-2 lg:grid-cols-3">
              {(!MRNO && !formData.mrno) ||
                (MRNO.toLowerCase() === "create" && (
                  <div className="col-span-1">
                    <label
                      htmlFor="campaigncode"
                      className="block text-sm font-medium leading-6 text-gray-600"
                    >
                      Campaign Code (If Available)
                    </label>
                    <div className="relative mt-2 form-item">
                      <input
                        type="text"
                        name="campaigncode"
                        id="campaigncode"
                        placeholder="Campaign Code"
                        value={formData["campaigncode"] || ""}
                        onChange={handleInputChange}
                        className={classNames(
                          "block w-full rounded-lg border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-blue-600 text-sm leading-6 font-medium",
                          error["campaigncode"]?.length > 0 &&
                            "ring-2 ring-red-500 focus:ring-red-600 rounded-lg"
                        )}
                      />
                      <ShowError error={error["campaigncode"]} />
                    </div>
                  </div>
                ))}
              <div className="col-span-1">
                <label
                  htmlFor="Campaign Code (If Available)"
                  className="block text-sm font-medium leading-6 text-gray-600"
                >
                  First name
                  <span className="ml-1 text-red-600">*</span>
                </label>
                <div
                  className={classNames(
                    "flex items-center shadow-sm ring-1 ring-gray-300 focus-within:ring-2 focus-within:ring-blue-600 relative mt-2 rounded-lg",
                    error["firstName"]?.length > 0 &&
                      "ring-2 ring-red-500 focus:ring-red-600 rounded-lg"
                  )}
                >
                  <div className="relative flex items-center">
                    <label htmlFor="firstName" className="sr-only">
                      First name
                    </label>
                    <Select
                      options={
                        patient.gender
                          ? salutationList.filter(
                              (l) => l.restProps.defasex === patient.gender
                            )
                          : salutationList
                      }
                      className={classNames(
                        "basic-single font-normal",
                        error["title"]?.length > 0 && "select-error"
                      )}
                      classNamePrefix="react-select-cntrl title"
                      placeholder="Title"
                      isDisabled={formData.mrno ? "disabled" : ""}
                      isLoading={false}
                      name={"title"}
                      id="title"
                      isClearable={false}
                      isSearchable={false}
                      closeMenuOnSelect={true}
                      value={
                        salutationList.find(
                          (item) => item.value === formData["title"]
                        ) || []
                      }
                      onChange={onSalutationChange}
                    />
                  </div>
                  <input
                    type="text"
                    name="firstName"
                    id="firstName"
                    autoComplete="true"
                    disabled={patient.firstName || formData.mrno}
                    placeholder="First Name"
                    value={formData["firstName"] || ""}
                    onChange={onNameChange}
                    className="block w-full py-2 text-sm font-medium leading-6 text-gray-900 rounded-none rounded-e-lg placeholder:text-gray-500"
                  />
                </div>
                <ShowError error={error["firstName"] || error["title"]} />
              </div>
              <div className="col-span-1">
                <label
                  htmlFor="middleName"
                  className="block text-sm font-medium leading-6 text-gray-600"
                >
                  Middle name
                </label>
                <div className="relative mt-2 form-item">
                  <input
                    type="text"
                    name="middleName"
                    id="middleName"
                    autoComplete="true"
                    disabled={patient.middleName || formData.mrno}
                    placeholder="Middle Name"
                    value={formData["middleName"] || ""}
                    onChange={onNameChange}
                    className={
                      "block w-full rounded-lg border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-blue-600 text-sm leading-6 font-medium"
                    }
                  />
                </div>
              </div>
              <div className="col-span-1">
                <label
                  htmlFor="lastName"
                  className="block text-sm font-medium leading-6 text-gray-600"
                >
                  Last name
                  <span className="ml-1 text-red-600">*</span>
                </label>
                <div className="relative mt-2 form-item">
                  <input
                    type="text"
                    name="lastName"
                    id="lastName"
                    autoComplete="true"
                    disabled={patient.lastName || formData.mrno}
                    placeholder="Last Name"
                    value={formData["lastName"] || ""}
                    onChange={onNameChange}
                    className={classNames(
                      "block w-full rounded-lg border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-blue-600 text-sm leading-6 font-medium",
                      error["lastName"]?.length > 0 &&
                        "ring-2 ring-red-500 focus:ring-red-600 rounded-lg"
                    )}
                  />
                  <ShowError error={error["lastName"]} />
                </div>
              </div>
              <div className="col-span-1">
                <label
                  htmlFor="nickName"
                  className="block text-sm font-medium leading-6 text-gray-600"
                >
                  Nick Name
                </label>
                <div className="relative mt-2 form-item">
                  <input
                    type="text"
                    name="nickName"
                    id="nickName"
                    // disabled={patient.nickName || formData.mrno}
                    placeholder="Nick Name"
                    value={formData["nickName"] || ""}
                    onChange={handleInputChange}
                    className={classNames(
                      "block w-full rounded-lg border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-blue-600 text-sm leading-6 font-medium",
                      error["nickName"]?.length > 0 &&
                        "ring-2 ring-red-500 focus:ring-red-600 rounded-lg"
                    )}
                  />
                  <ShowError error={error["nickName"]} />
                </div>
              </div>
              <div className="col-span-1">
                <div className="relative w-full">
                  <label
                    htmlFor="dateofbirth"
                    className="block text-sm font-medium leading-6 text-gray-600"
                  >
                    Date Of Birth
                    <span className="ml-1 text-red-600">*</span>
                  </label>
                  <div className="flex gap-2 mt-2 max-[480px]:flex-wrap">
                    <div className="relative w-full form-item">
                      <Select
                        options={dayslist}
                        className={classNames(
                          "basic-single font-normal",
                          (error["dayOfBirth"]?.length > 0 ||
                            futureDateError) &&
                            "select-error"
                        )}
                        classNamePrefix="react-select-cntrl calender"
                        placeholder={"DD"}
                        isLoading={false}
                        isClearable={true}
                        isDisabled={patient.dayOfBirth || formData.mrno}
                        isSearchable={true}
                        closeMenuOnSelect={true}
                        id="dayOfBirth"
                        name={"dayOfBirth"}
                        value={
                          dayslist.find(
                            (item) =>
                              item.value ===
                              ("0" + formData["dayOfBirth"]).slice(-2)
                          ) || []
                        }
                        onChange={(e, a) => {
                          handleSelectChange(e, a);
                          setFutureDateError("");
                        }}
                      />
                      <ShowError error={error["dayOfBirth"]} />
                    </div>
                    <div className="relative w-full form-item">
                      <Select
                        options={monthList}
                        className={classNames(
                          "basic-single font-normal",
                          (error["monthOfBirth"]?.length > 0 ||
                            futureDateError) &&
                            "select-error"
                        )}
                        classNamePrefix="react-select-cntrl calender"
                        placeholder={"MM"}
                        isLoading={false}
                        isClearable={true}
                        isSearchable={true}
                        isDisabled={patient.monthOfBirth || formData.mrno}
                        id="monthOfBirth"
                        closeMenuOnSelect={true}
                        name={"monthOfBirth"}
                        value={
                          monthList.find(
                            (item) =>
                              item.value ===
                              ("0" + formData["monthOfBirth"]).slice(-2)
                          ) || []
                        }
                        onChange={(e, a) => {
                          handleSelectChange(e, a);
                          setFutureDateError("");
                        }}
                      />
                      <ShowError error={error["monthOfBirth"]} />
                    </div>
                    <div className="relative w-full form-item">
                      <Select
                        options={(yearList || []).sort(
                          (a, b) => b.value - a.value
                        )}
                        className={classNames(
                          "basic-single font-normal",
                          (error["yearOfBirth"]?.length > 0 ||
                            futureDateError) &&
                            "select-error"
                        )}
                        classNamePrefix="react-select-cntrl calender"
                        placeholder={"YYYY"}
                        isLoading={false}
                        isClearable={true}
                        isDisabled={patient.yearOfBirth || formData.mrno}
                        isSearchable={true}
                        closeMenuOnSelect={true}
                        name={"yearOfBirth"}
                        id={"yearOfBirth"}
                        value={
                          yearList.find(
                            (item) => item.value === formData["yearOfBirth"]
                          ) || []
                        }
                        onChange={(e, a) => {
                          handleSelectChange(e, a);
                          setFutureDateError("");
                        }}
                      />
                      <ShowError error={error["yearOfBirth"]} />
                    </div>
                  </div>
                  <ShowError error={[futureDateError]} />
                </div>
              </div>
              <div className="col-span-1">
                <label
                  htmlFor=""
                  className="block text-sm font-medium leading-6 text-gray-600"
                >
                  Gender
                  <span className="ml-1 text-red-600">*</span>
                </label>
                <div className="relative mt-4 form-item">
                  <fieldset>
                    <legend className="sr-only">Gender</legend>
                    <div className="flex items-center space-x-4">
                      {genderList.map((next) => (
                        <div
                          key={next.id}
                          className={classNames("relative flex items-center")}
                          onClick={(event) => {
                            event.stopPropagation();
                            const inputEvent = {
                              target: {
                                name: "gender",
                                value: next.id,
                              },
                            };
                            formData["title"] === "005" &&
                              !formData.mrno &&
                              handleInputChange(inputEvent);
                          }}
                        >
                          <input
                            id="gender"
                            name="gender"
                            type="radio"
                            // disabled={
                            //   formData["title"] === "005" && next.id === "O"
                            //     ? "disabled"
                            //     : ""
                            // }
                            disabled={
                              formData["title"] !== "005" || formData.mrno
                                ? "disabled"
                                : ""
                            }
                            value={next.id}
                            checked={formData["gender"] === next.id}
                            // onChange={(event) => {
                            //   event.preventDefault();
                            //  formData["title"] === "005" && !formData.mrno && handleInputChange(event);
                            // }}
                            className={classNames(
                              "relative rounded border-gray-300 text-blue-600"
                            )}
                          />
                          <label
                            htmlFor={next.id}
                            disabled={
                              formData["title"] !== "005" || formData.mrno
                                ? "disabled"
                                : ""
                            }
                            className="ml-1 text-sm font-medium leading-6 text-gray-700 cursor-pointer"
                          >
                            {next.title}
                          </label>
                        </div>
                      ))}
                    </div>
                    <ShowError error={error["gender"]} />
                  </fieldset>
                </div>
              </div>
              <div className="col-span-1">
                <label
                  htmlFor="countryCode"
                  className="block text-sm font-medium leading-6 text-gray-600"
                >
                  Mobile Number
                  <span className="ml-1 text-red-600">*</span>
                </label>
                <div className="relative mt-2 form-item">
                  <div className="absolute inset-y-0 left-0 flex items-center h-10">
                    <label htmlFor="countryCode" className="sr-only">
                      Country Code
                    </label>
                    <select
                      id="countryCode"
                      name="countryCode"
                      // autoComplete="countryCode"
                      disabled={true}
                      className={classNames(
                        "rounded-md border-0 bg-transparent py-0 pl-2 pr-0 text-gray-500 focus:outline-none text-sm"
                      )}
                    >
                      <option>+91</option>
                    </select>
                  </div>
                  <input
                    type="text"
                    name="mobile"
                    id="mobile"
                    maxLength={10}
                    placeholder="Mobile Number"
                    value={formData?.mobile || ""}
                    // onChange={handleInputChange}
                    disabled={true}
                    className={classNames(
                      "block w-full rounded-lg border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-blue-600 text-sm leading-6 font-medium pl-16",
                      error["mobile"]?.length > 0 &&
                        "ring-2 ring-red-500 focus:ring-red-600 rounded-lg"
                    )}
                  />
                  <ShowError error={error["mobile"]} />
                </div>
              </div>
              <div className="col-span-1">
                <label
                  htmlFor="whatsappmobile"
                  className="block text-sm font-medium leading-6 text-gray-600"
                >
                  Whats App Number
                  <span className="ml-1 text-red-600">*</span>
                </label>
                <div className="relative mt-2 form-item">
                  <input
                    type="text"
                    name="whatsappmobile"
                    id="whatsappmobile"
                    maxLength={10}
                    placeholder="Whats App Number"
                    value={formData["whatsappmobile"] || ""}
                    onChange={handleInputChange}
                    className={classNames(
                      "block w-full rounded-lg border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-blue-600 text-sm leading-6 font-medium",
                      error["whatsappmobile"]?.length > 0 &&
                        "ring-2 ring-red-500 focus:ring-red-600 rounded-lg"
                    )}
                  />
                  <ShowError error={error["whatsappmobile"]} />
                </div>
              </div>
              <div className="col-span-1">
                <label
                  htmlFor="emailAddress"
                  className="block text-sm font-medium leading-6 text-gray-600"
                >
                  Email Address
                </label>
                <div className="relative mt-2 form-item">
                  <input
                    type="text"
                    name="emailAddress"
                    id="emailAddress"
                    placeholder="Email Address"
                    value={formData["emailAddress"] || ""}
                    onChange={handleInputChange}
                    className={classNames(
                      "block w-full rounded-lg border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-blue-600 text-sm leading-6 font-medium",
                      error["emailAddress"]?.length > 0 &&
                        "ring-2 ring-red-500 focus:ring-red-600 rounded-lg"
                    )}
                  />
                  <ShowError error={error["emailAddress"]} />
                </div>
              </div>
              <div className="col-span-1">
                <label
                  htmlFor="occupation"
                  className="block text-sm font-medium leading-6 text-gray-600"
                >
                  Occupation
                </label>
                <div className="relative mt-2 form-item">
                  <input
                    type="text"
                    name="occupation"
                    id="occupation"
                    maxLength={50}
                    placeholder="Occupation"
                    value={formData["occupation"] || ""}
                    onChange={handleInputChange}
                    className={classNames(
                      "block w-full rounded-lg border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-blue-600 text-sm leading-6 font-medium",
                      error["occupation"]?.length > 0 &&
                        "ring-2 ring-red-500 focus:ring-red-600 rounded-lg"
                    )}
                  />

                  <ShowError error={error["occupation"]} />
                </div>
              </div>
              <div className="col-span-1">
                <label
                  htmlFor="bldgname"
                  className="block text-sm font-medium leading-6 text-gray-600"
                >
                  Building Name
                  <span className="ml-1 text-red-600">*</span>
                </label>
                <div className="relative mt-2 form-item">
                  <input
                    type="text"
                    name="bldgname"
                    id="bldgname"
                    placeholder="Building Name"
                    value={formData["bldgname"] || ""}
                    onChange={handleInputChange}
                    className={classNames(
                      "block w-full rounded-lg border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-blue-600 text-sm leading-6 font-medium",
                      error["bldgname"]?.length > 0 &&
                        "ring-2 ring-red-500 focus:ring-red-600 rounded-lg"
                    )}
                  />
                  <ShowError error={error["bldgname"]} />
                </div>
              </div>

              <div className="col-span-1">
                <label
                  htmlFor="streetaddress"
                  className="block text-sm font-medium leading-6 text-gray-600"
                >
                  Street Address
                  <span className="ml-1 text-red-600">*</span>
                </label>
                <div className="relative mt-2 form-item">
                  <input
                    type="text"
                    name="streetaddress"
                    id="streetaddress"
                    placeholder="Street Address"
                    value={formData["streetaddress"] || ""}
                    onChange={handleInputChange}
                    className={classNames(
                      "block w-full rounded-lg border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-blue-600 text-sm leading-6 font-medium",
                      error["streetaddress"]?.length > 0 &&
                        "ring-2 ring-red-500 focus:ring-red-600 rounded-lg"
                    )}
                  />
                  <ShowError error={error["streetaddress"]} />
                </div>
              </div>

              <div className="col-span-1">
                <label
                  htmlFor="area"
                  className="block text-sm font-medium leading-6 text-gray-600"
                >
                  Area
                  <span className="ml-1 text-red-600">*</span>
                </label>
                <div className="relative mt-2 form-item">
                  <Select
                    options={areaList}
                    className={classNames(
                      "basic-single font-normal",
                      error["area"]?.length > 0 && "select-error"
                    )}
                    classNamePrefix="react-select-cntrl"
                    placeholder="Select Area"
                    isDisabled={false}
                    isLoading={false}
                    name={"area"}
                    id="area"
                    isClearable={true}
                    isSearchable={true}
                    closeMenuOnSelect={true}
                    value={
                      areaList.find(
                        (item) => item.value === formData["area"]
                      ) || []
                    }
                    onChange={onAreaChange}
                  />
                  <ShowError error={error["area"]} />
                </div>
              </div>

              <div className="col-span-1">
                <label
                  htmlFor="city"
                  className="block text-sm font-medium leading-6 text-gray-600"
                >
                  City
                  {/* <span className="ml-1 text-red-600">*</span> */}
                </label>
                <div className="relative mt-2 form-item">
                  <Select
                    options={cityList}
                    className={classNames(
                      "basic-single font-normal",
                      error["city"]?.length > 0 && "select-error"
                    )}
                    classNamePrefix="react-select-cntrl"
                    placeholder="Select City"
                    isDisabled={false}
                    isLoading={false}
                    name={"city"}
                    id="city"
                    isClearable={true}
                    isSearchable={true}
                    closeMenuOnSelect={true}
                    value={
                      cityList.find(
                        (item) => item.value === formData["city"]
                      ) || []
                    }
                    onChange={onCityChange}
                  />
                  <ShowError error={error["city"]} />
                </div>
              </div>

              <div className="col-span-1">
                <label
                  htmlFor="district"
                  className="block text-sm font-medium leading-6 text-gray-600"
                >
                  District
                  {/* <span className="ml-1 text-red-600">*</span> */}
                </label>
                <div className="relative mt-2 form-item">
                  <Select
                    options={districtList}
                    className={classNames(
                      "basic-single font-normal",
                      error["district"]?.length > 0 && "select-error"
                    )}
                    classNamePrefix="react-select-cntrl"
                    placeholder="Select District"
                    isDisabled={false}
                    isLoading={false}
                    name={"district"}
                    id="district"
                    isClearable={true}
                    isSearchable={true}
                    closeMenuOnSelect={true}
                    value={
                      districtList.find(
                        (item) => item.value === formData["district"]
                      ) || []
                    }
                    onChange={onDistrictChange}
                  />
                  <ShowError error={error["district"]} />
                </div>
              </div>

              <div className="col-span-1">
                <label
                  htmlFor="state"
                  className="block text-sm font-medium leading-6 text-gray-600"
                >
                  State
                  {/* <span className="ml-1 text-red-600">*</span> */}
                </label>
                <div className="relative mt-2 form-item">
                  <Select
                    options={stateList}
                    className={classNames(
                      "basic-single font-normal",
                      error["state"]?.length > 0 && "select-error"
                    )}
                    classNamePrefix="react-select-cntrl"
                    placeholder="Select State"
                    isDisabled={false}
                    isLoading={false}
                    name={"state"}
                    id="state"
                    isClearable={true}
                    isSearchable={true}
                    closeMenuOnSelect={true}
                    value={
                      stateList.find(
                        (item) => item.value === formData["state"]
                      ) || []
                    }
                    onChange={handleSelectChange}
                  />
                  <ShowError error={error["state"]} />
                </div>
              </div>

              <div className="col-span-1">
                <label
                  htmlFor="country"
                  className="block text-sm font-medium leading-6 text-gray-600"
                >
                  Country
                  {/* <span className="ml-1 text-red-600">*</span> */}
                </label>
                <div className="relative mt-2 form-item">
                  <Select
                    options={countryList}
                    className={classNames(
                      "basic-single font-normal",
                      error["country"]?.length > 0 && "select-error"
                    )}
                    classNamePrefix="react-select-cntrl"
                    placeholder="Select Country"
                    isDisabled={false}
                    isLoading={false}
                    name={"country"}
                    id="country"
                    isClearable={true}
                    isSearchable={true}
                    closeMenuOnSelect={true}
                    value={
                      countryList.find(
                        (item) => item.value === formData["country"]
                      ) || []
                    }
                    onChange={handleSelectChange}
                  />
                  <ShowError error={error["country"]} />
                </div>
              </div>

              <div className="col-span-1">
                <label
                  htmlFor="nationality"
                  className="block text-sm font-medium leading-6 text-gray-600"
                >
                  Nationality
                  {/* <span className="ml-1 text-red-600">*</span> */}
                </label>
                <div className="relative mt-2 form-item">
                  <Select
                    options={nationalityList}
                    className={classNames(
                      "basic-single font-normal",
                      error["nationality"]?.length > 0 && "select-error"
                    )}
                    classNamePrefix="react-select-cntrl"
                    placeholder={"Select Nationality"}
                    isDisabled={false}
                    isLoading={false}
                    name={"nationality"}
                    id="nationality"
                    isClearable={true}
                    isSearchable={true}
                    closeMenuOnSelect={true}
                    value={
                      nationalityList.find(
                        (item) => item.value === formData["nationality"]
                      ) || []
                    }
                    onChange={handleSelectChange}
                  />
                  <ShowError error={error["nationality"]} />
                </div>
              </div>

              <div className="col-span-1">
                <label
                  htmlFor="pincode"
                  className="block text-sm font-medium leading-6 text-gray-600"
                >
                  Pin Code
                  <span className="ml-1 text-red-600">*</span>
                </label>
                <div className="relative mt-2 form-item">
                  <input
                    type="text"
                    name="pincode"
                    id="pincode"
                    maxLength={6}
                    placeholder="Pin Code"
                    value={formData["pincode"] || ""}
                    onChange={handleInputChange}
                    className={classNames(
                      "block w-full rounded-lg border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-blue-600 text-sm leading-6 font-medium",
                      error["pincode"]?.length > 0 &&
                        "ring-2 ring-red-500 focus:ring-red-600 rounded-lg"
                    )}
                  />
                  <ShowError error={error["pincode"]} />
                </div>
              </div>
              <div className="col-span-1">
                <label
                  htmlFor="nextofkin"
                  className="block text-sm font-medium leading-6 text-gray-600"
                >
                  Next of Kin
                  <span className="ml-1 text-red-600">*</span>
                </label>
                <div className="relative mt-2 form-item">
                  <input
                    type="text"
                    name="nextofkin"
                    id="nextofkin"
                    placeholder="Relative Name"
                    value={formData["nextofkin"] || ""}
                    onChange={handleInputChange}
                    className={classNames(
                      "block w-full rounded-lg border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-blue-600 text-sm leading-6 font-medium",
                      error["nextofkin"]?.length > 0 &&
                        "ring-2 ring-red-500 focus:ring-red-600 rounded-lg"
                    )}
                  />
                  <ShowError error={error["nextofkin"]} />
                </div>
              </div>
              <div className="col-span-1">
                <label
                  htmlFor="nextofkinrelation"
                  className="block text-sm font-medium leading-6 text-gray-600"
                >
                  Relation
                  <span className="ml-1 text-red-600">*</span>
                </label>
                <div className="relative mt-2 form-item">
                  <input
                    type="text"
                    name="nextofkinrelation"
                    id="nextofkinrelation"
                    placeholder="Relation"
                    value={formData["nextofkinrelation"] || ""}
                    onChange={handleInputChange}
                    className={classNames(
                      "block w-full rounded-lg border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-blue-600 text-sm leading-6 font-medium",
                      error["nextofkinrelation"]?.length > 0 &&
                        "ring-2 ring-red-500 focus:ring-red-600 rounded-lg"
                    )}
                  />
                  <ShowError error={error["nextofkinrelation"]} />
                </div>
              </div>
            </div>
          </div>

          <div className="relative mt-6">
            <div className="block text-sm font-medium leading-6 text-gray-700">
              Terms and Conditions
            </div>
            <ul className="mt-2 ml-4 space-y-3 text-sm text-justify text-gray-500 list-decimal">
              <li>
                I/We here by consent to undergo examination, investigation and
                treatment as decided by the hospital & also to abide by its
                schedule of charges, rules & regulations. (available at
                registration counter)
              </li>
              <li>
                I authorize my Next of Kin to take decision on my behalf in case
                of my inability to do so due to associated medical condition.
              </li>
              <li>
                I understand that i have to disclose my clinical history & other
                relevant information to the healthcare provider team required
                for the management of my disease.
              </li>
              <li>
                I am fully aware that the medical treatment may be extended
                beyond the expected period at the discretion of the doctor.
              </li>
              <li>
                I understand that my medical record will be destroyed after 3
                years from the date of treatment.
              </li>
              <li>
                The above has been explained to me and my relative and we have
                fully understood the contents. I further state that I/we have
                been given an opportunity to ask questions which have been
                answered fully & to my satisfaction.
              </li>
            </ul>

            <div className="">
              <fieldset>
                <legend className="text-sm font-semibold leading-6 text-gray-800"></legend>
                <div className="mt-4">
                  <div className="relative flex gap-x-3">
                    <div className="flex items-center">
                      <input
                        id="agreed"
                        name="agreed"
                        type="checkbox"
                        value={formData["agreed"] === true}
                        onChange={(event) => {
                          const _event = {
                            target: {
                              name: "agreed",
                              value: event.target.checked,
                            },
                          };
                          handleInputChange(_event);
                        }}
                        className={classNames(
                          "h-4 w-4 rounded border-gray-300 text-blue-600",
                          error["agreed"]?.length > 0 && ""
                        )}
                      />
                      <label
                        htmlFor="agreed"
                        className="ml-2 text-sm font-medium leading-6 text-gray-600 cursor-pointer"
                      >
                        <span>I Understand the terms of use</span>
                      </label>
                    </div>
                  </div>
                  <ShowError error={error["agreed"]} />
                </div>
              </fieldset>
            </div>
          </div>
        </div>

        <div className="w-full absolute bottom-0 inset-x-0 px-6 max-[375px]:px-4 py-4 bg-white flex items-center justify-center gap-x-4 shadow-top">
          <button
            type="button"
            onClick={() => {
              setPatient({});
              router.push("/patient");
            }}
            className="sm:w-60 w-full rounded-lg bg-white ring-1 ring-gray-300 active:bg-gray-100 px-3 py-2.5 text-sm font-semibold 
                text-gray-700 hover:shadow-sm gap-1.5 icon-20"
          >
            Cancel
          </button>
          <button
            onClick={handleFormSubmit}
            className="sm:w-60 w-full rounded-lg bg-blue-600 px-3 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
