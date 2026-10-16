import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import type { ChartConfiguration, ChartData } from 'chart.js';
import { PageHeader, StatCard, ChartCard } from '@opshub/web/ui';
import { DashboardDataService } from '../dashboard-data/dashboard-data.service';

@Component({
  selector: 'ops-dashboard',
  standalone: true,
  imports: [PageHeader, StatCard, ChartCard, BaseChartDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './dashboard.html',
})
export class Dashboard {
  private readonly dataService = inject(DashboardDataService);

  readonly kpis = this.dataService.getKpis();

  private readonly taskCompletion = this.dataService.getTaskCompletion();
  private readonly departmentPerformance =
    this.dataService.getDepartmentPerformance();
  private readonly resourceUsage = this.dataService.getResourceUsage();

  readonly taskCompletionData: ChartData<'line'> = {
    labels: this.taskCompletion.map((point) => point.label),
    datasets: [
      {
        label: 'Completed',
        data: this.taskCompletion.map((point) => point.completed),
        borderColor: '#4f46e5',
        backgroundColor: 'rgba(79, 70, 229, 0.1)',
        fill: true,
        tension: 0.3,
      },
      {
        label: 'Pending',
        data: this.taskCompletion.map((point) => point.pending),
        borderColor: '#fbbf24',
        backgroundColor: 'rgba(251, 191, 36, 0.1)',
        fill: true,
        tension: 0.3,
      },
      {
        label: 'Overdue',
        data: this.taskCompletion.map((point) => point.overdue),
        borderColor: '#f87171',
        backgroundColor: 'rgba(248, 113, 113, 0.1)',
        fill: true,
        tension: 0.3,
      },
    ],
  };

  readonly taskCompletionOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom' },
    },
    scales: {
      y: { beginAtZero: true },
    },
  };

  readonly departmentPerformanceData: ChartData<'bar'> = {
    labels: this.departmentPerformance.map((row) => row.department),
    datasets: [
      {
        label: 'Completed tasks',
        data: this.departmentPerformance.map((row) => row.completedTasks),
        backgroundColor: '#312e81',
        borderRadius: 6,
      },
    ],
  };

  readonly departmentPerformanceOptions: ChartConfiguration<'bar'>['options'] =
    {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
      },
      scales: {
        y: { beginAtZero: true },
      },
    };

  readonly resourceUsageData: ChartData<'doughnut'> = {
    labels: this.resourceUsage.map((slice) => slice.category),
    datasets: [
      {
        data: this.resourceUsage.map((slice) => slice.value),
        backgroundColor: ['#4f46e5', '#818cf8', '#15803d', '#fbbf24'],
        borderWidth: 0,
      },
    ],
  };

  readonly resourceUsageOptions: ChartConfiguration<'doughnut'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom' },
    },
  };
}
