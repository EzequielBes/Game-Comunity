

export class Email {
  private value: string
  constructor(email: string) {
    if(!email.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)) throw new Error("Email not valid");
    this.value = email
  }

  getValue () {
    return this.value
  }
}
