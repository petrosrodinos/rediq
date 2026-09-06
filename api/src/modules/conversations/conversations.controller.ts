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
import { ConversationsService } from './conversations.service';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { CreateMessageDto } from './dto/create-message.dto';
import {
  ConversationQuerySchema,
  ConversationQueryType,
} from './dto/conversation-query.schema';

@ApiTags('conversations')
@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller()
export class ConversationsController {
  constructor(private readonly conversationsService: ConversationsService) {}

  @Post('research-projects/:researchProjectId/conversations')
  @ApiOperation({
    summary: 'Start a new AI research conversation for a research project',
  })
  @ApiResponse({ status: 201, description: 'Conversation created' })
  create(
    @CurrentUser('id') userId: string,
    @Param('researchProjectId') researchProjectId: string,
    @Body() dto: CreateConversationDto,
  ) {
    return this.conversationsService.create(userId, researchProjectId, dto);
  }

  @Get('research-projects/:researchProjectId/conversations')
  @ApiOperation({ summary: 'List conversations for a research project' })
  @ApiResponse({ status: 200, description: 'Paginated list of conversations' })
  findAll(
    @CurrentUser('id') userId: string,
    @Param('researchProjectId') researchProjectId: string,
    @Query(new ZodValidationPipe(ConversationQuerySchema))
    query: ConversationQueryType,
  ) {
    return this.conversationsService.findAll(userId, researchProjectId, query);
  }

  @Get('conversations/:id')
  @ApiOperation({ summary: 'Get a conversation with its full message history' })
  @ApiResponse({ status: 200, description: 'Conversation returned' })
  @ApiResponse({ status: 404, description: 'Conversation not found' })
  findOne(@CurrentUser('id') userId: string, @Param('id') id: string) {
    return this.conversationsService.findOne(userId, id);
  }

  @Delete('conversations/:id')
  @ApiOperation({ summary: 'Delete a conversation' })
  @ApiResponse({ status: 200, description: 'Conversation deleted' })
  @ApiResponse({ status: 404, description: 'Conversation not found' })
  remove(@CurrentUser('id') userId: string, @Param('id') id: string) {
    return this.conversationsService.remove(userId, id);
  }

  @Post('conversations/:id/messages')
  @ApiOperation({
    summary:
      'Ask the AI research agent a question, grounded in the analyzed Reddit dataset',
  })
  @ApiResponse({ status: 201, description: 'Assistant reply with citations' })
  @ApiResponse({ status: 404, description: 'Conversation not found' })
  sendMessage(
    @CurrentUser('id') userId: string,
    @Param('id') id: string,
    @Body() dto: CreateMessageDto,
  ) {
    return this.conversationsService.sendMessage(userId, id, dto);
  }
}
