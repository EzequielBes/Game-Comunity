export class PostTitle {
  private value: string;

  constructor(title: string) {
    if (!title || title.trim().length < 3) {
      throw new Error("Title must be at least 3 characters long");
    }
    if (title.length > 100) {
      throw new Error("Title must be less than 100 characters");
    }
    this.value = title.trim();
  }

  getValue() {
    return this.value;
  }
}
