// GeriCall CareTaker Portal — Main App
// Twee gescheiden omgevingen: Verzorgende & Familie

const { useState, useEffect, useCallback } = React;
const C = window.COLORS;

// ── Shared: Dutch date ──
function formatDatum() {
  const d = new Date();
  const dagen = ['zondag','maandag','dinsdag','woensdag','donderdag','vrijdag','zaterdag'];
  const maanden = ['januari','februari','maart','april','mei','juni','juli','augustus','september','oktober','november','december'];
  return dagen[d.getDay()] + ' ' + d.getDate() + ' ' + maanden[d.getMonth()] + ' ' + d.getFullYear();
}

// ── Shared: Toast hook ──
function useToasts() {
  const [toasts, setToasts] = useState([]);
  const addToast = useCallback((message, type) => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type: type || 'info', removing: false }]);
    setTimeout(() => {
      setToasts(prev => prev.map(t => t.id === id ? { ...t, removing: true } : t));
      setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 300);
    }, 2500);
  }, []);
  return [toasts, addToast];
}

// ══════════════════════════════════════════
// ROLKEUZE SCHERM
// ══════════════════════════════════════════
function RolKeuze({ onKies }) {
  return (
    <div style={{ minHeight: '100vh', background: C.achtergrond, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ maxWidth: 420, width: '100%', padding: '32px 24px', textAlign: 'center' }}>
        <div style={{ marginBottom: 32 }}>
          <div style={{ width: 56, height: 56, borderRadius: 14, background: C.oranje, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: '#FFF', fontWeight: 800, fontSize: 28, marginBottom: 12 }}>G</div>
          <div style={{ fontSize: 24, fontWeight: 700, color: C.tekstPrimair }}>GeriCall</div>
          <div style={{ fontSize: 14, color: C.oranje, fontWeight: 600 }}>CareTaker Portal</div>
        </div>

        <div style={{ fontSize: 15, color: C.tekstSecundair, marginBottom: 32, lineHeight: 1.5 }}>
          Samen zorgen voor <strong style={{ color: C.tekstPrimair }}>Dhr. A. Jansen</strong>
        </div>

        {/* Verzorgende */}
        <div onClick={() => onKies('verzorgende')} style={{
          background: C.kaartWit, border: '2px solid ' + C.border, borderRadius: 16, padding: 20, marginBottom: 12,
          cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s',
        }} onMouseOver={e => e.currentTarget.style.borderColor = C.oranje} onMouseOut={e => e.currentTarget.style.borderColor = C.border}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: C.oranjeLicht, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>👩‍⚕️</div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 700, color: C.tekstPrimair }}>Ik ben verzorgende</div>
              <div style={{ fontSize: 13, color: C.tekstSecundair }}>Taken, rapportage & meldingen</div>
            </div>
          </div>
        </div>

        {/* Familie */}
        <div onClick={() => onKies('familie')} style={{
          background: C.kaartWit, border: '2px solid ' + C.border, borderRadius: 16, padding: 20, marginBottom: 12,
          cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s',
        }} onMouseOver={e => e.currentTarget.style.borderColor = C.groen} onMouseOut={e => e.currentTarget.style.borderColor = C.border}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: C.groenLicht, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>👨‍👧</div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 700, color: C.tekstPrimair }}>Ik ben familie</div>
              <div style={{ fontSize: 13, color: C.tekstSecundair }}>Meekijken, bezoek & samenwerken</div>
            </div>
          </div>
        </div>

        <div style={{ fontSize: 11, color: C.tekstMuted, marginTop: 24 }}>
          GeriCall CareTaker Portal v2 &middot; Prototype
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════
// APP VERZORGENDE
// ══════════════════════════════════════════
function AppVerzorgende({ onUitloggen }) {
  const [tab, setTab] = useState('taken');
  const [toasts, addToast] = useToasts();

  const handleTab = (t) => { setTab(t); window.scrollTo({ top: 0, behavior: 'smooth' }); };

  const tabs = [
    { id: 'taken', icon: '\u2705', label: 'Taken' },
    { id: 'rapportage', icon: '\u270D\uFE0F', label: 'Rapportage' },
    { id: 'melding', icon: '\uD83D\uDD14', label: 'Melding' },
    { id: 'leren', icon: '\uD83D\uDCDA', label: 'Leren' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: C.achtergrond }}>
      <div style={{ maxWidth: 420, margin: '0 auto', padding: '0 16px 100px', minHeight: '100vh' }}>

        {/* Header */}
        <div style={{ padding: '12px 0 8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <GeriCallLogo />
            <span style={{ fontSize: 11, fontWeight: 600, color: C.oranje, background: C.oranjeLicht, padding: '2px 8px', borderRadius: 4 }}>ZORG</span>
          </div>
          <button onClick={onUitloggen} style={{ background: 'none', border: 'none', fontSize: 12, color: C.tekstMuted, cursor: 'pointer' }}>Wissel rol</button>
        </div>

        {/* Quick status bar */}
        <Card style={{ background: C.oranjeLicht, border: 'none', padding: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 500, color: C.oranjeDonker }}>Dienst vandaag</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: C.tekstPrimair }}>{window.patient.naam}</div>
              <div style={{ fontSize: 12, color: C.tekstSecundair }}>{window.patient.kamer}</div>
            </div>
            <div style={{ width: 44, height: 44, borderRadius: 22, background: C.oranje, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFF', fontWeight: 700, fontSize: 16 }}>AJ</div>
          </div>
        </Card>

        {/* Content */}
        {tab === 'taken' && <VerzorgendeTaken addToast={addToast} />}
        {tab === 'rapportage' && <VerzorgendeRapportage addToast={addToast} />}
        {tab === 'melding' && <SectionMelding addToast={addToast} />}
        {tab === 'leren' && <VerzorgendeLeren addToast={addToast} />}
      </div>

      {/* Bottom nav */}
      <nav style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: C.kaartWit, borderTop: '1px solid ' + C.border, display: 'flex', zIndex: 800, paddingBottom: 'env(safe-area-inset-bottom, 12px)' }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => handleTab(t.id)} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '10px 0 6px', background: 'none', border: 'none', cursor: 'pointer', color: tab === t.id ? C.oranje : C.tekstMuted, transition: 'color 0.2s' }}>
            <span style={{ fontSize: 20, marginBottom: 2 }}>{t.icon}</span>
            <span style={{ fontSize: 11, fontWeight: tab === t.id ? 600 : 400 }}>{t.label}</span>
          </button>
        ))}
      </nav>
      <ToastContainer toasts={toasts} />
    </div>
  );
}

