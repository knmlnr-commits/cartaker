// GeriCall — Verzorgende secties v2
// Wijkoverzicht → inzoomen op bewoner → taken/vitalen/notities

var C_V = window.COLORS;

// ══════════════════════════════════════════
// WIJK OVERZICHT — alle bewoners in één oogopslag
// ══════════════════════════════════════════
window.VerzorgendeTaken = function VerzorgendeTaken({ addToast, onSelectBewoner }) {
  var bewoners = window.bewoners;
  var totaalOpen = bewoners.reduce(function(s, b) { return s + b.takenOpen; }, 0);
  var totaal = bewoners.reduce(function(s, b) { return s + b.takenTotaal; }, 0);
  var alerts = bewoners.filter(function(b) { return b.alert; });

  return React.createElement('div', { style: { animation: 'fadeIn 0.3s ease' } },
    // Wijk stats
    React.createElement('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 12 } },
      React.createElement(Card, { style: { padding: 10, textAlign: 'center' } },
        React.createElement('div', { style: { fontSize: 20, fontWeight: 700, color: C_V.oranje } }, bewoners.length),
        React.createElement('div', { style: { fontSize: 10, color: C_V.tekstMuted } }, 'Bewoners')
      ),
      React.createElement(Card, { style: { padding: 10, textAlign: 'center' } },
        React.createElement('div', { style: { fontSize: 20, fontWeight: 700, color: C_V.tekstPrimair } }, totaalOpen),
        React.createElement('div', { style: { fontSize: 10, color: C_V.tekstMuted } }, 'Taken open')
      ),
      React.createElement(Card, { style: { padding: 10, textAlign: 'center' } },
        React.createElement('div', { style: { fontSize: 20, fontWeight: 700, color: alerts.length > 0 ? C_V.rood : C_V.groen } }, alerts.length),
        React.createElement('div', { style: { fontSize: 10, color: C_V.tekstMuted } }, 'Alerts')
      )
    ),

    // Alerts bovenaan
    alerts.length > 0 && React.createElement('div', null,
      alerts.map(function(b) {
        var isU2 = b.alert === 'U2';
        return React.createElement('div', { key: b.id + '_alert', onClick: function() { onSelectBewoner(b); },
          style: { display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', marginBottom: 6,
            background: isU2 ? C_V.roodLicht : C_V.oranjeLicht, borderRadius: 10, cursor: 'pointer',
            border: '1px solid ' + (isU2 ? C_V.rood : C_V.oranje) }
        },
          React.createElement('span', { style: { fontSize: 16 } }, '\u26A0\uFE0F'),
          React.createElement('div', { style: { flex: 1 } },
            React.createElement('div', { style: { fontSize: 13, fontWeight: 600, color: isU2 ? C_V.rood : C_V.oranje } }, b.naam + ' \u00B7 Kamer ' + b.kamer),
            React.createElement('div', { style: { fontSize: 12, color: C_V.tekstSecundair } }, b.alertTekst)
          ),
          React.createElement(Badge, { label: b.alert, color: isU2 ? C_V.rood : C_V.oranje, bgColor: isU2 ? C_V.roodLicht : C_V.oranjeLicht })
        );
      })
    ),

    // Bewoners lijst
    React.createElement(SectionTitle, null, 'Mijn bewoners'),
    bewoners.map(function(b) {
      var gedaan = b.takenTotaal - b.takenOpen;
      var pct = Math.round(gedaan / b.takenTotaal * 100);
      // IoT quick glance: zoek afwijkingen
      var iotWarnings = Object.entries(b.iot).filter(function(e) { return e[1].status === 'let_op'; });

      return React.createElement(Card, { key: b.id, style: { cursor: 'pointer', padding: 12 }, onClick: function() { onSelectBewoner(b); } },
        React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 12 } },
          React.createElement('div', { style: {
            width: 44, height: 44, borderRadius: 22, background: b.alert ? (b.alert === 'U2' ? C_V.roodLicht : C_V.oranjeLicht) : C_V.blauwLicht,
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, fontWeight: 700,
            color: b.alert ? (b.alert === 'U2' ? C_V.rood : C_V.oranje) : C_V.blauw, flexShrink: 0,
          } }, b.initialen),
          React.createElement('div', { style: { flex: 1 } },
            React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' } },
              React.createElement('span', { style: { fontSize: 14, fontWeight: 600, color: C_V.tekstPrimair } }, b.roepnaam),
              React.createElement('span', { style: { fontSize: 11, color: C_V.tekstMuted } }, 'Kamer ' + b.kamer)
            ),
            React.createElement('div', { style: { fontSize: 12, color: C_V.tekstSecundair, marginBottom: 4 } }, b.diagnose.substring(0, 40) + (b.diagnose.length > 40 ? '...' : '')),
            // Taken progress
            React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 8 } },
              React.createElement('div', { style: { flex: 1 } }, React.createElement(ProgressBar, { percentage: pct, height: 4 })),
              React.createElement('span', { style: { fontSize: 11, fontWeight: 600, color: pct === 100 ? C_V.groen : C_V.tekstMuted } }, gedaan + '/' + b.takenTotaal)
            ),
            // IoT warnings
            iotWarnings.length > 0 && React.createElement('div', { style: { display: 'flex', gap: 4, marginTop: 4, flexWrap: 'wrap' } },
              iotWarnings.map(function(w) {
                return React.createElement('span', { key: w[0], style: { fontSize: 10, background: C_V.oranjeLicht, color: C_V.oranje, padding: '1px 6px', borderRadius: 4, fontWeight: 500 } },
                  w[0] === 'saturatie' ? 'SpO2 ' + w[1].waarde + '%' : w[0] === 'slaap' ? 'Slaap \u2193' : w[0] === 'gewicht' ? 'Gewicht \u2191' : w[0] === 'hartslag' ? 'Pols \u2191' : w[0] === 'bloeddruk' ? 'RR \u2191' : w[0]);
              })
            )
          ),
          React.createElement('span', { style: { fontSize: 14, color: C_V.tekstMuted } }, '\u25B6')
        )
      );
    })
  );
};

