"use client";
import {
  BirthDayIcon,
  AbhaCheckedIcon,
  PhoneIcon,
  CrossIcon,
  LocationIcon,
  ViewEyeIcon,
  BankIcon,
  BedIcon,
} from "@/components/Icons";
import Toast from "@/components/Toast";
import { useToast } from "@/hooks/useToast";

const tooltip = (p) => {
  if (p.isabhaverified) {
    return {
      ["hover-tooltip"]: `ABHA Number: ${p.abhaNumber} ABHA Address: ${p.preferredabhaaddress}`,
    };
  }
  return {};
};

export default function PatientList({
  patientList,
  handleverify,
  editPatient,
  viewPatient,
  openBankDetails,
}) {
  const { toastProp, closeToast } = useToast();
  return (
    <div className="grid gap-4 mt-4 md:grid-cols-2 lg:grid-cols-3">
      {toastProp.show && <Toast {...toastProp} closeToast={closeToast} />}
      {patientList.map((p) => {
        return (
          <div key={p.mrno} className="pcard-item">
            <div className="flex flex-col justify-between h-full duration-150 ease-linear border border-gray-300 rounded-lg hover:shadow-lg">
              <div
                //title="Click to Patient Details"
                className="relative p-4 duration-150 ease-linear rounded-t-lg md:p-5"
              >
                <div className="flex items-baseline justify-between w-full gap-3 mb-4">
                  <div className="flex flex-col flex-wrap">
                    <h6 className="text-base font-semibold leading-5 text-gray-800">
                      {p.name} {p.patname}{" "}
                    </h6>
                    <span className="text-xs font-semibold text-orange-600 pt-0.5">
                      (MRN - {p.mrno})
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {!!p.ipno && (
                      <div
                        className="a-tooltip px-1 aspect-square py-0.5 flex items-center leading-none text-sm font-medium text-white rounded-full group/item ease-linear duration-150 bg-blue-800"
                        hover-tooltip="Currently Admitted"
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                      >
                        <span className="duration-150 ease-linear group-hover/item:animate-pulse group-hover/item:scale-110">
                          <BedIcon className="w-5 h-5 text-white" />
                        </span>
                      </div>
                    )}

                    <button
                      title={!p.isabhaverified ? "Verify ABHA Number" : ""}
                      onClick={(e) => {
                        e.stopPropagation();
                        //  if (!p.isabhaverified) handleverify(p);
                      }}
                    >
                      <div
                        {...tooltip(p)}
                        className={`a-tooltip pl-2 pr-0.5 py-0.5 gap-0.5 leading-none inline-flex text-sm font-medium items-center text-white justify-center rounded-full cursor-pointer group/item ease-linear duration-150 ${
                          p.isabhaverified ? "bg-blue-800" : "bg-red-800"
                        }`}
                      >
                        <span>ABHA </span>

                        <span className="duration-150 ease-linear group-hover/item:animate-pulse group-hover/item:scale-110">
                          {p.isabhaverified ? (
                            <AbhaCheckedIcon className="w-6 h-6" />
                          ) : (
                            <CrossIcon className="w-6 h-6" />
                          )}
                        </span>
                      </div>
                    </button>
                  </div>
                </div>
                <div className="demographic-details">
                  <ul className="flex flex-col gap-2 p-0 m-0">
                    <li>
                      <span className="flex items-center gap-2 text-sm font-medium text-gray-600 icon-16">
                        <BirthDayIcon />
                        {`${p.patdob.substring(0, 4)}/${p.patdob.substring(
                          4,
                          6
                        )}/${p.patdob.substring(6, 8)}`}
                      </span>
                    </li>
                    <li>
                      <span className="flex items-center gap-2 text-sm font-medium text-gray-600 icon-16">
                        <PhoneIcon />
                        {p.patmobile}
                      </span>
                    </li>

                    <li>
                      <span className="flex items-start gap-2 text-sm font-medium text-gray-600">
                        <p className=" icon-16">
                          <LocationIcon />
                        </p>
                        <span className="capitalize patient-card-overflow-wrap">
                          {`${p.pataddR1} ${p.pataddR2} ${p.pataddR3}`}
                        </span>
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="flex max-[400px]:flex-col border-t border-gray-300 max-[400px]:gap-3 divide-x max-[400px]:divide-y divide-gray-300 bg-white rounded-b-lg overflow-hidden">
                <button
                  onClick={() => openBankDetails(p)}
                  className="flex items-center justify-center w-full h-full gap-2 px-1 py-4 text-sm font-semibold text-gray-600 hover:bg-blue-50 hover:text-blue-600 icon-20"
                >
                  <span className="icon-20">
                    <BankIcon />
                  </span>
                  Add Bank Details
                </button>
                <button
                  onClick={() => viewPatient(p)}
                  className="flex items-center justify-center w-full h-full gap-2 px-1 py-4 text-sm font-semibold text-gray-600 hover:bg-blue-50 hover:text-blue-600 icon-20"
                >
                  <span className="icon-20">
                    <ViewEyeIcon />
                  </span>
                  View Details
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
