import { Post } from "../domain/entity/post";
import { PostRepository } from "../infra/database/repository/postRepository";

export class CreatePost {
  constructor(readonly databaseConnection: PostRepository) {}

  async execute(input: CreatePostInput) {
    const post = Post.create(
      input.title,
      input.description,
      input.price,
      input.category,
      input.rarity,
      input.condition,
      input.tradeable,
      input.seller_id,
      input.images || []
    );

    await this.databaseConnection.savePost(post);
    return "Post created successfully";
  }
}

export interface CreatePostInput {
  title: string;
  description: string;
  price: number;
  category: string;
  rarity: string;
  condition: string;
  tradeable: boolean;
  seller_id: string;
  images?: string[];
}
