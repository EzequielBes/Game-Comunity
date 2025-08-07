import { PostRepository } from "../infra/database/repository/postRepository";

export class GetPostById {
  constructor(readonly postRepository: PostRepository) {}

  async execute(post_id: string): Promise<any> {
    const post = await this.postRepository.getPostById(post_id);
    return post;
  }
}
