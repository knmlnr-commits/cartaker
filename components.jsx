// GeriCall CareTaker Portal — Shared UI Components

var C = window.COLORS;

// ── Logo (echte GeriCall afbeelding als base64) ──
window.GeriCallLogoImg = function GeriCallLogoImg({ size }) {
  var s = size || 32;
  return React.createElement('img', {
    src: 'logo.png',
    alt: 'GeriCall',
    style: { width: s, height: s, objectFit: 'contain' }
  });
};

// ── Logo component met tekst ──
window.GeriCallLogo = function GeriCallLogo({ compact }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: compact ? 6 : 8 }}>
      <GeriCallLogoImg size={compact ? 28 : 32} />
      {!compact && <span style={{ fontWeight: 700, fontSize: 18, color: C.tekstPrimair }}>GeriCall</span>}
    </div>
  );
};

// ── Groot logo voor login/splash ──
window.GeriCallLogoBig = function GeriCallLogoBig() {
  return (
    <div style={{ textAlign: 'center', marginBottom: 24 }}>
      <div style={{ display: 'inline-block', marginBottom: 8 }}>
        <GeriCallLogoImg size={72} />
      </div>
      <div style={{ fontSize: 28, fontWeight: 700, color: C.tekstPrimair }}>GeriCall</div>
      <div style={{ fontSize: 14, color: C.oranje, fontWeight: 600 }}>CareTaker Portal</div>
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
window.Card = function Card({ children, style, onClick }) {
  return (
    <div onClick={onClick} style={{
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

// ── Stemming Widget ──
// Compact: toont huidige stemming + wie/wanneer
// Expanded: laat kiezen uit 5 smileys
window.StemmingWidget = function StemmingWidget({ bewonerId, gebruikerNaam, gebruikerRol, onUpdate, compact }) {
  var { useState } = React;
  var [kiezen, setKiezen] = useState(false);
  var [showHistorie, setShowHistorie] = useState(false);
  var stemming = window.stemmingen[bewonerId];
  var opties = window.stemmingOpties;

  if (!stemming) return null;

  var huidige = opties.find(function(o) { return o.score === stemming.score; }) || opties[2];

  var updateStemming = function(optie) {
    window.stemmingen[bewonerId] = {
      score: optie.score,
      label: optie.label,
      door: gebruikerNaam,
      rol: gebruikerRol,
      tijd: 'Zojuist',
      history: [{ score: optie.score, door: gebruikerNaam, rol: gebruikerRol, tijd: 'Zojuist' }].concat(stemming.history || []),
    };
    setKiezen(false);
    if (onUpdate) onUpdate();
  };

  // Compact versie (voor wijkoverzicht)
  if (compact) {
    return React.createElement('span', {
      title: huidige.label + ' \u2014 ' + stemming.door + ' (' + stemming.tijd + ')',
      style: { fontSize: 18, cursor: 'pointer' },
      onClick: function(e) { e.stopPropagation(); setKiezen(!kiezen); }
    }, huidige.emoji);
  }

  return React.createElement(Card, { style: { padding: 12 } },
    // Huidige stemming
    React.createElement('div', { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: kiezen ? 10 : 0 } },
      React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 10 } },
        React.createElement('span', { style: { fontSize: 32 } }, huidige.emoji),
        React.createElement('div', null,
          React.createElement('div', { style: { fontSize: 15, fontWeight: 600, color: huidige.kleur } }, huidige.label),
          React.createElement('div', { style: { fontSize: 11, color: C.tekstMuted } }, stemming.door + ' \u00B7 ' + stemming.tijd)
        )
      ),
      React.createElement('button', {
        onClick: function() { setKiezen(!kiezen); },
        style: { background: kiezen ? C.border : C.oranjeLicht, border: 'none', borderRadius: 8, padding: '6px 12px', fontSize: 12, fontWeight: 500, color: kiezen ? C.tekstMuted : C.oranje, cursor: 'pointer' }
      }, kiezen ? 'Annuleren' : 'Bijwerken')
    ),

    // Keuze smileys
    kiezen && React.createElement('div', null,
      React.createElement('div', { style: { fontSize: 12, color: C.tekstSecundair, marginBottom: 8 } }, 'Hoe gaat het nu?'),
      React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', gap: 4 } },
        opties.map(function(o) {
          var actief = o.score === stemming.score;
          return React.createElement('button', {
            key: o.score,
            onClick: function() { updateStemming(o); },
            style: {
              flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
              padding: '8px 4px', borderRadius: 10, cursor: 'pointer', transition: 'all 0.2s',
              background: actief ? o.kleur + '18' : C.kaartWit,
              border: '2px solid ' + (actief ? o.kleur : C.border),
            }
          },
            React.createElement('span', { style: { fontSize: 24 } }, o.emoji),
            React.createElement('span', { style: { fontSize: 9, color: o.kleur, fontWeight: 500 } }, o.label)
          );
        })
      )
    ),

    // Historie link
    !kiezen && stemming.history && stemming.history.length > 1 && React.createElement('div', null,
      React.createElement('button', {
        onClick: function() { setShowHistorie(!showHistorie); },
        style: { background: 'none', border: 'none', fontSize: 11, color: C.tekstMuted, cursor: 'pointer', marginTop: 6, padding: 0 }
      }, showHistorie ? 'Verberg historie' : 'Toon historie (' + stemming.history.length + ')'),

      showHistorie && React.createElement('div', { style: { marginTop: 6 } },
        stemming.history.map(function(h, i) {
          var hOpt = opties.find(function(o) { return o.score === h.score; }) || opties[2];
          return React.createElement('div', { key: i, style: { display: 'flex', alignItems: 'center', gap: 8, padding: '4px 0', borderBottom: i < stemming.history.length - 1 ? '1px solid ' + C.border : 'none' } },
            React.createElement('span', { style: { fontSize: 16 } }, hOpt.emoji),
            React.createElement('span', { style: { fontSize: 11, color: C.tekstSecundair, flex: 1 } }, h.door),
            React.createElement('span', { style: { fontSize: 11, color: C.tekstMuted } }, h.tijd)
          );
        })
      )
    )
  );
};
