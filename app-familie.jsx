// GeriCall — Familie secties (multi-user)
// Elk familielid logt apart in. Chat + planning = samenwerking.

var C_F = window.COLORS;

// ══════════════════════════════════════════
// OVERZICHT — hoe gaat het met papa/mij?
// ══════════════════════════════════════════
window.FamilieOverzicht = function FamilieOverzicht({ lid, addToast, toegang }) {
  const { useState } = React;
  const [toonDetails, setToonDetails] = useState(null);
  const [openConsult, setOpenConsult] = useState(null);
  var t = toegang || window.familieToegang.lijn1;

  if (openConsult) {
    return React.createElement(ConsultDetail, { consult: openConsult, onTerug: function() { setOpenConsult(null); }, addToast: addToast, readOnly: true });
  }
  const p = window.patient;
  const isPatient = lid.isPatient;

  // Wie is er vandaag?
  var vandaag = window.weekplanning[0]; // maandag als mock
  var familieslots = vandaag ? vandaag.shifts.filter(function(s) { return s.isFamilie && s.status !== 'open'; }) : [];
  var openSlots = window.weekplanning.reduce(function(count, dag) {
    return count + dag.shifts.filter(function(s) { return s.status === 'open' && s.isFamilie; }).length;
  }, 0);

  // Ongelezen berichten
  var aantalBerichten = window.familiechat.length;

  var [, forceUpdate] = useState(0);

  return React.createElement('div', { style: { animation: 'fadeIn 0.3s ease' } },

    // Stemming (compact, geen dubbele titel)
    React.createElement(StemmingWidget, {
      bewonerId: 'jansen',
      gebruikerNaam: lid.roepnaam + (lid.isPatient ? '' : ' (' + lid.relatie.toLowerCase() + ')'),
      gebruikerRol: lid.isPatient ? 'patient' : 'familie',
      onUpdate: function() { forceUpdate(function(n) { return n + 1; }); addToast('Stemming bijgewerkt', 'success'); }
    }),

    // Quick stats voor familie
    !isPatient && React.createElement('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 12 } },
      React.createElement(Card, { style: { padding: 12, textAlign: 'center' } },
        React.createElement('div', { style: { fontSize: 22, fontWeight: 700, color: C_F.oranje } }, openSlots),
        React.createElement('div', { style: { fontSize: 11, color: C_F.tekstMuted } }, 'Open bezoekslots'),
        React.createElement('div', { style: { fontSize: 10, color: C_F.tekstSecundair } }, 'deze week')
      ),
      React.createElement(Card, { style: { padding: 12, textAlign: 'center' } },
        React.createElement('div', { style: { fontSize: 22, fontWeight: 700, color: C_F.groen } }, aantalBerichten),
        React.createElement('div', { style: { fontSize: 11, color: C_F.tekstMuted } }, 'Familieberichten'),
        React.createElement('div', { style: { fontSize: 10, color: C_F.tekstSecundair } }, 'vandaag')
      )
    ),

    // Patiënt card
    !isPatient && React.createElement(Card, null,
      React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 14 } },
        React.createElement('div', { style: { width: 56, height: 56, borderRadius: 28, background: C_F.oranjeLicht, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, fontWeight: 700, color: C_F.oranje, flexShrink: 0 } }, 'AJ'),
        React.createElement('div', null,
          React.createElement('div', { style: { fontSize: 18, fontWeight: 700, color: C_F.tekstPrimair } }, p.roepnaam),
          React.createElement('div', { style: { fontSize: 13, color: C_F.tekstSecundair } }, p.kamer),
          React.createElement('div', { style: { fontSize: 12, color: C_F.tekstMuted } }, p.leeftijd + ' jaar')
        )
      )
    ),

    // Wie is er vandaag?
    React.createElement(SectionTitle, null, isPatient ? 'Wie komt er vandaag?' : 'Vandaag bij ' + p.roepnaam),
    familieslots.length > 0 ? familieslots.map(function(s, i) {
      return React.createElement(Card, { key: i, style: { padding: 12, borderLeft: '3px solid ' + C_F.groen } },
        React.createElement('div', { style: { fontSize: 14, fontWeight: 600, color: C_F.tekstPrimair } }, s.periode + ': ' + s.wie),
        React.createElement('div', { style: { fontSize: 12, color: C_F.tekstSecundair } }, s.taak)
      );
    }) : React.createElement(Card, { style: { padding: 12, borderLeft: '3px solid ' + C_F.oranje } },
      React.createElement('div', { style: { fontSize: 14, color: C_F.tekstSecundair } }, 'Nog geen familiebezoek gepland vandaag'),
      !isPatient && React.createElement('button', {
        onClick: function() { addToast('Bezoek aangemeld!', 'success'); },
        style: { background: C_F.groen, color: '#FFF', border: 'none', borderRadius: 6, padding: '6px 12px', fontSize: 12, fontWeight: 600, cursor: 'pointer', marginTop: 8 }
      }, 'Ik kom vandaag')
    ),

    // Rapportages (alleen lijn1 + patient)
    t.rapportages && React.createElement(SectionTitle, null, isPatient ? 'Wat zeggen ze over mij?' : 'Hoe was het?'),
    t.rapportages &&
    window.dagrapportages.slice(0, 3).map(function(r, i) {
      return React.createElement(Card, { key: i, style: { padding: 12, borderLeft: '3px solid ' + (r.isFamilie ? C_F.groen : C_F.oranje) } },
        React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', marginBottom: 4 } },
          React.createElement('span', { style: { fontSize: 13, fontWeight: 600, color: r.isFamilie ? C_F.groen : C_F.oranje } }, r.isFamilie ? 'Familiebezoek' : r.auteur),
          React.createElement('span', { style: { fontSize: 11, color: C_F.tekstMuted } }, r.datum)
        ),
        React.createElement('div', { style: { fontSize: 14, color: C_F.tekstPrimair, lineHeight: 1.6 } }, r.tekst)
      );
    }),

    // Re-ablement
    t.reablement && !isPatient && React.createElement('div', null,
      React.createElement(SectionTitle, null, 'Re-ablement traject'),
      React.createElement(Card, null,
        React.createElement('div', { style: { fontSize: 15, fontWeight: 600, color: C_F.tekstPrimair, marginBottom: 4 } }, p.reablement.fase),
        React.createElement('div', { style: { fontSize: 13, color: C_F.tekstSecundair, marginBottom: 8 } }, 'Co\u00F6rdinator: ' + p.reablement.coordinatorNaam),
        React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', marginBottom: 4 } },
          React.createElement('span', { style: { fontSize: 12, color: C_F.tekstMuted } }, 'Voortgang'),
          React.createElement('span', { style: { fontSize: 12, fontWeight: 700, color: C_F.oranje } }, p.reablement.voortgang + '%')
        ),
        React.createElement(ProgressBar, { percentage: p.reablement.voortgang }),
        React.createElement('div', { style: { fontSize: 13, color: C_F.groen, fontWeight: 500, marginTop: 8, fontStyle: 'italic' } },
          'Uw betrokkenheid is cruciaal \u2014 regelmatig bezoek en oefening helpen ' + p.roepnaam + ' vooruit')
      )
    ),

    // Behandelplan
    t.behandelplan && !isPatient && React.createElement('div', null,
      React.createElement(SectionTitle, null, 'Behandelplan'),
      React.createElement('div', { style: { fontSize: 12, color: C_F.tekstMuted, marginBottom: 8 } }, 'Tik voor toelichting'),
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
            item.toelichting || 'Geen toelichting beschikbaar.')
        );
      })
    ),

    // Open consult
    t.consulten && p.openConsulten.length > 0 && React.createElement('div', null,
      React.createElement(SectionTitle, null, isPatient ? 'Lopende melding' : 'Lopende meldingen'),
      p.openConsulten.map(function(c) {
        var isU2 = c.urgentie.includes('U2');
        return React.createElement(Card, { key: c.id, style: { borderLeft: '3px solid ' + (isU2 ? C_F.oranje : C_F.blauw), cursor: 'pointer' }, onClick: function() { setOpenConsult(c); } },
          React.createElement('div', { style: { fontSize: 13, color: C_F.tekstSecundair, marginBottom: 4 } },
            isPatient ? 'Er is een melding gedaan' : 'Er is een medische melding gedaan voor ' + p.roepnaam),
          React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' } },
            React.createElement('span', { style: { fontSize: 14, fontWeight: 600, color: C_F.tekstPrimair } }, 'Status: ' + c.status),
            React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 6 } },
              React.createElement(Badge, { label: c.urgentie, color: isU2 ? C_F.oranje : C_F.blauw, bgColor: isU2 ? C_F.oranjeLicht : C_F.blauwLicht }),
              React.createElement('span', { style: { fontSize: 12, color: C_F.tekstMuted } }, '\u25B6')
            )
          ),
          React.createElement('div', { style: { fontSize: 11, color: C_F.tekstMuted, marginTop: 4 } }, c.ingediend + ' \u00B7 ' + (c.arts || c.toewijzing))
        );
      })
    )
  );
};

