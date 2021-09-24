import moment from "moment";

export const weekdaysInMonth = (year: number, month: number) => {
  return getDaysInMonthRange(year, month).reduce(
    (acc, day) => acc + (day.isBusinessDay ? 1 : 0),
    0
  );
};

export type Day = { date: moment.Moment; isBusinessDay: boolean };

export const getDaysInMonthRange = (year: number, month: number): Day[] => {
  const currentDay = moment(new Date(year, month, 1)).startOf("month");
  const lastDay = moment(new Date(year, month, 1)).endOf("month");

  const days: { date: moment.Moment; isBusinessDay: boolean }[] = [];

  while (currentDay.isSameOrBefore(lastDay, "day")) {
    const weekday = currentDay.isoWeekday();
    days.push({ date: currentDay.clone(), isBusinessDay: weekday < 6 });
    currentDay.add(1, "day");
  }
  return days;
};

export function groupBy<T, K extends keyof T>(array: T[], key: K) {
  const map = new Map<T[K], T[]>();
  array.forEach((item) => {
    const itemKey = item[key];
    if (!map.has(itemKey)) {
      map.set(
        itemKey,
        array.filter((i) => i[key] === item[key])
      );
    }
  });
  return map;
}
