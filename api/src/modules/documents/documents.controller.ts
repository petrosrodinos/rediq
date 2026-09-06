import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtGuard } from '@/shared/guards/jwt.guard';
import { CurrentUser } from '@/shared/decorators/current-user.decorator';
import { ZodValidationPipe } from '@/shared/pipes/zod.validation.pipe';
import { DocumentsService } from './documents.service';
import { CreateDocumentDto } from './dto/create-document.dto';
import {
  DocumentsQuerySchema,
  DocumentsQueryType,
} from './dto/documents-query.schema';

@ApiTags('documents')
@Controller('documents')
@UseGuards(JwtGuard)
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Post()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Upload a document' })
  @ApiResponse({ status: 201, description: 'Document uploaded' })
  create(
    @CurrentUser('id') userId: string,
    @UploadedFile() file: any,
    @Body() dto: CreateDocumentDto,
  ) {
    return this.documentsService.create(userId, file, dto);
  }

  @Get()
  @ApiOperation({ summary: 'List documents' })
  @ApiResponse({ status: 200, description: 'Documents returned' })
  findAll(
    @CurrentUser('id') userId: string,
    @Query(new ZodValidationPipe(DocumentsQuerySchema))
    query: DocumentsQueryType,
  ) {
    return this.documentsService.findAll(userId, query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a document' })
  @ApiResponse({ status: 200, description: 'Document returned' })
  findOne(@CurrentUser('id') userId: string, @Param('id') id: string) {
    return this.documentsService.findOne(userId, id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a document' })
  @ApiResponse({ status: 200, description: 'Document deleted' })
  remove(@CurrentUser('id') userId: string, @Param('id') id: string) {
    return this.documentsService.remove(userId, id);
  }
}
