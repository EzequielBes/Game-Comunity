import { PreferenceRepository } from '../repository/preferenceRepository';

export class RemovePreference {
  constructor(readonly preferenceRepository: PreferenceRepository) {}

  async execute(preferenceId: string): Promise<void> {
    await this.preferenceRepository.delete(preferenceId);
  }
}
