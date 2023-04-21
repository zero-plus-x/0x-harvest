export type TimeEntry = {
  id: number;
  spent_date: string;
  notes: string;
  hours: number;
  project: { id: number; name: string };
  task: { id: number; name: string };
  is_locked: boolean;
  locked_reason?: string;
};

export type Project = {
  id: number;
  name: string;
};

export type Task = {
  id: number;
  name: string;
  is_active: boolean;
};

export enum AccessRole {
  MEMBER = "member",
  ADMIN = "administrator",
  MANAGER = "manager",
}

export const AdminRoles: AccessRole[] = [AccessRole.MANAGER, AccessRole.ADMIN];

export type User = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  avatar_url: string;
  access_roles: `${AccessRole}`[];
  is_active: boolean;
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

export type TaskAssignment = {
  task: Task;
};

export type ProjectAssignment = {
  project: Project;
  task_assignments: TaskAssignment[];
};

export type TaskWithProject = {
  projectId: number;
  projectName: string;
  taskId: number;
  taskName: string;
};
