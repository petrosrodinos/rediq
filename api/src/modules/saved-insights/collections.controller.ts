import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
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
import { SavedInsightCollectionsService } from './collections.service';
import { CreateSavedInsightCollectionDto } from './dto/create-saved-insight-collection.dto';
import { UpdateSavedInsightCollectionDto } from './dto/update-saved-insight-collection.dto';

@ApiTags('saved-insights')
@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller('saved-insights/collections')
export class SavedInsightCollectionsController {
  constructor(
    private readonly collectionsService: SavedInsightCollectionsService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a saved-insight collection' })
  @ApiResponse({ status: 201, description: 'Collection created' })
  @ApiResponse({ status: 409, description: 'Name already in use' })
  create(
    @CurrentUser('id') userId: string,
    @Body() dto: CreateSavedInsightCollectionDto,
  ) {
    return this.collectionsService.create(userId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'List the current user\'s saved-insight collections' })
  @ApiResponse({ status: 200, description: 'Collections returned' })
  findAll(@CurrentUser('id') userId: string) {
    return this.collectionsService.findAll(userId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Rename a saved-insight collection' })
  @ApiResponse({ status: 200, description: 'Collection updated' })
  @ApiResponse({ status: 404, description: 'Collection not found' })
  update(
    @CurrentUser('id') userId: string,
    @Param('id') id: string,
    @Body() dto: UpdateSavedInsightCollectionDto,
  ) {
    return this.collectionsService.update(userId, id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a saved-insight collection' })
  @ApiResponse({ status: 200, description: 'Collection deleted' })
  @ApiResponse({ status: 404, description: 'Collection not found' })
  remove(@CurrentUser('id') userId: string, @Param('id') id: string) {
    return this.collectionsService.remove(userId, id);
  }
}
