// GeriCall — Familie secties
// Warm, betrokken, begrijpelijk. "Hoe gaat het met papa?"

const C_F = window.COLORS;

// ══════════════════════════════════════════
// OVERZICHT — hoe gaat het met papa?
// ══════════════════════════════════════════
window.FamilieOverzicht = function FamilieOverzicht({ addToast }) {
  const { useState } = React;
  const [toonDetails, setToonDetails] = useState(null);
  const p = window.patient;

  return React.createElement('div', { style: { animation: 'fadeIn 0.3s ease' } },
    // Patiënt status card
    React.createElement(Card, null,
      React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 14 } },
        React.createElement('div', { style: { width: 56, height: 56, borderRadius: 28, background: C_F.oranjeLicht, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, fontWeight: 700, color: C_F.oranje, flexShrink: 0 } }, 'AJ'),
        React.createElement('div', null,
          React.createElement('div', { style: { fontSize: 18, fontWeight: 700, color: C_F.tekstPrimair } }, p.roepnaam || p.naam),
          React.createElement('div', { style: { fontSize: 13, color: C_F.tekstSecundair } }, p.kamer),
          React.createElement('div', { style: { fontSize: 12, color: C_F.tekstMuted } }, p.leeftijd + ' jaar \u00B7 ' + p.geboortedatum)
        )
      )
    ),

    // Laatste rapportages — wat is er gebeurd?
    React.createElement(SectionTitle, null, 'Hoe was het vandaag?'),
    window.dagrapportages.slice(0, 3).map(function(r, i) {
      return React.createElement(Card, { key: i, style: { padding: 12, borderLeft: '3px solid ' + (r.isFamilie ? C_F.groen : C_F.oranje) } },
        React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', marginBottom: 4 } },
          React.createElement('span', { style: { fontSize: 13, fontWeight: 600, color: r.isFamilie ? C_F.groen : C_F.oranje } }, r.isFamilie ? 'Uw bezoekverslag' : r.auteur),
          React.createElement('span', { style: { fontSize: 11, color: C_F.tekstMuted } }, r.datum)
        ),
        React.createElement('div', { style: { fontSize: 14, color: C_F.tekstPrimair, lineHeight: 1.6 } }, r.tekst)
      );
    }),

    // Re-ablement voortgang
    React.createElement(SectionTitle, null, 'Re-ablement traject'),
    React.createElement(Card, null,
      React.createElement('div', { style: { fontSize: 15, fontWeight: 600, color: C_F.tekstPrimair, marginBottom: 4 } }, p.reablement.fase),
      React.createElement('div', { style: { fontSize: 13, color: C_F.tekstSecundair, marginBottom: 2 } }, 'Co\u00F6rdinator: ' + p.reablement.coordinatorNaam),
      React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', marginBottom: 4, marginTop: 8 } },
        React.createElement('span', { style: { fontSize: 12, color: C_F.tekstMuted } }, 'Voortgang'),
        React.createElement('span', { style: { fontSize: 12, fontWeight: 700, color: C_F.oranje } }, p.reablement.voortgang + '%')
      ),
      React.createElement(ProgressBar, { percentage: p.reablement.voortgang }),
      React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', marginTop: 8 } },
        React.createElement('span', { style: { fontSize: 11, color: C_F.tekstMuted } }, 'Start: ' + p.reablement.startdatum),
        React.createElement('span', { style: { fontSize: 11, color: C_F.tekstMuted } }, 'Doel: ' + p.reablement.einddatum)
      ),
      React.createElement('div', { style: { fontSize: 13, color: C_F.groen, fontWeight: 500, marginTop: 8, fontStyle: 'italic' } }, 'Doel: zelfstandiger thuis \u2014 u speelt hierin een actieve rol')
    ),

    // Behandelplan — begrijpelijke versie
    React.createElement(SectionTitle, null, 'Behandelplan'),
    React.createElement('div', { style: { fontSize: 12, color: C_F.tekstMuted, marginBottom: 8 } }, 'Tik op een onderdeel voor toelichting'),
    p.behandelplan.map(function(item, i) {
      var actueel = item.status === 'Actueel';
      var isOpen = toonDetails === i;
      return React.createElement(Card, { key: i, style: { cursor: 'pointer', padding: 12 }, onClick: function() { setToonDetails(isOpen ? null : i); } },
        React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' } },
          React.createElement('div', null,
            React.createElement('span', { style: { fontSize: 14, fontWeight: 600, color: C_F.tekstPrimair } }, item.onderdeel),
            React.createElement('div', { style: { fontSize: 11, color: C_F.tekstMuted } }, 'Bijgewerkt: ' + item.bijgewerkt)
          ),
          React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 8 } },
            React.createElement(Badge, { label: actueel ? 'Op orde' : 'Aandacht', color: actueel ? C_F.groen : C_F.oranje, bgColor: actueel ? C_F.groenLicht : C_F.oranjeLicht }),
            React.createElement('span', { style: { fontSize: 12, color: C_F.tekstMuted, transition: 'transform 0.2s', transform: isOpen ? 'rotate(90deg)' : 'none' } }, '\u25B6')
          )
        ),
        isOpen && React.createElement('div', { style: { marginTop: 10, padding: 10, background: C_F.achtergrond, borderRadius: 8, fontSize: 13, color: C_F.tekstSecundair, lineHeight: 1.6, animation: 'fadeIn 0.2s ease' } },
          item.toelichting || 'Geen toelichting beschikbaar.'
        )
      );
    }),

    // Open consult — read only
    p.openConsulten.length > 0 && React.createElement('div', null,
      React.createElement(SectionTitle, null, 'Lopende meldingen'),
      p.openConsulten.map(function(c) {
        var isU1 = c.urgentie.includes('U1');
        var isU2 = c.urgentie.includes('U2');
        return React.createElement(Card, { key: c.id, style: { borderLeft: '3px solid ' + (isU1 ? C_F.rood : isU2 ? C_F.oranje : C_F.blauw) } },
          React.createElement('div', { style: { fontSize: 13, color: C_F.tekstSecundair, marginBottom: 4 } }, 'Er is een medische melding gedaan voor uw vader'),
          React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' } },
            React.createElement('span', { style: { fontSize: 14, fontWeight: 600, color: C_F.tekstPrimair } }, 'Status: ' + c.status),
            React.createElement(Badge, { label: c.urgentie, color: isU1 ? C_F.rood : isU2 ? C_F.oranje : C_F.blauw, bgColor: isU1 ? C_F.roodLicht : isU2 ? C_F.oranjeLicht : C_F.blauwLicht })
          ),
          React.createElement('div', { style: { fontSize: 12, color: C_F.tekstMuted, marginTop: 4 } }, 'Ingediend: ' + c.ingediend + ' \u00B7 ' + c.toewijzing)
        );
      })
    ),

    // Zorgen melden (familie versie — eenvoudiger dan NTS)
    React.createElement(SectionTitle, null, 'Zorgen melden'),
    React.createElement(Card, { style: { cursor: 'pointer' }, onClick: function() { addToast('Functie binnenkort beschikbaar'); } },
      React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 12 } },
        React.createElement('div', { style: { width: 40, height: 40, borderRadius: 10, background: C_F.roodLicht, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 } }, '\uD83D\uDCDE'),
        React.createElement('div', null,
          React.createElement('div', { style: { fontSize: 14, fontWeight: 600, color: C_F.tekstPrimair } }, 'Iets is niet in orde'),
          React.createElement('div', { style: { fontSize: 12, color: C_F.tekstSecundair } }, 'Meld uw zorgen aan het zorgteam')
        )
      )
    )
  );
};

