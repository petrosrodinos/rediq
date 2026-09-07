import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtGuard } from '@/shared/guards/jwt.guard';
import { RolesGuard } from '@/shared/guards/roles.guard';
import { Roles } from '@/shared/decorators/roles.decorator';
import { ZodValidationPipe } from '@/shared/pipes/zod.validation.pipe';
import { AuthRole } from 'generated/prisma';
import { AdminUsersService } from './admin-users.service';
import {
  AdminUsersQuerySchema,
  AdminUsersQueryType,
} from './dto/admin-users-query.schema';

@ApiTags('admin')
@ApiBearerAuth()
@UseGuards(JwtGuard, RolesGuard)
@Roles(AuthRole.ADMIN, AuthRole.SUPER_ADMIN)
@Controller('admin/users')
export class AdminUsersController {
  constructor(private readonly adminUsersService: AdminUsersService) {}

  @Get()
  @ApiOperation({ summary: '[Admin] List all users on the platform' })
  @ApiResponse({ status: 200, description: 'Paginated list of users' })
  findAll(
    @Query(new ZodValidationPipe(AdminUsersQuerySchema))
    query: AdminUsersQueryType,
  ) {
    return this.adminUsersService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: '[Admin] Get a single user' })
  @ApiResponse({ status: 200, description: 'User returned' })
  @ApiResponse({ status: 404, description: 'User not found' })
  findOne(@Param('id') id: string) {
    return this.adminUsersService.findOne(id);
  }
}
