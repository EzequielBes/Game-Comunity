import { v4 as uuidv4 } from 'uuid';
import { PostTitle } from '../vo/post_title';
import { PostDescription } from '../vo/post_description';
import { PostPrice } from '../vo/post_price';
import { PostCategory } from '../vo/post_category';
import { PostRarity } from '../vo/post_rarity';
import { PostCondition } from '../vo/post_condition';

export class Post {
  private constructor(
    readonly post_id: string,
    readonly title: PostTitle,
    readonly description: PostDescription,
    readonly price: PostPrice,
    readonly category: PostCategory,
    readonly rarity: PostRarity,
    readonly condition: PostCondition,
    readonly tradeable: boolean,
    readonly seller_id: string,
    readonly images: string[],
    readonly status: 'active' | 'sold' | 'inactive',
    readonly created_at: Date,
    readonly updated_at: Date
  ) {}

  static create(
    title: string,
    description: string,
    price: number,
    category: string,
    rarity: string,
    condition: string,
    tradeable: boolean,
    seller_id: string,
    images: string[] = []
  ) {
    const post_id = uuidv4();
    return new Post(
      post_id,
      new PostTitle(title),
      new PostDescription(description),
      new PostPrice(price),
      new PostCategory(category),
      new PostRarity(rarity),
      new PostCondition(condition),
      tradeable,
      seller_id,
      images,
      'active',
      new Date(),
      new Date()
    );
  }

  static restore(
    post_id: string,
    title: string,
    description: string,
    price: number,
    category: string,
    rarity: string,
    condition: string,
    tradeable: boolean,
    seller_id: string,
    images: string[],
    status: 'active' | 'sold' | 'inactive',
    created_at: Date,
    updated_at: Date
  ) {
    return new Post(
      post_id,
      new PostTitle(title),
      new PostDescription(description),
      new PostPrice(price),
      new PostCategory(category),
      new PostRarity(rarity),
      new PostCondition(condition),
      tradeable,
      seller_id,
      images,
      status,
      created_at,
      updated_at
    );
  }

  getTitle() {
    return this.title.getValue();
  }

  getDescription() {
    return this.description.getValue();
  }

  getPrice() {
    return this.price.getValue();
  }

  getCategory() {
    return this.category.getValue();
  }

  getRarity() {
    return this.rarity.getValue();
  }

  getCondition() {
    return this.condition.getValue();
  }

  getImages() {
    return this.images;
  }

  getStatus() {
    return this.status;
  }
}
