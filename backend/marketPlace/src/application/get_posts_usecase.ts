import { PostRepository } from "../infra/database/repository/postRepository";

export class GetPosts {
  constructor(readonly databaseConnection: PostRepository) {}

  async execute(filters?: GetPostsFilters) {
    const posts = await this.databaseConnection.getPosts(filters);
    return posts;
  }
}

export interface GetPostsFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  seller_id?: string;
  search?: string;
  limit?: number;
  offset?: number;
  post_id?: string;
}
