export class PostDescription {
  private value: string;

  constructor(description: string) {
    if (!description || description.trim().length < 10) {
      throw new Error("Description must be at least 10 characters long");
    }
    if (description.length > 1000) {
      throw new Error("Description must be less than 1000 characters");
    }
    this.value = description.trim();
  }

  getValue() {
    return this.value;
  }
}
