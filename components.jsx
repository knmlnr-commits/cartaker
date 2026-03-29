// GeriCall CareTaker Portal — Shared UI Components

const { useState, useEffect } = React;
const C = window.COLORS;

// ── Logo ──
window.GeriCallLogo = function GeriCallLogo() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div style={{
        width: 32, height: 32, borderRadius: 8, background: C.oranje,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: '#FFFFFF', fontWeight: 800, fontSize: 16, lineHeight: 1,
      }}>G</div>
      <span style={{ fontWeight: 700, fontSize: 18, color: C.tekstPrimair }}>GeriCall</span>
    </div>
  );
};

// ── Toast System ──
window.ToastContainer = function ToastContainer({ toasts }) {
  return (
    <div style={{ position: 'fixed', bottom: 80, left: 0, right: 0, zIndex: 1000, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, pointerEvents: 'none' }}>
      {toasts.map((t) => (
        <div key={t.id} style={{
          background: t.type === 'success' ? C.groen : t.type === 'error' ? C.rood : C.oranje,
          color: '#FFFFFF', padding: '10px 20px', borderRadius: 8, fontSize: 14, fontWeight: 500,
          maxWidth: 380, textAlign: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          animation: t.removing ? 'toastOut 0.3s ease forwards' : 'toastIn 0.3s ease',
        }}>{t.message}</div>
      ))}
    </div>
  );
};

// ── Modal ──
window.Modal = function Modal({ title, children, onClose }) {
  return (
    <div onClick={onClose} style={{
      position: 'fixed', inset: 0, background: 'rgba(45,45,45,0.5)', zIndex: 900,
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16,
      animation: 'fadeIn 0.2s ease',
    }}>
      <div onClick={(e) => e.stopPropagation()} style={{
        background: C.kaartWit, borderRadius: 16, padding: 24, maxWidth: 380, width: '100%',
        maxHeight: '80vh', overflowY: 'auto', boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h3 style={{ fontSize: 18, fontWeight: 700, color: C.tekstPrimair }}>{title}</h3>
          <button onClick={onClose} style={{
            background: 'none', border: 'none', fontSize: 22, color: C.tekstMuted, cursor: 'pointer', padding: 4,
          }}>&times;</button>
        </div>
        {children}
      </div>
    </div>
  );
};

// ── Card ──
window.Card = function Card({ children, style }) {
  return (
    <div style={{
      background: C.kaartWit, borderRadius: 12, padding: 16, marginBottom: 12,
      border: `1px solid ${C.border}`, ...style,
    }}>{children}</div>
  );
};

// ── Progress Bar ──
window.ProgressBar = function ProgressBar({ percentage, color, height }) {
  const h = height || 8;
  const c = color || C.oranje;
  return (
    <div style={{ background: C.border, borderRadius: h / 2, height: h, width: '100%', overflow: 'hidden' }}>
      <div style={{
        background: c, height: '100%', borderRadius: h / 2, width: `${percentage}%`,
        transition: 'width 0.6s ease',
      }} />
    </div>
  );
};

// ── Badge ──
window.Badge = function Badge({ label, color, bgColor }) {
  return (
    <span style={{
      display: 'inline-block', padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600,
      color: color, background: bgColor,
    }}>{label}</span>
  );
};

// ── Bottom Nav ──
window.BottomNav = function BottomNav({ activeTab, onTabChange }) {
  const tabs = [
    { id: 'overzicht', icon: '\uD83C\uDFE0', label: 'Overzicht' },
    { id: 'behandelplan', icon: '\uD83D\uDCCB', label: 'Behandelplan' },
    { id: 'leren', icon: '\uD83D\uDCDA', label: 'Leren' },
    { id: 'melding', icon: '\uD83D\uDD14', label: 'Melding doen' },
  ];
  return (
    <nav style={{
      position: 'fixed', bottom: 0, left: 0, right: 0, background: C.kaartWit,
      borderTop: `1px solid ${C.border}`, display: 'flex', zIndex: 800,
      paddingBottom: 'env(safe-area-inset-bottom, 12px)',
    }}>
      {tabs.map((tab) => (
        <button key={tab.id} onClick={() => onTabChange(tab.id)} style={{
          flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
          padding: '10px 0 6px', background: 'none', border: 'none', cursor: 'pointer',
          color: activeTab === tab.id ? C.oranje : C.tekstMuted, transition: 'color 0.2s',
        }}>
          <span style={{ fontSize: 20, marginBottom: 2 }}>{tab.icon}</span>
          <span style={{ fontSize: 11, fontWeight: activeTab === tab.id ? 600 : 400 }}>{tab.label}</span>
        </button>
      ))}
    </nav>
  );
};

// ── Persona Switcher ──
window.PersonaSwitcher = function PersonaSwitcher({ persona, onSwitch }) {
  const options = ['Verzorgende', 'Familie'];
  return (
    <div style={{ display: 'flex', background: C.border, borderRadius: 10, padding: 3, marginBottom: 12 }}>
      {options.map((opt) => {
        const active = persona === opt;
        return (
          <button key={opt} onClick={() => onSwitch(opt)} style={{
            flex: 1, padding: '8px 0', borderRadius: 8, border: 'none', cursor: 'pointer',
            background: active ? C.oranje : 'transparent',
            color: active ? '#FFFFFF' : C.tekstSecundair,
            fontWeight: active ? 600 : 400, fontSize: 14, transition: 'all 0.2s',
          }}>{opt}</button>
        );
      })}
    </div>
  );
};

// ── Section Title ──
window.SectionTitle = function SectionTitle({ children }) {
  return <h2 style={{ fontSize: 16, fontWeight: 700, color: C.tekstPrimair, marginBottom: 12 }}>{children}</h2>;
};
