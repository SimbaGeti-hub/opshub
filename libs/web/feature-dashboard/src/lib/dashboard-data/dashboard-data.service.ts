import { Injectable } from '@angular/core';

export interface DashboardKpi {
  label: string;
  value: string;
  icon: string;
  trendValue: string;
  trendDirection: 'up' | 'down' | 'neutral';
}

export interface TaskCompletionPoint {
  label: string;
  completed: number;
  pending: number;
  overdue: number;
}

export interface DepartmentPerformance {
  department: string;
  completedTasks: number;
}

export interface ResourceUsageSlice {
  category: string;
  value: number;
}

@Injectable({ providedIn: 'root' })
export class DashboardDataService {
  getKpis(): DashboardKpi[] {
    return [
      {
        label: 'Total Tasks',
        value: '1,248',
        icon: 'list-checks',
        trendValue: '8.2%',
        trendDirection: 'up',
      },
      {
        label: 'Completed Tasks',
        value: '1,086',
        icon: 'circle-check',
        trendValue: '12.4%',
        trendDirection: 'up',
      },
      {
        label: 'Pending Requests',
        value: '34',
        icon: 'clock',
        trendValue: '3.1%',
        trendDirection: 'down',
      },
      {
        label: 'Active Employees',
        value: '87',
        icon: 'users',
        trendValue: '2.0%',
        trendDirection: 'up',
      },
      {
        label: 'Resource Utilization',
        value: '73%',
        icon: 'boxes',
        trendValue: '0.5%',
        trendDirection: 'neutral',
      },
    ];
  }

  getTaskCompletion(): TaskCompletionPoint[] {
    return [
      { label: 'Mon', completed: 42, pending: 18, overdue: 4 },
      { label: 'Tue', completed: 55, pending: 15, overdue: 3 },
      { label: 'Wed', completed: 48, pending: 22, overdue: 6 },
      { label: 'Thu', completed: 63, pending: 12, overdue: 2 },
      { label: 'Fri', completed: 58, pending: 17, overdue: 5 },
      { label: 'Sat', completed: 21, pending: 9, overdue: 1 },
      { label: 'Sun', completed: 14, pending: 6, overdue: 0 },
    ];
  }

  getDepartmentPerformance(): DepartmentPerformance[] {
    return [
      { department: 'Engineering', completedTasks: 312 },
      { department: 'Operations', completedTasks: 267 },
      { department: 'Sales', completedTasks: 198 },
      { department: 'Support', completedTasks: 221 },
      { department: 'Finance', completedTasks: 88 },
    ];
  }

  getResourceUsage(): ResourceUsageSlice[] {
    return [
      { category: 'Laptops', value: 142 },
      { category: 'Monitors', value: 96 },
      { category: 'Licenses', value: 210 },
      { category: 'Office equipment', value: 58 },
    ];
  }
}
