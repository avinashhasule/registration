import { useCallback, useEffect, useRef, useState } from "react";
import { CloudUploadIcon, DeleteIcon } from "./Icons";
import { classNames } from "@/utils/CommonFunc";
import { ToastType, useToast } from "@/hooks/useToast";

export const FileDragNDrop = ({
  preUploadedFiles = [],
  onFileSelection,
  className = "",
  allowMultipleFile,
  error,
  dropContainerClassName = "",
  acceptedFileFormat = [],
  acceptedFileFormatDisplayText = "All file format accepted",
  invalidFileTyeErrorMessage = "Please upload supported files.",
  onDeletePreUploadedFile,
  resetFiles = false,
  setResetFiles = () => {},
  disabled = false,
}) => {
  const [files, setFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);
  const { setToastProp } = useToast();

  useEffect(() => {
    if (resetFiles) {
      setFiles([]);
      setResetFiles(false);
    }
  }, [resetFiles, setResetFiles]);

  const handleDragEnter = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      const newFiles = acceptedFileFormat.length
        ? Array.from(e.dataTransfer.files).filter((file) =>
            acceptedFileFormat.includes(file.type)
          )
        : Array.from(e.dataTransfer.files);
      if (!allowMultipleFile && newFiles.length > 1) {
        setToastProp({
          show: true,
          header: "Multiple files are not allowed",
          type: ToastType.ERROR,
        });
        fileInputRef.current.value = "";
        return;
      }
      if (Array.from(e.dataTransfer.files).length > newFiles.length) {
        setToastProp({
          show: true,
          header: invalidFileTyeErrorMessage,
          type: ToastType.ERROR,
        });
        fileInputRef.current.value = "";
        return;
      }
      if (newFiles.length > 0) {
        setFiles(newFiles);
        onFileSelection(newFiles);
      }
    },
    [
      acceptedFileFormat,
      allowMultipleFile,
      setToastProp,
      invalidFileTyeErrorMessage,
      onFileSelection,
    ]
  );

  const handleFileSelect = useCallback(
    (e) => {
      const newFiles = acceptedFileFormat.length
        ? Array.from(e.target.files || []).filter((file) => {
            if (acceptedFileFormat.split("/")[1] === "*") {
              return true;
            }
            return acceptedFileFormat.includes(file.type);
          })
        : Array.from(e.target.files || []);
      if (Array.from(e.target.files).length > newFiles.length) {
        setToastProp({
          show: true,
          header: invalidFileTyeErrorMessage,
          type: ToastType.ERROR,
        });
        fileInputRef.current.value = "";
        return;
      }
      if (newFiles.length > 0) {
        setFiles(newFiles);
        onFileSelection(newFiles);
      }
    },
    [
      onFileSelection,
      acceptedFileFormat,
      setToastProp,
      invalidFileTyeErrorMessage,
    ]
  );

  const openFileDialog = useCallback((e) => {
    e.stopPropagation();
    fileInputRef.current?.click();
  }, []);

  const handleRemoveFile = useCallback(
    (file) => {
      const newFiles = files.filter(
        (f) =>
          !(
            f.name === file.name &&
            f.size === file.size &&
            f.type === file.type
          )
      );
      setFiles(newFiles);
      onFileSelection(newFiles);
      fileInputRef.current.value = "";
    },
    [onFileSelection, files]
  );

  return (
    <div className={classNames("flex flex-col items-start", className)}>
      <div
        role="none"
        className={classNames(
          "border border-gray-300 rounded-lg w-full flex flex-col justify-center",
          isDragging ? "bg-blue-100" : "",
          dropContainerClassName,
          error && "border-1 border-red-500  focus:border-red-600"
        )}
        onDragEnter={!disabled ? handleDragEnter : null}
        onDragLeave={!disabled ? handleDragLeave : null}
        onDragOver={!disabled ? handleDragOver : null}
        onDrop={!disabled ? handleDrop : null}
      >
        <div className="flex flex-col items-center justify-center w-full h-32 p-4 text-sm font-medium text-gray-600">
          {isDragging && "Drop file(s) here"}
          {!isDragging && (
            <>
              <div className="p-2 text-gray-600 bg-gray-200 rounded-full">
                <CloudUploadIcon />
              </div>
              <div className="mt-3 text-sm font-medium text-gray-500">
                <button
                  onClick={!disabled ? openFileDialog : null}
                  className={classNames(
                    "text-sm font-semibold text-blue-600",
                    !disabled ? "cursor-pointer" : "cursor-default"
                  )}
                  type="button"
                >
                  Click to Upload
                </button>{" "}
                or drag and drop
              </div>
              <div className="mt-1 text-xs text-gray-500">
                {acceptedFileFormatDisplayText}
              </div>
            </>
          )}
        </div>
        <input
          ref={fileInputRef}
          type="file"
          hidden
          disabled={disabled}
          id="browse"
          onChange={handleFileSelect}
          accept={acceptedFileFormat}
          multiple={allowMultipleFile}
        />
      </div>
      {files.map((file) => (
        <div
          key={file.name}
          className="flex justify-between items-center gap-1 mt-1.5 w-full"
        >
          <span className="text-sm font-normal text-gray-600 bg-gray-200 rounded-lg px-3 py-1.5 grow">
            {file.name}
          </span>
          <button
            onClick={() => handleRemoveFile(file)}
            className="bg-red-100 text-red-500 icon-20 hover:text-red-600 rounded-lg p-1.5"
            aria-label={`Remove ${file.name}`}
          >
            <DeleteIcon />
          </button>
        </div>
      ))}
      {preUploadedFiles.map((file) => (
        <div
          key={`${file.name}`}
          className="flex justify-between items-center gap-1 mt-1.5 w-full"
        >
          <span className="text-sm font-normal text-gray-600 bg-gray-200 rounded-lg px-3 py-1.5 grow">
            {file.name}
          </span>
          <button
            onClick={() => onDeletePreUploadedFile?.(file)}
            className="bg-red-100 text-red-500 icon-20 hover:text-red-600 rounded-lg p-1.5"
            aria-label={`Remove ${file.name}`}
          >
            <DeleteIcon />
          </button>
        </div>
      ))}
    </div>
  );
};
