import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { ConfigService } from "@nestjs/config";
import { verify } from "jsonwebtoken";
import { IS_PUBLIC } from "./public.decorator";
import { AuthenticatedRequest, AuthenticatedUser } from "./auth.types";

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly config: ConfigService,
    private readonly reflector: Reflector
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC, [
      context.getHandler(),
      context.getClass()
    ]);
    if (isPublic) return true;

    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const authHeader = request.headers.authorization;
    const token = authHeader?.startsWith("Bearer ") ? authHeader.slice("Bearer ".length) : undefined;
    if (!token) throw new UnauthorizedException("Bearer token is required.");

    try {
      request.user = verify(token, this.config.get<string>("JWT_SECRET") ?? "dev-secret-change-me") as AuthenticatedUser;
      return true;
    } catch {
      throw new UnauthorizedException("Bearer token is invalid or expired.");
    }
  }
}
