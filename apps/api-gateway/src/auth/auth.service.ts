import { ConflictException, Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { compare, hash } from "bcryptjs";
import { sign } from "jsonwebtoken";
import { randomBytes } from "crypto";
import { and, eq, isNull } from "drizzle-orm";
import { HospitalDb, hospitals, refreshTokens, users } from "@hospital/db";
import { DB } from "../db/db.module";
import { LoginDto, RegisterHospitalDto } from "./auth.dto";

@Injectable()
export class AuthService {
  constructor(
    @Inject(DB) private readonly db: HospitalDb,
    private readonly config: ConfigService
  ) {}

  async login(credentials: LoginDto) {
    const [user] = await this.db.select().from(users).where(eq(users.email, credentials.email)).limit(1);
    if (!user || !(await compare(credentials.password, user.passwordHash))) {
      throw new UnauthorizedException("Invalid email or password.");
    }

    const [hospital] = await this.db.select().from(hospitals).where(eq(hospitals.id, user.hospitalId)).limit(1);
    return this.issueTokens({
      userId: user.id,
      hospitalId: user.hospitalId,
      email: user.email,
      role: user.role,
      hospitalName: hospital?.name ?? "Hospital"
    });
  }

  async registerHospital(registration: RegisterHospitalDto) {
    const existingEmail = await this.db.select().from(users).where(eq(users.email, registration.email)).limit(1);
    if (existingEmail.length) throw new ConflictException("A user with this email already exists.");

    const existingSlug = await this.db.select().from(hospitals).where(eq(hospitals.slug, registration.hospitalSlug)).limit(1);
    if (existingSlug.length) throw new ConflictException("A hospital with this slug already exists.");

    const [hospital] = await this.db
      .insert(hospitals)
      .values({ name: registration.hospitalName, slug: registration.hospitalSlug })
      .returning();

    const [user] = await this.db
      .insert(users)
      .values({
        hospitalId: hospital.id,
        email: registration.email,
        passwordHash: await hash(registration.password, 12),
        firstName: registration.firstName,
        lastName: registration.lastName,
        role: registration.role ?? "owner"
      })
      .returning();

    return this.issueTokens({
      userId: user.id,
      hospitalId: hospital.id,
      email: user.email,
      role: user.role,
      hospitalName: hospital.name
    });
  }

  async refresh(refreshToken: string) {
    const tokenHash = await hashToken(refreshToken);
    const [stored] = await this.db
      .select()
      .from(refreshTokens)
      .where(and(eq(refreshTokens.tokenHash, tokenHash), isNull(refreshTokens.revokedAt)))
      .limit(1);

    if (!stored || stored.expiresAt <= new Date()) {
      throw new UnauthorizedException("Refresh token is invalid or expired.");
    }

    const [user] = await this.db.select().from(users).where(eq(users.id, stored.userId)).limit(1);
    if (!user) throw new UnauthorizedException("Refresh token user no longer exists.");

    const [hospital] = await this.db.select().from(hospitals).where(eq(hospitals.id, user.hospitalId)).limit(1);
    await this.db.update(refreshTokens).set({ revokedAt: new Date() }).where(eq(refreshTokens.id, stored.id));

    return this.issueTokens({
      userId: user.id,
      hospitalId: user.hospitalId,
      email: user.email,
      role: user.role,
      hospitalName: hospital?.name ?? "Hospital"
    });
  }

  async logout(userId: string, refreshToken: string) {
    const tokenHash = await hashToken(refreshToken);
    await this.db
      .update(refreshTokens)
      .set({ revokedAt: new Date() })
      .where(and(eq(refreshTokens.userId, userId), eq(refreshTokens.tokenHash, tokenHash), isNull(refreshTokens.revokedAt)));
    return { ok: true };
  }

  private async issueTokens(payload: {
    userId: string;
    hospitalId: string;
    email: string;
    role: string;
    hospitalName: string;
  }) {
    const { hospitalName, ...tokenPayload } = payload;
    const token = sign(tokenPayload, this.config.get<string>("JWT_SECRET") ?? "dev-secret-change-me", {
      expiresIn: "15m"
    });
    const refreshToken = randomBytes(48).toString("base64url");
    const refreshTokenExpiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 14);

    await this.db.insert(refreshTokens).values({
      userId: payload.userId,
      hospitalId: payload.hospitalId,
      tokenHash: await hashToken(refreshToken),
      expiresAt: refreshTokenExpiresAt
    });

    return {
      token,
      refreshToken,
      refreshTokenExpiresAt: refreshTokenExpiresAt.toISOString(),
      user: tokenPayload,
      hospital: {
        id: payload.hospitalId,
        name: hospitalName
      }
    };
  }
}

async function hashToken(token: string) {
  const { createHash } = await import("crypto");
  return createHash("sha256").update(token).digest("hex");
}
