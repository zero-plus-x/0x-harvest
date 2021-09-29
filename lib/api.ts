import axios from "axios";
import moment from "moment";
import useSWR from "swr";
import { ProjectAssignment, TimeEntry, User } from "../types";

const HARVEST_API_URL = "/api/harvest";

type SpecialTask = {
  displayName?: string;
  noteRequired: boolean;
  emoji?: string;
  defaultHours?: number;
};

export const PAID_VACATION_TASK_ID = 6646907;
export const FALLBACK_HOURS = 8;
export const HARVEST_DATE_FORMAT = "YYYY-MM-DD";

export const projects: Record<number, string> = {
  11820549: "Absence",
  9788476: "Internal",
};

export const specialTasks: { [taskId: number]: SpecialTask } = {
  [PAID_VACATION_TASK_ID]: {
    // displayName: "Paid vacation",
    noteRequired: false,
    emoji: "🏖️",
  },
  8114249: {
    // displayName: "Public holiday",
    noteRequired: false,
    emoji: "🎅",
  },
  6616441: {
    // displayName: "Conference day",
    emoji: "📚",
    noteRequired: false,
  },
  6646904: {
    // displayName: "Sick day",
    emoji: "🤢",
    noteRequired: false,
  },
  6646908: {
    // displayName: "Unpaid vacation",
    emoji: "⏸",
    noteRequired: false,
  },
  6646905: {
    // displayName: "VAB",
    emoji: "👶",
    noteRequired: false,
  },
  6615741: {
    // displayName: "Internal hours",
    emoji: "💻",
    noteRequired: true,
  },
};

export const useTimeEntries = (
  from: moment.Moment,
  to: moment.Moment,
  taskId?: number
) => {
  let cacheKey = `${HARVEST_API_URL}/time_entries?from=${from.format(
    HARVEST_DATE_FORMAT
  )}&to=${to.format(HARVEST_DATE_FORMAT)}`;
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

export const useProjectAssignments = () => {
  const cacheKey = `${HARVEST_API_URL}/users/me/project_assignments`;

  const { data, error } = useSWR<ProjectAssignment[]>(
    cacheKey,
    (resource, init) =>
      fetch(resource, init)
        .then((res) => res.json())
        .then((res) => res.project_assignments)
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

export const logout = () => {
  return axios.get(`/api/logout`);
};

export const useUser = (shouldFetch?: boolean) => {
  const { data, error } = useSWR<User>(
    !shouldFetch ? `${HARVEST_API_URL}/users/me` : null
  );
  return {
    data,
    isLoading: !error && !data,
    isError: error,
  };
};

export const useIsLoggedIn = () => {
  const { data, isLoading, isError } = useUser();

  return {
    isLoggedIn: !!data?.id,
    isLoading,
    isError,
  };
};
