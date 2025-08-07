import { Preference } from '../../domain/entity/preference';

export interface PreferenceRepository {
  save(preference: Preference): Promise<void>;
  getByUserId(userId: string): Promise<Preference[]>;
  delete(preferenceId: string): Promise<void>;
}
