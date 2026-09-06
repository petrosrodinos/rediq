import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtGuard } from '@/shared/guards/jwt.guard';
import { CurrentUser } from '@/shared/decorators/current-user.decorator';
import { SearchService } from './search.service';
import { SearchDto } from './dto/search.dto';

@ApiTags('search')
@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller()
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Post('research-projects/:researchProjectId/search')
  @ApiOperation({
    summary: "Semantic search over a research project's analyzed content",
  })
  @ApiParam({ name: 'researchProjectId', description: 'Research project id' })
  @ApiResponse({ status: 200, description: 'Ranked semantic search results' })
  @ApiResponse({ status: 404, description: 'Research project not found' })
  search(
    @CurrentUser('id') userId: string,
    @Param('researchProjectId') researchProjectId: string,
    @Body() dto: SearchDto,
  ) {
    return this.searchService.search(userId, researchProjectId, dto);
  }
}
