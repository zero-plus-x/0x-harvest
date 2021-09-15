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
