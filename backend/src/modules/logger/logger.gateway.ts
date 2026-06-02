import { WebSocketGateway, OnGatewayConnection, OnGatewayDisconnect, WebSocketServer } from '@nestjs/websockets';
import { Server, } from 'socket.io';
import { PrismaService } from '../auth/prisma/prisma.service';



@WebSocketGateway({
    cors: {
        origin: process.env.FRONTEND_URL,
        credentials: true,
    },
    transports: ['websocket'],
    namespace: 'logger',
    allowEIO3: true,
    pingTimeout: 60000,
    pingInterval: 25000,
    maxHttpBufferSize: 1e8,
}
)
export class LoggerGateway implements OnGatewayConnection, OnGatewayDisconnect {

    constructor(private readonly prismaService: PrismaService) { }
    @WebSocketServer()
    server: Server;

    handleConnection(client: any) {
        const raw = client.handshake.query.userId;
        const userId = Array.isArray(raw) ? raw[0] : raw;

        if (!userId || typeof userId !== 'string') {
            client.disconnect(true);
            return;
        }

        client.join(`user-${userId}`);
    }

    handleDisconnect(client: any) {
        console.log('Client disconnected');
    }

    async sendLog(userId: string, type: "info" | "success" | "warn" | "error" | "system", message: string) {
        const log = {
            timestamp: new Date().toISOString().split('T')[1].substring(0, 8), // e.g. "14:22:05"
            type,
            message,
            id: Math.random().toString(36).substring(2, 9),
        };

        await this.prismaService.pipelineLog.create({
            data: {
                type,
                message,
                userId,
            },
        });

        if (this.server) {
            this.server.to(`user-${userId}`).emit('new-log', log);
        }
    }
}

