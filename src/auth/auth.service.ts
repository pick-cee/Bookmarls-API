import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class AuthService{
    constructor(private prisma: PrismaService) {}
    
    signin(){
        return { message: "I have signed in"}
    }
    signup(){
        return { message: "I have signed up"}
    }
}