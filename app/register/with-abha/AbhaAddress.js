"use client";
import LinearLoader from "@/components/LinearLoader";
import ShowError from "@/components/ShowError";
import { ToastType } from "@/hooks/useToast";
import { apihelper } from "@/utils/Client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

export default function AbhaAddress({
  setToastProp,
  formData,
  onChange,
  patientMRNo,
  onABHAAddressCreation = null,
}) {
  const abhaExtn = process.env.NEXT_PUBLIC_ABHA_ADDRESS_SUFFIX;

  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const router = useRouter();

  const getSuggestions = useCallback(async () => {
    setLoading(true);
    const suggestions = await apihelper(`patientportal/abha/suggestion`);
    if (suggestions?.success) {
      setSuggestions(suggestions?.success?.abhaAddressList);
    } else {
      setToastProp({
        show: true,
        header: suggestions?.error?.message || "Something went wrong",
        type: ToastType.ERROR,
      });
    }
    setLoading(false);
  }, [setSuggestions, setToastProp]);

  const handleAbhaCreation = useCallback(() => {
    const createAbhaAddress = async () => {
      if (!formData["abhaAddress"]) {
        setError(true);
        return;
      }
      setLoading(true);
      const response = await apihelper(
        `patientportal/abha/save/abha-address/${formData["abhaAddress"]}`
      );
      if (
        response?.success &&
        response?.success?.preferredAbhaAddress &&
        response?.success?.healthIdNumber
      ) {
        if (onABHAAddressCreation === null) {
          if (patientMRNo) router.push(`/profile?mrno=${patientMRNo}`);
          else router.push("/profile");
        } else {
          onABHAAddressCreation({
            preferredAbhaAddress: response?.success?.preferredAbhaAddress,
            healthIdNumber: response?.success?.healthIdNumber,
          });
        }
        // to clear the field
        onChange({ target: { value: "", name: "abhaAddress" } })
      } else {
        setLoading(false);
        setToastProp({
          show: true,
          header: response?.error?.message || "Something went wrong",
          type: ToastType.ERROR,
        });
      }
    };
    createAbhaAddress();
  }, [formData, router, setToastProp, patientMRNo, onABHAAddressCreation]);

  useEffect(() => {
    getSuggestions();
  }, [getSuggestions]);

  return (
    <>
      <div className="mt-4 mb-4">
        {loading && <LinearLoader />}
        <Image
          width={440}
          height={440}
          src="/ABHA_address_img.svg"
          alt="ABHA_address_img"
          className="mx-auto"
        />
      </div>
      <div className="relative">
        <h1 className="text-lg md:text-xl font-semibold text-gray-800">
          Create Your Unique ABHA Address
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          ABHA (Ayushman Bharat Health Account) address is a unique username
          that allows you to share and access your health records digitally. It
          is similar to an email address, but it is only used for health
          records.
        </p>
        <div className="mt-6">
          <div className="mb-4">
            <label
              htmlFor="abhaAddress"
              className="block text-sm font-medium leading-6 text-gray-600"
            >
              Enter ABHA address
            </label>
            <div className="relative mt-2">
              <div className="form-item flex ring-1 rounded-lg ring-inset ring-gray-300">
                <input
                  type="text"
                  name="abhaAddress"
                  id="abhaAddress"
                  value={formData["abhaAddress"]}
                  onChange={(e) => {
                    setError(false);
                    onChange(e);
                  }}
                  className="block w-full rounded-lg rounded-e-none border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-blue-600 text-sm leading-6 font-medium"
                  placeholder="Enter ABHA address"
                />
                <span className="flex rounded-lg rounded-s-none select-none items-center pl-2 pr-2 text-gray-500 text-sm font-medium outline-none">
                  {abhaExtn}
                </span>
              </div>
              {error && !formData["abhaAddress"] ? (
                <ShowError error={["Please select/enter valid ABHA address"]} />
              ) : (
                ""
              )}
              <p className="mt-2 text-sm text-gray-500">
                To create ABHA address, it should have Min - 8 characters, Max -
                18 characters, special characters allowed - 1 dot (.) and/or 1
                underscore (_).
              </p>
            </div>
          </div>

          <div className="border-t border-dashed border-gray-300 pt-4">
            <span className="block font-medium text-sm pb-2 text-gray-700">
              Suggestions:
            </span>
            <ul className="flex flex-wrap items-center">
              {suggestions.map((s) => {
                return (
                  <li key={s}>
                    <span
                      onClick={(event) => {
                        event.preventDefault();
                        setError(false);
                        onChange({ target: { name: "abhaAddress", value: s } });
                      }}
                      className="mr-2 mb-2 py-1 px-2 font-normal text-sm inline-block rounded-full cursor-pointer bg-gray-100 text-gray-600 hover:text-blue-600 leading-none"
                    >
                      {s}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
      <div className="w-full absolute bottom-0 inset-x-0 px-6 max-[375px]:px-4 py-4 bg-white flex items-center justify-center gap-x-4 shadow-top">
        {onABHAAddressCreation && (
          <button
            onClick={() => onABHAAddressCreation(null)}
            type="button"
            className="sm:w-60 w-full rounded-lg bg-white ring-1 ring-gray-300 active:bg-gray-100 px-3 py-2.5 text-sm font-semibold 
                    text-gray-700 hover:shadow-sm gap-1.5 icon-20"
          >
            Back
          </button>
        )}
        <button
          onClick={handleAbhaCreation}
          type="button"
          className="sm:w-60 w-full rounded-lg bg-blue-600 px-3 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        >
          Submit
        </button>
      </div>
    </>
  );
}
