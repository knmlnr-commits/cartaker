// GeriCall — Eenvoudige interface (meertalig)
// nl, en, fr, de, pl, ar, he

var C_E = window.COLORS;

// ── Taal picker component ──
window.TaalPicker = function TaalPicker({ taal, onWissel }) {
  var { useState } = React;
  var [open, setOpen] = useState(false);
  var talen = window.talen;
  var huidige = talen[taal] || talen.nl;

  return React.createElement('div', { style: { position: 'relative' } },
    React.createElement('button', { onClick: function() { setOpen(!open); }, style: {
      background: 'none', border: '1px solid ' + C_E.border, borderRadius: 6,
      padding: '3px 8px', fontSize: 12, color: C_E.tekstSecundair, cursor: 'pointer',
    } }, huidige.code.toUpperCase()),
    open && React.createElement('div', { style: {
      position: 'absolute', top: '100%', right: 0, marginTop: 4,
      background: C_E.kaartWit, border: '1px solid ' + C_E.border, borderRadius: 10,
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)', zIndex: 100, overflow: 'hidden', minWidth: 140,
    } },
      Object.keys(talen).map(function(code) {
        var t = talen[code];
        var actief = code === taal;
        return React.createElement('button', { key: code, onClick: function() { onWissel(code); setOpen(false); }, style: {
          display: 'block', width: '100%', padding: '10px 14px', border: 'none', cursor: 'pointer',
          background: actief ? C_E.achtergrond : 'transparent', textAlign: t.dir === 'rtl' ? 'right' : 'left',
          fontSize: 14, color: actief ? C_E.tekstPrimair : C_E.tekstSecundair, fontWeight: actief ? 600 : 400,
        } }, t.label);
      })
    )
  );
};

