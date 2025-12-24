"use client";
// components/pdfviewer.tsx
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";
import { useMemo, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/legacy/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

export default function PDFViewer(props) {
  const [numPages, setNumPages] = useState(0);
  const [pageNumber, setPageNumber] = useState(1); // start on first page
  const [loading, setLoading] = useState(true);
  const [pageWidth, setPageWidth] = useState(0);

  function onDocumentLoadSuccess({ numPages: nextNumPages }) {
    setNumPages(nextNumPages);
  }

  function onPageLoadSuccess() {
    setPageWidth(window.innerWidth);
    setLoading(false);
  }

  const options = useMemo(
    () => ({
      cMapUrl: "cmaps/",
      cMapPacked: true,
      standardFontDataUrl: "standard_fonts/",
    }),
    []
  );

  // Go to next page
  function goToNextPage() {
    setPageNumber((prevPageNumber) => prevPageNumber + 1);
  }

  function goToPreviousPage() {
    setPageNumber((prevPageNumber) => prevPageNumber - 1);
  }

  return (
    <>
      <Nav pageNumber={pageNumber} numPages={numPages} />
      <div
        hidden={loading}
        className="pdf-view flex items-center relative max-[480px]:h-full"
      >
        <div
          className={`flex items-center justify-end w-full absolute -top-[46px] hover:z-10 pe-2`}
        >
          <button
            onClick={goToPreviousPage}
            disabled={pageNumber <= 1}
            className="relative h-[calc(100vh - 64px)] px-2 py-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg z-10"
          >
            <span className="sr-only">Previous</span>
            <ChevronLeftIcon className="w-6 h-6" aria-hidden="true" />
          </button>
          <button
            onClick={goToNextPage}
            disabled={pageNumber >= numPages}
            className="relative h-[calc(100vh - 64px)] px-2 py-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg z-10"
          >
            <span className="sr-only">Next</span>
            <ChevronRightIcon className="w-6 h-6" aria-hidden="true" />
          </button>
        </div>

        <div className="flex justify-center w-full h-full mx-auto overflow-auto internal-scroll">
          <Document
            file={props.file}
            onLoadSuccess={onDocumentLoadSuccess}
            options={options}
            renderMode="canvas"
            className=""
          >
            <Page
              className=""
              key={pageNumber}
              pageNumber={pageNumber}
              renderAnnotationLayer={false}
              renderTextLayer={false}
              onLoadSuccess={onPageLoadSuccess}
              onRenderError={() => setLoading(false)}
              width={Math.max(pageWidth * 0.8, 390)}
            />
          </Document>
        </div>
      </div>
    </>
  );
}

function Nav({ pageNumber, numPages }) {
  return (
    <nav className="bg-gray-800 rounded-xl">
      <div className="p-2 mx-auto">
        <div className="relative flex items-center justify-start">
          <div className="flex items-center justify-center sm:items-stretch sm:justify-start">
            <div className="flex items-center flex-shrink-0">
              <p className="text-2xl font-bold tracking-tighter text-white"></p>
            </div>
          </div>
          <div className="flex items-center">
            <div className="px-3 py-2 text-sm font-medium text-white bg-gray-700 rounded-lg">
              <span>{pageNumber}</span>
              <span className="text-gray-400"> / {numPages}</span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
