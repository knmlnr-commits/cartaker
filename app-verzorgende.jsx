// GeriCall — Verzorgende secties v2
// Wijkoverzicht → inzoomen op bewoner → taken/vitalen/notities

var C_V = window.COLORS;

// ══════════════════════════════════════════
// WIJK OVERZICHT — alle bewoners in één oogopslag
// ══════════════════════════════════════════
window.VerzorgendeTaken = function VerzorgendeTaken({ addToast, onSelectBewoner, weergave }) {
  var w = weergave || 'normaal';
  var bewoners = window.bewoners;
  var totaalOpen = bewoners.reduce(function(s, b) { return s + b.takenOpen; }, 0);
  var totaal = bewoners.reduce(function(s, b) { return s + b.takenTotaal; }, 0);
  var alerts = bewoners.filter(function(b) { return b.alert; });

  // Scroll naar sectie
  var scrollNaar = function(id) {
    var el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return React.createElement('div', { style: { animation: 'fadeIn 0.3s ease' } },
    // Wijk stats — klikbaar
    React.createElement('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 12 } },
      React.createElement(Card, { style: { padding: 10, textAlign: 'center', cursor: 'pointer' }, onClick: function() { scrollNaar('wijk-bewoners'); } },
        React.createElement('div', { style: { fontSize: 20, fontWeight: 700, color: C_V.oranje } }, bewoners.length),
        React.createElement('div', { style: { fontSize: 10, color: C_V.tekstMuted } }, 'Bewoners')
      ),
      React.createElement(Card, { style: { padding: 10, textAlign: 'center', cursor: 'pointer' }, onClick: function() { scrollNaar('wijk-bewoners'); } },
        React.createElement('div', { style: { fontSize: 20, fontWeight: 700, color: C_V.tekstPrimair } }, totaalOpen),
        React.createElement('div', { style: { fontSize: 10, color: C_V.tekstMuted } }, 'Taken open')
      ),
      React.createElement(Card, { style: { padding: 10, textAlign: 'center', cursor: alerts.length > 0 ? 'pointer' : 'default' }, onClick: function() { if (alerts.length > 0) scrollNaar('wijk-alerts'); } },
        React.createElement('div', { style: { fontSize: 20, fontWeight: 700, color: alerts.length > 0 ? C_V.rood : C_V.groen } }, alerts.length),
        React.createElement('div', { style: { fontSize: 10, color: C_V.tekstMuted } }, 'Alerts')
      )
    ),

    // Alerts bovenaan
    alerts.length > 0 && React.createElement('div', { id: 'wijk-alerts' },
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
    React.createElement('div', { id: 'wijk-bewoners' }, React.createElement(SectionTitle, null, 'Mijn bewoners')),
    bewoners.map(function(b) {
      var gedaan = b.takenTotaal - b.takenOpen;
      var pct = Math.round(gedaan / b.takenTotaal * 100);
      // IoT quick glance: zoek afwijkingen
      var iotWarnings = Object.entries(b.iot).filter(function(e) { return e[1].status === 'let_op'; });

      return React.createElement(Card, { key: b.id, style: { cursor: 'pointer', padding: 12 }, onClick: function() { onSelectBewoner(b); } },
        React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 12 } },
          React.createElement('div', { style: {
            width: 44, height: 44, borderRadius: 22, background: C_V.achtergrond,
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, fontWeight: 700,
            color: C_V.tekstSecundair, flexShrink: 0,
            border: b.alert ? '2px solid ' + (b.alert === 'U2' ? C_V.rood : C_V.oranje) : '1px solid ' + C_V.border,
          } }, b.initialen),
          React.createElement('div', { style: { flex: 1 } },
            React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' } },
              React.createElement('span', { style: { fontSize: 14, fontWeight: 600, color: C_V.tekstPrimair } }, b.roepnaam),
              React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 6 } },
                React.createElement(StemmingWidget, { bewonerId: b.id, compact: true, gebruikerNaam: 'Sandra B.', gebruikerRol: 'verzorgende' }),
                React.createElement('span', { style: { fontSize: 11, color: C_V.tekstMuted } }, '\u00B7 Kamer ' + b.kamer)
              )
            ),
            React.createElement('div', { style: { fontSize: 12, color: C_V.tekstSecundair, marginBottom: 4 } }, b.diagnose.substring(0, 40) + (b.diagnose.length > 40 ? '...' : '')),
            // Taken progress
            React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 8 } },
              React.createElement('div', { style: { flex: 1 } }, React.createElement(ProgressBar, { percentage: pct, height: 4 })),
              React.createElement('span', { style: { fontSize: 11, fontWeight: 600, color: pct === 100 ? C_V.groen : C_V.tekstMuted } }, gedaan + '/' + b.takenTotaal)
            ),
            // IoT warnings (alleen uitgebreid)
            w === 'uitgebreid' && iotWarnings.length > 0 && React.createElement('div', { style: { display: 'flex', gap: 4, marginTop: 4, flexWrap: 'wrap' } },
              iotWarnings.map(function(w) {
                return React.createElement('span', { key: w[0], style: { fontSize: 10, background: C_V.achtergrond, color: C_V.tekstSecundair, padding: '1px 6px', borderRadius: 4, fontWeight: 400 } },
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
window.BewonerDetail = function BewonerDetail({ bewoner, addToast, onTerug, verzorgendeNaam, initialTab, toegang, weergave }) {
  var tg = toegang || window.zorgToegang.verzorgende;
  var w = weergave || 'normaal';
  const { useState } = React;
  var b = bewoner;
  var [taken, setTaken] = useState(b.taken);
  var [notities, setNotities] = useState(b.notities);
  var [nieuweNotitie, setNieuweNotitie] = useState('');
  var [tabDetail, setTabDetail] = useState(initialTab || 'taken');
  var [openConsult, setOpenConsult] = useState(null);

  // Consult detail view
  if (openConsult) {
    return React.createElement(ConsultDetail, { consult: openConsult, onTerug: function() { setOpenConsult(null); }, addToast: addToast, readOnly: false });
  }

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
    { id: 'taken', label: 'Taken (' + gedaan + '/' + taken.length + ')', show: true },
    { id: 'vitalen', label: 'Vitalen', show: w === 'uitgebreid' && tg.iot },
    { id: 'notities', label: 'Notities', show: true },
    { id: 'dossier', label: 'Dossier', show: w === 'uitgebreid' && tg.dossier },
  ].filter(function(dt) { return dt.show; });

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

    // Stemming
    React.createElement(StemmingWidget, {
      bewonerId: b.id,
      gebruikerNaam: verzorgendeNaam,
      gebruikerRol: 'verzorgende',
      onUpdate: function() { addToast('Stemming bijgewerkt', 'success'); }
    }),

    // Alert (alleen bij uitgebreid + consulten-toegang)
    w === 'uitgebreid' && tg.consulten && b.openConsulten.length > 0 && React.createElement(Card, { style: { background: C_V.roodLicht, border: '1px solid ' + C_V.rood, padding: 10, cursor: 'pointer' }, onClick: function() { setOpenConsult(b.openConsulten[0]); } },
      React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 8 } },
        React.createElement('span', { style: { fontSize: 16 } }, '\u26A0\uFE0F'),
        React.createElement('div', { style: { flex: 1 } },
          React.createElement('div', { style: { fontSize: 13, fontWeight: 600, color: C_V.rood } }, 'Consult #' + b.openConsulten[0].id + ' \u2014 ' + b.openConsulten[0].urgentie),
          React.createElement('div', { style: { fontSize: 12, color: C_V.tekstSecundair } }, b.openConsulten[0].beschrijving)
        ),
        React.createElement('span', { style: { fontSize: 12, color: C_V.tekstMuted } }, '\u25B6')
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
// OVERDRACHT — shift handover
// ══════════════════════════════════════════
window.OverdrachtScherm = function OverdrachtScherm({ verzorgendeNaam, addToast }) {
  var { useState } = React;
  var bewoners = window.bewoners;
  var [algemeenNotitie, setAlgemeenNotitie] = useState('');
  var [ingediend, setIngediend] = useState(false);
  var [aandachtspunten, setAandachtspunten] = useState({});

  var nu = new Date();
  var uur = nu.getHours();
  var dienst = uur < 15 ? 'ochtend \u2192 middag' : uur < 23 ? 'middag \u2192 avond' : 'avond \u2192 nacht';

  var toggleAandacht = function(bewId, punt) {
    var key = bewId + '_' + punt;
    var nw = Object.assign({}, aandachtspunten);
    nw[key] = !nw[key];
    setAandachtspunten(nw);
  };

  if (ingediend) {
    return React.createElement('div', { style: { textAlign: 'center', padding: '40px 0', animation: 'scaleIn 0.4s ease' } },
      React.createElement('div', { style: { width: 56, height: 56, borderRadius: 28, background: C_V.groenLicht, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: 28 } }, '\u2713'),
      React.createElement('div', { style: { fontSize: 18, fontWeight: 700, color: C_V.groen, marginBottom: 4 } }, 'Overdracht verstuurd'),
      React.createElement('div', { style: { fontSize: 14, color: C_V.tekstSecundair, marginBottom: 20 } }, 'De volgende dienst ontvangt een notificatie'),
      React.createElement('button', { onClick: function() { setIngediend(false); setAlgemeenNotitie(''); setAandachtspunten({}); }, style: {
        background: C_V.oranje, color: '#FFF', border: 'none', borderRadius: 8, padding: '12px 24px', fontSize: 14, fontWeight: 600, cursor: 'pointer',
      } }, 'Nieuwe overdracht')
    );
  }

  return React.createElement('div', { style: { animation: 'fadeIn 0.3s ease' } },
    React.createElement(SectionTitle, null, 'Dienst overdracht'),
    React.createElement('div', { style: { fontSize: 13, color: C_V.tekstSecundair, marginBottom: 12 } }, verzorgendeNaam + ' \u00B7 ' + dienst),

    // Per bewoner: samenvatting + aandachtspunten
    bewoners.map(function(b) {
      var gedaan = b.taken.filter(function(t) { return t.gedaan; }).length;
      var stm = window.stemmingen[b.id];
      var stOpt = window.stemmingOpties;
      var huidige = stOpt.find(function(o) { return o.score === (stm ? stm.score : 3); }) || stOpt[2];
      var laatsteNotitie = b.notities && b.notities[0];

      var mogelijkeAandacht = [];
      if (b.alert) mogelijkeAandacht.push('Open consult: ' + (b.alertTekst || b.alert));
      if (b.iot && b.iot.saturatie && b.iot.saturatie.status === 'let_op') mogelijkeAandacht.push('SpO2 let op: ' + b.iot.saturatie.waarde + '%');
      if (b.iot && b.iot.slaap && b.iot.slaap.status === 'let_op') mogelijkeAandacht.push('Slaap: ' + b.iot.slaap.waarde);
      if (gedaan < b.taken.length) mogelijkeAandacht.push('Taken niet volledig: ' + gedaan + '/' + b.taken.length);
      mogelijkeAandacht.push('Stemming: ' + huidige.label);

      return React.createElement(Card, { key: b.id, style: { padding: 12 } },
        // Header
        React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 } },
          React.createElement('div', { style: { width: 12, height: 12, borderRadius: 6, background: huidige.kleur } }),
          React.createElement('div', { style: { fontSize: 15, fontWeight: 600, color: C_V.tekstPrimair, flex: 1 } }, b.roepnaam),
          React.createElement('span', { style: { fontSize: 12, color: C_V.tekstMuted } }, 'Kamer ' + b.kamer)
        ),
        // Laatste notitie
        laatsteNotitie && React.createElement('div', { style: { fontSize: 12, color: C_V.tekstSecundair, marginBottom: 8, padding: '6px 8px', background: C_V.achtergrond, borderRadius: 6, lineHeight: 1.4 } },
          laatsteNotitie.tekst
        ),
        // Aandachtspunten als vinkjes
        mogelijkeAandacht.map(function(punt, i) {
          var key = b.id + '_' + punt;
          var checked = aandachtspunten[key];
          return React.createElement('label', { key: i, style: { display: 'flex', alignItems: 'center', gap: 8, padding: '4px 0', cursor: 'pointer', fontSize: 13, color: C_V.tekstPrimair } },
            React.createElement('input', { type: 'checkbox', checked: checked || false, onChange: function() { toggleAandacht(b.id, punt); }, style: { accentColor: C_V.oranje, width: 16, height: 16 } }),
            React.createElement('span', { style: { color: checked ? C_V.oranje : C_V.tekstPrimair } }, punt)
          );
        })
      );
    }),

    // Algemene notitie
    React.createElement(Card, { style: { padding: 12 } },
      React.createElement('div', { style: { fontSize: 13, fontWeight: 600, color: C_V.tekstSecundair, marginBottom: 6 } }, 'Algemene opmerkingen'),
      React.createElement('textarea', {
        value: algemeenNotitie, onChange: function(e) { setAlgemeenNotitie(e.target.value); },
        placeholder: 'Iets wat de volgende dienst moet weten...',
        style: { width: '100%', minHeight: 70, padding: 10, borderRadius: 8, border: '1px solid ' + C_V.border, fontSize: 14, fontFamily: "'DM Sans', sans-serif", resize: 'vertical', outline: 'none', color: C_V.tekstPrimair }
      })
    ),

    // Indienen
    React.createElement('button', { onClick: function() {
      var aangevinkt = Object.values(aandachtspunten).filter(function(v) { return v; }).length;
      if (aangevinkt === 0 && !algemeenNotitie.trim()) { addToast('Vink minimaal 1 aandachtspunt aan of schrijf een opmerking'); return; }
      setIngediend(true);
      addToast('Overdracht verstuurd', 'success');
    }, style: {
      background: C_V.oranje, color: '#FFF', border: 'none', borderRadius: 8, padding: '14px', fontSize: 15, fontWeight: 600, cursor: 'pointer', width: '100%', marginTop: 8,
    } }, 'Verstuur overdracht')
  );
};

