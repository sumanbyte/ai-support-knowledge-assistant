import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ChatService } from './chat.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { GetUser } from '../auth/decorators/current-user.decorator';
import { User } from '@/generated/prisma/client';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { ChatResponseDto } from './dto/chat-response-dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth-guard';

@Controller('chat')
@UseGuards(JwtAuthGuard)
export class ChatController {
  constructor(private readonly chatService: ChatService) { }

  @Post()
  create(@Body() createChatDto: CreateChatDto) {
    return this.chatService.create(createChatDto);
  }

  @Get()
  findAll() {
    return this.chatService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.chatService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateChatDto: UpdateChatDto) {
    return this.chatService.update(+id, updateChatDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.chatService.remove(+id);
  }


  @ApiOkResponse({ type: ChatResponseDto })
  @ApiOperation({ summary: 'Ask the assistant a question', description: 'Ask the assistant a question and get a response' })
  @Post("ask-assistant")
  askAssistant(
    @Body("userQuestion") userQuestion: string,
    @GetUser() user: Omit<User, 'password'>
  ) {
    return this.chatService.askAssistant(userQuestion, user.id)
  }
}
