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
        
        // pega o token do cookie
        const request = context.switchToHttp().getRequest();
        const token = request.cookies['token'];

        if (!token) {
          throw new UnauthorizedException("Token não informado");
        }

        const isValid = await this.authService.valideToken(token);
        if (!isValid) {
          throw new ForbiddenException("Token inválido");
        }

        return true;
      }
}