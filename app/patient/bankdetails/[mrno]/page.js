"use client";
import LinearLoader from "@/components/LinearLoader";
import ShowError from "@/components/ShowError";
import Toast from "@/components/Toast";
import { useMaster } from "@/context/MastersProvider";
import { usePatient } from "@/context/PatientContext";
import { ToastType, useToast } from "@/hooks/useToast";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import useForm from "@/hooks/useForm";
import { apihelper } from "@/utils/Client";
import { useRouter } from "next/navigation";
import {
  blobToBase64,
  classNames,
  validateAllFormValidations,
} from "@/utils/CommonFunc";
import {
  ACCOUNTDETAILS_FORM_SCHEMA,
  BANKDETAILS_FORM_SCHEMA,
  bankDetailsRelationList,
  OTHERBANKDETAILS_FORM_SCHEMA,
} from "@/utils/Constant";
import { FileDragNDrop } from "@/components/FileDragNDrop";
import { CloseIcon, DeleteIcon, ViewEyeIcon } from "@/components/Icons";
import Modal from "@/components/Modal";
import Image from "next/image";
import { useAuth } from "@/context/AuthProvider";
import dynamic from "next/dynamic";

const PDFViewer = dynamic(() => import("../../details/[id]/PDFViewer"), {
  ssr: false,
});

