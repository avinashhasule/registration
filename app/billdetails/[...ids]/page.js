"use client";
import Footer from "@/components/Footer";
import { XCircleIcon } from "@/components/Icons";
import LinearLoader from "@/components/LinearLoader";
import { apihelper } from "@/utils/Client";
import Image from "next/image";
import { NoDataIcon } from "@/components/Icons";
import { useEffect, useState } from "react";

export default function InvoiceDetails(props) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({});
  const [error, setError] = useState(null);
  const [location = null, billUid = null] = props?.params?.ids;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const response = await apihelper(
        `/patientportal/ExternalAPIs/getBillDetails/${location}/${billUid}`
      );
      if (response.status) {
        setData(response.success[0]);
      } else {
        setError(response?.error?.message || "Something went wrong");
      }
      setLoading(false);
    };
    if (location !== null && billUid !== null) fetchData();
    else {
      setLoading(false);
      setError("Invalid URL");
    }
  }, [billUid, location]);

  return (
    <>
      {loading && <LinearLoader />}
      <div className="auth-cover bg-white">
        <div className="flex lg:flex-row flex-col min-h-full flex-1 lg:pr-0 lg:p-8 xl:p-10 2xl:px-4 2xl:w-5/6 mx-auto ease-linear duration-200">
          <div className="left-panel bg-[#00275b] flex flex-1 flex-col justify-center items-center lg:rounded-2xl px-4 py-8 sm:py-12 sm:px-6 lg:px-18 xl:px-12 relative overflow-hidden">
            <div className="mx-auto text-center lg:text-left z-10">
              <Image
                className="inset-0 lg:mx-0 mx-auto max-[480px]:w-44"
                src="/Logo.png"
                alt="Logo Image"
                width={250}
                height={100}
              />
              <div className="auth-content lg:mt-16 mt-8">
                <h3 className="max-[480px]:text-lg text-2xl font-medium leading-normal text-white justify-center lg:justify-start">
                  Welcome to
                </h3>
                <h1 className="max-[480px]:text-3xl text-4xl font-bold text-white leading-normal pt-2 md:pt-5">
                  Jupiter Hospital
                </h1>
              </div>
            </div>
          </div>
          <div className="right-panel flex flex-1 flex-col justify-center px-4 py-12 max-[920px]:mx-0 max-[1023px]:mx-40 sm:px-6 lg:px-18 xl:px-24">
            {error && (
              <div className="flex flex-col items-center gap-6 text-center mx-auto text-2xl font-medium text-gray-500">
                <NoDataIcon className="w-6" />
                {error}{" "}
              </div>
            )}
            {!error && data?.billno && (
              <div className="block">
                <h1 className="block text-2xl font-semibold leading-6 text-gray-800 text-center pb-6 sm:pb-8">
                  Bill Details
                </h1>
                {/* <div className="flex flex-col items-end pb-4 gap-1">
                  <p className="text-blue-600 font-medium text-base">
                    {data?.billno}
                  </p>
                  <p className="flex items-center gap-1 text-gray-600 text-base font-normal">
                    Date: <span>{data?.billdate}</span>
                  </p>
                </div> */}
                <div className="flex flex-col gap-2">
                  <ul className="flex flex-col px-4 sm:px-6 bg-blue-50 border border-blue-100 rounded-lg p-5">
                    <li className="flex justify-between max-[400px]:flex-col max-[400px]:items-start items-center text-gray-500 font-normal text-base py-3 border-b border-gray-300/70">
                      <p>Bill No: </p>{" "}
                      <span className="text-gray-700 font-medium text-base text-right max-[400px]:text-left max-[400px]:text-sm">
                        {data?.billno}
                      </span>
                    </li>
                    <li className="flex justify-between max-[400px]:flex-col max-[400px]:items-start items-center text-gray-500 font-normal text-base py-3 border-b border-gray-300/70">
                      <p>Bill Date: </p>{" "}
                      <span className="text-gray-700 font-medium text-base text-right max-[400px]:text-left max-[400px]:text-sm">
                        {data?.billdate}
                      </span>
                    </li>
                    <li className="flex justify-between max-[400px]:flex-col max-[400px]:items-start items-center text-gray-500 font-normal text-base py-3 border-b border-gray-300/70">
                      <p>IP No: </p>{" "}
                      <span className="text-gray-700 font-medium text-base text-right max-[400px]:text-left max-[400px]:text-sm">
                        {data?.ipno}
                      </span>
                    </li>
                    <li className="flex justify-between max-[400px]:flex-col max-[400px]:items-start items-center text-gray-500 font-normal text-base py-3 border-b border-gray-300/70">
                      <p>Patient Name: </p>{" "}
                      <span className="text-gray-700 font-medium text-base text-right max-[400px]:text-left max-[400px]:text-sm">
                        {data?.patname}
                      </span>
                    </li>
                    <li className="flex justify-between max-[400px]:flex-col max-[400px]:items-start items-center text-gray-500 font-normal text-base py-3 border-b border-gray-300/70">
                      <p>Credit Company: </p>{" "}
                      <span className="text-gray-700 font-medium text-base text-right max-[400px]:text-left max-[400px]:text-sm">
                        {data?.crdcompdesc}
                      </span>
                    </li>
                    <li className="flex justify-between max-[400px]:flex-col max-[400px]:items-start items-center text-gray-500 font-normal text-base py-3 border-b border-gray-300/70">
                      <p>Insurance Provider Name: </p>{" "}
                      <span className="text-gray-700 font-medium text-base text-right max-[400px]:text-left max-[400px]:text-sm">
                        {data?.insurcompdesc}
                      </span>
                    </li>
                    <li className="flex justify-between max-[400px]:flex-col max-[400px]:items-start items-center text-gray-500 font-normal text-base py-3 border-b border-gray-300/70">
                      <p>Location: </p>{" "}
                      <span className="text-gray-700 font-medium text-base text-right max-[400px]:text-left max-[400px]:text-sm">
                        {data?.location || location}
                      </span>
                    </li>
                    <li className="flex justify-between max-[400px]:flex-col max-[400px]:items-start items-center text-gray-500 font-normal text-base py-3 border-b border-gray-300/70">
                      <p>Date Admission: </p>{" "}
                      <span className="text-gray-700 font-medium text-base text-right max-[400px]:text-left max-[400px]:text-sm">
                        {data?.admndate}
                      </span>
                    </li>
                    <li className="flex justify-between max-[400px]:flex-col max-[400px]:items-start items-center text-gray-500 font-normal text-base py-3 border-b border-gray-300/70">
                      <p>Date of Discharge: </p>{" "}
                      <span className="text-gray-700 font-medium text-base text-right max-[400px]:text-left max-[400px]:text-sm">
                        {data?.dischrgdt}
                      </span>
                    </li>
                    {/* <li className="flex justify-between max-[400px]:flex-col max-[400px]:items-start items-center text-gray-700 font-normal text-base pt-3 pb-2">
                      <p>Gross Amount:</p>{" "}
                      <span className="text-gray-700 font-semibold text-base">
                        {data?.billamt}
                      </span>
                    </li> */}
                    <li className="flex justify-between max-[400px]:flex-col max-[400px]:items-start items-center text-gray-700 font-semibold text-base pt-3 pb-4 border-b border-gray-300/70">
                      <p>
                        Net Amount:{" "}
                        {/* <span className="text-xs font-normal text-gray-500 block">
                          Cashless Claim Amount + Patient Amount
                        </span> */}
                      </p>{" "}
                      <span className="text-blue-600 text-base whitespace-nowrap text-right max-[400px]:text-left max-[400px]:text-sm">
                        {data?.netamt}
                      </span>
                    </li>
                    <ul className="w-full flex flex-col gap-2 mt-4 items-end">
                      <li className="w-3/5 max-[400px]:w-full max-[400px]:items-start max-[400px]:flex-col flex justify-between items-center text-gray-500 font-normal text-base gap-2">
                        <p className="min-[380px]:w-56 block">
                          Cashless Claim Amount:
                        </p>
                        <span className="text-gray-700 font-medium text-base whitespace-nowrap text-right max-[400px]:text-left max-[400px]:text-sm">
                          {data?.crdcmpamt}
                        </span>
                      </li>
                      <li className="w-3/5 max-[400px]:w-full max-[400px]:items-start max-[400px]:flex-col flex justify-between items-center text-gray-500 font-normal text-base gap-2">
                        <p className="min-[380px]:w-56 block">
                          {" "}
                          Patient Amount:
                        </p>
                        <span className="text-gray-700 font-medium text-base whitespace-nowrap text-right max-[400px]:text-left max-[400px]:text-sm">
                          {data?.patamt}
                        </span>
                      </li>
                    </ul>
                  </ul>
                </div>
              </div>
            )}
            {/* <Footer /> */}
          </div>
        </div>
      </div>
    </>
  );
}

