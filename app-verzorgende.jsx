// GeriCall — Verzorgende secties
// Taakgericht, kort, direct. "Wat moet ik NU doen?"

const C_V = window.COLORS;

// ══════════════════════════════════════════
// TAKEN — dagelijks taakscherm
// ══════════════════════════════════════════
window.VerzorgendeTaken = function VerzorgendeTaken({ addToast }) {
  const { useState } = React;
  const p = window.patient;
  const [taken, setTaken] = useState([
    { id: 1, tekst: 'ADL ochtend \u2014 douchen, aankleden', tijd: '07:30', gedaan: true },
    { id: 2, tekst: 'Medicatie ochtend \u2014 Metoprolol, Furosemide', tijd: '08:00', gedaan: true },
    { id: 3, tekst: 'Ontbijt begeleiden \u2014 natriumbeperkt', tijd: '08:30', gedaan: false },
    { id: 4, tekst: 'Vochtinname registreren', tijd: '10:00', gedaan: false },
    { id: 5, tekst: 'Looptraining 10 min (zie bewegingsplan)', tijd: '10:30', gedaan: false },
    { id: 6, tekst: 'Dagrapportage ochtend invullen', tijd: '12:00', gedaan: false },
    { id: 7, tekst: 'Medicatie middag \u2014 Rivastigmine pleister', tijd: '12:30', gedaan: false },
  ]);

  const toggle = (id) => {
    setTaken(prev => prev.map(t => t.id === id ? { ...t, gedaan: !t.gedaan } : t));
    const taak = taken.find(t => t.id === id);
    if (taak && !taak.gedaan) addToast('Taak afgerond', 'success');
  };

  const gedaan = taken.filter(t => t.gedaan).length;

  return React.createElement('div', { style: { animation: 'fadeIn 0.3s ease' } },
    React.createElement(SectionTitle, null, 'Taken vandaag'),
    // Progress
    React.createElement(Card, null,
      React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', marginBottom: 6 } },
        React.createElement('span', { style: { fontSize: 13, fontWeight: 500, color: C_V.tekstSecundair } }, gedaan + ' van ' + taken.length + ' taken'),
        React.createElement('span', { style: { fontSize: 13, fontWeight: 700, color: C_V.oranje } }, Math.round(gedaan / taken.length * 100) + '%')
      ),
      React.createElement(ProgressBar, { percentage: gedaan / taken.length * 100 })
    ),
    // Alerts
    p.openConsulten.length > 0 && React.createElement(Card, { style: { background: C_V.roodLicht, border: '1px solid ' + C_V.rood } },
      React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 8 } },
        React.createElement('span', { style: { fontSize: 18 } }, '\u26A0\uFE0F'),
        React.createElement('div', null,
          React.createElement('div', { style: { fontSize: 13, fontWeight: 600, color: C_V.rood } }, 'Open consult #' + p.openConsulten[0].id),
          React.createElement('div', { style: { fontSize: 12, color: C_V.tekstSecundair } }, p.openConsulten[0].beschrijving || p.openConsulten[0].urgentie)
        )
      )
    ),
    // Taken lijst
    taken.map(function(t) {
      return React.createElement('div', { key: t.id, onClick: function() { toggle(t.id); }, style: {
        display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', marginBottom: 4,
        background: C_V.kaartWit, borderRadius: 10, border: '1px solid ' + C_V.border, cursor: 'pointer',
        opacity: t.gedaan ? 0.6 : 1, transition: 'all 0.2s',
      } },
        React.createElement('div', { style: {
          width: 24, height: 24, borderRadius: 6, border: '2px solid ' + (t.gedaan ? C_V.groen : C_V.border),
          background: t.gedaan ? C_V.groen : 'transparent',
          display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFF', fontSize: 14, fontWeight: 700, flexShrink: 0,
        } }, t.gedaan ? '\u2713' : ''),
        React.createElement('div', { style: { flex: 1 } },
          React.createElement('div', { style: { fontSize: 14, fontWeight: 500, color: C_V.tekstPrimair, textDecoration: t.gedaan ? 'line-through' : 'none' } }, t.tekst),
          React.createElement('div', { style: { fontSize: 12, color: C_V.tekstMuted } }, t.tijd)
        )
      );
    }),
    // Behandelplan quick access
    React.createElement(SectionTitle, null, 'Behandelplan'),
    React.createElement('div', { style: { fontSize: 12, color: C_V.tekstMuted, marginBottom: 8 } }, 'Tik voor details \u00B7 Wijzigingen via GeriForce'),
    p.behandelplan.map(function(item, i) {
      var actueel = item.status === 'Actueel';
      return React.createElement(Card, { key: i, style: { padding: 12 } },
        React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' } },
          React.createElement('div', null,
            React.createElement('span', { style: { fontSize: 14, fontWeight: 600, color: C_V.tekstPrimair } }, item.onderdeel),
            React.createElement('div', { style: { fontSize: 11, color: C_V.tekstMuted } }, 'Bijgewerkt: ' + item.bijgewerkt)
          ),
          React.createElement(Badge, { label: item.status, color: actueel ? C_V.groen : C_V.oranje, bgColor: actueel ? C_V.groenLicht : C_V.oranjeLicht })
        )
      );
    }),
    // Familieinfo
    React.createElement(SectionTitle, null, 'Familie contacten'),
    window.familieleden.map(function(f, i) {
      return React.createElement(Card, { key: i, style: { padding: 12 } },
        React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' } },
          React.createElement('div', null,
            React.createElement('div', { style: { fontSize: 14, fontWeight: 600, color: C_V.tekstPrimair } }, f.naam + (f.isHoofdcontact ? ' (1e contact)' : '')),
            React.createElement('div', { style: { fontSize: 12, color: C_V.tekstSecundair } }, f.relatie + ' \u00B7 Laatst: ' + f.laatsteBezoek)
          ),
          React.createElement('div', { style: { fontSize: 12, color: C_V.blauw, fontWeight: 500 } }, f.telefoon)
        )
      );
    })
  );
};

