import { Body, Controller, Get, Post } from "@nestjs/common";
import { CurrentUser } from "../common/current-user.decorator";
import { AuthenticatedUser } from "../common/auth.types";
import { Public } from "../common/public.decorator";
import { AuthService } from "./auth.service";
import { LoginDto, RefreshTokenDto, RegisterHospitalDto } from "./auth.dto";

@Controller("auth")
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Public()
  @Post("login")
  login(@Body() credentials: LoginDto) {
    return this.auth.login(credentials);
  }

  @Public()
  @Post("register-hospital")
  registerHospital(@Body() registration: RegisterHospitalDto) {
    return this.auth.registerHospital(registration);
  }

  @Public()
  @Post("refresh")
  refresh(@Body() body: RefreshTokenDto) {
    return this.auth.refresh(body.refreshToken);
  }

  @Post("logout")
  logout(@CurrentUser() user: AuthenticatedUser, @Body() body: RefreshTokenDto) {
    return this.auth.logout(user.userId, body.refreshToken);
  }

  @Get("me")
  me(@CurrentUser() user: AuthenticatedUser) {
    return user;
  }
}
