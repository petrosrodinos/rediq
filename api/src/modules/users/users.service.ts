import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '@/core/databases/prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { SafeUser } from './interfaces/user.interface';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async getMe(userId: string): Promise<SafeUser> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    delete (user as any).password;
    return user;
  }

  async updateMe(userId: string, dto: UpdateUserDto): Promise<SafeUser> {
    try {
      const user = await this.prisma.user.update({
        where: { id: userId },
        data: { ...dto },
      });

      delete (user as any).password;
      return user;
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException('Email or phone already in use');
      }
      throw error;
    }
  }
}
