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

export type User = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  avatar_url: string;
};

export type Account = {
  id: number;
  name: string;
};

export type Company = {
  id: number;
  name: string;
  full_domain: string;
};