// ══════════════════════════════════════════
// WEEKPLAN — wie zorgt wanneer, wanneer kom ik?
// ══════════════════════════════════════════
window.FamilieWeekplan = function FamilieWeekplan({ addToast }) {
  const { useState } = React;
  const [openDag, setOpenDag] = useState(0);
  var planning = window.weekplanning;

  return React.createElement('div', { style: { animation: 'fadeIn 0.3s ease' } },
    React.createElement(SectionTitle, null, 'Weekplanning'),
    React.createElement('div', { style: { fontSize: 13, color: C_F.tekstSecundair, marginBottom: 12 } }, 'Wie zorgt wanneer voor ' + window.patient.roepnaam + '? Plan hier uw bezoeken.'),

    planning.map(function(dag, i) {
      var isOpen = openDag === i;
      var heeftOpenSlot = dag.shifts.some(function(s) { return s.status === 'open' && s.isFamilie; });

      return React.createElement(Card, { key: i, style: { padding: 0, overflow: 'hidden' } },
        // Dag header
        React.createElement('div', {
          onClick: function() { setOpenDag(isOpen ? -1 : i); },
          style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 14px', cursor: 'pointer', background: isOpen ? C_F.achtergrond : 'transparent' }
        },
          React.createElement('div', null,
            React.createElement('span', { style: { fontSize: 15, fontWeight: 600, color: C_F.tekstPrimair } }, dag.dag),
            React.createElement('span', { style: { fontSize: 13, color: C_F.tekstMuted, marginLeft: 8 } }, dag.datum)
          ),
          React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 6 } },
            heeftOpenSlot && React.createElement('span', { style: { fontSize: 10, background: C_F.oranjeLicht, color: C_F.oranje, padding: '2px 6px', borderRadius: 4, fontWeight: 600 } }, 'Open slot'),
            React.createElement('span', { style: { fontSize: 12, color: C_F.tekstMuted, transition: 'transform 0.2s', transform: isOpen ? 'rotate(90deg)' : 'none' } }, '\u25B6')
          )
        ),
        // Shifts
        isOpen && React.createElement('div', { style: { padding: '0 14px 12px', animation: 'fadeIn 0.2s ease' } },
          dag.shifts.map(function(s, j) {
            var kleur = s.isFamilie ? C_F.groen : s.wie.includes('Fysio') || s.wie.includes('Dr.') ? C_F.blauw : C_F.oranje;
            var isOpenSlot = s.status === 'open';
            return React.createElement('div', { key: j, style: {
              display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0',
              borderBottom: j < dag.shifts.length - 1 ? '1px solid ' + C_F.border : 'none',
            } },
              React.createElement('div', { style: { width: 8, height: 8, borderRadius: 4, background: isOpenSlot ? C_F.tekstMuted : kleur, flexShrink: 0 } }),
              React.createElement('div', { style: { flex: 1 } },
                React.createElement('div', { style: { fontSize: 13, fontWeight: 500, color: C_F.tekstPrimair } }, s.periode + ': ' + s.wie),
                React.createElement('div', { style: { fontSize: 12, color: C_F.tekstMuted } }, s.taak)
              ),
              isOpenSlot && s.isFamilie && React.createElement('button', {
                onClick: function(e) { e.stopPropagation(); addToast('Bezoek aangemeld! U ontvangt een bevestiging.', 'success'); },
                style: { background: C_F.groen, color: '#FFF', border: 'none', borderRadius: 6, padding: '6px 10px', fontSize: 11, fontWeight: 600, cursor: 'pointer', flexShrink: 0 }
              }, 'Ik kom'),
              s.status === 'onder voorbehoud' && React.createElement('span', { style: { fontSize: 10, color: C_F.oranje, fontWeight: 500, flexShrink: 0 } }, 'Nog niet zeker')
            );
          })
        )
      );
    }),

    // Hint
    React.createElement('div', { style: { fontSize: 12, color: C_F.tekstMuted, textAlign: 'center', marginTop: 12, fontStyle: 'italic' } },
      'Regelmatig bezoek helpt het re-ablement traject van ' + window.patient.roepnaam
    )
  );
};

