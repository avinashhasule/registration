"use client";
export default function Footer() {
  return (
    <footer className="w-full bg-gray-700 border-t">
      <div className="px-2 py-4 text-center lg:px-8">
        <div className="">
          <p className="text-center text-sm leading-5 text-white">
            &copy; {new Date().getFullYear()} Jupiter Hospital, All Rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