{
  /* 
                     {
    "BILLNO": "FB2023-00001",
    "BILLDATE": "Jan 22, 2024",
    "PATNAME": "Test Test Test",
    "CRDCOMPDESC": "",
    "INSURCOMPDESC": "",
    "ADMNDATE": "Jan 22, 2024",
    "DISCHRGDT": "Jan 01, 1900",
    "BILLAMT": 322170.00,
    "PATAMT": 252405.00,
    "CRDCMPAMT": 0.00
  }
                    <div className="bg-blue-50 rounded-lg p-5 space-y-4">
                        <div className="flex flex-col justify-between min-[480px]:flex-row gap-4">
                            <div className="block flex-1">
                                <h6 className="text-gray-700 font-semibold text-lg pb-1">{data?.name} John Mark</h6>
                                <p className="text-gray-500 font-normal text-base">Jupiter Hospital, Thane</p>
                            </div>
                            <div className="block flex-1 text-start min-[480px]:text-right">
                                <h6 className="text-gray-700 font-semibold text-lg pb-1">Max Life Insurance</h6>
                                <p className="text-gray-500 font-normal text-base">{data?.name} Mike Jordan</p>
                            </div>
                        </div>
                        <div className="border-t border-gray-300 pt-4">
                            <p className="flex justify-between items-center text-gray-500 font-normal text-base pb-2">Date of Admission: <span className="text-gray-700 font-medium text-base text-right max-[400px]:text-left max-[400px]:text-sm">23 Aug 2023</span></p>
                            <p className="flex justify-between items-center text-gray-500 font-normal text-base">Date of Discharge: <span className="text-gray-700 font-medium text-base text-right max-[400px]:text-left max-[400px]:text-sm">01 Aug 2023</span></p>
                        </div>
                    </div> */
}
