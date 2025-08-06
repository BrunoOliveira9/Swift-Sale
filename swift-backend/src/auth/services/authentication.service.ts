import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt"
import { LoginDTO } from "../dto/login.dto";

@Injectable()
export class AuthenticationService {
    constructor(
        private readonly _jwtService: JwtService,
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

    async login(data: LoginDTO) {
        const { username, password } = data;
        // só verificação simples para testes (essa lógica vai ser substituida por banco de dados
        const logged: boolean = username === 'eduardo.abreu' && password === 'passwordMock';

        if (!logged) {
            throw new UnauthorizedException('Credenciais inválidas');
        }

        // id será obtido do banco de dados após a autenticação bem-sucedida
        const userId = 1; // simulando o ID do usuário
        const token = await this.createToken(userId);

        return { auth: true, token };
    }

}