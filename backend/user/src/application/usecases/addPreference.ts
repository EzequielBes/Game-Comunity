import { Preference } from '../../domain/entity/preference';
import { PreferenceRepository } from '../repository/preferenceRepository';

export class AddPreference {
  constructor(readonly preferenceRepository: PreferenceRepository) {}

  async execute(input: AddPreferenceInput): Promise<void> {
    const preference = Preference.create(input.userId, input.type, input.value);
    await this.preferenceRepository.save(preference);
  }
}

export interface AddPreferenceInput {
  userId: string;
  type: string;
  value: string;
}
