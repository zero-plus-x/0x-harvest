import moment from "moment";
import { useProjectAssignments, useTimeEntries } from "./lib/api";

export const VACATION_ALLOWANCE_KEY = "vacationAllowance";
export const DEFAULT_VACATION_ALLOWANCE = 25;

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

/**
 * Returns the most-used task during the last 30 days. Defaults to the first task returned for the user if there is no history.
 */
export const usePrimaryTask = ():
  | { projectId: number; taskId: number; taskName: string }
  | undefined => {
  const start = moment().subtract(30, "day");
  const end = moment();

  const { data: projectAssignments } = useProjectAssignments();
  const { data: entries } = useTimeEntries(start, end);

  if (!entries?.length) {
    const projectId = projectAssignments?.[0].project.id;
    const task = projectAssignments?.[0].task_assignments[0]?.task;
    if (projectId && task) {
      return { projectId, taskId: task.id, taskName: task.name };
    }
    return undefined;
  }
  const occurences: Record<number, number> = {};

  entries?.forEach((e) => {
    if (!occurences[e.task.id]) {
      occurences[e.task.id] = 0;
    }
    occurences[e.task.id] = occurences[e.task.id] + 1;
  });

  const mostCommonTaskId = parseInt(
    Object.entries(occurences).sort((a, b) => b[1] - a[1])[0]?.[0] || ""
  );
  const mostCommonTask = entries?.find((e) => e.task.id === mostCommonTaskId);
  return mostCommonTask
    ? {
        projectId: mostCommonTask.project.id,
        taskId: mostCommonTask.task.id,
        taskName: mostCommonTask.task.name,
      }
    : undefined;
};

export const getVacationAllowance = () => {
  if (typeof window === "undefined") {
    return {};
  }

  const persistedAllowance = localStorage.getItem(VACATION_ALLOWANCE_KEY);
  if (persistedAllowance) {
    try {
      return JSON.parse(persistedAllowance);
    } catch (e) {
      return {};
    }
  }
};
