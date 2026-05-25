import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";


@Injectable()
export class AppConfig {
    constructor(private configService: ConfigService) { }


    getEnvConfig() {
        const GEMINI_API_KEY = this.configService.get<string>("GEMINI_API_KEY");
        const UPSTASH_VECTOR_REST_URL = this.configService.get<string>("UPSTASH_VECTOR_REST_URL")
        const UPSTASH_VECTOR_REST_TOKEN = this.configService.get<string>("UPSTASH_VECTOR_REST_TOKEN");

        return {
            GEMINI_API_KEY,
            UPSTASH_VECTOR_REST_TOKEN,
            UPSTASH_VECTOR_REST_URL
        }
    }
}