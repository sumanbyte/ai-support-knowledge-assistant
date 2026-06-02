import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from '@/generated/prisma/client';
import { PrismaService } from '../auth/prisma/prisma.service';
import { VectorService } from '../vector/vector.service';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Injectable()
export class UserService {

  constructor(
    private readonly prisma: PrismaService,
    private readonly vectorService: VectorService,
    private readonly cloudinaryService: CloudinaryService,
  ) { }

  async create(createUserDto: CreateUserDto) {
    return this.prisma.user.create({
      data: {
        email: createUserDto.email,
        name: createUserDto.name,
        password: createUserDto.password,
        googleId: createUserDto.googleId,
      },
    });
  }

  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email }
    })
  }

  async updateGoogleId(id: string, googleId: string): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data: { googleId }
    })
  }

  async updateName(userId: string, name: string): Promise<User> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return this.prisma.user.update({
      where: { id: userId },
      data: { name: name.trim() },
    });
  }

  async resetWorkspace(userId: string) {
    const documents = await this.prisma.document.findMany({
      where: { userId },
      select: { id: true, publicId: true },
    });

    for (const doc of documents) {
      await this.vectorService.deleteVectorEmbeddings(doc.id, userId);
      try {
        await this.cloudinaryService.deleteFile(doc.publicId);
      } catch (error) {
        console.error(`Cloudinary delete failed for ${doc.publicId}:`, error);
      }
    }

    const [deletedChats, deletedDocuments, deletedPipelineLogs] =
      await this.prisma.$transaction([
        this.prisma.chat.deleteMany({ where: { userId } }),
        this.prisma.document.deleteMany({ where: { userId } }),
        this.prisma.pipelineLog.deleteMany({ where: { userId } }),
      ]);

    return {
      success: true,
      message: 'Workspace data has been permanently reset.',
      deletedDocuments: deletedDocuments.count,
      deletedChats: deletedChats.count,
      deletedPipelineLogs: deletedPipelineLogs.count,
    };
  }
}
