const BASE_URL = '/api';

export const userService = {
  getAll: async () => {
    const res = await fetch(`${BASE_URL}/users`);
    if (!res.ok) throw new Error('Erreur lors du chargement');
    return res.json();
  },

  getById: async (id) => {
    const res = await fetch(`${BASE_URL}/users/${id}`);
    if (!res.ok) throw new Error('Utilisateur non trouvé');
    return res.json();
  },

  create: async (data) => {
    const res = await fetch(`${BASE_URL}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || 'Erreur lors de la création');
    return json;
  },

  update: async (id, data) => {
    const res = await fetch(`${BASE_URL}/users/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || 'Erreur lors de la mise à jour');
    return json;
  },

  delete: async (id) => {
    const res = await fetch(`${BASE_URL}/users/${id}`, { method: 'DELETE' });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || 'Erreur lors de la suppression');
    return json;
  },
};
