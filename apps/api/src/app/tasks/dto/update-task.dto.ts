import { PartialType } from '@nestjs/swagger';
import { CreateTaskDto } from './create-task.dto';

/** Every field is optional on update; sending null clears an optional field. */
export class UpdateTaskDto extends PartialType(CreateTaskDto) {}
