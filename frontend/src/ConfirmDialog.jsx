export default function ConfirmDialog({ user, onClose, onConfirm, loading }) {
  if (!user) return null;
  return (
    <div style={styles.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={styles.dialog} className="animate-in">
        <h3 style={styles.title}>Supprimer cet utilisateur ?</h3>
        <p style={styles.desc}>
          Vous êtes sur le point de supprimer <strong>{user.prenom} {user.nom}</strong>.<br />
          Cette action est irréversible.
        </p>
        <div style={styles.actions}>
          <button onClick={onClose} style={styles.cancelBtn}>Annuler</button>
          <button onClick={onConfirm} style={styles.deleteBtn} disabled={loading}>
            {loading ? 'Suppression...' : 'Oui, supprimer'}
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: 'fixed', inset: 0, background: 'rgba(15,14,13,0.5)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    zIndex: 1100, padding: '20px', backdropFilter: 'blur(4px)',
  },
  dialog: {
    background: 'var(--paper-card)', borderRadius: 'var(--radius-lg)',
    padding: '40px 36px', width: '100%', maxWidth: '400px',
    textAlign: 'center', boxShadow: 'var(--shadow-lg)',
  },
  title: { fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: 400, marginBottom: '12px' },
  desc: { fontSize: '14px', color: 'var(--ink-soft)', lineHeight: 1.7, marginBottom: '28px' },
  actions: { display: 'flex', gap: '12px' },
  cancelBtn: {
    flex: 1, padding: '10px', border: '1px solid var(--border)', borderRadius: 'var(--radius)',
    background: 'white', color: 'var(--ink-soft)', fontSize: '14px', fontWeight: 500,
    cursor: 'pointer', fontFamily: 'var(--font-body)',
  },
  deleteBtn: {
    flex: 1, padding: '10px', border: 'none', borderRadius: 'var(--radius)',
    background: 'var(--accent)', color: 'white', fontSize: '14px', fontWeight: 600,
    cursor: 'pointer', fontFamily: 'var(--font-body)',
  },
};
