import { Body, Controller, Get, Patch, Post, Query } from "@nestjs/common";
import { CreateIndoorAssetDto, UpdateIndoorAssetDto } from "./indoor.dto";
import { IndoorService } from "./indoor.service";
import { PaginationQueryDto } from "../common/pagination.dto";
import { CurrentUser } from "../common/current-user.decorator";
import { AuthenticatedUser } from "../common/auth.types";
import { Roles } from "../common/roles.decorator";

@Controller("indoor")
export class IndoorController {
  constructor(private readonly indoor: IndoorService) {}

  @Get("assets")
  @Roles("owner", "admin", "doctor", "nurse", "reception")
  assets(@Query() query: PaginationQueryDto, @CurrentUser() user: AuthenticatedUser) {
    return this.indoor.assets(query, user.hospitalId);
  }

  @Post("assets")
  @Roles("owner", "admin", "nurse")
  createAsset(@Body() asset: CreateIndoorAssetDto, @CurrentUser() user: AuthenticatedUser) {
    return this.indoor.createAsset(asset, user.hospitalId);
  }

  @Patch("assets")
  @Roles("owner", "admin", "nurse")
  updateAsset(@Body() asset: UpdateIndoorAssetDto, @CurrentUser() user: AuthenticatedUser) {
    return this.indoor.updateAsset(asset, user.hospitalId);
  }
}
