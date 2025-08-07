export class PostRarity {
  private readonly value: string;

  constructor(value: string) {
    if (!value) throw new Error("Rarity is required");
    this.value = value;
  }

  getValue() {
    return this.value;
  }
}
