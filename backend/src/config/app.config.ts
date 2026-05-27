import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";


@Injectable()
export class AppConfig {
    constructor(private configService: ConfigService) { }


    getEnvConfig() {
        const GEMINI_API_KEY = this.configService.get<string>("GEMINI_API_KEY");
        const UPSTASH_VECTOR_REST_URL = this.configService.get<string>("UPSTASH_VECTOR_REST_URL")
        const UPSTASH_VECTOR_REST_TOKEN = this.configService.get<string>("UPSTASH_VECTOR_REST_TOKEN");
        const JWT_SECRET = this.configService.get<string>("JWT_SECRET");
        const JWT_EXPIRES_IN = this.configService.get<string>("JWT_EXPIRES_IN");
        const GOOGLE_CLIENT_ID = this.configService.get<string>("GOOGLE_CLIENT_ID");
        const GOOGLE_CLIENT_SECRET = this.configService.get<string>("GOOGLE_CLIENT_SECRET");
        const GOOGLE_CALLBACK_URL = this.configService.get<string>("GOOGLE_CALLBACK_URL");

        return {
            GEMINI_API_KEY,
            UPSTASH_VECTOR_REST_TOKEN,
            UPSTASH_VECTOR_REST_URL,
            JWT_SECRET,
            JWT_EXPIRES_IN,
            GOOGLE_CLIENT_ID,
            GOOGLE_CLIENT_SECRET,
            GOOGLE_CALLBACK_URL
        }
    }
}