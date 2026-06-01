import { GenerativeModel, GoogleGenerativeAI } from "@google/generative-ai";
import { Injectable } from "@nestjs/common";
import { AppConfig } from "src/config/app.config";

@Injectable()
export class GeminiService {
    private genAI: GoogleGenerativeAI
    private model: GenerativeModel

    constructor(
        private readonly appConfig: AppConfig
    ) {
        this.genAI = new GoogleGenerativeAI(appConfig.getEnvConfig().GEMINI_API_KEY!);
        this.model = this.genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite", });

    }

    async generateResponse(query: string, context: string) {
        const result = await this.model.generateContent({
            contents: [
                {
                    role: "user"
                    , parts: [
                        {
                            text: `CONTEXT: ${context} 
                        Question: ${query}
                        `}
                    ]
                },

            ]
        });
        return result.response.text()
    }
}