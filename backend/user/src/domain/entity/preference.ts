import { v4 as uuidv4 } from 'uuid';

export class Preference {
  private constructor(
    readonly preference_id: string,
    readonly user_id: string,
    readonly type: string,
    readonly value: string,
    readonly created_at: Date
  ) {}

  static create(
    user_id: string,
    type: string,
    value: string
  ) {
    const preference_id = uuidv4();
    return new Preference(
      preference_id,
      user_id,
      type,
      value,
      new Date()
    );
  }

  static restore(
    preference_id: string,
    user_id: string,
    type: string,
    value: string,
    created_at: Date
  ) {
    return new Preference(
      preference_id,
      user_id,
      type,
      value,
      created_at
    );
  }
}
