import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth-guard';
import { GetUser } from '../auth/decorators/current-user.decorator';
import { User } from '@/generated/prisma/client';
import { DocumentResponseDto } from './dto/document-response.dto';
import { ApiOkResponse } from '@nestjs/swagger';
import { LoggerGateway } from '../logger/logger.gateway';
import { PrismaService } from '../auth/prisma/prisma.service';

@UseGuards(JwtAuthGuard)
@Controller('documents')
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService, private readonly loggerGateway: LoggerGateway, private readonly prismaService: PrismaService) { }

  @Post()
  create(@Body() createDocumentDto: CreateDocumentDto) {
    return this.documentsService.create(createDocumentDto);
  }

  @Get("logs/history")
  @ApiOkResponse({
    description: 'Pipeline logs history',
  })
  async getLogsHistory(@GetUser() user: Omit<User, 'password'>) {
    // Assuming your JWT Auth Guard appends the verified user profile to req.user
    const userId = user.id;

    const history = await this.prismaService.pipelineLog.findMany({
      where: { userId }, // 🚀 Only pull logs matching this user's unique ID
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    return history.map(log => ({
      id: log.id,
      timestamp: log.createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      type: log.type,
      message: log.message
    }));
  }

  @Get("all")
  @ApiOkResponse({
    description: 'All documents',
    type: DocumentResponseDto,
  })
  findAll(@GetUser() user: Omit<User, 'password'>) {
    return this.documentsService.findAll(user);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.documentsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDocumentDto: UpdateDocumentDto) {
    return this.documentsService.update(+id, updateDocumentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.documentsService.remove(+id);
  }


}
