import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from "@nestjs/common";
import { Observable } from "rxjs";
import { AuthenticationService } from "../services/authentication.service";
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../public.decorator';

 
@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private readonly authService: AuthenticationService,
        private readonly reflector: Reflector
    ) { }
 
    canActivate(context: ExecutionContext): boolean {
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
        const authHeader = request.headers.authorization;
    
        // exemplo de verificação simples
        return !!authHeader; // ou alguma lógica real com token
      }
    handleRequest(err: any, user: any, info: any): any {
        if (err || !user) {
            throw err || new UnauthorizedException();
        }
        return user;
    }
}
