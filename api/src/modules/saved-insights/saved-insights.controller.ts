import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtGuard } from '@/shared/guards/jwt.guard';
import { CurrentUser } from '@/shared/decorators/current-user.decorator';
import { ZodValidationPipe } from '@/shared/pipes/zod.validation.pipe';
import { SavedInsightsService } from './saved-insights.service';
import { CreateSavedInsightDto } from './dto/create-saved-insight.dto';
import { UpdateSavedInsightDto } from './dto/update-saved-insight.dto';
import {
  SavedInsightQuerySchema,
  SavedInsightQueryType,
} from './dto/saved-insight-query.schema';

@ApiTags('saved-insights')
@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller('saved-insights')
export class SavedInsightsController {
  constructor(private readonly savedInsightsService: SavedInsightsService) {}

  @Post()
  @ApiOperation({ summary: 'Save a knowledge insight for later reference' })
  @ApiResponse({ status: 201, description: 'Insight saved' })
  @ApiResponse({ status: 404, description: 'Knowledge insight not found' })
  @ApiResponse({ status: 409, description: 'Insight already saved' })
  create(
    @CurrentUser('id') userId: string,
    @Body() dto: CreateSavedInsightDto,
  ) {
    return this.savedInsightsService.create(userId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'List saved insights for the current user' })
  @ApiResponse({ status: 200, description: 'Paginated list of saved insights' })
  findAll(
    @CurrentUser('id') userId: string,
    @Query(new ZodValidationPipe(SavedInsightQuerySchema))
    query: SavedInsightQueryType,
  ) {
    return this.savedInsightsService.findAll(userId, query);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Move a saved insight into (or out of) a collection' })
  @ApiResponse({ status: 200, description: 'Saved insight updated' })
  @ApiResponse({ status: 404, description: 'Saved insight or collection not found' })
  update(
    @CurrentUser('id') userId: string,
    @Param('id') id: string,
    @Body() dto: UpdateSavedInsightDto,
  ) {
    return this.savedInsightsService.update(userId, id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Unsave a knowledge insight' })
  @ApiResponse({ status: 200, description: 'Saved insight removed' })
  @ApiResponse({ status: 404, description: 'Saved insight not found' })
  remove(@CurrentUser('id') userId: string, @Param('id') id: string) {
    return this.savedInsightsService.remove(userId, id);
  }
}
