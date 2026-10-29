import { ApiProperty } from '@nestjs/swagger';
import {
  TASK_PRIORITIES,
  TASK_STATUSES,
  type TaskItem,
  type TaskPriority,
  type TaskStatus,
} from '@opshub/shared/models';

export class RefResponse {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  name!: string;
}

export class TaskResponse implements TaskItem {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  title!: string;

  @ApiProperty({ type: String, nullable: true })
  description!: string | null;

  @ApiProperty({ enum: [...TASK_STATUSES] })
  status!: TaskStatus;

  @ApiProperty({ enum: [...TASK_PRIORITIES] })
  priority!: TaskPriority;

  @ApiProperty({ type: String, nullable: true })
  dueDate!: string | null;

  @ApiProperty()
  createdAt!: string;

  @ApiProperty()
  updatedAt!: string;

  @ApiProperty({ type: RefResponse, nullable: true })
  assignee!: RefResponse | null;

  @ApiProperty({ type: RefResponse })
  createdBy!: RefResponse;

  @ApiProperty({ type: RefResponse, nullable: true })
  department!: RefResponse | null;
}
