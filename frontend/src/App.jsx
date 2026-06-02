import { useState, useEffect, useCallback } from 'react';
import { userService } from './api';
import UserModal from './UserModal';
import ConfirmDialog from './ConfirmDialog';
import Toast from './Toast';
import logo from './assets/logo.png';

const ROLE_COLORS = {
  'Administrateur': { bg: '#fdf0ef', color: '#c0392b', dot: '#e74c3c' },
  'Éditeur':        { bg: '#eaf4fb', color: '#2471a3', dot: '#2e86c1' },
  'Modérateur':     { bg: '#fdf5e6', color: '#d35400', dot: '#e67e22' },
  'Lecteur':        { bg: '#f0f3f4', color: '#566573', dot: '#85929e' },
};

function Avatar({ prenom, nom }) {
  const initials = `${prenom?.[0] ?? ''}${nom?.[0] ?? ''}`.toUpperCase();
  const hue = ((prenom?.charCodeAt(0) ?? 0) * 37 + (nom?.charCodeAt(0) ?? 0) * 13) % 360;
  return (
    <div style={{
      width: '38px', height: '38px', borderRadius: '50%', flexShrink: 0,
      background: `hsl(${hue}, 45%, 88%)`, color: `hsl(${hue}, 40%, 38%)`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: '13px', fontWeight: 700, letterSpacing: '0.02em',
    }}>
      {initials}
    </div>
  );
}

function RoleBadge({ role }) {
  const c = ROLE_COLORS[role] || ROLE_COLORS['Lecteur'];
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '5px',
      padding: '3px 10px', borderRadius: '20px',
      background: c.bg, color: c.color, fontSize: '12px', fontWeight: 600,
    }}>
      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: c.dot, display: 'inline-block' }} />
      {role}
    </span>
  );
}

function StatutBadge({ statut }) {
  const isActif = statut === 'actif';
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '5px',
      padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 600,
      background: isActif ? 'var(--success-bg)' : 'var(--paper-warm)',
      color: isActif ? 'var(--success)' : 'var(--ink-muted)',
    }}>
      <span style={{
        width: '6px', height: '6px', borderRadius: '50%', display: 'inline-block',
        background: isActif ? 'var(--success)' : 'var(--ink-muted)',
        animation: isActif ? 'pulse 2s infinite' : 'none',
      }} />
      {isActif ? 'Actif' : 'Inactif'}
    </span>
  );
}

