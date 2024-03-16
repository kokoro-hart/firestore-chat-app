import { dayjs, defaultDayFormat } from "../libs";

/**
 * 曜日のマッピング 1 文字
 */
export const DAY_OF_WEEK_IN_ONE_LETTER = {
  /**
   * 日曜日
   */
  0: "日",
  /**
   * 月曜日
   */
  1: "月",
  /**
   * 火曜日
   */
  2: "火",
  /**
   * 水曜日
   */
  3: "水",
  /**
   * 木曜日
   */
  4: "木",
  /**
   * 金曜日
   */
  5: "金",
  /**
   * 土曜日
   */
  6: "土",
};

const DEFAULT_FORMAT = "YYYY-MM-DD";

export class DateUtil {
  /**
   * 日付文字列のフォーマット整形
   *     YY/M/D の場合 YYYY/MM/DD に変換
   *     文字列内にスラッシュを含まない場合は変換を行わない
   *
   * @param date 整形対象の日付文字列
   */
  static zeroPadding(date: string) {
    if (!/^\d+\/\d+\/\d+$/.test(date)) return date;

    const splitDate = date.split("/");
    const year = splitDate[0].length === 2 ? `20${splitDate[0]}` : splitDate[0];
    const month = `0${splitDate[1]}`.slice(-2);
    const day = `0${splitDate[2]}`.slice(-2);

    return `${year}/${month}/${day}`;
  }

  /**
   * 日付フォーマットが正しいか検証
   * 正しい場合 true、正しくない場合 false
   *
   * @param date 検証対象の日付文字列
   * @param formats 検証フォーマットの配列
   */
  static isValid(date: string, formats: string[]) {
    let valid = false;
    const formattedDate = DateUtil.zeroPadding(date);

    for (let i = 0; i < formats.length; i++) {
      valid = dayjs(formattedDate, formats[i]).format(formats[i]) === formattedDate;
      if (valid) break;
    }

    return valid;
  }

  /**
   * 現在の日付を返す
   *
   * @param format 返却する文字列のフォーマット
   */
  static getCurrentDate(format: string): string {
    return defaultDayFormat(dayjs().toString(), format);
  }

  /**
   * 日付から曜日を表すテキストを取得
   * 日 / 月 / 火 / 水 / 木 / 金 /土
   *
   * @param date 日付文字列
   */
  static getDayOfWeekInOneLetter(date: string): string {
    return this.getDayOfWeek(DAY_OF_WEEK_IN_ONE_LETTER)(dayjs(date).day());
  }

  /**
   * 引数の変換マップデータによる型付けを行い
   * dayjs().day() の戻り値を曜日文字列に変換する関数を返す
   *
   * @param type 変換マップデータ
   */
  static getDayOfWeek<T>(type: T): (day: number) => T[keyof T] {
    return (day: number): T[keyof T] => {
      const casted = day as keyof T;
      return type[casted];
    };
  }

  /**
   * 当月初日の日付を返す
   *
   * @param format 返却する文字列のフォーマット
   */
  static getFirstDayOfCurrentMonth(format: string) {
    return defaultDayFormat(dayjs().startOf("M").toString(), format);
  }

  /**
   * 先月初日の日付を返す
   *
   * @param format 返却する文字列のフォーマット
   */
  static getFirstDayOfPreviousMonth(format: string) {
    return defaultDayFormat(dayjs().subtract(1, "M").startOf("M").toString(), format);
  }

  /**
   * 当月最終日の日付を返す
   *
   * @param format 返却する文字列のフォーマット
   */
  static getLastDayOfCurrentMonth(format: string) {
    return defaultDayFormat(dayjs().endOf("M").toString(), format);
  }

  /**
   * 翌月最終日の日付を返す
   *
   * @param format 返却する文字列のフォーマット
   */
  static getLastDayOfNextMonth(format: string) {
    return defaultDayFormat(dayjs().add(1, "M").endOf("M").toString(), format);
  }

