// GeriCall CareTaker Portal — Main App
// Drie omgevingen: Verzorgende, Familie (per lid), Patiënt

const { useState, useEffect, useCallback } = React;
const C = window.COLORS;

// ── Shared: Dutch date + greeting ──
function formatDatum() {
  const d = new Date();
  const dagen = ['zondag','maandag','dinsdag','woensdag','donderdag','vrijdag','zaterdag'];
  const maanden = ['januari','februari','maart','april','mei','juni','juli','augustus','september','oktober','november','december'];
  return dagen[d.getDay()] + ' ' + d.getDate() + ' ' + maanden[d.getMonth()] + ' ' + d.getFullYear();
}
function begroeting() {
  const u = new Date().getHours();
  if (u < 12) return 'Goedemorgen';
  if (u < 18) return 'Goedemiddag';
  return 'Goedenavond';
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
// STAP 1: ROLKEUZE — Verzorgende of Familie?
// ══════════════════════════════════════════
function RolKeuze({ onKies }) {
  return (
    <div style={{ minHeight: '100vh', background: C.achtergrond, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ maxWidth: 420, width: '100%', padding: '32px 24px', textAlign: 'center' }}>
        <GeriCallLogoBig />
        <div style={{ fontSize: 15, color: C.tekstSecundair, marginBottom: 32, lineHeight: 1.5 }}>
          Samen zorgen voor <strong style={{ color: C.tekstPrimair }}>{window.patient.naam}</strong>
        </div>

        <div onClick={() => onKies('verzorgende')} style={{
          background: C.kaartWit, border: '2px solid ' + C.border, borderRadius: 16, padding: 20, marginBottom: 12,
          cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s',
        }} onMouseOver={e => e.currentTarget.style.borderColor = C.oranje} onMouseOut={e => e.currentTarget.style.borderColor = C.border}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: C.oranjeLicht, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>&#x1F469;&#x200D;&#x2695;&#xFE0F;</div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 700, color: C.tekstPrimair }}>Ik ben verzorgende</div>
              <div style={{ fontSize: 13, color: C.tekstSecundair }}>Taken, rapportage &amp; meldingen</div>
            </div>
          </div>
        </div>

        <div onClick={() => onKies('familie_keuze')} style={{
          background: C.kaartWit, border: '2px solid ' + C.border, borderRadius: 16, padding: 20, marginBottom: 12,
          cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s',
        }} onMouseOver={e => e.currentTarget.style.borderColor = C.groen} onMouseOut={e => e.currentTarget.style.borderColor = C.border}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: C.groenLicht, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>&#x1F468;&#x200D;&#x1F467;</div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 700, color: C.tekstPrimair }}>Ik ben familie / pati&euml;nt</div>
              <div style={{ fontSize: 13, color: C.tekstSecundair }}>Meekijken, plannen &amp; samenwerken</div>
            </div>
          </div>
        </div>

        <div style={{ fontSize: 11, color: C.tekstMuted, marginTop: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
          <GeriCallLogoImg size={14} />
          <span>GeriCall CareTaker Portal v3 &middot; Prototype</span>
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════
// STAP 2: WIE BEN JE? (familie selectie)
// ══════════════════════════════════════════
function FamilieKeuze({ onKies, onTerug }) {
  const leden = window.familieleden;
  return (
    <div style={{ minHeight: '100vh', background: C.achtergrond, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ maxWidth: 420, width: '100%', padding: '32px 24px' }}>
        <button onClick={onTerug} style={{ background: 'none', border: 'none', fontSize: 14, color: C.tekstMuted, cursor: 'pointer', marginBottom: 16 }}>&larr; Terug</button>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{ display: 'inline-block', marginBottom: 8 }}><GeriCallLogoImg size={40} /></div>
          <div style={{ fontSize: 20, fontWeight: 700, color: C.tekstPrimair }}>Wie ben je?</div>
          <div style={{ fontSize: 14, color: C.tekstSecundair, marginTop: 4 }}>
            Selecteer je naam om in te loggen
          </div>
        </div>

        {leden.map(function(lid) {
          return (
            <div key={lid.id} onClick={() => onKies(lid)} style={{
              background: C.kaartWit, border: '2px solid ' + C.border, borderRadius: 14, padding: 16, marginBottom: 10,
              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 14, transition: 'all 0.2s',
            }} onMouseOver={e => e.currentTarget.style.borderColor = lid.kleur} onMouseOut={e => e.currentTarget.style.borderColor = C.border}>
              <div style={{
                width: 44, height: 44, borderRadius: 22, background: lid.kleur + '18',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 16, fontWeight: 700, color: lid.kleur, flexShrink: 0,
              }}>{lid.initialen}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 16, fontWeight: 600, color: C.tekstPrimair }}>{lid.roepnaam}</div>
                <div style={{ fontSize: 13, color: C.tekstSecundair }}>{lid.relatie}{lid.isPatient ? '' : ' van ' + window.patient.roepnaam}{lid.isHoofdcontact ? ' \u00B7 1e contactpersoon' : ''}</div>
              </div>
              {lid.isPatient && <span style={{ fontSize: 11, background: C.oranjeLicht, color: C.oranje, padding: '2px 8px', borderRadius: 4, fontWeight: 600 }}>Pati&euml;nt</span>}
            </div>
          );
        })}
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
  const [selectedBewoner, setSelectedBewoner] = useState(null);
  const verzorgendeNaam = 'Sandra B.';

  const handleTab = (t) => { setTab(t); setSelectedBewoner(null); window.scrollTo({ top: 0, behavior: 'smooth' }); };
  const tabs = [
    { id: 'taken', icon: '\u2705', label: 'Wijk' },
    { id: 'rapportage', icon: '\u270D\uFE0F', label: 'Rapportage' },
    { id: 'melding', icon: '\uD83D\uDD14', label: 'Melding' },
    { id: 'leren', icon: '\uD83D\uDCDA', label: 'Leren' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: C.achtergrond }}>
      <div style={{ maxWidth: 420, margin: '0 auto', padding: '0 16px 100px', minHeight: '100vh' }}>
        <div style={{ padding: '12px 0 8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <GeriCallLogo />
            <span style={{ fontSize: 11, fontWeight: 600, color: C.oranje, background: C.oranjeLicht, padding: '2px 8px', borderRadius: 4 }}>ZORG</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 12, color: C.tekstSecundair }}>{verzorgendeNaam}</span>
            <button onClick={onUitloggen} style={{ background: 'none', border: 'none', fontSize: 12, color: C.tekstMuted, cursor: 'pointer' }}>Uit</button>
          </div>
        </div>

        {/* Wijk header (alleen op wijkoverzicht) */}
        {tab === 'taken' && !selectedBewoner && (
          <Card style={{ background: C.oranjeLicht, border: 'none', padding: 12 }}>
            <div style={{ fontSize: 13, fontWeight: 500, color: C.oranjeDonker }}>Dienst vandaag &middot; Afdeling Zonnehof</div>
            <div style={{ fontSize: 15, fontWeight: 700, color: C.tekstPrimair }}>{window.bewoners.length} bewoners in uw wijk</div>
            <div style={{ fontSize: 12, color: C.tekstSecundair }}>{formatDatum()}</div>
          </Card>
        )}

        {/* Content */}
        {tab === 'taken' && !selectedBewoner && <VerzorgendeTaken addToast={addToast} onSelectBewoner={(b) => { setSelectedBewoner(b); window.scrollTo({ top: 0, behavior: 'smooth' }); }} />}
        {tab === 'taken' && selectedBewoner && <BewonerDetail bewoner={selectedBewoner} addToast={addToast} onTerug={() => setSelectedBewoner(null)} verzorgendeNaam={verzorgendeNaam} />}
        {tab === 'rapportage' && <VerzorgendeRapportage addToast={addToast} />}
        {tab === 'melding' && <SectionMelding addToast={addToast} />}
        {tab === 'leren' && <VerzorgendeLeren addToast={addToast} />}
      </div>
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
// APP FAMILIE — per ingelogd familielid
// ══════════════════════════════════════════
function AppFamilie({ lid, onUitloggen }) {
  const [tab, setTab] = useState('overzicht');
  const [toasts, addToast] = useToasts();
  const handleTab = (t) => { setTab(t); window.scrollTo({ top: 0, behavior: 'smooth' }); };

  // Patiënt zelf krijgt vereenvoudigde tabs
  const isPatient = lid.isPatient;

  const tabs = isPatient ? [
    { id: 'overzicht', icon: '\u2764\uFE0F', label: 'Mijn dag' },
    { id: 'week', icon: '\uD83D\uDCC5', label: 'Wie komt?' },
    { id: 'berichten', icon: '\uD83D\uDCAC', label: 'Familie' },
  ] : [
    { id: 'overzicht', icon: '\u2764\uFE0F', label: window.patient.roepnaam },
    { id: 'week', icon: '\uD83D\uDCC5', label: 'Planning' },
    { id: 'berichten', icon: '\uD83D\uDCAC', label: 'Familie chat' },
    { id: 'leren', icon: '\uD83D\uDCDA', label: 'Leren' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: C.achtergrond }}>
      <div style={{ maxWidth: 420, margin: '0 auto', padding: '0 16px 100px', minHeight: '100vh' }}>
        {/* Header */}
        <div style={{ padding: '12px 0 8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <GeriCallLogo />
            <span style={{ fontSize: 11, fontWeight: 600, color: C.groen, background: C.groenLicht, padding: '2px 8px', borderRadius: 4 }}>{isPatient ? 'MIJN PORTAL' : 'FAMILIE'}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 28, height: 28, borderRadius: 14, background: lid.kleur + '22', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: lid.kleur }}>{lid.initialen}</div>
            <button onClick={onUitloggen} style={{ background: 'none', border: 'none', fontSize: 12, color: C.tekstMuted, cursor: 'pointer' }}>Wissel</button>
          </div>
        </div>

        {/* Greeting — personalized */}
        <Card style={{ background: isPatient ? C.oranjeLicht : C.groenLicht, border: 'none', padding: 16 }}>
          <div style={{ fontSize: 13, color: isPatient ? C.oranje : C.groen, fontWeight: 500 }}>{begroeting()} {lid.roepnaam}</div>
          <div style={{ fontSize: 18, fontWeight: 700, color: C.tekstPrimair, marginTop: 2 }}>
            {isPatient ? 'Hoe gaat het vandaag?' : 'Hoe gaat het met ' + window.patient.roepnaam + '?'}
          </div>
          <div style={{ fontSize: 13, color: C.tekstSecundair, marginTop: 4 }}>{formatDatum()}</div>
        </Card>

        {/* Content */}
        {tab === 'overzicht' && <FamilieOverzicht lid={lid} addToast={addToast} />}
        {tab === 'week' && <FamilieWeekplan lid={lid} addToast={addToast} />}
        {tab === 'berichten' && <FamilieBerichten lid={lid} addToast={addToast} />}
        {tab === 'leren' && !isPatient && <FamilieLeren addToast={addToast} />}
      </div>

      <nav style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: C.kaartWit, borderTop: '1px solid ' + C.border, display: 'flex', zIndex: 800, paddingBottom: 'env(safe-area-inset-bottom, 12px)' }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => handleTab(t.id)} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '10px 0 6px', background: 'none', border: 'none', cursor: 'pointer', color: tab === t.id ? (isPatient ? C.oranje : C.groen) : C.tekstMuted, transition: 'color 0.2s' }}>
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
// ROOT APP — state machine
// ══════════════════════════════════════════
function App() {
  const [scherm, setScherm] = useState('rolkeuze');
  const [familieLid, setFamilieLid] = useState(null);

  if (scherm === 'rolkeuze') {
    return <RolKeuze onKies={(rol) => {
      if (rol === 'verzorgende') setScherm('verzorgende');
      else setScherm('familie_keuze');
    }} />;
  }
  if (scherm === 'familie_keuze') {
    return <FamilieKeuze
      onKies={(lid) => { setFamilieLid(lid); setScherm('familie'); }}
      onTerug={() => setScherm('rolkeuze')}
    />;
  }
  if (scherm === 'verzorgende') {
    return <AppVerzorgende onUitloggen={() => setScherm('rolkeuze')} />;
  }
  if (scherm === 'familie') {
    return <AppFamilie lid={familieLid} onUitloggen={() => { setFamilieLid(null); setScherm('rolkeuze'); }} />;
  }
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(App));
