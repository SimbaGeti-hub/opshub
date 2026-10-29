import { ApiProperty } from '@nestjs/swagger';
import { TASK_STATUSES, type TaskStatus } from '@opshub/shared/models';
import { IsIn } from 'class-validator';

export class UpdateTaskStatusDto {
  @ApiProperty({ enum: [...TASK_STATUSES] })
  @IsIn(TASK_STATUSES)
  status!: TaskStatus;
}
