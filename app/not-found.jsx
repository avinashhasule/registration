"use client";
import AppHeader from "@/components/AppHeader";
import Footer from "@/components/Footer";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();
  return (
    <>
      <AppHeader displayNav={false} />
      <div className="flex flex-col justify-between min-h-[calc(100vh-53px)] relative overflow-hidden pt-20 bg-white">
        <div className="max-h-[calc(100vh-210px)] internal-scroll overflow-auto px-6 max-[375px]:px-4 pb-2">
          <main className="grid min-h-full place-items-center bg-white px-6 py-24 sm:py-32 lg:px-8">
            <div className="text-center">
              <p className="text-base font-semibold text-indigo-600">404</p>
              <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">
                Page not found
              </h1>
              {/* <p className="mt-6 text-base leading-7 text-gray-600">
          Sorry, we couldn&apos;t find the page you&apos;re looking for.
        </p> */}
              <div className="mt-10 flex items-center justify-center gap-x-6">
                <button
                  onClick={() => window.location.assign("/")}
                  className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Go back
                </button>
                {/* <a href="#" className="text-sm font-semibold text-gray-900">
            Contact support <span aria-hidden="true">&rarr;</span>
          </a> */}
              </div>
            </div>
          </main>
        </div>
      </div>
      <Footer />
    </>
  );
}