// ══════════════════════════════════════════
// RAPPORTAGE — snel invullen
// ══════════════════════════════════════════
window.VerzorgendeRapportage = function VerzorgendeRapportage({ addToast }) {
  const { useState } = React;
  const [tekst, setTekst] = useState('');
  const [categorie, setCategorie] = useState('ochtend');
  const cats = [
    { id: 'ochtend', label: 'Ochtend' },
    { id: 'middag', label: 'Middag' },
    { id: 'avond', label: 'Avond' },
    { id: 'nacht', label: 'Nacht' },
  ];

  return React.createElement('div', { style: { animation: 'fadeIn 0.3s ease' } },
    React.createElement(SectionTitle, null, 'Rapportage invullen'),
    // Categorie keuze
    React.createElement('div', { style: { display: 'flex', gap: 6, marginBottom: 12 } },
      cats.map(function(c) {
        var sel = categorie === c.id;
        return React.createElement('button', { key: c.id, onClick: function() { setCategorie(c.id); }, style: {
          flex: 1, padding: '8px 0', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: sel ? 600 : 400,
          background: sel ? C_V.oranje : C_V.kaartWit, color: sel ? '#FFF' : C_V.tekstSecundair, transition: 'all 0.2s',
        } }, c.label);
      })
    ),
    React.createElement(Card, null,
      React.createElement('textarea', {
        value: tekst, onChange: function(e) { setTekst(e.target.value); },
        placeholder: 'Hoe was de ' + categorie + '? Beschrijf kort...\n\nBijv: ADL ging goed, medicatie ingenomen. Meneer was rustig.',
        style: { width: '100%', minHeight: 120, padding: 12, borderRadius: 8, border: '1px solid ' + C_V.border, fontSize: 14, fontFamily: "'DM Sans', sans-serif", resize: 'vertical', outline: 'none', color: C_V.tekstPrimair }
      }),
      React.createElement('div', { style: { fontSize: 12, color: C_V.tekstMuted, marginTop: 8 } }, 'Dit rapport wordt zichtbaar voor collega\'s \u00E9n familie.'),
      React.createElement('button', { onClick: function() {
        if (tekst.trim()) { addToast('Rapportage opgeslagen', 'success'); setTekst(''); } else addToast('Schrijf eerst een rapportage');
      }, style: { background: C_V.oranje, color: '#FFF', border: 'none', borderRadius: 8, padding: '12px', fontSize: 14, fontWeight: 600, cursor: 'pointer', width: '100%', marginTop: 8 } }, 'Opslaan')
    ),
    // Eerdere rapportages
    React.createElement(SectionTitle, null, 'Recente rapportages'),
    window.dagrapportages.map(function(r, i) {
      return React.createElement(Card, { key: i, style: { padding: 12 } },
        React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', marginBottom: 4 } },
          React.createElement('span', { style: { fontSize: 13, fontWeight: 600, color: r.isFamilie ? C_V.groen : C_V.tekstPrimair } }, r.auteur + (r.isFamilie ? ' (familie)' : '')),
          React.createElement('span', { style: { fontSize: 11, color: C_V.tekstMuted } }, r.datum)
        ),
        React.createElement('div', { style: { fontSize: 13, color: C_V.tekstSecundair, lineHeight: 1.5 } }, r.tekst)
      );
    })
  );
};