export default function App() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const [filterStatut, setFilterStatut] = useState('');
  const [modalUser, setModalUser] = useState(null); 
  const [deleteUser, setDeleteUser] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [toast, setToast] = useState(null);

  const notify = (message, type = 'success') => setToast({ message, type });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await userService.getAll();
      setUsers(res.data);
    } catch {
      notify('Impossible de charger les utilisateurs', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleSave = async (form) => {
    if (modalUser?.id) {
      await userService.update(modalUser.id, form);
      notify('Utilisateur mis à jour avec succès');
    } else {
      await userService.create(form);
      notify('Utilisateur créé avec succès');
    }
    await load();
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await userService.delete(deleteUser.id);
      setDeleteUser(null);
      notify('Utilisateur supprimé');
      await load();
    } catch (e) {
      notify(e.message, 'error');
    } finally {
      setDeleting(false);
    }
  };

  const filtered = users.filter(u => {
    const q = search.toLowerCase();
    const matchSearch = !q || `${u.prenom} ${u.nom} ${u.email}`.toLowerCase().includes(q);
    const matchRole = !filterRole || u.role === filterRole;
    const matchStatut = !filterStatut || u.statut === filterStatut;
    return matchSearch && matchRole && matchStatut;
  });

  const stats = {
    total: users.length,
    actifs: users.filter(u => u.statut === 'actif').length,
    inactifs: users.filter(u => u.statut === 'inactif').length,
  };

  return (
    <div style={styles.layout}>
      {/* Sidebar */}
      <aside style={styles.sidebar}>
        <nav style={styles.nav}>
          <div style={styles.logoContainer}>
            <img src={logo} alt="Logo" style={styles.logo} />
          </div>
        </nav>
        <div style={styles.sidebarStats}>
          <StatCard label="Total" value={stats.total} />
          <StatCard label="Actifs" value={stats.actifs} color="var(--success)" />
          <StatCard label="Inactifs" value={stats.inactifs} color="var(--ink-muted)" />
        </div>
      </aside>

      {/* Main */}
      <main style={styles.main}>
        {/* Header */}
        <header style={styles.header}>
          <div>
            <h1 style={styles.pageTitle}>Réalisé par : Houdaifa BAHOU</h1>
            <p style={styles.pageDesc}>Master SDIA</p>
          </div>
          <button onClick={() => setModalUser({})} style={styles.addBtn}>
            <span style={{ fontSize: '18px', lineHeight: 1 }}>+</span> Nouvel utilisateur
          </button>
        </header>

        {/* Toolbar */}
        <div style={styles.toolbar}>
          <div style={styles.searchWrap}>
            <input
              style={styles.searchInput}
              placeholder="Rechercher par nom, prénom ou email…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            {search && <button onClick={() => setSearch('')} style={styles.clearBtn}>✕</button>}
          </div>
          <select value={filterRole} onChange={e => setFilterRole(e.target.value)} style={styles.filter}>
            <option value="">Tous les rôles</option>
            {['Administrateur','Éditeur','Modérateur','Lecteur'].map(r => <option key={r}>{r}</option>)}
          </select>
          <select value={filterStatut} onChange={e => setFilterStatut(e.target.value)} style={styles.filter}>
            <option value="">Tous les statuts</option>
            <option value="actif">Actif</option>
            <option value="inactif">Inactif</option>
          </select>
        </div>

        {/* Count */}
        <div style={styles.resultCount}>
          {loading ? 'Chargement…' : `${filtered.length} utilisateur${filtered.length !== 1 ? 's' : ''} affiché${filtered.length !== 1 ? 's' : ''}`}
        </div>

        {/* Table */}
        <div style={styles.tableWrap}>
          {loading ? (
            <div style={styles.empty}>
              <div style={styles.spinner} />
              <p>Chargement des données…</p>
            </div>
          ) : filtered.length === 0 ? (
            <div style={styles.empty}>
              <div style={{ fontSize: '36px', marginBottom: '12px' }}>🔍</div>
              <p style={{ color: 'var(--ink-muted)' }}>Aucun utilisateur trouvé</p>
            </div>
          ) : (
            <table style={styles.table}>
              <thead>
                <tr>
                  {['Utilisateur','Email','Rôle','Statut','Date','Actions'].map(h => (
                    <th key={h} style={styles.th}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((u, i) => (
                  <tr key={u.id} style={{ animationDelay: `${i * 0.04}s` }} className="animate-in">
                    <td style={styles.td}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <Avatar prenom={u.prenom} nom={u.nom} />
                        <div>
                          <div style={{ fontWeight: 600, fontSize: '14px' }}>{u.prenom} {u.nom}</div>
                        </div>
                      </div>
                    </td>
                    <td style={styles.td}>
                      <span style={{ fontSize: '13px', color: 'var(--ink-soft)' }}>{u.email}</span>
                    </td>
                    <td style={styles.td}><RoleBadge role={u.role} /></td>
                    <td style={styles.td}><StatutBadge statut={u.statut} /></td>
                    <td style={styles.td}>
                      <span style={{ fontSize: '12px', color: 'var(--ink-muted)' }}>
                        {new Date(u.dateCreation).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </span>
                    </td>
                    <td style={styles.td}>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <ActionBtn onClick={() => setModalUser(u)} label="Modifier" />
                        <ActionBtn onClick={() => setDeleteUser(u)} label="Supprimer" danger />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>

      {/* Modals */}
      {modalUser !== null && (
        <UserModal
          user={modalUser?.id ? modalUser : null}
          onClose={() => setModalUser(null)}
          onSave={handleSave}
        />
      )}
      <ConfirmDialog user={deleteUser} onClose={() => setDeleteUser(null)} onConfirm={handleDelete} loading={deleting} />
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}

function StatCard({ label, value, color = 'var(--ink)' }) {
  return (
    <div style={styles.statCard}>
      <div style={{ fontSize: '22px', fontWeight: 700, color, fontFamily: 'var(--font-display)' }}>{value}</div>
      <div style={{ fontSize: '11px', color: 'var(--ink-muted)', fontWeight: 500, letterSpacing: '0.05em', textTransform: 'uppercase' }}>{label}</div>
    </div>
  );
}

function ActionBtn({ onClick, label, icon, danger }) {
  return (
    <button
      onClick={onClick}
      title={label}
      style={{
        padding: '6px 12px', border: '1px solid var(--border)', borderRadius: '6px',
        background: danger ? 'var(--accent-bg)' : 'white',
        color: danger ? 'var(--accent)' : 'var(--ink-soft)',
        fontSize: '12px', fontWeight: 500, cursor: 'pointer',
        display: 'flex', alignItems: 'center', gap: '4px',
        fontFamily: 'var(--font-body)', transition: 'all 0.15s',
      }}
    >
      {icon} {label}
    </button>
  );
}

const styles = {
  layout: {
    display: 'flex', minHeight: '100vh',
  },
  sidebar: {
    width: '220px', flexShrink: 0,
    background: 'var(--ink)', color: 'white',
    display: 'flex', flexDirection: 'column',
    padding: '0',
    position: 'sticky', top: 0, height: '100vh',
  },
  nav: { padding: '16px 12px', flex: 1 },
  navItem: {
    display: 'flex', alignItems: 'center', gap: '10px',
    padding: '10px 12px', borderRadius: '8px',
    background: 'rgba(255,255,255,0.1)', cursor: 'pointer',
  },
  navIcon: { fontSize: '15px' },
  navLabel: { fontSize: '13px', fontWeight: 500 },
  sidebarStats: {
    padding: '16px 16px 24px', borderTop: '1px solid rgba(255,255,255,0.08)',
    display: 'flex', flexDirection: 'column', gap: '12px',
  },
  statCard: {
    padding: '12px 14px', background: 'rgba(255,255,255,0.06)',
    borderRadius: '8px',
  },
  main: {
    flex: 1, display: 'flex', flexDirection: 'column',
    padding: '32px 40px', minWidth: 0,
  },
  header: {
    display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
    marginBottom: '28px',
  },
  pageTitle: {
    fontFamily: 'var(--font-display)', fontSize: '30px', fontWeight: 400,
    color: 'var(--ink)', lineHeight: 1.2,
  },
  pageDesc: { fontSize: '14px', color: 'var(--ink-muted)', marginTop: '4px' },
  addBtn: {
    display: 'flex', alignItems: 'center', gap: '8px',
    padding: '11px 22px', background: 'var(--ink)', color: 'white',
    border: 'none', borderRadius: 'var(--radius)', fontSize: '14px', fontWeight: 600,
    cursor: 'pointer', fontFamily: 'var(--font-body)',
  },
  toolbar: {
    display: 'flex', gap: '12px', marginBottom: '16px', flexWrap: 'wrap',
  },
  searchWrap: {
    flex: 1, minWidth: '240px', position: 'relative', display: 'flex', alignItems: 'center',
  },
  searchInput: {
    width: '100%', padding: '10px 36px 10px 22px',
    border: '1px solid var(--border)', borderRadius: 'var(--radius)',
    fontSize: '14px', color: 'var(--ink)', background: 'white',
    outline: 'none', fontFamily: 'var(--font-body)',
  },
  clearBtn: {
    position: 'absolute', right: '12px', background: 'none', border: 'none',
    cursor: 'pointer', color: 'var(--ink-muted)', fontSize: '13px',
  },
  filter: {
    padding: '10px 14px', border: '1px solid var(--border)', borderRadius: 'var(--radius)',
    fontSize: '14px', color: 'var(--ink)', background: 'white',
    outline: 'none', cursor: 'pointer', fontFamily: 'var(--font-body)',
  },
  resultCount: {
    fontSize: '12px', color: 'var(--ink-muted)', marginBottom: '12px',
    fontWeight: 500, letterSpacing: '0.02em',
  },
  tableWrap: {
    background: 'white', borderRadius: 'var(--radius-lg)',
    border: '1px solid var(--border)', overflow: 'hidden',
    boxShadow: 'var(--shadow-sm)',
  },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: {
    padding: '12px 16px', textAlign: 'left',
    fontSize: '11px', fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase',
    color: 'var(--ink-muted)', background: 'var(--paper-warm)',
    borderBottom: '1px solid var(--border)',
  },
  td: {
    padding: '14px 16px', borderBottom: '1px solid var(--border)',
    verticalAlign: 'middle',
  },
  empty: {
    padding: '60px', textAlign: 'center', color: 'var(--ink-soft)',
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
  },
  spinner: {
    width: '32px', height: '32px', border: '3px solid var(--border)',
    borderTopColor: 'var(--ink)', borderRadius: '50%',
    animation: 'spin 0.8s linear infinite', marginBottom: '12px',
  },

  logoContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },

  logo: {
    width: '195px',
    height: '85px',
    padding: '4px',
    borderRadius: '5px',
    background: 'white',
  },
};
