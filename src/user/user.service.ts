import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EditUserDto } from './dto';

@Injectable()
export class UserService {
    constructor(private prisma: PrismaService){}

    async editUser(
        userId: number,
        dto: EditUserDto,
      ) {
        const user2 = await this.prisma.user.findFirst({where: {id: userId}})
        const user = await this.prisma.user.update({
          where: {
            id: user2.id
          },
          data: {
            ...dto,
          },
        });
        delete user.hash;
    
        return user;
      }
}
