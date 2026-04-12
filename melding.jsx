// GeriCall CareTaker Portal — NTS Melding Sectie
// Realistische triage op basis van Nederlandse Triage Standaard

var C_M = window.COLORS;

window.SectionMelding = function SectionMelding({ addToast }) {
  const { useState } = React;
  const [modus, setModus] = useState(null); // null=keuze, 'snel'=3-staps, 'uitgebreid'=NTS
  const [stap, setStap] = useState(1);
  const [beschrijving, setBeschrijving] = useState('');
  const [gekozenKlacht, setGekozenKlacht] = useState(null);

  // Snelle flow state
  const [snelBewoner, setSnelBewoner] = useState(null);
  const [snelKlacht, setSnelKlacht] = useState('');
  const [snelUrgentie, setSnelUrgentie] = useState(null);
  const [snelStap, setSnelStap] = useState(1);
  const [snelIngediend, setSnelIngediend] = useState(false);
  const [antwoorden, setAntwoorden] = useState({});
  const [vitalen, setVitalen] = useState({});
  const [ingediend, setIngediend] = useState(false);

  const klachten = window.ntsIngangsklachten;
  const urgNiveaus = window.urgentieNiveaus;
  const abcde = window.abcdeParameters;

  // ── Urgentie berekenen op basis van discriminatoren ──
  const berekenUrgentie = () => {
    if (!gekozenKlacht) return urgNiveaus.U5;

    const prios = ['U0','U1','U2','U3','U4','U5'];
    let hoogste = 'U5';

    // Check discriminator-antwoorden
    gekozenKlacht.discriminatoren.forEach((d) => {
      const antwoord = antwoorden[d.id];
      if (antwoord && d.urgentieImpact[antwoord]) {
        const niveau = d.urgentieImpact[antwoord];
        if (prios.indexOf(niveau) < prios.indexOf(hoogste)) {
          hoogste = niveau;
        }
      }
    });

    // Check vitale parameters voor escalatie
    const sat = parseFloat(vitalen.saturatie);
    const adem = parseFloat(vitalen.ademfrequentie);
    const pols = parseFloat(vitalen.polsfrequentie);
    const sys = parseFloat(vitalen.bloeddruk_sys);
    const temp = parseFloat(vitalen.temperatuur);
    const avpu = vitalen.bewustzijn_avpu;
    const pijn = parseInt(vitalen.pijnscore);

    if (avpu === 'Unresponsive' && prios.indexOf('U0') < prios.indexOf(hoogste)) hoogste = 'U0';
    if (avpu === 'Pain (reageert op pijn)' && prios.indexOf('U1') < prios.indexOf(hoogste)) hoogste = 'U1';
    if (!isNaN(sat) && sat < 90 && prios.indexOf('U1') < prios.indexOf(hoogste)) hoogste = 'U1';
    if (!isNaN(sat) && sat >= 90 && sat <= 94 && prios.indexOf('U2') < prios.indexOf(hoogste)) hoogste = 'U2';
    if (!isNaN(adem) && (adem < 8 || adem > 30) && prios.indexOf('U1') < prios.indexOf(hoogste)) hoogste = 'U1';
    if (!isNaN(adem) && adem > 24 && adem <= 30 && prios.indexOf('U2') < prios.indexOf(hoogste)) hoogste = 'U2';
    if (!isNaN(pols) && (pols < 40 || pols > 140) && prios.indexOf('U1') < prios.indexOf(hoogste)) hoogste = 'U1';
    if (!isNaN(pols) && (pols > 120 && pols <= 140) && prios.indexOf('U2') < prios.indexOf(hoogste)) hoogste = 'U2';
    if (!isNaN(sys) && sys < 80 && prios.indexOf('U1') < prios.indexOf(hoogste)) hoogste = 'U1';
    if (!isNaN(sys) && sys < 100 && sys >= 80 && prios.indexOf('U2') < prios.indexOf(hoogste)) hoogste = 'U2';
    if (!isNaN(temp) && temp > 40 && prios.indexOf('U2') < prios.indexOf(hoogste)) hoogste = 'U2';
    if (!isNaN(pijn) && pijn >= 8 && prios.indexOf('U2') < prios.indexOf(hoogste)) hoogste = 'U2';
    if (!isNaN(pijn) && pijn >= 5 && pijn < 8 && prios.indexOf('U3') < prios.indexOf(hoogste)) hoogste = 'U3';

    return urgNiveaus[hoogste];
  };

  // ── Routering ──
  const bepaalRoute = () => {
    const nu = new Date();
    const uur = nu.getHours();
    const min = nu.getMinutes();
    const tijdStr = String(uur).padStart(2,'0') + ':' + String(min).padStart(2,'0');
    const dag = nu.getDay();
    const isWeekend = dag === 0 || dag === 6;
    const urg = berekenUrgentie();
    const niveau = urg.label.substring(0, 2);

    if (!isWeekend && uur >= 8 && (uur < 17 || (uur === 17 && min <= 30))) {
      return {
        tijdstip: tijdStr, dienst: 'Dagdienst', dienstTijd: '08:00 \u2013 17:30',
        route: niveau === 'U0' || niveau === 'U1'
          ? '112 + BHV \u00B7 SO Eigen direct waarschuwen'
          : niveau === 'U2' ? 'SO Eigen \u00B7 spoedvisite aanvragen'
          : 'Eigen verpleging \u00B7 rapportage + dagtaak SO Eigen',
        reactietijd: urg.reactietijd,
      };
    }
    if (!isWeekend && ((uur === 17 && min > 30) || (uur >= 18 && uur < 23))) {
      return {
        tijdstip: tijdStr, dienst: 'Avonddienst', dienstTijd: '17:30 \u2013 23:00',
        route: niveau === 'U0' || niveau === 'U1'
          ? '112 + \uD83D\uDCDE GeriCall CT-arts direct'
          : niveau === 'U2' ? '\uD83D\uDCDE GeriCall CT-arts wordt gewaarschuwd'
          : 'SO Eigen achterwacht \u00B7 volgende ochtend',
        reactietijd: urg.reactietijd,
      };
    }
    return {
      tijdstip: tijdStr, dienst: isWeekend ? 'Weekend (ANW)' : 'Nachtdienst (ANW)',
      dienstTijd: '23:00 \u2013 08:00',
      route: niveau === 'U0' || niveau === 'U1'
        ? '112 + \uD83D\uDCDE GeriCall CT-arts direct \u00B7 SO ANW'
        : niveau === 'U2' ? '\uD83D\uDCDE GeriCall CT-arts \u00B7 SO ANW beschikbaar'
        : 'GeriCall CT-arts consultatielijn \u00B7 niet-acuut',
      reactietijd: urg.reactietijd,
    };
  };

  const handleIndienen = () => { setIngediend(true); addToast('Melding succesvol ingediend', 'success'); };
  const handleReset = () => { setStap(1); setBeschrijving(''); setGekozenKlacht(null); setAntwoorden({}); setVitalen({}); setIngediend(false); };
  const kanVolgende = (s) => {
    if (s === 1) return beschrijving.trim().length > 0 && gekozenKlacht !== null;
    if (s === 2) return gekozenKlacht && gekozenKlacht.discriminatoren.every((d) => antwoorden[d.id]);
    return true;
  };

  // ── Ingediend state ──
  if (ingediend) {
    const urg = berekenUrgentie();
    const route = bepaalRoute();
    return React.createElement('div', { style: { animation: 'scaleIn 0.4s ease', textAlign: 'center', padding: '20px 0' } },
      React.createElement('div', { style: { margin: '0 auto 12px', animation: 'scaleIn 0.5s ease' } }, React.createElement(GeriCallLogoImg, { size: 48 })),
      React.createElement('div', { style: { width: 56, height: 56, borderRadius: 28, background: C_M.groenLicht, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: 28, animation: 'scaleIn 0.5s ease' } }, '\u2713'),
      React.createElement('div', { style: { fontSize: 20, fontWeight: 700, color: C_M.groen, marginBottom: 4 } }, 'Melding ingediend'),
      React.createElement('div', { style: { fontSize: 14, color: C_M.tekstSecundair, marginBottom: 20 } }, 'Consult #C-2042'),
      React.createElement(Card, null,
        React.createElement('div', { style: { textAlign: 'left' } },
          React.createElement('div', { style: { fontSize: 13, color: C_M.tekstMuted, marginBottom: 2 } }, 'Ingangsklacht'),
          React.createElement('div', { style: { fontSize: 14, fontWeight: 600, color: C_M.tekstPrimair, marginBottom: 10 } }, gekozenKlacht ? gekozenKlacht.naam : '-'),
          React.createElement('div', { style: { fontSize: 13, color: C_M.tekstMuted, marginBottom: 2 } }, 'Beschrijving'),
          React.createElement('div', { style: { fontSize: 14, color: C_M.tekstPrimair, marginBottom: 10 } }, beschrijving),
          React.createElement('div', { style: { fontSize: 13, color: C_M.tekstMuted, marginBottom: 4 } }, 'NTS Urgentie'),
          React.createElement(Badge, { label: urg.label, color: urg.kleur, bgColor: urg.achtergrond }),
          React.createElement('div', { style: { fontSize: 13, color: C_M.tekstMuted, marginBottom: 2, marginTop: 10 } }, 'Routering'),
          React.createElement('div', { style: { fontSize: 14, fontWeight: 600, color: C_M.tekstPrimair, marginBottom: 4 } }, route.route),
          React.createElement('div', { style: { fontSize: 12, color: C_M.tekstMuted } }, route.dienst + ' \u00B7 ' + route.reactietijd),
          // Vitalen samenvatting
          Object.keys(vitalen).length > 0 && React.createElement('div', { style: { marginTop: 12, padding: 10, background: C_M.achtergrond, borderRadius: 8 } },
            React.createElement('div', { style: { fontSize: 13, color: C_M.tekstMuted, marginBottom: 4 } }, 'Vitale parameters'),
            Object.entries(vitalen).filter(function(e) { return e[1]; }).map(function(e) {
              var param = window.abcdeParameters.find(function(p) { return p.id === e[0]; });
              return React.createElement('div', { key: e[0], style: { fontSize: 12, color: C_M.tekstSecundair, marginBottom: 2 } },
                (param ? param.label : e[0]) + ': ' + e[1] + (param ? ' ' + param.eenheid : ''));
            })
          )
        )
      ),
      React.createElement('button', { onClick: handleReset, style: { background: C_M.oranje, color: '#FFFFFF', border: 'none', borderRadius: 8, padding: '12px 24px', fontSize: 14, fontWeight: 600, cursor: 'pointer', width: '100%', marginTop: 8 } }, 'Terug naar overzicht')
    );
  }

  // ── Step indicator ──
  var stapNamen = ['Klacht', 'Discriminatoren', 'ABCDE', 'Urgentie', 'Routering'];

  // Direct bellen component
  var BelKnop = function() {
    return React.createElement('div', { style: { display: 'flex', gap: 8, marginBottom: 12 } },
      React.createElement('a', { href: 'tel:0881234567',
        style: { flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          padding: '12px', borderRadius: 10, background: C_M.rood, color: '#FFFFFF',
          fontSize: 14, fontWeight: 700, textDecoration: 'none', cursor: 'pointer' }
      }, '\uD83D\uDCDE Bel direct GeriCall'),
      React.createElement('a', { href: 'tel:112',
        style: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4,
          padding: '12px 16px', borderRadius: 10, background: C_M.roodLicht, color: C_M.rood,
          fontSize: 14, fontWeight: 700, textDecoration: 'none', cursor: 'pointer',
          border: '2px solid ' + C_M.rood }
      }, '112')
    );
  };

  // Alle lopende consulten verzamelen
  var lopendeConsulten = [];
  window.bewoners.forEach(function(b) {
    if (b.openConsulten) {
      b.openConsulten.forEach(function(c) {
        lopendeConsulten.push(Object.assign({}, c, { bewoner: b.roepnaam, bewonerId: b.id, kamer: b.kamer }));
      });
    }
  });

  return React.createElement('div', { style: { animation: 'fadeIn 0.3s ease' } },
    React.createElement(SectionTitle, null, 'Melding doen / Consult aanvragen'),
    // Altijd zichtbaar: direct bellen
    React.createElement(BelKnop),

    // Lopende consulten overzicht
    lopendeConsulten.length > 0 && React.createElement('div', { style: { marginBottom: 16 } },
      React.createElement('div', { style: { fontSize: 13, fontWeight: 600, color: C_M.tekstSecundair, marginBottom: 8 } }, 'Lopende meldingen (' + lopendeConsulten.length + ')'),
      lopendeConsulten.map(function(c) {
        var isU1 = c.urgentie.indexOf('U1') !== -1;
        var isU2 = c.urgentie.indexOf('U2') !== -1;
        var urgKleur = isU1 ? C_M.rood : isU2 ? C_M.oranje : C_M.blauw;
        return React.createElement(Card, { key: c.id, style: { padding: 10, borderLeft: '3px solid ' + urgKleur, cursor: 'pointer' }, onClick: function() { addToast('Open consult #' + c.id + ' via bewoner ' + c.bewoner); } },
          React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 } },
            React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 6 } },
              React.createElement('span', { style: { fontSize: 13, fontWeight: 600, color: C_M.tekstPrimair } }, '#' + c.id),
              React.createElement('span', { style: { fontSize: 12, color: C_M.tekstSecundair } }, c.bewoner + ' \u00B7 Kamer ' + c.kamer)
            ),
            React.createElement(Badge, { label: c.urgentie.split(' \u2014 ')[0], color: urgKleur, bgColor: urgKleur + '18' })
          ),
          React.createElement('div', { style: { fontSize: 12, color: C_M.tekstSecundair } }, c.beschrijving),
          React.createElement('div', { style: { fontSize: 11, color: C_M.tekstMuted, marginTop: 2 } }, c.status + ' \u00B7 ' + (c.arts || c.toewijzing) + ' \u00B7 ' + c.ingediend)
        );
      })
    ),

    // Modus keuze: snel of uitgebreid
    !modus && React.createElement('div', null,
      React.createElement('div', { style: { fontSize: 13, fontWeight: 600, color: C_M.tekstSecundair, marginBottom: 8 } }, ui('nieuweMelding')),
      React.createElement('div', { style: { display: 'flex', gap: 8, marginBottom: 12 } },
        React.createElement(Card, { style: { flex: 1, padding: 14, cursor: 'pointer', textAlign: 'center', border: '2px solid ' + C_M.oranje }, onClick: function() { setModus('snel'); } },
          React.createElement('div', { style: { fontSize: 24, marginBottom: 4 } }, '\u26A1'),
          React.createElement('div', { style: { fontSize: 14, fontWeight: 600, color: C_M.tekstPrimair } }, 'Snel consult'),
          React.createElement('div', { style: { fontSize: 11, color: C_M.tekstMuted } }, '3 stappen')
        ),
        React.createElement(Card, { style: { flex: 1, padding: 14, cursor: 'pointer', textAlign: 'center' }, onClick: function() { setModus('uitgebreid'); } },
          React.createElement('div', { style: { fontSize: 24, marginBottom: 4 } }, '\uD83D\uDD14'),
          React.createElement('div', { style: { fontSize: 14, fontWeight: 600, color: C_M.tekstPrimair } }, 'NTS Triage'),
          React.createElement('div', { style: { fontSize: 11, color: C_M.tekstMuted } }, '5 stappen + vitalen')
        )
      )
    ),

    // ═══ SNELLE FLOW (3 stappen) ═══
    modus === 'snel' && React.createElement('div', null,
      React.createElement('button', { onClick: function() { setModus(null); setSnelStap(1); setSnelBewoner(null); setSnelKlacht(''); setSnelUrgentie(null); setSnelIngediend(false); }, style: { background: 'none', border: 'none', fontSize: 13, color: C_M.tekstMuted, cursor: 'pointer', marginBottom: 8 } }, '\u2190 ' + ui('terug')),
      React.createElement('div', { style: { fontSize: 13, fontWeight: 600, color: C_M.tekstSecundair, marginBottom: 8 } }, 'Snel consult'),
      // Step indicator
      React.createElement('div', { style: { display: 'flex', gap: 4, marginBottom: 12 } },
        [1,2,3].map(function(s) { return React.createElement('div', { key: s, style: { flex: 1, height: 4, borderRadius: 2, background: s <= snelStap ? C_M.oranje : C_M.border } }); })
      ),

      snelIngediend
        ? React.createElement('div', { style: { textAlign: 'center', padding: '32px 0', animation: 'scaleIn 0.4s ease' } },
            React.createElement('div', { style: { width: 56, height: 56, borderRadius: 28, background: C_M.groenLicht, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', fontSize: 28 } }, '\u2713'),
            React.createElement('div', { style: { fontSize: 18, fontWeight: 700, color: C_M.groen } }, 'Consult ingediend'),
            React.createElement('div', { style: { fontSize: 13, color: C_M.tekstSecundair, marginTop: 4 } }, '#C-2043 \u00B7 ' + snelBewoner.roepnaam + ' \u00B7 ' + snelUrgentie),
            React.createElement('button', { onClick: function() { setModus(null); setSnelStap(1); setSnelBewoner(null); setSnelKlacht(''); setSnelUrgentie(null); setSnelIngediend(false); }, style: { background: C_M.oranje, color: '#FFF', border: 'none', borderRadius: 8, padding: '10px 24px', fontSize: 14, fontWeight: 600, cursor: 'pointer', marginTop: 16 } }, 'OK')
          )
        : React.createElement('div', null,
          // Stap 1: Bewoner
          snelStap === 1 && React.createElement('div', null,
            React.createElement('div', { style: { fontSize: 14, fontWeight: 500, color: C_M.tekstPrimair, marginBottom: 8 } }, 'Stap 1 \u2014 Bewoner selecteren'),
            window.bewoners.map(function(b) {
              var sel = snelBewoner && snelBewoner.id === b.id;
              return React.createElement(Card, { key: b.id, style: { padding: 12, cursor: 'pointer', border: sel ? '2px solid ' + C_M.oranje : '1px solid ' + C_M.border }, onClick: function() { setSnelBewoner(b); } },
                React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 10 } },
                  React.createElement('div', { style: { width: 36, height: 36, borderRadius: 18, background: C_M.achtergrond, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: C_M.tekstSecundair } }, b.initialen),
                  React.createElement('div', null,
                    React.createElement('div', { style: { fontSize: 14, fontWeight: 600, color: C_M.tekstPrimair } }, b.roepnaam),
                    React.createElement('div', { style: { fontSize: 12, color: C_M.tekstMuted } }, b.afdeling + ' \u00B7 ' + ui('kamer') + ' ' + b.kamer)
                  ),
                  sel && React.createElement('div', { style: { marginLeft: 'auto', width: 20, height: 20, borderRadius: 10, background: C_M.oranje, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFF', fontSize: 12 } }, '\u2713')
                )
              );
            }),
            React.createElement('button', { onClick: function() { if (snelBewoner) setSnelStap(2); else addToast('Selecteer een bewoner'); }, style: { background: snelBewoner ? C_M.oranje : C_M.border, color: snelBewoner ? '#FFF' : C_M.tekstMuted, border: 'none', borderRadius: 8, padding: '12px', fontSize: 14, fontWeight: 600, cursor: 'pointer', width: '100%', marginTop: 8 } }, ui('volgende') + ' \u2192')
          ),
          // Stap 2: Klacht + urgentie
          snelStap === 2 && React.createElement('div', null,
            React.createElement('div', { style: { fontSize: 14, fontWeight: 500, color: C_M.tekstPrimair, marginBottom: 8 } }, 'Stap 2 \u2014 Klacht beschrijven'),
            React.createElement('textarea', { value: snelKlacht, onChange: function(e) { setSnelKlacht(e.target.value); }, placeholder: 'Beschrijf kort wat er aan de hand is...', style: { width: '100%', minHeight: 80, padding: 12, borderRadius: 8, border: '1px solid ' + C_M.border, fontSize: 14, fontFamily: "'DM Sans', sans-serif", resize: 'vertical', outline: 'none', color: C_M.tekstPrimair, marginBottom: 12 } }),
            React.createElement('div', { style: { fontSize: 13, fontWeight: 500, color: C_M.tekstSecundair, marginBottom: 6 } }, 'Urgentie'),
            React.createElement('div', { style: { display: 'flex', gap: 8 } },
              [{ id: 'Spoed', kleur: C_M.rood, bg: C_M.roodLicht }, { id: 'Vandaag', kleur: C_M.oranje, bg: C_M.oranjeLicht }, { id: 'Regulier', kleur: C_M.tekstMuted, bg: C_M.achtergrond }].map(function(u) {
                var sel = snelUrgentie === u.id;
                return React.createElement('button', { key: u.id, onClick: function() { setSnelUrgentie(u.id); }, style: {
                  flex: 1, padding: '10px', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 600, textAlign: 'center',
                  background: sel ? u.kleur : u.bg, color: sel ? '#FFF' : u.kleur, border: sel ? 'none' : '1px solid ' + C_M.border,
                } }, u.id);
              })
            ),
            React.createElement('div', { style: { display: 'flex', gap: 8, marginTop: 12 } },
              React.createElement('button', { onClick: function() { setSnelStap(1); }, style: { flex: 1, background: C_M.kaartWit, color: C_M.tekstSecundair, border: '1px solid ' + C_M.border, borderRadius: 8, padding: '12px', fontSize: 14, cursor: 'pointer' } }, '\u2190 ' + ui('vorige')),
              React.createElement('button', { onClick: function() { if (snelKlacht.trim() && snelUrgentie) setSnelStap(3); else addToast('Vul klacht en urgentie in'); }, style: { flex: 2, background: snelKlacht.trim() && snelUrgentie ? C_M.oranje : C_M.border, color: snelKlacht.trim() && snelUrgentie ? '#FFF' : C_M.tekstMuted, border: 'none', borderRadius: 8, padding: '12px', fontSize: 14, fontWeight: 600, cursor: 'pointer' } }, ui('volgende') + ' \u2192')
            )
          ),
          // Stap 3: Bevestiging
          snelStap === 3 && React.createElement('div', null,
            React.createElement('div', { style: { fontSize: 14, fontWeight: 500, color: C_M.tekstPrimair, marginBottom: 8 } }, 'Stap 3 \u2014 Bevestiging'),
            React.createElement(Card, { style: { padding: 14 } },
              React.createElement('div', { style: { fontSize: 12, color: C_M.tekstMuted, marginBottom: 2 } }, 'Bewoner'),
              React.createElement('div', { style: { fontSize: 14, fontWeight: 600, color: C_M.tekstPrimair, marginBottom: 8 } }, snelBewoner.roepnaam + ' \u00B7 ' + ui('kamer') + ' ' + snelBewoner.kamer),
              React.createElement('div', { style: { fontSize: 12, color: C_M.tekstMuted, marginBottom: 2 } }, 'Klacht'),
              React.createElement('div', { style: { fontSize: 14, color: C_M.tekstPrimair, marginBottom: 8 } }, snelKlacht),
              React.createElement('div', { style: { fontSize: 12, color: C_M.tekstMuted, marginBottom: 4 } }, 'Urgentie'),
              React.createElement(Badge, { label: snelUrgentie, color: snelUrgentie === 'Spoed' ? C_M.rood : snelUrgentie === 'Vandaag' ? C_M.oranje : C_M.tekstMuted, bgColor: snelUrgentie === 'Spoed' ? C_M.roodLicht : snelUrgentie === 'Vandaag' ? C_M.oranjeLicht : C_M.achtergrond })
            ),
            React.createElement('div', { style: { display: 'flex', gap: 8, marginTop: 8 } },
              React.createElement('button', { onClick: function() { setSnelStap(2); }, style: { flex: 1, background: C_M.kaartWit, color: C_M.tekstSecundair, border: '1px solid ' + C_M.border, borderRadius: 8, padding: '12px', fontSize: 14, cursor: 'pointer' } }, '\u2190 ' + ui('vorige')),
              React.createElement('button', { onClick: function() { setSnelIngediend(true); addToast('Consult ingediend', 'success'); }, style: { flex: 2, background: C_M.groen, color: '#FFF', border: 'none', borderRadius: 8, padding: '12px', fontSize: 14, fontWeight: 700, cursor: 'pointer' } }, '\u2713 ' + ui('dienIn'))
            )
          )
        )
    ),

    // ═══ NTS TRIAGE (nieuwe wizard) ═══
    modus === 'uitgebreid' && React.createElement(NTSWizard, {
      onSluit: function() { setModus(null); },
      addToast: addToast,
      prefillPersona: window.ntsPersonas[0],
      hashPrefix: 'zorg/triage'
    })
  );
};
