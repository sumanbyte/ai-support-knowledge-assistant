import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";


@Injectable()
export class AppConfig {
    constructor(private configService: ConfigService) { }


    getEnvConfig() {
        const GEMINI_API_KEY = this.configService.get<string>("GEMINI_API_KEY");

        return {
            GEMINI_API_KEY
        }
    }
}