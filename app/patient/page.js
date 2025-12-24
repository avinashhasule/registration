"use client";
import { PlusIcon, ArrowLeftIcon } from "@/components/Icons";
import { useAuth } from "@/context/AuthProvider";
import { apihelper } from "@/utils/Client";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import PatientList from "./List";
import { usePatient } from "@/context/PatientContext";
import LinearLoader from "@/components/LinearLoader";
import { camelize } from "@/utils/CommonFunc";

export default function PatientGrid(props) {
  const { loading } = useAuth();
  const router = useRouter();
  const [patientList, setPatientList] = useState([]);
  const [isPatientListLoading, setIsPatientListLoading] = useState(false);
  const { setPatient } = usePatient();

  useEffect(() => {
    setPatient({});
  }, [setPatient]);

  const editPatient = (patient) => {
    setPatient({
      mrno: patient.mrno,
      preferredAbhaAddress: patient.preferredabhaaddress,
      abhaNumber: patient.abhaNumber,
      firstName: camelize(patient.patfname),
      middleName: camelize(patient.patmname),
      lastName: camelize(patient.patlname),
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
      isabhaverified: patient.isabhaverified,
      nationality: patient.nationality,
      pincode: patient.zip,
      title: patient.salutation,
      nextofkin: patient.nextofkin,
      nextofkinrelation: patient.nextofkinrelation,
      nickName: patient.nickName,
      occupation: patient.occupation,
      isDeceased: patient.isDeceased,
    });
    router.push(`/patient/${patient.mrno}`);
  };

  const getPatientList = useCallback(async () => {
    setIsPatientListLoading(true);
    const response = await apihelper("patientportal/hospital/getpatients");
    if (response.status) {
      if (response.success.length === 0) {
        router.push("/register");
        return;
      }
      setPatientList(response.success);
    }
    setIsPatientListLoading(false);
  }, [router]);

  useEffect(() => {
    if (patientList.length === 0) getPatientList();
  }, [patientList, getPatientList]);

  const handleABHAVerification = (patient) =>
    router.push(`/register?mrno=${patient.mrno}`);

  const viewPatient = (patient) => {
    setPatient({
      mrno: patient.mrno,
      firstName: camelize(patient.patfname),
      middleName: camelize(patient.patmname),
      preferredAbhaAddress: patient.preferredabhaaddress,
      abhaNumber: patient.abhaNumber,
      lastName: camelize(patient.patlname),
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
      isabhaverified: patient.isabhaverified,
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
      isDeceased: patient.isDeceased,
    });
    router.push(`/patient/details/${patient.mrno}`);
  };

  const openBankDetails = (patient) => {
    setPatient({
      mrno: patient.mrno,
      ipno: patient.ipno,
      firstName: camelize(patient.patfname),
      middleName: camelize(patient.patmname),
      preferredAbhaAddress: patient.preferredabhaaddress,
      abhaNumber: patient.abhaNumber,
      lastName: camelize(patient.patlname),
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
      isabhaverified: patient.isabhaverified,
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
      isDeceased: patient.isDeceased,
    });
    router.push(`/patient/bankdetails/${patient.mrno}`);
  };

  return (
    <>
      {(loading || isPatientListLoading) && <LinearLoader />}
      {!loading && !isPatientListLoading && (
        <div className="flex flex-col justify-between min-h-[calc(100vh-53px)] relative overflow-hidden pt-20 bg-white">
          <div className="max-h-[calc(100vh-134px)] internal-scroll overflow-auto px-6 max-[375px]:px-4 pb-2">
            <div className="w-full mx-auto mb-4 max-w-7xl xl:px-4">
              <div className="relative">
                <div className="sticky top-0 z-20 bg-white">
                  <div className="flex items-center justify-between pt-6 mb-5 sm:pb-5 sm:border-b">
                    <div className="flex items-center">
                      <h1 className="text-lg md:text-xl font-semibold text-gray-800">
                        Patient List
                      </h1>
                    </div>
                    <div>
                      <button
                        className="inline-flex items-center rounded-lg bg-blue-600 px-2 sm:px-3 py-2 sm:py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 gap-2 icon-20"
                        onClick={() => router.push("/register")}
                      >
                        <PlusIcon className="" aria-hidden="true" />
                        <span className="hidden sm:block">Add Patient</span>
                      </button>
                    </div>
                  </div>
                  <div className="text-center sm:text-right bg-gray-200 sm:bg-transparent rounded-lg py-1.5 sm:py-0">
                    <h2 className="inline-block sm:text-sm text-[12px] font-medium leading-5 text-gray-500 uppercase">
                      {patientList.length} PATIENT REGISTERED
                    </h2>
                  </div>
                </div>
                {patientList.length > 0 && (
                  <PatientList
                    patientList={patientList}
                    handleverify={handleABHAVerification}
                    editPatient={editPatient}
                    viewPatient={viewPatient}
                    openBankDetails={openBankDetails}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
