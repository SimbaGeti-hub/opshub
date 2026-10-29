export const TASK_STATUSES = [
  'TODO',
  'IN_PROGRESS',
  'BLOCKED',
  'COMPLETED',
] as const;
export type TaskStatus = (typeof TASK_STATUSES)[number];

export const TASK_PRIORITIES = ['LOW', 'MEDIUM', 'HIGH', 'URGENT'] as const;
export type TaskPriority = (typeof TASK_PRIORITIES)[number];

export const TASK_SORT_FIELDS = [
  'createdAt',
  'updatedAt',
  'dueDate',
  'priority',
  'status',
  'title',
] as const;
export type TaskSortField = (typeof TASK_SORT_FIELDS)[number];

export interface PersonRef {
  id: string;
  name: string;
}

export interface DepartmentRef {
  id: string;
  name: string;
}

export interface TaskItem {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string | null;
  createdAt: string;
  updatedAt: string;
  assignee: PersonRef | null;
  createdBy: PersonRef;
  department: DepartmentRef | null;
}
