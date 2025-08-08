import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt"
import { LoginDto } from "../dto/login.dto";
import { PrismaService } from "../../prisma/prisma.service";
import { HashService } from "src/core/crypto/hash.service";
import { Response } from "express";

@Injectable()
export class AuthenticationService {
    constructor(
        private readonly _jwtService: JwtService,
        private readonly _hashService: HashService,
        private prisma: PrismaService
    ) { }
    
    async valideToken(token: string): Promise<boolean> {
        try {
            const payload = this._jwtService.verify(token);
            return true;
        } catch (err) {
            throw new UnauthorizedException('Token inválido ou expirado');
        }
    }
    
    async login(data: LoginDto, res: Response) {
        const user = await this.prisma.cad_usuario.findUnique({
            where: {
                username: data.username,
                password: data.password
            },
        });

        if (!user || user.password !== data.password) {
            throw new UnauthorizedException('Usuário ou senha inválidos');
        }

        const payload = { sub: user.id, username: user.username };
        const token = await this._jwtService.signAsync(payload);

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 3600000,
        });

        return { 'logado com sucesso': true };
    }

    async logout(res: Response) {
      res.clearCookie('token');
      return { success: true };
    }

    // esse método pode ficar vazio mesmo, a validação já é feita pelo guarda
    async getStatus() {
      return { authenticated: true };
    }
}