  /**
   * 引数日付から、その月の初日の日付を返す
   *
   * @param date 対象となる日付文字列
   * @param format 返却する文字列のフォーマット
   */
  static getFirstDayOfMonth(date: string, format = DEFAULT_FORMAT) {
    return defaultDayFormat(dayjs(date).startOf("M").toString(), format);
  }

  /**
   * 引数日付から、その月の最終日の日付を返す
   *
   * @param date 対象となる日付文字列
   * @param format 返却する文字列のフォーマット
   */
  static getLastDayOfMonth(date: string, format = DEFAULT_FORMAT) {
    return defaultDayFormat(dayjs(date).endOf("M").toString(), format);
  }

  /**
   * 引数日付から、その月の翌月の最終日の日付を返す
   *
   * @param date 対象となる日付文字列
   * @param format 返却する文字列のフォーマット
   */
  static getLastDayOfNextMonthForDate(date: string, format = DEFAULT_FORMAT) {
    return defaultDayFormat(dayjs(date).add(1, "M").endOf("M").toString(), format);
  }
}

/**
 * 日付文字列のフォーマット整形
 *     YYYYMMDD の場合 YYYY/MM/DD に変換される
 *     YYYY/MM/DD or YYYY/M/Dの場合はそのまま返却される
 *
 * @param date 整形対象の日付文字列
 */
export const convertToSlashFormat = (date: string) => {
  if (!/^\d{8}$/.test(date)) {
    return date;
  }

  const year = date.slice(0, 4);
  const month = date.slice(4, 6);
  const day = date.slice(6, 8);

  return `${year}/${month}/${day}`;
};

/**
 * 選択された値を日付フォーマットに変換する関数
 *
 * @param selectedValue 変換する選択された値（日付文字列）
 * @returns 変換された日付文字列。選択された値が日付文字列でない場合は undefined を返す。
 */
export const convertSelectedValue = (selectedValue: string | undefined): string | undefined => {
  if (!selectedValue) return "";
  const value = selectedValue.replace(/-/g, "/");

  if (/^20\d{2}((0\d)|(1[0-2]))((0[1-9])|([1-2]\d)|(3[0-1]))$/.test(value)) {
    const year = value.slice(0, 4);
    const month = value.slice(4, 6);
    const day = value.slice(6, 8);
    return `${year}/${month}/${day}`;
  } else if (/^(20)?\d{2}\/((0?[1-9])|(1[0-2]))\/(((0?[1-9])|([1-2]\d))|(3[0-1]))$/.test(value)) {
    const values = value.split("/");
    const year = `20${values[0]}`.slice(-4);
    const month = `0${values[1]}`.slice(-2);
    const day = `0${values[2]}`.slice(-2);
    return `${year}/${month}/${day}`;
  }

  return;
};

/**
 * 指定された値が有効な日付かどうかを確認する関数
 *
 * @param value 確認する値（日付文字列）
 * @param dateRegex 許可する日付フォーマット Regex
 * @param dateRegex 許可する日付フォーマット string[]
 * @returns 指定された値が有効な日付であれば true、それ以外の場合は false を返す。指定された値が undefined の場合は undefined を返す。
 */
export const isValidDateWithRegex = (
  value: string | undefined,
  dateRegex = /^((20\d{2}\/(0[1-9]|1[0-2])\/(0[1-9]|[12]\d|3[01]))|(20\d{2}\/\d{1,2}\/\d{1,2})|(20\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01]))|)$/,
  formats = ["YYYYMMDD", "YYYY/MM/DD"],
) => {
  if (!value) return;
  return dateRegex.test(value) && DateUtil.isValid(value, formats);
};

/**
 * 文字列から日付オブジェクトを作成する
 * @param {string} date - 日付を表す文字列
 * @returns {Date|undefined} - 日付が有効な場合は Date オブジェクト、無効な場合は undefined
 */
export const createDateFromString = (date: string | undefined): Date | undefined => {
  if (!date) return undefined;
  if (!isValidDateWithRegex(date)) return undefined;
  return new Date(date);
};
