import axios from "axios";
import moment from "moment";
import useSWR from "swr";
import useSWRImmutable from "swr/immutable";
import { AccessRole, ProjectAssignment, TimeEntry, User } from "../types";

const HARVEST_API_URL = "/api/harvest";

type SpecialTask = {
  displayName?: string;
  noteRequired?: boolean;
  emoji?: string;
  defaultHours?: number;
};

export const PAID_VACATION_TASK_ID = 6646907;
export const VACATION_TASK_ID = 2595366;
export const UNPAID_VACATION_TASK_ID = 6646908;
export const PUBLIC_HOLIDAY_TASK_ID = 8114249;
export const FALLBACK_HOURS = 8;
export const HARVEST_DATE_FORMAT = "YYYY-MM-DD";

export enum Project {
  ABSENCE = 11820549,
  INTERNAL = 9788476,
}

export const projects: Record<number, string> = {
  [Project.ABSENCE]: "Absence",
  [Project.INTERNAL]: "Internal",
};

export const specialTasks: { [taskId: number]: SpecialTask } = {
  [PAID_VACATION_TASK_ID]: {
    // "Paid vacation" - deprecated as of 2022/10
    emoji: "🏖️",
  },
  [VACATION_TASK_ID]: {
    // "Vacation"
    emoji: "🏖️",
  },
  [PUBLIC_HOLIDAY_TASK_ID]: {
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
    // "Unpaid vacation" - deprecated as of 2022/10
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
  hours: number = FALLBACK_HOURS,
  notes?: string,
  userId?: number
) => {
  return axios.post<TimeEntry>(`${HARVEST_API_URL}/time_entries`, {
    project_id: projectId,
    task_id: taskId,
    hours,
    spent_date: spentDate,
    user_id: userId,
    notes,
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

export const useAllUsers = () => {
  const { data, error } = useSWRImmutable<{ users: User[] }>(
    `${HARVEST_API_URL}/users`,
    (resource, init) => fetch(resource, init).then((res) => res.json()),
    {
      onErrorRetry: (error) => {
        if (error.status === 403) {
          return;
        }
      },
    }
  );

  // const userMock = [
  //   {
  //     first_name: "Jakub",
  //     last_name: "Kottnauer",
  //     id: 2947353,
  //     is_active: true,
  //   },
  //   {
  //     first_name: "Sergey",
  //     last_name: "Bogdanov",
  //     id: 12232,
  //     is_active: true,
  //   },
  //   { first_name: "Daria", last_name: "Kolesnik", id: 123, is_active: true },
  //   { first_name: "old", last_name: "old", id: 12323, is_active: false },
  // ];

  return {
    data,
    isLoading: !error && !data,
    isError: error,
  };
};

export const isUserInRole = (user: User, roles: AccessRole[]) =>
  user.access_roles.filter((value) => roles.includes(value as any)).length;
