import {
  CalenderIcon,
  MinusIcon,
  PlusIcon,
  UnkownPrfileIcon,
} from "@/components/Icons";
import { ToastType, useToast } from "@/hooks/useToast";
import { apihelper } from "@/utils/Client";
import {
  ConvertDateToYYMMDDFormat,
  ExampleCustom1,
  get12hrTime,
  isToday,
  isTomorrow,
  is_weekend,
} from "@/utils/CommonFunc";
import { forwardRef, useCallback, useState } from "react";
import ReactDatePicker from "react-datepicker";
import moment from "moment";

export const DoctorCard = ({ setLoader, cardData, toggleModal }) => {
  const [slotExpand, setSlotExpand] = useState("");
  const { setToastProp } = useToast();
  const [slot, setSlot] = useState({ morning: [], evening: [], afternoon: [] });
  const [startDate, setStartDate] = useState();
  const onTomorrClick = () => {
    const date1 = new Date();
    date1.setDate(date1.getDate() + 1);
    setStartDate(date1);
    getAvailableSlot(cardData, date1);
  };

  const removeDateClick = () => {
    // const d1 = moment().format("YYYY-MM-DD");
    // const date1 = new Date(d1);
    // const momentDate = moment(startDate).format("YYYY-MM-DD");
    // const date2 = new Date(momentDate);
    // if (
    //   date1.getDate() === date2.getDate() &&
    //   date1.getFullYear() === date2.getFullYear() &&
    //   date1.getMonth() === date2.getMonth()
    // ) {
    //   return;
    // } else {
    setStartDate(new Date());
    getAvailableSlot(cardData, new Date());
    // }
  };

  const onDateChange = (date) => {
    setStartDate(date);
    getAvailableSlot(cardData, date);
  };

  const getAvailableSlot = useCallback(
    async (cardData, dt) => {
      setLoader(true);
      let apptDate = startDate;
      if (dt) {
        apptDate = dt;
      }
      const response = await apihelper(
        "patientportal/Schedule/getAvailableSlot",
        {
          method: "POST",
          headers: {},
          data: {
            appointmentDate: ConvertDateToYYMMDDFormat(apptDate),
            doctorId: cardData.doctorId,
            clinicId: cardData.clinicId,
          },
        }
      );
      if (response.success) {
        //string date, string docterCode, string clinicCode
        const output = {
          morning: [],
          afternoon: [],
          evening: [],
        };
        let slotList = response.success;
        if (
          moment(apptDate).format("YYYY-MM-DD") == moment().format("YYYY-MM-DD")
        ) {
          slotList = slotList.filter(({ slot }) => {
            return moment() < moment(slot, "HH:mm");
          });
        }
        const SLOT_AVAIL = slotList.map((slot) => slot);
        SLOT_AVAIL.forEach((time) => {
          const hour = Number(time.slot?.split(":")[0]);
          if (hour >= 0 && hour < 12) {
            output.morning.push({
              displayTime: get12hrTime(time.slot),
              ...time,
            });
          } else if (hour >= 12 && hour < 16) {
            output.afternoon.push({
              displayTime: get12hrTime(time.slot),
              ...time,
            });
          } else if (hour >= 16 && hour <= 24) {
            output.evening.push({
              displayTime: get12hrTime(time.slot),
              ...time,
            });
          }
        });
        setSlot(output);
        setSlotExpand(cardData.doctCode);
      } else {
        setToastProp({
          show: true,
          header: response?.error?.message || "Something went wrong.",
          type: ToastType.ERROR,
        });
        setLoader(false);
      }
      setLoader(false);
    },
    [setLoader, setToastProp, startDate]
  );

  const beForeBookApp = (p, timeValue) => {
    toggleModal({
      open: true,
      data: { ...p, ...timeValue, dateValue: startDate },
    });
  };

  return (
    <div className="flex flex-col border border-gray-300 rounded-lg">
      <div className="flex p-4 gap-4">
        <div className="max-[400px]:w-14 max-[400px]:h-14 w-16 h-16 flex items-center justify-center object-cover bg-gray-100 text-gray-300 rounded-lg overflow-hidden">
          <UnkownPrfileIcon />
        </div>
        <div className="relative">
          <div className="pb-2">
            <h6 className="text-base font-semibold text-gray-800">
              {cardData.doctName}
            </h6>
            <span className="text-sm font-medium text-orange-600 pt-0.5">
              {cardData?.name}
            </span>
          </div>
        </div>
      </div>
      <div className="max-[480px]:px-0 px-4 py-3 border-t border-gray-300 max-[480px]:flex-col-reverse items-center justify-between gap-3 rounded-b-lg">
        {/* <button
          onClick={() => {
            slotExpand === cardData.doctCode
              ? setSlotExpand("")
              : getAvailableSlot(cardData);
          }}
          className={`max-[480px]:px-4 max-[480px]:w-full w-2/5 flex max-[480px]:flex-row-reverse max-[480px]:justify-between items-center text-gray-600 max-[480px]:font-semibold group text-sm font-medium gap-2 ease-linear duration-100 max-[480px]:bg-gray-50 max-[480px]:py-2 ${
            slotExpand === cardData.doctCode ? "" : "rounded-b-lg "
          }`}
        >
          <span
            className={`flex items-center justify-center w-6 h-6 rounded-lg bg-gray-100 max-[480px]:bg-gray-200 ease-linear duration-100 icon-16 ${
              slotExpand === cardData.doctCode ? " " : "text-gray-600 "
            }`}
          >
            {slotExpand === cardData.doctCode ? <MinusIcon /> : <PlusIcon />}
          </span>
          Select slot
        </button> */}
        <div className="flex items-center max-[480px]:w-full justify-between max-[480px]:justify-between gap-2 max-[480px]:px-3">
          <div className="flex items-center gap-2">
            <button
              onClick={removeDateClick}
              className={`filter-btn border rounded-lg text-[12px] font-medium px-1.5 py-1.5 bg-white ${
                isToday(startDate)
                  ? "bg-blue-600 border-blue-600 text-white "
                  : "border-gray-300 "
              }`}
            >
              Today
            </button>
            <button
              onClick={!isTomorrow(startDate) ? onTomorrClick : () => {}}
              className={`filter-btn border rounded-lg text-[12px] font-medium px-1.5 py-1.5 bg-white ${
                isTomorrow(startDate)
                  ? "bg-blue-600 border-blue-600 text-white "
                  : "border-gray-300 "
              }`}
            >
              Tomorrow
            </button>
          </div>
          <div
            className={`font-semibold text-gray-700 justify-end art-date cursor-pointer ${
              startDate && !isToday(startDate) && !isTomorrow(startDate)
                ? "border-blue-600 text-white "
                : ""
            }`}
          >
            <ReactDatePicker
              selected={startDate}
              onChange={(date) => onDateChange(date)}
              filterDate={(date) => {
                //return is_weekend(date, {});
                return true;
              }}
              customInput={
                <ExampleCustom1
                  startDate={startDate}
                  idToda={isToday(startDate)}
                />
              }
              minDate={moment().toDate()}
            />
          </div>
        </div>
      </div>

      <div
        className={`transition-[max-height] duration-700 ease-in-out overflow-hidden ${
          slotExpand === cardData.doctCode ? "max-h-full" : "max-h-0"
        }`}
      >
        <div className="pb-4 border-t border-gray-300">
          {!slot["morning"].length &&
          !slot["afternoon"].length &&
          !slot["evening"].length ? (
            <div className="flex pt-4 justify-center text-sm text-gray-500">
              No slot available
            </div>
          ) : (
            <>
              {!!slot["morning"].length && (
                <>
                  <div
                    className={`max-[480px]:mx-4 max-[480px]:px-0 pb-2 p-4 text-gray-500 flex items-center justify-between cursor-pointer bg-white`}
                  >
                    <button className="inline-flex items-center text-sm font-medium gap-2 icon-20">
                      Morning
                    </button>
                  </div>
                  <div
                    className={`overflow-hidden transition-[max-height] ease-in max-[480px]:bg-white max-h-screen opacity-100 duration-1000`}
                  >
                    <div className="grid max-[360px]:grid-cols-3 max-[480px]:grid-cols-4 grid-cols-5 items-center gap-2 p-4 pt-1 pb-0">
                      {slot["morning"].map((l) => (
                        <button
                          type="button"
                          key={l + "ww"}
                          onClick={() => beForeBookApp(cardData, l)}
                          className={`rounded-lg max-[480px]:bg-gray-50 bg-white hover:bg-blue-50 border px-1.5 py-1.5 text-[12px] font-semibold text-gray-600 hover:shadow-sm hover:text-blue-600 hover:border-blue-600 whitespace-nowrap border-gray-300`}
                        >
                          {l.displayTime}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
              {!!slot["afternoon"].length && (
                <>
                  <div
                    className={`max-[480px]:mx-4 max-[480px]:px-0 pb-2 p-4 text-gray-500 flex items-center justify-between cursor-pointer "bg-white`}
                  >
                    <button className="inline-flex items-center text-sm font-medium gap-2 icon-20">
                      Afternoon
                    </button>
                  </div>
                  <div
                    className={`overflow-hidden transition-[max-height] ease-in max-[480px]:bg-white max-h-screen opacity-100 duration-1000`}
                  >
                    <div className="grid max-[360px]:grid-cols-3 max-[480px]:grid-cols-4 grid-cols-5 items-center gap-2 p-4 pt-1 pb-0">
                      {slot["afternoon"].map((l) => (
                        <button
                          type="button"
                          key={l + "effc"}
                          onClick={() => beForeBookApp(cardData, l)}
                          className={`rounded-lg max-[480px]:bg-gray-50 bg-white hover:bg-blue-50 border px-1.5 py-1.5 text-[12px] font-semibold text-gray-600 hover:shadow-sm hover:text-blue-600 hover:border-blue-600 whitespace-nowrap border-gray-300`}
                        >
                          {l.displayTime}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
              {!!slot["evening"].length && (
                <>
                  <div
                    className={`max-[480px]:mx-4 max-[480px]:px-0 pb-2 p-4 text-gray-500 flex items-center justify-between cursor-pointer bg-white`}
                  >
                    <button className="inline-flex items-center text-sm font-medium gap-2 icon-20">
                      Evening
                    </button>
                  </div>
                  <div
                    className={`overflow-hidden transition-[max-height] ease-in max-[480px]:bg-white rounded-b-lg max-h-screen opacity-100 duration-1000`}
                  >
                    <div className="grid max-[360px]:grid-cols-3 max-[480px]:grid-cols-4 grid-cols-5 items-center gap-2 p-4 pt-1 pb-0">
                      {slot["evening"].map((l) => (
                        <button
                          type="button"
                          key={l + "efef"}
                          onClick={() => beForeBookApp(cardData, l)}
                          className={`rounded-lg max-[480px]:bg-gray-50 bg-white hover:bg-blue-50 border px-1.5 py-1.5 text-[12px] font-semibold text-gray-600 hover:shadow-sm hover:text-blue-600 hover:border-blue-600 whitespace-nowrap border-gray-300`}
                        >
                          {l.displayTime}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
