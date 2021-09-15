import axios from "axios";
import moment from "moment";
import useSWR from "swr";
import { TimeEntry } from "../types";

const HARVEST_API_URL = "/api/harvest";

type SpecialTask = {
  harvestTaskId: number;
  harvestProjectId: number;
  displayName: string;
  noteRequired: boolean;
  emoji?: string;
  defaultHours?: number;
  hideNote?: boolean;
};

export const PRIMARY_TASK_ID = 5268825;
export const FALLBACK_HOURS = 8;

export const specialTasks: Record<string, SpecialTask> = {
  diceJakub: {
    harvestTaskId: 5268825,
    harvestProjectId: 22792018,
    displayName: "DICE",
    noteRequired: true,
    emoji: "🤖",
  },
  paidVacation: {
    harvestTaskId: 6646907,
    harvestProjectId: 11820549,
    displayName: "Paid vacation",
    noteRequired: false,
    emoji: "🏖️",
    hideNote: true,
  },
  publicHoliday: {
    harvestTaskId: 8114249,
    harvestProjectId: 11820549,
    displayName: "Public holiday",
    noteRequired: false,
    emoji: "🎅",
    hideNote: true,
  },
  conferenceDay: {
    harvestTaskId: 6616441,
    harvestProjectId: 9788476,
    displayName: "Conference day",
    emoji: "📚",
    noteRequired: false,
  },
  sickDay: {
    harvestTaskId: 6646904,
    harvestProjectId: 11820549,
    displayName: "Sick day 🤢",
    emoji: "📚",
    noteRequired: false,
  },
};

export const useTimeEntries = (
  from: moment.Moment,
  to: moment.Moment,
  taskId?: number
) => {
  let cacheKey = `${HARVEST_API_URL}/time_entries?from=${from.format(
    "YYYY-MM-DD"
  )}&to=${to.format("YYYY-MM-DD")}`;
  if (taskId) {
    cacheKey += `&task_id=${taskId}`;
  }
  const { data, error } = useSWR<TimeEntry[]>(cacheKey, (resource, init) =>
    fetch(resource, init)
      .then((res) => res.json())
      .then((res) => res.time_entries)
  );

  return {
    cacheKey,
    data,
    isLoading: !error && !data,
    isError: error,
  };
};

export const updateTimeEntry = (entryId: number, notes: string) => {
  return axios.patch<TimeEntry>(`${HARVEST_API_URL}/time_entries/${entryId}`, {
    notes,
  });
};

export const createTimeEntry = (
  spentDate: string,
  projectId: number,
  taskId: number,
  hours: number = FALLBACK_HOURS
) => {
  return axios.post<TimeEntry>(`${HARVEST_API_URL}/time_entries`, {
    project_id: projectId,
    task_id: taskId,
    hours,
    spent_date: spentDate,
  });
};

export const deleteTimeEntry = (entryId: number) => {
  return axios.delete(`${HARVEST_API_URL}/time_entries/${entryId}`);
};

export const useIsLoggedIn = () => {
  const { data, error } = useSWR(`/api/harvest/company`);
  return {
    isLoggedIn: !!data?.is_active,
    isLoading: !error && !data,
    isError: error,
  };
};
