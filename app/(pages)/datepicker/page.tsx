"use client";

import * as holiday_jp from "@holiday-jp/holiday_jp";
import { useState } from "react";
import ReactDatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

import { Popover, PopoverContent, PopoverTrigger } from "@/app/components/ui";
import { DateUtil } from "@/app/utils/date-util";

export default function DatepickerPage() {
  const _holidays = holiday_jp.between(
    new Date(DateUtil.getFirstDayOfCurrentMonth("YYYY-MM-DD")),
    new Date(DateUtil.getLastDayOfNextMonth("YYYY-MM-DD")),
  );

  const initial = _holidays.map(({ name, date }) => ({
    date: date.toString(),
    holidayName: name,
  }));
  const [holidays, setHolidays] = useState(initial);

  return (
    <div className="p-40 flex justify-center">
      <Popover>
        <PopoverTrigger>Open</PopoverTrigger>
        <PopoverContent>
          <ReactDatePicker
            monthsShown={2}
            inline
            holidays={holidays}
            onMonthChange={(date) => {
              console.log("onMonthChange", date);
              const _newHolidays = holiday_jp.between(
                new Date(DateUtil.getFirstDayOfMonth(date.toString(), "YYYY-MM-DD")),
                new Date(DateUtil.getLastDayOfNextMonthForDate(date.toString(), "YYYY-MM-DD")),
              );
              const formattedNewHolidays = _newHolidays.map(({ name, date }) => ({
                date: date.toString(),
                holidayName: name,
              }));
              setHolidays(formattedNewHolidays);
            }}
            onChange={() => {}}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
