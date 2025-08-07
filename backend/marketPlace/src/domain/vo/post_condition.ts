export class PostCondition {
  private readonly value: string;

  constructor(value: string) {
    if (!value) throw new Error("Condition is required");
    this.value = value;
  }

  getValue() {
    return this.value;
  }
}
