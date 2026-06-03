import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import type { JwtSignOptions } from "@nestjs/jwt";
import type { CookieOptions } from "express";


@Injectable()
export class AppConfig {
    constructor(private configService: ConfigService) { }

    get jwtSecret(): string {
        return this.configService.get<string>("JWT_SECRET") ?? "fallback";
    }

    get jwtExpiresIn(): JwtSignOptions["expiresIn"] {
        return (this.configService.get<string>("JWT_EXPIRES_IN") ?? "1d") as JwtSignOptions["expiresIn"];
    }

    get jwtRefreshExpiresIn(): JwtSignOptions["expiresIn"] {
        return (this.configService.get<string>("JWT_REFRESH_EXPIRES_IN") ?? "7d") as JwtSignOptions["expiresIn"];
    }

    get cloudinary() {
        return {
            cloudName: this.configService.get<string>("CLOUDINARY_CLOUD_NAME") ?? "",
            apiKey: this.configService.get<string>("CLOUDINARY_API_KEY") ?? "",
            apiSecret: this.configService.get<string>("CLOUDINARY_API_SECRET") ?? "",
            folder: this.configService.get<string>("CLOUDINARY_FOLDER") ?? "converse-documents",
        };
    }

    getEnvConfig() {
        const GEMINI_API_KEY = this.configService.get<string>("GEMINI_API_KEY");
        const GEMINI_RAG_API_KEY = this.configService.get<string>("GEMINI_RAG_API_KEY");
        const UPSTASH_VECTOR_REST_URL = this.configService.get<string>("UPSTASH_VECTOR_REST_URL")
        const UPSTASH_VECTOR_REST_TOKEN = this.configService.get<string>("UPSTASH_VECTOR_REST_TOKEN");
        const GOOGLE_CLIENT_ID = this.configService.get<string>("GOOGLE_CLIENT_ID");
        const GOOGLE_CLIENT_SECRET = this.configService.get<string>("GOOGLE_CLIENT_SECRET");
        const GOOGLE_CALLBACK_URL = this.configService.get<string>("GOOGLE_CALLBACK_URL");
        const FRONTEND_URL = this.configService.get<string>("FRONTEND_URL");
        return {
            GEMINI_API_KEY,
            UPSTASH_VECTOR_REST_TOKEN,
            UPSTASH_VECTOR_REST_URL,
            JWT_SECRET: this.jwtSecret,
            JWT_EXPIRES_IN: this.configService.get<string>("JWT_EXPIRES_IN"),
            GOOGLE_CLIENT_ID,
            GOOGLE_CLIENT_SECRET,
            GOOGLE_CALLBACK_URL,
            GEMINI_RAG_API_KEY,
            FRONTEND_URL
        }
    }

    getCookieOptions(type: 'access' | 'refresh'): CookieOptions {
        const maxAge = type === 'access' ? 15 * 60 * 1000 : 7 * 24 * 60 * 60 * 1000;
        return {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            maxAge,
        };
    }
}