import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt"
import { LoginDto } from "../dto/login.dto";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class AuthenticationService {
    constructor(
        private readonly _jwtService: JwtService,
        private prisma: PrismaService
    ) { }
    
    async createToken(id: number) {
        return this._jwtService.sign({ id })
    }

    async checkTokenJwt(token: string) {
        try {
            return this._jwtService.verify(token.replace("Bearer ",""));
        } catch (err) {
            return false;
        } 
    }

    async login(data: LoginDto) {
        console.log('Login data:', data);
        const user = await this.prisma.cad_usuario.findUnique({
            where: {
                username: data.username,
                password: data.password
            },
        });

        if (!user || user.password !== data.password) {
            throw new UnauthorizedException('Usuário ou senha inválidos');
        }

        const token = await this.createToken(user.id);
        return { token };
    }

}