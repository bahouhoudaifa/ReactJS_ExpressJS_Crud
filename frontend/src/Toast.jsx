import { useEffect } from 'react';

export default function Toast({ message, type = 'success', onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, [message]);

  const colors = {
    success: { bg: 'var(--success-bg)', border: '#a9dfbf', color: 'var(--success)', icon: '✓' },
    error: { bg: 'var(--accent-bg)', border: '#f5b7b1', color: 'var(--accent)', icon: '✕' },
  };
  const c = colors[type];

  return (
    <div style={{ ...styles.toast, background: c.bg, border: `1px solid ${c.border}` }}>
      <span style={{ ...styles.icon, color: c.color }}>{c.icon}</span>
      <span style={{ ...styles.text, color: c.color }}>{message}</span>
    </div>
  );
}

const styles = {
  toast: {
    position: 'fixed', bottom: '28px', right: '28px', zIndex: 2000,
    display: 'flex', alignItems: 'center', gap: '10px',
    padding: '12px 20px', borderRadius: 'var(--radius)',
    boxShadow: 'var(--shadow-md)', animation: 'fadeIn 0.3s ease',
    minWidth: '280px',
  },
  icon: { fontSize: '15px', fontWeight: 700 },
  text: { fontSize: '14px', fontWeight: 500 },
};
