

export class Username {
  private value: string
  constructor(username:string) {
    if(!username.match(/[0-9a-zA-Z$*&@#]{3,}/gm)) throw new Error("This nickname is not available")
      this.value = username
  }

  getValue () {
    return this.value
  }
}
