import { Post } from "../../../domain/entity/post";
import { DatabaseConnection } from "../databaseConnection/database";
import { GetPostsFilters } from "../../../application/get_posts_usecase";
import { UpdatePostInput } from "../../../application/update_post_usecase";

export interface PostRepository {
  savePost(post: Post): Promise<void>;
  getPosts(filters?: GetPostsFilters): Promise<Post[]>;
  getPostById(post_id: string): Promise<Post | undefined>;
  updatePost(input: UpdatePostInput): Promise<void>;
  deletePost(post_id: string): Promise<void>;
  getPostsBySeller(seller_id: string): Promise<Post[]>;
}

export class PostRepositoryDatabase implements PostRepository {
  constructor(readonly databaseConnection: DatabaseConnection) {}

  async savePost(post: Post): Promise<void> {
    await this.databaseConnection.query(
      'INSERT INTO "marketplace_posts" (post_id, title, description, price, category, rarity, condition, tradeable, seller_id, images, status, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)',
      [
        post.post_id,
        post.getTitle(),
        post.getDescription(),
        post.getPrice(),
        post.getCategory(),
        post.getRarity(),
        post.getCondition(),
        post.tradeable,
        post.seller_id,
        JSON.stringify(post.getImages()),
        post.getStatus(),
        post.created_at,
        post.updated_at
      ]
    );
  }

  async getPosts(filters?: GetPostsFilters): Promise<Post[]> {
    let query = 'SELECT * FROM "marketplace_posts" WHERE status = $1';
    let params: any[] = ['active'];
    let paramIndex = 2;

    if (filters?.category) {
      query += ` AND category = $${paramIndex}`;
      params.push(filters.category);
      paramIndex++;
    }

    if (filters?.minPrice) {
      query += ` AND price >= $${paramIndex}`;
      params.push(filters.minPrice);
      paramIndex++;
    }

    if (filters?.maxPrice) {
      query += ` AND price <= $${paramIndex}`;
      params.push(filters.maxPrice);
      paramIndex++;
    }

    if (filters?.seller_id) {
      query += ` AND seller_id = $${paramIndex}`;
      params.push(filters.seller_id);
      paramIndex++;
    }

    if (filters?.search) {
      query += ` AND (title ILIKE ${paramIndex} OR description ILIKE ${paramIndex + 1})`;
      const searchTerm = `%${filters.search}%`;
      params.push(searchTerm);
      params.push(searchTerm);
      paramIndex += 2;
    }

    query += ' ORDER BY created_at DESC';

    if (filters?.limit) {
      query += ` LIMIT $${paramIndex}`;
      params.push(filters.limit);
      paramIndex++;
    }

    if (filters?.offset) {
      query += ` OFFSET $${paramIndex}`;
      params.push(filters.offset);
    }

    const postsData = await this.databaseConnection.query(query, params);

    return postsData.map((postData: any) =>
      Post.restore(
        postData.post_id,
        postData.title,
        postData.description,
        postData.price,
        postData.category,
        postData.rarity,
        postData.condition,
        postData.tradeable,
        postData.seller_id,
        JSON.parse(postData.images || '[]'),
        postData.status,
        new Date(postData.created_at),
        new Date(postData.updated_at)
      )
    );
  }

  async getPostById(post_id: string): Promise<Post | undefined> {
    const [postData] = await this.databaseConnection.query(
      'SELECT * FROM "marketplace_posts" WHERE post_id = $1',
      [post_id]
    );

    if (!postData) return undefined;

    return Post.restore(
      postData.post_id,
      postData.title,
      postData.description,
      postData.price,
      postData.category,
      postData.rarity,
      postData.condition,
      postData.tradeable,
      postData.seller_id,
      JSON.parse(postData.images || '[]'),
      postData.status,
      new Date(postData.created_at),
      new Date(postData.updated_at)
    );
  }

  async updatePost(input: UpdatePostInput): Promise<void> {
    const updateFields: string[] = [];
    const params: any[] = [];
    let paramIndex = 1;

    if (input.title !== undefined) {
      updateFields.push(`title = $${paramIndex}`);
      params.push(input.title);
      paramIndex++;
    }

    if (input.description !== undefined) {
      updateFields.push(`description = $${paramIndex}`);
      params.push(input.description);
      paramIndex++;
    }

    if (input.price !== undefined) {
      updateFields.push(`price = $${paramIndex}`);
      params.push(input.price);
      paramIndex++;
    }

    if (input.category !== undefined) {
      updateFields.push(`category = $${paramIndex}`);
      params.push(input.category);
      paramIndex++;
    }

    if (input.images !== undefined) {
      updateFields.push(`images = $${paramIndex}`);
      params.push(JSON.stringify(input.images));
      paramIndex++;
    }

    if (input.status !== undefined) {
      updateFields.push(`status = $${paramIndex}`);
      params.push(input.status);
      paramIndex++;
    }

    updateFields.push(`updated_at = $${paramIndex}`);
    params.push(new Date());
    paramIndex++;

    params.push(input.post_id);

    const query = `UPDATE "marketplace_posts" SET ${updateFields.join(', ')} WHERE post_id = $${paramIndex}`;
    await this.databaseConnection.query(query, params);
  }

  async deletePost(post_id: string): Promise<void> {
    await this.databaseConnection.query(
      'DELETE FROM "marketplace_posts" WHERE post_id = $1',
      [post_id]
    );
  }

  async getPostsBySeller(seller_id: string): Promise<Post[]> {
    const postsData = await this.databaseConnection.query(
      'SELECT * FROM "marketplace_posts" WHERE seller_id = $1 ORDER BY created_at DESC',
      [seller_id]
    );

    return postsData.map((postData: any) =>
      Post.restore(
        postData.post_id,
        postData.title,
        postData.description,
        postData.price,
        postData.category,
        postData.rarity,
        postData.condition,
        postData.tradeable,
        postData.seller_id,
        JSON.parse(postData.images || '[]'),
        postData.status,
        new Date(postData.created_at),
        new Date(postData.updated_at)
      )
    );
  }
}
