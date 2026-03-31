// GeriCall CareTaker Portal — Main App
// Drie omgevingen: Verzorgende, Familie (per lid), Patiënt
// Hash-based routing voor deeplinks
var APP_VERSION = 'v4.7.3';

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

  if (parts[0] === 'zorg') {
    if (!parts[1]) return { scherm: 'zorg_keuze' };
    var profiel = window.zorgprofielen.find(function(p) { return p.id === parts[1]; });
    if (profiel) {
      if (parts[2] === 'bewoner' && parts[3]) {
        return { scherm: 'verzorgende', profielId: profiel.id, tab: 'taken', bewonerId: parts[3], bewonerTab: parts[4] || 'taken' };
      }
      return { scherm: 'verzorgende', profielId: profiel.id, tab: parts[2] || 'taken' };
    }
    return { scherm: 'zorg_keuze' };
  }
  // Backward compat
  if (parts[0] === 'verzorgende') {
    return { scherm: 'verzorgende', profielId: 'sandra', tab: parts[1] || 'taken' };
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
        <div style={{ fontSize: 15, color: C.tekstSecundair, marginBottom: 24, lineHeight: 1.5 }}>
          Samen zorgen voor <strong style={{ color: C.tekstPrimair }}>{window.patient.naam}</strong>
        </div>

        <div onClick={function() { setHash('zorg'); }} style={{
          background: C.kaartWit, border: '2px solid ' + C.border, borderRadius: 16, padding: 20, marginBottom: 12,
          cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s',
        }} onMouseOver={function(e) { e.currentTarget.style.borderColor = C.oranje; }} onMouseOut={function(e) { e.currentTarget.style.borderColor = C.border; }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: C.oranjeLicht, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>&#x1F469;&#x200D;&#x2695;&#xFE0F;</div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 700, color: C.tekstPrimair }}>Ik werk in de zorg</div>
              <div style={{ fontSize: 13, color: C.tekstSecundair }}>Doel: dagelijkse zorg uitvoeren en rapporteren</div>
              <div style={{ fontSize: 11, color: C.tekstMuted, marginTop: 2 }}>Helpende &middot; Verzorgende &middot; Verpleegkundige</div>
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
              <div style={{ fontSize: 13, color: C.tekstSecundair }}>Doel: betrokken blijven en samenwerken</div>
              <div style={{ fontSize: 11, color: C.tekstMuted, marginTop: 2 }}>Gezin &middot; Ondersteuner &middot; Pati&euml;nt</div>
            </div>
          </div>
        </div>

        <div style={{ fontSize: 11, color: C.tekstMuted, marginTop: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
          <GeriCallLogoImg size={14} />
          <span>GeriCall CareTaker Portal {APP_VERSION}</span>
        </div>
        <div style={{ fontSize: 10, color: C.tekstMuted, marginTop: 6, fontStyle: 'italic' }}>
          Prototype &mdash; authenticatie via DigiD/UZI-pas wordt bij implementatie toegevoegd
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
  var lijnInfo = {
    lijn1: { label: 'Gezin', doel: 'Actief meezorgen en beslissingen nemen', rechten: ['Rapportages en behandelplan', 'Weekplanning en bezoeken', 'Consulten volgen', 'Familie chat en e-learning'], kleur: C.groen },
    lijn2: { label: 'Ondersteuner', doel: 'Betrokken blijven en praktisch helpen', rechten: ['Stemming en planning', 'Familie chat', 'Bezoeken inplannen'], kleur: C.blauw },
    patient: { label: 'Pati\u00EBnt', doel: 'Inzicht in eigen dag en contact met familie', rechten: ['Dagoverzicht en stemming', 'Wie komt er vandaag', 'Chat met familie'], kleur: C.oranje },
  };
  return (
    <div style={{ minHeight: '100vh', background: C.achtergrond, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ maxWidth: 420, width: '100%', padding: '32px 24px' }}>
        <button onClick={function() { setHash(''); }} style={{ background: 'none', border: 'none', fontSize: 14, color: C.tekstMuted, cursor: 'pointer', marginBottom: 16 }}>&larr; Terug</button>
        <div style={{ textAlign: 'center', marginBottom: 20 }}>
          <div style={{ display: 'inline-block', marginBottom: 8 }}><GeriCallLogoImg size={40} /></div>
          <div style={{ fontSize: 20, fontWeight: 700, color: C.tekstPrimair }}>Wie ben je?</div>
          <div style={{ fontSize: 12, color: C.tekstMuted, marginTop: 4 }}>Selecteer je naam &mdash; wat je ziet is afgestemd op je rol</div>
        </div>

        {leden.map(function(lid) {
          var li = lijnInfo[lid.lijn || 'lijn2'] || lijnInfo.lijn2;
          return (
            <div key={lid.id} onClick={function() { setHash('familie/' + lid.id); }} style={{
              background: C.kaartWit, border: '2px solid ' + C.border, borderRadius: 14, padding: 16, marginBottom: 10,
              cursor: 'pointer', transition: 'all 0.2s',
            }} onMouseOver={function(e) { e.currentTarget.style.borderColor = li.kleur; }} onMouseOut={function(e) { e.currentTarget.style.borderColor = C.border; }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 22, background: li.kleur + '18',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 16, fontWeight: 700, color: li.kleur, flexShrink: 0,
                }}>{lid.initialen}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 16, fontWeight: 600, color: C.tekstPrimair }}>{lid.roepnaam}</div>
                  <div style={{ fontSize: 13, color: li.kleur, fontWeight: 500 }}>{lid.relatie}{lid.isHoofdcontact ? ' \u00B7 1e contact' : ''}</div>
                  <div style={{ fontSize: 11, color: C.tekstMuted }}>{li.doel}</div>
                </div>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 8 }}>
                {li.rechten.map(function(r, i) {
                  return React.createElement('span', { key: i, style: { fontSize: 10, color: C.tekstSecundair, background: C.achtergrond, padding: '2px 6px', borderRadius: 4 } }, r);
                })}
              </div>
            </div>
          );
        })}

        <div style={{ fontSize: 10, color: C.tekstMuted, marginTop: 16, fontStyle: 'italic', textAlign: 'center' }}>
          Prototype &mdash; authenticatie via DigiD wordt bij implementatie toegevoegd
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════
// STAP 2b: WIE BEN JE? (zorg selectie)
// ══════════════════════════════════════════
function ZorgKeuze() {
  var profielen = window.zorgprofielen;
  var rolInfo = {
    verpleegkundige: {
      label: 'Verpleegkundige', doel: 'Regie over zorgproces en klinische besluitvorming',
      rechten: ['Volledig dossier en EPD', 'Consulten beheren en escaleren', 'NTS-triage en meldingen', 'IoT vitalen en lab-aanvragen', 'Taken, rapportage en e-learning'],
      kleur: C.groen
    },
    verzorgende: {
      label: 'Verzorgende IG', doel: 'Dagelijkse zorg uitvoeren en signaleren',
      rechten: ['Taken afvinken en rapporteren', 'IoT vitalen monitoren', 'NTS-triage en meldingen', 'Behandelplan raadplegen', 'E-learning en certificaten'],
      kleur: C.oranje
    },
    helpende: {
      label: 'Helpende', doel: 'Basiszorg en ondersteuning bieden',
      rechten: ['Taken afvinken', 'Rapportage schrijven en lezen', 'Stemming bijwerken', 'E-learning volgen'],
      kleur: C.tekstMuted
    },
  };
  return (
    <div style={{ minHeight: '100vh', background: C.achtergrond, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ maxWidth: 420, width: '100%', padding: '32px 24px' }}>
        <button onClick={function() { setHash(''); }} style={{ background: 'none', border: 'none', fontSize: 14, color: C.tekstMuted, cursor: 'pointer', marginBottom: 16 }}>&larr; Terug</button>
        <div style={{ textAlign: 'center', marginBottom: 20 }}>
          <div style={{ display: 'inline-block', marginBottom: 8 }}><GeriCallLogoImg size={40} /></div>
          <div style={{ fontSize: 20, fontWeight: 700, color: C.tekstPrimair }}>Inloggen als zorgmedewerker</div>
          <div style={{ fontSize: 12, color: C.tekstMuted, marginTop: 4 }}>Selecteer uw profiel &mdash; rechten zijn gekoppeld aan uw rol</div>
        </div>

        {profielen.map(function(p) {
          var ri = rolInfo[p.niveau] || rolInfo.helpende;
          return (
            <div key={p.id} onClick={function() { setHash('zorg/' + p.id); }} style={{
              background: C.kaartWit, border: '2px solid ' + C.border, borderRadius: 14, padding: 16, marginBottom: 10,
              cursor: 'pointer', transition: 'all 0.2s',
            }} onMouseOver={function(e) { e.currentTarget.style.borderColor = ri.kleur; }} onMouseOut={function(e) { e.currentTarget.style.borderColor = C.border; }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 22, background: C.achtergrond,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 16, fontWeight: 700, color: C.tekstSecundair, flexShrink: 0,
                }}>{p.initialen}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 16, fontWeight: 600, color: C.tekstPrimair }}>{p.naam}</div>
                  <div style={{ fontSize: 13, color: ri.kleur, fontWeight: 500 }}>{ri.label}</div>
                  <div style={{ fontSize: 11, color: C.tekstMuted }}>{ri.doel}</div>
                </div>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 8 }}>
                {ri.rechten.map(function(r, i) {
                  return React.createElement('span', { key: i, style: { fontSize: 10, color: C.tekstSecundair, background: C.achtergrond, padding: '2px 6px', borderRadius: 4 } }, r);
                })}
              </div>
            </div>
          );
        })}

        <div style={{ fontSize: 10, color: C.tekstMuted, marginTop: 16, fontStyle: 'italic', textAlign: 'center' }}>
          Prototype &mdash; authenticatie via UZI-pas wordt bij implementatie toegevoegd
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════
// APP VERZORGENDE
// ══════════════════════════════════════════
function AppVerzorgende({ initialTab, initialBewonerId, initialBewonerTab, zorgProfiel }) {
  var profiel = zorgProfiel || window.zorgprofielen[0];
  var niveau = profiel.niveau;
  var [toasts, addToast] = useToasts();
  var standaardWeergave = niveau === 'helpende' ? 'eenvoudig' : niveau === 'verpleegkundige' ? 'uitgebreid' : 'normaal';
  var [weergave, setWeergave] = useState(standaardWeergave);
  var [tab, setTab] = useState(initialTab || 'taken');
  var [selectedBewoner, setSelectedBewoner] = useState(function() {
    if (initialBewonerId) return window.bewoners.find(function(b) { return b.id === initialBewonerId; }) || null;
    return null;
  });
  var [bewonerTab, setBewonerTab] = useState(initialBewonerTab || 'taken');
  var verzorgendeNaam = profiel.naam;

  // Toegang op basis van weergave
  var toegangPerWeergave = {
    eenvoudig:  { taken: true, rapportageLezen: true, rapportageSchrijven: true, stemming: true, iot: false, consulten: false, melding: false, behandelplan: false, dossier: false, leren: false },
    normaal:    { taken: true, rapportageLezen: true, rapportageSchrijven: true, stemming: true, iot: false, consulten: false, melding: true,  behandelplan: true,  dossier: false, leren: true },
    uitgebreid: { taken: true, rapportageLezen: true, rapportageSchrijven: true, stemming: true, iot: true,  consulten: true,  melding: true,  behandelplan: true,  dossier: true,  leren: true },
  };
  var toegang = toegangPerWeergave[weergave] || toegangPerWeergave.normaal;

  // Weergave switcher component
  var WeergaveSwitcher = function() {
    var opties = [
      { id: 'eenvoudig', label: 'Eenvoudig' },
      { id: 'normaal', label: 'Normaal' },
      { id: 'uitgebreid', label: 'Uitgebreid' },
    ];
    return React.createElement('div', { style: { display: 'flex', background: C.border, borderRadius: 8, padding: 2 } },
      opties.map(function(o) {
        var actief = weergave === o.id;
        return React.createElement('button', { key: o.id, onClick: function() { setWeergave(o.id); }, style: {
          flex: 1, padding: '4px 0', borderRadius: 6, border: 'none', cursor: 'pointer',
          background: actief ? C.kaartWit : 'transparent',
          color: actief ? C.tekstPrimair : C.tekstMuted,
          fontSize: 11, fontWeight: actief ? 600 : 400, transition: 'all 0.2s',
          boxShadow: actief ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
        } }, o.label);
      })
    );
  };

  // Eenvoudige interface
  if (weergave === 'eenvoudig') {
    return (
      <div style={{ minHeight: '100vh', background: C.achtergrond }}>
        <div style={{ maxWidth: 420, margin: '0 auto', padding: '0 16px 100px', minHeight: '100vh' }}>
          <div style={{ padding: '12px 0 8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <GeriCallLogo />
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 13, color: C.tekstSecundair }}>{profiel.naam}</span>
              <button onClick={function() { setHash(''); }} style={{ background: 'none', border: 'none', fontSize: 12, color: C.tekstMuted, cursor: 'pointer' }}>Uit</button>
            </div>
          </div>
          <div style={{ marginBottom: 12 }}><WeergaveSwitcher /></div>
          <EenvoudigZorg profiel={profiel} addToast={addToast} />
          <div style={{ fontSize: 10, color: C.tekstMuted, textAlign: 'center', padding: '16px 0', opacity: 0.6 }}>{APP_VERSION}</div>
        </div>
        <ToastContainer toasts={toasts} />
      </div>
    );
  }

  var handleTab = function(t) {
    setTab(t);
    setSelectedBewoner(null);
    setHash('zorg/' + profiel.id + '/' + t);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  var handleSelectBewoner = function(b, subTab) {
    setSelectedBewoner(b);
    setBewonerTab(subTab || 'taken');
    setHash('zorg/' + profiel.id + '/bewoner/' + b.id + (subTab && subTab !== 'taken' ? '/' + subTab : ''));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  var handleBewonerTerug = function() {
    setSelectedBewoner(null);
    setHash('zorg/' + profiel.id + '/taken');
  };

  var alleTabs = [
    { id: 'taken', icon: '\u2705', label: 'Wijk', show: true },
    { id: 'rapportage', icon: '\u270D\uFE0F', label: 'Rapportage', show: true },
    { id: 'overdracht', icon: '\uD83D\uDD04', label: 'Overdracht', show: true },
    { id: 'melding', icon: '\uD83D\uDD14', label: 'Melding', show: toegang.melding },
    { id: 'leren', icon: '\uD83D\uDCDA', label: 'Leren', show: toegang.leren },
  ];
  var tabs = alleTabs.filter(function(t) { return t.show; });
  var niveauLabel = { helpende: 'Helpende', verzorgende: 'Verzorgende', verpleegkundige: 'Verpleegkundige' };

  return (
    <div style={{ minHeight: '100vh', background: C.achtergrond }}>
      <div style={{ maxWidth: 420, margin: '0 auto', padding: '0 16px 100px', minHeight: '100vh' }}>
        <div style={{ padding: '12px 0 8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div onClick={function() { handleTab('taken'); }} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
            <GeriCallLogo />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ fontSize: 12, color: C.tekstSecundair }}>{verzorgendeNaam}</span>
            <NotificatieBel rol="zorg" addToast={addToast} />
            <ShareLink />
            <button onClick={function() { setHash(''); }} style={{ background: 'none', border: 'none', fontSize: 12, color: C.tekstMuted, cursor: 'pointer' }}>Uit</button>
          </div>
        </div>
        <div style={{ marginBottom: 12 }}><WeergaveSwitcher /></div>

        {tab === 'taken' && !selectedBewoner && (
          <Card style={{ background: C.oranjeLicht, border: 'none', padding: 12 }}>
            <div style={{ fontSize: 13, fontWeight: 500, color: C.oranjeDonker }}>Dienst vandaag &middot; Afdeling Zonnehof</div>
            <div style={{ fontSize: 15, fontWeight: 700, color: C.tekstPrimair }}>{window.bewoners.length} bewoners in uw wijk</div>
            <div style={{ fontSize: 12, color: C.tekstSecundair }}>{formatDatum()}</div>
          </Card>
        )}

        {tab === 'taken' && !selectedBewoner && <VerzorgendeTaken addToast={addToast} onSelectBewoner={handleSelectBewoner} toegang={toegang} weergave={weergave} />}
        {tab === 'taken' && selectedBewoner && <BewonerDetail bewoner={selectedBewoner} addToast={addToast} onTerug={handleBewonerTerug} verzorgendeNaam={verzorgendeNaam} initialTab={bewonerTab} toegang={toegang} weergave={weergave} />}
        {tab === 'rapportage' && <VerzorgendeRapportage addToast={addToast} toegang={toegang} weergave={weergave} />}
        {tab === 'overdracht' && <OverdrachtScherm verzorgendeNaam={verzorgendeNaam} addToast={addToast} />}
        {tab === 'melding' && toegang.melding && <SectionMelding addToast={addToast} />}
        {tab === 'leren' && toegang.leren && <VerzorgendeLeren addToast={addToast} weergave={weergave} />}
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
  var [toasts, addToast] = useToasts();
  var isPatient = lid.isPatient;
  var lijn = lid.lijn || (isPatient ? 'patient' : 'lijn1');
  var standaardWeergave = lijn === 'patient' ? 'eenvoudig' : lijn === 'lijn2' ? 'eenvoudig' : 'normaal';
  var [weergave, setWeergave] = useState(standaardWeergave);
  var [tab, setTab] = useState(initialTab || 'overzicht');

  var handleTab = function(t) {
    setTab(t);
    setHash('familie/' + lid.id + '/' + t);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Toegang op basis van weergave
  var toegangPerWeergave = {
    eenvoudig: { stemming: true, planning: true, chat: true, rapportages: false, behandelplan: false, consulten: false, reablement: false, leren: false },
    normaal:   { stemming: true, planning: true, chat: true, rapportages: true,  behandelplan: false, consulten: false, reablement: true,  leren: true },
    uitgebreid:{ stemming: true, planning: true, chat: true, rapportages: true,  behandelplan: true,  consulten: true,  reablement: true,  leren: true },
  };
  var toegang = toegangPerWeergave[weergave] || toegangPerWeergave.normaal;

  var FamWeergaveSwitcher = function() {
    var opties = [
      { id: 'eenvoudig', label: 'Eenvoudig' },
      { id: 'normaal', label: 'Normaal' },
      { id: 'uitgebreid', label: 'Uitgebreid' },
    ];
    return React.createElement('div', { style: { display: 'flex', background: C.border, borderRadius: 8, padding: 2 } },
      opties.map(function(o) {
        var actief = weergave === o.id;
        return React.createElement('button', { key: o.id, onClick: function() { setWeergave(o.id); }, style: {
          flex: 1, padding: '4px 0', borderRadius: 6, border: 'none', cursor: 'pointer',
          background: actief ? C.kaartWit : 'transparent',
          color: actief ? C.tekstPrimair : C.tekstMuted,
          fontSize: 11, fontWeight: actief ? 600 : 400, transition: 'all 0.2s',
          boxShadow: actief ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
        } }, o.label);
      })
    );
  };

  // Eenvoudige interface
  if (weergave === 'eenvoudig') {
    return (
      <div style={{ minHeight: '100vh', background: C.achtergrond }}>
        <div style={{ maxWidth: 420, margin: '0 auto', padding: '0 16px 100px', minHeight: '100vh' }}>
          <div style={{ padding: '12px 0 8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <GeriCallLogo />
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 13, color: C.tekstSecundair }}>{lid.roepnaam}</span>
              <button onClick={function() { setHash(''); }} style={{ background: 'none', border: 'none', fontSize: 12, color: C.tekstMuted, cursor: 'pointer' }}>Wissel</button>
            </div>
          </div>
          <div style={{ marginBottom: 12 }}><FamWeergaveSwitcher /></div>
          <EenvoudigFamilie lid={lid} addToast={addToast} />
          <div style={{ fontSize: 10, color: C.tekstMuted, textAlign: 'center', padding: '16px 0', opacity: 0.6 }}>{APP_VERSION}</div>
        </div>
        <ToastContainer toasts={toasts} />
      </div>
    );
  }

  var alleTabs = [
    { id: 'overzicht', icon: '\u2764\uFE0F', label: isPatient ? 'Mijn dag' : window.patient.roepnaam, show: true },
    { id: 'week', icon: '\uD83D\uDCC5', label: isPatient ? 'Wie komt?' : 'Planning', show: toegang.planning },
    { id: 'berichten', icon: '\uD83D\uDCAC', label: isPatient ? 'Familie' : 'Familie chat', show: toegang.chat },
    { id: 'leren', icon: '\uD83D\uDCDA', label: 'Leren', show: toegang.leren },
  ];
  var tabs = alleTabs.filter(function(t) { return t.show; });

  return (
    <div style={{ minHeight: '100vh', background: C.achtergrond }}>
      <div style={{ maxWidth: 420, margin: '0 auto', padding: '0 16px 100px', minHeight: '100vh' }}>
        <div style={{ padding: '12px 0 8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div onClick={function() { handleTab('overzicht'); }} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
            <GeriCallLogo />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <div style={{ width: 28, height: 28, borderRadius: 14, background: lid.kleur + '22', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: lid.kleur }}>{lid.initialen}</div>
            <NotificatieBel rol="familie" addToast={addToast} />
            <ShareLink />
            <button onClick={function() { setHash(''); }} style={{ background: 'none', border: 'none', fontSize: 12, color: C.tekstMuted, cursor: 'pointer' }}>Wissel</button>
          </div>
        </div>
        <div style={{ marginBottom: 12 }}><FamWeergaveSwitcher /></div>

        <Card style={{ background: isPatient ? C.oranjeLicht : C.groenLicht, border: 'none', padding: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontSize: 13, color: isPatient ? C.oranje : C.groen, fontWeight: 500 }}>{begroeting()} {lid.roepnaam}</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: C.tekstPrimair, marginTop: 2 }}>
                {isPatient ? 'Hoe gaat het vandaag?' : 'Hoe gaat het met ' + window.patient.roepnaam + '?'}
              </div>
              <div style={{ fontSize: 12, color: C.tekstSecundair, marginTop: 4 }}>{formatDatum()}</div>
            </div>
            {!isPatient && <div style={{ textAlign: 'right', flexShrink: 0 }}>
              <div style={{ fontSize: 12, color: C.tekstSecundair }}>Kamer {window.patient.kamer ? window.patient.kamer.split('Kamer ')[1] || window.patient.kamer : ''}</div>
              <div style={{ fontSize: 11, color: C.tekstMuted }}>{window.patient.leeftijd} jaar</div>
            </div>}
          </div>
        </Card>

        {tab === 'overzicht' && <FamilieOverzicht lid={lid} addToast={addToast} toegang={toegang} onNavigeer={handleTab} weergave={weergave} />}
        {tab === 'week' && toegang.planning && <FamilieWeekplan lid={lid} addToast={addToast} />}
        {tab === 'berichten' && toegang.chat && <FamilieBerichten lid={lid} addToast={addToast} />}
        {tab === 'leren' && toegang.leren && <FamilieLeren addToast={addToast} weergave={weergave} />}
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
  if (route.scherm === 'zorg_keuze') {
    return React.createElement(ZorgKeuze);
  }
  if (route.scherm === 'familie_keuze') {
    return React.createElement(FamilieKeuze);
  }
  if (route.scherm === 'verzorgende') {
    var zorgProfiel = window.zorgprofielen.find(function(p) { return p.id === route.profielId; }) || window.zorgprofielen[0];
    return React.createElement(AppVerzorgende, {
      initialTab: route.tab,
      initialBewonerId: route.bewonerId,
      initialBewonerTab: route.bewonerTab,
      zorgProfiel: zorgProfiel,
      key: 'zorg-' + zorgProfiel.id
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
