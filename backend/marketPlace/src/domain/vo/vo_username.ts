

export class Name {
  private value: string
  constructor(username: string) {
    if(!username.match(/^[a-zA-Z]{3,20}$/gm)) throw new Error("Invalid Name");
    this.value = username
  }

  getValue () {
    return this.value
  }
}
