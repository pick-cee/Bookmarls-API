import { Test } from "@nestjs/testing"
import { AppModule } from "../src/app.module"
import * as pactum from 'pactum'
import { INestApplication, ValidationPipe } from "@nestjs/common"
import { PrismaService } from "../src/prisma/prisma.service"
import { AuthDto } from "../src/auth/dto"


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

    })

    describe("Edit user" , () => {

    })
  })

  describe("Bookmarks", () =>  {
    describe("Create bookmark", () => {

    })

    describe("Get bookmarks", () => {
      
    })

    describe("Get bookmark by id", () => {

    })

    describe("Edit bookmark", () => {

    })

    describe("Delete bookmark", () => {

    })
  })
})