// GeriCall CareTaker Portal — Shared UI Components

var C = window.COLORS;

// ── Notificatie Bel + Panel ──
window.NotificatieBel = function NotificatieBel({ rol, addToast, basisRoute }) {
  var { useState } = React;
  var [open, setOpen] = useState(false);
  var notifs = (window.notificaties && window.notificaties[rol]) || [];
  var ongelezen = notifs.filter(function(n) { return !n.gelezen; }).length;

  var urgentieKleur = function(u) {
    if (u === 'hoog') return C.rood;
    if (u === 'normaal') return C.oranje;
    return C.tekstMuted;
  };
  var typeIcon = function(t) {
    if (t === 'consult') return '\uD83D\uDD14';
    if (t === 'vitalen') return '\u2764\uFE0F';
    if (t === 'planning') return '\uD83D\uDCC5';
    if (t === 'elearning') return '\uD83D\uDCDA';
    if (t === 'rapportage') return '\u270D\uFE0F';
    if (t === 'stemming') return '\u25CF';
    if (t === 'chat') return '\uD83D\uDCAC';
    return '\uD83D\uDD14';
  };

  var markeerGelezen = function(id) {
    notifs.forEach(function(n) { if (n.id === id) n.gelezen = true; });
    setOpen(true); // force re-render
  };
  var markeerAlleGelezen = function() {
    notifs.forEach(function(n) { n.gelezen = true; });
    setOpen(true);
    addToast('Alle meldingen gelezen', 'success');
  };

  return React.createElement('div', { style: { position: 'relative' } },
    // Bel knop
    React.createElement('button', { onClick: function() { setOpen(!open); }, style: {
      background: 'none', border: 'none', fontSize: 18, cursor: 'pointer', position: 'relative', padding: '4px',
    } },
      '\uD83D\uDD14',
      ongelezen > 0 && React.createElement('div', { style: {
        position: 'absolute', top: 0, right: 0, width: 16, height: 16, borderRadius: 8,
        background: C.rood, color: '#FFF', fontSize: 10, fontWeight: 700,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      } }, ongelezen)
    ),

    // Panel
    open && React.createElement('div', { style: {
      position: 'absolute', top: '100%', right: 0, marginTop: 6, width: 320,
      background: C.kaartWit, border: '1px solid ' + C.border, borderRadius: 14,
      boxShadow: '0 8px 24px rgba(0,0,0,0.12)', zIndex: 200, maxHeight: 400, overflowY: 'auto',
    } },
      // Header
      React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 14px', borderBottom: '1px solid ' + C.border } },
        React.createElement('span', { style: { fontSize: 14, fontWeight: 600, color: C.tekstPrimair } }, 'Meldingen' + (ongelezen > 0 ? ' (' + ongelezen + ')' : '')),
        React.createElement('div', { style: { display: 'flex', gap: 8 } },
          ongelezen > 0 && React.createElement('button', { onClick: markeerAlleGelezen, style: { background: 'none', border: 'none', fontSize: 11, color: C.oranje, cursor: 'pointer', fontWeight: 500 } }, 'Alles gelezen'),
          React.createElement('button', { onClick: function() { setOpen(false); }, style: { background: 'none', border: 'none', fontSize: 16, color: C.tekstMuted, cursor: 'pointer' } }, '\u2715')
        )
      ),
      // Items
      notifs.length === 0 && React.createElement('div', { style: { padding: '24px 14px', textAlign: 'center', fontSize: 13, color: C.tekstMuted } }, 'Geen meldingen'),
      notifs.map(function(n) {
        return React.createElement('div', { key: n.id, onClick: function() { markeerGelezen(n.id); }, style: {
          display: 'flex', gap: 10, padding: '10px 14px', cursor: 'pointer',
          background: n.gelezen ? 'transparent' : C.achtergrond,
          borderBottom: '1px solid ' + C.border,
        } },
          React.createElement('div', { style: { display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 20, paddingTop: 2 } },
            React.createElement('span', { style: { fontSize: 14 } }, typeIcon(n.type)),
            !n.gelezen && React.createElement('div', { style: { width: 6, height: 6, borderRadius: 3, background: urgentieKleur(n.urgentie), marginTop: 4 } })
          ),
          React.createElement('div', { style: { flex: 1 } },
            React.createElement('div', { style: { fontSize: 13, color: C.tekstPrimair, fontWeight: n.gelezen ? 400 : 600, lineHeight: 1.4 } }, n.tekst),
            React.createElement('div', { style: { fontSize: 11, color: C.tekstMuted, marginTop: 2 } }, n.tijd)
          )
        );
      })
    )
  );
};

