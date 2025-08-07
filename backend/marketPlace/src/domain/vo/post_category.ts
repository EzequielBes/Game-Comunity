export class PostCategory {
  private value: string;
  private static validCategories = [
    'electronics',
    'clothing',
    'books',
    'sports',
    'home',
    'automotive',
    'toys',
    'health',
    'beauty',
    'other'
  ];

  constructor(category: string) {
    const normalizedCategory = category.toLowerCase().trim();
    if (!PostCategory.validCategories.includes(normalizedCategory)) {
      throw new Error(`Invalid category. Valid categories are: ${PostCategory.validCategories.join(', ')}`);
    }
    this.value = normalizedCategory;
  }

  getValue() {
    return this.value;
  }

  static getValidCategories() {
    return [...PostCategory.validCategories];
  }
}
