import { Injectable } from "@nestjs/common";
import { UsersService } from "../users/users.service";
import { ChallengesService } from "../challenges/challenges.service";
import { PostsService } from "../posts/posts.service";

export interface SearchResult {
  users: any[];
  challenges: any[];
  posts: any[];
}

export interface SearchOptions {
  query: string;
  type?: "ALL" | "USERS" | "CHALLENGES" | "POSTS";
  filters?: {
    category?: string;
    status?: string;
    dateRange?: {
      start: Date;
      end: Date;
    };
  };
  sort?: {
    field: string;
    order: "ASC" | "DESC";
  };
  page?: number;
  limit?: number;
}

@Injectable()
export class SearchService {
  constructor(
    private readonly usersService: UsersService,
    private readonly challengesService: ChallengesService,
    private readonly postsService: PostsService
  ) {}

  async search(query: string): Promise<SearchResult> {
    const [users, challenges, posts] = await Promise.all([
      this.searchUsers(query),
      this.searchChallenges(query),
      this.searchPosts(query),
    ]);

    return {
      users,
      challenges,
      posts,
    };
  }

  private async searchUsers(query: string): Promise<any[]> {
    const users = await this.usersService.findAll();
    return users.filter((user) => {
      const searchableText = [user.username, user.email, user.bio]
        .join(" ")
        .toLowerCase();

      return searchableText.includes(query.toLowerCase());
    });
  }

  private async searchChallenges(query: string): Promise<any[]> {
    const challenges = await this.challengesService.findAll();
    return challenges.filter((challenge) => {
      const searchableText = [
        challenge.title,
        challenge.description,
        challenge.categories.join(" "),
      ]
        .join(" ")
        .toLowerCase();

      return searchableText.includes(query.toLowerCase());
    });
  }

  private async searchPosts(query: string): Promise<any[]> {
    const posts = await this.postsService.findAll();
    return posts.filter((post) => {
      const searchableText = [post.content, post.tags.join(" ")]
        .join(" ")
        .toLowerCase();

      return searchableText.includes(query.toLowerCase());
    });
  }

  async searchUsers(
    query: string,
    filters?: any,
    sort?: any,
    page = 1,
    limit = 10
  ) {
    return this.usersService.search({
      query,
      filters,
      sort,
      skip: (page - 1) * limit,
      limit,
    });
  }

  async searchChallenges(
    query: string,
    filters?: any,
    sort?: any,
    page = 1,
    limit = 10
  ) {
    return this.challengesService.search({
      query,
      filters,
      sort,
      skip: (page - 1) * limit,
      limit,
    });
  }

  async searchPosts(
    query: string,
    filters?: any,
    sort?: any,
    page = 1,
    limit = 10
  ) {
    return this.postsService.search({
      query,
      filters,
      sort,
      skip: (page - 1) * limit,
      limit,
    });
  }
}
