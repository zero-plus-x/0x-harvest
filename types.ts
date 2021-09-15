export type TimeEntry = {
  id: number;
  spent_date: string;
  notes: string;
  hours: number;
  project: { id: number; name: string };
  task: { id: number; name: string };
};

export type Project = {
  id: number;
};

export type Task = {
  id: number;
  name: string;
  is_active: boolean;
};
