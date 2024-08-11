import { CryptoPassword } from "../../utils/generageHashedPassword";


export class Password {
  private value: string
  constructor(password: string) {
    // if(!password.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[$*&@#])[0-9a-zA-Z$*&@#]{8,}$/)) throw new Error("Invalid password");
    this.value = password
  }

  getValue () {
    return this.value
  }
}
