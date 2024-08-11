import { Username } from './../vo/vo_nickname';
import { Password } from './../vo/vo_password';
import { Email } from './../vo/vo_email';

import { Name } from './../vo/vo_username';
import { v4 as uuidv4 } from 'uuid';
import { CryptoPassword } from '../../utils/generageHashedPassword';

export class Account {

  private constructor(
   readonly account_id: string,
   readonly name: Name,
   readonly username: Username,
   readonly email: Email,
   readonly password: Password
  ) {}

  static create(
    name:string, username:string, email:string, password:string
  ) {
    const account_id = uuidv4()
    return new Account(account_id, new Name(name), new Username(username), new Email(email), new Password(password))
  }

  static restore (account_id:string, name:string, username:string, email:string, password:string) {
    return new Account(account_id, new Name(name), new Username(username), new Email(email), new Password(password))
  }

  getEmail () {
    return this.email.getValue()
  }
  getUsername() {
    return this.username.getValue()
  }
 async getPassword() {
    const crypt = CryptoPassword.encrypt(this.password.getValue())
    console.log(crypt)
    return await crypt
  }
  getName() {
    return this.name.getValue()
  }
}