// ══════════════════════════════════════════
// BEWONER DETAIL — taken + vitalen + notities + dossier
// ══════════════════════════════════════════
window.BewonerDetail = function BewonerDetail({ bewoner, addToast, onTerug, verzorgendeNaam, initialTab }) {
  const { useState } = React;
  var b = bewoner;
  var [taken, setTaken] = useState(b.taken);
  var [notities, setNotities] = useState(b.notities);
  var [nieuweNotitie, setNieuweNotitie] = useState('');
  var [tabDetail, setTabDetail] = useState(initialTab || 'taken');

  var toggle = function(id) {
    var nu = new Date();
    var tijdStr = String(nu.getHours()).padStart(2,'0') + ':' + String(nu.getMinutes()).padStart(2,'0');
    setTaken(function(prev) { return prev.map(function(t) {
      if (t.id !== id) return t;
      return Object.assign({}, t, { gedaan: !t.gedaan, door: t.gedaan ? null : verzorgendeNaam, gedaanOm: t.gedaan ? null : tijdStr });
    }); });
    addToast('Taak bijgewerkt', 'success');
  };

  var voegNotitieToe = function() {
    if (!nieuweNotitie.trim()) return;
    var nu = new Date();
    var tijdStr = String(nu.getHours()).padStart(2,'0') + ':' + String(nu.getMinutes()).padStart(2,'0');
    setNotities(function(prev) { return [{ tekst: nieuweNotitie, auteur: verzorgendeNaam, tijd: tijdStr }].concat(prev); });
    setNieuweNotitie('');
    addToast('Notitie opgeslagen', 'success');
  };

  var gedaan = taken.filter(function(t) { return t.gedaan; }).length;

  // IoT status kleur
  var iotKleur = function(status) {
    if (status === 'let_op') return C_V.oranje;
    if (status === 'alarm') return C_V.rood;
    return C_V.groen;
  };
  var trendIcon = function(trend) {
    if (!trend) return '';
    if (trend === 'stijgend' || trend === 'licht stijgend') return ' \u2191';
    if (trend === 'dalend') return ' \u2193';
    if (trend === 'minder' || trend === 'onrustig' || trend === 'weinig beweging') return ' \u26A0';
    return '';
  };

  var detailTabs = [
    { id: 'taken', label: 'Taken (' + gedaan + '/' + taken.length + ')' },
    { id: 'vitalen', label: 'Vitalen' },
    { id: 'notities', label: 'Notities' },
    { id: 'dossier', label: 'Dossier' },
  ];

  return React.createElement('div', { style: { animation: 'slideInRight 0.3s ease' } },
    // Terug + header
    React.createElement('button', { onClick: onTerug, style: { background: 'none', border: 'none', fontSize: 14, color: C_V.oranje, cursor: 'pointer', marginBottom: 8, fontWeight: 500 } }, '\u2190 Wijk overzicht'),

    React.createElement(Card, { style: { padding: 12 } },
      React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 12 } },
        React.createElement('div', { style: { width: 48, height: 48, borderRadius: 24, background: C_V.oranjeLicht, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 700, color: C_V.oranje } }, b.initialen),
        React.createElement('div', { style: { flex: 1 } },
          React.createElement('div', { style: { fontSize: 17, fontWeight: 700, color: C_V.tekstPrimair } }, b.naam),
          React.createElement('div', { style: { fontSize: 13, color: C_V.tekstSecundair } }, b.afdeling + ' \u00B7 Kamer ' + b.kamer),
          React.createElement('div', { style: { fontSize: 12, color: C_V.tekstMuted } }, b.diagnose)
        )
      )
    ),

    // Alert
    b.openConsulten.length > 0 && React.createElement(Card, { style: { background: C_V.roodLicht, border: '1px solid ' + C_V.rood, padding: 10 } },
      React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 8 } },
        React.createElement('span', { style: { fontSize: 16 } }, '\u26A0\uFE0F'),
        React.createElement('div', { style: { flex: 1 } },
          React.createElement('div', { style: { fontSize: 13, fontWeight: 600, color: C_V.rood } }, 'Consult #' + b.openConsulten[0].id + ' \u2014 ' + b.openConsulten[0].urgentie),
          React.createElement('div', { style: { fontSize: 12, color: C_V.tekstSecundair } }, b.openConsulten[0].beschrijving)
        )
      )
    ),

    // Detail tabs
    React.createElement('div', { style: { display: 'flex', gap: 4, marginBottom: 12, overflowX: 'auto' } },
      detailTabs.map(function(dt) {
        var sel = tabDetail === dt.id;
        return React.createElement('button', { key: dt.id, onClick: function() { setTabDetail(dt.id); }, style: {
          padding: '8px 12px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: sel ? 600 : 400, whiteSpace: 'nowrap',
          background: sel ? C_V.oranje : C_V.kaartWit, color: sel ? '#FFF' : C_V.tekstSecundair, transition: 'all 0.2s',
        } }, dt.label);
      })
    ),

    // ═══ TAKEN ═══
    tabDetail === 'taken' && React.createElement('div', null,
      React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', marginBottom: 6 } },
        React.createElement('span', { style: { fontSize: 12, color: C_V.tekstMuted } }, 'Voortgang'),
        React.createElement('span', { style: { fontSize: 12, fontWeight: 700, color: C_V.oranje } }, Math.round(gedaan / taken.length * 100) + '%')
      ),
      React.createElement(ProgressBar, { percentage: gedaan / taken.length * 100 }),
      React.createElement('div', { style: { marginTop: 10 } },
        taken.map(function(t) {
          return React.createElement('div', { key: t.id, onClick: function() { toggle(t.id); }, style: {
            display: 'flex', alignItems: 'flex-start', gap: 10, padding: '10px 12px', marginBottom: 4,
            background: C_V.kaartWit, borderRadius: 8, border: '1px solid ' + C_V.border, cursor: 'pointer',
            opacity: t.gedaan ? 0.7 : 1, transition: 'all 0.2s',
          } },
            React.createElement('div', { style: {
              width: 22, height: 22, borderRadius: 6, border: '2px solid ' + (t.gedaan ? C_V.groen : C_V.border),
              background: t.gedaan ? C_V.groen : 'transparent', marginTop: 1,
              display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFF', fontSize: 12, fontWeight: 700, flexShrink: 0,
            } }, t.gedaan ? '\u2713' : ''),
            React.createElement('div', { style: { flex: 1 } },
              React.createElement('div', { style: { fontSize: 13, fontWeight: 500, color: C_V.tekstPrimair, textDecoration: t.gedaan ? 'line-through' : 'none' } }, t.tekst),
              React.createElement('div', { style: { fontSize: 11, color: C_V.tekstMuted } },
                t.tijd + (t.gedaan ? ' \u00B7 \u2713 ' + t.door + ' om ' + t.gedaanOm : ''))
            )
          );
        })
      )
    ),

    // ═══ VITALEN (IoT) ═══
    tabDetail === 'vitalen' && React.createElement('div', null,
      React.createElement('div', { style: { fontSize: 12, color: C_V.tekstMuted, marginBottom: 8 } }, 'Realtime via IoT sensoren \u00B7 Philips ePatch + bedsensor'),
      React.createElement('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 } },
        [
          { key: 'hartslag', label: 'Hartslag', icon: '\u2764\uFE0F' },
          { key: 'saturatie', label: 'SpO2', icon: '\uD83D\uDCA8' },
          { key: 'temperatuur', label: 'Temperatuur', icon: '\uD83C\uDF21\uFE0F' },
          { key: 'bloeddruk', label: 'Bloeddruk', icon: '\uD83E\uDE78' },
          { key: 'beweging', label: 'Beweging', icon: '\uD83D\uDEB6' },
          { key: 'valrisico', label: 'Valdetectie', icon: '\u26A0\uFE0F' },
          { key: 'slaap', label: 'Slaap vannacht', icon: '\uD83D\uDCA4' },
          { key: 'gewicht', label: 'Gewicht', icon: '\u2696\uFE0F' },
        ].map(function(param) {
          var data = b.iot[param.key];
          var kleur = iotKleur(data.status);
          return React.createElement(Card, { key: param.key, style: { padding: 10, border: data.status !== 'normaal' ? '1.5px solid ' + kleur : '1px solid ' + C_V.border } },
            React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 } },
              React.createElement('span', { style: { fontSize: 16 } }, param.icon),
              React.createElement('span', { style: { fontSize: 10, color: C_V.tekstMuted } }, data.updated)
            ),
            React.createElement('div', { style: { fontSize: 20, fontWeight: 700, color: kleur } }, data.waarde + trendIcon(data.trend)),
            React.createElement('div', { style: { fontSize: 11, color: C_V.tekstMuted } }, param.label + (data.eenheid ? ' ' + data.eenheid : '')),
            data.status === 'let_op' && React.createElement('div', { style: { fontSize: 10, color: C_V.oranje, fontWeight: 500, marginTop: 2 } }, '\u26A0 ' + (data.trend || 'Let op'))
          );
        })
      ),
      React.createElement('div', { style: { fontSize: 11, color: C_V.tekstMuted, textAlign: 'center', marginTop: 8, fontStyle: 'italic' } },
        'Sensoren: Philips ePatch (hartslag, SpO2) \u00B7 Withings bedsensor (slaap, beweging) \u00B7 Withings Body+ (gewicht)')
    ),

    // ═══ NOTITIES ═══
    tabDetail === 'notities' && React.createElement('div', null,
      React.createElement(Card, { style: { padding: 12 } },
        React.createElement('textarea', {
          value: nieuweNotitie,
          onChange: function(e) { setNieuweNotitie(e.target.value); },
          placeholder: 'Snelle notitie...',
          style: { width: '100%', minHeight: 60, padding: 10, borderRadius: 8, border: '1px solid ' + C_V.border, fontSize: 14, fontFamily: "'DM Sans', sans-serif", resize: 'vertical', outline: 'none', color: C_V.tekstPrimair, marginBottom: 8 }
        }),
        React.createElement('button', { onClick: voegNotitieToe, style: {
          background: C_V.oranje, color: '#FFF', border: 'none', borderRadius: 8, padding: '10px', fontSize: 13, fontWeight: 600, cursor: 'pointer', width: '100%',
        } }, 'Notitie opslaan')
      ),
      notities.map(function(n, i) {
        return React.createElement(Card, { key: i, style: { padding: 10, borderLeft: '3px solid ' + C_V.oranje } },
          React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', marginBottom: 2 } },
            React.createElement('span', { style: { fontSize: 12, fontWeight: 600, color: C_V.oranje } }, n.auteur),
            React.createElement('span', { style: { fontSize: 11, color: C_V.tekstMuted } }, n.tijd)
          ),
          React.createElement('div', { style: { fontSize: 13, color: C_V.tekstPrimair, lineHeight: 1.5 } }, n.tekst)
        );
      })
    ),

    // ═══ DOSSIER ═══
    tabDetail === 'dossier' && React.createElement('div', null,
      // Re-ablement
      b.reablement && React.createElement(Card, null,
        React.createElement('div', { style: { fontSize: 13, fontWeight: 600, color: C_V.tekstSecundair, marginBottom: 4 } }, 'Re-ablement'),
        React.createElement('div', { style: { fontSize: 14, fontWeight: 600, color: C_V.tekstPrimair } }, b.reablement.fase),
        React.createElement('div', { style: { fontSize: 12, color: C_V.tekstMuted, marginBottom: 6 } }, b.reablement.coordinatorNaam),
        React.createElement(ProgressBar, { percentage: b.reablement.voortgang }),
        React.createElement('div', { style: { fontSize: 11, color: C_V.tekstMuted, marginTop: 4 } }, b.reablement.voortgang + '% \u00B7 tot ' + b.reablement.einddatum)
      ),
      // Behandelplan
      React.createElement('div', { style: { fontSize: 13, fontWeight: 600, color: C_V.tekstSecundair, marginBottom: 6 } }, 'Behandelplan'),
      b.behandelplan.map(function(item, i) {
        var actueel = item.status === 'Actueel';
        return React.createElement(Card, { key: i, style: { padding: 10 } },
          React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 } },
            React.createElement('span', { style: { fontSize: 14, fontWeight: 600, color: C_V.tekstPrimair } }, item.onderdeel),
            React.createElement(Badge, { label: item.status, color: actueel ? C_V.groen : C_V.oranje, bgColor: actueel ? C_V.groenLicht : C_V.oranjeLicht })
          ),
          React.createElement('div', { style: { fontSize: 12, color: C_V.tekstSecundair, lineHeight: 1.5 } }, item.toelichting),
          React.createElement('div', { style: { fontSize: 11, color: C_V.tekstMuted, marginTop: 4 } }, 'Bijgewerkt: ' + item.bijgewerkt)
        );
      }),
      React.createElement('div', { style: { fontSize: 12, color: C_V.tekstMuted, marginTop: 8 } }, 'Wijzigingen via GeriForce')
    )
  );
};

