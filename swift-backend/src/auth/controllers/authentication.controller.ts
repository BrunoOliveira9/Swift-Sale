import { Body, Controller, Post } from "@nestjs/common";
import { AuthenticationService } from "../services/authentication.service";
import { LoginDTO } from "../dto/login.dto";

@Controller('auth')
export class AuthenticationController {
   constructor(private readonly _authenticationService: AuthenticationService) { }
   
   @Post('login')
   async login(@Body() data: LoginDTO) {
    return this._authenticationService.login(data)
   }

}