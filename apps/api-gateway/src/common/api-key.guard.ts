import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import type { Request } from "express";

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(private readonly config: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const expectedKey = this.config.get<string>("API_KEY");
    if (!expectedKey) return true;

    const request = context.switchToHttp().getRequest<Request>();
    const providedKey = request.header("x-api-key");
    if (providedKey === expectedKey) return true;

    throw new UnauthorizedException("A valid API key is required.");
  }
}
