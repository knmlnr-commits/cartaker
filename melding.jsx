// GeriCall CareTaker Portal — NTS Melding Sectie
// Realistische triage op basis van Nederlandse Triage Standaard

var C_M = window.COLORS;

window.SectionMelding = function SectionMelding({ addToast }) {
  const { useState } = React;
  const [stap, setStap] = useState(1);
  const [beschrijving, setBeschrijving] = useState('');
  const [gekozenKlacht, setGekozenKlacht] = useState(null);
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

    // Nieuwe melding header
    React.createElement('div', { style: { fontSize: 13, fontWeight: 600, color: C_M.tekstSecundair, marginBottom: 8 } }, 'Nieuwe melding'),

    // Step indicator
    React.createElement('div', { style: { display: 'flex', gap: 4, marginBottom: 8 } },
      [1,2,3,4,5].map(function(s) {
        return React.createElement('div', { key: s, style: { flex: 1, height: 4, borderRadius: 2, background: s <= stap ? C_M.oranje : C_M.border, transition: 'background 0.3s' } });
      })
    ),
    React.createElement('div', { style: { fontSize: 12, color: C_M.tekstMuted, marginBottom: 16, textAlign: 'center' } },
      'Stap ' + stap + ' van 5: ' + stapNamen[stap - 1]
    ),

    // ════ STAP 1: Ingangsklacht ════
    stap === 1 && React.createElement('div', { style: { animation: 'slideInRight 0.3s ease' } },
      React.createElement('div', { style: { fontSize: 14, fontWeight: 600, color: C_M.tekstPrimair, marginBottom: 4 } }, 'Stap 1 \u2014 Ingangsklacht selecteren'),
      React.createElement('div', { style: { fontSize: 13, color: C_M.tekstSecundair, marginBottom: 12 } }, 'Beschrijf de situatie en selecteer de hoofdklacht'),

      React.createElement('textarea', {
        value: beschrijving,
        onChange: function(e) { setBeschrijving(e.target.value); },
        placeholder: 'Beschrijf wat u heeft waargenomen bij de pati\u00EBnt...',
        style: { width: '100%', minHeight: 80, padding: 12, borderRadius: 8, border: '1px solid ' + C_M.border, fontSize: 14, fontFamily: "'DM Sans', sans-serif", resize: 'vertical', outline: 'none', color: C_M.tekstPrimair, marginBottom: 12 }
      }),

      React.createElement('div', { style: { fontSize: 13, fontWeight: 600, color: C_M.tekstSecundair, marginBottom: 8 } }, 'NTS Ingangsklacht'),

      klachten.map(function(k) {
        var selected = gekozenKlacht && gekozenKlacht.id === k.id;
        return React.createElement('div', {
          key: k.id,
          onClick: function() { setGekozenKlacht(k); setAntwoorden({}); },
          style: { display: 'flex', alignItems: 'center', gap: 10, padding: '12px', marginBottom: 6, borderRadius: 10, cursor: 'pointer', background: selected ? C_M.oranjeLicht : C_M.kaartWit, border: '2px solid ' + (selected ? C_M.oranje : C_M.border), transition: 'all 0.2s' }
        },
          React.createElement('span', { style: { fontSize: 22 } }, k.icon),
          React.createElement('div', { style: { flex: 1 } },
            React.createElement('div', { style: { fontSize: 14, fontWeight: 600, color: selected ? C_M.oranje : C_M.tekstPrimair } }, k.naam),
            React.createElement('div', { style: { fontSize: 12, color: C_M.tekstMuted } }, k.toelichting)
          ),
          selected && React.createElement('div', { style: { width: 20, height: 20, borderRadius: 10, background: C_M.oranje, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFF', fontSize: 12, fontWeight: 700 } }, '\u2713')
        );
      }),

      React.createElement('button', {
        onClick: function() { if (kanVolgende(1)) setStap(2); else addToast('Vul een beschrijving in en selecteer een ingangsklacht'); },
        style: { background: kanVolgende(1) ? C_M.oranje : C_M.border, color: kanVolgende(1) ? '#FFFFFF' : C_M.tekstMuted, border: 'none', borderRadius: 8, padding: '12px 24px', fontSize: 14, fontWeight: 600, cursor: 'pointer', width: '100%', marginTop: 12, transition: 'all 0.2s' }
      }, 'Volgende \u2192')
    ),

    // ════ STAP 2: Discriminatoren ════
    stap === 2 && gekozenKlacht && React.createElement('div', { style: { animation: 'slideInRight 0.3s ease' } },
      React.createElement('div', { style: { fontSize: 14, fontWeight: 600, color: C_M.tekstPrimair, marginBottom: 4 } }, 'Stap 2 \u2014 Discriminatoren'),
      React.createElement('div', { style: { fontSize: 13, color: C_M.tekstSecundair, marginBottom: 4 } }, gekozenKlacht.naam),
      React.createElement('div', { style: { fontSize: 12, color: C_M.tekstMuted, marginBottom: 16 } }, 'Beantwoord onderstaande vragen voor urgentiebepaling'),

      gekozenKlacht.discriminatoren.map(function(d, i) {
        return React.createElement(Card, { key: d.id },
          React.createElement('div', { style: { fontSize: 14, fontWeight: 500, color: C_M.tekstPrimair, marginBottom: 8 } }, (i + 1) + '. ' + d.vraag),
          React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: 6 } },
            d.opties.map(function(opt) {
              var selected = antwoorden[d.id] === opt;
              var isEscalatie = d.urgentieImpact[opt] && (d.urgentieImpact[opt] === 'U0' || d.urgentieImpact[opt] === 'U1');
              return React.createElement('button', {
                key: opt,
                onClick: function() { var nw = Object.assign({}, antwoorden); nw[d.id] = opt; setAntwoorden(nw); },
                style: { padding: '10px 12px', borderRadius: 8, fontSize: 13, fontWeight: selected ? 600 : 400, textAlign: 'left', cursor: 'pointer', transition: 'all 0.2s',
                  background: selected ? (isEscalatie ? C_M.roodLicht : C_M.oranjeLicht) : C_M.kaartWit,
                  border: '1.5px solid ' + (selected ? (isEscalatie ? C_M.rood : C_M.oranje) : C_M.border),
                  color: selected ? (isEscalatie ? C_M.rood : C_M.oranje) : C_M.tekstPrimair }
              }, opt);
            })
          )
        );
      }),

      React.createElement('div', { style: { display: 'flex', gap: 8, marginTop: 8 } },
        React.createElement('button', { onClick: function() { setStap(1); }, style: { flex: 1, background: C_M.kaartWit, color: C_M.tekstSecundair, border: '1px solid ' + C_M.border, borderRadius: 8, padding: '12px', fontSize: 14, fontWeight: 500, cursor: 'pointer' } }, '\u2190 Vorige'),
        React.createElement('button', {
          onClick: function() { if (kanVolgende(2)) setStap(3); else addToast('Beantwoord alle vragen om verder te gaan'); },
          style: { flex: 2, background: kanVolgende(2) ? C_M.oranje : C_M.border, color: kanVolgende(2) ? '#FFFFFF' : C_M.tekstMuted, border: 'none', borderRadius: 8, padding: '12px', fontSize: 14, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }
        }, 'Volgende \u2192')
      )
    ),

    // ════ STAP 3: ABCDE Vitale parameters ════
    stap === 3 && React.createElement('div', { style: { animation: 'slideInRight 0.3s ease' } },
      React.createElement('div', { style: { fontSize: 14, fontWeight: 600, color: C_M.tekstPrimair, marginBottom: 4 } }, 'Stap 3 \u2014 ABCDE Vitale parameters'),
      React.createElement('div', { style: { fontSize: 12, color: C_M.tekstMuted, marginBottom: 16 } }, 'Optioneel maar aanbevolen. Afwijkende waarden kunnen de urgentie verhogen.'),

      abcde.map(function(param) {
        var val = vitalen[param.id] || '';
        var isAfwijkend = false;
        if (param.type === 'number' && val) {
          var n = parseFloat(val);
          var range = param.normaal.replace(/[<> %]/g, '').split('-');
          if (range.length === 2) { isAfwijkend = n < parseFloat(range[0]) || n > parseFloat(range[1]); }
          else if (param.normaal.includes('>')) { isAfwijkend = n <= parseFloat(range[0]); }
        }
        if (param.id === 'bewustzijn_avpu' && val && val !== 'Alert') isAfwijkend = true;
        if (param.id === 'pijnscore' && parseInt(val) >= 5) isAfwijkend = true;

        return React.createElement(Card, { key: param.id, style: isAfwijkend ? { border: '1.5px solid ' + C_M.rood, background: C_M.roodLicht } : {} },
          React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 } },
            React.createElement('span', { style: { fontSize: 14, fontWeight: 500, color: C_M.tekstPrimair } }, param.label),
            React.createElement('span', { style: { fontSize: 11, color: C_M.tekstMuted } }, 'Normaal: ' + param.normaal)
          ),
          param.type === 'select'
            ? React.createElement('select', {
                value: val,
                onChange: function(e) { var nw = Object.assign({}, vitalen); nw[param.id] = e.target.value; setVitalen(nw); },
                style: { width: '100%', padding: '10px', borderRadius: 8, border: '1px solid ' + C_M.border, fontSize: 14, fontFamily: "'DM Sans', sans-serif", color: C_M.tekstPrimair, background: C_M.kaartWit }
              },
                React.createElement('option', { value: '' }, '-- Selecteer --'),
                param.opties.map(function(o) { return React.createElement('option', { key: o, value: o }, o); })
              )
            : param.type === 'range'
              ? React.createElement('div', null,
                  React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', marginBottom: 4 } },
                    React.createElement('span', { style: { fontSize: 12, color: C_M.tekstMuted } }, 'Geen pijn'),
                    React.createElement('span', { style: { fontSize: 18, fontWeight: 700, color: isAfwijkend ? C_M.rood : C_M.oranje } }, val || '0'),
                    React.createElement('span', { style: { fontSize: 12, color: C_M.tekstMuted } }, 'Ergste pijn')
                  ),
                  React.createElement('input', {
                    type: 'range', min: param.min, max: param.max, value: val || 0,
                    onChange: function(e) { var nw = Object.assign({}, vitalen); nw[param.id] = e.target.value; setVitalen(nw); },
                    style: { width: '100%', accentColor: C_M.oranje }
                  })
                )
              : React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 8 } },
                  React.createElement('input', {
                    type: 'number', value: val, placeholder: param.placeholder,
                    onChange: function(e) { var nw = Object.assign({}, vitalen); nw[param.id] = e.target.value; setVitalen(nw); },
                    style: { flex: 1, padding: '10px', borderRadius: 8, border: '1px solid ' + (isAfwijkend ? C_M.rood : C_M.border), fontSize: 14, fontFamily: "'DM Sans', sans-serif", outline: 'none', color: C_M.tekstPrimair }
                  }),
                  React.createElement('span', { style: { fontSize: 13, color: C_M.tekstMuted, minWidth: 40 } }, param.eenheid)
                ),
          isAfwijkend && React.createElement('div', { style: { fontSize: 12, color: C_M.rood, fontWeight: 500, marginTop: 4 } }, '\u26A0 Afwijkende waarde')
        );
      }),

      React.createElement('div', { style: { display: 'flex', gap: 8, marginTop: 8 } },
        React.createElement('button', { onClick: function() { setStap(2); }, style: { flex: 1, background: C_M.kaartWit, color: C_M.tekstSecundair, border: '1px solid ' + C_M.border, borderRadius: 8, padding: '12px', fontSize: 14, fontWeight: 500, cursor: 'pointer' } }, '\u2190 Vorige'),
        React.createElement('button', { onClick: function() { setStap(4); }, style: { flex: 2, background: C_M.oranje, color: '#FFFFFF', border: 'none', borderRadius: 8, padding: '12px', fontSize: 14, fontWeight: 600, cursor: 'pointer' } }, 'Volgende \u2192')
      )
    ),

    // ════ STAP 4: Urgentiebepaling ════
    stap === 4 && (function() {
      var urg = berekenUrgentie();
      return React.createElement('div', { style: { animation: 'slideInRight 0.3s ease' } },
        React.createElement('div', { style: { fontSize: 14, fontWeight: 600, color: C_M.tekstPrimair, marginBottom: 4 } }, 'Stap 4 \u2014 NTS Urgentiebepaling'),
        React.createElement('div', { style: { fontSize: 12, color: C_M.tekstMuted, marginBottom: 16 } }, 'Berekend op basis van ingangsklacht, discriminatoren en vitale parameters'),

        React.createElement(Card, { style: { border: '2px solid ' + urg.kleur, background: urg.achtergrond, animation: 'fadeIn 0.5s ease' } },
          React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 } },
            React.createElement('span', { style: { fontSize: 28 } }, urg.icon),
            React.createElement('span', { style: { fontSize: 20, fontWeight: 700, color: urg.kleur } }, urg.label)
          ),
          React.createElement('p', { style: { fontSize: 14, color: C_M.tekstPrimair, lineHeight: 1.6, marginBottom: 8 } }, urg.beschrijving),
          React.createElement('div', { style: { fontSize: 13, color: C_M.tekstSecundair, padding: '8px 0', borderTop: '1px solid ' + C_M.border } },
            'Verwachte reactietijd: ', React.createElement('strong', null, urg.reactietijd)
          )
        ),

        // Onderbouwing
        React.createElement(Card, null,
          React.createElement('div', { style: { fontSize: 13, fontWeight: 600, color: C_M.tekstSecundair, marginBottom: 8 } }, 'Onderbouwing urgentie'),
          React.createElement('div', { style: { fontSize: 13, color: C_M.tekstMuted, marginBottom: 4 } }, 'Ingangsklacht: ' + (gekozenKlacht ? gekozenKlacht.naam : '-')),
          gekozenKlacht && gekozenKlacht.discriminatoren.map(function(d) {
            var a = antwoorden[d.id];
            var impact = a && d.urgentieImpact[a];
            return React.createElement('div', { key: d.id, style: { fontSize: 12, color: impact ? C_M.rood : C_M.tekstMuted, padding: '2px 0' } },
              '\u2022 ' + d.vraag.substring(0, 50) + '... \u2192 ' + (a || '-') + (impact ? ' (' + impact + ')' : '')
            );
          })
        ),

        React.createElement('div', { style: { display: 'flex', gap: 8, marginTop: 8 } },
          React.createElement('button', { onClick: function() { setStap(3); }, style: { flex: 1, background: C_M.kaartWit, color: C_M.tekstSecundair, border: '1px solid ' + C_M.border, borderRadius: 8, padding: '12px', fontSize: 14, fontWeight: 500, cursor: 'pointer' } }, '\u2190 Vorige'),
          React.createElement('button', { onClick: function() { setStap(5); }, style: { flex: 2, background: C_M.oranje, color: '#FFFFFF', border: 'none', borderRadius: 8, padding: '12px', fontSize: 14, fontWeight: 600, cursor: 'pointer' } }, 'Volgende \u2192')
        )
      );
    })(),

    // ════ STAP 5: Routering & Indienen ════
    stap === 5 && (function() {
      var urg = berekenUrgentie();
      var route = bepaalRoute();
      return React.createElement('div', { style: { animation: 'slideInRight 0.3s ease' } },
        React.createElement('div', { style: { fontSize: 14, fontWeight: 600, color: C_M.tekstPrimair, marginBottom: 4 } }, 'Stap 5 \u2014 Routering & Bevestiging'),
        React.createElement('div', { style: { fontSize: 12, color: C_M.tekstMuted, marginBottom: 16 } }, 'Automatisch bepaald op basis van tijdstip en urgentie'),

        React.createElement(Card, { style: { border: '2px solid ' + C_M.blauw } },
          React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 } },
            React.createElement('span', { style: { fontSize: 14, fontWeight: 600, color: C_M.tekstPrimair } }, 'Nu: ' + route.tijdstip),
            React.createElement(Badge, { label: route.dienst, color: C_M.blauw, bgColor: C_M.blauwLicht })
          ),
          React.createElement('div', { style: { fontSize: 12, color: C_M.tekstMuted, marginBottom: 8 } }, route.dienstTijd),
          React.createElement('div', { style: { fontSize: 16, fontWeight: 700, color: C_M.tekstPrimair, marginBottom: 4 } }, route.route),
          React.createElement('div', { style: { fontSize: 13, color: C_M.tekstSecundair } }, 'Reactietijd: ' + route.reactietijd)
        ),

        // Samenvatting
        React.createElement(Card, null,
          React.createElement('div', { style: { fontSize: 13, fontWeight: 600, color: C_M.tekstSecundair, marginBottom: 8 } }, 'Samenvatting melding'),
          React.createElement('div', { style: { fontSize: 12, color: C_M.tekstMuted } }, 'Pati\u00EBnt'),
          React.createElement('div', { style: { fontSize: 14, fontWeight: 500, color: C_M.tekstPrimair, marginBottom: 8 } }, window.patient.naam + ' \u00B7 ' + window.patient.kamer),
          React.createElement('div', { style: { fontSize: 12, color: C_M.tekstMuted } }, 'Ingangsklacht'),
          React.createElement('div', { style: { fontSize: 14, fontWeight: 500, color: C_M.tekstPrimair, marginBottom: 8 } }, gekozenKlacht ? gekozenKlacht.naam : '-'),
          React.createElement('div', { style: { fontSize: 12, color: C_M.tekstMuted } }, 'Beschrijving'),
          React.createElement('div', { style: { fontSize: 14, color: C_M.tekstPrimair, marginBottom: 8 } }, beschrijving),
          React.createElement('div', { style: { fontSize: 12, color: C_M.tekstMuted, marginBottom: 4 } }, 'NTS Urgentie'),
          React.createElement(Badge, { label: urg.label, color: urg.kleur, bgColor: urg.achtergrond })
        ),

        React.createElement('div', { style: { display: 'flex', gap: 8, marginTop: 8 } },
          React.createElement('button', { onClick: function() { setStap(4); }, style: { flex: 1, background: C_M.kaartWit, color: C_M.tekstSecundair, border: '1px solid ' + C_M.border, borderRadius: 8, padding: '12px', fontSize: 14, fontWeight: 500, cursor: 'pointer' } }, '\u2190 Vorige'),
          React.createElement('button', { onClick: handleIndienen, style: { flex: 2, background: C_M.groen, color: '#FFFFFF', border: 'none', borderRadius: 8, padding: '12px', fontSize: 14, fontWeight: 700, cursor: 'pointer' } }, '\u2713 Dien melding in')
        )
      );
    })()
  );
};
