"use client";
export default function ShowError({ error = [] }) {
  if (error.length === 0) return null;
  return (
    <>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
        {/* <ExclamationCircleIcon
          cssclass="h-5 w-5 text-red-500"
          aria-hidden="true"
        /> */}
      </div>
      <p className="mt-1 text-sm text-red-600" id="email-error">
        {error.join(", ")}
      </p>
    </>
  );
}
