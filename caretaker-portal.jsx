// GeriCall CareTaker Portal — Main App
// Drie omgevingen: Verzorgende, Familie (per lid), Patiënt
// Hash-based routing voor deeplinks
var APP_VERSION = 'v3.6.0';

var { useState, useEffect, useCallback } = React;
var C = window.COLORS;

// ══════════════════════════════════════════
// HASH ROUTER
// ══════════════════════════════════════════
// Routes:
//   #                          → rolkeuze
//   #verzorgende               → verzorgende wijk overzicht
//   #verzorgende/taken         → idem
//   #verzorgende/rapportage    → rapportage
//   #verzorgende/melding       → NTS melding
//   #verzorgende/leren         → e-learning
//   #verzorgende/bewoner/jansen          → bewoner detail (taken tab)
//   #verzorgende/bewoner/jansen/vitalen  → bewoner detail vitalen
//   #verzorgende/bewoner/jansen/notities → bewoner detail notities
//   #verzorgende/bewoner/jansen/dossier  → bewoner detail dossier
//   #familie                   → familie lid keuze
//   #familie/martha            → Martha overzicht
//   #familie/martha/week       → Martha weekplan
//   #familie/martha/berichten  → Martha family chat
//   #familie/martha/leren      → Martha e-learning
//   #familie/peter             → Peter overzicht
//   #familie/adriaan           → Adriaan (patiënt) overzicht

function parseHash() {
  var h = window.location.hash.replace('#', '').replace(/^\//, '');
  if (!h) return { scherm: 'rolkeuze' };
  var parts = h.split('/');

  if (parts[0] === 'verzorgende') {
    if (parts[1] === 'bewoner' && parts[2]) {
      return { scherm: 'verzorgende', tab: 'taken', bewonerId: parts[2], bewonerTab: parts[3] || 'taken' };
    }
    return { scherm: 'verzorgende', tab: parts[1] || 'taken' };
  }
  if (parts[0] === 'familie') {
    if (!parts[1]) return { scherm: 'familie_keuze' };
    var lid = window.familieleden.find(function(f) { return f.id === parts[1] || f.roepnaam.toLowerCase() === parts[1].toLowerCase(); });
    if (lid) return { scherm: 'familie', lidId: lid.id, tab: parts[2] || 'overzicht' };
    return { scherm: 'familie_keuze' };
  }
  return { scherm: 'rolkeuze' };
}

function setHash(path) {
  window.location.hash = path;
}

function useHashRouter() {
  var [route, setRoute] = useState(parseHash);

  useEffect(function() {
    function onHashChange() { setRoute(parseHash()); }
    window.addEventListener('hashchange', onHashChange);
    return function() { window.removeEventListener('hashchange', onHashChange); };
  }, []);

  return route;
}

// ── Shared: Dutch date + greeting ──
function formatDatum() {
  var d = new Date();
  var dagen = ['zondag','maandag','dinsdag','woensdag','donderdag','vrijdag','zaterdag'];
  var maanden = ['januari','februari','maart','april','mei','juni','juli','augustus','september','oktober','november','december'];
  return dagen[d.getDay()] + ' ' + d.getDate() + ' ' + maanden[d.getMonth()] + ' ' + d.getFullYear();
}
function begroeting() {
  var u = new Date().getHours();
  if (u < 12) return 'Goedemorgen';
  if (u < 18) return 'Goedemiddag';
  return 'Goedenavond';
}

// ── Shared: Toast hook ──
function useToasts() {
  var [toasts, setToasts] = useState([]);
  var addToast = useCallback(function(message, type) {
    var id = Date.now() + Math.random();
    setToasts(function(prev) { return prev.concat([{ id: id, message: message, type: type || 'info', removing: false }]); });
    setTimeout(function() {
      setToasts(function(prev) { return prev.map(function(t) { return t.id === id ? Object.assign({}, t, { removing: true }) : t; }); });
      setTimeout(function() { setToasts(function(prev) { return prev.filter(function(t) { return t.id !== id; }); }); }, 300);
    }, 2500);
  }, []);
  return [toasts, addToast];
}

// ── Deeplink share button ──
function ShareLink({ label }) {
  var url = window.location.href;
  return React.createElement('button', {
    onClick: function() {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(url).then(function() {});
      }
    },
    title: 'Kopieer deeplink: ' + url,
    style: { background: 'none', border: 'none', fontSize: 12, color: C.tekstMuted, cursor: 'pointer', padding: '2px 6px' }
  }, '\uD83D\uDD17');
}