// ══════════════════════════════════════════
// WEEKPLAN — wie zorgt wanneer, claim slots
// ══════════════════════════════════════════
window.FamilieWeekplan = function FamilieWeekplan({ lid, addToast }) {
  const { useState } = React;
  const [openDag, setOpenDag] = useState(0);
  const [planning, setPlanning] = useState(window.weekplanning);
  const isPatient = lid.isPatient;

  var claimSlot = function(dagIdx, shiftIdx) {
    var nieuw = planning.map(function(dag, di) {
      if (di !== dagIdx) return dag;
      return Object.assign({}, dag, {
        shifts: dag.shifts.map(function(s, si) {
          if (si !== shiftIdx) return s;
          return Object.assign({}, s, { wie: lid.roepnaam + (lid.isPatient ? '' : ' (' + lid.relatie.toLowerCase() + ')'), status: 'bevestigd' });
        })
      });
    });
    setPlanning(nieuw);
    addToast(lid.roepnaam + ' ingepland!', 'success');
  };

  // Familie overzicht: wie doet wat deze week?
  var familieStats = {};
  planning.forEach(function(dag) {
    dag.shifts.forEach(function(s) {
      if (s.isFamilie && s.status !== 'open') {
        var naam = s.wie.split(' (')[0].split(' +')[0].trim();
        familieStats[naam] = (familieStats[naam] || 0) + 1;
      }
    });
  });

  return React.createElement('div', { style: { animation: 'fadeIn 0.3s ease' } },
    React.createElement(SectionTitle, null, isPatient ? 'Wie komt er deze week?' : 'Weekplanning'),

    // Familie verdeling
    !isPatient && Object.keys(familieStats).length > 0 && React.createElement(Card, { style: { padding: 12 } },
      React.createElement('div', { style: { fontSize: 13, fontWeight: 600, color: C_F.tekstSecundair, marginBottom: 8 } }, 'Verdeling deze week'),
      Object.entries(familieStats).map(function(entry) {
        var matchLid = window.familieleden.find(function(f) { return entry[0].includes(f.roepnaam); });
        var kleur = matchLid ? matchLid.kleur : C_F.tekstMuted;
        return React.createElement('div', { key: entry[0], style: { display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 } },
          React.createElement('div', { style: { width: 8, height: 8, borderRadius: 4, background: kleur } }),
          React.createElement('span', { style: { fontSize: 13, color: C_F.tekstPrimair, flex: 1 } }, entry[0]),
          React.createElement('span', { style: { fontSize: 13, fontWeight: 600, color: kleur } }, entry[1] + 'x')
        );
      })
    ),

    // Dagen
    planning.map(function(dag, i) {
      var isOpen = openDag === i;
      var heeftOpenSlot = dag.shifts.some(function(s) { return s.status === 'open' && s.isFamilie; });

      return React.createElement(Card, { key: i, style: { padding: 0, overflow: 'hidden' } },
        React.createElement('div', {
          onClick: function() { setOpenDag(isOpen ? -1 : i); },
          style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 14px', cursor: 'pointer', background: isOpen ? C_F.achtergrond : 'transparent' }
        },
          React.createElement('div', null,
            React.createElement('span', { style: { fontSize: 15, fontWeight: 600, color: C_F.tekstPrimair } }, dag.dag),
            React.createElement('span', { style: { fontSize: 13, color: C_F.tekstMuted, marginLeft: 8 } }, dag.datum)
          ),
          React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 6 } },
            heeftOpenSlot && React.createElement('span', { style: { fontSize: 10, background: C_F.oranjeLicht, color: C_F.oranje, padding: '2px 6px', borderRadius: 4, fontWeight: 600 } }, 'Help nodig'),
            React.createElement('span', { style: { fontSize: 12, color: C_F.tekstMuted, transition: 'transform 0.2s', transform: isOpen ? 'rotate(90deg)' : 'none' } }, '\u25B6')
          )
        ),
        isOpen && React.createElement('div', { style: { padding: '0 14px 12px', animation: 'fadeIn 0.2s ease' } },
          dag.shifts.map(function(s, j) {
            var isOpenSlot = s.status === 'open' && s.isFamilie;
            var isMijn = s.wie && s.wie.includes(lid.roepnaam);
            var matchLid = window.familieleden.find(function(f) { return s.wie && s.wie.includes(f.roepnaam); });
            var kleur = isMijn ? lid.kleur : matchLid ? matchLid.kleur : s.isFamilie ? C_F.groen : s.wie && (s.wie.includes('Fysio') || s.wie.includes('Dr.')) ? C_F.blauw : C_F.oranje;

            return React.createElement('div', { key: j, style: {
              display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0',
              borderBottom: j < dag.shifts.length - 1 ? '1px solid ' + C_F.border : 'none',
              background: isMijn ? kleur + '10' : 'transparent', borderRadius: isMijn ? 6 : 0, padding: isMijn ? '8px 6px' : '8px 0',
            } },
              React.createElement('div', { style: { width: 8, height: 8, borderRadius: 4, background: isOpenSlot ? C_F.tekstMuted : kleur, flexShrink: 0 } }),
              React.createElement('div', { style: { flex: 1 } },
                React.createElement('div', { style: { fontSize: 13, fontWeight: 500, color: C_F.tekstPrimair } },
                  s.periode + ': ' + (isOpenSlot ? 'Niemand ingepland' : s.wie) + (isMijn ? ' (jij)' : '')),
                React.createElement('div', { style: { fontSize: 12, color: C_F.tekstMuted } }, s.taak),
                s.status === 'onder voorbehoud' && React.createElement('span', { style: { fontSize: 10, color: C_F.oranje, fontWeight: 500 } }, 'Nog niet zeker')
              ),
              isOpenSlot && !isPatient && React.createElement('button', {
                onClick: function(e) { e.stopPropagation(); claimSlot(i, j); },
                style: { background: C_F.groen, color: '#FFF', border: 'none', borderRadius: 6, padding: '6px 10px', fontSize: 11, fontWeight: 600, cursor: 'pointer', flexShrink: 0 }
              }, 'Ik kom')
            );
          })
        )
      );
    }),

    React.createElement('div', { style: { fontSize: 12, color: C_F.tekstMuted, textAlign: 'center', marginTop: 12, fontStyle: 'italic', lineHeight: 1.5 } },
      isPatient ? 'Uw familie plant bezoeken via deze app' : 'Regelmatig bezoek helpt het re-ablement traject van ' + window.patient.roepnaam)
  );
};

