"use client";

import * as holiday_jp from "@holiday-jp/holiday_jp";
import { useState } from "react";
import ReactDatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

import { Popover, PopoverContent, PopoverTrigger } from "@/app/components/ui";
import { dayjs } from "@/app/libs";
import { DateUtil } from "@/app/utils/date-util";

const DatePicker = () => {
  const _holidays = holiday_jp.between(
    new Date(DateUtil.getFirstDayOfPreviousMonthForDate(dayjs().format("YYYY-MM-DD"), 2)),
    new Date(DateUtil.getLastDayOfNextMonthForDate(dayjs().format("YYYY-MM-DD"), 2)),
  );

  const initial = _holidays.map(({ name, date }) => ({
    date: date.toString(),
    holidayName: name,
  }));

  const [holidays, setHolidays] = useState(initial);

  return (
    <ReactDatePicker
      monthsShown={2}
      inline
      holidays={holidays}
      onMonthChange={(date) => {
        console.log("onMonthChange", date);
        const _newHolidays = holiday_jp.between(
          new Date(DateUtil.getFirstDayOfPreviousMonthForDate(date.toString(), 2)),
          new Date(DateUtil.getLastDayOfNextMonthForDate(date.toString(), 2)),
        );
        const formattedNewHolidays = _newHolidays.map(({ name, date }) => ({
          date: date.toString(),
          holidayName: name,
        }));
        setHolidays(formattedNewHolidays);
      }}
      onChange={() => {}}
    />
  );
};

export default function DatepickerPage() {
  return (
    <div className="p-40 flex justify-center">
      <Popover>
        <PopoverTrigger>Open</PopoverTrigger>
        <PopoverContent>
          <DatePicker />
        </PopoverContent>
      </Popover>
    </div>
  );
}
