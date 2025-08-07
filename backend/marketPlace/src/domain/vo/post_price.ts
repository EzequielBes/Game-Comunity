export class PostPrice {
  private value: number;

  constructor(price: number) {
    if (price <= 0) {
      throw new Error("Price must be greater than 0");
    }
    if (price > 999999.99) {
      throw new Error("Price must be less than 1,000,000");
    }
    this.value = price;
  }

  getValue() {
    return this.value;
  }
}
