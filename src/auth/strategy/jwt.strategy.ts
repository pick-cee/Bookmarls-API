import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { ConfigService } from "@nestjs/config";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable() 
export class JwtStrategy extends PassportStrategy(Strategy, "jwt") {
    constructor(private config: ConfigService, private prisma: PrismaService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: config.get("JWT_SECRET")
        })
    }
    async validate(payload: {sub: number, email: string}){
        const user = this.prisma.user.findUnique({
            where: {
                id: payload.sub
            }
        })
        delete (await user).hash
        return payload
    }
}