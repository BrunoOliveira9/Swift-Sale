import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt"
import { LoginDto } from "../dto/login.dto";
import { PrismaService } from "../../prisma/prisma.service";
import { HashService } from "src/core/crypto/hash.service";

@Injectable()
export class AuthenticationService {
    constructor(
        private readonly _jwtService: JwtService,
        private readonly _hashService: HashService,
        private prisma: PrismaService
    ) { }
    
    async createToken(id: number) {
        return this._jwtService.sign({ id })
    }

    async valideToken(token: string): Promise<boolean> {
        try {
        const payload = this._jwtService.verify(token);
        // console.log('Payload:', payload);
        return true;
        } catch (err) {
        throw new UnauthorizedException('Token inválido ou expirado');
        }
    }

    async login(data: LoginDto) {
        // console.log('Login data:', data);

        const user = await this.prisma.cad_usuario.findUnique({
            where: {
                username: data.username,
            },
        });

        if (!user) {
            throw new UnauthorizedException('Usuário ou senha inválidos');
        }

        const isPasswordValid = await this._hashService.compararSenha(data.password, user.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException('Usuário ou senha inválidos');
        }

        const token = await this.createToken(user.id);
        return { token };
    }
}