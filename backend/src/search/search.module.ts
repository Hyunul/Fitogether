import { Module } from "@nestjs/common";
import { SearchController } from "./search.controller";
import { SearchService } from "./search.service";
import { UsersModule } from "../users/users.module";
import { ChallengesModule } from "../challenges/challenges.module";
import { PostsModule } from "../posts/posts.module";

@Module({
  imports: [UsersModule, ChallengesModule, PostsModule],
  controllers: [SearchController],
  providers: [SearchService],
  exports: [SearchService],
})
export class SearchModule {}
