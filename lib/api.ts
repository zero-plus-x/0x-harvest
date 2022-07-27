import axios from "axios";
import moment from "moment";
import useSWR from "swr";
import useSWRImmutable from "swr/immutable";
import { ProjectAssignment, TimeEntry, User } from "../types";

const HARVEST_API_URL = "/api/harvest";

type SpecialTask = {
  displayName?: string;
  noteRequired?: boolean;
  emoji?: string;
  defaultHours?: number;
};

export const PAID_VACATION_TASK_ID = 6646907;
export const UNPAID_VACATION_TASK_ID = 6646908;
export const FALLBACK_HOURS = 8;
export const HARVEST_DATE_FORMAT = "YYYY-MM-DD";

export const projects: Record<number, string> = {
  11820549: "Absence",
  9788476: "Internal",
};

export const specialTasks: { [taskId: number]: SpecialTask } = {
  [PAID_VACATION_TASK_ID]: {
    // "Paid vacation"
    emoji: "🏖️",
  },
  8114249: {
    // "Public holiday"
    emoji: "🎅",
  },
  6616441: {
    // "Conference day"
    emoji: "📚",
  },
  6646904: {
    // "Sick day"
    emoji: "🤢",
  },
  6646908: {
    // "Unpaid vacation"
    emoji: "⏸",
  },
  6646905: {
    // "VAB"
    emoji: "👶",
  },
  6615741: {
    // "Internal hours"
    emoji: "💻",
  },
  8918713: {
    // "Parental absence"
    emoji: "👨‍👩‍👦",
  },
  6646906: {
    // Other non-billable
    emoji: "🕑",
  },
  7942637: {
    // External tech talk
    emoji: "💬",
  },
  5906330: {
    // Interviewed by client
    emoji: "💼",
  },
  10452372: {
    // Intern mentoring
    emoji: "🚀",
  },
  5380873: {
    // Reviewing candidate
    emoji: "🤓",
  },
  9085557: {
    // Welcome day compass
    emoji: "🧭",
    displayName: "Compass welcome",
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

  const { data, error } = useSWRImmutable<ProjectAssignment[]>(
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

export const updateTimeEntryNote = (entryId: number, notes: string) => {
  return axios.patch<TimeEntry>(`${HARVEST_API_URL}/time_entries/${entryId}`, {
    notes,
  });
};

export const updateTimeEntryHours = (entryId: number, hours: number) => {
  return axios.patch<TimeEntry>(`${HARVEST_API_URL}/time_entries/${entryId}`, {
    hours,
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

export const useUser = () => {
  const { data, error } = useSWRImmutable<User>(
    `${HARVEST_API_URL}/users/me`,
    (resource, init) => fetch(resource, init).then((res) => res.json()),
    {
      onErrorRetry: (error) => {
        if (error.status === 401) {
          return;
        }
      },
    }
  );
  return {
    data,
    isLoading: !error && !data,
    isError: error,
  };
};
