"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { apihelper } from "@/utils/Client";
import Modal from "@/components/Modal";
import LinearLoader from "@/components/LinearLoader";
import { ToastType } from "@/hooks/useToast";
import { CloseIcon } from "@/components/Icons";
import PDFViewer from "./PDFViewer";

export default function ViewPDF({ dt, setViewPdf, setToastProp }) {
  const { tranNo, labCode = "L" } = dt;
  const [loading, setLoading] = useState(true);

  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [pdfBlob, setPdfBlob] = useState(null);

  const viewPdf = useCallback(
    async (tranNo) => {
      setLoading(true);
      const response = await apihelper(
        `patientportal/Hospital/getFileFromAPI/${tranNo}/${labCode}`,
        {
          requestType: "blob",
        }
      );
      if (response) {
        // const url = window.URL.createObjectURL(response);
        setPdfBlob(response);
      } else {
        setToastProp({
          show: true,
          header: response?.error?.message || "Something went wrong.",
          type: ToastType.ERROR,
        });
      }
      setLoading(false);
    },
    [labCode, setToastProp]
  );

  useEffect(() => {
    viewPdf(tranNo);
  }, [tranNo, viewPdf]);

  return (
    <Modal
      className=""
      panelClass="sm:max-w-3xl"
      handleClose={() => {
        setViewPdf({});
      }}
    >
      {loading && <LinearLoader />}
      <div className="mb-5 flex justify-end">
        <button
          type="button"
          className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-700 rounded-lg text-sm w-8 h-8 flex justify-center items-center icon-20"
          onClick={() => {
            setViewPdf({});
          }}
        >
          <CloseIcon cssclass="h-5 w-5" />
        </button>
      </div>
      {pdfBlob && <PDFViewer file={pdfBlob} />}
    </Modal>
  );
}
