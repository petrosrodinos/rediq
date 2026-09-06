import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '@/core/databases/prisma/prisma.service';
import { GcsService } from '@/integrations/storage/gcs/services/gcs.service';
import { CreateDocumentDto } from './dto/create-document.dto';
import { DocumentsQueryType } from './dto/documents-query.schema';

interface UploadedFileLike {
  buffer: Buffer;
  originalname: string;
  mimetype: string;
  size: number;
}

@Injectable()
export class DocumentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly gcsService: GcsService,
  ) {}

  async create(userId: string, file: UploadedFileLike, dto: CreateDocumentDto) {
    if (!file) {
      throw new BadRequestException('A file is required');
    }

    const uploaded = await this.gcsService.uploadImageFromBuffer(
      file.buffer,
      file.originalname,
      file.mimetype,
      'documents',
    );

    return this.prisma.document.create({
      data: {
        user_uuid: userId,
        filename: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
        url: uploaded.url,
        path: uploaded.path,
        type: dto.type ?? 'LOGO',
      },
    });
  }

  async findAll(userId: string, query: DocumentsQueryType) {
    const where = {
      user_uuid: userId,
      ...(query.type && { type: query.type as any }),
    };

    const [items, count] = await Promise.all([
      this.prisma.document.findMany({
        where,
        skip: (query.page - 1) * query.limit,
        take: query.limit,
        orderBy: { [query.order_by]: query.order_direction },
      }),
      this.prisma.document.count({ where }),
    ]);

    return {
      data: items,
      pagination: {
        total: count,
        page: query.page,
        limit: query.limit,
        total_pages: Math.ceil(count / query.limit),
        has_next: query.page < Math.ceil(count / query.limit),
        has_prev: query.page > 1,
      },
    };
  }

  async findOne(userId: string, id: string) {
    const document = await this.prisma.document.findFirst({
      where: { id, user_uuid: userId },
    });

    if (!document) throw new NotFoundException('Document not found');
    return document;
  }

  async remove(userId: string, id: string) {
    const document = await this.findOne(userId, id);

    await this.prisma.document.delete({ where: { id: document.id } });

    setImmediate(async () => {
      try {
        await this.gcsService.deleteImage({ filename: document.path });
      } catch {}
    });

    return document;
  }
}
