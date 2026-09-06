import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtGuard } from '@/shared/guards/jwt.guard';
import { CurrentUser } from '@/shared/decorators/current-user.decorator';
import { ZodValidationPipe } from '@/shared/pipes/zod.validation.pipe';
import { PostsService } from './posts.service';
import { PostQuerySchema, PostQueryType } from './dto/post-query.schema';

@ApiTags('posts')
@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller()
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get('research-projects/:researchProjectId/posts')
  @ApiOperation({ summary: 'List posts collected for a research project' })
  @ApiParam({ name: 'researchProjectId', description: 'Research project id' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'community', required: false })
  @ApiQuery({ name: 'min_score', required: false })
  @ApiQuery({ name: 'is_nsfw', required: false })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'order_by', required: false })
  @ApiQuery({ name: 'order_direction', required: false })
  @ApiResponse({ status: 200, description: 'Paginated list of posts' })
  findAll(
    @CurrentUser('id') userId: string,
    @Param('researchProjectId') researchProjectId: string,
    @Query(new ZodValidationPipe(PostQuerySchema)) query: PostQueryType,
  ) {
    return this.postsService.findAll(userId, researchProjectId, query);
  }

  @Get('posts/:id')
  @ApiOperation({ summary: 'Get a single post with its top comments' })
  @ApiParam({ name: 'id', description: 'Post id' })
  @ApiResponse({ status: 200, description: 'Post found' })
  @ApiResponse({ status: 404, description: 'Post not found' })
  findOne(@CurrentUser('id') userId: string, @Param('id') id: string) {
    return this.postsService.findOne(userId, id);
  }
}