// ══════════════════════════════════════════
// LEREN — verzorgende
// ══════════════════════════════════════════
window.VerzorgendeLeren = function VerzorgendeLeren({ addToast }) {
  const { useState } = React;
  const [modalModule, setModalModule] = useState(null);
  var modules = window.verzorgendeModules;
  var shared = window.gedeeldeModule;

  var statusLabel = function(s) {
    if (s === 'certificaat') return { label: 'Behaald \u2713', color: C_V.groen, bg: C_V.groenLicht };
    if (s === 'bezig') return { label: 'In uitvoering', color: C_V.oranje, bg: C_V.oranjeLicht };
    return { label: 'Nog te starten', color: C_V.tekstMuted, bg: C_V.achtergrond };
  };

  return React.createElement('div', { style: { animation: 'fadeIn 0.3s ease' } },
    React.createElement(SectionTitle, null, 'Verplichte modules'),
    React.createElement('div', { style: { fontSize: 12, color: C_V.tekstMuted, marginBottom: 12 } }, 'Deze modules zijn vereist voor je inzet bij ' + window.patient.kamer.split(' \u00B7')[0]),
    // Klantcertificaat
    React.createElement(Card, { style: { background: C_V.groenLicht, border: '1px solid ' + C_V.groen, padding: 12 } },
      React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 8 } },
        React.createElement('span', { style: { fontSize: 20 } }, '\u2705'),
        React.createElement('div', null,
          React.createElement('div', { style: { fontSize: 14, fontWeight: 600, color: C_V.groen } }, 'Zonnehof \u2014 toegangscertificaat behaald'),
          React.createElement('div', { style: { fontSize: 12, color: C_V.tekstSecundair } }, 'Geldig t/m december 2026')
        )
      )
    ),
    // Modules
    modules.map(function(m, i) {
      var st = statusLabel(m.status);
      return React.createElement(Card, { key: i, style: { cursor: 'pointer' }, onClick: function() { setModalModule(m); } },
        React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: m.status === 'bezig' ? 6 : 0 } },
          React.createElement('span', { style: { fontSize: 14, fontWeight: 600, color: C_V.tekstPrimair, flex: 1, marginRight: 8 } }, m.naam),
          React.createElement(Badge, { label: st.label, color: st.color, bgColor: st.bg })
        ),
        m.status === 'bezig' && React.createElement(ProgressBar, { percentage: m.voortgang })
      );
    }),
    // Shared patient module
    React.createElement(SectionTitle, null, 'Kennismodule bij pati\u00EBnt'),
    React.createElement(Card, { style: { border: '2px solid ' + C_V.oranje } },
      React.createElement('div', { style: { fontSize: 14, fontWeight: 600, color: C_V.tekstPrimair, marginBottom: 4 } }, shared.naam),
      React.createElement('div', { style: { fontSize: 12, color: C_V.tekstSecundair, marginBottom: 8 } }, shared.voltooid + ' van ' + shared.totaal + ' onderdelen'),
      React.createElement(ProgressBar, { percentage: shared.voltooid / shared.totaal * 100 }),
      React.createElement('button', { onClick: function() { addToast('E-learning wordt geladen', 'success'); }, style: {
        background: C_V.oranje, color: '#FFF', border: 'none', borderRadius: 8, padding: '10px', fontSize: 14, fontWeight: 600, cursor: 'pointer', width: '100%', marginTop: 10,
      } }, 'Ga verder')
    ),
    // Modal
    modalModule && React.createElement(Modal, { title: modalModule.naam, onClose: function() { setModalModule(null); } },
      React.createElement('p', { style: { fontSize: 14, color: C_V.tekstSecundair, lineHeight: 1.6, marginBottom: 12 } }, modalModule.beschrijving),
      modalModule.status === 'bezig' && React.createElement('div', { style: { marginBottom: 12 } },
        React.createElement('div', { style: { fontSize: 12, color: C_V.tekstMuted, marginBottom: 4 } }, 'Voortgang: ' + modalModule.voortgang + '%'),
        React.createElement(ProgressBar, { percentage: modalModule.voortgang })
      ),
      React.createElement('button', { onClick: function() { addToast('E-learning wordt geladen', 'success'); setModalModule(null); }, style: {
        background: C_V.oranje, color: '#FFF', border: 'none', borderRadius: 8, padding: '10px 20px', fontSize: 14, fontWeight: 600, cursor: 'pointer', width: '100%',
      } }, modalModule.status === 'niet_gestart' ? 'Start module' : modalModule.status === 'bezig' ? 'Ga verder' : 'Opnieuw bekijken')
    )
  );
};
