import { Test } from "@nestjs/testing"
import { AppModule } from "../src/app.module"
import * as pactum from 'pactum'
import { INestApplication, ValidationPipe } from "@nestjs/common"
import { PrismaService } from "../src/prisma/prisma.service"
import { AuthDto } from "../src/auth/dto"
import { EditUserDto } from "../src/user/dto"
import { CreateBookmarkDto } from "src/bookmark/dto"


describe('App e2e', () => {
  let app: INestApplication
  let prisma: PrismaService
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule]
    }).compile()

    app = moduleRef.createNestApplication()
    app.useGlobalPipes(new ValidationPipe({
      whitelist: true 
    }))
    await app.init()
    await app.listen(5000)

    prisma = app.get(PrismaService)
    await prisma.cleanDb()

    pactum.request.setBaseUrl('http://localhost:5000')
  })

  afterAll(async() => {
    await app.close()
  })

  describe("Auth", () => {
    const dto: AuthDto = {  
      email: 'akin@gmail.com',
      password: '123'
    }
    describe("Signup", () => {
      it("should throw an exception if email empty", () => {
        return pactum.spec().post('/auth/signup').withBody({password: dto.password}).expectStatus(400)
      })
      it("should throw an exception if password empty", () => {
        return pactum.spec().post('/auth/signup').withBody({email: dto.email}).expectStatus(400)
      })
      it("should throw an exception if no email and password", () => {
        return pactum.spec().post('/auth/signup').expectStatus(400)
      })
      it('should sign up', () => {
        return pactum.spec().post('/auth/signup').withBody(dto).expectStatus(201)
      }) 
    })

    describe("Signin", () => {
      it("should throw an exception if email empty", () => {
        return pactum.spec().post('/auth/signin').withBody({password: dto.password}).expectStatus(400)
      })
      it("should throw an exception if password empty", () => {
        return pactum.spec().post('/auth/signin').withBody({email: dto.email}).expectStatus(400)
      })
      it("should throw an exception if no email and password", () => {
        return pactum.spec().post('/auth/signin').expectStatus(400)
      })
      it('should sign in', () => {
        return pactum.spec().post('/auth/signin').withBody(dto).expectStatus(200).stores('userAt', 'access_token')
      }) 
    })
  })

  describe("User", () => {
    describe("Get me" , () => {
      it('should get current user', () => {
        return pactum.spec().get('/users/me').withHeaders({
          Authorization: 'Bearer $S{userAt}'
        }).expectStatus(200)
      })
    })

    describe('Edit user', () => {
      it('should edit user', () => {
        const dto: EditUserDto = {
          firstName: 'Vladimir',
          email: 'vlad@codewithvlad.com',
        };
        return pactum.spec().patch('/users').withHeaders({
            Authorization: 'Bearer $S{userAt}',
          }).withBody(dto).expectStatus(200).expectBodyContains(dto.firstName).expectBodyContains(dto.email);
      });
    });
  })

  describe("Bookmarks", () =>  {
    describe("Get empty bookmarks", () => {
      it("should get empty bookmarks", () => {
        return pactum.spec().get('/bookmarks').withHeaders({
            Authorization: 'Bearer $S{userAt}',
          }).expectStatus(200).expectBody([])
      })
    })

    describe("Create bookmark", () => {
      const dto: CreateBookmarkDto = {
        title: 'First bookmark',
        description: 'First bookmark description',
        link: 'https://www.youtube.com/watch?v=GHTA143_b-s&t=4378s'
      }
      it("should create bookmark", () => {
        return pactum.spec().post('/bookmarks').withHeaders({
          Authorization: 'Bearer $S{userAt}',
        }).withBody(dto).expectStatus(201)
      })
    })

    describe("Get bookmarks", () => {
      
    })

    describe("Get bookmark by id", () => {

    })

    describe("Edit bookmark by id", () => {

    })

    describe("Delete bookmark by id", () => {

    })
  })
})