'use client';

import React, { useState, useEffect } from 'react';
import { getUserPreferences, addPreference, removePreference, Preference, AddPreferenceData } from '../../../gateway/preferences';
import { withAuth } from '../../../components/withAuth';
import { useAuth } from '../../../contexts/AuthContext';

function PreferencesPage() {
  const { user } = useAuth();
  const [preferences, setPreferences] = useState<Preference[]>([]);
  const [newPreference, setNewPreference] = useState({ type: 'keyword', value: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchPreferences();
    }
  }, [user]);

  const fetchPreferences = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const prefs = await getUserPreferences(user.account_id);
      setPreferences(prefs);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddPreference = async () => {
    if (!newPreference.value || !user) return;
    setLoading(true);
    setError(null);

    const data: AddPreferenceData = {
      userId: user.account_id,
      type: newPreference.type,
      value: newPreference.value,
    };

    try {
      await addPreference(data);
      setNewPreference({ type: 'keyword', value: '' });
      fetchPreferences(); // Refresh the list
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRemovePreference = async (preferenceId: string) => {
    setLoading(true);
    setError(null);

    try {
      await removePreference(preferenceId);
      fetchPreferences(); // Refresh the list
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cozy-background text-cozy-text p-8 font-cozy">
      <div className="max-w-2xl mx-auto bg-cozy-card rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-cozy-title mb-6">Preferências do Marketplace</h1>

        {loading && <p>Carregando...</p>}
        {error && <p className="text-red-500">{error}</p>}

        <div className="space-y-4 mb-8">
          {preferences.map(pref => (
            <div key={pref.preference_id} className="flex items-center justify-between bg-cozy-input p-4 rounded-lg">
              <div>
                <span className="font-semibold capitalize">{pref.type}: </span>
                <span>{pref.value}</span>
              </div>
              <button
                onClick={() => handleRemovePreference(pref.preference_id)}
                className="text-red-500 hover:text-red-700"
                disabled={loading}
              >
                Remover
              </button>
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-cozy-title">Adicionar Nova Preferência</h2>
          <div className="flex items-center space-x-4">
            <select
              value={newPreference.type}
              onChange={(e) => setNewPreference({ ...newPreference, type: e.target.value })}
              className="px-4 py-2 bg-cozy-input border border-cozy-border rounded-md focus:outline-none focus:ring-2 focus:ring-cozy-highlight"
            >
              <option value="keyword">Palavra-chave</option>
              <option value="rarity">Raridade</option>
              <option value="category">Categoria</option>
            </select>
            <input
              type="text"
              value={newPreference.value}
              onChange={(e) => setNewPreference({ ...newPreference, value: e.target.value })}
              placeholder="Digite o valor..."
              className="w-full px-4 py-2 bg-cozy-input border border-cozy-border rounded-md focus:outline-none focus:ring-2 focus:ring-cozy-highlight"
            />
          </div>
          <button
            onClick={handleAddPreference}
            disabled={loading}
            className="w-full px-6 py-3 bg-cozy-primary text-white font-bold rounded-md hover:bg-opacity-90 transition-transform transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Adicionando...' : 'Adicionar'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default withAuth(PreferencesPage);
