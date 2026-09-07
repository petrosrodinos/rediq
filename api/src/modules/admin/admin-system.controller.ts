import { Controller, Get, Query, UseGuards } from '@nestjs/common';
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
import { AdminSystemService } from './admin-system.service';
import {
  AdminSystemErrorsQuerySchema,
  AdminSystemErrorsQueryType,
} from './dto/admin-system-errors-query.schema';

@ApiTags('admin')
@ApiBearerAuth()
@UseGuards(JwtGuard, RolesGuard)
@Roles(AuthRole.ADMIN, AuthRole.SUPER_ADMIN)
@Controller('admin')
export class AdminSystemController {
  constructor(private readonly adminSystemService: AdminSystemService) {}

  @Get('system-errors')
  @ApiOperation({
    summary:
      '[Admin] Warning/error events across all analysis jobs, most recent first',
  })
  @ApiResponse({ status: 200, description: 'Paginated list of job events' })
  findSystemErrors(
    @Query(new ZodValidationPipe(AdminSystemErrorsQuerySchema))
    query: AdminSystemErrorsQueryType,
  ) {
    return this.adminSystemService.findSystemErrors(query);
  }

  @Get('queue')
  @ApiOperation({ summary: '[Admin] Analysis pipeline queue status' })
  @ApiResponse({ status: 200, description: 'Queue status returned' })
  getQueueStatus() {
    return this.adminSystemService.getQueueStatus();
  }
}
