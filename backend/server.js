const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// In-memory database
let users = [
  {
    id: uuidv4(),
    nom: 'Bahou',
    prenom: 'Houdaifa',
    email: 'bahouhoudaifa@gmail.ma',
    role: 'Administrateur',
    statut: 'actif',
    dateCreation: new Date('2024-01-15').toISOString(),
  },
  {
    id: uuidv4(),
    nom: 'Moutaouali',
    prenom: 'Mouhssine',
    email: 'mouhssine.moutaouali@rca.ma',
    role: 'Éditeur',
    statut: 'actif',
    dateCreation: new Date('2024-02-20').toISOString(),
  },
  {
    id: uuidv4(),
    nom: 'Moustaoudaa',
    prenom: 'Mustapha',
    email: 'mustapha.moustaoudaa@rca.ma',
    role: 'Lecteur',
    statut: 'inactif',
    dateCreation: new Date('2024-03-10').toISOString(),
  },
];

// GET all users
app.get('/api/users', (req, res) => {
  res.json({ success: true, data: users, total: users.length });
});

// GET single user
app.get('/api/users/:id', (req, res) => {
  const user = users.find(u => u.id === req.params.id);
  if (!user) return res.status(404).json({ success: false, message: 'Utilisateur non trouvé' });
  res.json({ success: true, data: user });
});

// POST create user
app.post('/api/users', (req, res) => {
  const { nom, prenom, email, role, statut } = req.body;
  if (!nom || !prenom || !email) {
    return res.status(400).json({ success: false, message: 'Nom, prénom et email sont obligatoires' });
  }
  const emailExists = users.find(u => u.email === email);
  if (emailExists) {
    return res.status(400).json({ success: false, message: 'Cet email est déjà utilisé' });
  }
  const newUser = {
    id: uuidv4(),
    nom,
    prenom,
    email,
    role: role || 'Lecteur',
    statut: statut || 'actif',
    dateCreation: new Date().toISOString(),
  };
  users.push(newUser);
  res.status(201).json({ success: true, data: newUser, message: 'Utilisateur créé avec succès' });
});

// PUT update user
app.put('/api/users/:id', (req, res) => {
  const index = users.findIndex(u => u.id === req.params.id);
  if (index === -1) return res.status(404).json({ success: false, message: 'Utilisateur non trouvé' });

  const { nom, prenom, email, role, statut } = req.body;
  if (email) {
    const emailExists = users.find(u => u.email === email && u.id !== req.params.id);
    if (emailExists) {
      return res.status(400).json({ success: false, message: 'Cet email est déjà utilisé' });
    }
  }
  users[index] = { ...users[index], nom, prenom, email, role, statut };
  res.json({ success: true, data: users[index], message: 'Utilisateur mis à jour avec succès' });
});

// DELETE user
app.delete('/api/users/:id', (req, res) => {
  const index = users.findIndex(u => u.id === req.params.id);
  if (index === -1) return res.status(404).json({ success: false, message: 'Utilisateur non trouvé' });
  users.splice(index, 1);
  res.json({ success: true, message: 'Utilisateur supprimé avec succès' });
});

app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
