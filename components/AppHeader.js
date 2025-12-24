"use client";
import { useEffect, useState, Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import { ChevronDownIcon, ProfileIcon } from "./Icons";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { classNames } from "@/utils/CommonFunc";
import { useAuth } from "@/context/AuthProvider";

export default function AppHeader({ displayNav = true }) {
  // const [activeOrg, setActiveOrg] = useState(orgOptions[0]?.name);

  const [navigation, setNavigation] = useState([]);
  const router = useRouter();
  const pathname = usePathname();
  const [loader, setLoader] = useState(false);
  const { handleLogout } = useAuth();

  useEffect(() => {
    if (
      pathname.includes("register") ||
      pathname.includes("verify") ||
      pathname.includes("profile")
    ) {
      setNavigation([
        { name: "Patient List", href: "/patient" },
        { name: "ABHA Home Page", href: "/register" },
      ]);
    }
  }, [pathname]);

  const handleNavClick = (href) => {
    router.push(href);
  };

  // const logout = useCallback(async () => {
  //   setLoader(true);
  //   const response = await apihelper("patientportal/Login/Logout");
  //   window.localStorage.removeItem("patient-portal-token");
  //   router.push("/login");
  //   setLoader(false);
  // }, [router]);

  return (
    <header className="fixed bg-gray-100 border-b inset-x-0 z-30">
      <nav
        className="flex mx-auto lg:max-w-7xl items-center justify-between py-4 px-5 max-[375px]:px-4"
        aria-label="Global"
      >
        <a href="#" className="-m-1.5 p-1.5 outline-none">
          <span className="sr-only">Your Company</span>
          <Image
            width={150}
            height={150}
            className="h-12 w-auto"
            src="/Logo.png"
            alt=""
          />
        </a>

        {displayNav && (
          <div className="flex items-center gap-x-4 lg:gap-x-6">
            {/* Profile dropdown */}
            <Menu as="div" className="relative">
              <Menu.Button className="flex items-center gap-2">
                <span className="sr-only">Open user menu</span>

                {/* <div className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-orange-600">
                <span className="text-sm font-medium leading-none text-white">
                  {userInitials}
                </span>
              </div> */}
                <div className="flex items-center gap-2">
                  {/* <div className="hidden md:flex flex-col md:items-start">
                  <span
                    className="text-sm font-semibold leading-4 capitalize text-gray-800"
                    aria-hidden="true"
                  >
                    {displayName}
                  </span>
                  <span
                    className="text-xs font-medium leading-4 text-orange-600 pt-1"
                    aria-hidden="true"
                  >
                    {"Text Org"}
                  </span>
                </div> */}
                  <span className="h-5 w-5 text-gray-700">
                    <ProfileIcon aria-hidden="true" />
                  </span>

                  <span className="h-5 w-5 text-gray-700">
                    <ChevronDownIcon aria-hidden="true" />
                  </span>
                </div>
              </Menu.Button>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute right-0 z-50 mt-2.5 w-48 origin-top-right rounded-lg bg-white shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
                  <ul className="py-2">
                    {[
                      ...navigation,
                      {
                        name: "Logout",
                      },
                    ].map((item) => (
                      <Menu.Item key={item.name}>
                        {({ active }) => (
                          <li
                            onClick={(e) => {
                              e.preventDefault();
                              if (item.name === "Logout") {
                                handleLogout();
                              } else {
                                handleNavClick(item.href);
                              }
                            }}
                            className={classNames(
                              item.name === "Logout" && navigation.length
                                ? "last:border-t last:border-gray-200 mt-2 pt-2"
                                : ""
                            )}
                          >
                            <span className="cursor-pointer block text-sm leading-5 text-gray-600 py-2 px-3 mx-2 hover:text-gray-800 hover:bg-gray-200/50 rounded-lg font-semibold">
                              {item.name}
                            </span>
                          </li>
                        )}
                      </Menu.Item>
                    ))}
                  </ul>
                </Menu.Items>
              </Transition>
            </Menu>
          </div>
        )}
      </nav>
    </header>
  );
}