// ══════════════════════════════════════════
// EENVOUDIG: ZORG (helpende) — meertalig
// ══════════════════════════════════════════
window.EenvoudigZorg = function EenvoudigZorg({ profiel, addToast }) {
  var { useState } = React;
  var [gekozenBewoner, setGekozenBewoner] = useState(null);
  var [taken, setTaken] = useState([]);
  var [taal, setTaal] = useState(window.huidigeTaal || 'nl');
  var bewoners = window.bewoners;
  var dir = (window.talen[taal] || {}).dir || 'ltr';

  var selecteerBewoner = function(b) {
    setGekozenBewoner(b);
    setTaken(b.taken.map(function(t) { return Object.assign({}, t); }));
  };

  var stemmingLabels = ['slecht', 'matig', 'redelijk', 'goed', 'prima'];

  // ── Bewoner detail: taken ──
  if (gekozenBewoner) {
    var b = gekozenBewoner;
    var stemming = window.stemmingen[b.id];
    var stOpt = window.stemmingOpties;
    var huidige = stOpt.find(function(o) { return o.score === (stemming ? stemming.score : 3); }) || stOpt[2];

    var toggle = function(id) {
      var nu = new Date();
      var tijdStr = String(nu.getHours()).padStart(2,'0') + ':' + String(nu.getMinutes()).padStart(2,'0');
      setTaken(function(prev) { return prev.map(function(t) {
        if (t.id !== id) return t;
        return Object.assign({}, t, { gedaan: !t.gedaan, door: t.gedaan ? null : profiel.naam, gedaanOm: t.gedaan ? null : tijdStr });
      }); });
      addToast('OK', 'success');
    };

    var gedaan = taken.filter(function(t) { return t.gedaan; }).length;

    return React.createElement('div', { dir: dir },
      React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 } },
        React.createElement('button', { onClick: function() { setGekozenBewoner(null); }, style: {
          display: 'flex', alignItems: 'center', gap: 8, background: 'none', border: 'none',
          fontSize: 16, color: C_E.tekstSecundair, cursor: 'pointer', fontWeight: 500,
        } }, '\u2190 ' + t('alleBewoners', taal)),
        React.createElement(TaalPicker, { taal: taal, onWissel: setTaal })
      ),

      React.createElement('div', { style: { background: C_E.kaartWit, borderRadius: 16, padding: 20, marginBottom: 16, border: '1px solid ' + C_E.border, textAlign: 'center' } },
        React.createElement('div', { style: { fontSize: 28, fontWeight: 700, color: C_E.tekstPrimair } }, b.roepnaam),
        React.createElement('div', { style: { fontSize: 16, color: C_E.tekstSecundair, marginTop: 4 } }, t('kamer', taal) + ' ' + b.kamer),
        React.createElement('div', { style: { display: 'flex', justifyContent: 'center', gap: 12, marginTop: 16 } },
          stOpt.map(function(o, i) {
            var actief = stemming && o.score === stemming.score;
            return React.createElement('button', { key: o.score, onClick: function() {
              window.stemmingen[b.id] = { score: o.score, label: o.label, door: profiel.naam, rol: 'verzorgende', tijd: 'Zojuist', history: [{ score: o.score, door: profiel.naam, rol: 'verzorgende', tijd: 'Zojuist' }].concat((stemming && stemming.history) || []) };
              addToast(t(stemmingLabels[i], taal), 'success');
            }, style: {
              width: 44, height: 44, borderRadius: 22, background: o.kleur, cursor: 'pointer',
              border: actief ? '3px solid ' + C_E.tekstPrimair : '3px solid transparent',
              opacity: actief ? 1 : 0.4, transition: 'all 0.2s',
            } });
          })
        ),
        stemming && React.createElement('div', { style: { fontSize: 14, color: C_E.tekstMuted, marginTop: 8 } }, t(stemmingLabels[(stemming.score || 3) - 1], taal))
      ),

      React.createElement('div', { style: { display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 16 } },
        React.createElement('div', { style: { fontSize: 36, fontWeight: 700, color: gedaan === taken.length ? C_E.groen : C_E.oranje } }, gedaan),
        React.createElement('div', { style: { fontSize: 20, color: C_E.tekstMuted, paddingTop: 10 } }, '/ ' + taken.length + ' ' + t('taken', taal))
      ),

      taken.map(function(tk) {
        return React.createElement('button', { key: tk.id, onClick: function() { toggle(tk.id); }, style: {
          display: 'flex', alignItems: 'center', gap: 14, width: '100%',
          padding: '16px', marginBottom: 8, borderRadius: 14,
          background: tk.gedaan ? C_E.groenLicht : C_E.kaartWit,
          border: '2px solid ' + (tk.gedaan ? C_E.groen : C_E.border),
          cursor: 'pointer', textAlign: dir === 'rtl' ? 'right' : 'left', transition: 'all 0.2s',
        } },
          React.createElement('div', { style: {
            width: 36, height: 36, borderRadius: 18, flexShrink: 0,
            background: tk.gedaan ? C_E.groen : C_E.achtergrond,
            border: tk.gedaan ? 'none' : '2px solid ' + C_E.border,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#FFF', fontSize: 18, fontWeight: 700,
          } }, tk.gedaan ? '\u2713' : ''),
          React.createElement('div', { style: { flex: 1 } },
            React.createElement('div', { style: { fontSize: 16, fontWeight: 500, color: C_E.tekstPrimair, textDecoration: tk.gedaan ? 'line-through' : 'none' } }, vertaalTaak(tk.tekst, taal)),
            React.createElement('div', { style: { fontSize: 14, color: C_E.tekstMuted } }, tk.tijd + (tk.gedaan && tk.door ? ' \u2713 ' + tk.door : ''))
          )
        );
      })
    );
  }

  // ── Bewoner overzicht ──
  return React.createElement('div', { dir: dir },
    React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 } },
      React.createElement('div', { style: { fontSize: 20, fontWeight: 700, color: C_E.tekstPrimair } }, t('mijnBewoners', taal)),
      React.createElement(TaalPicker, { taal: taal, onWissel: setTaal })
    ),

    bewoners.map(function(b) {
      var gedaan = b.takenTotaal - b.takenOpen;
      var stemming = window.stemmingen[b.id];
      var stOpt = window.stemmingOpties;
      var huidige = stOpt.find(function(o) { return o.score === (stemming ? stemming.score : 3); }) || stOpt[2];
      var stoplicht = b.alert ? C_E.rood : gedaan === b.takenTotaal ? C_E.groen : C_E.oranje;

      return React.createElement('button', { key: b.id, onClick: function() { selecteerBewoner(b); }, style: {
        display: 'flex', alignItems: 'center', gap: 16, width: '100%',
        padding: '18px 16px', marginBottom: 10, borderRadius: 16,
        background: C_E.kaartWit, border: '2px solid ' + C_E.border,
        cursor: 'pointer', textAlign: dir === 'rtl' ? 'right' : 'left', transition: 'all 0.2s',
      } },
        React.createElement('div', { style: { width: 16, height: 16, borderRadius: 8, background: stoplicht, flexShrink: 0 } }),
        React.createElement('div', { style: {
          width: 52, height: 52, borderRadius: 26, background: C_E.achtergrond,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 18, fontWeight: 700, color: C_E.tekstSecundair, flexShrink: 0,
        } }, b.initialen),
        React.createElement('div', { style: { flex: 1 } },
          React.createElement('div', { style: { fontSize: 18, fontWeight: 600, color: C_E.tekstPrimair } }, b.roepnaam),
          React.createElement('div', { style: { fontSize: 14, color: C_E.tekstMuted } }, t('kamer', taal) + ' ' + b.kamer),
          React.createElement('div', { style: { fontSize: 14, color: C_E.tekstSecundair, marginTop: 4 } }, gedaan + '/' + b.takenTotaal + ' ' + t('taken', taal))
        ),
        React.createElement('div', { style: { width: 12, height: 12, borderRadius: 6, background: huidige.kleur, flexShrink: 0 } }),
        React.createElement('span', { style: { fontSize: 20, color: C_E.tekstMuted } }, dir === 'rtl' ? '\u25C0' : '\u25B6')
      );
    })
  );
};

