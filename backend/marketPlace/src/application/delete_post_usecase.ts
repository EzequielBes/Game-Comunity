import { PostRepository } from "../infra/database/repository/postRepository";

export class DeletePost {
  constructor(readonly databaseConnection: PostRepository) {}

  async execute(input: DeletePostInput) {
    const existingPost = await this.databaseConnection.getPostById(input.post_id);
    if (!existingPost) {
      throw new Error("Post not found");
    }

    if (existingPost.seller_id !== input.seller_id) {
      throw new Error("Unauthorized to delete this post");
    }

    await this.databaseConnection.deletePost(input.post_id);
    return "Post deleted successfully";
  }
}

export interface DeletePostInput {
  post_id: string;
  seller_id: string;
}
