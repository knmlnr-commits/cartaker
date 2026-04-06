// GeriCall CareTaker Portal — Lightweight versie
// Alleen consulten inschieten + verrijken, geen EPD, geen dossier
// Voor: uitzendkrachten, laagdrempelig, minimale patiëntinfo

var C_CT = window.COLORS;

window.CareTakerPortal = function CareTakerPortal({ onTerug }) {
  var { useState } = React;
  var [scherm, setScherm] = useState('home'); // home | overzicht | aanmaken | detail
  var [consulten, setConsulten] = useState([
    { id: 'C-3001', bewoner: 'Ans', afdeling: 'Afdeling B', klacht: 'Gevallen, pijn rechterheup', urgentie: 'Spoed', status: 'Arts onderweg', tijdstip: '14:32' },
    { id: 'C-3002', bewoner: 'Henk', afdeling: 'Afdeling A', klacht: 'Kortademig bij bewegen', urgentie: 'Vandaag', status: 'In behandeling', tijdstip: '13:05' },
    { id: 'C-3003', bewoner: 'Riet', afdeling: 'Afdeling C', klacht: 'Koorts, 38.8\u00B0C', urgentie: 'Regulier', status: 'Wachtend', tijdstip: '11:50' },
    { id: 'C-3004', bewoner: 'Willem', afdeling: 'Afdeling B', klacht: 'Medicatievraag achterwacht', urgentie: 'Regulier', status: 'Afgerond', tijdstip: '09:15' },
  ]);
  var [selectedConsult, setSelectedConsult] = useState(null);
  var [toasts, addToast] = (function() {
    var ts = useState([]);
    var add = function(msg, type) {
      var id = Date.now();
      ts[1](function(prev) { return prev.concat([{ id: id, message: msg, type: type || 'info', removing: false }]); });
      setTimeout(function() { ts[1](function(prev) { return prev.filter(function(t) { return t.id !== id; }); }); }, 2500);
    };
    return [ts[0], add];
  })();

  // Aanmaak state
  var [aanmaakStap, setAanmaakStap] = useState(1);
  var [nieuwBewoner, setNieuwBewoner] = useState('');
  var [nieuwAfdeling, setNieuwAfdeling] = useState('');
  var [nieuwKlacht, setNieuwKlacht] = useState('');
  var [nieuwUrgentie, setNieuwUrgentie] = useState(null);

  // Video state
  var [videoFase, setVideoFase] = useState(0);
  var [detailTab, setDetailTab] = useState('status');

  var bewoners = [
    { naam: 'Ans', afdeling: 'Afdeling B' },
    { naam: 'Henk', afdeling: 'Afdeling A' },
    { naam: 'Riet', afdeling: 'Afdeling C' },
    { naam: 'Willem', afdeling: 'Afdeling B' },
    { naam: 'Corrie', afdeling: 'Afdeling A' },
  ];

  var statusKleur = function(s) {
    if (s === 'Arts onderweg') return C_CT.oranje;
    if (s === 'In behandeling') return C_CT.groen;
    if (s === 'Afgerond') return C_CT.tekstMuted;
    return C_CT.blauw;
  };

  var urgentieKleur = function(u) {
    if (u === 'Spoed') return { kleur: C_CT.rood, bg: C_CT.roodLicht };
    if (u === 'Vandaag') return { kleur: C_CT.oranje, bg: C_CT.oranjeLicht };
    return { kleur: C_CT.tekstMuted, bg: C_CT.achtergrond };
  };

  // ═══ HOME ═══
  if (scherm === 'home') {
    return React.createElement('div', { style: { minHeight: '100vh', background: C_CT.achtergrond, display: 'flex', alignItems: 'center', justifyContent: 'center' } },
      React.createElement('div', { style: { maxWidth: 420, width: '100%', padding: '32px 24px', textAlign: 'center' } },
        React.createElement(GeriCallLogoBig, null),
        React.createElement('div', { style: { fontSize: 14, color: C_CT.oranje, fontWeight: 600, marginBottom: 4 } }, 'CareTaker Portal'),
        React.createElement('div', { style: { fontSize: 13, color: C_CT.tekstSecundair, marginBottom: 32 } }, 'Zorgcentrum De Linde \u2014 Afdeling B'),

        React.createElement('button', { onClick: function() { setScherm('aanmaken'); setAanmaakStap(1); }, style: {
          display: 'block', width: '100%', padding: '14px', borderRadius: 10, border: 'none',
          background: C_CT.oranje, color: '#FFF', fontSize: 15, fontWeight: 600, cursor: 'pointer', marginBottom: 10,
        } }, '\u2795 Nieuw consult aanmaken'),
        React.createElement('button', { onClick: function() { setScherm('overzicht'); }, style: {
          display: 'block', width: '100%', padding: '14px', borderRadius: 10,
          background: 'transparent', border: '1px solid ' + C_CT.oranje, color: C_CT.oranje, fontSize: 15, fontWeight: 600, cursor: 'pointer', marginBottom: 24,
        } }, '\uD83D\uDCCB Lopende consults (' + consulten.filter(function(c) { return c.status !== 'Afgerond'; }).length + ')'),

        onTerug && React.createElement('button', { onClick: onTerug, style: { background: 'none', border: 'none', fontSize: 13, color: C_CT.tekstMuted, cursor: 'pointer' } }, '\u2190 Hoofdapp'),
        React.createElement('div', { style: { fontSize: 10, color: C_CT.tekstMuted, marginTop: 16 } }, 'CareTaker Portal v0.1 \u2014 GeriCall')
      ),
      React.createElement(ToastContainer, { toasts: toasts })
    );
  }

  // ═══ OVERZICHT ═══
  if (scherm === 'overzicht') {
    return React.createElement('div', { style: { minHeight: '100vh', background: C_CT.achtergrond } },
      React.createElement('div', { style: { maxWidth: 420, margin: '0 auto', padding: '16px' } },
        React.createElement('button', { onClick: function() { setScherm('home'); }, style: { background: 'none', border: 'none', fontSize: 14, color: C_CT.tekstMuted, cursor: 'pointer', marginBottom: 12 } }, '\u2190 Home'),
        React.createElement(SectionTitle, null, 'Lopende consults'),
        consulten.map(function(c) {
          var uk = urgentieKleur(c.urgentie);
          var sk = statusKleur(c.status);
          return React.createElement(Card, { key: c.id, style: { padding: 12, cursor: 'pointer', borderLeft: '3px solid ' + uk.kleur }, onClick: function() { setSelectedConsult(c); setScherm('detail'); } },
            React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 } },
              React.createElement('span', { style: { fontSize: 14, fontWeight: 600, color: C_CT.tekstPrimair } }, c.bewoner + ' \u00B7 ' + c.afdeling),
              React.createElement(Badge, { label: c.urgentie, color: uk.kleur, bgColor: uk.bg })
            ),
            React.createElement('div', { style: { fontSize: 13, color: C_CT.tekstSecundair } }, c.klacht),
            React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 6 } },
              React.createElement(Badge, { label: c.status, color: sk, bgColor: sk + '18' }),
              React.createElement('span', { style: { fontSize: 11, color: C_CT.tekstMuted } }, c.tijdstip)
            )
          );
        }),
        React.createElement('button', { onClick: function() { setScherm('aanmaken'); setAanmaakStap(1); }, style: {
          display: 'block', width: '100%', padding: '12px', borderRadius: 8, border: 'none',
          background: C_CT.oranje, color: '#FFF', fontSize: 14, fontWeight: 600, cursor: 'pointer', marginTop: 12,
        } }, '\u2795 Nieuw consult')
      ),
      React.createElement(ToastContainer, { toasts: toasts })
    );
  }

  // ═══ AANMAKEN (3 stappen) ═══
  if (scherm === 'aanmaken') {
    return React.createElement('div', { style: { minHeight: '100vh', background: C_CT.achtergrond } },
      React.createElement('div', { style: { maxWidth: 420, margin: '0 auto', padding: '16px' } },
        React.createElement('button', { onClick: function() { setScherm('home'); }, style: { background: 'none', border: 'none', fontSize: 14, color: C_CT.tekstMuted, cursor: 'pointer', marginBottom: 12 } }, '\u2190 Annuleren'),
        React.createElement(SectionTitle, null, 'Nieuw consult'),
        React.createElement('div', { style: { display: 'flex', gap: 4, marginBottom: 16 } },
          [1,2,3].map(function(s) { return React.createElement('div', { key: s, style: { flex: 1, height: 4, borderRadius: 2, background: s <= aanmaakStap ? C_CT.oranje : C_CT.border } }); })
        ),

        aanmaakStap === 1 && React.createElement('div', null,
          React.createElement('div', { style: { fontSize: 14, fontWeight: 500, color: C_CT.tekstPrimair, marginBottom: 8 } }, 'Bewoner selecteren'),
          bewoners.map(function(b) {
            var sel = nieuwBewoner === b.naam;
            return React.createElement(Card, { key: b.naam, style: { padding: 12, cursor: 'pointer', border: sel ? '2px solid ' + C_CT.oranje : '1px solid ' + C_CT.border }, onClick: function() { setNieuwBewoner(b.naam); setNieuwAfdeling(b.afdeling); } },
              React.createElement('div', { style: { fontSize: 14, fontWeight: 600, color: C_CT.tekstPrimair } }, b.naam),
              React.createElement('div', { style: { fontSize: 12, color: C_CT.tekstMuted } }, b.afdeling)
            );
          }),
          React.createElement('button', { onClick: function() { if (nieuwBewoner) setAanmaakStap(2); }, style: {
            background: nieuwBewoner ? C_CT.oranje : C_CT.border, color: nieuwBewoner ? '#FFF' : C_CT.tekstMuted,
            border: 'none', borderRadius: 8, padding: '12px', fontSize: 14, fontWeight: 600, cursor: 'pointer', width: '100%', marginTop: 8,
          } }, 'Volgende \u2192')
        ),

        aanmaakStap === 2 && React.createElement('div', null,
          React.createElement('div', { style: { fontSize: 14, fontWeight: 500, color: C_CT.tekstPrimair, marginBottom: 8 } }, 'Klacht beschrijven'),
          React.createElement('textarea', { value: nieuwKlacht, onChange: function(e) { setNieuwKlacht(e.target.value); }, placeholder: 'Wat is er aan de hand?', style: { width: '100%', minHeight: 80, padding: 12, borderRadius: 8, border: '1px solid ' + C_CT.border, fontSize: 14, fontFamily: "'DM Sans', sans-serif", resize: 'vertical', outline: 'none', color: C_CT.tekstPrimair, marginBottom: 12 } }),
          React.createElement('div', { style: { fontSize: 13, fontWeight: 500, color: C_CT.tekstSecundair, marginBottom: 6 } }, 'Urgentie'),
          React.createElement('div', { style: { display: 'flex', gap: 8, marginBottom: 12 } },
            [{ id: 'Spoed', kleur: C_CT.rood, bg: C_CT.roodLicht }, { id: 'Vandaag', kleur: C_CT.oranje, bg: C_CT.oranjeLicht }, { id: 'Regulier', kleur: C_CT.tekstMuted, bg: C_CT.achtergrond }].map(function(u) {
              var sel = nieuwUrgentie === u.id;
              return React.createElement('button', { key: u.id, onClick: function() { setNieuwUrgentie(u.id); }, style: {
                flex: 1, padding: '10px', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 600,
                background: sel ? u.kleur : u.bg, color: sel ? '#FFF' : u.kleur, border: sel ? 'none' : '1px solid ' + C_CT.border,
              } }, u.id);
            })
          ),
          React.createElement('div', { style: { display: 'flex', gap: 8 } },
            React.createElement('button', { onClick: function() { setAanmaakStap(1); }, style: { flex: 1, background: C_CT.kaartWit, color: C_CT.tekstSecundair, border: '1px solid ' + C_CT.border, borderRadius: 8, padding: '12px', fontSize: 14, cursor: 'pointer' } }, '\u2190 Vorige'),
            React.createElement('button', { onClick: function() { if (nieuwKlacht.trim() && nieuwUrgentie) setAanmaakStap(3); }, style: { flex: 2, background: nieuwKlacht.trim() && nieuwUrgentie ? C_CT.oranje : C_CT.border, color: nieuwKlacht.trim() && nieuwUrgentie ? '#FFF' : C_CT.tekstMuted, border: 'none', borderRadius: 8, padding: '12px', fontSize: 14, fontWeight: 600, cursor: 'pointer' } }, 'Volgende \u2192')
          )
        ),

        aanmaakStap === 3 && React.createElement('div', null,
          React.createElement('div', { style: { fontSize: 14, fontWeight: 500, color: C_CT.tekstPrimair, marginBottom: 8 } }, 'Bevestiging'),
          React.createElement(Card, { style: { padding: 14 } },
            React.createElement('div', { style: { fontSize: 12, color: C_CT.tekstMuted } }, 'Bewoner'),
            React.createElement('div', { style: { fontSize: 14, fontWeight: 600, color: C_CT.tekstPrimair, marginBottom: 8 } }, nieuwBewoner + ' \u00B7 ' + nieuwAfdeling),
            React.createElement('div', { style: { fontSize: 12, color: C_CT.tekstMuted } }, 'Klacht'),
            React.createElement('div', { style: { fontSize: 14, color: C_CT.tekstPrimair, marginBottom: 8 } }, nieuwKlacht),
            React.createElement('div', { style: { fontSize: 12, color: C_CT.tekstMuted, marginBottom: 4 } }, 'Urgentie'),
            React.createElement(Badge, { label: nieuwUrgentie, color: urgentieKleur(nieuwUrgentie).kleur, bgColor: urgentieKleur(nieuwUrgentie).bg })
          ),
          React.createElement('div', { style: { display: 'flex', gap: 8, marginTop: 8 } },
            React.createElement('button', { onClick: function() { setAanmaakStap(2); }, style: { flex: 1, background: C_CT.kaartWit, color: C_CT.tekstSecundair, border: '1px solid ' + C_CT.border, borderRadius: 8, padding: '12px', fontSize: 14, cursor: 'pointer' } }, '\u2190 Vorige'),
            React.createElement('button', { onClick: function() {
              var nieuwC = { id: 'C-' + (3000 + consulten.length + 1), bewoner: nieuwBewoner, afdeling: nieuwAfdeling, klacht: nieuwKlacht, urgentie: nieuwUrgentie, status: 'Wachtend', tijdstip: new Date().toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' }) };
              setConsulten(function(prev) { return [nieuwC].concat(prev); });
              addToast('Consult ingediend!', 'success');
              setScherm('overzicht');
              setNieuwBewoner(''); setNieuwKlacht(''); setNieuwUrgentie(null); setAanmaakStap(1);
            }, style: { flex: 2, background: C_CT.groen, color: '#FFF', border: 'none', borderRadius: 8, padding: '12px', fontSize: 14, fontWeight: 700, cursor: 'pointer' } }, '\u2713 Opslaan')
          )
        )
      ),
      React.createElement(ToastContainer, { toasts: toasts })
    );
  }

  // ═══ DETAIL ═══
  if (scherm === 'detail' && selectedConsult) {
    var c = selectedConsult;
    var uk = urgentieKleur(c.urgentie);
    var sk = statusKleur(c.status);

    return React.createElement('div', { style: { minHeight: '100vh', background: C_CT.achtergrond } },
      React.createElement('div', { style: { maxWidth: 420, margin: '0 auto', padding: '16px' } },
        React.createElement('button', { onClick: function() { setScherm('overzicht'); }, style: { background: 'none', border: 'none', fontSize: 14, color: C_CT.tekstMuted, cursor: 'pointer', marginBottom: 12 } }, '\u2190 Overzicht'),

        // Header
        React.createElement(Card, { style: { padding: 14 } },
          React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 } },
            React.createElement('span', { style: { fontSize: 16, fontWeight: 700, color: C_CT.tekstPrimair } }, '#' + c.id),
            React.createElement(Badge, { label: c.urgentie, color: uk.kleur, bgColor: uk.bg })
          ),
          React.createElement('div', { style: { fontSize: 14, color: C_CT.tekstPrimair, marginBottom: 4 } }, c.bewoner + ' \u00B7 ' + c.afdeling),
          React.createElement('div', { style: { fontSize: 13, color: C_CT.tekstSecundair } }, c.klacht),
          React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', marginTop: 8 } },
            React.createElement(Badge, { label: c.status, color: sk, bgColor: sk + '18' }),
            React.createElement('span', { style: { fontSize: 12, color: C_CT.tekstMuted } }, c.tijdstip)
          )
        ),

        // Tabs
        React.createElement('div', { style: { display: 'flex', gap: 4, marginBottom: 12 } },
          [{ id: 'status', label: 'Status' }, { id: 'navul', label: 'Aanvullen' }, { id: 'video', label: 'Videocall' }].map(function(t) {
            var sel = detailTab === t.id;
            return React.createElement('button', { key: t.id, onClick: function() { setDetailTab(t.id); }, style: {
              flex: 1, padding: '8px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: sel ? 600 : 400,
              background: sel ? C_CT.blauwLicht : C_CT.kaartWit, color: sel ? C_CT.blauw : C_CT.tekstSecundair,
            } }, t.label);
          })
        ),

        // Status tab
        detailTab === 'status' && React.createElement(Card, { style: { padding: 14 } },
          React.createElement('div', { style: { fontSize: 13, fontWeight: 600, color: C_CT.tekstSecundair, marginBottom: 8 } }, 'Statushistorie'),
          [
            { tijd: c.tijdstip, tekst: 'Consult ingediend', type: 'M' },
            { tijd: c.tijdstip, tekst: 'Urgentie: ' + c.urgentie, type: 'T' },
            { tijd: c.tijdstip, tekst: 'Status: ' + c.status, type: 'S' },
          ].map(function(e, i) {
            return React.createElement('div', { key: i, style: { display: 'flex', gap: 10, marginBottom: 8 } },
              React.createElement('div', { style: { width: 20, height: 20, borderRadius: 10, background: C_CT.achtergrond, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 700, color: C_CT.tekstMuted } }, e.type),
              React.createElement('div', { style: { flex: 1, fontSize: 13, color: C_CT.tekstSecundair } }, e.tekst),
              React.createElement('span', { style: { fontSize: 11, color: C_CT.tekstMuted } }, e.tijd)
            );
          })
        ),

        // Navul tab
        detailTab === 'navul' && React.createElement(Card, { style: { padding: 14 } },
          React.createElement('div', { style: { fontSize: 13, fontWeight: 600, color: C_CT.tekstSecundair, marginBottom: 8 } }, 'Aanvullende informatie verstrekken'),
          React.createElement('textarea', { placeholder: 'Extra toelichting, vitalen, observaties...', style: { width: '100%', minHeight: 80, padding: 10, borderRadius: 8, border: '1px solid ' + C_CT.border, fontSize: 13, fontFamily: "'DM Sans', sans-serif", outline: 'none', color: C_CT.tekstPrimair, marginBottom: 8 } }),
          React.createElement(FotoUpload, { label: 'Foto toevoegen', addToast: addToast }),
          React.createElement('button', { onClick: function() { addToast('Informatie verstuurd', 'success'); }, style: { background: C_CT.oranje, color: '#FFF', border: 'none', borderRadius: 8, padding: '10px', fontSize: 13, fontWeight: 600, cursor: 'pointer', width: '100%', marginTop: 6 } }, 'Verstuur')
        ),

        // Video tab
        detailTab === 'video' && React.createElement('div', { style: { textAlign: 'center' } },
          videoFase === 0 && React.createElement('div', { style: { padding: '32px 0' } },
            React.createElement('div', { style: { fontSize: 14, color: C_CT.tekstSecundair, marginBottom: 16 } }, 'Start een videogesprek met de arts'),
            React.createElement('button', { onClick: function() { setVideoFase(1); setTimeout(function() { setVideoFase(2); }, 2000); }, style: {
              background: C_CT.groen, color: '#FFF', border: 'none', borderRadius: 12, padding: '16px 32px', fontSize: 16, fontWeight: 600, cursor: 'pointer',
            } }, '\uD83D\uDCF9 Videogesprek starten')
          ),
          videoFase === 1 && React.createElement('div', { style: { padding: '40px 0' } },
            React.createElement('div', { style: { fontSize: 15, color: C_CT.tekstPrimair } }, 'Verbinding maken...')
          ),
          videoFase === 2 && React.createElement('div', null,
            React.createElement('div', { style: { background: C_CT.tekstPrimair, borderRadius: 12, aspectRatio: '16/9', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12, border: '2px solid ' + C_CT.groen } },
              React.createElement('div', { style: { color: '#FFF', textAlign: 'center' } },
                React.createElement('div', { style: { fontSize: 16, fontWeight: 600 } }, 'Dr. Janssen'),
                React.createElement('div', { style: { fontSize: 12, opacity: 0.7, marginTop: 4 } }, 'In gesprek')
              )
            ),
            React.createElement('button', { onClick: function() { setVideoFase(0); }, style: {
              background: C_CT.rood, color: '#FFF', border: 'none', borderRadius: 8, padding: '12px', fontSize: 14, fontWeight: 600, cursor: 'pointer', width: '100%',
            } }, '\uD83D\uDCF5 Gesprek be\u00EBindigen')
          )
        )
      ),
      React.createElement(ToastContainer, { toasts: toasts })
    );
  }

  return null;
};
