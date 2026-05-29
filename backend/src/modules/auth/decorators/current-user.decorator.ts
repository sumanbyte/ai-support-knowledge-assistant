import { User } from "@/generated/prisma/client";
import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const GetUser = createParamDecorator(
    (data: keyof Omit<User, 'password'> | undefined, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        const user = request.user;

        // If a specific property was requested (like 'id'), return it. 
        // Otherwise, return the full user object.
        return data && user ? user[data] : user;
    }
);
