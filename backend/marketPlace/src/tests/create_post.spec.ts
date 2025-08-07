import { Post } from "../domain/entity/post";
import { PostCategory } from "../domain/vo/post_category";

describe("Post Entity", () => {
  test("Deve criar um post válido", () => {
    const post = Post.create(
      "iPhone 13 Pro",
      "iPhone 13 Pro em excelente estado, 128GB",
      4500.00,
      "electronics",
      "Rare",
      "New",
      true,
      "user123",
      ["url1", "url2"]
    );

    expect(post.getTitle()).toBe("iPhone 13 Pro");
    expect(post.getDescription()).toBe("iPhone 13 Pro em excelente estado, 128GB");
    expect(post.getPrice()).toBe(4500.00);
    expect(post.getCategory()).toBe("electronics");
    expect(post.getRarity()).toBe("Rare");
    expect(post.getCondition()).toBe("New");
    expect(post.tradeable).toBe(true);
    expect(post.seller_id).toBe("user123");
    expect(post.getImages()).toEqual(["url1", "url2"]);
    expect(post.getStatus()).toBe("active");
  });

  test("Deve restaurar um post do banco de dados", () => {
    const post = Post.restore(
      "post123",
      "iPhone 13 Pro",
      "iPhone 13 Pro em excelente estado, 128GB",
      4500.00,
      "electronics",
      "Rare",
      "New",
      true,
      "user123",
      ["url1", "url2"],
      "active",
      new Date("2024-01-01"),
      new Date("2024-01-01")
    );

    expect(post.post_id).toBe("post123");
    expect(post.getTitle()).toBe("iPhone 13 Pro");
    expect(post.getPrice()).toBe(4500.00);
  });
});

describe("PostCategory Value Object", () => {
  test("Deve aceitar categorias válidas", () => {
    const validCategories = [
      "electronics",
      "clothing",
      "books",
      "sports",
      "home",
      "automotive",
      "toys",
      "health",
      "beauty",
      "other"
    ];

    validCategories.forEach(category => {
      const postCategory = new PostCategory(category);
      expect(postCategory.getValue()).toBe(category);
    });
  });

  test("Deve rejeitar categorias inválidas", () => {
    expect(() => new PostCategory("invalid_category")).toThrow();
  });

  test("Deve normalizar categorias", () => {
    const postCategory = new PostCategory("ELECTRONICS");
    expect(postCategory.getValue()).toBe("electronics");
  });

  test("Deve retornar categorias válidas", () => {
    const validCategories = PostCategory.getValidCategories();
    expect(validCategories).toContain("electronics");
    expect(validCategories).toContain("clothing");
  });
});
