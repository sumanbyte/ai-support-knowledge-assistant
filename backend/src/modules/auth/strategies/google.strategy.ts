import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";

import { Strategy, VerifyCallback } from "passport-google-oauth20";

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, "google") {
    constructor() {
        const clientID = process.env.GOOGLE_CLIENT_ID;
        if (!clientID) {
            throw new Error("GOOGLE_CLIENT_ID is not set");
        }

        super({
            clientID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "fallback",
            callbackURL: process.env.GOOGLE_CALLBACK_URL ?? "fallback",
            scope: ["email", "profile"],
            passReqToCallback: true,
        });
    }

    async validate(accessToken: string, refreshToken: string, profile: any, done: VerifyCallback) {
        const { name, emails, picture } = profile;
        const user = {
            email: emails[0].value,
            firstName: name.givenName,
            lastName: name.familyName,
            picture: picture,
            accessToken
        }
        done(null, user);
    }
}