// ══════════════════════════════════════════
// BERICHTEN — communicatie met verzorging
// ══════════════════════════════════════════
window.FamilieBerichten = function FamilieBerichten({ addToast }) {
  const { useState } = React;
  const [nieuwBericht, setNieuwBericht] = useState('');

  var berichten = window.berichten;

  return React.createElement('div', { style: { animation: 'fadeIn 0.3s ease' } },
    React.createElement(SectionTitle, null, 'Berichten'),
    React.createElement('div', { style: { fontSize: 13, color: C_F.tekstSecundair, marginBottom: 12 } }, 'Communiceer met het zorgteam van ' + window.patient.roepnaam),

    // Berichten lijst
    berichten.map(function(b) {
      return React.createElement('div', { key: b.id, style: {
        display: 'flex', justifyContent: b.isFamilie ? 'flex-end' : 'flex-start', marginBottom: 8,
      } },
        React.createElement('div', { style: {
          maxWidth: '80%', padding: '10px 14px', borderRadius: 14,
          background: b.isFamilie ? C_F.groen : C_F.kaartWit,
          color: b.isFamilie ? '#FFFFFF' : C_F.tekstPrimair,
          border: b.isFamilie ? 'none' : '1px solid ' + C_F.border,
          borderBottomRightRadius: b.isFamilie ? 4 : 14,
          borderBottomLeftRadius: b.isFamilie ? 14 : 4,
        } },
          React.createElement('div', { style: { fontSize: 11, fontWeight: 600, marginBottom: 2, opacity: 0.8 } }, b.van),
          React.createElement('div', { style: { fontSize: 14, lineHeight: 1.5 } }, b.tekst),
          React.createElement('div', { style: { fontSize: 10, marginTop: 4, opacity: 0.6, textAlign: 'right' } }, b.datum)
        )
      );
    }),

    // Input
    React.createElement('div', { style: { position: 'sticky', bottom: 72, background: C_F.achtergrond, padding: '12px 0' } },
      React.createElement('div', { style: { display: 'flex', gap: 8 } },
        React.createElement('input', {
          value: nieuwBericht,
          onChange: function(e) { setNieuwBericht(e.target.value); },
          placeholder: 'Schrijf een bericht...',
          onKeyDown: function(e) { if (e.key === 'Enter' && nieuwBericht.trim()) { addToast('Bericht verzonden', 'success'); setNieuwBericht(''); } },
          style: { flex: 1, padding: '12px 14px', borderRadius: 24, border: '1px solid ' + C_F.border, fontSize: 14, fontFamily: "'DM Sans', sans-serif", outline: 'none', color: C_F.tekstPrimair }
        }),
        React.createElement('button', {
          onClick: function() { if (nieuwBericht.trim()) { addToast('Bericht verzonden', 'success'); setNieuwBericht(''); } },
          style: { width: 44, height: 44, borderRadius: 22, background: C_F.groen, color: '#FFF', border: 'none', cursor: 'pointer', fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center' }
        }, '\u2191')
      )
    )
  );
};

// ══════════════════════════════════════════
// LEREN — familie
// ══════════════════════════════════════════
window.FamilieLeren = function FamilieLeren({ addToast }) {
  const { useState } = React;
  const [modalModule, setModalModule] = useState(null);
  var modules = window.familieModules;
  var shared = window.gedeeldeModule;

  var statusLabel = function(s) {
    if (s === 'bezig') return { label: 'Bezig', color: C_F.oranje, bg: C_F.oranjeLicht };
    return { label: 'Nog te starten', color: C_F.tekstMuted, bg: C_F.achtergrond };
  };

  return React.createElement('div', { style: { animation: 'fadeIn 0.3s ease' } },
    React.createElement(SectionTitle, null, 'Leren over de zorg voor ' + window.patient.roepnaam),
    React.createElement('div', { style: { fontSize: 13, color: C_F.tekstSecundair, marginBottom: 12, lineHeight: 1.5 } },
      'Deze modules helpen u om ' + window.patient.roepnaam + ' beter te ondersteunen. Kennis over zijn aandoeningen maakt uw bezoeken waardevoller.'
    ),

    // Aanbevolen module
    React.createElement(Card, { style: { border: '2px solid ' + C_F.groen } },
      React.createElement('div', { style: { fontSize: 11, fontWeight: 600, color: C_F.groen, marginBottom: 4 } }, 'AANBEVOLEN'),
      React.createElement('div', { style: { fontSize: 15, fontWeight: 600, color: C_F.tekstPrimair, marginBottom: 4 } }, shared.naam),
      React.createElement('div', { style: { fontSize: 13, color: C_F.tekstSecundair, marginBottom: 8 } }, shared.beschrijving),
      React.createElement('div', { style: { fontSize: 12, color: C_F.tekstMuted, marginBottom: 6 } }, shared.voltooid + ' van ' + shared.totaal + ' onderdelen voltooid'),
      React.createElement(ProgressBar, { percentage: shared.voltooid / shared.totaal * 100, color: C_F.groen }),
      React.createElement('button', { onClick: function() { addToast('E-learning wordt geladen', 'success'); }, style: {
        background: C_F.groen, color: '#FFF', border: 'none', borderRadius: 8, padding: '10px', fontSize: 14, fontWeight: 600, cursor: 'pointer', width: '100%', marginTop: 10,
      } }, 'Ga verder')
    ),

    React.createElement('div', { style: { fontSize: 14, fontWeight: 600, color: C_F.tekstSecundair, margin: '16px 0 8px' } }, 'Alle modules'),

    modules.map(function(m, i) {
      var st = statusLabel(m.status);
      return React.createElement(Card, { key: i, style: { cursor: 'pointer' }, onClick: function() { setModalModule(m); } },
        React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: m.status === 'bezig' ? 6 : 0 } },
          React.createElement('span', { style: { fontSize: 14, fontWeight: 600, color: C_F.tekstPrimair, flex: 1, marginRight: 8 } }, m.naam),
          React.createElement(Badge, { label: st.label, color: st.color, bgColor: st.bg })
        ),
        m.status === 'bezig' && React.createElement(ProgressBar, { percentage: m.voortgang, color: C_F.groen })
      );
    }),

    React.createElement('div', { style: { fontSize: 12, color: C_F.tekstMuted, textAlign: 'center', marginTop: 16, fontStyle: 'italic', lineHeight: 1.5 } },
      'Deze modules zijn speciaal samengesteld voor familie van ' + window.patient.naam + '. Uw betrokkenheid maakt verschil.'
    ),

    // Modal
    modalModule && React.createElement(Modal, { title: modalModule.naam, onClose: function() { setModalModule(null); } },
      React.createElement('p', { style: { fontSize: 14, color: C_F.tekstSecundair, lineHeight: 1.6, marginBottom: 12 } }, modalModule.beschrijving),
      modalModule.status === 'bezig' && React.createElement('div', { style: { marginBottom: 12 } },
        React.createElement('div', { style: { fontSize: 12, color: C_F.tekstMuted, marginBottom: 4 } }, 'Voortgang: ' + modalModule.voortgang + '%'),
        React.createElement(ProgressBar, { percentage: modalModule.voortgang, color: C_F.groen })
      ),
      React.createElement('button', { onClick: function() { addToast('E-learning wordt geladen', 'success'); setModalModule(null); }, style: {
        background: C_F.groen, color: '#FFF', border: 'none', borderRadius: 8, padding: '10px 20px', fontSize: 14, fontWeight: 600, cursor: 'pointer', width: '100%',
      } }, modalModule.status === 'niet_gestart' ? 'Start module' : 'Ga verder')
    )
  );
};
