"use client";
import {
  BirthDayIcon,
  CloudDownloadIcon,
  PhoneIcon,
  ViewEyeIcon,
  GenderIcon,
  PlusIcon,
  CopyIcon,
  RefreshIcon,
} from "@/components/Icons";
import Image from "next/image";
import { ToastType, useToast } from "@/hooks/useToast";
import { apihelper } from "@/utils/Client";
import { blobToBase64, copyToClipBoard, getGender } from "@/utils/CommonFunc";
import { useRouter } from "next/navigation";
import { useCallback, useContext, useEffect, useState } from "react";
import ViewAbhaCard from "./ViewAbhaCard";
import Toast from "@/components/Toast";
import LinearLoader from "@/components/LinearLoader";
import { usePatient } from "@/context/PatientContext";
import AbhaAddress from "../register/with-abha/AbhaAddress";

export default function Profile(props) {
  const router = useRouter();
  const [abhaCardDetails, setAbhaCardDetails] = useState({});
  const [loading, setLoading] = useState(true);
  const { toastProp, setToastProp, closeToast } = useToast();
  const [viewAbhaCard, setViewAbhaCard] = useState(false);
  const [addCopied, setAddressCopied] = useState(false);
  const [NumCopied, setNumberCopied] = useState(false);
  const [abhaCard, setAbhaCard] = useState({});
  const [qrCodeSrc, setQrCodeSrc] = useState(null);
  const { canEditABHAAddress } = usePatient();
  const [addABHAAddress, setAddABHAAddress] = useState(false);
  const [formData, setFormData] = useState({});
  const [error, setError] = useState({});
  const [abhaResponseError, setAbhaResponseError] = useState(null);
  const [downloadloader, setDownloadLoader] = useState(false);

  const { setPatient } = usePatient();
  const handleCloseToast = useCallback(() => {
    setToastProp({ show: false, header: "", body: "", type: "" });
    closeToast();
  }, [setToastProp, closeToast]);

  useEffect(() => {
    if (NumCopied) setAddressCopied(false);
  }, [NumCopied]);

  useEffect(() => {
    if (addCopied) setNumberCopied(false);
  }, [addCopied]);

  const getAbhaCardDetails = useCallback(async () => {
    setLoading(true);
    const profileResponse = await Promise.all([
      apihelper(`patientportal/ABHA/profile`),
      apihelper(`patientportal/ABHA/profile/qrcode`, {
        requestType: "blob",
      }),
    ]);
    const response = profileResponse[0];
    const qrCodeResponse = profileResponse[1];
    if (response?.status) {
      setAbhaCardDetails(response.success);
      const address = response?.success?.address || "";
      let [first, ...rest] = address.split(",");
      setPatient({
        ...response.success,
        bldgname: first,
        streetaddress: rest.join(" "),
      });
      if (qrCodeResponse) {
        const base64Image = await blobToBase64(qrCodeResponse);
        setQrCodeSrc(base64Image);
      }
      setLoading(false);
    } else {
      setToastProp({
        show: true,
        header:
          response?.error?.message ||
          "Something went wrong. Please try again later.",
        type: ToastType.ERROR,
      });
      return setAbhaResponseError(response?.error?.message);
    }
    setLoading(false);
  }, [setToastProp, setPatient]);

  useEffect(() => {
    getAbhaCardDetails();
  }, [getAbhaCardDetails]);

  const downloadAbhaCard = useCallback(
    async (action = "download") => {
      setDownloadLoader(true);
      const response = await apihelper(`patientportal/abha/profile/card`, {
        requestType: "blob",
      });
      if (response) {
        if (action === "download") {
          const url = window.URL.createObjectURL(new Blob([response]));
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", `${abhaCardDetails?.name}.png`);
          document.body.appendChild(link);
          link.click();
          link.parentNode.removeChild(link);
        } else {
          const base64Image = await blobToBase64(response);
          setAbhaCard(base64Image);
          setViewAbhaCard(true);
        }
      }
      setDownloadLoader(false);
    },
    [abhaCardDetails]
  );

  const closeViewAbhaCard = useCallback(() => {
    setViewAbhaCard(false);
    setAbhaCard(null);
  }, []);

  const handleUseABHADetails = useCallback(async () => {
    if (!props?.searchParams?.mrno) {
      //Redirect to create patient screen and populate the form details using ABHA4
      router.push("/patient/create");
    } else {
      setLoading(true);
      const response = await apihelper(
        `patientportal/Hospital/updatePatients/${props?.searchParams?.mrno}`
      );
      if (response?.status) {
        setLoading(false);
        setToastProp({
          show: true,
          header: ToastType.SUCCESS,
          body: "ABHA details updated successfully.",
          type: ToastType.SUCCESS,
        });
        setTimeout(() => {
          router.push("/patient");
        }, 1000);
      } else {
        setLoading(false);
        setToastProp({
          show: true,
          header:
            response?.error?.message ||
            "Something went wrong. Please try again later.",
          type: ToastType.ERROR,
        });
      }
    }
  }, [props?.searchParams?.mrno, router, setToastProp]);

  const handleABHAAddressCreation = useCallback(
    async (input) => {
      if (input === null) {
        setAddABHAAddress(false);
        return;
      }
      getAbhaCardDetails();
      setAddABHAAddress(false);
    },
    [getAbhaCardDetails, setAddABHAAddress]
  );

  const onInputChange = useCallback(
    (event) => {
      const { name, value } = event.target;
      setFormData({ ...formData, [name]: value });
      setError({ ...error, [name]: "" });
    },
    [error, formData]
  );

  if (abhaResponseError) {
    return (
      <div className="flex flex-col justify-between min-h-[calc(100vh-53px)] relative overflow-hidden pt-20 bg-white">
        {toastProp.show && (
          <Toast {...toastProp} closeToast={handleCloseToast} />
        )}
        <div className="internal-scroll overflow-auto px-6 max-[375px]:px-4 pb-2">
          <div className="max-w-lg w-full mx-auto">
            <div className="flex flex-col items-center text-center my-10">
              <Image
                className="mx-auto"
                src="/session-exipre-img.svg"
                alt="Jupiter"
                width={340}
                height={320}
              />
              <div className="py-10">
                <h5 className="text-center sm:text-2xl text-xl font-semibold text-gray-700 pb-2">
                  Your session has expired
                </h5>
                <p className="px-3 text-md font-normal text-gray-500"></p>
              </div>
              {/* <p>{abhaResponseError}</p> */}
              <div className="action-btn-container w-full">
                <button
                  onClick={() => router.push("/patient")}
                  className="w-full max-w-xs mx-auto flex items-center gap-2 justify-center rounded-lg bg-blue-600 px-3 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 icon-20"
                >
                  <RefreshIcon /> Refresh
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {(loading || downloadloader) && <LinearLoader />}
      {viewAbhaCard && (
        <ViewAbhaCard
          src={abhaCard}
          open={viewAbhaCard}
          handleClose={closeViewAbhaCard}
        />
      )}
      {toastProp.show && <Toast {...toastProp} closeToast={handleCloseToast} />}
      {addABHAAddress && (
        <div className="flex flex-col justify-between min-h-[calc(100vh-53px)] relative overflow-hidden pt-20 bg-white">
          <div className="max-h-[calc(100vh-210px)] internal-scroll overflow-auto px-6 max-[375px]:px-4 pb-2">
            <div className="max-w-lg w-full mx-auto">
              <AbhaAddress
                setToastProp={setToastProp}
                formData={formData}
                onChange={onInputChange}
                patientMRNo={props?.searchParams?.mrno}
                onABHAAddressCreation={handleABHAAddressCreation}
              />
            </div>
          </div>
        </div>
      )}

      {!loading && !addABHAAddress && (
        <div className="flex flex-col justify-between min-h-[calc(100vh-53px)] relative overflow-hidden pt-20 bg-white">
          <div className="max-h-[calc(100vh-134px)] internal-scroll overflow-auto px-6 max-[375px]:px-4 pb-2">
            <div className="max-w-lg w-full mx-auto">
              <div className="my-6 text-center">
                <h1 className="text-lg md:text-xl font-semibold text-gray-800">
                  Ayushman Bharat Health Account (ABHA)
                </h1>
                <p className="mt-1 text-sm text-gray-500">
                  Welcome {abhaCardDetails?.name}, your ABHA card details.
                </p>
              </div>
              <div className="abha-details-card border border-blue-300 rounded-2xl p-4 shadow-lg mb-4">
                <div className="flex flex-row gap-4 max-[360px]:flex-col">
                  <div className="w-[132px] h-[132px] object-fill overflow-hidden border-2 border-white shadow-md rounded-2xl">
                    {abhaCardDetails?.profilePhoto && (
                      <img
                        src={`data:image/jpeg;base64,${abhaCardDetails?.profilePhoto}`}
                        alt={`${abhaCardDetails?.name} profile photo`}
                        className="w-full h-full object-cover object-center"
                      />
                    )}
                  </div>
                  <div className="demographic-details">
                    <div className="mb-2">
                      <h6 className="text-base font-semibold text-gray-800">
                        {abhaCardDetails?.name}
                      </h6>
                    </div>
                    <ul className="m-0 p-0">
                      <li className="mb-1.5">
                        <span className="flex items-center gap-2 text-sm font-medium text-gray-600 icon-20">
                          <PhoneIcon />
                          {abhaCardDetails?.mobile}
                        </span>
                      </li>
                      <li className="mb-1.5">
                        <span className="flex items-center gap-2 text-sm font-medium text-gray-600 icon-20">
                          <BirthDayIcon />
                          {`${abhaCardDetails?.dayOfBirth}-${abhaCardDetails?.monthOfBirth}-${abhaCardDetails?.yearOfBirth}`}
                        </span>
                      </li>
                      <li className="mb-1.5">
                        <span className="flex items-center gap-2 text-sm font-medium text-gray-600 icon-20">
                          <GenderIcon />
                          {getGender(abhaCardDetails?.gender)}
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="details-list my-4">
                  <ul>
                    <li className="abha-address flex items-center justify-between bg-white border border-dashed border-blue-300 rounded-lg px-3 py-2 leading-none mb-3">
                      <div className="relative">
                        <span className="font-normal text-xs text-gray-500">
                          ABHA Address
                        </span>
                        <p className="text-orange-600 text-sm font-medium">
                          {abhaCardDetails?.preferredAbhaAddress}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {canEditABHAAddress && (
                          <button
                            onClick={() => setAddABHAAddress(true)}
                            className="text-blue-600 hover:text-blue-700 icon-20"
                            title="Add ABHA Address"
                          >
                            <PlusIcon />
                          </button>
                        )}
                        <button
                          onClick={() =>
                            copyToClipBoard(
                              abhaCardDetails?.preferredAbhaAddress,
                              setAddressCopied
                            )
                          }
                          className="text-gray-500 hover:text-gray-700 icon-20 tooltip flex items-center gap-1.5 cursor-pointer abha-tooltip"
                          hover-tooltip={addCopied ? "Copied" : "Copy"}
                          tooltip-position="top"
                        >
                          <CopyIcon />
                          {/* <span className="tooltiptext">
                            {addCopied ? "Copied" : "Copy"}
                          </span> */}
                        </button>
                      </div>
                    </li>
                    <li className="abha-number flex items-center justify-between bg-white border border-dashed border-blue-300 rounded-lg px-3 py-2 leading-none mb-3">
                      <div className="relative">
                        <span className="font-normal text-xs text-gray-500">
                          ABHA Number
                        </span>
                        <p className="text-blue-900 text-sm font-medium">
                          {abhaCardDetails?.abhaNumber}
                        </p>
                      </div>
                      <button
                        onClick={() =>
                          copyToClipBoard(
                            abhaCardDetails?.abhaNumber,
                            setNumberCopied
                          )
                        }
                        className="text-gray-500 hover:text-gray-700 icon-20 tooltip flex items-center gap-1.5 cursor-pointer abha-tooltip"
                        hover-tooltip={NumCopied ? "Copied" : "Copy"}
                        tooltip-position="top"
                      >
                        <CopyIcon />
                        {/* <span className="tooltiptext">
                          {NumCopied ? "Copied" : "Copy"}
                        </span> */}
                      </button>
                    </li>
                  </ul>
                  <ul>
                    <li className="address bg-white border border-dashed border-blue-300 rounded-lg px-3 py-2 leading-none mb-3">
                      <span className="font-normal text-xs text-gray-500">
                        Address
                      </span>
                      <p className="text-gray-600 text-sm font-medium">
                        {abhaCardDetails?.address}
                      </p>
                    </li>
                    <li className="grid min-[575px]:grid-cols-2 items-center gap-3 mb-3">
                      <div className="district w-full bg-white border border-dashed border-blue-300 rounded-lg px-3 py-2 leading-none">
                        <span className="font-normal text-xs text-gray-500">
                          District
                        </span>
                        <p className="text-gray-600 text-sm font-medium">
                          {abhaCardDetails?.districtName}
                        </p>
                      </div>
                      <div className="district-code w-full bg-white border border-dashed border-blue-300 rounded-lg px-3 py-2 leading-none">
                        <span className="font-normal text-xs text-gray-500">
                          District Code
                        </span>
                        <p className="text-gray-600 text-sm font-medium">
                          {abhaCardDetails?.districtCode}
                        </p>
                      </div>
                    </li>
                    <li className="grid grid-cols-1 min-[575px]:grid-cols-3 items-center gap-3">
                      <div className="district-state w-full bg-white border border-dashed border-blue-300 rounded-lg px-3 py-2 leading-none">
                        <span className="font-normal text-xs text-gray-500">
                          State
                        </span>
                        <p className="text-gray-600 text-sm font-medium">
                          {abhaCardDetails?.stateName}
                        </p>
                      </div>
                      <div className="district-state-code w-full bg-white border border-dashed border-blue-300 rounded-lg px-3 py-2 leading-none">
                        <span className="font-normal text-xs text-gray-500">
                          State Code
                        </span>
                        <p className="text-gray-600 text-sm font-medium">
                          {abhaCardDetails?.stateCode}
                        </p>
                      </div>
                      <div className="district-state-code w-full bg-white border border-dashed border-blue-300 rounded-lg px-3 py-2 leading-none">
                        <span className="font-normal text-xs text-gray-500">
                          Pin Code
                        </span>
                        <p className="text-gray-600 text-sm font-medium">
                          {abhaCardDetails?.pincode}
                        </p>
                      </div>
                    </li>
                  </ul>
                </div>
                <div className="action-container bg-white rounded-lg p-5 flex flex-col min-[380px]:flex-row items-center gap-4 shadow-sm">
                  <div className="abha-qr-code bg-white rounded-lg border shadow-sm p-2">
                    {abhaCardDetails?.name && qrCodeSrc && (
                      <img
                        src={qrCodeSrc}
                        alt={`${abhaCardDetails?.name} QR Code`}
                        className="w-full h-full object-cover object-center"
                      />
                    )}
                  </div>
                  <div className="action-btn-container w-full">
                    <button
                      onClick={() => downloadAbhaCard("view")}
                      className="mb-3 w-full flex items-center gap-2 justify-center rounded-lg bg-blue-100 hover:bg-blue-100/75 px-3 py-2.5 text-sm font-semibold text-blue-600 hover:shadow-sm icon-20"
                    >
                      <ViewEyeIcon />
                      View Card
                    </button>
                    <button
                      onClick={() => downloadAbhaCard("download")}
                      className="mb-3 w-full flex items-center gap-2 justify-center rounded-lg bg-white ring-1 ring-gray-300 active:bg-gray-100 px-3 py-2.5 text-sm font-semibold text-gray-700 hover:shadow-sm icon-20"
                    >
                      <CloudDownloadIcon />
                      Download
                    </button>
                    <button
                      onClick={handleUseABHADetails}
                      className="mb-3 w-full flex items-center gap-2 justify-center rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                    >
                      Use ABHA Details
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
