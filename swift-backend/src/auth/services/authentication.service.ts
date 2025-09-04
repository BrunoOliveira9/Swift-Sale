import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt"
import { LoginDto } from "../dto/login.dto";
import { PrismaService } from "../../prisma/prisma.service";
import { HashService } from "src/core/crypto/hash.service";
import { Response } from "express";
import { CryptoService } from "src/core/crypto/crypto.service";

@Injectable()
export class AuthenticationService {
    constructor(
        private readonly _jwtService: JwtService,
        private readonly _hashService: HashService,
        private prisma: PrismaService,
        private readonly _cryptoService: CryptoService
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

        const encryptedUsername = this._cryptoService.encrypt(data.username);

        const user = await this.prisma.cad_usuario.findUnique({
            where: {
                username: encryptedUsername,
            },
        });

        if (!user) {
            throw new UnauthorizedException('Usuário ou senha inválidos');
        }

        const isPasswordValid = await this._hashService.compararSenha(data.password, user.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException('Usuário ou senha inválidos');
        }

        // descriptografa o username antes de incluir no payload do jwt
        const decryptedUsername = this._cryptoService.decrypt(user.username);

        const payload = { sub: user.id, username: decryptedUsername };
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

    async getMe(res: Response) {
        const token = res.locals.token;
        if (!token) {
            throw new UnauthorizedException('Token não encontrado');
        }

        try {
            const payload = this._jwtService.verify(token);
            const userId = payload.sub;

            const user = await this.prisma.cad_usuario.findUnique({
                where: { id: userId },
                select: {
                    id: true,
                    nome: true,
                    sobrenome: true,
                    username: true,
                    email: true,
                    cargo: true,
                    nivel_acesso: true,
                },
            });

            if (!user) {
                throw new UnauthorizedException('Usuário não encontrado');
            }

            // Descriptografa o username antes de retornar
            const decryptedUsername = this._cryptoService.decrypt(user.username);

            return {
                id: user.id,
                nome: user.nome,
                sobrenome: user.sobrenome,
                username: decryptedUsername,
                email: user.email,
                cargo: user.cargo,
                nivel_acesso: user.nivel_acesso,
            };
        } catch (error) {
            throw new UnauthorizedException('Token inválido ou expirado');
        }
    }
}