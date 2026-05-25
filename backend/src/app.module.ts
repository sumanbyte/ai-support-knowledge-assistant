import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UploadModule } from './modules/upload/upload.module';
import { ConfigModule } from '@nestjs/config';
import { ChatModule } from './modules/chat/chat.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    UploadModule, ChatModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
