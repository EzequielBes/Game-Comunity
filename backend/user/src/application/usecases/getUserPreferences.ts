import { Preference } from '../../domain/entity/preference';
import { PreferenceRepository } from '../repository/preferenceRepository';

export class GetUserPreferences {
  constructor(readonly preferenceRepository: PreferenceRepository) {}

  async execute(userId: string): Promise<Preference[]> {
    return this.preferenceRepository.getByUserId(userId);
  }
}
