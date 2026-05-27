import { ExtractJwt, Strategy } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { UserService } from "../../user/user.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(
        private usersService: UserService
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_SECRET || "fallback"
        })
    }

    // This method intercepts the decrypted payload from the token
    async validate(payload: { sub: string, email: string }) {
        const user = await this.usersService.findByEmail(payload.email);

        if (!user) {
            throw new UnauthorizedException("User no longer exists")
        }

        //Whatever is returned here gets automatically attacted to the request object.
        return {
            id: user.id,
            email: user.email,
            name: user.name
        }
    }

}