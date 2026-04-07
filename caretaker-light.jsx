// GeriCall CareTaker Portal — Lightweight versie (NL+EN)
// Consult inschieten + verrijken, zoek op geboortedatum
// Niet-spoed vs spoed-triage, altijd belknop

var C_CT = window.COLORS;

// Bewoners zoekbaar op geboortedatum (geen namen in lijst)
var lightBewoners = [
  { id: 1, voornaam: 'Ans', afdeling: 'Afdeling B', geboortedatum: '1938-05-12' },
  { id: 2, voornaam: 'Henk', afdeling: 'Afdeling A', geboortedatum: '1941-03-14' },
  { id: 3, voornaam: 'Riet', afdeling: 'Afdeling C', geboortedatum: '1935-11-28' },
  { id: 4, voornaam: 'Willem', afdeling: 'Afdeling B', geboortedatum: '1943-08-03' },
  { id: 5, voornaam: 'Corrie', afdeling: 'Afdeling A', geboortedatum: '1940-01-19' },
];

window.CareTakerPortal = function CareTakerPortal({ onTerug }) {
  var { useState } = React;
  var [scherm, setScherm] = useState('home');
  var [consulten, setConsulten] = useState([
    { id: 'C-3001', bewoner: 'Ans', afdeling: 'Afdeling B', klacht: 'Gevallen, pijn rechterheup', urgentie: 'Spoed', status: 'Arts onderweg', tijdstip: '14:32', type: 'spoed', videoGepland: '15:00' },
    { id: 'C-3002', bewoner: 'Henk', afdeling: 'Afdeling A', klacht: 'Kortademig bij bewegen', urgentie: 'Vandaag', status: 'In behandeling', tijdstip: '13:05', type: 'spoed' },
    { id: 'C-3003', bewoner: 'Riet', afdeling: 'Afdeling C', klacht: 'Koorts, 38.8\u00B0C', urgentie: 'Regulier', status: 'Wachtend', tijdstip: '11:50', type: 'niet-spoed' },
    { id: 'C-3004', bewoner: 'Willem', afdeling: 'Afdeling B', klacht: 'Medicatievraag achterwacht', urgentie: 'Regulier', status: 'Afgerond', tijdstip: '09:15', type: 'niet-spoed' },
  ]);
  var [selectedConsult, setSelectedConsult] = useState(null);
  var [detailTab, setDetailTab] = useState('status');
  var [videoFase, setVideoFase] = useState(0);

  // Aanmaak state
  var [aanmaakStap, setAanmaakStap] = useState(0); // 0=type keuze, 1=bewoner, 2=klacht, 3=bevestig
  var [meldingType, setMeldingType] = useState(null); // niet-spoed | spoed
  var [zoekDatum, setZoekDatum] = useState('1938-05-12');
  var [gevondenBewoner, setGevondenBewoner] = useState(lightBewoners[0]);
  var [nieuwKlacht, setNieuwKlacht] = useState('');
  var [nieuwUrgentie, setNieuwUrgentie] = useState(null);
  var [nieuwCategorie, setNieuwCategorie] = useState(null);

  // Toast
  var [toasts, setToasts] = useState([]);
  var addToast = function(msg, type) {
    var id = Date.now();
    setToasts(function(prev) { return prev.concat([{ id: id, message: msg, type: type || 'info', removing: false }]); });
    setTimeout(function() { setToasts(function(prev) { return prev.filter(function(t) { return t.id !== id; }); }); }, 2500);
  };

  var zoekBewoner = function(datum) {
    setZoekDatum(datum);
    if (!datum) { setGevondenBewoner(null); return; }
    var found = lightBewoners.find(function(b) { return b.geboortedatum === datum; });
    setGevondenBewoner(found || false);
  };

  var resetAanmaak = function() {
    setAanmaakStap(0); setMeldingType(null); setZoekDatum(''); setGevondenBewoner(null);
    setNieuwKlacht(''); setNieuwUrgentie(null); setNieuwCategorie(null);
  };

  var statusKleur = function(s) {
    if (s === 'Arts onderweg') return C_CT.oranje;
    if (s === 'In behandeling') return C_CT.groen;
    if (s === 'Afgerond') return C_CT.tekstMuted;
    return C_CT.blauw;
  };
  var urgKleur = function(u) {
    if (u === 'Spoed') return { k: C_CT.rood, bg: C_CT.roodLicht };
    if (u === 'Vandaag') return { k: C_CT.oranje, bg: C_CT.oranjeLicht };
    return { k: C_CT.tekstMuted, bg: C_CT.achtergrond };
  };

  // Bel knop (altijd beschikbaar)
  var BelKnop = function() {
    return React.createElement('div', { style: { display: 'flex', gap: 8, marginBottom: 12 } },
      React.createElement('a', { href: 'tel:0881234567', style: { flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '10px', borderRadius: 10, background: C_CT.rood, color: '#FFF', fontSize: 13, fontWeight: 700, textDecoration: 'none' } }, '\uD83D\uDCDE ' + ui('belDirectGeriCall')),
      React.createElement('a', { href: 'tel:112', style: { display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '10px 14px', borderRadius: 10, background: C_CT.roodLicht, color: C_CT.rood, fontSize: 13, fontWeight: 700, textDecoration: 'none', border: '2px solid ' + C_CT.rood } }, '112')
    );
  };

  // ═══ HOME ═══
  if (scherm === 'home') {
    return React.createElement('div', { style: { minHeight: '100vh', background: C_CT.achtergrond, display: 'flex', alignItems: 'center', justifyContent: 'center' } },
      React.createElement('div', { style: { maxWidth: 420, width: '100%', padding: '32px 24px', textAlign: 'center' } },
        React.createElement('div', { style: { display: 'flex', justifyContent: 'flex-end', marginBottom: 8 } }, React.createElement(TaalToggle)),
        React.createElement(GeriCallLogoBig),
        React.createElement('div', { style: { fontSize: 14, color: C_CT.oranje, fontWeight: 600, marginBottom: 4 } }, ui('caretakerPortal')),
        React.createElement('div', { style: { fontSize: 13, color: C_CT.tekstSecundair, marginBottom: 24 } }, ui('snelConsultInschieten')),
        React.createElement(BelKnop),
        React.createElement('button', { onClick: function() { setScherm('aanmaken'); resetAanmaak(); }, style: { display: 'block', width: '100%', padding: '14px', borderRadius: 10, border: 'none', background: C_CT.oranje, color: '#FFF', fontSize: 15, fontWeight: 600, cursor: 'pointer', marginBottom: 10 } }, '\u2795 ' + ui('nieuwConsult')),
        React.createElement('button', { onClick: function() { setScherm('overzicht'); }, style: { display: 'block', width: '100%', padding: '14px', borderRadius: 10, background: 'transparent', border: '1px solid ' + C_CT.oranje, color: C_CT.oranje, fontSize: 15, fontWeight: 600, cursor: 'pointer', marginBottom: 24 } }, '\uD83D\uDCCB ' + ui('lopendeConsults') + ' (' + consulten.filter(function(c) { return c.status !== 'Afgerond'; }).length + ')'),
        onTerug && React.createElement('button', { onClick: onTerug, style: { background: 'none', border: 'none', fontSize: 13, color: C_CT.tekstMuted, cursor: 'pointer' } }, '\u2190 ' + ui('hoofdapp')),
        React.createElement('div', { style: { fontSize: 10, color: C_CT.tekstMuted, marginTop: 16 } }, 'CareTaker Portal v0.2')
      ),
      React.createElement(ToastContainer, { toasts: toasts })
    );
  }

  // ═══ OVERZICHT ═══
  if (scherm === 'overzicht') {
    return React.createElement('div', { style: { minHeight: '100vh', background: C_CT.achtergrond } },
      React.createElement('div', { style: { maxWidth: 420, margin: '0 auto', padding: '16px' } },
        React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 } },
          React.createElement('button', { onClick: function() { setScherm('home'); }, style: { background: 'none', border: 'none', fontSize: 14, color: C_CT.tekstMuted, cursor: 'pointer' } }, '\u2190 Home'),
          React.createElement(TaalToggle)
        ),
        React.createElement(BelKnop),
        React.createElement(SectionTitle, null, ui('lopendeConsults')),
        consulten.map(function(c) {
          var uk = urgKleur(c.urgentie);
          return React.createElement(Card, { key: c.id, style: { padding: 12, cursor: 'pointer', borderLeft: '3px solid ' + uk.k }, onClick: function() { setSelectedConsult(c); setScherm('detail'); setDetailTab('status'); } },
            React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 } },
              React.createElement('span', { style: { fontSize: 14, fontWeight: 600, color: C_CT.tekstPrimair } }, c.bewoner + ' \u00B7 ' + c.afdeling),
              React.createElement(Badge, { label: c.urgentie, color: uk.k, bgColor: uk.bg })
            ),
            React.createElement('div', { style: { fontSize: 13, color: C_CT.tekstSecundair } }, c.klacht),
            React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', marginTop: 6 } },
              React.createElement(Badge, { label: c.status, color: statusKleur(c.status), bgColor: statusKleur(c.status) + '18' }),
              React.createElement('span', { style: { fontSize: 11, color: C_CT.tekstMuted } }, c.tijdstip)
            )
          );
        }),
        React.createElement('button', { onClick: function() { setScherm('aanmaken'); resetAanmaak(); }, style: { display: 'block', width: '100%', padding: '12px', borderRadius: 8, border: 'none', background: C_CT.oranje, color: '#FFF', fontSize: 14, fontWeight: 600, cursor: 'pointer', marginTop: 12 } }, '\u2795 ' + ui('nieuwConsult'))
      ),
      React.createElement(ToastContainer, { toasts: toasts })
    );
  }

  // ═══ AANMAKEN ═══
  if (scherm === 'aanmaken') {
    var nietSpoedCats = [
      { id: 'schouwen', label: ui('schouwen') },
      { id: 'medicatie', label: ui('medicatievraag') },
      { id: 'val', label: ui('valIncident') },
      { id: 'huid', label: ui('huidWond') },
      { id: 'gedrag', label: ui('gedragOnrust') },
      { id: 'overig', label: ui('overigNietSpoed') },
    ];
    var totalSteps = meldingType === 'spoed' ? 4 : 3; // spoed heeft extra triage stap
    var currentStep = aanmaakStap;

    return React.createElement('div', { style: { minHeight: '100vh', background: C_CT.achtergrond } },
      React.createElement('div', { style: { maxWidth: 420, margin: '0 auto', padding: '16px' } },
        React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 } },
          React.createElement('button', { onClick: function() { if (aanmaakStap === 0) setScherm('home'); else setAanmaakStap(aanmaakStap - 1); }, style: { background: 'none', border: 'none', fontSize: 14, color: C_CT.tekstMuted, cursor: 'pointer' } }, '\u2190 ' + (aanmaakStap === 0 ? ui('annuleren') : ui('vorige'))),
          React.createElement(TaalToggle)
        ),
        React.createElement(BelKnop),
        React.createElement(SectionTitle, null, ui('nieuwConsult')),

        // Stap 0: type keuze
        aanmaakStap === 0 && React.createElement('div', null,
          React.createElement('div', { style: { fontSize: 14, fontWeight: 500, color: C_CT.tekstPrimair, marginBottom: 10 } }, ui('watVoorMelding')),
          React.createElement('div', { style: { display: 'flex', gap: 8 } },
            React.createElement(Card, { style: { flex: 1, padding: 16, cursor: 'pointer', textAlign: 'center', border: meldingType === 'niet-spoed' ? '2px solid ' + C_CT.blauw : '1px solid ' + C_CT.border }, onClick: function() { setMeldingType('niet-spoed'); setAanmaakStap(1); setNieuwUrgentie('Regulier'); } },
              React.createElement('div', { style: { fontSize: 22, marginBottom: 4 } }, '\uD83D\uDCCB'),
              React.createElement('div', { style: { fontSize: 14, fontWeight: 600, color: C_CT.tekstPrimair } }, ui('nietSpoed')),
              React.createElement('div', { style: { fontSize: 11, color: C_CT.tekstMuted, marginTop: 4 } }, ui('nietSpoedUitleg'))
            ),
            React.createElement(Card, { style: { flex: 1, padding: 16, cursor: 'pointer', textAlign: 'center', border: meldingType === 'spoed' ? '2px solid ' + C_CT.rood : '1px solid ' + C_CT.border }, onClick: function() { setMeldingType('spoed'); setAanmaakStap(1); } },
              React.createElement('div', { style: { fontSize: 22, marginBottom: 4 } }, '\u26A0\uFE0F'),
              React.createElement('div', { style: { fontSize: 14, fontWeight: 600, color: C_CT.tekstPrimair } }, ui('mogelijkeSpoed')),
              React.createElement('div', { style: { fontSize: 11, color: C_CT.tekstMuted, marginTop: 4 } }, ui('mogelijkeSpoedUitleg'))
            )
          )
        ),

        // Stap 1: bewoner zoeken op geboortedatum
        aanmaakStap === 1 && React.createElement('div', null,
          React.createElement('div', { style: { display: 'flex', gap: 4, marginBottom: 12 } },
            Array.from({ length: totalSteps }, function(_, i) { return React.createElement('div', { key: i, style: { flex: 1, height: 4, borderRadius: 2, background: i < currentStep ? C_CT.oranje : C_CT.border } }); })
          ),
          React.createElement('div', { style: { fontSize: 14, fontWeight: 500, color: C_CT.tekstPrimair, marginBottom: 8 } }, ui('zoekOpGeboortedatum')),
          React.createElement('input', { type: 'date', value: zoekDatum, onChange: function(e) { zoekBewoner(e.target.value); }, style: { width: '100%', padding: '12px', borderRadius: 8, border: '1px solid ' + C_CT.border, fontSize: 16, fontFamily: "'DM Sans', sans-serif", outline: 'none', color: C_CT.tekstPrimair, marginBottom: 12 } }),
          gevondenBewoner && React.createElement(Card, { style: { padding: 14, border: '2px solid ' + C_CT.groen } },
            React.createElement('div', { style: { fontSize: 12, color: C_CT.groen, fontWeight: 600, marginBottom: 4 } }, ui('gevonden')),
            React.createElement('div', { style: { fontSize: 16, fontWeight: 600, color: C_CT.tekstPrimair } }, gevondenBewoner.voornaam),
            React.createElement('div', { style: { fontSize: 13, color: C_CT.tekstSecundair } }, gevondenBewoner.afdeling),
            React.createElement('button', { onClick: function() { setAanmaakStap(2); }, style: { background: C_CT.oranje, color: '#FFF', border: 'none', borderRadius: 8, padding: '10px', fontSize: 14, fontWeight: 600, cursor: 'pointer', width: '100%', marginTop: 10 } }, ui('volgende') + ' \u2192')
          ),
          gevondenBewoner === false && zoekDatum && React.createElement('div', { style: { fontSize: 13, color: C_CT.rood, textAlign: 'center', padding: '16px 0' } }, ui('geenBewoner'))
        ),

        // Stap 2: klacht + categorie/urgentie
        aanmaakStap === 2 && React.createElement('div', null,
          React.createElement('div', { style: { display: 'flex', gap: 4, marginBottom: 12 } },
            Array.from({ length: totalSteps }, function(_, i) { return React.createElement('div', { key: i, style: { flex: 1, height: 4, borderRadius: 2, background: i < currentStep ? C_CT.oranje : C_CT.border } }); })
          ),
          React.createElement('div', { style: { fontSize: 14, fontWeight: 500, color: C_CT.tekstPrimair, marginBottom: 8 } }, ui('beschrijfKlacht')),
          React.createElement('textarea', { value: nieuwKlacht, onChange: function(e) { setNieuwKlacht(e.target.value); }, placeholder: '...', style: { width: '100%', minHeight: 80, padding: 12, borderRadius: 8, border: '1px solid ' + C_CT.border, fontSize: 14, fontFamily: "'DM Sans', sans-serif", resize: 'vertical', outline: 'none', color: C_CT.tekstPrimair, marginBottom: 12 } }),

          // Niet-spoed: categorie keuze
          meldingType === 'niet-spoed' && React.createElement('div', null,
            React.createElement('div', { style: { fontSize: 13, fontWeight: 500, color: C_CT.tekstSecundair, marginBottom: 6 } }, ui('klachtCategorie')),
            React.createElement('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, marginBottom: 12 } },
              nietSpoedCats.map(function(cat) {
                var sel = nieuwCategorie === cat.id;
                return React.createElement('button', { key: cat.id, onClick: function() { setNieuwCategorie(cat.id); }, style: { padding: '10px', borderRadius: 8, fontSize: 13, fontWeight: sel ? 600 : 400, background: sel ? C_CT.blauwLicht : C_CT.kaartWit, border: sel ? '2px solid ' + C_CT.blauw : '1px solid ' + C_CT.border, color: sel ? C_CT.blauw : C_CT.tekstPrimair, cursor: 'pointer' } }, cat.label);
              })
            )
          ),

          // Spoed: urgentie keuze
          meldingType === 'spoed' && React.createElement('div', null,
            React.createElement('div', { style: { fontSize: 13, fontWeight: 500, color: C_CT.tekstSecundair, marginBottom: 6 } }, 'Urgentie'),
            React.createElement('div', { style: { display: 'flex', gap: 8, marginBottom: 12 } },
              [{ id: 'Spoed', k: C_CT.rood, bg: C_CT.roodLicht }, { id: 'Vandaag', k: C_CT.oranje, bg: C_CT.oranjeLicht }, { id: 'Regulier', k: C_CT.tekstMuted, bg: C_CT.achtergrond }].map(function(u) {
                var sel = nieuwUrgentie === u.id;
                return React.createElement('button', { key: u.id, onClick: function() { setNieuwUrgentie(u.id); }, style: { flex: 1, padding: '10px', borderRadius: 8, fontSize: 13, fontWeight: 600, background: sel ? u.k : u.bg, color: sel ? '#FFF' : u.k, border: sel ? 'none' : '1px solid ' + C_CT.border, cursor: 'pointer' } }, u.id);
              })
            )
          ),

          React.createElement('button', { onClick: function() {
            if (!nieuwKlacht.trim()) { addToast('Vul een klacht in'); return; }
            if (meldingType === 'niet-spoed' && !nieuwCategorie) { addToast('Kies een categorie'); return; }
            if (meldingType === 'spoed' && !nieuwUrgentie) { addToast('Kies urgentie'); return; }
            setAanmaakStap(3);
          }, style: { background: C_CT.oranje, color: '#FFF', border: 'none', borderRadius: 8, padding: '12px', fontSize: 14, fontWeight: 600, cursor: 'pointer', width: '100%' } }, ui('volgende') + ' \u2192')
        ),

        // Stap 3: bevestiging
        aanmaakStap === 3 && React.createElement('div', null,
          React.createElement('div', { style: { display: 'flex', gap: 4, marginBottom: 12 } },
            Array.from({ length: totalSteps }, function(_, i) { return React.createElement('div', { key: i, style: { flex: 1, height: 4, borderRadius: 2, background: i < currentStep ? C_CT.oranje : C_CT.border } }); })
          ),
          React.createElement('div', { style: { fontSize: 14, fontWeight: 500, color: C_CT.tekstPrimair, marginBottom: 8 } }, ui('bevestiging')),
          React.createElement(Card, { style: { padding: 14 } },
            React.createElement('div', { style: { fontSize: 12, color: C_CT.tekstMuted } }, ui('geboortedatum')),
            React.createElement('div', { style: { fontSize: 14, fontWeight: 600, color: C_CT.tekstPrimair, marginBottom: 8 } }, (gevondenBewoner ? gevondenBewoner.voornaam : '') + ' \u00B7 ' + (gevondenBewoner ? gevondenBewoner.afdeling : '')),
            React.createElement('div', { style: { fontSize: 12, color: C_CT.tekstMuted } }, ui('beschrijfKlacht')),
            React.createElement('div', { style: { fontSize: 14, color: C_CT.tekstPrimair, marginBottom: 8 } }, nieuwKlacht),
            React.createElement('div', { style: { fontSize: 12, color: C_CT.tekstMuted, marginBottom: 4 } }, meldingType === 'spoed' ? 'Urgentie' : ui('klachtCategorie')),
            React.createElement(Badge, { label: meldingType === 'spoed' ? nieuwUrgentie : (nietSpoedCats.find(function(c) { return c.id === nieuwCategorie; }) || {}).label || '', color: meldingType === 'spoed' ? urgKleur(nieuwUrgentie).k : C_CT.blauw, bgColor: meldingType === 'spoed' ? urgKleur(nieuwUrgentie).bg : C_CT.blauwLicht })
          ),
          React.createElement('button', { onClick: function() {
            var nieuwC = { id: 'C-' + (3000 + consulten.length + 1), bewoner: gevondenBewoner ? gevondenBewoner.voornaam : '?', afdeling: gevondenBewoner ? gevondenBewoner.afdeling : '', klacht: nieuwKlacht, urgentie: nieuwUrgentie || 'Regulier', status: 'Wachtend', tijdstip: new Date().toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' }), type: meldingType };
            setConsulten(function(prev) { return [nieuwC].concat(prev); });
            addToast(ui('consultIngediend'), 'success');
            setScherm('overzicht');
            resetAanmaak();
          }, style: { background: C_CT.groen, color: '#FFF', border: 'none', borderRadius: 8, padding: '14px', fontSize: 15, fontWeight: 700, cursor: 'pointer', width: '100%', marginTop: 8 } }, '\u2713 ' + ui('dienIn'))
        )
      ),
      React.createElement(ToastContainer, { toasts: toasts })
    );
  }

  // ═══ DETAIL ═══
  if (scherm === 'detail' && selectedConsult) {
    var c = selectedConsult;
    var uk = urgKleur(c.urgentie);

    return React.createElement('div', { style: { minHeight: '100vh', background: C_CT.achtergrond } },
      React.createElement('div', { style: { maxWidth: 420, margin: '0 auto', padding: '16px' } },
        React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 } },
          React.createElement('button', { onClick: function() { setScherm('overzicht'); setVideoFase(0); }, style: { background: 'none', border: 'none', fontSize: 14, color: C_CT.tekstMuted, cursor: 'pointer' } }, '\u2190 ' + ui('lopendeConsults')),
          React.createElement(TaalToggle)
        ),
        React.createElement(BelKnop),
        React.createElement(Card, { style: { padding: 14 } },
          React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 } },
            React.createElement('span', { style: { fontSize: 16, fontWeight: 700, color: C_CT.tekstPrimair } }, '#' + c.id),
            React.createElement(Badge, { label: c.urgentie, color: uk.k, bgColor: uk.bg })
          ),
          React.createElement('div', { style: { fontSize: 14, color: C_CT.tekstPrimair, marginBottom: 4 } }, c.bewoner + ' \u00B7 ' + c.afdeling),
          React.createElement('div', { style: { fontSize: 13, color: C_CT.tekstSecundair } }, c.klacht),
          React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', marginTop: 8 } },
            React.createElement(Badge, { label: c.status, color: statusKleur(c.status), bgColor: statusKleur(c.status) + '18' }),
            React.createElement('span', { style: { fontSize: 12, color: C_CT.tekstMuted } }, c.tijdstip)
          )
        ),
        // Tabs
        React.createElement('div', { style: { display: 'flex', gap: 4, marginBottom: 12 } },
          [{ id: 'status', label: ui('statusHistorie') }, { id: 'navul', label: ui('aanvullen') }, { id: 'video', label: ui('videocall') }].map(function(t) {
            var sel = detailTab === t.id;
            return React.createElement('button', { key: t.id, onClick: function() { setDetailTab(t.id); }, style: { flex: 1, padding: '8px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: sel ? 600 : 400, background: sel ? C_CT.blauwLicht : C_CT.kaartWit, color: sel ? C_CT.blauw : C_CT.tekstSecundair } }, t.label);
          })
        ),
        // Status
        detailTab === 'status' && React.createElement(Card, { style: { padding: 14 } },
          [
            { tijd: c.tijdstip, tekst: ui('consultIngediend'), type: 'M' },
            { tijd: c.tijdstip, tekst: 'Urgentie: ' + c.urgentie, type: 'T' },
            { tijd: c.tijdstip, tekst: ui('status') + ': ' + c.status, type: 'S' },
          ].map(function(e, i) {
            return React.createElement('div', { key: i, style: { display: 'flex', gap: 10, marginBottom: 8 } },
              React.createElement('div', { style: { width: 20, height: 20, borderRadius: 10, background: C_CT.achtergrond, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 700, color: C_CT.tekstMuted } }, e.type),
              React.createElement('div', { style: { flex: 1, fontSize: 13, color: C_CT.tekstSecundair } }, e.tekst),
              React.createElement('span', { style: { fontSize: 11, color: C_CT.tekstMuted } }, e.tijd)
            );
          })
        ),
        // Aanvullen
        detailTab === 'navul' && React.createElement(Card, { style: { padding: 14 } },
          React.createElement('textarea', { placeholder: ui('extraToelichting'), style: { width: '100%', minHeight: 80, padding: 10, borderRadius: 8, border: '1px solid ' + C_CT.border, fontSize: 13, fontFamily: "'DM Sans', sans-serif", outline: 'none', color: C_CT.tekstPrimair, marginBottom: 8 } }),
          React.createElement(FotoUpload, { label: ui('fotoToevoegen'), addToast: addToast }),
          React.createElement('button', { onClick: function() { addToast(ui('aangeleverd'), 'success'); }, style: { background: C_CT.oranje, color: '#FFF', border: 'none', borderRadius: 8, padding: '10px', fontSize: 13, fontWeight: 600, cursor: 'pointer', width: '100%', marginTop: 6 } }, ui('verstuurAanvraag'))
        ),
        // Video — inkomend
        detailTab === 'video' && React.createElement('div', { style: { textAlign: 'center' } },
          videoFase === 0 && React.createElement('div', { style: { padding: '24px 0' } },
            React.createElement('div', { style: { width: 56, height: 56, borderRadius: 28, background: C_CT.blauwLicht, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', fontSize: 24 } }, '\uD83D\uDCF9'),
            React.createElement('div', { style: { fontSize: 15, fontWeight: 600, color: C_CT.tekstPrimair } }, ui('wachtenOpVideo')),
            c.videoGepland && React.createElement('div', { style: { fontSize: 14, color: C_CT.blauw, marginTop: 6, background: C_CT.blauwLicht, padding: '6px 12px', borderRadius: 8, display: 'inline-block' } }, 'Gepland: ' + c.videoGepland),
            React.createElement('div', { style: { fontSize: 13, color: C_CT.tekstSecundair, marginTop: 6 } }, ui('artsBeltU')),
            React.createElement('button', { onClick: function() { setVideoFase(1); }, style: { background: 'none', border: '1px solid ' + C_CT.border, borderRadius: 8, padding: '8px 16px', fontSize: 12, color: C_CT.tekstMuted, cursor: 'pointer', marginTop: 12 } }, ui('simuleerGesprek'))
          ),
          videoFase === 1 && React.createElement('div', { style: { padding: '32px 0', animation: 'fadeIn 0.3s ease' } },
            React.createElement('div', { style: { width: 72, height: 72, borderRadius: 36, background: C_CT.groenLicht, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: 32 } }, '\uD83D\uDCF9'),
            React.createElement('div', { style: { fontSize: 16, fontWeight: 600, color: C_CT.tekstPrimair, marginBottom: 4 } }, ui('inkomendGesprek')),
            React.createElement('div', { style: { fontSize: 14, color: C_CT.tekstSecundair, marginBottom: 20 } }, 'Dr. Janssen'),
            React.createElement('div', { style: { display: 'flex', gap: 12, justifyContent: 'center' } },
              React.createElement('button', { onClick: function() { setVideoFase(2); }, style: { width: 56, height: 56, borderRadius: 28, background: C_CT.groen, color: '#FFF', border: 'none', fontSize: 24, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' } }, '\uD83D\uDCDE'),
              React.createElement('button', { onClick: function() { setVideoFase(0); }, style: { width: 56, height: 56, borderRadius: 28, background: C_CT.rood, color: '#FFF', border: 'none', fontSize: 24, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' } }, '\uD83D\uDCF5')
            ),
            React.createElement('div', { style: { display: 'flex', justifyContent: 'center', gap: 32, marginTop: 8 } },
              React.createElement('span', { style: { fontSize: 11, color: C_CT.groen } }, ui('accepteren')),
              React.createElement('span', { style: { fontSize: 11, color: C_CT.rood } }, ui('weigeren'))
            )
          ),
          videoFase === 2 && React.createElement('div', null,
            React.createElement('div', { style: { background: C_CT.tekstPrimair, borderRadius: 12, aspectRatio: '16/9', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12, border: '2px solid ' + C_CT.groen } },
              React.createElement('div', { style: { color: '#FFF', textAlign: 'center' } },
                React.createElement('div', { style: { fontSize: 16, fontWeight: 600 } }, 'Dr. Janssen'),
                React.createElement('div', { style: { fontSize: 12, opacity: 0.7, marginTop: 4 } }, ui('inGesprek'))
              )
            ),
            React.createElement('button', { onClick: function() { setVideoFase(0); }, style: { background: C_CT.rood, color: '#FFF', border: 'none', borderRadius: 8, padding: '12px', fontSize: 14, fontWeight: 600, cursor: 'pointer', width: '100%' } }, '\uD83D\uDCF5 ' + ui('gesprekBeeindigen'))
          )
        )
      ),
      React.createElement(ToastContainer, { toasts: toasts })
    );
  }

  return null;
};