const BankDetails = (props) => {
  const MRNO = props?.params?.mrno || "";
  const router = useRouter();
  const { user } = useAuth();
  const { patient, setPatient } = usePatient();
  const { toastProp, setToastProp, closeToast } = useToast();
  const { masters, setMasters } = useMaster();
  const [loader, setLoader] = useState(false);
  const [existingDetails, setExistingDetails] = useState({});
  const [resetFiles, setResetFiles] = useState(false);
  const [openImagePreviewModal, setOpenImagePreviewModal] = useState(null);
  const [openBankDetailsPreview, setOpenBankDetailsPreview] = useState({});

  const {
    handleInputChange,
    validateForm,
    formData,
    setFormData,
    error,
    setError,
  } = useForm({
    refundInCashECS: "E",
    bankDetailsAvailableYN: "Y",
    bankDetailsSelfKinOther: "S",
  });

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

  const fetchBankDetails = useCallback(async () => {
    if (!patient.ipno && !patient.mrno) return;

    setLoader(true);
    const response = await apihelper(
      `patientportal/Hospital/patientbankdetails/${patient.mrno}/${
        patient.ipno || ""
      }`
    );
    const response1 = await apihelper(
      `patientportal/Hospital/ippatientbankdetails/${patient.mrno}`
    );
    if (!!patient.ipno && response1.success?.code && !response?.success?.code) {
      setOpenBankDetailsPreview({
        show: true,
        bankDetails: response1.success,
      });
    }
    if (response.status) {
      const bankDetails = response.success || {};
      setExistingDetails({
        code: bankDetails?.code,
        status: bankDetails?.status,
        files: bankDetails?.files,
      });
      delete bankDetails?.code;
      delete bankDetails?.status;
      delete bankDetails?.ipOrOP;
      delete bankDetails?.ipno;
      delete bankDetails?.mrno;
      delete bankDetails?.files;
      setFormData((prev) => ({
        ...prev,
        ...bankDetails,
      }));
    } else
      setToastProp({
        show: true,
        header: response?.error?.message || "Something went wrong.",
        type: ToastType.ERROR,
      });
    setLoader(false);
  }, [patient.ipno, patient.mrno, setFormData, setToastProp]);

  useEffect(() => {
    fetchBankDetails();
  }, [MRNO, setToastProp, setFormData, patient, fetchBankDetails]);

  const onDeleteImage = useCallback(
    async (file) => {
      const response = await apihelper(
        "patientportal/Hospital/deletepatientbank",
        {
          method: "POST",
          data: {
            code: patient.ipno ? patient.ipno : patient.mrno,
            ipOrOP: patient.ipno ? "IP" : "OP",
            fileName: file.fileName,
            path: file.path,
          },
        }
      );
      if (response.status) {
        setExistingDetails((prev) => ({
          ...prev,
          files: (prev.files || []).filter((f) => f.fileName !== file.fileName),
        }));
        setToastProp({
          show: true,
          header: response?.success?.message,
          type: ToastType.ERROR,
        });
      } else {
        setToastProp({
          show: true,
          header: response?.error?.message || "Something went wrong.",
          type: ToastType.ERROR,
        });
      }
    },
    [patient.ipno, patient.mrno, setToastProp]
  );

  const handleFormSubmit = useCallback(
    async (data, shouldCloseForm = true) => {
      let errorObject = validateAllFormValidations(
        BANKDETAILS_FORM_SCHEMA,
        data
      );
      if (
        data?.refundInCashECS !== "C" &&
        data?.bankDetailsAvailableYN === "Y"
      ) {
        const newError = validateAllFormValidations(
          ACCOUNTDETAILS_FORM_SCHEMA,
          data
        );
        // if (!data?.files?.length && !existingDetails?.files?.length) {
        //   errorObject = { ...errorObject, files: ["Please upload a file."] };
        // }
        errorObject = { ...errorObject, ...newError };
      }
      if (data?.bankDetailsSelfKinOther !== "S") {
        const newError = validateAllFormValidations(
          OTHERBANKDETAILS_FORM_SCHEMA,
          data
        );
        errorObject = { ...errorObject, ...newError };
      }
      if (!!Object.keys(errorObject).length) {
        setError(errorObject);
        return;
      }

      const filesToUpload = await Promise.all(
        (data.files || [])?.map(async (file) => {
          if (file.fileStream) {
            return {
              fileName: file.fileName,
              fileStream: file.fileStream,
            };
          }
          const base64Str = await blobToBase64(file);

          return {
            fileName: (file.name || "").replaceAll(" ", "_"),
            fileStream: base64Str.split(",")[1],
          };
        })
      );
      setLoader(true);
      const response = await apihelper(
        "patientportal/Hospital/patientbankdetails",
        {
          method: "POST",
          data: {
            code: existingDetails.code,
            ipno: patient.ipno,
            mrno: patient.mrno,
            ipOrOP: patient.ipno ? "IP" : "OP",
            ...data,
            files: filesToUpload,
            fromMobileNumber: user?.mobileNumber,
          },
        }
      );
      if (response.status) {
        setLoader(false);
        setToastProp({
          show: true,
          title: "Success",
          header: existingDetails.code
            ? "Patient bank details updated successfully."
            : "Patient bank details added successfully.",
          type: ToastType.SUCCESS,
        });
        setExistingDetails({
          code: response?.success.code,
        });
        if (shouldCloseForm) {
          router.push("/patient");
        } else {
          fetchBankDetails();
        }
        return;
      }
      setLoader(false);
      setToastProp({
        show: true,
        header: response?.error?.message || "Something went wrong.",
        type: ToastType.ERROR,
      });
    },
    [
      existingDetails.code,
      patient.ipno,
      patient.mrno,
      user?.mobileNumber,
      setToastProp,
      setError,
      router,
      fetchBankDetails,
    ]
  );

  const allowBankDetailsUpdate = useMemo(() => {
    return (
      formData?.refundInCashECS !== "C" &&
      formData?.bankDetailsAvailableYN === "Y"
    );
  }, [formData?.bankDetailsAvailableYN, formData?.refundInCashECS]);

  const allowOthersDetailsUpdate = useMemo(() => {
    return (
      formData?.bankDetailsSelfKinOther === "K" ||
      formData?.bankDetailsSelfKinOther === "O"
    );
  }, [formData?.bankDetailsSelfKinOther]);

  const isFormVerified = useMemo(() => {
    return existingDetails?.status === "V";
  }, [existingDetails?.status]);

  useEffect(() => {
    if (!allowBankDetailsUpdate) {
      setFormData((prev) => ({
        ...prev,
        bankName: null,
        accountHolderName: null,
        ifscCode: null,
        bankAccountNo: null,
        branchName: null,
      }));
    }
  }, [allowBankDetailsUpdate, setFormData]);

  useEffect(() => {
    if (!allowOthersDetailsUpdate) {
      setFormData((prev) => ({
        ...prev,
        nameOfRelative: null,
        relativeMobileNo: null,
        relationWithPatient: null,
        relativeEmail: null,
      }));
    }
  }, [allowOthersDetailsUpdate, setFormData]);

  return (
    <div className="flex flex-col justify-between min-h-[calc(100vh-53px)] relative overflow-hidden pt-20 bg-white">
      {loader && <LinearLoader />}
      {toastProp.show && <Toast {...toastProp} closeToast={closeToast} />}
      <div className="max-h-[calc(100vh-210px)] internal-scroll overflow-auto pb-2">
        <div className="relative w-full mx-auto mb-4 max-w-7xl xl:px-4">
          <div className="flex items-center justify-between gap-2 px-5 py-4 lg:border-b lg:py-5 xl:px-0 bg-orange-50 lg:bg-transparent">
            <div className="relative">
              <h1 className="text-lg font-semibold text-gray-800 md:text-xl">
                Bank Details
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Submit your bank details to process refund.
              </p>
            </div>
            <div className="flex gap-2">
              {patient?.ipno && (
                <div className="px-3 py-2 text-sm font-semibold text-center text-white bg-blue-800 rounded-lg w-fit">
                  IPNO <br />
                  {patient?.ipno}
                </div>
              )}
              <div className="px-3 py-2 text-sm font-semibold text-center text-white bg-orange-500 rounded-lg w-fit">
                MRN <br />
                {patient?.mrno}
              </div>
            </div>
          </div>
          {isFormVerified && (
            <div className="flex items-center justify-between gap-2 p-3 mx-5 mt-3 -mb-2 text-sm font-medium text-green-600 border border-green-500 rounded-lg bg-green-50 xl:mx-0">
              The hospital staff has verified the bank details, and they cannot
              be edited.
            </div>
          )}
          <div className="grid gap-4 px-5 mt-5 sm:grid-cols-2 lg:grid-cols-3 xl:px-0">
            {/* <div className="col-span-1">
              <label
                htmlFor="refundInCashECS"
                className="block text-sm font-medium leading-6 text-gray-600"
              >
                Refund Type
                <span className="ml-1 text-red-600">*</span>
              </label>
              <div className="relative mt-1.5 form-item">
                <fieldset>
                  <legend className="sr-only">Refund</legend>
                  <div className="flex items-center space-x-4">
                    {refundList.map((type) => (
                      <div
                        key={type.value}
                        className={classNames("relative flex items-center")}
                      >
                        <input
                          key={`${formData["refundInCashECS"]}-${type.value}`}
                          id={type.value}
                          name="refundInCashECS"
                          type="radio"
                          disabled={isFormVerified}
                          onChange={(event) => {
                            event.stopPropagation();
                            const inputEvent = {
                              target: {
                                name: "refundInCashECS",
                                value: type.value,
                              },
                            };
                            handleInputChange(inputEvent);
                          }}
                          value={type.value}
                          checked={formData["refundInCashECS"] === type.value}
                          className={classNames(
                            "relative rounded border-gray-300 text-blue-600"
                          )}
                        />
                        <label
                          htmlFor={type.value}
                          className="ml-1 text-sm font-medium leading-6 text-gray-700 cursor-pointer"
                        >
                          {type.label}
                        </label>
                      </div>
                    ))}
                  </div>
                  <ShowError error={error["refundInCashECS"]} />
                </fieldset>
              </div>
            </div> */}
            {/* <div className="col-span-1">
              <label
                htmlFor="bankDetailsAvailableYN"
                className="block text-sm font-medium leading-6 text-gray-600"
              >
                Bank Details Available
                <span className="ml-1 text-red-600">*</span>
              </label>
              <div className="relative mt-1.5 form-item">
                <fieldset>
                  <legend className="sr-only">Bank Details Available</legend>
                  <div className="flex items-center space-x-4">
                    {bankDetailsAvailablityList.map((type) => (
                      <div
                        key={type.value}
                        className={classNames("relative flex items-center")}
                      >
                        <input
                          key={`${formData["bankDetailsAvailableYN"]}-${type.value}`}
                          id={type.value}
                          name="bankDetailsAvailableYN"
                          type="radio"
                          disabled={
                            isFormVerified ||
                            formData["refundInCashECS"] === "C"
                          }
                          onChange={(e) => {
                            e.stopPropagation();
                            const inputEvent = {
                              target: {
                                name: "bankDetailsAvailableYN",
                                value: type.value,
                              },
                            };
                            handleInputChange(inputEvent);
                          }}
                          value={type.value}
                          defaultChecked={
                            formData["bankDetailsAvailableYN"] === type.value
                          }
                          className={classNames(
                            "relative rounded border-gray-300 text-blue-600"
                          )}
                        />
                        <label
                          htmlFor={type.value}
                          className="ml-1 text-sm font-medium leading-6 text-gray-700 cursor-pointer"
                        >
                          {type.label}
                        </label>
                      </div>
                    ))}
                  </div>
                  <ShowError error={error["bankDetailsAvailableYN"]} />
                </fieldset>
              </div>
            </div> */}
            <div className="col-span-1">
              <label
                htmlFor="bankDetailsSelfKinOther"
                className="block text-sm font-medium leading-6 text-gray-600"
              >
                Bank details are of
                <span className="ml-1 text-red-600">*</span>
              </label>
              <div className="relative mt-1.5 form-item">
                <fieldset>
                  <legend className="sr-only">Bank details are of</legend>
                  <div className="flex items-center space-x-4 sm:h-10">
                    {bankDetailsRelationList.map((type) => (
                      <div
                        key={type.value}
                        className={classNames("relative flex items-center")}
                      >
                        <input
                          key={`${formData["bankDetailsSelfKinOther"]}-${type.value}`}
                          id={type.value}
                          name="bankDetailsSelfKinOther"
                          type="radio"
                          disabled={
                            isFormVerified ||
                            formData["refundInCashECS"] === "C" ||
                            formData["bankDetailsAvailableYN"] === "N"
                          }
                          onChange={(event) => {
                            event.stopPropagation();
                            const inputEvent = {
                              target: {
                                name: "bankDetailsSelfKinOther",
                                value: type.value,
                              },
                            };
                            handleInputChange(inputEvent);
                          }}
                          value={type.value}
                          defaultChecked={
                            formData["bankDetailsSelfKinOther"] === type.value
                          }
                          className={classNames(
                            "relative rounded border-gray-300 text-blue-600"
                          )}
                        />
                        <label
                          htmlFor={type.value}
                          className="ml-1 text-sm font-medium leading-6 text-gray-700 cursor-pointer"
                        >
                          {type.label}
                        </label>
                      </div>
                    ))}
                  </div>
                  <ShowError error={error["bankDetailsSelfKinOther"]} />
                </fieldset>
              </div>
            </div>
            <div className="col-span-1">
              <label
                htmlFor="bankName"
                className="block text-sm font-medium leading-6 text-gray-600"
              >
                Bank Name<span className="ml-1 text-red-600">*</span>
              </label>
              <div className="relative mt-2 form-item">
                <input
                  type="text"
                  name="bankName"
                  id="bankName"
                  maxLength={50}
                  placeholder="Enter Bank Name"
                  disabled={!allowBankDetailsUpdate || isFormVerified}
                  value={formData["bankName"] || ""}
                  onChange={handleInputChange}
                  className={classNames(
                    "block w-full rounded-lg border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-blue-600 text-sm leading-6 font-medium",
                    error["bankName"]?.length > 0 &&
                      "ring-2 ring-red-500 focus:ring-red-600 rounded-lg"
                  )}
                />

                <ShowError error={error["bankName"]} />
              </div>
            </div>
            <div className="col-span-1">
              <label
                htmlFor="accountHolderName"
                className="block text-sm font-medium leading-6 text-gray-600"
              >
                Account Holder Name<span className="ml-1 text-red-600">*</span>
              </label>
              <div className="relative mt-2 form-item">
                <input
                  type="text"
                  name="accountHolderName"
                  id="accountHolderName"
                  maxLength={50}
                  placeholder="Enter Account Holder Name"
                  disabled={!allowBankDetailsUpdate || isFormVerified}
                  value={formData["accountHolderName"] || ""}
                  onChange={handleInputChange}
                  className={classNames(
                    "block w-full rounded-lg border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-blue-600 text-sm leading-6 font-medium",
                    error["accountHolderName"]?.length > 0 &&
                      "ring-2 ring-red-500 focus:ring-red-600 rounded-lg"
                  )}
                />

                <ShowError error={error["accountHolderName"]} />
              </div>
            </div>
            <div className="col-span-1">
              <label
                htmlFor="ifscCode"
                className="block text-sm font-medium leading-6 text-gray-600"
              >
                IFSC Code<span className="ml-1 text-red-600">*</span>
              </label>
              <div className="relative mt-2 form-item">
                <input
                  type="text"
                  name="ifscCode"
                  id="ifscCode"
                  maxLength={50}
                  placeholder="Enter IFSC Code"
                  disabled={!allowBankDetailsUpdate || isFormVerified}
                  value={formData["ifscCode"] || ""}
                  onChange={handleInputChange}
                  className={classNames(
                    "block w-full rounded-lg border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-blue-600 text-sm leading-6 font-medium",
                    error["ifscCode"]?.length > 0 &&
                      "ring-2 ring-red-500 focus:ring-red-600 rounded-lg"
                  )}
                />

                <ShowError error={error["ifscCode"]} />
              </div>
            </div>
            <div className="col-span-1">
              <label
                htmlFor="bankAccountNo"
                className="block text-sm font-medium leading-6 text-gray-600"
              >
                Bank A/C No<span className="ml-1 text-red-600">*</span>
              </label>
              <div className="relative mt-2 form-item">
                <input
                  type="text"
                  name="bankAccountNo"
                  id="bankAccountNo"
                  maxLength={50}
                  placeholder="Enter Bank A/C No"
                  disabled={!allowBankDetailsUpdate || isFormVerified}
                  value={formData["bankAccountNo"] || ""}
                  onChange={handleInputChange}
                  className={classNames(
                    "block w-full rounded-lg border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-blue-600 text-sm leading-6 font-medium",
                    error["bankAccountNo"]?.length > 0 &&
                      "ring-2 ring-red-500 focus:ring-red-600 rounded-lg"
                  )}
                />

                <ShowError error={error["bankAccountNo"]} />
              </div>
            </div>
            <div className="col-span-1">
              <label
                htmlFor="branchName"
                className="block text-sm font-medium leading-6 text-gray-600"
              >
                Branch Name<span className="ml-1 text-red-600">*</span>
              </label>
              <div className="relative mt-2 form-item">
                <input
                  type="text"
                  name="branchName"
                  id="branchName"
                  maxLength={50}
                  placeholder="Enter Branch Name"
                  disabled={!allowBankDetailsUpdate || isFormVerified}
                  value={formData["branchName"] || ""}
                  onChange={handleInputChange}
                  className={classNames(
                    "block w-full rounded-lg border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-blue-600 text-sm leading-6 font-medium",
                    error["branchName"]?.length > 0 &&
                      "ring-2 ring-red-500 focus:ring-red-600 rounded-lg"
                  )}
                />

                <ShowError error={error["branchName"]} />
              </div>
            </div>
            <div className="form-item">
              <label className="block text-sm font-medium text-gray-600">
                Upload File
                {/* <span className="ml-1 text-red-600">*</span> */}
              </label>
              <div className="text-xs text-blue-600 ">
                Upload any valid bank details proof
              </div>
              <div className="mt-2">
                <div className="mb-1 text-xs text-blue-600"></div>
                <FileDragNDrop
                  preUploadedFiles={[]}
                  resetFiles={resetFiles}
                  setResetFiles={setResetFiles}
                  error={error?.file}
                  acceptedFileFormat={[
                    "image/png",
                    "image/jpeg",
                    "image/jpg",
                    "application/pdf",
                  ].join(",")}
                  invalidFileTyeErrorMessage="Please Upload Only PNG, JPG, JPEG or PDF File Formats"
                  acceptedFileFormatDisplayText="PNG, JPG, JPEG or PDF format"
                  allowMultipleFile={true}
                  disabled={
                    isFormVerified ||
                    formData["refundInCashECS"] === "C" ||
                    formData["bankDetailsAvailableYN"] === "N"
                  }
                  onFileSelection={async (files) => {
                    const MAX_FILE_SIZE = 4 * 1024 * 1024;
                    const oversizedFiles = files.filter(
                      (file) => file.size > MAX_FILE_SIZE
                    );

                    if (oversizedFiles.length > 0) {
                      setToastProp({
                        show: true,
                        header: "File size should not exceed 4MB",
                        type: ToastType.ERROR,
                      });
                      setResetFiles(true);
                      return;
                    }

                    handleInputChange({
                      target: {
                        name: "files",
                        value: files,
                      },
                    });
                  }}
                />
                {(existingDetails?.files || []).map((file) => (
                  <div
                    key={`${file.fileName}`}
                    className="flex justify-between items-center gap-1 mt-1.5 w-full"
                  >
                    <span className="text-sm font-normal text-gray-600 bg-gray-200 rounded-lg px-3 py-1.5 grow">
                      {file.fileName}
                    </span>
                    <button
                      onClick={() => {
                        const imgExtensions = ["jpg", "jpeg", "png"];
                        const extension = file.fileName
                          .split(".")
                          .pop()
                          .toLowerCase();
                        const isImageFile = imgExtensions.includes(extension);

                        setOpenImagePreviewModal({
                          show: true,
                          name: file.fileName,
                          path: file.path,
                          image: isImageFile
                            ? `data:image/png;base64,${file.fileStream}`
                            : null,
                          pdf: !isImageFile
                            ? `data:application/pdf;base64,${file.fileStream}`
                            : null,
                        });
                      }}
                      className="bg-blue-100 text-blue-500 icon-20 hover:text-blue-600 rounded-lg p-1.5"
                      aria-label={`Preview ${file.fileName}`}
                    >
                      <ViewEyeIcon />
                    </button>
                    {!isFormVerified && existingDetails?.code && (
                      <button
                        onClick={() => onDeleteImage(file)}
                        className="bg-red-100 text-red-500 icon-20 hover:text-red-600 rounded-lg p-1.5"
                        aria-label={`Remove ${file.fileName}`}
                      >
                        <DeleteIcon />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <ShowError error={error?.files} />
            </div>

            {/* <div className="relative flex flex-col col-span-full gap-x-3">
              <div className="flex items-center">
                <input
                  id="hasOthersDetails"
                  name="hasOthersDetails"
                  type="checkbox"
                  checked={allowOthersDetailsUpdate}
                  onChange={() => {}}
                  disabled
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded"
                />
                <label
                  htmlFor="hasOthersDetails"
                  className="ml-2 text-sm font-medium leading-6 text-gray-600"
                >
                  Not self, fill the below details info
                </label>
              </div>
              <ShowError error={error["hasOthersDetails"]} />
            </div> */}
            {allowOthersDetailsUpdate && (
              <>
                <div className="w-full border-t border-gray-300 border-dashed col-span-full" />
                <div className="col-span-1">
                  <label
                    htmlFor="nameOfRelative"
                    className="block text-sm font-medium leading-6 text-gray-600"
                  >
                    Name of relative<span className="ml-1 text-red-600">*</span>
                  </label>
                  <div className="relative mt-2 form-item">
                    <input
                      type="text"
                      name="nameOfRelative"
                      id="nameOfRelative"
                      maxLength={50}
                      placeholder="Enter Name of relative"
                      disabled={!allowOthersDetailsUpdate || isFormVerified}
                      value={formData["nameOfRelative"] || ""}
                      onChange={handleInputChange}
                      className={classNames(
                        "block w-full rounded-lg border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-blue-600 text-sm leading-6 font-medium",
                        error["nameOfRelative"]?.length > 0 &&
                          "ring-2 ring-red-500 focus:ring-red-600 rounded-lg"
                      )}
                    />

                    <ShowError error={error["nameOfRelative"]} />
                  </div>
                </div>
                <div className="col-span-1">
                  <label
                    htmlFor="relationWithPatient"
                    className="block text-sm font-medium leading-6 text-gray-600"
                  >
                    Relation with Patient
                    <span className="ml-1 text-red-600">*</span>
                  </label>
                  <div className="relative mt-2 form-item">
                    <input
                      type="text"
                      name="relationWithPatient"
                      id="relationWithPatient"
                      maxLength={50}
                      placeholder="Enter Relation with Patient"
                      disabled={!allowOthersDetailsUpdate || isFormVerified}
                      value={formData["relationWithPatient"] || ""}
                      onChange={handleInputChange}
                      className={classNames(
                        "block w-full rounded-lg border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-blue-600 text-sm leading-6 font-medium",
                        error["relationWithPatient"]?.length > 0 &&
                          "ring-2 ring-red-500 focus:ring-red-600 rounded-lg"
                      )}
                    />

                    <ShowError error={error["relationWithPatient"]} />
                  </div>
                </div>
                <div className="col-span-1">
                  <label
                    htmlFor="relativeMobileNo"
                    className="block text-sm font-medium leading-6 text-gray-600"
                  >
                    Relative Mobile Number
                    <span className="ml-1 text-red-600">*</span>
                  </label>
                  <div className="relative mt-2 form-item">
                    <input
                      type="text"
                      name="relativeMobileNo"
                      id="relativeMobileNo"
                      maxLength={50}
                      placeholder="Enter Relative Mobile Number"
                      disabled={!allowOthersDetailsUpdate || isFormVerified}
                      value={formData["relativeMobileNo"] || ""}
                      onChange={handleInputChange}
                      className={classNames(
                        "block w-full rounded-lg border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-blue-600 text-sm leading-6 font-medium",
                        error["relativeMobileNo"]?.length > 0 &&
                          "ring-2 ring-red-500 focus:ring-red-600 rounded-lg"
                      )}
                    />

                    <ShowError error={error["relativeMobileNo"]} />
                  </div>
                </div>
                <div className="col-span-1">
                  <label
                    htmlFor="relativeEmail"
                    className="block text-sm font-medium leading-6 text-gray-600"
                  >
                    Relative Email<span className="ml-1 text-red-600">*</span>
                  </label>
                  <div className="relative mt-2 form-item">
                    <input
                      type="text"
                      name="relativeEmail"
                      id="relativeEmail"
                      maxLength={50}
                      placeholder="Enter Relative Email"
                      disabled={!allowOthersDetailsUpdate || isFormVerified}
                      value={formData["relativeEmail"] || ""}
                      onChange={handleInputChange}
                      className={classNames(
                        "block w-full rounded-lg border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-blue-600 text-sm leading-6 font-medium",
                        error["relativeEmail"]?.length > 0 &&
                          "ring-2 ring-red-500 focus:ring-red-600 rounded-lg"
                      )}
                    />

                    <ShowError error={error["relativeEmail"]} />
                  </div>
                </div>
              </>
            )}
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
            onClick={() => {
              handleFormSubmit(formData, true);
            }}
            disabled={loader || isFormVerified}
            className="sm:w-60 w-full rounded-lg disabled:opacity-50 bg-blue-600 px-3 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            Save
          </button>
        </div>
      </div>
      {openImagePreviewModal?.show && (
        <Modal
          className=""
          panelClass="sm:max-w-3xl"
          handleClose={() => {
            setOpenImagePreviewModal({});
          }}
        >
          <div className="absolute top-0 right-0 pt-5 pe-5">
            <button
              type="button"
              className="text-gray-400 bg-white rounded-lg hover:text-gray-500 icon-20"
              onClick={() => setOpenImagePreviewModal({})}
            >
              <span className="sr-only">Close</span>
              <CloseIcon className="w-6 h-6" aria-hidden="true" />
            </button>
          </div>
          <h6 className="mb-2 text-base font-semibold leading-6 text-gray-800 break-all">
            {openImagePreviewModal?.name}
          </h6>

          <div className="relative max-h-[calc(100vh-220px)] w-full h-full aspect-square border border-gray-300 rounded-lg overflow-hidden -mr-3">
            {openImagePreviewModal?.image && (
              <Image
                src={openImagePreviewModal?.image}
                alt={openImagePreviewModal?.name}
                className="object-contain"
                fill
                // width={220}
                // height={220}
              />
            )}
            {openImagePreviewModal.pdf && (
              <React.Suspense fallback={null}>
                <PDFViewer file={openImagePreviewModal.pdf} />
              </React.Suspense>
            )}
            <div className="w-full h-full" />
          </div>
        </Modal>
      )}
      {openBankDetailsPreview?.show && (
        <Modal
          className=""
          panelClass="max-w-md"
          handleClose={() => {
            setOpenBankDetailsPreview({});
          }}
        >
          <div className="absolute top-0 right-0 pt-5 pe-5">
            <button
              type="button"
              className="text-gray-400 bg-white rounded-lg hover:text-gray-500 icon-20"
              onClick={() => setOpenBankDetailsPreview({})}
            >
              <span className="sr-only">Close</span>
              <CloseIcon className="w-6 h-6" aria-hidden="true" />
            </button>
          </div>
          <h6 className="pb-4 text-base font-semibold leading-6 text-gray-800">
            Previous Bank Details
          </h6>
          <p className="text-[13px] font-normal text-orange-600 bg-orange-50 border border-orange-100 rounded-lg p-2 mb-4">
            We already have your previously verified bank details. Would you
            like to use them and save them for this IP?
          </p>

          <div className="relative max-h-[calc(100vh-220px)] w-full h-full rounded-lg -mr-3">
            <ul className="flex flex-col gap-2 divide-y divide-gray-300 divide-dashed">
              <li>
                <p className="text-sm font-normal text-gray-500">Bank are of</p>
                <span className="text-[15px] font-medium text-gray-700">
                  {
                    bankDetailsRelationList.find(
                      (r) =>
                        r.value ===
                        openBankDetailsPreview?.bankDetails
                          ?.bankDetailsSelfKinOther
                    )?.label
                  }
                </span>
              </li>
              <li className="pt-2">
                <p className="text-sm font-normal text-gray-500">Bank Name</p>
                <span className="text-[15px] font-medium text-gray-700">
                  {openBankDetailsPreview?.bankDetails?.bankName}
                </span>
              </li>
              <li className="pt-2">
                <p className="text-sm font-normal text-gray-500">
                  Account Holder Name
                </p>
                <span className="text-[15px] font-medium text-gray-700">
                  {openBankDetailsPreview?.bankDetails?.accountHolderName}
                </span>
              </li>
              <li className="pt-2">
                <p className="text-sm font-normal text-gray-500">IFSC Code</p>
                <span className="text-[15px] font-medium text-gray-700">
                  {openBankDetailsPreview?.bankDetails?.ifscCode}
                </span>
              </li>
              <li className="pt-2">
                <p className="text-sm font-normal text-gray-500">Bank A/C No</p>
                <span className="text-[15px] font-medium text-gray-700">
                  {openBankDetailsPreview?.bankDetails?.bankAccountNo}
                </span>
              </li>
              <li className="pt-2">
                <p className="text-sm font-normal text-gray-500">Branch Name</p>
                <span className="text-[15px] font-medium text-gray-700">
                  {openBankDetailsPreview?.bankDetails?.branchName}
                </span>
              </li>
            </ul>
            {openBankDetailsPreview?.bankDetails?.bankDetailsSelfKinOther !==
              "S" && (
              <div className="flex flex-col px-3 py-2 mt-4 border border-blue-200 rounded-md bg-blue-50">
                <div className="text-sm font-bold text-gray-900">
                  Relative&apos;s Details
                </div>
                <p className="mt-1 text-sm text-gray-700">
                  {openBankDetailsPreview?.bankDetails?.nameOfRelative}{" "}
                  <span className="italic">
                    ({openBankDetailsPreview?.bankDetails?.relationWithPatient})
                  </span>
                  <br />
                  {openBankDetailsPreview?.bankDetails?.relativeEmail} /{" "}
                  {openBankDetailsPreview?.bankDetails?.relativeMobileNo}
                </p>
                <div className="w-full h-full" />
              </div>
            )}
            <div className="flex flex-col items-center justify-center w-full gap-4 pt-6 bg-white sm:flex-row">
              <button
                type="button"
                onClick={() => {
                  setOpenBankDetailsPreview({});
                }}
                className="w-full rounded-lg bg-white ring-1 ring-gray-300 active:bg-gray-100 px-3 py-2.5 text-sm font-semibold 
                text-gray-700 hover:shadow-sm gap-1.5 icon-20"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const bankDetails = openBankDetailsPreview?.bankDetails;
                  setExistingDetails({
                    files: bankDetails?.files,
                  });
                  delete bankDetails?.code;
                  delete bankDetails?.status;
                  delete bankDetails?.ipOrOP;
                  delete bankDetails?.ipno;
                  delete bankDetails?.mrno;
                  setFormData((prev) => ({
                    ...prev,
                    ...bankDetails,
                  }));
                  setOpenBankDetailsPreview({});
                  handleFormSubmit(bankDetails, false);
                }}
                disabled={isFormVerified}
                className="w-full rounded-lg disabled:opacity-50 bg-blue-600 px-3 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
              >
                Use Previous Details
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default BankDetails;