// ══════════════════════════════════════════
// APP FAMILIE
// ══════════════════════════════════════════
function AppFamilie({ onUitloggen }) {
  const [tab, setTab] = useState('papa');
  const [toasts, addToast] = useToasts();

  const handleTab = (t) => { setTab(t); window.scrollTo({ top: 0, behavior: 'smooth' }); };

  const tabs = [
    { id: 'papa', icon: '\u2764\uFE0F', label: 'Papa' },
    { id: 'week', icon: '\uD83D\uDCC5', label: 'Weekplan' },
    { id: 'berichten', icon: '\uD83D\uDCAC', label: 'Berichten' },
    { id: 'leren', icon: '\uD83D\uDCDA', label: 'Leren' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: C.achtergrond }}>
      <div style={{ maxWidth: 420, margin: '0 auto', padding: '0 16px 100px', minHeight: '100vh' }}>

        {/* Header — warmer, persoonlijker */}
        <div style={{ padding: '12px 0 8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <GeriCallLogo />
            <span style={{ fontSize: 11, fontWeight: 600, color: C.groen, background: C.groenLicht, padding: '2px 8px', borderRadius: 4 }}>FAMILIE</span>
          </div>
          <button onClick={onUitloggen} style={{ background: 'none', border: 'none', fontSize: 12, color: C.tekstMuted, cursor: 'pointer' }}>Wissel rol</button>
        </div>

        {/* Greeting */}
        <Card style={{ background: C.groenLicht, border: 'none', padding: 16 }}>
          <div style={{ fontSize: 13, color: C.groen, fontWeight: 500 }}>Goedemorgen Martha</div>
          <div style={{ fontSize: 18, fontWeight: 700, color: C.tekstPrimair, marginTop: 2 }}>Hoe gaat het met papa?</div>
          <div style={{ fontSize: 13, color: C.tekstSecundair, marginTop: 4 }}>{formatDatum()}</div>
        </Card>

        {/* Content */}
        {tab === 'papa' && <FamilieOverzicht addToast={addToast} />}
        {tab === 'week' && <FamilieWeekplan addToast={addToast} />}
        {tab === 'berichten' && <FamilieBerichten addToast={addToast} />}
        {tab === 'leren' && <FamilieLeren addToast={addToast} />}
      </div>

      {/* Bottom nav */}
      <nav style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: C.kaartWit, borderTop: '1px solid ' + C.border, display: 'flex', zIndex: 800, paddingBottom: 'env(safe-area-inset-bottom, 12px)' }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => handleTab(t.id)} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '10px 0 6px', background: 'none', border: 'none', cursor: 'pointer', color: tab === t.id ? C.groen : C.tekstMuted, transition: 'color 0.2s' }}>
            <span style={{ fontSize: 20, marginBottom: 2 }}>{t.icon}</span>
            <span style={{ fontSize: 11, fontWeight: tab === t.id ? 600 : 400 }}>{t.label}</span>
          </button>
        ))}
      </nav>
      <ToastContainer toasts={toasts} />
    </div>
  );
}

// ══════════════════════════════════════════
// ROOT APP
// ══════════════════════════════════════════
function App() {
  const [rol, setRol] = useState(null);

  if (!rol) return <RolKeuze onKies={setRol} />;
  if (rol === 'verzorgende') return <AppVerzorgende onUitloggen={() => setRol(null)} />;
  if (rol === 'familie') return <AppFamilie onUitloggen={() => setRol(null)} />;
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(App));
