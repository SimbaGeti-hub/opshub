import { Controller, Get } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  CurrentUser,
  RequirePermissions,
  type AuthenticatedUser,
} from '@opshub/api/auth';
import { CurrentUserResponse } from './current-user.dto';
import { UserSummary } from './user-summary.dto';
import { UsersService } from './users.service';

@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @ApiOperation({ summary: 'Return the signed in user' })
  @ApiResponse({ status: 200, type: CurrentUserResponse })
  me(@CurrentUser() user: AuthenticatedUser): CurrentUserResponse {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    };
  }

  @Get()
  @RequirePermissions('users:manage')
  @ApiOperation({ summary: 'List all users (administrators only)' })
  @ApiResponse({ status: 200, type: [UserSummary] })
  @ApiForbiddenResponse({ description: 'The caller is not an administrator' })
  list(): Promise<UserSummary[]> {
    return this.usersService.list();
  }
}
