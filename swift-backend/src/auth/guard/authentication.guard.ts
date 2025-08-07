import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthenticationService } from "../services/authentication.service";
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../public.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private readonly authService: AuthenticationService,
        private readonly reflector: Reflector
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        // Verifica se a rota é pública
        const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
          context.getHandler(),
          context.getClass(),
        ]);
        if (isPublic) {
          return true; // Permite acesso sem autenticação
        }
        // Aqui entra sua lógica de autenticação (por token, etc.)  
        const request = context.switchToHttp().getRequest();
        const authorization = request.headers.authorization;
        // console.log('Authorization Header:', authorization);
        // console.log('Request Headers:', request.headers);

        if (!authorization) {
          throw new UnauthorizedException("Token não informado");
        }

        const token = authorization.trim();
        const isValid = await this.authService.valideToken(token);
        if (!isValid) {
          throw new ForbiddenException("Token inválido");
        }

        return true;
      }
}