import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
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
import { SavedSearchesService } from './saved-searches.service';
import { CreateSavedSearchDto } from './dto/create-saved-search.dto';
import {
  SavedSearchQuerySchema,
  SavedSearchQueryType,
} from './dto/saved-search-query.schema';

@ApiTags('saved-searches')
@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller('saved-searches')
export class SavedSearchesController {
  constructor(private readonly savedSearchesService: SavedSearchesService) {}

  @Post()
  @ApiOperation({ summary: 'Save a search query for later reuse' })
  @ApiResponse({ status: 201, description: 'Search saved' })
  @ApiResponse({ status: 404, description: 'Research project not found' })
  create(
    @CurrentUser('id') userId: string,
    @Body() dto: CreateSavedSearchDto,
  ) {
    return this.savedSearchesService.create(userId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'List saved searches for the current user' })
  @ApiResponse({ status: 200, description: 'Paginated list of saved searches' })
  findAll(
    @CurrentUser('id') userId: string,
    @Query(new ZodValidationPipe(SavedSearchQuerySchema))
    query: SavedSearchQueryType,
  ) {
    return this.savedSearchesService.findAll(userId, query);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a saved search' })
  @ApiResponse({ status: 200, description: 'Saved search removed' })
  @ApiResponse({ status: 404, description: 'Saved search not found' })
  remove(@CurrentUser('id') userId: string, @Param('id') id: string) {
    return this.savedSearchesService.remove(userId, id);
  }
}