// ══════════════════════════════════════════
// RAPPORTAGE (ongewijzigd maar nu met bewoner context)
// ══════════════════════════════════════════
window.VerzorgendeRapportage = function VerzorgendeRapportage({ addToast }) {
  const { useState } = React;
  var [tekst, setTekst] = useState('');
  var [categorie, setCategorie] = useState('ochtend');
  var [bewoner, setBewoner] = useState(window.bewoners[0].id);
  var cats = [{ id: 'ochtend', label: 'Ochtend' },{ id: 'middag', label: 'Middag' },{ id: 'avond', label: 'Avond' },{ id: 'nacht', label: 'Nacht' }];

  return React.createElement('div', { style: { animation: 'fadeIn 0.3s ease' } },
    React.createElement(SectionTitle, null, 'Rapportage invullen'),
    // Bewoner keuze
    React.createElement('div', { style: { display: 'flex', gap: 6, marginBottom: 8, overflowX: 'auto' } },
      window.bewoners.map(function(b) {
        var sel = bewoner === b.id;
        return React.createElement('button', { key: b.id, onClick: function() { setBewoner(b.id); }, style: {
          padding: '6px 12px', borderRadius: 20, border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: sel ? 600 : 400, whiteSpace: 'nowrap',
          background: sel ? C_V.oranje : C_V.kaartWit, color: sel ? '#FFF' : C_V.tekstSecundair, transition: 'all 0.2s',
        } }, b.roepnaam);
      })
    ),
    // Categorie
    React.createElement('div', { style: { display: 'flex', gap: 6, marginBottom: 12 } },
      cats.map(function(c) {
        var sel = categorie === c.id;
        return React.createElement('button', { key: c.id, onClick: function() { setCategorie(c.id); }, style: {
          flex: 1, padding: '8px 0', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: sel ? 600 : 400,
          background: sel ? C_V.oranjeLicht : C_V.kaartWit, color: sel ? C_V.oranje : C_V.tekstSecundair, transition: 'all 0.2s',
        } }, c.label);
      })
    ),
    React.createElement(Card, null,
      React.createElement('textarea', {
        value: tekst, onChange: function(e) { setTekst(e.target.value); },
        placeholder: 'Rapportage voor ' + window.bewoners.find(function(b) { return b.id === bewoner; }).roepnaam + '...',
        style: { width: '100%', minHeight: 100, padding: 12, borderRadius: 8, border: '1px solid ' + C_V.border, fontSize: 14, fontFamily: "'DM Sans', sans-serif", resize: 'vertical', outline: 'none', color: C_V.tekstPrimair }
      }),
      React.createElement('div', { style: { fontSize: 12, color: C_V.tekstMuted, marginTop: 8 } }, 'Zichtbaar voor collega\'s \u00E9n familie.'),
      React.createElement('button', { onClick: function() {
        if (tekst.trim()) { addToast('Rapportage opgeslagen', 'success'); setTekst(''); } else addToast('Schrijf eerst een rapportage');
      }, style: { background: C_V.oranje, color: '#FFF', border: 'none', borderRadius: 8, padding: '12px', fontSize: 14, fontWeight: 600, cursor: 'pointer', width: '100%', marginTop: 8 } }, 'Opslaan')
    ),
    // Recente rapportages
    React.createElement(SectionTitle, null, 'Recent'),
    window.dagrapportages.map(function(r, i) {
      return React.createElement(Card, { key: i, style: { padding: 10 } },
        React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', marginBottom: 2 } },
          React.createElement('span', { style: { fontSize: 12, fontWeight: 600, color: r.isFamilie ? C_V.groen : C_V.oranje } }, r.auteur),
          React.createElement('span', { style: { fontSize: 11, color: C_V.tekstMuted } }, r.datum)
        ),
        React.createElement('div', { style: { fontSize: 13, color: C_V.tekstSecundair, lineHeight: 1.5 } }, r.tekst)
      );
    })
  );
};

