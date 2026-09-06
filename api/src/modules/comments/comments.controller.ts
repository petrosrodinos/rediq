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
import { CommentsService } from './comments.service';
import {
  CommentQuerySchema,
  CommentQueryType,
} from './dto/comment-query.schema';

@ApiTags('comments')
@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller()
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Get('posts/:postId/comments')
  @ApiOperation({ summary: 'List comments for a post' })
  @ApiParam({ name: 'postId', description: 'Post id' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'min_score', required: false })
  @ApiQuery({ name: 'order_by', required: false })
  @ApiQuery({ name: 'order_direction', required: false })
  @ApiResponse({ status: 200, description: 'Paginated list of comments' })
  findAll(
    @CurrentUser('id') userId: string,
    @Param('postId') postId: string,
    @Query(new ZodValidationPipe(CommentQuerySchema)) query: CommentQueryType,
  ) {
    return this.commentsService.findAll(userId, postId, query);
  }

  @Get('comments/:id')
  @ApiOperation({ summary: 'Get a single comment with its direct replies' })
  @ApiParam({ name: 'id', description: 'Comment id' })
  @ApiResponse({ status: 200, description: 'Comment found' })
  @ApiResponse({ status: 404, description: 'Comment not found' })
  findOne(@CurrentUser('id') userId: string, @Param('id') id: string) {
    return this.commentsService.findOne(userId, id);
  }
}