// ── Foto Upload (mock) ──
window.FotoUpload = function FotoUpload({ label, onUpload, addToast }) {
  var { useState, useRef } = React;
  var [preview, setPreview] = useState(null);
  var fileRef = useRef(null);

  var handleFile = function(e) {
    var file = e.target.files && e.target.files[0];
    if (!file) return;
    var reader = new FileReader();
    reader.onload = function(ev) {
      setPreview(ev.target.result);
      if (addToast) addToast('Foto toegevoegd', 'success');
      if (onUpload) onUpload(ev.target.result);
    };
    reader.readAsDataURL(file);
  };

  if (preview) {
    return React.createElement('div', { style: { position: 'relative', marginBottom: 8 } },
      React.createElement('img', { src: preview, style: { width: '100%', borderRadius: 8, maxHeight: 200, objectFit: 'cover' } }),
      React.createElement('button', { onClick: function() { setPreview(null); }, style: {
        position: 'absolute', top: 6, right: 6, width: 24, height: 24, borderRadius: 12,
        background: 'rgba(0,0,0,0.5)', color: '#FFF', border: 'none', fontSize: 14, cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      } }, '\u2715')
    );
  }

  return React.createElement('div', { style: { display: 'flex', gap: 6 } },
    React.createElement('input', { ref: fileRef, type: 'file', accept: 'image/*', capture: 'environment', onChange: handleFile, style: { display: 'none' } }),
    React.createElement('button', { onClick: function() { fileRef.current && fileRef.current.click(); }, style: {
      flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
      padding: '8px 12px', borderRadius: 8, border: '1px dashed ' + C.border,
      background: C.kaartWit, fontSize: 12, color: C.tekstSecundair, cursor: 'pointer',
    } }, '\uD83D\uDCF7 ' + (label || 'Foto toevoegen'))
  );
};

// ── Taal toggle met mini-vlaggetjes (SVG) ──
window.TaalToggle = function TaalToggle() {
  var { useState } = React;
  var [taal, setTaal] = useState(window.appTaal || 'nl');
  var wissel = function() {
    var nieuw = taal === 'nl' ? 'en' : 'nl';
    setTaal(nieuw);
    window.appTaal = nieuw;
    window.huidigeTaal = nieuw;
    var h = window.location.hash;
    window.location.hash = '';
    setTimeout(function() { window.location.hash = h; }, 10);
  };
  // NL vlag
  var nlVlag = React.createElement('svg', { width: 20, height: 14, viewBox: '0 0 20 14', style: { display: 'block' } },
    React.createElement('rect', { width: 20, height: 14, rx: 2, fill: '#FFFFFF' }),
    React.createElement('rect', { y: 0, width: 20, height: 4.67, fill: '#AE1C28' }),
    React.createElement('rect', { y: 4.67, width: 20, height: 4.67, fill: '#FFFFFF' }),
    React.createElement('rect', { y: 9.33, width: 20, height: 4.67, fill: '#21468B' }),
    React.createElement('rect', { width: 20, height: 14, rx: 2, fill: 'none', stroke: '#E8E8E8', strokeWidth: 0.5 })
  );
  // UK vlag (vereenvoudigd)
  var enVlag = React.createElement('svg', { width: 20, height: 14, viewBox: '0 0 20 14', style: { display: 'block' } },
    React.createElement('rect', { width: 20, height: 14, rx: 2, fill: '#012169' }),
    React.createElement('path', { d: 'M0 0 L20 14 M20 0 L0 14', stroke: '#FFFFFF', strokeWidth: 2.5 }),
    React.createElement('path', { d: 'M0 0 L20 14 M20 0 L0 14', stroke: '#C8102E', strokeWidth: 1 }),
    React.createElement('path', { d: 'M10 0 V14 M0 7 H20', stroke: '#FFFFFF', strokeWidth: 4 }),
    React.createElement('path', { d: 'M10 0 V14 M0 7 H20', stroke: '#C8102E', strokeWidth: 2 }),
    React.createElement('rect', { width: 20, height: 14, rx: 2, fill: 'none', stroke: '#E8E8E8', strokeWidth: 0.5 })
  );

  // Toon de vlag van de HUIDIGE taal
  return React.createElement('button', { onClick: wissel, title: taal === 'nl' ? 'Switch to English' : 'Schakel naar Nederlands', style: {
    background: 'none', border: 'none', cursor: 'pointer', padding: '2px', lineHeight: 1, display: 'flex', alignItems: 'center',
  } }, taal === 'nl' ? nlVlag : enVlag);
};

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
// Rustig ontwerp: gekleurde bolletjes + tekst, geen emoji's
window.StemmingWidget = function StemmingWidget({ bewonerId, gebruikerNaam, gebruikerRol, onUpdate, compact }) {
  var { useState } = React;
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
    if (onUpdate) onUpdate();
  };

  // Compact: klein bolletje met kleur
  if (compact) {
    return React.createElement('div', {
      title: huidige.label + ' \u2014 ' + stemming.door + ' (' + stemming.tijd + ')',
      style: { display: 'flex', alignItems: 'center', gap: 4 }
    },
      React.createElement('div', { style: { width: 8, height: 8, borderRadius: 4, background: huidige.kleur } }),
      React.createElement('span', { style: { fontSize: 10, color: C.tekstMuted } }, huidige.label)
    );
  }

  return React.createElement('div', { style: { background: C.kaartWit, borderRadius: 12, padding: '14px 16px', marginBottom: 12, border: '1px solid ' + C.border } },
    // Bolletjes altijd zichtbaar — direct klikbaar
    React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', gap: 6 } },
      opties.map(function(o) {
        var actief = o.score === stemming.score;
        return React.createElement('button', {
          key: o.score,
          onClick: function() { updateStemming(o); },
          style: {
            flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
            padding: '8px 2px', borderRadius: 8, cursor: 'pointer', transition: 'all 0.15s',
            background: actief ? C.achtergrond : 'transparent',
            border: '1px solid ' + (actief ? C.tekstMuted : 'transparent'),
          }
        },
          React.createElement('div', { style: { width: 14, height: 14, borderRadius: 7, background: o.kleur, transition: 'transform 0.15s', transform: actief ? 'scale(1.3)' : 'scale(1)' } }),
          React.createElement('span', { style: { fontSize: 10, color: C.tekstSecundair, fontWeight: actief ? 600 : 400 } }, o.label)
        );
      })
    ),
    // Wie + wanneer
    React.createElement('div', { style: { fontSize: 11, color: C.tekstMuted, marginTop: 6, textAlign: 'center' } }, stemming.door + ', ' + stemming.tijd),

    // Historie
    stemming.history && stemming.history.length > 1 && React.createElement('div', null,
      React.createElement('button', {
        onClick: function() { setShowHistorie(!showHistorie); },
        style: { background: 'none', border: 'none', fontSize: 11, color: C.tekstMuted, cursor: 'pointer', marginTop: 8, padding: 0 }
      }, showHistorie ? ui('verberg') : stemming.history.length + ' eerdere updates'),

      showHistorie && React.createElement('div', { style: { marginTop: 6 } },
        stemming.history.map(function(h, i) {
          var hOpt = opties.find(function(o) { return o.score === h.score; }) || opties[2];
          return React.createElement('div', { key: i, style: { display: 'flex', alignItems: 'center', gap: 8, padding: '4px 0' } },
            React.createElement('div', { style: { width: 6, height: 6, borderRadius: 3, background: hOpt.kleur, flexShrink: 0 } }),
            React.createElement('span', { style: { fontSize: 11, color: C.tekstSecundair, flex: 1 } }, hOpt.label + ' \u2014 ' + h.door),
            React.createElement('span', { style: { fontSize: 11, color: C.tekstMuted } }, h.tijd)
          );
        })
      )
    )
  );
};

