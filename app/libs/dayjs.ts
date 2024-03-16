import { default as _dayjs } from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

export const TZ = "Asia/Tokyo";

_dayjs.extend(utc);
_dayjs.extend(timezone);
_dayjs.extend(isSameOrAfter);
_dayjs.extend(isSameOrBefore);
_dayjs.tz.setDefault(TZ);

export const dayjs = _dayjs;

// TODO libの_dayjsを利用していない部分をリファクタリングする
export const defaultDayFormat = (date: string, format?: string) => {
  if (date === "") return "";
  if (format) return _dayjs(date).format(format);
  return _dayjs(date).tz().format();
};

export const convertIsoString = (date?: Date) => {
  return date
    ? _dayjs(date).format("YYYY-MM-DDTHH:mm:ss[Z]")
    : _dayjs().format("YYYY-MM-DDTHH:mm:ss[Z]");
};

export const getCurrentIsoDateString = () => {
  return _dayjs().set("hour", 0).set("minute", 0).set("second", 0).format("YYYY-MM-DDTHH:mm:ss[Z]");
};

export const convertDateObject = (date?: string): Date | null => {
  return date ? _dayjs(date).toDate() : null;
};

export const convertYearDateAndMonthString = (date?: string) => {
  if (!date) return "";
  return _dayjs(date).format("YYYY-MM-DD");
};

export const getTodayYearDateAndMonthString = () => {
  return _dayjs().set("hour", 0).set("minute", 0).set("second", 0).format("YYYY-MM-DD");
};

type ShiftDate = {
  from?: string | _dayjs.Dayjs;
  year?: number;
  month?: number;
  day?: number;
};

export const shiftDate = ({ from, year, month, day }: ShiftDate) => {
  const date = _dayjs(from ? from : getCurrentIsoDateString())
    .add(year ?? 0, "year")
    .add(month ?? 0, "month")
    .add(day ?? 0, "day");

  return date.set("hour", 0).set("minute", 0).set("second", 0).format("YYYY-MM-DDTHH:mm:ss[Z]");
};

export const firstDateOfMonth = (): string => _dayjs().startOf("month").format("YYYY-MM-DD");

export const lastDateOfMonth = (): string => _dayjs().endOf("month").format("YYYY-MM-DD");

export const getToday = (format?: string) => {
  return _dayjs()
    .set("hour", 0)
    .set("minute", 0)
    .set("second", 0)
    .format(format ?? "YYYY/MM/DD");
};
