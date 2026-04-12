// NTS Triage Wizard — 5 stappen conform NTS standaard
// Herbruikbaar in light portal + volledige app

var C_N = window.COLORS;

window.NTSWizard = function NTSWizard({ onSluit, addToast, prefillPersona }) {
  var { useState } = React;
  var [stap, setStap] = useState(1);
  var [observatie, setObservatie] = useState(prefillPersona ? (window.appTaal === 'en' ? prefillPersona.observatieEN : prefillPersona.observatie) : '');
  var [klacht, setKlacht] = useState(prefillPersona ? prefillPersona.klacht : null);
  var [zoekKlacht, setZoekKlacht] = useState('');
  var [abcd, setAbcd] = useState({ A: null, B: null, C: null, D: null });
  var [criteriaAnt, setCriteriaAnt] = useState([]);
  var [urgentie, setUrgentie] = useState(null);
  var [override, setOverride] = useState(null);
  var [overrideMotivatie, setOverrideMotivatie] = useState('');
  var [toonOverride, setToonOverride] = useState(false);
  var [notitie, setNotitie] = useState('');
  var [opgeslagen, setOpgeslagen] = useState(false);

  var klachten = window.ntsKlachtenLijst || [];
  var abcdLabels = [
    { key: 'A', label: 'Airway', desc: window.appTaal === 'en' ? 'Is the airway clear? No obstruction?' : 'Is de ademweg vrij? Geen obstructie?' },
    { key: 'B', label: 'Breathing', desc: window.appTaal === 'en' ? 'Is the patient breathing normally?' : 'Ademt de pati\u00EBnt normaal?' },
    { key: 'C', label: 'Circulation', desc: window.appTaal === 'en' ? 'Skin color and temperature normal?' : 'Kleur en temperatuur huid normaal?' },
    { key: 'D', label: 'Disability', desc: window.appTaal === 'en' ? 'Is the patient alert and oriented?' : 'Is de pati\u00EBnt aanspreekbaar en geori\u00EBnteerd?' },
  ];
  var isEN = window.appTaal === 'en';
  var abcdInstabiel = Object.values(abcd).some(function(v) { return v === 'nee'; });

  // Stap 2 → 3 of 4
  var volgendNaABCD = function() {
    if (abcdInstabiel) {
      var u = window.bepaalNTSUrgentie(abcd, [], klacht);
      setUrgentie(u);
      setStap(4);
    } else {
      var crit = (window.ntsCriteria[klacht] || []);
      setCriteriaAnt(crit.map(function() { return null; }));
      setStap(3);
    }
  };

  // Progress bar
  var ProgressStappen = function() {
    return React.createElement('div', { style: { display: 'flex', gap: 4, marginBottom: 12 } },
      [1,2,3,4,5].map(function(s) {
        return React.createElement('div', { key: s, style: { flex: 1, height: 4, borderRadius: 2, background: s <= stap ? C_N.oranje : s === 3 && abcdInstabiel ? '#DDDDDD' : '#DDDDDD', opacity: s === 3 && abcdInstabiel ? 0.3 : 1 } });
      })
    );
  };

  // ═══ OPGESLAGEN ═══
  if (opgeslagen) {
    var defUrg = override || urgentie;
    var info = window.urgentieInfo[defUrg];
    return React.createElement('div', { style: { textAlign: 'center', padding: '32px 0', animation: 'scaleIn 0.4s ease' } },
      React.createElement('div', { style: { width: 56, height: 56, borderRadius: 28, background: C_N.groenLicht, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', fontSize: 28 } }, '\u2713'),
      React.createElement('div', { style: { fontSize: 18, fontWeight: 700, color: C_N.groen } }, isEN ? 'Triage report saved' : 'Triageverslag opgeslagen'),
      React.createElement('div', { style: { fontSize: 14, color: C_N.tekstSecundair, marginTop: 4 } }, info ? info.label : defUrg),
      React.createElement('div', { style: { fontSize: 12, color: C_N.tekstMuted, marginTop: 8, fontStyle: 'italic' } }, isEN ? 'Enter manually in ONS if applicable' : 'Voer handmatig in in ONS indien van toepassing'),
      React.createElement('button', { onClick: onSluit, style: { background: C_N.oranje, color: '#FFF', border: 'none', borderRadius: 12, padding: '13px 24px', fontSize: 14, fontWeight: 700, cursor: 'pointer', marginTop: 16 } }, 'OK')
    );
  }

  return React.createElement('div', { style: { animation: 'fadeIn 0.3s ease' } },
    React.createElement('button', { onClick: stap === 1 ? onSluit : function() { setStap(stap - 1); }, style: { background: 'none', border: 'none', fontSize: 14, color: C_N.tekstMuted, cursor: 'pointer', marginBottom: 8 } }, '\u2190 ' + (stap === 1 ? (isEN ? 'Cancel' : 'Annuleren') : (isEN ? 'Previous' : 'Vorige'))),
    React.createElement(ProgressStappen),
    React.createElement('div', { style: { fontSize: 12, color: C_N.tekstMuted, textAlign: 'center', marginBottom: 12 } }, (isEN ? 'Step' : 'Stap') + ' ' + stap + ' / 5'),

    // ═══ STAP 1: INGANGSKLACHT ═══
    stap === 1 && React.createElement('div', null,
      React.createElement('div', { style: { fontSize: 16, fontWeight: 700, color: C_N.tekstPrimair, marginBottom: 8 } }, isEN ? 'Presenting complaint' : 'Ingangsklacht'),
      React.createElement('textarea', { value: observatie, onChange: function(e) { setObservatie(e.target.value); }, placeholder: isEN ? 'Describe what you observed...' : 'Beschrijf wat u heeft waargenomen...', style: { width: '100%', minHeight: 70, padding: 10, borderRadius: 10, border: '1px solid #EEEEEE', fontSize: 14, fontFamily: "'DM Sans', sans-serif", resize: 'vertical', outline: 'none', color: C_N.tekstPrimair, marginBottom: 10 } }),
      React.createElement('input', { value: zoekKlacht, onChange: function(e) { setZoekKlacht(e.target.value); }, placeholder: isEN ? 'Search complaints...' : 'Zoek klacht...', style: { width: '100%', padding: '8px 10px', borderRadius: 10, border: '1px solid #EEEEEE', fontSize: 13, fontFamily: "'DM Sans', sans-serif", outline: 'none', color: C_N.tekstPrimair, marginBottom: 8 } }),
      klachten.filter(function(k) { var q = zoekKlacht.toLowerCase(); return !q || (isEN ? k.labelEN : k.label).toLowerCase().indexOf(q) !== -1 || (isEN ? k.descEN : k.desc).toLowerCase().indexOf(q) !== -1; }).map(function(k) {
        var sel = klacht === k.id;
        return React.createElement('div', { key: k.id, onClick: function() { setKlacht(k.id); }, style: { display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', marginBottom: 4, borderRadius: 10, cursor: 'pointer', background: sel ? '#FFF3EB' : '#FFFFFF', border: sel ? '2px solid #E8732A' : '0.5px solid #EEEEEE' } },
          React.createElement('span', { style: { fontSize: 20 } }, k.icon),
          React.createElement('div', { style: { flex: 1 } },
            React.createElement('div', { style: { fontSize: 14, fontWeight: 600, color: C_N.tekstPrimair } }, isEN ? k.labelEN : k.label),
            React.createElement('div', { style: { fontSize: 11, color: C_N.tekstMuted } }, isEN ? k.descEN : k.desc)
          ),
          sel && React.createElement('div', { style: { width: 18, height: 18, borderRadius: 9, background: '#E8732A', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFF', fontSize: 11 } }, '\u2713')
        );
      }),
      React.createElement('button', { onClick: function() { if (observatie.trim().length >= 3 && klacht) setStap(2); }, style: { background: observatie.trim().length >= 3 && klacht ? '#E8732A' : '#EEEEEE', color: observatie.trim().length >= 3 && klacht ? '#FFF' : '#AAAAAA', border: 'none', borderRadius: 12, padding: '13px', fontSize: 14, fontWeight: 700, cursor: observatie.trim().length >= 3 && klacht ? 'pointer' : 'not-allowed', width: '100%', marginTop: 8 } }, (isEN ? 'Next' : 'Volgende') + ' \u2192')
    ),

    // ═══ STAP 2: ABCD-CHECK ═══
    stap === 2 && React.createElement('div', null,
      React.createElement('div', { style: { fontSize: 16, fontWeight: 700, color: C_N.tekstPrimair, marginBottom: 8 } }, 'ABCD-check'),
      abcdInstabiel && React.createElement('div', { style: { background: '#FCEAEA', border: '1px solid #D94F4F', borderRadius: 10, padding: '10px 12px', marginBottom: 10, fontSize: 13, color: '#D94F4F', fontWeight: 600 } }, isEN ? 'ABCD instability detected \u2014 immediate escalation required.' : 'ABCD-instabiliteit gedetecteerd \u2014 directe escalatie vereist.'),
      abcdLabels.map(function(item) {
        var val = abcd[item.key];
        var btnStyle = function(type) {
          var sel = val === type;
          var colors = { ja: { bg: '#E8F5F0', border: '#2D9D78', color: '#1E7A5A' }, nee: { bg: '#FCEAEA', border: '#D94F4F', color: '#7A1F1F' }, onbekend: { bg: '#EBF2F9', border: '#4A7FB5', color: '#1A3F6F' } };
          var c = colors[type];
          return { flex: 1, padding: '8px', borderRadius: 8, fontSize: 12, fontWeight: sel ? 600 : 400, cursor: 'pointer', background: sel ? c.bg : '#FFF', border: sel ? '2px solid ' + c.border : '1px solid #EEEEEE', color: sel ? c.color : C_N.tekstSecundair };
        };
        return React.createElement('div', { key: item.key, style: { background: '#FFF', borderRadius: 10, border: '0.5px solid #EEEEEE', padding: '12px', marginBottom: 6 } },
          React.createElement('div', { style: { fontSize: 14, fontWeight: 600, color: C_N.tekstPrimair, marginBottom: 2 } }, item.key + ' \u2014 ' + item.label),
          React.createElement('div', { style: { fontSize: 11, color: C_N.tekstMuted, marginBottom: 8 } }, item.desc),
          React.createElement('div', { style: { display: 'flex', gap: 6 } },
            React.createElement('button', { onClick: function() { var n = Object.assign({}, abcd); n[item.key] = 'ja'; setAbcd(n); }, style: btnStyle('ja') }, isEN ? 'Yes \u2014 stable' : 'Ja \u2014 stabiel'),
            React.createElement('button', { onClick: function() { var n = Object.assign({}, abcd); n[item.key] = 'nee'; setAbcd(n); }, style: btnStyle('nee') }, isEN ? 'No \u2014 unstable' : 'Nee \u2014 instabiel'),
            React.createElement('button', { onClick: function() { var n = Object.assign({}, abcd); n[item.key] = 'onbekend'; setAbcd(n); }, style: btnStyle('onbekend') }, isEN ? 'Unknown' : 'Onbekend')
          )
        );
      }),
      React.createElement('button', { onClick: function() {
        if (Object.values(abcd).every(function(v) { return v !== null; })) volgendNaABCD();
      }, style: { background: Object.values(abcd).every(function(v) { return v !== null; }) ? (abcdInstabiel ? '#D94F4F' : '#E8732A') : '#EEEEEE', color: Object.values(abcd).every(function(v) { return v !== null; }) ? '#FFF' : '#AAAAAA', border: 'none', borderRadius: 12, padding: '13px', fontSize: 14, fontWeight: 700, cursor: Object.values(abcd).every(function(v) { return v !== null; }) ? 'pointer' : 'not-allowed', width: '100%', marginTop: 8 } }, abcdInstabiel ? (isEN ? 'Escalate immediately \u2192' : 'Direct escaleren \u2192') : (isEN ? 'Next' : 'Volgende') + ' \u2192')
    ),

    // ═══ STAP 3: TRIAGECRITERIA ═══
    stap === 3 && React.createElement('div', null,
      React.createElement('div', { style: { fontSize: 16, fontWeight: 700, color: C_N.tekstPrimair, marginBottom: 8 } }, isEN ? 'Triage criteria' : 'Triagecriteria'),
      (window.ntsCriteria[klacht] || []).map(function(c, i) {
        var ans = criteriaAnt[i];
        return React.createElement('div', { key: i, style: { background: '#FFF', borderRadius: 10, border: '0.5px solid #EEEEEE', padding: '12px', marginBottom: 6 } },
          React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 } },
            React.createElement('span', { style: { fontSize: 13, fontWeight: 500, color: C_N.tekstPrimair, flex: 1 } }, c.vraag),
            c.urgUp && React.createElement('span', { style: { fontSize: 10, color: '#E8732A', fontWeight: 600 } }, '\u2191 urgentie')
          ),
          React.createElement('div', { style: { fontSize: 11, color: C_N.tekstMuted, marginBottom: 6 } }, c.hint),
          React.createElement('div', { style: { display: 'flex', gap: 6 } },
            React.createElement('button', { onClick: function() { var n = criteriaAnt.slice(); n[i] = true; setCriteriaAnt(n); }, style: { flex: 1, padding: '8px', borderRadius: 8, fontSize: 13, fontWeight: ans === true ? 600 : 400, background: ans === true ? '#FFF3EB' : '#FFF', border: ans === true ? '2px solid #E8732A' : '1px solid #EEEEEE', color: ans === true ? '#E8732A' : C_N.tekstSecundair, cursor: 'pointer' } }, isEN ? 'Yes' : 'Ja'),
            React.createElement('button', { onClick: function() { var n = criteriaAnt.slice(); n[i] = false; setCriteriaAnt(n); }, style: { flex: 1, padding: '8px', borderRadius: 8, fontSize: 13, fontWeight: ans === false ? 600 : 400, background: ans === false ? '#EBF2F9' : '#FFF', border: ans === false ? '2px solid #4A7FB5' : '1px solid #EEEEEE', color: ans === false ? '#4A7FB5' : C_N.tekstSecundair, cursor: 'pointer' } }, isEN ? 'No' : 'Nee')
          )
        );
      }),
      React.createElement('button', { onClick: function() {
        if (criteriaAnt.every(function(a) { return a !== null; })) {
          var u = window.bepaalNTSUrgentie(abcd, criteriaAnt, klacht);
          setUrgentie(u);
          setStap(4);
        }
      }, style: { background: criteriaAnt.every(function(a) { return a !== null; }) ? '#E8732A' : '#EEEEEE', color: criteriaAnt.every(function(a) { return a !== null; }) ? '#FFF' : '#AAAAAA', border: 'none', borderRadius: 12, padding: '13px', fontSize: 14, fontWeight: 700, cursor: criteriaAnt.every(function(a) { return a !== null; }) ? 'pointer' : 'not-allowed', width: '100%', marginTop: 8 } }, (isEN ? 'Next' : 'Volgende') + ' \u2192')
    ),

    // ═══ STAP 4: URGENTIE-UITSLAG ═══
    stap === 4 && (function() {
      var defUrg = override || urgentie;
      var info = window.urgentieInfo[defUrg];
      return React.createElement('div', null,
        React.createElement('div', { style: { fontSize: 16, fontWeight: 700, color: C_N.tekstPrimair, marginBottom: 8 } }, isEN ? 'Urgency assessment' : 'Urgentie-uitslag'),
        React.createElement('div', { style: { background: info.bg, border: '2px solid ' + info.kleur, borderRadius: 10, padding: '16px', textAlign: 'center', marginBottom: 12 } },
          React.createElement('div', { style: { fontSize: 28 } }, info.icon),
          React.createElement('div', { style: { fontSize: 20, fontWeight: 700, color: info.kleur, marginTop: 4 } }, info.label),
          React.createElement('div', { style: { fontSize: 13, color: C_N.tekstSecundair, marginTop: 6 } }, isEN ? info.actieEN : info.actie)
        ),
        override && React.createElement('div', { style: { fontSize: 12, color: C_N.tekstMuted, marginBottom: 8 } }, (isEN ? 'Original NTS advice: ' : 'Oorspronkelijk NTS-advies: ') + urgentie),
        !toonOverride && React.createElement('button', { onClick: function() { setToonOverride(true); }, style: { background: 'none', border: '1px solid #EEEEEE', borderRadius: 8, padding: '8px 12px', fontSize: 12, color: C_N.tekstSecundair, cursor: 'pointer', width: '100%', marginBottom: 8 } }, isEN ? 'Adjust advice' : 'Advies aanpassen'),
        toonOverride && React.createElement('div', { style: { background: '#FFF', borderRadius: 10, border: '0.5px solid #EEEEEE', padding: 12, marginBottom: 8 } },
          React.createElement('select', { value: override || urgentie, onChange: function(e) { setOverride(e.target.value); }, style: { width: '100%', padding: '8px', borderRadius: 8, border: '1px solid #EEEEEE', fontSize: 13, marginBottom: 6 } },
            ['U0','U1','U2','U3','U4','U5'].map(function(u) { return React.createElement('option', { key: u, value: u }, window.urgentieInfo[u].label); })
          ),
          React.createElement('textarea', { value: overrideMotivatie, onChange: function(e) { setOverrideMotivatie(e.target.value); }, placeholder: isEN ? 'Motivation for adjustment (required)...' : 'Motivatie aanpassing (verplicht)...', style: { width: '100%', minHeight: 50, padding: 8, borderRadius: 8, border: '1px solid #EEEEEE', fontSize: 13, fontFamily: "'DM Sans', sans-serif", outline: 'none', color: C_N.tekstPrimair } })
        ),
        React.createElement('button', { onClick: function() {
          if (toonOverride && override && override !== urgentie && !overrideMotivatie.trim()) { addToast(isEN ? 'Provide motivation for adjustment' : 'Vul motivatie in'); return; }
          setStap(5);
        }, style: { background: '#E8732A', color: '#FFF', border: 'none', borderRadius: 12, padding: '13px', fontSize: 14, fontWeight: 700, cursor: 'pointer', width: '100%', marginTop: 4 } }, (isEN ? 'Next' : 'Volgende') + ' \u2192')
      );
    })(),

    // ═══ STAP 5: VERVOLGACTIE ═══
    stap === 5 && (function() {
      var defUrg = override || urgentie;
      var info = window.urgentieInfo[defUrg];
      var selKlacht = klachten.find(function(k) { return k.id === klacht; });
      return React.createElement('div', null,
        React.createElement('div', { style: { fontSize: 16, fontWeight: 700, color: C_N.tekstPrimair, marginBottom: 8 } }, isEN ? 'Follow-up action' : 'Vervolgactie'),
        React.createElement('div', { style: { background: '#FFF', borderRadius: 10, border: '0.5px solid #EEEEEE', padding: 14, marginBottom: 10 } },
          React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', marginBottom: 8 } },
            React.createElement('span', { style: { fontSize: 14, fontWeight: 600, color: C_N.tekstPrimair } }, info.label),
            React.createElement('span', { style: { fontSize: 16 } }, info.icon)
          ),
          React.createElement('div', { style: { fontSize: 13, color: C_N.tekstSecundair, lineHeight: 1.5 } }, isEN ? info.actieEN : info.actie),
          override && override !== urgentie && React.createElement('div', { style: { fontSize: 11, color: C_N.tekstMuted, marginTop: 6, padding: '6px 8px', background: '#F7F7F7', borderRadius: 6 } }, (isEN ? 'Adjusted from ' : 'Aangepast van ') + urgentie + ': ' + overrideMotivatie)
        ),
        React.createElement('div', { style: { background: '#FFF', borderRadius: 10, border: '0.5px solid #EEEEEE', padding: 14, marginBottom: 10 } },
          React.createElement('div', { style: { fontSize: 12, color: C_N.tekstMuted, marginBottom: 2 } }, isEN ? 'Complaint' : 'Klacht'),
          React.createElement('div', { style: { fontSize: 14, color: C_N.tekstPrimair, marginBottom: 8 } }, selKlacht ? (isEN ? selKlacht.labelEN : selKlacht.label) : klacht),
          React.createElement('div', { style: { fontSize: 12, color: C_N.tekstMuted, marginBottom: 2 } }, isEN ? 'Observation' : 'Observatie'),
          React.createElement('div', { style: { fontSize: 13, color: C_N.tekstSecundair } }, observatie)
        ),
        React.createElement('textarea', { value: notitie, onChange: function(e) { setNotitie(e.target.value); }, placeholder: isEN ? 'Additional notes (optional)...' : 'Extra opmerking (optioneel)...', style: { width: '100%', minHeight: 50, padding: 10, borderRadius: 10, border: '1px solid #EEEEEE', fontSize: 13, fontFamily: "'DM Sans', sans-serif", outline: 'none', color: C_N.tekstPrimair, marginBottom: 8 } }),
        React.createElement('button', { onClick: function() { setOpgeslagen(true); addToast(isEN ? 'Triage report saved' : 'Triageverslag opgeslagen', 'success'); }, style: { background: '#2D9D78', color: '#FFF', border: 'none', borderRadius: 12, padding: '13px', fontSize: 14, fontWeight: 700, cursor: 'pointer', width: '100%' } }, '\u2713 ' + (isEN ? 'Save and confirm' : 'Opslaan en bevestigen'))
      );
    })()
  );
};
