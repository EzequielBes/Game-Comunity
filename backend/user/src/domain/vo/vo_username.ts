

export class Name {
  private value: string
  constructor(username: string) {
    if(!username.match(/^[a-zA-Z\s]{3,50}$/gm)) throw new Error("Invalid Name");
    this.value = username
  }

  getValue () {
    return this.value
  }
}