// ══════════════════════════════════════════
// LEREN — verzorgende (volledig met lessen + video's)
// ══════════════════════════════════════════
window.VerzorgendeLeren = function VerzorgendeLeren({ addToast }) {
  return React.createElement(ModuleOverzicht, { modules: window.verzorgendeModules, shared: window.gedeeldeModule, addToast: addToast, accentKleur: C_V.oranje, rol: 'verzorgende' });
};

// ══════════════════════════════════════════
// GEDEELD: Module overzicht + les detail component
// ══════════════════════════════════════════
window.ModuleOverzicht = function ModuleOverzicht({ modules, shared, addToast, accentKleur, rol }) {
  const { useState } = React;
  var [openModule, setOpenModule] = useState(null);
  var [openLes, setOpenLes] = useState(null);
  var kleur = accentKleur || C_V.oranje;

  var statusLabel = function(s) {
    if (s === 'certificaat') return { label: 'Behaald \u2713', color: C_V.groen, bg: C_V.groenLicht };
    if (s === 'bezig') return { label: 'In uitvoering', color: C_V.oranje, bg: C_V.oranjeLicht };
    return { label: 'Nog te starten', color: C_V.tekstMuted, bg: C_V.achtergrond };
  };

  var typeIcon = function(t) {
    if (t === 'video') return '\uD83C\uDFA5';
    if (t === 'interactief') return '\uD83C\uDFAE';
    if (t === 'toets') return '\uD83D\uDCDD';
    return '\uD83D\uDCD6';
  };

  // ── Les detail view ──
  if (openLes) {
    var les = openLes;
    return React.createElement('div', { style: { animation: 'slideInRight 0.3s ease' } },
      React.createElement('button', { onClick: function() { setOpenLes(null); }, style: { background: 'none', border: 'none', fontSize: 14, color: kleur, cursor: 'pointer', marginBottom: 12, fontWeight: 500 } }, '\u2190 Terug naar module'),

      React.createElement(Card, null,
        React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 } },
          React.createElement('span', { style: { fontSize: 24 } }, typeIcon(les.type)),
          React.createElement('div', null,
            React.createElement('div', { style: { fontSize: 16, fontWeight: 700, color: C_V.tekstPrimair } }, les.titel),
            React.createElement('div', { style: { fontSize: 12, color: C_V.tekstMuted } }, les.duur + ' \u00B7 ' + (les.type === 'video' ? 'Video' : les.type === 'interactief' ? 'Interactief' : les.type === 'toets' ? 'Toets' : 'Lesstof'))
          )
        ),
        les.voltooid && React.createElement('div', { style: { padding: '6px 12px', background: C_V.groenLicht, borderRadius: 6, fontSize: 12, color: C_V.groen, fontWeight: 600, marginBottom: 12 } }, '\u2713 Deze les is voltooid'),
        React.createElement('div', { style: { fontSize: 14, color: C_V.tekstSecundair, lineHeight: 1.7, marginBottom: 16 } }, les.beschrijving)
      ),

      // Video link
      les.video && React.createElement(Card, { style: { border: '2px solid ' + kleur, cursor: 'pointer' }, onClick: function() { window.open(les.video, '_blank'); } },
        React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 12 } },
          React.createElement('div', { style: { width: 48, height: 48, borderRadius: 8, background: C_V.roodLicht, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, flexShrink: 0 } }, '\u25B6\uFE0F'),
          React.createElement('div', { style: { flex: 1 } },
            React.createElement('div', { style: { fontSize: 14, fontWeight: 600, color: kleur } }, 'Bekijk video'),
            React.createElement('div', { style: { fontSize: 12, color: C_V.tekstMuted, wordBreak: 'break-all' } }, les.video.substring(0, 50) + '...')
          )
        )
      ),

      // Start/voltooi knop
      React.createElement('button', { onClick: function() {
        if (les.video) { window.open(les.video, '_blank'); } else { addToast(les.voltooid ? 'Les opnieuw geopend' : 'Les gestart!', 'success'); }
      }, style: {
        background: kleur, color: '#FFF', border: 'none', borderRadius: 8, padding: '14px', fontSize: 15, fontWeight: 600, cursor: 'pointer', width: '100%', marginTop: 12,
      } }, les.voltooid ? 'Opnieuw bekijken' : les.video ? 'Bekijk video en voltooi' : 'Start les')
    );
  }

  // ── Module detail view ──
  if (openModule) {
    var m = openModule;
    var st = statusLabel(m.status);
    var voltooid = m.lessen ? m.lessen.filter(function(l) { return l.voltooid; }).length : 0;
    var totaal = m.lessen ? m.lessen.length : 0;

    return React.createElement('div', { style: { animation: 'slideInRight 0.3s ease' } },
      React.createElement('button', { onClick: function() { setOpenModule(null); }, style: { background: 'none', border: 'none', fontSize: 14, color: kleur, cursor: 'pointer', marginBottom: 12, fontWeight: 500 } }, '\u2190 Alle modules'),

      React.createElement(Card, null,
        React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 } },
          React.createElement('span', { style: { fontSize: 16, fontWeight: 700, color: C_V.tekstPrimair } }, m.naam),
          React.createElement(Badge, { label: st.label, color: st.color, bgColor: st.bg })
        ),
        React.createElement('div', { style: { fontSize: 13, color: C_V.tekstSecundair, lineHeight: 1.6, marginBottom: 10 } }, m.beschrijving),
        m.duur && React.createElement('div', { style: { fontSize: 12, color: C_V.tekstMuted, marginBottom: 4 } }, '\u23F1 ' + m.duur + (m.aanbieder ? ' \u00B7 ' + m.aanbieder : '')),
        React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', marginBottom: 4, marginTop: 8 } },
          React.createElement('span', { style: { fontSize: 12, color: C_V.tekstMuted } }, voltooid + ' van ' + totaal + ' lessen voltooid'),
          React.createElement('span', { style: { fontSize: 12, fontWeight: 700, color: kleur } }, Math.round(voltooid / totaal * 100) + '%')
        ),
        React.createElement(ProgressBar, { percentage: voltooid / totaal * 100, color: kleur })
      ),

      React.createElement(SectionTitle, null, 'Lessen'),
      m.lessen && m.lessen.map(function(les, i) {
        return React.createElement('div', { key: i, onClick: function() { setOpenLes(les); }, style: {
          display: 'flex', alignItems: 'flex-start', gap: 10, padding: '12px', marginBottom: 4,
          background: C_V.kaartWit, borderRadius: 10, border: '1px solid ' + C_V.border, cursor: 'pointer',
          opacity: les.voltooid ? 0.8 : 1,
        } },
          React.createElement('div', { style: {
            width: 28, height: 28, borderRadius: 14, background: les.voltooid ? C_V.groen : C_V.border,
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: les.voltooid ? '#FFF' : C_V.tekstMuted,
            fontSize: 12, fontWeight: 700, flexShrink: 0, marginTop: 2,
          } }, les.voltooid ? '\u2713' : (i + 1)),
          React.createElement('div', { style: { flex: 1 } },
            React.createElement('div', { style: { fontSize: 14, fontWeight: 500, color: C_V.tekstPrimair } }, les.titel),
            React.createElement('div', { style: { fontSize: 12, color: C_V.tekstMuted } },
              typeIcon(les.type) + ' ' + (les.type === 'video' ? 'Video' : les.type === 'interactief' ? 'Interactief' : les.type === 'toets' ? 'Toets' : 'Lesstof') + ' \u00B7 ' + les.duur
            )
          ),
          React.createElement('span', { style: { fontSize: 14, color: les.video ? kleur : C_V.tekstMuted } }, '\u25B6')
        );
      })
    );
  }

  // ── Modules lijst ──
  return React.createElement('div', { style: { animation: 'fadeIn 0.3s ease' } },
    React.createElement(SectionTitle, null, rol === 'verzorgende' ? 'Verplichte modules' : 'Modules voor familie'),

    // Klantcertificaat (alleen verzorgende)
    rol === 'verzorgende' && React.createElement(Card, { style: { background: C_V.groenLicht, border: '1px solid ' + C_V.groen, padding: 12 } },
      React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 8 } },
        React.createElement('span', { style: { fontSize: 20 } }, '\u2705'),
        React.createElement('div', null,
          React.createElement('div', { style: { fontSize: 14, fontWeight: 600, color: C_V.groen } }, 'Zonnehof \u2014 toegangscertificaat behaald'),
          React.createElement('div', { style: { fontSize: 12, color: C_V.tekstSecundair } }, 'Geldig t/m december 2026')
        )
      )
    ),

    modules.map(function(m, i) {
      var st = statusLabel(m.status);
      var voltooid = m.lessen ? m.lessen.filter(function(l) { return l.voltooid; }).length : 0;
      var totaal = m.lessen ? m.lessen.length : 0;
      return React.createElement(Card, { key: i, style: { cursor: 'pointer' }, onClick: function() { setOpenModule(m); } },
        React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 } },
          React.createElement('span', { style: { fontSize: 14, fontWeight: 600, color: C_V.tekstPrimair, flex: 1, marginRight: 8 } }, m.naam),
          React.createElement(Badge, { label: st.label, color: st.color, bgColor: st.bg })
        ),
        React.createElement('div', { style: { fontSize: 12, color: C_V.tekstMuted, marginBottom: 6 } },
          totaal + ' lessen' + (m.duur ? ' \u00B7 ' + m.duur : '') + ' \u00B7 ' + voltooid + '/' + totaal + ' voltooid'),
        React.createElement(ProgressBar, { percentage: m.voortgang, color: kleur })
      );
    }),

    // Shared module
    shared && React.createElement('div', null,
      React.createElement(SectionTitle, null, 'Kennismodule bij pati\u00EBnt'),
      React.createElement(Card, { style: { border: '2px solid ' + kleur, cursor: 'pointer' }, onClick: function() { setOpenModule(shared); } },
        shared.aanbieder && React.createElement('div', { style: { fontSize: 11, fontWeight: 600, color: kleur, marginBottom: 4 } }, shared.aanbieder),
        React.createElement('div', { style: { fontSize: 15, fontWeight: 600, color: C_V.tekstPrimair, marginBottom: 4 } }, shared.naam),
        React.createElement('div', { style: { fontSize: 13, color: C_V.tekstSecundair, marginBottom: 8 } }, shared.beschrijving),
        React.createElement('div', { style: { fontSize: 12, color: C_V.tekstMuted, marginBottom: 6 } }, shared.voltooid + ' van ' + shared.totaal + ' lessen voltooid'),
        React.createElement(ProgressBar, { percentage: shared.voltooid / shared.totaal * 100, color: kleur }),
        React.createElement('div', { style: { fontSize: 13, color: kleur, fontWeight: 600, marginTop: 8, textAlign: 'center' } }, 'Open module \u2192')
      )
    )
  );
};
