import { PreferenceRepository } from '../../../application/repository/preferenceRepository';
import { Preference } from '../../../domain/entity/preference';
import { PostgresDatabase } from '../databaseConnection/database';

export class PreferenceRepositoryDatabase implements PreferenceRepository {
  private db: PostgresDatabase;

  constructor(db: PostgresDatabase) {
    this.db = db;
  }

  async save(preference: Preference): Promise<void> {
    await this.db.query(
      'INSERT INTO user_marketplace_preferences (preference_id, user_id, type, value, created_at) VALUES ($1, $2, $3, $4, $5)',
      [
        preference.preference_id,
        preference.user_id,
        preference.type,
        preference.value,
        preference.created_at,
      ]
    );
  }

  async getByUserId(userId: string): Promise<Preference[]> {
    const preferencesData = await this.db.query(
      'SELECT * FROM user_marketplace_preferences WHERE user_id = $1',
      [userId]
    );
    return preferencesData.map((pref: any) =>
      Preference.restore(pref.preference_id, pref.user_id, pref.type, pref.value, pref.created_at)
    );
  }

  async delete(preferenceId: string): Promise<void> {
    await this.db.query('DELETE FROM user_marketplace_preferences WHERE preference_id = $1', [preferenceId]);
  }
}
