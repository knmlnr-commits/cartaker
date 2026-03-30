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
// Rustig ontwerp: gekleurde bolletjes + tekst, geen emoji's
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
    // Huidige stemming
    React.createElement('div', { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between' } },
      React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 10 } },
        React.createElement('div', { style: { width: 12, height: 12, borderRadius: 6, background: huidige.kleur, flexShrink: 0 } }),
        React.createElement('div', null,
          React.createElement('span', { style: { fontSize: 14, fontWeight: 500, color: C.tekstPrimair } }, huidige.label),
          React.createElement('span', { style: { fontSize: 12, color: C.tekstMuted, marginLeft: 8 } }, stemming.door + ', ' + stemming.tijd)
        )
      ),
      React.createElement('button', {
        onClick: function() { setKiezen(!kiezen); },
        style: { background: 'none', border: '1px solid ' + C.border, borderRadius: 6, padding: '4px 10px', fontSize: 12, color: C.tekstSecundair, cursor: 'pointer' }
      }, kiezen ? 'Annuleer' : 'Wijzig')
    ),

    // Keuze
    kiezen && React.createElement('div', { style: { marginTop: 12, paddingTop: 12, borderTop: '1px solid ' + C.border } },
      React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', gap: 6 } },
        opties.map(function(o) {
          var actief = o.score === stemming.score;
          return React.createElement('button', {
            key: o.score,
            onClick: function() { updateStemming(o); },
            style: {
              flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
              padding: '10px 2px', borderRadius: 8, cursor: 'pointer', transition: 'all 0.15s',
              background: actief ? C.achtergrond : 'transparent',
              border: '1px solid ' + (actief ? C.tekstMuted : 'transparent'),
            }
          },
            React.createElement('div', { style: { width: 14, height: 14, borderRadius: 7, background: o.kleur, transition: 'transform 0.15s', transform: actief ? 'scale(1.3)' : 'scale(1)' } }),
            React.createElement('span', { style: { fontSize: 10, color: C.tekstSecundair, fontWeight: actief ? 600 : 400 } }, o.label)
          );
        })
      )
    ),

    // Historie
    !kiezen && stemming.history && stemming.history.length > 1 && React.createElement('div', null,
      React.createElement('button', {
        onClick: function() { setShowHistorie(!showHistorie); },
        style: { background: 'none', border: 'none', fontSize: 11, color: C.tekstMuted, cursor: 'pointer', marginTop: 8, padding: 0 }
      }, showHistorie ? 'Verberg' : stemming.history.length + ' eerdere updates'),

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
            !readOnly && iv.status !== 'aangeleverd' && React.createElement('button', {
              onClick: function() { addToast('Upload functie wordt geopend...'); },
              style: { background: 'none', border: '1px solid ' + C.border, borderRadius: 6, padding: '3px 8px', fontSize: 11, color: C.tekstSecundair, cursor: 'pointer' }
            }, 'Upload')
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
          }, 'Stuur')
        ),
        // Deel met familie vinkje
        React.createElement('label', { style: { display: 'flex', alignItems: 'center', gap: 6, marginTop: 8, cursor: 'pointer', fontSize: 12, color: C.tekstSecundair } },
          React.createElement('input', {
            type: 'checkbox', checked: deelMetFamilie,
            onChange: function() { setDeelMetFamilie(!deelMetFamilie); },
            style: { accentColor: C.oranje, width: 16, height: 16, cursor: 'pointer' }
          }),
          'Deel dit bericht ook met familie'
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