// ══════════════════════════════════════════
// RAPPORTAGE (ongewijzigd maar nu met bewoner context)
// ══════════════════════════════════════════
window.VerzorgendeRapportage = function VerzorgendeRapportage({ addToast, weergave }) {
  var w = weergave || 'normaal';
  const { useState } = React;
  var [tekst, setTekst] = useState('');
  var [categorie, setCategorie] = useState('ochtend');
  var [bewoner, setBewoner] = useState(window.bewoners[0].id);
  var [zichtbaarFamilie, setZichtbaarFamilie] = useState(true);
  var [zoekRapportage, setZoekRapportage] = useState('');
  var [toonAlle, setToonAlle] = useState(false);
  var [datumVan, setDatumVan] = useState('');
  var [datumTot, setDatumTot] = useState('');
  var [toonDatumFilter, setToonDatumFilter] = useState(false);
  var [toonEpd, setToonEpd] = useState(false);
  var cats = [{ id: 'ochtend', label: 'Ochtend' },{ id: 'middag', label: 'Middag' },{ id: 'avond', label: 'Avond' },{ id: 'nacht', label: 'Nacht' }];

  // Snelfilters voor datum
  var snelFilters = [
    { label: 'Vandaag', filter: function(d) { return d.indexOf('Vandaag') !== -1; } },
    { label: 'Gisteren', filter: function(d) { return d.indexOf('Gisteren') !== -1; } },
    { label: 'Deze week', filter: function() { return true; } },
  ];

  // Rapportages voor geselecteerde bewoner
  var alleRapportages = (window.dagrapportages && window.dagrapportages[bewoner]) || [];
  var gefilterd = alleRapportages.filter(function(r) {
    // Trefwoord filter
    if (zoekRapportage.trim()) {
      var q = zoekRapportage.toLowerCase();
      if (r.tekst.toLowerCase().indexOf(q) === -1 && r.auteur.toLowerCase().indexOf(q) === -1 && r.datum.toLowerCase().indexOf(q) === -1) return false;
    }
    // Datum range filter (als datum velden ingevuld)
    if (datumVan || datumTot) {
      // Parse mock datums naar vergelijkbare waarde
      var dagMap = { 'Vandaag': '2026-03-30', 'Gisteren': '2026-03-29', 'Eergisteren': '2026-03-28', '27 mrt': '2026-03-27', '26 mrt': '2026-03-26', '25 mrt': '2026-03-25' };
      var rDatum = null;
      Object.keys(dagMap).forEach(function(k) { if (r.datum.indexOf(k) !== -1) rDatum = dagMap[k]; });
      if (rDatum) {
        if (datumVan && rDatum < datumVan) return false;
        if (datumTot && rDatum > datumTot) return false;
      }
    }
    return true;
  });
  var heeftFilter = zoekRapportage.trim() || datumVan || datumTot;
  var zichtbaar = toonAlle || heeftFilter ? gefilterd : gefilterd.slice(0, 4);

  // EPD view
  if (toonEpd) {
    return React.createElement(EpdViewer, { bewonerId: bewoner, onSluit: function() { setToonEpd(false); } });
  }

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
    // Snelknoppen: vitalen ophalen + EPD (alleen uitgebreid)
    w === 'uitgebreid' && React.createElement('div', { style: { display: 'flex', gap: 8, marginBottom: 12 } },
      React.createElement('button', { onClick: function() {
        var bew = window.bewoners.find(function(b) { return b.id === bewoner; });
        if (bew && bew.iot) {
          var v = bew.iot;
          var regel = 'Vitalen ' + bew.roepnaam + ': Pols ' + v.hartslag.waarde + ', SpO2 ' + v.saturatie.waarde + '%, Temp ' + v.temperatuur.waarde + '\u00B0C, RR ' + v.bloeddruk.waarde + ', Gewicht ' + v.gewicht.waarde + 'kg';
          setTekst(function(prev) { return prev ? prev + '\n' + regel : regel; });
          addToast('Vitalen opgehaald van IoT sensoren', 'success');
        }
      }, style: { flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '10px', borderRadius: 8, border: '1px solid ' + C_V.border, background: C_V.kaartWit, fontSize: 12, fontWeight: 500, color: C_V.tekstSecundair, cursor: 'pointer' } },
        React.createElement('span', { style: { fontSize: 14 } }, '\u2764\uFE0F'),
        'Vitalen ophalen'
      ),
      React.createElement('button', { onClick: function() {
        setToonEpd(true);
      }, style: { flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '10px', borderRadius: 8, border: '1px solid ' + C_V.blauw, background: C_V.blauwLicht, fontSize: 12, fontWeight: 500, color: C_V.blauw, cursor: 'pointer' } },
        React.createElement('span', { style: { fontSize: 14 } }, '\uD83D\uDD12'),
        'EPD raadplegen (NUTS)'
      )
    ),
    React.createElement(Card, null,
      React.createElement('textarea', {
        value: tekst, onChange: function(e) { setTekst(e.target.value); },
        placeholder: 'Rapportage voor ' + window.bewoners.find(function(b) { return b.id === bewoner; }).roepnaam + '...',
        style: { width: '100%', minHeight: 100, padding: 12, borderRadius: 8, border: '1px solid ' + C_V.border, fontSize: 14, fontFamily: "'DM Sans', sans-serif", resize: 'vertical', outline: 'none', color: C_V.tekstPrimair }
      }),
      React.createElement('label', { style: { display: 'flex', alignItems: 'center', gap: 6, marginTop: 10, cursor: 'pointer', fontSize: 12, color: C_V.tekstSecundair } },
        React.createElement('input', { type: 'checkbox', checked: zichtbaarFamilie, onChange: function() { setZichtbaarFamilie(!zichtbaarFamilie); }, style: { accentColor: C_V.oranje, width: 16, height: 16, cursor: 'pointer' } }),
        'Zichtbaar voor familie'
      ),
      React.createElement('div', { style: { fontSize: 11, color: C_V.tekstMuted, marginTop: 4 } }, 'Altijd zichtbaar voor collega\u2019s' + (zichtbaarFamilie ? ' en familie' : '')),
      React.createElement('button', { onClick: function() {
        if (tekst.trim()) { addToast('Rapportage opgeslagen' + (zichtbaarFamilie ? '' : ' (alleen collega\u2019s)'), 'success'); setTekst(''); } else addToast('Schrijf eerst een rapportage');
      }, style: { background: C_V.oranje, color: '#FFF', border: 'none', borderRadius: 8, padding: '12px', fontSize: 14, fontWeight: 600, cursor: 'pointer', width: '100%', marginTop: 8 } }, 'Opslaan')
    ),
    // Rapportages voor deze bewoner
    React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 } },
      React.createElement(SectionTitle, null, 'Rapportages ' + window.bewoners.find(function(b) { return b.id === bewoner; }).roepnaam),
      React.createElement('span', { style: { fontSize: 11, color: C_V.tekstMuted } }, alleRapportages.length + ' totaal')
    ),

    // Zoeken + datum filter (alleen uitgebreid)
    w === 'uitgebreid' && React.createElement('div', { style: { marginBottom: 10 } },
      // Trefwoord + filter toggle
      React.createElement('div', { style: { display: 'flex', gap: 6 } },
        React.createElement('div', { style: { position: 'relative', flex: 1 } },
          React.createElement('input', {
            value: zoekRapportage, onChange: function(e) { setZoekRapportage(e.target.value); },
            placeholder: 'Zoek op trefwoord...',
            style: { width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid ' + C_V.border, fontSize: 13, fontFamily: "'DM Sans', sans-serif", outline: 'none', color: C_V.tekstPrimair, background: C_V.kaartWit }
          }),
          zoekRapportage && React.createElement('button', { onClick: function() { setZoekRapportage(''); }, style: { position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', fontSize: 14, color: C_V.tekstMuted, cursor: 'pointer' } }, '\u2715')
        ),
        React.createElement('button', {
          onClick: function() { setToonDatumFilter(!toonDatumFilter); },
          style: { padding: '8px 10px', borderRadius: 8, border: '1px solid ' + (toonDatumFilter || datumVan || datumTot ? C_V.oranje : C_V.border), background: toonDatumFilter || datumVan || datumTot ? C_V.oranjeLicht : C_V.kaartWit, fontSize: 13, color: toonDatumFilter || datumVan || datumTot ? C_V.oranje : C_V.tekstMuted, cursor: 'pointer', flexShrink: 0 }
        }, '\uD83D\uDCC5')
      ),
      // Datum range
      toonDatumFilter && React.createElement('div', { style: { display: 'flex', gap: 8, marginTop: 8, alignItems: 'center' } },
        React.createElement('label', { style: { fontSize: 12, color: C_V.tekstSecundair, flexShrink: 0 } }, 'Van'),
        React.createElement('input', { type: 'date', value: datumVan, onChange: function(e) { setDatumVan(e.target.value); }, style: { flex: 1, padding: '6px 8px', borderRadius: 6, border: '1px solid ' + C_V.border, fontSize: 12, fontFamily: "'DM Sans', sans-serif", color: C_V.tekstPrimair } }),
        React.createElement('label', { style: { fontSize: 12, color: C_V.tekstSecundair, flexShrink: 0 } }, 't/m'),
        React.createElement('input', { type: 'date', value: datumTot, onChange: function(e) { setDatumTot(e.target.value); }, style: { flex: 1, padding: '6px 8px', borderRadius: 6, border: '1px solid ' + C_V.border, fontSize: 12, fontFamily: "'DM Sans', sans-serif", color: C_V.tekstPrimair } }),
        (datumVan || datumTot) && React.createElement('button', { onClick: function() { setDatumVan(''); setDatumTot(''); }, style: { background: 'none', border: 'none', fontSize: 14, color: C_V.tekstMuted, cursor: 'pointer' } }, '\u2715')
      ),
      // Resultaat teller
      heeftFilter && React.createElement('div', { style: { fontSize: 11, color: C_V.tekstMuted, marginTop: 6 } }, gefilterd.length + ' van ' + alleRapportages.length + ' rapportages')
    ),

    // Lijst
    zichtbaar.length === 0 && React.createElement('div', { style: { fontSize: 13, color: C_V.tekstMuted, textAlign: 'center', padding: '16px 0' } }, 'Geen rapportages gevonden'),
    zichtbaar.map(function(r, i) {
      return React.createElement(Card, { key: i, style: { padding: 10 } },
        React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 } },
          React.createElement('span', { style: { fontSize: 12, fontWeight: 600, color: r.isFamilie ? C_V.groen : C_V.oranje } }, r.auteur),
          React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 6 } },
            r.zichtbaarFamilie
              ? React.createElement('span', { title: 'Zichtbaar voor familie', style: { fontSize: 10, color: C_V.groen, background: C_V.groenLicht, padding: '1px 5px', borderRadius: 4 } }, 'Familie')
              : React.createElement('span', { title: 'Alleen collega\u2019s', style: { fontSize: 10, color: C_V.tekstMuted, background: C_V.achtergrond, padding: '1px 5px', borderRadius: 4 } }, 'Intern'),
            React.createElement('span', { style: { fontSize: 11, color: C_V.tekstMuted } }, r.datum)
          )
        ),
        React.createElement('div', { style: { fontSize: 13, color: C_V.tekstSecundair, lineHeight: 1.5 } }, r.tekst)
      );
    }),

    // Meer laden
    !heeftFilter && !toonAlle && gefilterd.length > 4 && React.createElement('button', {
      onClick: function() { setToonAlle(true); },
      style: { background: 'none', border: '1px solid ' + C_V.border, borderRadius: 8, padding: '10px', fontSize: 13, color: C_V.tekstSecundair, cursor: 'pointer', width: '100%', marginTop: 4 }
    }, 'Toon alle ' + gefilterd.length + ' rapportages'),
    toonAlle && !heeftFilter && React.createElement('button', {
      onClick: function() { setToonAlle(false); },
      style: { background: 'none', border: 'none', fontSize: 12, color: C_V.tekstMuted, cursor: 'pointer', width: '100%', marginTop: 4, textAlign: 'center' }
    }, 'Toon minder')
  );
};