// ── Consult Detail View ──
window.ConsultDetail = function ConsultDetail({ consult, onTerug, addToast, readOnly }) {
  var { useState } = React;
  var [nieuwBericht, setNieuwBericht] = useState('');
  var [deelMetFamilie, setDeelMetFamilie] = useState(true);
  var c = consult;
  if (!c) return null;

  var isU1 = c.urgentie.indexOf('U1') !== -1;
  var isU2 = c.urgentie.indexOf('U2') !== -1;
  var urgKleur = isU1 ? C.rood : isU2 ? C.oranje : C.blauw;

  var tijdlijnIcon = function(type) {
    if (type === 'melding') return { bg: C.oranjeLicht, kleur: C.oranje, letter: 'M' };
    if (type === 'triage') return { bg: C.blauwLicht, kleur: C.blauw, letter: 'T' };
    if (type === 'toewijzing') return { bg: C.groenLicht, kleur: C.groen, letter: 'A' };
    if (type === 'bericht') return { bg: C.achtergrond, kleur: C.tekstSecundair, letter: 'B' };
    if (type === 'verzoek') return { bg: C.oranjeLicht, kleur: C.oranje, letter: 'V' };
    return { bg: C.achtergrond, kleur: C.tekstMuted, letter: '?' };
  };

  var infoStatus = function(s) {
    if (s === 'aangeleverd') return { label: 'Aangeleverd', kleur: C.groen, bg: C.groenLicht };
    if (s === 'aangevraagd') return { label: 'Aangevraagd', kleur: C.blauw, bg: C.blauwLicht };
    return { label: 'In afwachting', kleur: C.oranje, bg: C.oranjeLicht };
  };

  return React.createElement('div', { style: { animation: 'slideInRight 0.3s ease' } },
    React.createElement('button', { onClick: onTerug, style: { background: 'none', border: 'none', fontSize: 14, color: C.tekstSecundair, cursor: 'pointer', marginBottom: 8, fontWeight: 500 } }, '\u2190 Terug'),

    // Header
    React.createElement('div', { style: { background: C.kaartWit, borderRadius: 12, padding: 16, marginBottom: 12, border: '1px solid ' + C.border } },
      React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 } },
        React.createElement('span', { style: { fontSize: 18, fontWeight: 700, color: C.tekstPrimair } }, '#' + c.id),
        React.createElement(Badge, { label: c.urgentie, color: urgKleur, bgColor: urgKleur + '18' })
      ),
      React.createElement('div', { style: { fontSize: 14, color: C.tekstPrimair, marginBottom: 8 } }, c.beschrijving),
      React.createElement('div', { style: { fontSize: 12, color: C.tekstMuted } }, 'Ingediend: ' + c.ingediend + (c.ingediendDoor ? ' door ' + c.ingediendDoor : '')),
      React.createElement('div', { style: { fontSize: 12, color: C.tekstMuted } }, 'Status: ' + c.status + ' \u00B7 ' + (c.arts || c.toewijzing)),
      c.klacht && React.createElement('div', { style: { fontSize: 12, color: C.tekstMuted, marginTop: 4 } }, 'Klacht: ' + c.klacht)
    ),

    // Vitalen snapshot
    c.vitalen && React.createElement('div', { style: { background: C.kaartWit, borderRadius: 12, padding: 14, marginBottom: 12, border: '1px solid ' + C.border } },
      React.createElement('div', { style: { fontSize: 13, fontWeight: 600, color: C.tekstSecundair, marginBottom: 8 } }, 'Vitalen bij melding'),
      React.createElement('div', { style: { display: 'flex', flexWrap: 'wrap', gap: 8 } },
        c.vitalen.hartslag && React.createElement('span', { style: { fontSize: 12, color: C.tekstSecundair, background: C.achtergrond, padding: '3px 8px', borderRadius: 6 } }, 'Pols ' + c.vitalen.hartslag),
        c.vitalen.saturatie && React.createElement('span', { style: { fontSize: 12, color: c.vitalen.saturatie < 94 ? C.oranje : C.tekstSecundair, background: C.achtergrond, padding: '3px 8px', borderRadius: 6 } }, 'SpO2 ' + c.vitalen.saturatie + '%'),
        c.vitalen.temperatuur && React.createElement('span', { style: { fontSize: 12, color: C.tekstSecundair, background: C.achtergrond, padding: '3px 8px', borderRadius: 6 } }, c.vitalen.temperatuur + '\u00B0C'),
        c.vitalen.bloeddruk && React.createElement('span', { style: { fontSize: 12, color: C.tekstSecundair, background: C.achtergrond, padding: '3px 8px', borderRadius: 6 } }, 'RR ' + c.vitalen.bloeddruk),
        c.vitalen.bewustzijn && React.createElement('span', { style: { fontSize: 12, color: c.vitalen.bewustzijn !== 'Alert' ? C.oranje : C.tekstSecundair, background: C.achtergrond, padding: '3px 8px', borderRadius: 6 } }, 'AVPU: ' + c.vitalen.bewustzijn)
      )
    ),

    // Video call
    c.videoCall && React.createElement('div', { style: { background: C.kaartWit, borderRadius: 12, padding: 14, marginBottom: 12, border: '1px solid ' + C.blauw } },
      React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' } },
        React.createElement('div', null,
          React.createElement('div', { style: { fontSize: 13, fontWeight: 600, color: C.blauw } }, 'Videoconsult'),
          React.createElement('div', { style: { fontSize: 12, color: C.tekstSecundair } }, c.videoCall.gepland + ' \u00B7 ' + (c.arts || c.toewijzing)),
          React.createElement('div', { style: { fontSize: 11, color: C.tekstMuted } }, 'Status: ' + c.videoCall.status)
        ),
        React.createElement('button', { onClick: function() { addToast('Videoconsult wordt gestart...', 'success'); }, style: {
          background: C.blauw, color: '#FFFFFF', border: 'none', borderRadius: 8, padding: '10px 16px', fontSize: 13, fontWeight: 600, cursor: 'pointer',
        } }, '\uD83D\uDCF9 Deelnemen')
      )
    ),

    // Informatie verzoeken
    c.informatieVerzoeken && c.informatieVerzoeken.length > 0 && React.createElement('div', { style: { background: C.kaartWit, borderRadius: 12, padding: 14, marginBottom: 12, border: '1px solid ' + C.border } },
      React.createElement('div', { style: { fontSize: 13, fontWeight: 600, color: C.tekstSecundair, marginBottom: 8 } }, 'Aanvullende informatie'),
      c.informatieVerzoeken.map(function(iv) {
        var st = infoStatus(iv.status);
        return React.createElement('div', { key: iv.id, style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid ' + C.border } },
          React.createElement('div', { style: { flex: 1 } },
            React.createElement('div', { style: { fontSize: 13, color: C.tekstPrimair } }, iv.item),
            iv.aangeleverdDoor && React.createElement('div', { style: { fontSize: 11, color: C.tekstMuted } }, 'Door ' + iv.aangeleverdDoor + ', ' + iv.aangeleverdOm),
            iv.aangevraagdBij && iv.status !== 'aangeleverd' && React.createElement('div', { style: { fontSize: 11, color: C.tekstMuted } }, 'Bij: ' + iv.aangevraagdBij)
          ),
          React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 6 } },
            React.createElement(Badge, { label: st.label, color: st.kleur, bgColor: st.bg }),
            !readOnly && iv.status !== 'aangeleverd' && React.createElement(FotoUpload, { label: 'Upload', addToast: addToast })
          )
        );
      })
    ),

    // Tijdlijn
    React.createElement('div', { style: { background: C.kaartWit, borderRadius: 12, padding: 14, marginBottom: 12, border: '1px solid ' + C.border } },
      React.createElement('div', { style: { fontSize: 13, fontWeight: 600, color: C.tekstSecundair, marginBottom: 10 } }, 'Verloop'),
      c.tijdlijn && c.tijdlijn.map(function(t, i) {
        var ic = tijdlijnIcon(t.type);
        return React.createElement('div', { key: i, style: { display: 'flex', gap: 10, marginBottom: i < c.tijdlijn.length - 1 ? 0 : 0 } },
          // Lijn + bolletje
          React.createElement('div', { style: { display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 24 } },
            React.createElement('div', { style: { width: 24, height: 24, borderRadius: 12, background: ic.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: ic.kleur, flexShrink: 0 } }, ic.letter),
            i < c.tijdlijn.length - 1 && React.createElement('div', { style: { width: 1, flex: 1, background: C.border, minHeight: 16 } })
          ),
          // Content
          React.createElement('div', { style: { flex: 1, paddingBottom: 12 } },
            React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' } },
              React.createElement('span', { style: { fontSize: 12, fontWeight: 500, color: C.tekstPrimair } }, t.door),
              React.createElement('span', { style: { fontSize: 11, color: C.tekstMuted } }, t.tijd)
            ),
            React.createElement('div', { style: { fontSize: 13, color: C.tekstSecundair, lineHeight: 1.5, marginTop: 2 } }, t.tekst),
            t.verzoekType === 'video_call' && React.createElement('div', { style: { fontSize: 11, color: C.blauw, marginTop: 4, fontWeight: 500 } }, '\uD83D\uDCF9 Gepland: ' + t.verzoekTijd),
            t.verzoekItems && React.createElement('div', { style: { marginTop: 4 } },
              t.verzoekItems.map(function(item, j) {
                return React.createElement('div', { key: j, style: { fontSize: 11, color: C.tekstMuted, paddingLeft: 8, borderLeft: '2px solid ' + C.border, marginTop: 2 } }, item);
              })
            )
          )
        );
      }),

      // Bericht sturen (alleen verzorgende)
      !readOnly && React.createElement('div', { style: { marginTop: 8, paddingTop: 10, borderTop: '1px solid ' + C.border } },
        React.createElement('div', { style: { display: 'flex', gap: 8 } },
          React.createElement('input', {
            value: nieuwBericht,
            onChange: function(e) { setNieuwBericht(e.target.value); },
            placeholder: 'Bericht aan behandelaar...',
            onKeyDown: function(e) { if (e.key === 'Enter' && nieuwBericht.trim()) { addToast('Bericht verzonden' + (deelMetFamilie ? ' (ook gedeeld met familie)' : ''), 'success'); setNieuwBericht(''); } },
            style: { flex: 1, padding: '10px 12px', borderRadius: 8, border: '1px solid ' + C.border, fontSize: 13, fontFamily: "'DM Sans', sans-serif", outline: 'none', color: C.tekstPrimair }
          }),
          React.createElement('button', {
            onClick: function() { if (nieuwBericht.trim()) { addToast('Bericht verzonden' + (deelMetFamilie ? ' (ook gedeeld met familie)' : ''), 'success'); setNieuwBericht(''); } },
            style: { background: C.oranje, color: '#FFFFFF', border: 'none', borderRadius: 8, padding: '10px 14px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }
          }, ui('stuur'))
        ),
        // Deel met familie vinkje
        React.createElement('label', { style: { display: 'flex', alignItems: 'center', gap: 6, marginTop: 8, cursor: 'pointer', fontSize: 12, color: C.tekstSecundair } },
          React.createElement('input', {
            type: 'checkbox', checked: deelMetFamilie,
            onChange: function() { setDeelMetFamilie(!deelMetFamilie); },
            style: { accentColor: C.oranje, width: 16, height: 16, cursor: 'pointer' }
          }),
          ui('deelMetFamilie')
        )
      )
    ),

    // Discriminatoren
    c.discriminatoren && c.discriminatoren.length > 0 && React.createElement('div', { style: { background: C.kaartWit, borderRadius: 12, padding: 14, marginBottom: 12, border: '1px solid ' + C.border } },
      React.createElement('div', { style: { fontSize: 13, fontWeight: 600, color: C.tekstSecundair, marginBottom: 8 } }, 'Triage-antwoorden'),
      c.discriminatoren.map(function(d, i) {
        return React.createElement('div', { key: i, style: { padding: '4px 0' } },
          React.createElement('div', { style: { fontSize: 12, color: C.tekstMuted } }, d.vraag),
          React.createElement('div', { style: { fontSize: 13, color: C.tekstPrimair } }, d.antwoord)
        );
      })
    )
  );
};