// ══════════════════════════════════════════
// STAP 1: ROLKEUZE — Verzorgende of Familie?
// ══════════════════════════════════════════
function RolKeuze() {
  return (
    <div style={{ minHeight: '100vh', background: C.achtergrond, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ maxWidth: 420, width: '100%', padding: '32px 24px', textAlign: 'center' }}>
        <GeriCallLogoBig />
        <div style={{ fontSize: 15, color: C.tekstSecundair, marginBottom: 32, lineHeight: 1.5 }}>
          Samen zorgen voor <strong style={{ color: C.tekstPrimair }}>{window.patient.naam}</strong>
        </div>

        <div onClick={function() { setHash('verzorgende'); }} style={{
          background: C.kaartWit, border: '2px solid ' + C.border, borderRadius: 16, padding: 20, marginBottom: 12,
          cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s',
        }} onMouseOver={function(e) { e.currentTarget.style.borderColor = C.oranje; }} onMouseOut={function(e) { e.currentTarget.style.borderColor = C.border; }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: C.oranjeLicht, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>&#x1F469;&#x200D;&#x2695;&#xFE0F;</div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 700, color: C.tekstPrimair }}>Ik ben verzorgende</div>
              <div style={{ fontSize: 13, color: C.tekstSecundair }}>Taken, rapportage &amp; meldingen</div>
            </div>
          </div>
        </div>

        <div onClick={function() { setHash('familie'); }} style={{
          background: C.kaartWit, border: '2px solid ' + C.border, borderRadius: 16, padding: 20, marginBottom: 12,
          cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s',
        }} onMouseOver={function(e) { e.currentTarget.style.borderColor = C.groen; }} onMouseOut={function(e) { e.currentTarget.style.borderColor = C.border; }}>
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
          <span>GeriCall CareTaker Portal {APP_VERSION}</span>
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════
// STAP 2: WIE BEN JE? (familie selectie)
// ══════════════════════════════════════════
function FamilieKeuze() {
  var leden = window.familieleden;
  return (
    <div style={{ minHeight: '100vh', background: C.achtergrond, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ maxWidth: 420, width: '100%', padding: '32px 24px' }}>
        <button onClick={function() { setHash(''); }} style={{ background: 'none', border: 'none', fontSize: 14, color: C.tekstMuted, cursor: 'pointer', marginBottom: 16 }}>&larr; Terug</button>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{ display: 'inline-block', marginBottom: 8 }}><GeriCallLogoImg size={40} /></div>
          <div style={{ fontSize: 20, fontWeight: 700, color: C.tekstPrimair }}>Wie ben je?</div>
          <div style={{ fontSize: 14, color: C.tekstSecundair, marginTop: 4 }}>
            Selecteer je naam om in te loggen
          </div>
        </div>

        {leden.map(function(lid) {
          return (
            <div key={lid.id} onClick={function() { setHash('familie/' + lid.id); }} style={{
              background: C.kaartWit, border: '2px solid ' + C.border, borderRadius: 14, padding: 16, marginBottom: 10,
              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 14, transition: 'all 0.2s',
            }} onMouseOver={function(e) { e.currentTarget.style.borderColor = lid.kleur; }} onMouseOut={function(e) { e.currentTarget.style.borderColor = C.border; }}>
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
function AppVerzorgende({ initialTab, initialBewonerId, initialBewonerTab }) {
  var [tab, setTab] = useState(initialTab || 'taken');
  var [toasts, addToast] = useToasts();
  var [selectedBewoner, setSelectedBewoner] = useState(function() {
    if (initialBewonerId) return window.bewoners.find(function(b) { return b.id === initialBewonerId; }) || null;
    return null;
  });
  var [bewonerTab, setBewonerTab] = useState(initialBewonerTab || 'taken');
  var verzorgendeNaam = 'Sandra B.';

  var handleTab = function(t) {
    setTab(t);
    setSelectedBewoner(null);
    setHash('verzorgende/' + t);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  var handleSelectBewoner = function(b, subTab) {
    setSelectedBewoner(b);
    setBewonerTab(subTab || 'taken');
    setHash('verzorgende/bewoner/' + b.id + (subTab && subTab !== 'taken' ? '/' + subTab : ''));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  var handleBewonerTerug = function() {
    setSelectedBewoner(null);
    setHash('verzorgende/taken');
  };

  var tabs = [
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
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ fontSize: 12, color: C.tekstSecundair }}>{verzorgendeNaam}</span>
            <ShareLink />
            <button onClick={function() { setHash(''); }} style={{ background: 'none', border: 'none', fontSize: 12, color: C.tekstMuted, cursor: 'pointer' }}>Uit</button>
          </div>
        </div>

        {tab === 'taken' && !selectedBewoner && (
          <Card style={{ background: C.oranjeLicht, border: 'none', padding: 12 }}>
            <div style={{ fontSize: 13, fontWeight: 500, color: C.oranjeDonker }}>Dienst vandaag &middot; Afdeling Zonnehof</div>
            <div style={{ fontSize: 15, fontWeight: 700, color: C.tekstPrimair }}>{window.bewoners.length} bewoners in uw wijk</div>
            <div style={{ fontSize: 12, color: C.tekstSecundair }}>{formatDatum()}</div>
          </Card>
        )}

        {tab === 'taken' && !selectedBewoner && <VerzorgendeTaken addToast={addToast} onSelectBewoner={handleSelectBewoner} />}
        {tab === 'taken' && selectedBewoner && <BewonerDetail bewoner={selectedBewoner} addToast={addToast} onTerug={handleBewonerTerug} verzorgendeNaam={verzorgendeNaam} initialTab={bewonerTab} />}
        {tab === 'rapportage' && <VerzorgendeRapportage addToast={addToast} />}
        {tab === 'melding' && <SectionMelding addToast={addToast} />}
        {tab === 'leren' && <VerzorgendeLeren addToast={addToast} />}
        <div style={{ fontSize: 10, color: C.tekstMuted, textAlign: 'center', padding: '16px 0 4px', opacity: 0.6 }}>{APP_VERSION}</div>
      </div>
      <nav style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: C.kaartWit, borderTop: '1px solid ' + C.border, display: 'flex', zIndex: 800, paddingBottom: 'env(safe-area-inset-bottom, 12px)' }}>
        {tabs.map(function(t) {
          return (
            <button key={t.id} onClick={function() { handleTab(t.id); }} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '10px 0 6px', background: 'none', border: 'none', cursor: 'pointer', color: tab === t.id ? C.oranje : C.tekstMuted, transition: 'color 0.2s' }}>
              <span style={{ fontSize: 20, marginBottom: 2 }}>{t.icon}</span>
              <span style={{ fontSize: 11, fontWeight: tab === t.id ? 600 : 400 }}>{t.label}</span>
            </button>
          );
        })}
      </nav>
      <ToastContainer toasts={toasts} />
    </div>
  );
}

// ══════════════════════════════════════════
// APP FAMILIE — per ingelogd familielid
// ══════════════════════════════════════════
function AppFamilie({ lid, initialTab }) {
  var [tab, setTab] = useState(initialTab || 'overzicht');
  var [toasts, addToast] = useToasts();

  var handleTab = function(t) {
    setTab(t);
    setHash('familie/' + lid.id + '/' + t);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  var isPatient = lid.isPatient;

  var tabs = isPatient ? [
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
        <div style={{ padding: '12px 0 8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <GeriCallLogo />
            <span style={{ fontSize: 11, fontWeight: 600, color: C.groen, background: C.groenLicht, padding: '2px 8px', borderRadius: 4 }}>{isPatient ? 'MIJN PORTAL' : 'FAMILIE'}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <div style={{ width: 28, height: 28, borderRadius: 14, background: lid.kleur + '22', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: lid.kleur }}>{lid.initialen}</div>
            <ShareLink />
            <button onClick={function() { setHash(''); }} style={{ background: 'none', border: 'none', fontSize: 12, color: C.tekstMuted, cursor: 'pointer' }}>Wissel</button>
          </div>
        </div>

        <Card style={{ background: isPatient ? C.oranjeLicht : C.groenLicht, border: 'none', padding: 16 }}>
          <div style={{ fontSize: 13, color: isPatient ? C.oranje : C.groen, fontWeight: 500 }}>{begroeting()} {lid.roepnaam}</div>
          <div style={{ fontSize: 18, fontWeight: 700, color: C.tekstPrimair, marginTop: 2 }}>
            {isPatient ? 'Hoe gaat het vandaag?' : 'Hoe gaat het met ' + window.patient.roepnaam + '?'}
          </div>
          <div style={{ fontSize: 13, color: C.tekstSecundair, marginTop: 4 }}>{formatDatum()}</div>
        </Card>

        {tab === 'overzicht' && <FamilieOverzicht lid={lid} addToast={addToast} />}
        {tab === 'week' && <FamilieWeekplan lid={lid} addToast={addToast} />}
        {tab === 'berichten' && <FamilieBerichten lid={lid} addToast={addToast} />}
        {tab === 'leren' && !isPatient && <FamilieLeren addToast={addToast} />}
        <div style={{ fontSize: 10, color: C.tekstMuted, textAlign: 'center', padding: '16px 0 4px', opacity: 0.6 }}>{APP_VERSION}</div>
      </div>

      <nav style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: C.kaartWit, borderTop: '1px solid ' + C.border, display: 'flex', zIndex: 800, paddingBottom: 'env(safe-area-inset-bottom, 12px)' }}>
        {tabs.map(function(t) {
          return (
            <button key={t.id} onClick={function() { handleTab(t.id); }} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '10px 0 6px', background: 'none', border: 'none', cursor: 'pointer', color: tab === t.id ? (isPatient ? C.oranje : C.groen) : C.tekstMuted, transition: 'color 0.2s' }}>
              <span style={{ fontSize: 20, marginBottom: 2 }}>{t.icon}</span>
              <span style={{ fontSize: 11, fontWeight: tab === t.id ? 600 : 400 }}>{t.label}</span>
            </button>
          );
        })}
      </nav>
      <ToastContainer toasts={toasts} />
    </div>
  );
}

// ══════════════════════════════════════════
// ROOT APP — hash-based routing
// ══════════════════════════════════════════
function App() {
  var route = useHashRouter();

  if (route.scherm === 'rolkeuze') {
    return React.createElement(RolKeuze);
  }
  if (route.scherm === 'familie_keuze') {
    return React.createElement(FamilieKeuze);
  }
  if (route.scherm === 'verzorgende') {
    return React.createElement(AppVerzorgende, {
      initialTab: route.tab,
      initialBewonerId: route.bewonerId,
      initialBewonerTab: route.bewonerTab,
      key: 'verzorgende'
    });
  }
  if (route.scherm === 'familie') {
    var lid = window.familieleden.find(function(f) { return f.id === route.lidId; });
    if (!lid) return React.createElement(FamilieKeuze);
    return React.createElement(AppFamilie, {
      lid: lid,
      initialTab: route.tab,
      key: 'familie-' + lid.id
    });
  }
  return React.createElement(RolKeuze);
}

var root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(App));