// ══════════════════════════════════════════
// LEREN — verzorgende (volledig met lessen + video's)
// ══════════════════════════════════════════
window.VerzorgendeLeren = function VerzorgendeLeren({ addToast, weergave }) {
  return React.createElement(ModuleOverzicht, { modules: window.verzorgendeModules, shared: window.gedeeldeModule, addToast: addToast, accentKleur: C_V.oranje, rol: 'verzorgende', weergave: weergave });
};

// ══════════════════════════════════════════
// GEDEELD: Module overzicht + les detail component
// ══════════════════════════════════════════
window.ModuleOverzicht = function ModuleOverzicht({ modules, shared, addToast, accentKleur, rol, weergave }) {
  var w = weergave || 'normaal';
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
        les.voltooid && React.createElement('div', { style: { padding: '8px 12px', background: C_V.groenLicht, borderRadius: 6, marginBottom: 12 } },
          React.createElement('div', { style: { fontSize: 13, color: C_V.groen, fontWeight: 600 } }, '\u2713 Deze les is voltooid'),
          les.voltooidOp && React.createElement('div', { style: { fontSize: 11, color: C_V.groen, opacity: 0.8 } }, 'Behaald op ' + les.voltooidOp)
        ),
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
            ),
            les.voltooid && les.voltooidOp && React.createElement('div', { style: { fontSize: 11, color: C_V.groen, marginTop: 2 } }, '\u2713 Behaald op ' + les.voltooidOp)
          ),
          React.createElement('span', { style: { fontSize: 14, color: les.video ? kleur : C_V.tekstMuted } }, '\u25B6')
        );
      })
    );
  }

  // ── Zoek state ──
  var [zoekterm, setZoekterm] = useState('');
  var suggesties = (window.moduleSuggesties && window.moduleSuggesties[rol]) || [];

  // Filter modules + suggesties op zoekterm
  var zoekFilter = function(tekst) {
    if (!zoekterm.trim()) return true;
    var q = zoekterm.toLowerCase();
    return tekst.toLowerCase().indexOf(q) !== -1;
  };
  var gefilterdModules = modules.filter(function(m) { return zoekFilter(m.naam + ' ' + m.beschrijving); });
  var gefilterdSuggesties = suggesties.filter(function(s) {
    return zoekFilter(s.naam + ' ' + s.reden + ' ' + s.tags.join(' '));
  });
  var sharedMatch = shared && zoekFilter(shared.naam + ' ' + (shared.beschrijving || ''));

  var urgentieKleur = function(u) {
    if (u === 'verplicht') return { kleur: C_V.rood, bg: C_V.roodLicht, label: 'Verplicht \u2014 afgerond v\u00F3\u00F3r volgende dienst', icon: '\uD83D\uDED1' };
    if (u === 'aanbevolen') return { kleur: C_V.oranje, bg: C_V.oranjeLicht, label: 'Aanbevolen \u2014 relevant voor uw bewoners', icon: '\u2B50' };
    return { kleur: C_V.blauw, bg: C_V.blauwLicht, label: 'Optioneel \u2014 verdieping', icon: '\uD83D\uDCD8' };
  };

  // Toon suggesties uitklapbaar + filter
  var [suggestiesOpen, setSuggestiesOpen] = useState(false);
  var [urgentieFilter, setUrgentieFilter] = useState(null);
  var [toonActies, setToonActies] = useState(false);

  // Gamification data
  var gam = window.gamification && window.gamification[rol];
  var gamHuidig = gam && gam.huidig;
  var gamLevels = gam && gam.levels;
  var huidigLevel = gamLevels && gamHuidig ? gamLevels.find(function(l) { return l.niveau === gamHuidig.niveau; }) : null;
  var volgendLevel = gamLevels && gamHuidig ? gamLevels.find(function(l) { return l.niveau === gamHuidig.niveau + 1; }) : null;
  var xpVoorVolgend = volgendLevel ? volgendLevel.xpNodig - gamHuidig.xp : 0;
  var xpPercentage = volgendLevel ? Math.round((gamHuidig.xp - (huidigLevel ? huidigLevel.xpNodig : 0)) / (volgendLevel.xpNodig - (huidigLevel ? huidigLevel.xpNodig : 0)) * 100) : 100;

  // ── Modules lijst ──
  return React.createElement('div', { style: { animation: 'fadeIn 0.3s ease' } },

    // Level card (alleen uitgebreid)
    w === 'uitgebreid' && gamHuidig && huidigLevel && React.createElement('div', { style: { background: C_V.kaartWit, borderRadius: 12, padding: 16, marginBottom: 12, border: '1px solid ' + C_V.border } },
      // Level header
      React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 } },
        React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 10 } },
          React.createElement('div', { style: { width: 36, height: 36, borderRadius: 18, background: huidigLevel.kleur + '18', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 700, color: huidigLevel.kleur } }, huidigLevel.niveau),
          React.createElement('div', null,
            React.createElement('div', { style: { fontSize: 15, fontWeight: 600, color: C_V.tekstPrimair } }, huidigLevel.naam),
            React.createElement('div', { style: { fontSize: 11, color: C_V.tekstMuted } }, gamHuidig.xp + ' XP')
          )
        ),
        gamHuidig.badges && React.createElement('div', { style: { display: 'flex', gap: 2 } },
          gamHuidig.badges.slice(-3).map(function(b, i) {
            return React.createElement('span', { key: i, title: b.naam + ' (' + b.behaaldOp + ')', style: { fontSize: 16 } }, b.icon);
          })
        )
      ),

      // XP naar volgend level
      volgendLevel && React.createElement('div', null,
        React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', marginBottom: 4 } },
          React.createElement('span', { style: { fontSize: 11, color: C_V.tekstMuted } }, 'Nog ' + xpVoorVolgend + ' XP naar ' + volgendLevel.naam),
          React.createElement('span', { style: { fontSize: 11, fontWeight: 600, color: volgendLevel.kleur } }, 'Level ' + volgendLevel.niveau)
        ),
        React.createElement(ProgressBar, { percentage: xpPercentage, color: volgendLevel.kleur, height: 6 })
      ),
      !volgendLevel && React.createElement('div', { style: { fontSize: 12, color: C_V.groen, fontWeight: 500 } }, '\u2713 Hoogste niveau bereikt'),

      // Vereisten volgend level
      volgendLevel && volgendLevel.vereisten && React.createElement('div', { style: { marginTop: 10, padding: '8px 0 0', borderTop: '1px solid ' + C_V.border } },
        React.createElement('div', { style: { fontSize: 12, fontWeight: 500, color: C_V.tekstSecundair, marginBottom: 4 } }, 'Nodig voor ' + volgendLevel.naam + ':'),
        volgendLevel.vereisten.map(function(v, i) {
          return React.createElement('div', { key: i, style: { fontSize: 11, color: C_V.tekstMuted, padding: '1px 0' } }, '\u2022 ' + v);
        })
      ),

      // Volgende acties
      gamHuidig.volgendeActies && React.createElement('div', { style: { marginTop: 8 } },
        React.createElement('button', {
          onClick: function() { setToonActies(!toonActies); },
          style: { background: 'none', border: 'none', fontSize: 12, color: kleur, cursor: 'pointer', fontWeight: 500, padding: 0 }
        }, toonActies ? 'Verberg acties' : 'Wat kan ik doen? (' + gamHuidig.volgendeActies.length + ')'),
        toonActies && React.createElement('div', { style: { marginTop: 6 } },
          gamHuidig.volgendeActies.map(function(a, i) {
            return React.createElement('div', { key: i, style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0', borderBottom: i < gamHuidig.volgendeActies.length - 1 ? '1px solid ' + C_V.border : 'none' } },
              React.createElement('div', { style: { flex: 1 } },
                React.createElement('div', { style: { fontSize: 12, color: C_V.tekstPrimair } }, a.actie),
                React.createElement('div', { style: { fontSize: 10, color: C_V.tekstMuted } }, a.voortgang)
              ),
              React.createElement('span', { style: { fontSize: 11, fontWeight: 600, color: kleur, flexShrink: 0 } }, '+' + a.xp + ' XP')
            );
          })
        )
      )
    ),

    // Zoekbalk (alleen uitgebreid)
    w === 'uitgebreid' && React.createElement('div', { style: { position: 'relative', marginBottom: 16 } },
      React.createElement('input', {
        value: zoekterm,
        onChange: function(e) { setZoekterm(e.target.value); },
        placeholder: '\uD83D\uDD0D Zoek modules, lessen of onderwerpen...',
        style: { width: '100%', padding: '12px 14px', borderRadius: 10, border: '1px solid ' + C_V.border, fontSize: 14, fontFamily: "'DM Sans', sans-serif", outline: 'none', color: C_V.tekstPrimair, background: C_V.kaartWit }
      }),
      zoekterm && React.createElement('button', {
        onClick: function() { setZoekterm(''); },
        style: { position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', fontSize: 16, color: C_V.tekstMuted, cursor: 'pointer' }
      }, '\u2715')
    ),

    React.createElement(SectionTitle, null, rol === 'verzorgende' ? 'Mijn modules' : 'Modules voor familie'),

    // Klantcertificaat (alleen verzorgende)
    !zoekterm && rol === 'verzorgende' && React.createElement(Card, { style: { background: C_V.groenLicht, border: '1px solid ' + C_V.groen, padding: 12 } },
      React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 8 } },
        React.createElement('span', { style: { fontSize: 20 } }, '\u2705'),
        React.createElement('div', null,
          React.createElement('div', { style: { fontSize: 14, fontWeight: 600, color: C_V.groen } }, 'Zonnehof \u2014 toegangscertificaat behaald'),
          React.createElement('div', { style: { fontSize: 12, color: C_V.tekstSecundair } }, 'Geldig t/m december 2026')
        )
      )
    ),

    gefilterdModules.length === 0 && zoekterm && React.createElement('div', { style: { fontSize: 13, color: C_V.tekstMuted, textAlign: 'center', padding: '20px 0' } }, 'Geen modules gevonden voor "' + zoekterm.trim() + '"'),

    gefilterdModules.map(function(m, i) {
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
    shared && sharedMatch && React.createElement('div', null,
      React.createElement(SectionTitle, null, 'Kennismodule bij pati\u00EBnt'),
      React.createElement(Card, { style: { border: '2px solid ' + kleur, cursor: 'pointer' }, onClick: function() { setOpenModule(shared); } },
        shared.aanbieder && React.createElement('div', { style: { fontSize: 11, fontWeight: 600, color: kleur, marginBottom: 4 } }, shared.aanbieder),
        React.createElement('div', { style: { fontSize: 15, fontWeight: 600, color: C_V.tekstPrimair, marginBottom: 4 } }, shared.naam),
        React.createElement('div', { style: { fontSize: 13, color: C_V.tekstSecundair, marginBottom: 8 } }, shared.beschrijving),
        React.createElement('div', { style: { fontSize: 12, color: C_V.tekstMuted, marginBottom: 6 } }, shared.voltooid + ' van ' + shared.totaal + ' lessen voltooid'),
        React.createElement(ProgressBar, { percentage: shared.voltooid / shared.totaal * 100, color: kleur }),
        React.createElement('div', { style: { fontSize: 13, color: kleur, fontWeight: 600, marginTop: 8, textAlign: 'center' } }, 'Open module \u2192')
      )
    ),

    // ── Suggesties — ONDER de lopende modules (alleen uitgebreid) ──
    w === 'uitgebreid' && (function() {
      var alleSuggesties = zoekterm ? gefilterdSuggesties : suggesties;
      if (alleSuggesties.length === 0) return null;

      // Sorteer: verplicht → aanbevolen → optioneel
      var urgentieVolgorde = { verplicht: 0, aanbevolen: 1, optioneel: 2 };
      var gesorteerd = alleSuggesties.slice().sort(function(a, b) {
        return (urgentieVolgorde[a.urgentie] || 2) - (urgentieVolgorde[b.urgentie] || 2);
      });

      // Tel per urgentie
      var telVerplicht = gesorteerd.filter(function(s) { return s.urgentie === 'verplicht'; }).length;
      var telAanbevolen = gesorteerd.filter(function(s) { return s.urgentie === 'aanbevolen'; }).length;
      var telOptioneel = gesorteerd.filter(function(s) { return s.urgentie === 'optioneel'; }).length;

      // Filter toepassen
      var zichtbaar = urgentieFilter ? gesorteerd.filter(function(s) { return s.urgentie === urgentieFilter; }) : gesorteerd;

      // Filter button helper
      var filterBtn = function(type, tel, icon, filterKleur, filterBg) {
        var actief = urgentieFilter === type;
        return tel > 0 && React.createElement('button', {
          key: type,
          onClick: function(e) {
            e.stopPropagation();
            if (actief) { setUrgentieFilter(null); }
            else { setUrgentieFilter(type); setSuggestiesOpen(true); }
          },
          style: {
            fontSize: 11, fontWeight: 600, padding: '4px 10px', borderRadius: 8, cursor: 'pointer', transition: 'all 0.2s',
            background: actief ? filterKleur : filterBg, color: actief ? '#FFFFFF' : filterKleur,
            border: '1.5px solid ' + filterKleur,
          }
        }, icon + ' ' + tel + ' ' + type);
      };

      return React.createElement('div', { style: { marginTop: 8 } },
        // Header
        React.createElement('div', {
          onClick: function() { setSuggestiesOpen(!suggestiesOpen); if (suggestiesOpen) setUrgentieFilter(null); },
          style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', padding: '8px 0' }
        },
          React.createElement(SectionTitle, null, 'Aanbevolen voor jou'),
          React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 6 } },
            React.createElement('span', { style: { fontSize: 11, color: C_V.tekstMuted, background: C_V.achtergrond, padding: '2px 8px', borderRadius: 10, fontWeight: 600 } }, gesorteerd.length),
            React.createElement('span', { style: { fontSize: 14, color: C_V.tekstMuted, transition: 'transform 0.2s', transform: suggestiesOpen ? 'rotate(90deg)' : 'none' } }, '\u25B6')
          )
        ),

        // Filter buttons (altijd zichtbaar)
        React.createElement('div', { style: { display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 10 } },
          filterBtn('verplicht', telVerplicht, '\uD83D\uDED1', C_V.rood, C_V.roodLicht),
          filterBtn('aanbevolen', telAanbevolen, '\u2B50', C_V.oranje, C_V.oranjeLicht),
          filterBtn('optioneel', telOptioneel, '\uD83D\uDCD8', C_V.blauw, C_V.blauwLicht)
        ),

        // Lijst (alleen als open)
        suggestiesOpen && zichtbaar.map(function(s, i) {
          var urg = urgentieKleur(s.urgentie);
          return React.createElement(Card, { key: 'sug-' + i, style: { cursor: 'pointer', borderLeft: '3px solid ' + urg.kleur, padding: 12 }, onClick: function() { addToast('Module "' + s.naam + '" wordt geopend...'); } },
            React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 2 } },
              React.createElement('span', { style: { fontSize: 14, fontWeight: 600, color: C_V.tekstPrimair, flex: 1, marginRight: 8 } }, s.naam),
              React.createElement('span', { style: { fontSize: 14 } }, urg.icon)
            ),
            React.createElement('div', { style: { fontSize: 11, color: urg.kleur, fontWeight: 600, marginBottom: 4 } }, urg.label),
            React.createElement('div', { style: { fontSize: 12, color: C_V.tekstSecundair, lineHeight: 1.5, marginBottom: 4 } }, s.reden),
            React.createElement('div', { style: { fontSize: 11, color: C_V.tekstMuted } }, s.duur + ' \u00B7 ' + s.aanbieder)
          );
        })
      );
    })()
  );
};
