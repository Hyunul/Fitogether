import { Controller, Get, Query, UseGuards } from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from "@nestjs/swagger";
import { FirebaseAuthGuard } from "../auth/firebase-auth.guard";
import { SearchService, SearchOptions } from "./search.service";

@ApiTags("search")
@Controller("search")
@UseGuards(FirebaseAuthGuard)
@ApiBearerAuth()
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get()
  @ApiOperation({ summary: "통합 검색" })
  @ApiResponse({ status: 200, description: "검색 결과를 반환합니다." })
  search(@Query("q") query: string) {
    return this.searchService.search(query);
  }

  @Get("users")
  @ApiOperation({ summary: "사용자 검색" })
  @ApiResponse({ status: 200, description: "사용자 검색 결과를 반환합니다." })
  async searchUsers(
    @Query("query") query: string,
    @Query("category") category?: string,
    @Query("sortField") sortField?: string,
    @Query("sortOrder") sortOrder?: "ASC" | "DESC",
    @Query("page") page?: number,
    @Query("limit") limit?: number
  ) {
    const filters = category ? { category } : undefined;
    const sort =
      sortField && sortOrder
        ? { field: sortField, order: sortOrder }
        : undefined;

    return this.searchService.searchUsers(query, filters, sort, page, limit);
  }

  @Get("challenges")
  @ApiOperation({ summary: "챌린지 검색" })
  @ApiResponse({ status: 200, description: "챌린지 검색 결과를 반환합니다." })
  async searchChallenges(
    @Query("query") query: string,
    @Query("category") category?: string,
    @Query("status") status?: string,
    @Query("sortField") sortField?: string,
    @Query("sortOrder") sortOrder?: "ASC" | "DESC",
    @Query("page") page?: number,
    @Query("limit") limit?: number
  ) {
    const filters: SearchOptions["filters"] = {};
    if (category) filters.category = category;
    if (status) filters.status = status;

    const sort =
      sortField && sortOrder
        ? { field: sortField, order: sortOrder }
        : undefined;

    return this.searchService.searchChallenges(
      query,
      filters,
      sort,
      page,
      limit
    );
  }

  @Get("posts")
  @ApiOperation({ summary: "게시물 검색" })
  @ApiResponse({ status: 200, description: "게시물 검색 결과를 반환합니다." })
  async searchPosts(
    @Query("query") query: string,
    @Query("category") category?: string,
    @Query("startDate") startDate?: string,
    @Query("endDate") endDate?: string,
    @Query("sortField") sortField?: string,
    @Query("sortOrder") sortOrder?: "ASC" | "DESC",
    @Query("page") page?: number,
    @Query("limit") limit?: number
  ) {
    const filters: SearchOptions["filters"] = {};
    if (category) filters.category = category;
    if (startDate && endDate) {
      filters.dateRange = {
        start: new Date(startDate),
        end: new Date(endDate),
      };
    }

    const sort =
      sortField && sortOrder
        ? { field: sortField, order: sortOrder }
        : undefined;

    return this.searchService.searchPosts(query, filters, sort, page, limit);
  }
}