// ══════════════════════════════════════════
// EENVOUDIG: FAMILIE (patiënt + 2e lijn) — meertalig
// ══════════════════════════════════════════
window.EenvoudigFamilie = function EenvoudigFamilie({ lid, addToast }) {
  var { useState } = React;
  var [tabF, setTabF] = useState('status');
  var [taal, setTaal] = useState(window.huidigeTaal || 'nl');
  var p = window.patient;
  var stemming = window.stemmingen.jansen;
  var stOpt = window.stemmingOpties;
  var huidige = stOpt.find(function(o) { return o.score === (stemming ? stemming.score : 3); }) || stOpt[2];
  var isPatient = lid.isPatient;
  var dir = (window.talen[taal] || {}).dir || 'ltr';
  var stemmingLabels = ['slecht', 'matig', 'redelijk', 'goed', 'prima'];

  var tabsF = [
    { id: 'status', icon: '\u2764\uFE0F', label: isPatient ? t('mijnDag', taal) : p.roepnaam },
    { id: 'planning', icon: '\uD83D\uDCC5', label: t('wieKomt', taal) },
    { id: 'chat', icon: '\uD83D\uDCAC', label: t('chat', taal) },
  ];

  return React.createElement('div', { dir: dir },
    // Taal picker
    React.createElement('div', { style: { display: 'flex', justifyContent: 'flex-end', marginBottom: 8 } },
      React.createElement(TaalPicker, { taal: taal, onWissel: setTaal })
    ),

    // Status tab
    tabF === 'status' && React.createElement('div', null,
      React.createElement('div', { style: { background: C_E.kaartWit, borderRadius: 16, padding: 24, marginBottom: 16, border: '1px solid ' + C_E.border, textAlign: 'center' } },
        React.createElement('div', { style: { fontSize: 22, fontWeight: 700, color: C_E.tekstPrimair, marginBottom: 4 } },
          isPatient ? t('hoeGaatHet', taal) : t('hoeGaatHetMet', taal) + ' ' + p.roepnaam + '?'),
        React.createElement('div', { style: { display: 'flex', justifyContent: 'center', gap: 14, marginTop: 20, marginBottom: 12 } },
          stOpt.map(function(o, i) {
            var actief = stemming && o.score === stemming.score;
            return React.createElement('button', { key: o.score, onClick: function() {
              window.stemmingen.jansen = { score: o.score, label: o.label, door: lid.roepnaam, rol: 'familie', tijd: 'Zojuist', history: [{ score: o.score, door: lid.roepnaam, rol: 'familie', tijd: 'Zojuist' }].concat((stemming && stemming.history) || []) };
              addToast(t(stemmingLabels[i], taal), 'success');
            }, style: {
              width: 48, height: 48, borderRadius: 24, background: o.kleur, cursor: 'pointer',
              border: actief ? '3px solid ' + C_E.tekstPrimair : '3px solid transparent',
              opacity: actief ? 1 : 0.35, transition: 'all 0.2s',
            } });
          })
        ),
        React.createElement('div', { style: { fontSize: 18, color: huidige.kleur, fontWeight: 600 } }, t(stemmingLabels[(stemming ? stemming.score : 3) - 1], taal)),
        stemming && React.createElement('div', { style: { fontSize: 13, color: C_E.tekstMuted, marginTop: 4 } }, stemming.door + ', ' + stemming.tijd)
      ),

      React.createElement('div', { style: { fontSize: 18, fontWeight: 700, color: C_E.tekstPrimair, marginBottom: 12 } }, t('vandaag', taal)),
      window.weekplanning[0] && window.weekplanning[0].shifts.filter(function(s) { return s.status !== 'open'; }).map(function(s, i) {
        var isFam = s.isFamilie;
        return React.createElement('div', { key: i, style: {
          display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', marginBottom: 6,
          background: C_E.kaartWit, borderRadius: 12, border: '1px solid ' + C_E.border,
          borderLeft: dir === 'ltr' ? '4px solid ' + (isFam ? C_E.groen : C_E.oranje) : 'none',
          borderRight: dir === 'rtl' ? '4px solid ' + (isFam ? C_E.groen : C_E.oranje) : 'none',
        } },
          React.createElement('div', { style: { fontSize: 16, fontWeight: 600, color: C_E.tekstPrimair, flex: 1 } }, vertaalPeriode(s.periode, taal)),
          React.createElement('div', { style: { fontSize: 15, color: C_E.tekstSecundair } }, s.wie)
        );
      })
    ),

    // Planning tab
    tabF === 'planning' && React.createElement('div', null,
      React.createElement('div', { style: { fontSize: 18, fontWeight: 700, color: C_E.tekstPrimair, marginBottom: 12 } }, t('dezeWeek', taal)),
      window.weekplanning.map(function(dag, i) {
        var famSlots = dag.shifts.filter(function(s) { return s.isFamilie; });
        var heeftBezoek = famSlots.some(function(s) { return s.status !== 'open'; });
        return React.createElement('div', { key: i, style: {
          display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px', marginBottom: 6,
          background: C_E.kaartWit, borderRadius: 12, border: '1px solid ' + C_E.border,
        } },
          React.createElement('div', { style: { width: 14, height: 14, borderRadius: 7, background: heeftBezoek ? C_E.groen : C_E.border, flexShrink: 0 } }),
          React.createElement('div', { style: { flex: 1 } },
            React.createElement('div', { style: { fontSize: 16, fontWeight: 600, color: C_E.tekstPrimair } }, vertaalDag(dag.dag, taal)),
            famSlots.map(function(s, j) {
              return React.createElement('div', { key: j, style: { fontSize: 14, color: s.status === 'open' ? C_E.oranje : C_E.tekstSecundair } },
                s.status === 'open' ? t('niemandGepland', taal) : s.wie);
            })
          ),
          famSlots.some(function(s) { return s.status === 'open' && s.isFamilie; }) && !isPatient &&
            React.createElement('button', { onClick: function() { addToast('OK!', 'success'); }, style: {
              background: C_E.groen, color: '#FFF', border: 'none', borderRadius: 10,
              padding: '10px 16px', fontSize: 14, fontWeight: 600, cursor: 'pointer',
            } }, t('ikKom', taal))
        );
      })
    ),

    // Chat tab
    tabF === 'chat' && React.createElement(FamilieBerichten, { lid: lid, addToast: addToast }),

    // Bottom nav
    React.createElement('div', { style: { height: 20 } }),
    React.createElement('nav', { style: {
      position: 'fixed', bottom: 0, left: 0, right: 0, background: C_E.kaartWit,
      borderTop: '1px solid ' + C_E.border, display: 'flex', zIndex: 800,
      paddingBottom: 'env(safe-area-inset-bottom, 12px)',
    } },
      tabsF.map(function(tf) {
        var actief = tabF === tf.id;
        return React.createElement('button', { key: tf.id, onClick: function() { setTabF(tf.id); }, style: {
          flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
          padding: '12px 0 8px', background: 'none', border: 'none', cursor: 'pointer',
          color: actief ? C_E.groen : C_E.tekstMuted,
        } },
          React.createElement('span', { style: { fontSize: 26, marginBottom: 2 } }, tf.icon),
          React.createElement('span', { style: { fontSize: 12, fontWeight: actief ? 600 : 400 } }, tf.label)
        );
      })
    )
  );
};
