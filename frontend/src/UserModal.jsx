import { useState, useEffect } from 'react';

const ROLES = ['Administrateur', 'Éditeur', 'Lecteur', 'Modérateur'];

export default function UserModal({ user, onClose, onSave }) {
  const isEdit = Boolean(user?.id);
  const [form, setForm] = useState({
    nom: '', prenom: '', email: '', role: 'Lecteur', statut: 'actif',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) setForm({ nom: user.nom, prenom: user.prenom, email: user.email, role: user.role, statut: user.statut });
  }, [user]);

  const validate = () => {
    const e = {};
    if (!form.nom.trim()) e.nom = 'Le nom est requis';
    if (!form.prenom.trim()) e.prenom = 'Le prénom est requis';
    if (!form.email.trim()) e.email = "L'email est requis";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Email invalide';
    return e;
  };

  const handleSubmit = async () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setLoading(true);
    try {
      await onSave(form);
      onClose();
    } catch (err) {
      setErrors({ global: err.message });
    } finally {
      setLoading(false);
    }
  };

  const set = (field) => (e) => {
    setForm(f => ({ ...f, [field]: e.target.value }));
    setErrors(er => ({ ...er, [field]: undefined, global: undefined }));
  };

  return (
    <div style={styles.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={styles.modal} className="animate-in">
        <div style={styles.header}>
          <div>
            <p style={styles.headerEyebrow}>{isEdit ? 'Modifier' : 'Nouveau'}</p>
            <h2 style={styles.headerTitle}>{isEdit ? `${user.prenom} ${user.nom}` : 'Utilisateur'}</h2>
          </div>
          <button onClick={onClose} style={styles.closeBtn}>✕</button>
        </div>

        {errors.global && <div style={styles.errorBanner}>{errors.global}</div>}

        <div style={styles.body}>
          <div style={styles.row}>
            <Field label="Prénom" value={form.prenom} onChange={set('prenom')} error={errors.prenom} placeholder="Sara" />
            <Field label="Nom" value={form.nom} onChange={set('nom')} error={errors.nom} placeholder="El Amrani" />
          </div>
          <Field label="Email" value={form.email} onChange={set('email')} error={errors.email} placeholder="sara@example.ma" type="email" />
          <div style={styles.row}>
            <div style={styles.fieldGroup}>
              <label style={styles.label}>Rôle</label>
              <select value={form.role} onChange={set('role')} style={styles.select}>
                {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            <div style={styles.fieldGroup}>
              <label style={styles.label}>Statut</label>
              <select value={form.statut} onChange={set('statut')} style={styles.select}>
                <option value="actif">Actif</option>
                <option value="inactif">Inactif</option>
              </select>
            </div>
          </div>
        </div>

        <div style={styles.footer}>
          <button onClick={onClose} style={styles.cancelBtn}>Annuler</button>
          <button onClick={handleSubmit} style={styles.saveBtn} disabled={loading}>
            {loading ? '...' : isEdit ? 'Sauvegarder' : 'Créer'}
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, error, placeholder, type = 'text' }) {
  return (
    <div style={styles.fieldGroup}>
      <label style={styles.label}>{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        style={{ ...styles.input, ...(error ? styles.inputError : {}) }}
      />
      {error && <span style={styles.fieldError}>{error}</span>}
    </div>
  );
}

const styles = {
  overlay: {
    position: 'fixed', inset: 0, background: 'rgba(15,14,13,0.5)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    zIndex: 1000, padding: '20px', backdropFilter: 'blur(4px)',
  },
  modal: {
    background: 'var(--paper-card)', borderRadius: 'var(--radius-lg)',
    width: '100%', maxWidth: '520px', boxShadow: 'var(--shadow-lg)',
    overflow: 'hidden',
  },
  header: {
    display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
    padding: '28px 32px 24px', borderBottom: '1px solid var(--border)',
    background: 'var(--paper-warm)',
  },
  headerEyebrow: { fontSize: '11px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: '4px' },
  headerTitle: { fontFamily: 'var(--font-display)', fontSize: '22px', fontWeight: 400, color: 'var(--ink)' },
  closeBtn: {
    background: 'none', border: '1px solid var(--border)', borderRadius: '6px',
    width: '32px', height: '32px', cursor: 'pointer', color: 'var(--ink-muted)',
    fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center',
    transition: 'all 0.15s',
  },
  errorBanner: {
    margin: '16px 32px 0', padding: '10px 14px', background: 'var(--accent-bg)',
    border: '1px solid #f5b7b1', borderRadius: 'var(--radius)', color: 'var(--accent)',
    fontSize: '13px',
  },
  body: { padding: '24px 32px', display: 'flex', flexDirection: 'column', gap: '18px' },
  row: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' },
  fieldGroup: { display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 },
  label: { fontSize: '12px', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase', color: 'var(--ink-muted)' },
  input: {
    padding: '10px 14px', border: '1px solid var(--border)', borderRadius: 'var(--radius)',
    fontSize: '14px', color: 'var(--ink)', background: 'var(--paper)',
    outline: 'none', transition: 'border-color 0.15s', fontFamily: 'var(--font-body)',
  },
  inputError: { borderColor: 'var(--accent-light)' },
  select: {
    padding: '10px 14px', border: '1px solid var(--border)', borderRadius: 'var(--radius)',
    fontSize: '14px', color: 'var(--ink)', background: 'var(--paper)',
    outline: 'none', cursor: 'pointer', fontFamily: 'var(--font-body)',
  },
  fieldError: { fontSize: '12px', color: 'var(--accent)', marginTop: '2px' },
  footer: {
    padding: '20px 32px', borderTop: '1px solid var(--border)',
    display: 'flex', gap: '12px', justifyContent: 'flex-end',
    background: 'var(--paper-warm)',
  },
  cancelBtn: {
    padding: '9px 20px', border: '1px solid var(--border)', borderRadius: 'var(--radius)',
    background: 'white', color: 'var(--ink-soft)', fontSize: '14px', fontWeight: 500,
    cursor: 'pointer', fontFamily: 'var(--font-body)',
  },
  saveBtn: {
    padding: '9px 24px', border: 'none', borderRadius: 'var(--radius)',
    background: 'var(--ink)', color: 'white', fontSize: '14px', fontWeight: 500,
    cursor: 'pointer', fontFamily: 'var(--font-body)', transition: 'opacity 0.15s',
  },
};
