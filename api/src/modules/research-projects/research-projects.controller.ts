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
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from '@/shared/guards/jwt.guard';
import { CurrentUser } from '@/shared/decorators/current-user.decorator';
import { ZodValidationPipe } from '@/shared/pipes/zod.validation.pipe';
import { ResearchProjectsService } from './research-projects.service';
import { CreateResearchProjectDto } from './dto/create-research-project.dto';
import { UpdateResearchProjectDto } from './dto/update-research-project.dto';
import {
  ResearchProjectsQuerySchema,
  ResearchProjectsQueryType,
} from './dto/research-projects-query.schema';

@ApiTags('research-projects')
@Controller('research-projects')
@UseGuards(JwtGuard)
export class ResearchProjectsController {
  constructor(
    private readonly researchProjectsService: ResearchProjectsService,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Create a research project from a subreddit or post URL',
  })
  @ApiResponse({ status: 201, description: 'Research project created' })
  create(
    @CurrentUser('id') userId: string,
    @Body() dto: CreateResearchProjectDto,
  ) {
    return this.researchProjectsService.create(userId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'List research projects' })
  @ApiResponse({ status: 200, description: 'Research projects returned' })
  findAll(
    @CurrentUser('id') userId: string,
    @Query(new ZodValidationPipe(ResearchProjectsQuerySchema))
    query: ResearchProjectsQueryType,
  ) {
    return this.researchProjectsService.findAll(userId, query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a research project' })
  @ApiResponse({ status: 200, description: 'Research project returned' })
  findOne(@CurrentUser('id') userId: string, @Param('id') id: string) {
    return this.researchProjectsService.findOne(userId, id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Rename a research project' })
  @ApiResponse({ status: 200, description: 'Research project updated' })
  update(
    @CurrentUser('id') userId: string,
    @Param('id') id: string,
    @Body() dto: UpdateResearchProjectDto,
  ) {
    return this.researchProjectsService.update(userId, id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a research project' })
  @ApiResponse({ status: 200, description: 'Research project deleted' })
  remove(@CurrentUser('id') userId: string, @Param('id') id: string) {
    return this.researchProjectsService.remove(userId, id);
  }
}