// ── EPD Viewer (via NUTS koppeling) ──
window.EpdViewer = function EpdViewer({ bewonerId, onSluit }) {
  var { useState } = React;
  var [tab, setTab] = useState('patient'); // null = alles dicht, of id = die sectie open
  var [toonMeerVitalen, setToonMeerVitalen] = useState(false);
  var epd = window.epdGegevens && window.epdGegevens[bewonerId];
  var bew = window.bewoners.find(function(b) { return b.id === bewonerId; });
  if (!epd || !bew) return null;

  var p = epd.patient;
  var bsnMasked = p.bsn ? '***-***-' + p.bsn.slice(-3) : 'Onbekend';
  var geslachtNL = p.geslacht === 'Male' ? 'Man' : p.geslacht === 'Female' ? 'Vrouw' : p.geslacht;

  // Vitalen: flag afwijkende waarden
  var flagBloeddruk = function(bp) {
    if (!bp) return false;
    var delen = bp.split('/');
    var sys = parseInt(delen[0]); var dia = parseInt(delen[1]);
    return sys < 90 || sys > 140 || dia < 60 || dia > 90;
  };
  var flagTemp = function(t) { return t && (t < 36.0 || t > 38.0); };
  var flagHartslag = function(h) { return h && (h < 50 || h > 100); };

  var tabs = [
    { id: 'patient', label: 'Pati\u00EBntkenmerken', count: null },
    { id: 'vitalen', label: 'Vitale functies', count: (epd.vitaleFuncties || []).length },
    { id: 'allergieen', label: 'Allergie\u00EBn', count: (epd.allergieen || []).length },
    { id: 'reanimatie', label: 'Reanimatiebeleid', count: null },
    { id: 'lab', label: 'Labresultaten', count: (epd.labresultaten || []).length },
    { id: 'medicatie', label: 'Medicatie', count: (epd.medicatie || []).length },
  ];

  // Accordion header helper
  var AccHeader = function(tabId, label, count, waarschuwing) {
    var isOpen = tab === tabId;
    return React.createElement('div', { onClick: function() { setTab(isOpen ? null : tabId); }, style: {
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '12px 14px', cursor: 'pointer', background: C.kaartWit, borderRadius: isOpen ? '12px 12px 0 0' : 12,
      border: '1px solid ' + C.border, marginBottom: isOpen ? 0 : 6,
    } },
      React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 8 } },
        React.createElement('span', { style: { fontSize: 13, fontWeight: 600, color: C.tekstPrimair } }, label),
        count !== null && count !== undefined && React.createElement('span', { style: { fontSize: 11, color: C.tekstMuted, background: C.achtergrond, padding: '1px 6px', borderRadius: 8 } }, count),
        waarschuwing && React.createElement('div', { style: { width: 8, height: 8, borderRadius: 4, background: C.oranje } })
      ),
      React.createElement('span', { style: { fontSize: 12, color: C.tekstMuted, transition: 'transform 0.2s', transform: isOpen ? 'rotate(90deg)' : 'none' } }, '\u25B6')
    );
  };

  var Rij = function(label, waarde, extra) {
    return React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: '1px solid ' + C.border } },
      React.createElement('span', { style: { fontSize: 12, color: C.tekstMuted } }, label),
      React.createElement('span', { style: Object.assign({ fontSize: 13, color: C.tekstPrimair, fontWeight: 500, textAlign: 'right' }, extra || {}) }, waarde || '\u2014')
    );
  };

  return React.createElement('div', { style: { animation: 'slideInRight 0.3s ease' } },
    React.createElement('button', { onClick: onSluit, style: { background: 'none', border: 'none', fontSize: 14, color: C.tekstSecundair, cursor: 'pointer', marginBottom: 8, fontWeight: 500 } }, '\u2190 Terug'),
    // NUTS header
    React.createElement('div', { style: { background: C.blauwLicht, borderRadius: 12, padding: 14, marginBottom: 12, border: '1px solid ' + C.blauw } },
      React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' } },
        React.createElement('div', null,
          React.createElement('div', { style: { fontSize: 11, fontWeight: 600, color: C.blauw } }, '\uD83D\uDD12 NUTS Pati\u00EBntdata'),
          React.createElement('div', { style: { fontSize: 16, fontWeight: 700, color: C.tekstPrimair } }, p.voornaam + ' ' + p.achternaam),
          React.createElement('div', { style: { fontSize: 12, color: C.tekstSecundair } }, 'BSN ' + bsnMasked + ' \u00B7 ' + bew.afdeling + ' Kamer ' + bew.kamer)
        ),
        React.createElement('div', { style: { textAlign: 'right' } },
          React.createElement('div', { style: { fontSize: 11, color: C.tekstMuted } }, 'Zorgverlener'),
          React.createElement('div', { style: { fontSize: 11, color: C.tekstSecundair } }, epd.zorgverlener.naam)
        )
      )
    ),
    // Accordion: Pati\u00EBntkenmerken
    AccHeader('patient', 'Pati\u00EBntkenmerken', null, false),
    tab === 'patient' && React.createElement('div', { style: { background: C.kaartWit, padding: 14, borderRadius: '0 0 12px 12px', border: '1px solid ' + C.border, borderTop: 'none', marginBottom: 6 } },
      React.createElement('div', { style: { fontSize: 13, fontWeight: 600, color: C.tekstSecundair, marginBottom: 8 } }, 'Pati\u00EBntkenmerken'),
      Rij('Voornaam', p.voornaam),
      Rij('Achternaam', p.achternaam),
      Rij('Geslacht', geslachtNL),
      Rij('Geboortedatum', p.geboortedatum),
      Rij('Postcode', p.zipcode),
      Rij('BSN', bsnMasked),
      React.createElement('div', { style: { fontSize: 13, fontWeight: 600, color: C.tekstSecundair, marginTop: 12, marginBottom: 6 } }, 'Contactpersoon'),
      Rij('Naam', epd.contactpersoon.voornaam + ' ' + epd.contactpersoon.achternaam),
      Rij('Relatie', epd.contactpersoon.relatie),
      React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', padding: '4px 0' } },
        React.createElement('span', { style: { fontSize: 12, color: C.tekstMuted } }, 'Telefoon'),
        React.createElement('a', { href: 'tel:' + epd.contactpersoon.telefoonnummer, style: { fontSize: 13, color: C.blauw, fontWeight: 500, textDecoration: 'none' } }, epd.contactpersoon.telefoonnummer)
      ),
      React.createElement('div', { style: { fontSize: 13, fontWeight: 600, color: C.tekstSecundair, marginTop: 12, marginBottom: 6 } }, 'Zorgverlener'),
      Rij('Naam', epd.zorgverlener.naam),
      Rij('Organisatie', epd.zorgverlener.organizationName),
      Rij('Vektis ID', epd.zorgverlener.organizationId)
    ),

    // TAB: Vitale functies
    // Accordion: Vitale functies
    AccHeader('vitalen', 'Vitale functies', (epd.vitaleFuncties || []).length, false),
    tab === 'vitalen' && React.createElement('div', { style: { background: C.kaartWit, padding: 12, borderRadius: '0 0 12px 12px', border: '1px solid ' + C.border, borderTop: 'none', marginBottom: 6 } },
      (!epd.vitaleFuncties || epd.vitaleFuncties.length === 0)
        ? React.createElement('div', { style: { fontSize: 13, color: C.tekstMuted, textAlign: 'center', padding: '20px 0' } }, 'Geen vitale functies beschikbaar')
        : (toonMeerVitalen ? epd.vitaleFuncties : epd.vitaleFuncties.slice(0, 5)).map(function(v, i) {
          var bpFlag = flagBloeddruk(v.bloeddruk);
          var tFlag = flagTemp(v.temperatuur);
          var hFlag = flagHartslag(v.hartslag);
          var d = new Date(v.datum);
          var datumStr = d.toLocaleDateString('nl-NL', { day: 'numeric', month: 'short', year: 'numeric' }) + ' ' + d.toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' });
          return React.createElement(Card, { key: i, style: { padding: 10 } },
            React.createElement('div', { style: { fontSize: 12, fontWeight: 600, color: C.tekstSecundair, marginBottom: 6 } }, datumStr),
            v.bloeddruk && React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', padding: '2px 0' } },
              React.createElement('span', { style: { fontSize: 12, color: C.tekstMuted } }, 'Bloeddruk'),
              React.createElement('span', { style: { fontSize: 13, fontWeight: 500, color: bpFlag ? C.oranje : C.tekstPrimair } }, v.bloeddruk + ' mm[Hg]' + (bpFlag ? ' \u26A0' : ''))
            ),
            v.temperatuur && React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', padding: '2px 0' } },
              React.createElement('span', { style: { fontSize: 12, color: C.tekstMuted } }, 'Temperatuur'),
              React.createElement('span', { style: { fontSize: 13, fontWeight: 500, color: tFlag ? C.oranje : C.tekstPrimair } }, v.temperatuur + ' \u00B0C' + (tFlag ? ' \u26A0' : ''))
            ),
            v.hartslag && React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', padding: '2px 0' } },
              React.createElement('span', { style: { fontSize: 12, color: C.tekstMuted } }, 'Hartslag'),
              React.createElement('span', { style: { fontSize: 13, fontWeight: 500, color: hFlag ? C.oranje : C.tekstPrimair } }, v.hartslag + ' bpm' + (hFlag ? ' \u26A0' : ''))
            )
          );
        }),
      epd.vitaleFuncties && epd.vitaleFuncties.length > 5 && !toonMeerVitalen && React.createElement('button', {
        onClick: function() { setToonMeerVitalen(true); },
        style: { background: 'none', border: '1px solid ' + C.border, borderRadius: 8, padding: '8px', fontSize: 12, color: C.tekstSecundair, cursor: 'pointer', width: '100%' }
      }, 'Toon meer (' + (epd.vitaleFuncties.length - 5) + ' ouder)')
    ),

    // TAB: Allergie\u00EBn
    // Accordion: Allergie\u00EBn
    AccHeader('allergieen', 'Allergie\u00EBn', (epd.allergieen || []).length, epd.allergieen && epd.allergieen.some(function(a) { return a.kritiekheid === 'High'; })),
    tab === 'allergieen' && React.createElement('div', { style: { background: C.kaartWit, padding: 12, borderRadius: '0 0 12px 12px', border: '1px solid ' + C.border, borderTop: 'none', marginBottom: 6 } },
      epd.allergieen && epd.allergieen.some(function(a) { return a.kritiekheid === 'High'; }) && React.createElement('div', { style: { background: C.oranjeLicht, border: '1px solid ' + C.oranje, borderRadius: 8, padding: '8px 12px', marginBottom: 10, fontSize: 12, color: C.oranje, fontWeight: 600 } }, '\u26A0 Pati\u00EBnt heeft een allergie met hoge kritiekheid'),
      (!epd.allergieen || epd.allergieen.length === 0)
        ? React.createElement('div', { style: { fontSize: 13, color: C.groen, textAlign: 'center', padding: '20px 0' } }, 'Geen bekende allergie\u00EBn')
        : epd.allergieen.map(function(a, i) {
          var kritKleur = a.kritiekheid === 'High' ? C.oranje : a.kritiekheid === 'Medium' ? C.oranje : C.tekstMuted;
          var kritBg = a.kritiekheid === 'High' ? C.oranjeLicht : 'transparent';
          var kritBorder = a.kritiekheid === 'High' ? C.oranje : a.kritiekheid === 'Medium' ? C.oranje : C.border;
          return React.createElement(Card, { key: i, style: { padding: 12 } },
            React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 } },
              React.createElement('span', { style: { fontSize: 14, fontWeight: 600, color: C.tekstPrimair } }, a.stof),
              React.createElement('span', { style: { fontSize: 11, fontWeight: 600, color: kritKleur, background: kritBg, border: '1px solid ' + kritBorder, padding: '2px 8px', borderRadius: 10 } }, a.kritiekheid)
            ),
            React.createElement('div', { style: { fontSize: 12, color: C.tekstSecundair } }, a.categorie + ' \u00B7 ' + a.reactie),
            a.ernst && React.createElement('div', { style: { fontSize: 12, color: C.tekstSecundair } }, 'Ernst: ' + a.ernst),
            React.createElement('div', { style: { fontSize: 11, color: C.tekstMuted, marginTop: 4 } }, 'Sinds: ' + a.aanvangsdatum),
            a.notitie && React.createElement('div', { style: { fontSize: 11, color: C.tekstMuted, fontStyle: 'italic', marginTop: 2 } }, a.notitie)
          );
        })
    ),

    // TAB: Reanimatiebeleid
    // Accordion: Reanimatiebeleid
    AccHeader('reanimatie', 'Reanimatiebeleid', null, epd.reanimatiebeleid && epd.reanimatiebeleid.soort && epd.reanimatiebeleid.soort.toLowerCase().indexOf('niet reanimeren') !== -1),
    tab === 'reanimatie' && React.createElement('div', { style: { background: C.kaartWit, padding: 12, borderRadius: '0 0 12px 12px', border: '1px solid ' + C.border, borderTop: 'none', marginBottom: 6 } },
      !epd.reanimatiebeleid
        ? React.createElement('div', { style: { fontSize: 13, color: C.tekstMuted, textAlign: 'center', padding: '20px 0' } }, 'Geen reanimatiebeleid geregistreerd')
        : React.createElement('div', null,
          epd.reanimatiebeleid.soort && epd.reanimatiebeleid.soort.toLowerCase().indexOf('niet reanimeren') !== -1 && React.createElement('div', { style: { background: C.roodLicht, border: '1px solid ' + C.rood, borderRadius: 8, padding: '10px 12px', marginBottom: 10, fontSize: 13, color: C.rood, fontWeight: 600 } }, '\u26A0 ' + epd.reanimatiebeleid.soort),
          React.createElement(Card, { style: { padding: 14 } },
            React.createElement('div', { style: { fontSize: 16, fontWeight: 700, color: C.tekstPrimair, marginBottom: 8 } }, epd.reanimatiebeleid.soort),
            Rij('Datum', epd.reanimatiebeleid.datum),
            epd.reanimatiebeleid.aandoening && Rij('Aandoening', epd.reanimatiebeleid.aandoening),
            epd.reanimatiebeleid.opmerking && Rij('Opmerking', epd.reanimatiebeleid.opmerking),
            epd.reanimatiebeleid.vertegenwoordiger && Rij('Vertegenwoordiger', epd.reanimatiebeleid.vertegenwoordiger),
            epd.reanimatiebeleid.policyUrl && React.createElement('a', { href: epd.reanimatiebeleid.policyUrl, target: '_blank', style: { display: 'block', marginTop: 8, fontSize: 12, color: C.blauw, textDecoration: 'none' } }, '\uD83D\uDD17 Bekijk beleidsdocument')
          )
        )
    ),

    // TAB: Lab
    // Accordion: Lab
    AccHeader('lab', 'Labresultaten', (epd.labresultaten || []).length, epd.labresultaten && epd.labresultaten.some(function(l) { return l.afwijkend; })),
    tab === 'lab' && React.createElement('div', { style: { background: C.kaartWit, padding: 0, borderRadius: '0 0 12px 12px', border: '1px solid ' + C.border, borderTop: 'none', marginBottom: 6, overflow: 'hidden' } },
      (!epd.labresultaten || epd.labresultaten.length === 0)
        ? React.createElement('div', { style: { fontSize: 13, color: C.tekstMuted, textAlign: 'center', padding: '20px 0' } }, 'Geen recente labresultaten')
        : epd.labresultaten.map(function(l, i) {
            return React.createElement('div', { key: i, style: { display: 'flex', alignItems: 'center', padding: '8px 12px', borderBottom: i < epd.labresultaten.length - 1 ? '1px solid ' + C.border : 'none', background: l.afwijkend ? C.roodLicht : 'transparent' } },
              React.createElement('div', { style: { flex: 1 } },
                React.createElement('div', { style: { fontSize: 13, fontWeight: l.afwijkend ? 600 : 400, color: l.afwijkend ? C.rood : C.tekstPrimair } }, l.bepaling),
                React.createElement('div', { style: { fontSize: 11, color: C.tekstMuted } }, l.datum)
              ),
              React.createElement('div', { style: { textAlign: 'right' } },
                React.createElement('div', { style: { fontSize: 14, fontWeight: 600, color: l.afwijkend ? C.rood : C.tekstPrimair } }, l.waarde + ' ' + l.eenheid),
                React.createElement('div', { style: { fontSize: 10, color: C.tekstMuted } }, 'ref: ' + l.referentie)
              )
            );
          })
    ),

    // TAB: Medicatie
    // Accordion: Medicatie
    AccHeader('medicatie', 'Medicatie', (epd.medicatie || []).length, false),
    tab === 'medicatie' && React.createElement('div', { style: { background: C.kaartWit, padding: 12, borderRadius: '0 0 12px 12px', border: '1px solid ' + C.border, borderTop: 'none', marginBottom: 6 } },
      epd.medicatie.map(function(m, i) {
        return React.createElement(Card, { key: i, style: { padding: 12 } },
          React.createElement('div', { style: { fontSize: 14, fontWeight: 600, color: C.tekstPrimair } }, m.naam),
          React.createElement('div', { style: { fontSize: 13, color: C.tekstSecundair } }, m.dosering),
          React.createElement('div', { style: { fontSize: 12, color: C.tekstMuted, marginTop: 4 } }, m.indicatie + ' \u00B7 ' + m.voorschrijver),
          m.opmerking && React.createElement('div', { style: { fontSize: 11, color: C.oranje, marginTop: 4, fontWeight: 500 } }, '\u26A0 ' + m.opmerking)
        );
      })
    )
  );
};
