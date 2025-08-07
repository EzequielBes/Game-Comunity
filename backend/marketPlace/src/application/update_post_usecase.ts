import { PostRepository } from "../infra/database/repository/postRepository";

export class UpdatePost {
  constructor(readonly databaseConnection: PostRepository) {}

  async execute(input: UpdatePostInput) {
    const existingPost = await this.databaseConnection.getPostById(input.post_id);
    if (!existingPost) {
      throw new Error("Post not found");
    }

    if (existingPost.seller_id !== input.seller_id) {
      throw new Error("Unauthorized to update this post");
    }

    await this.databaseConnection.updatePost(input);
    return "Post updated successfully";
  }
}

export interface UpdatePostInput {
  post_id: string;
  seller_id: string;
  title?: string;
  description?: string;
  price?: number;
  category?: string;
  images?: string[];
  status?: 'active' | 'sold' | 'inactive';
}
