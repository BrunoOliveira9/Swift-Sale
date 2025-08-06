import { Body, Controller, Post } from "@nestjs/common";
import { AuthenticationService } from "../services/authentication.service";
import { LoginDto } from "../dto/login.dto";
import { Public } from "../public.decorator";

@Controller('auth')
export class AuthenticationController {
   constructor(
      private readonly _authenticationService: AuthenticationService) { }
   
   @Post('login')
   @Public()   
   async login(@Body() data: LoginDto) {
    console.log('Controller recebeu:', data);
    return this._authenticationService.login(data)
   }

}