// ══════════════════════════════════════════
// FAMILIECHAT — onderling overleggen
// ══════════════════════════════════════════
window.FamilieBerichten = function FamilieBerichten({ lid, addToast }) {
  const { useState, useEffect, useRef } = React;
  const [berichten, setBerichten] = useState(window.familiechat);
  const [nieuw, setNieuw] = useState('');
  const isPatient = lid.isPatient;
  const endRef = useRef(null);

  useEffect(function() {
    if (endRef.current) endRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [berichten]);

  var verstuur = function() {
    if (!nieuw.trim()) return;
    var bericht = { id: Date.now(), van: lid.id, datum: 'Nu', tekst: nieuw, context: null };
    setBerichten(function(prev) { return prev.concat([bericht]); });
    setNieuw('');
    addToast('Bericht verzonden', 'success');
  };

  var getLid = function(vanId) {
    return window.familieleden.find(function(f) { return f.id === vanId; }) || { roepnaam: vanId, initialen: '?', kleur: C_F.tekstMuted };
  };

  // Online indicatie
  var onlineLeden = window.familieleden.filter(function(f) { return !f.isPatient; });

  return React.createElement('div', { style: { animation: 'fadeIn 0.3s ease' } },
    React.createElement(SectionTitle, null, isPatient ? 'Familie' : 'Familie chat'),

    // Online leden strip
    React.createElement('div', { style: { display: 'flex', gap: 8, marginBottom: 12, overflowX: 'auto', padding: '4px 0' } },
      onlineLeden.map(function(f) {
        var isJij = f.id === lid.id;
        return React.createElement('div', { key: f.id, style: { display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 56 } },
          React.createElement('div', { style: {
            width: 40, height: 40, borderRadius: 20, background: f.kleur + '22',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 14, fontWeight: 700, color: f.kleur,
            border: isJij ? '2px solid ' + f.kleur : '2px solid transparent',
          } }, f.initialen),
          React.createElement('span', { style: { fontSize: 10, color: isJij ? f.kleur : C_F.tekstMuted, fontWeight: isJij ? 600 : 400, marginTop: 2 } }, isJij ? 'Jij' : f.roepnaam)
        );
      })
    ),

    // Berichten
    React.createElement('div', { style: { marginBottom: 8 } },
      berichten.map(function(b) {
        var afzender = getLid(b.van);
        var isVanMij = b.van === lid.id;

        // Context badge
        var contextBadge = null;
        if (b.context && b.context.startsWith('planning:')) {
          var dag = b.context.split(':')[1];
          contextBadge = React.createElement('div', { style: { fontSize: 10, color: C_F.blauw, background: C_F.blauwLicht, padding: '2px 6px', borderRadius: 4, display: 'inline-block', marginBottom: 4 } }, '\uD83D\uDCC5 ' + dag);
        } else if (b.context === 'leren') {
          contextBadge = React.createElement('div', { style: { fontSize: 10, color: C_F.oranje, background: C_F.oranjeLicht, padding: '2px 6px', borderRadius: 4, display: 'inline-block', marginBottom: 4 } }, '\uD83D\uDCDA E-learning');
        }

        return React.createElement('div', { key: b.id, style: {
          display: 'flex', flexDirection: 'column',
          alignItems: isVanMij ? 'flex-end' : 'flex-start', marginBottom: 8,
        } },
          // Naam + avatar (alleen voor anderen)
          !isVanMij && React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 } },
            React.createElement('div', { style: { width: 20, height: 20, borderRadius: 10, background: afzender.kleur + '22', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 700, color: afzender.kleur } }, afzender.initialen),
            React.createElement('span', { style: { fontSize: 11, fontWeight: 600, color: afzender.kleur } }, afzender.roepnaam)
          ),
          contextBadge,
          React.createElement('div', { style: {
            maxWidth: '80%', padding: '10px 14px', borderRadius: 14,
            background: isVanMij ? lid.kleur : C_F.kaartWit,
            color: isVanMij ? '#FFFFFF' : C_F.tekstPrimair,
            border: isVanMij ? 'none' : '1px solid ' + C_F.border,
            borderBottomRightRadius: isVanMij ? 4 : 14,
            borderBottomLeftRadius: isVanMij ? 14 : 4,
          } },
            React.createElement('div', { style: { fontSize: 14, lineHeight: 1.5 } }, b.tekst),
            React.createElement('div', { style: { fontSize: 10, marginTop: 4, opacity: 0.6, textAlign: 'right' } }, b.datum)
          )
        );
      }),
      React.createElement('div', { ref: endRef })
    ),

    // Input
    React.createElement('div', { style: { position: 'sticky', bottom: 72, background: C_F.achtergrond, padding: '12px 0' } },
      React.createElement('div', { style: { display: 'flex', gap: 8 } },
        React.createElement('input', {
          value: nieuw,
          onChange: function(e) { setNieuw(e.target.value); },
          placeholder: isPatient ? 'Schrijf naar familie...' : 'Bericht aan familie...',
          onKeyDown: function(e) { if (e.key === 'Enter') verstuur(); },
          style: { flex: 1, padding: '12px 14px', borderRadius: 24, border: '1px solid ' + C_F.border, fontSize: 14, fontFamily: "'DM Sans', sans-serif", outline: 'none', color: C_F.tekstPrimair }
        }),
        React.createElement('button', {
          onClick: verstuur,
          style: { width: 44, height: 44, borderRadius: 22, background: lid.kleur, color: '#FFF', border: 'none', cursor: 'pointer', fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center' }
        }, '\u2191')
      )
    )
  );
};

// ══════════════════════════════════════════
// LEREN — familie (gebruikt gedeeld ModuleOverzicht component)
// ══════════════════════════════════════════
window.FamilieLeren = function FamilieLeren({ addToast }) {
  return React.createElement('div', { style: { animation: 'fadeIn 0.3s ease' } },
    React.createElement(SectionTitle, null, 'Leren over de zorg voor ' + window.patient.roepnaam),
    React.createElement('div', { style: { fontSize: 13, color: C_F.tekstSecundair, marginBottom: 12, lineHeight: 1.5 } },
      'Kennis over de aandoeningen van ' + window.patient.roepnaam + ' maakt uw bezoeken waardevoller en helpt het re-ablement traject.'),
    React.createElement(ModuleOverzicht, { modules: window.familieModules, shared: window.gedeeldeModule, addToast: addToast, accentKleur: C_F.groen, rol: 'familie' }),
    React.createElement('div', { style: { fontSize: 12, color: C_F.tekstMuted, textAlign: 'center', marginTop: 16, fontStyle: 'italic' } },
      'Uw betrokkenheid maakt verschil in het herstel van ' + window.patient.roepnaam)
  );
};
