import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import {
  CurrentUser,
  RequirePermissions,
  type AuthenticatedUser,
} from '@opshub/api/auth';
import type { Paginated, TaskItem } from '@opshub/shared/models';
import { CreateTaskDto } from './dto/create-task.dto';
import { ListTasksQuery } from './dto/list-tasks-query.dto';
import { TaskResponse } from './dto/task-response.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TasksService } from './tasks.service';

@ApiTags('tasks')
@ApiBearerAuth()
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  @RequirePermissions('tasks:view')
  @ApiOperation({
    summary: 'List the tasks the caller may see, with filters and paging',
  })
  @ApiOkResponse({ description: 'A page of tasks: { data: Task[], meta }' })
  list(
    @CurrentUser() user: AuthenticatedUser,
    @Query() query: ListTasksQuery,
  ): Promise<Paginated<TaskItem>> {
    return this.tasksService.list(user, query);
  }

  @Get(':id')
  @RequirePermissions('tasks:view')
  @ApiOperation({ summary: 'Get one task' })
  @ApiOkResponse({ type: TaskResponse })
  @ApiNotFoundResponse({
    description: 'No such task, or the caller may not see it',
  })
  get(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
  ): Promise<TaskItem> {
    return this.tasksService.get(user, id);
  }

  @Post()
  @RequirePermissions('tasks:create')
  @ApiOperation({ summary: 'Create a task (managers and administrators)' })
  @ApiOkResponse({ type: TaskResponse })
  @ApiForbiddenResponse({
    description: 'Missing permission, or assignee outside the team',
  })
  create(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreateTaskDto,
  ): Promise<TaskItem> {
    return this.tasksService.create(user, dto);
  }

  @Patch(':id')
  @RequirePermissions('tasks:create')
  @ApiOperation({ summary: 'Edit a task (managers and administrators)' })
  @ApiOkResponse({ type: TaskResponse })
  @ApiNotFoundResponse({
    description: 'No such task, or the caller may not see it',
  })
  update(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
    @Body() dto: UpdateTaskDto,
  ): Promise<TaskItem> {
    return this.tasksService.update(user, id, dto);
  }

  @Patch(':id/status')
  @RequirePermissions('tasks:update_status')
  @ApiOperation({ summary: 'Change the status of a task the caller may see' })
  @ApiOkResponse({ type: TaskResponse })
  @ApiNotFoundResponse({
    description: 'No such task, or the caller may not see it',
  })
  updateStatus(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
    @Body() dto: UpdateTaskStatusDto,
  ): Promise<TaskItem> {
    return this.tasksService.updateStatus(user, id, dto.status);
  }

  @Delete(':id')
  @HttpCode(204)
  @RequirePermissions('tasks:delete')
  @ApiOperation({ summary: 'Delete a task (managers and administrators)' })
  @ApiNoContentResponse({ description: 'The task was deleted' })
  @ApiNotFoundResponse({
    description: 'No such task, or the caller may not see it',
  })
  remove(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
  ): Promise<void> {
    return this.tasksService.remove(user, id);
  }
}
