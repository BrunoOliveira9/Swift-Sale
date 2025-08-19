import { Body, Controller, Get, Post, Res, UseGuards } from "@nestjs/common";
import { AuthenticationService } from "../services/authentication.service";
import { LoginDto } from "../dto/login.dto";
import { Public } from "../public.decorator";
import type { Response } from "express";
import { AuthGuard } from "../guard/authentication.guard";

@Controller('auth')
export class AuthenticationController {
   constructor(
      private readonly _authenticationService: AuthenticationService) { }
   
   @Post('login')
   @Public()   
   async login(@Body() data: LoginDto, @Res({ passthrough: true }) res: Response) {
     return this._authenticationService.login(data, res);
   }

   @Post('logout')
   @Public()
   async logout(@Res({ passthrough: true }) res: Response) {
     return this._authenticationService.logout(res);
   }

   @Get('status')
   async getStatus() {
     return this._authenticationService.getStatus();
   }
}