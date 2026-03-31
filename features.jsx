// GeriCall — Extra features (punten 5-16)
var C_X = window.COLORS;

// ══════════════════════════════════════════
// 5. ONBOARDING — walkthrough bij eerste gebruik
// ══════════════════════════════════════════
window.Onboarding = function Onboarding({ rol, onSluit }) {
  var { useState } = React;
  var [stap, setStap] = useState(0);

  var stappen = rol === 'zorg' ? [
    { titel: 'Welkom bij GeriCall', tekst: 'Het CareTaker Portal helpt u bij de dagelijkse zorg. Hier vindt u taken, rapportages en meldingen voor al uw bewoners.', icoon: '\uD83D\uDC4B' },
    { titel: 'Uw wijk', tekst: 'Op het eerste scherm ziet u al uw bewoners. Het stoplicht toont wie aandacht nodig heeft. Tik op een bewoner voor details.', icoon: '\u2705' },
    { titel: 'Overdracht', tekst: 'Aan het einde van uw dienst kunt u aandachtspunten doorgeven aan de volgende collega via het overdrachtsscherm.', icoon: '\uD83D\uDD04' },
    { titel: 'Meldingen', tekst: 'Het belletje rechtsboven toont nieuwe berichten en waarschuwingen. Een rood bolletje betekent dat er actie nodig is.', icoon: '\uD83D\uDD14' },
  ] : [
    { titel: 'Welkom bij GeriCall', tekst: 'Met het CareTaker Portal blijft u betrokken bij de zorg voor uw naaste. U kunt de voortgang volgen en samenwerken met het zorgteam.', icoon: '\uD83D\uDC4B' },
    { titel: 'Stemming', tekst: 'De gekleurde bolletjes bovenaan geven aan hoe het gaat. U kunt zelf ook aangeven hoe u vindt dat het gaat.', icoon: '\u25CF' },
    { titel: 'Planning', tekst: 'Zie wie er wanneer langskomt en meld uzelf aan voor bezoek. Hoe vaker u komt, hoe beter het herstel.', icoon: '\uD83D\uDCC5' },
    { titel: 'Chat', tekst: 'Overleg met andere familieleden en het zorgteam via de chatfunctie.', icoon: '\uD83D\uDCAC' },
  ];

  var s = stappen[stap];
  var isLaatste = stap === stappen.length - 1;

  return React.createElement('div', { style: {
    position: 'fixed', inset: 0, background: 'rgba(45,45,45,0.6)', zIndex: 1000,
    display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16,
  } },
    React.createElement('div', { style: {
      background: C_X.kaartWit, borderRadius: 20, padding: '32px 24px', maxWidth: 360, width: '100%',
      textAlign: 'center', animation: 'scaleIn 0.3s ease',
    } },
      React.createElement('div', { style: { fontSize: 48, marginBottom: 16 } }, s.icoon),
      React.createElement('div', { style: { fontSize: 18, fontWeight: 700, color: C_X.tekstPrimair, marginBottom: 8 } }, s.titel),
      React.createElement('div', { style: { fontSize: 14, color: C_X.tekstSecundair, lineHeight: 1.6, marginBottom: 24 } }, s.tekst),
      // Stap indicatoren
      React.createElement('div', { style: { display: 'flex', justifyContent: 'center', gap: 6, marginBottom: 20 } },
        stappen.map(function(_, i) {
          return React.createElement('div', { key: i, style: { width: i === stap ? 20 : 8, height: 8, borderRadius: 4, background: i === stap ? C_X.oranje : C_X.border, transition: 'all 0.2s' } });
        })
      ),
      // Knoppen
      React.createElement('div', { style: { display: 'flex', gap: 8 } },
        stap > 0 && React.createElement('button', { onClick: function() { setStap(stap - 1); }, style: {
          flex: 1, padding: '12px', borderRadius: 10, border: '1px solid ' + C_X.border,
          background: C_X.kaartWit, fontSize: 14, color: C_X.tekstSecundair, cursor: 'pointer',
        } }, 'Vorige'),
        React.createElement('button', { onClick: function() { if (isLaatste) onSluit(); else setStap(stap + 1); }, style: {
          flex: 2, padding: '12px', borderRadius: 10, border: 'none',
          background: C_X.oranje, fontSize: 14, fontWeight: 600, color: '#FFF', cursor: 'pointer',
        } }, isLaatste ? 'Aan de slag!' : 'Volgende')
      ),
      // Overslaan
      !isLaatste && React.createElement('button', { onClick: onSluit, style: {
        background: 'none', border: 'none', fontSize: 12, color: C_X.tekstMuted, cursor: 'pointer', marginTop: 12,
      } }, 'Overslaan')
    )
  );
};

// ══════════════════════════════════════════
// 10. OFFLINE INDICATOR
// ══════════════════════════════════════════
window.OfflineIndicator = function OfflineIndicator() {
  var { useState, useEffect } = React;
  var [offline, setOffline] = useState(!navigator.onLine);

  useEffect(function() {
    var goOffline = function() { setOffline(true); };
    var goOnline = function() { setOffline(false); };
    window.addEventListener('offline', goOffline);
    window.addEventListener('online', goOnline);
    return function() { window.removeEventListener('offline', goOffline); window.removeEventListener('online', goOnline); };
  }, []);

  if (!offline) return null;
  return React.createElement('div', { style: {
    position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1100,
    background: C_X.rood, color: '#FFF', textAlign: 'center',
    padding: '6px 12px', fontSize: 13, fontWeight: 500,
  } }, 'Geen internetverbinding \u2014 wijzigingen worden opgeslagen zodra u weer online bent');
};

// ══════════════════════════════════════════
// 8. INSTELLINGEN
// ══════════════════════════════════════════
window.InstellingenModal = function InstellingenModal({ onSluit, addToast }) {
  var { useState } = React;
  var [fontSize, setFontSize] = useState(100);
  var [hoogContrast, setHoogContrast] = useState(false);
  var [darkMode, setDarkMode] = useState(false);
  var [taal, setTaal] = useState('nl');

  var pasAan = function() {
    document.documentElement.style.fontSize = fontSize + '%';
    if (hoogContrast) {
      document.body.style.filter = 'contrast(1.4)';
    } else {
      document.body.style.filter = 'none';
    }
    if (darkMode) {
      document.body.style.background = '#1a1a1a';
      document.body.style.color = '#e0e0e0';
    } else {
      document.body.style.background = '#F7F7F7';
      document.body.style.color = '#2D2D2D';
    }
  };

  return React.createElement(Modal, { title: 'Instellingen', onClose: onSluit },
    // Font grootte
    React.createElement('div', { style: { marginBottom: 16 } },
      React.createElement('div', { style: { fontSize: 13, fontWeight: 600, color: C_X.tekstSecundair, marginBottom: 6 } }, 'Tekstgrootte'),
      React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 10 } },
        React.createElement('span', { style: { fontSize: 12, color: C_X.tekstMuted } }, 'A'),
        React.createElement('input', { type: 'range', min: 80, max: 140, value: fontSize, onChange: function(e) { setFontSize(parseInt(e.target.value)); pasAan(); }, style: { flex: 1, accentColor: C_X.oranje } }),
        React.createElement('span', { style: { fontSize: 18, color: C_X.tekstMuted } }, 'A'),
        React.createElement('span', { style: { fontSize: 12, color: C_X.tekstMuted, minWidth: 35 } }, fontSize + '%')
      )
    ),
    // Hoog contrast
    React.createElement('label', { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderTop: '1px solid ' + C_X.border, cursor: 'pointer' } },
      React.createElement('span', { style: { fontSize: 14, color: C_X.tekstPrimair } }, 'Hoog contrast'),
      React.createElement('input', { type: 'checkbox', checked: hoogContrast, onChange: function() { setHoogContrast(!hoogContrast); setTimeout(pasAan, 10); }, style: { accentColor: C_X.oranje, width: 18, height: 18 } })
    ),
    // Dark mode
    React.createElement('label', { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderTop: '1px solid ' + C_X.border, cursor: 'pointer' } },
      React.createElement('span', { style: { fontSize: 14, color: C_X.tekstPrimair } }, 'Nachtmodus (dark mode)'),
      React.createElement('input', { type: 'checkbox', checked: darkMode, onChange: function() { setDarkMode(!darkMode); setTimeout(pasAan, 10); }, style: { accentColor: C_X.oranje, width: 18, height: 18 } })
    ),
    // Reset
    React.createElement('button', { onClick: function() {
      setFontSize(100); setHoogContrast(false); setDarkMode(false);
      document.documentElement.style.fontSize = '100%';
      document.body.style.filter = 'none';
      document.body.style.background = '#F7F7F7';
      document.body.style.color = '#2D2D2D';
      addToast('Instellingen gereset', 'success');
    }, style: {
      background: 'none', border: '1px solid ' + C_X.border, borderRadius: 8, padding: '8px', fontSize: 13,
      color: C_X.tekstSecundair, cursor: 'pointer', width: '100%', marginTop: 12,
    } }, 'Herstel standaard')
  );
};

// ══════════════════════════════════════════
// 12. SPRAAKNOTITIE (mock)
// ══════════════════════════════════════════
window.SpraakNotitie = function SpraakNotitie({ onResult, addToast }) {
  var { useState } = React;
  var [opnemen, setOpnemen] = useState(false);
  var [seconden, setSeconden] = useState(0);

  React.useEffect(function() {
    if (!opnemen) return;
    var interval = setInterval(function() { setSeconden(function(s) { return s + 1; }); }, 1000);
    return function() { clearInterval(interval); };
  }, [opnemen]);

  if (opnemen) {
    return React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 10, padding: '10px', background: C_X.roodLicht, borderRadius: 8, marginBottom: 8 } },
      React.createElement('div', { style: { width: 12, height: 12, borderRadius: 6, background: C_X.rood, animation: 'scaleIn 1s ease infinite alternate' } }),
      React.createElement('span', { style: { fontSize: 14, color: C_X.rood, fontWeight: 500, flex: 1 } }, 'Opnemen... ' + seconden + 's'),
      React.createElement('button', { onClick: function() {
        setOpnemen(false);
        setSeconden(0);
        if (onResult) onResult('[Spraaknotitie: ' + seconden + ' sec]');
        addToast('Spraaknotitie opgeslagen', 'success');
      }, style: { background: C_X.rood, color: '#FFF', border: 'none', borderRadius: 6, padding: '6px 12px', fontSize: 12, fontWeight: 600, cursor: 'pointer' } }, 'Stop')
    );
  }

  return React.createElement('button', { onClick: function() { setOpnemen(true); setSeconden(0); }, style: {
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
    padding: '8px 12px', borderRadius: 8, border: '1px dashed ' + C_X.border,
    background: C_X.kaartWit, fontSize: 12, color: C_X.tekstSecundair, cursor: 'pointer', marginBottom: 8,
  } }, '\uD83C\uDF99\uFE0F Spraaknotitie');
};

// ══════════════════════════════════════════
// 13. PRINT/EXPORT
// ══════════════════════════════════════════
window.PrintKnop = function PrintKnop({ label }) {
  return React.createElement('button', { onClick: function() { window.print(); }, style: {
    display: 'flex', alignItems: 'center', gap: 4, background: 'none',
    border: '1px solid ' + C_X.border, borderRadius: 6, padding: '4px 10px',
    fontSize: 11, color: C_X.tekstSecundair, cursor: 'pointer',
  } }, '\uD83D\uDDA8\uFE0F ' + (label || 'Print'));
};

// ══════════════════════════════════════════
// 14. AGENDA INTEGRATIE (mock)
// ══════════════════════════════════════════
window.AgendaKnop = function AgendaKnop({ titel, datum, addToast }) {
  return React.createElement('button', { onClick: function() {
    addToast('Toegevoegd aan agenda', 'success');
  }, style: {
    background: 'none', border: 'none', fontSize: 12, color: C_X.blauw, cursor: 'pointer', padding: '2px 0',
  } }, '\uD83D\uDCC5 Zet in agenda');
};

// ══════════════════════════════════════════
// 15. AVG/PRIVACY NOTICE
// ══════════════════════════════════════════
window.PrivacyNotice = function PrivacyNotice({ onAccepteer }) {
  var { useState } = React;
  var [getoond, setGetoond] = useState(!window._privacyAccepted);

  if (!getoond) return null;
  return React.createElement('div', { style: {
    position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 900,
    background: C_X.kaartWit, borderTop: '1px solid ' + C_X.border,
    padding: '14px 16px', boxShadow: '0 -4px 12px rgba(0,0,0,0.08)',
  } },
    React.createElement('div', { style: { maxWidth: 420, margin: '0 auto' } },
      React.createElement('div', { style: { fontSize: 13, color: C_X.tekstPrimair, fontWeight: 600, marginBottom: 4 } }, 'Privacy & Medische gegevens'),
      React.createElement('div', { style: { fontSize: 12, color: C_X.tekstSecundair, lineHeight: 1.5, marginBottom: 10 } },
        'Dit portaal verwerkt medische gegevens conform de AVG en de Wet op de geneeskundige behandelingsovereenkomst (WGBO). Uw gegevens worden versleuteld opgeslagen en zijn alleen toegankelijk voor geautoriseerde zorgverleners en gemachtigde familieleden.'
      ),
      React.createElement('div', { style: { display: 'flex', gap: 8 } },
        React.createElement('button', { onClick: function() { window._privacyAccepted = true; setGetoond(false); if (onAccepteer) onAccepteer(); }, style: {
          flex: 1, padding: '10px', borderRadius: 8, border: 'none',
          background: C_X.oranje, color: '#FFF', fontSize: 13, fontWeight: 600, cursor: 'pointer',
        } }, 'Akkoord'),
        React.createElement('button', { onClick: function() { setGetoond(false); }, style: {
          padding: '10px 16px', borderRadius: 8, border: '1px solid ' + C_X.border,
          background: C_X.kaartWit, color: C_X.tekstSecundair, fontSize: 13, cursor: 'pointer',
        } }, 'Meer info')
      )
    )
  );
};

// ══════════════════════════════════════════
// 16. AUDIT TRAIL
// ══════════════════════════════════════════
window.auditLog = [];
window.logAudit = function(gebruiker, actie, detail) {
  window.auditLog.unshift({
    tijd: new Date().toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    datum: new Date().toLocaleDateString('nl-NL'),
    gebruiker: gebruiker,
    actie: actie,
    detail: detail || '',
  });
};

window.AuditTrailViewer = function AuditTrailViewer({ onSluit }) {
  var log = window.auditLog;
  return React.createElement(Modal, { title: 'Audit trail', onClose: onSluit },
    log.length === 0 && React.createElement('div', { style: { fontSize: 13, color: C_X.tekstMuted, textAlign: 'center', padding: '20px 0' } }, 'Geen activiteit gelogd in deze sessie'),
    React.createElement('div', { style: { maxHeight: 300, overflowY: 'auto' } },
      log.map(function(entry, i) {
        return React.createElement('div', { key: i, style: { padding: '6px 0', borderBottom: '1px solid ' + C_X.border, fontSize: 12 } },
          React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between' } },
            React.createElement('span', { style: { fontWeight: 500, color: C_X.tekstPrimair } }, entry.actie),
            React.createElement('span', { style: { color: C_X.tekstMuted } }, entry.tijd)
          ),
          React.createElement('div', { style: { color: C_X.tekstSecundair } }, entry.gebruiker + (entry.detail ? ' \u00B7 ' + entry.detail : ''))
        );
      })
    )
  );
};

// ══════════════════════════════════════════
// 7. APP-BREED ZOEKEN
// ══════════════════════════════════════════
window.AppZoeken = function AppZoeken({ onSluit, addToast }) {
  var { useState } = React;
  var [query, setQuery] = useState('');

  // Doorzoek bewoners, taken, rapportages, medicatie
  var resultaten = [];
  if (query.trim().length >= 2) {
    var q = query.toLowerCase();
    // Bewoners
    window.bewoners.forEach(function(b) {
      if ((b.naam + ' ' + b.roepnaam + ' ' + b.diagnose + ' ' + b.kamer).toLowerCase().indexOf(q) !== -1) {
        resultaten.push({ type: 'Bewoner', tekst: b.roepnaam + ' \u2014 Kamer ' + b.kamer, sub: b.diagnose, link: 'bewoner/' + b.id });
      }
      // Taken
      b.taken.forEach(function(t) {
        if (t.tekst.toLowerCase().indexOf(q) !== -1) {
          resultaten.push({ type: 'Taak', tekst: t.tekst, sub: b.roepnaam + ' \u00B7 ' + t.tijd });
        }
      });
    });
    // Rapportages
    Object.keys(window.dagrapportages).forEach(function(bewId) {
      window.dagrapportages[bewId].forEach(function(r) {
        if ((r.tekst + ' ' + r.auteur).toLowerCase().indexOf(q) !== -1) {
          resultaten.push({ type: 'Rapportage', tekst: r.tekst.substring(0, 60) + '...', sub: r.auteur + ' \u00B7 ' + r.datum });
        }
      });
    });
    // EPD medicatie
    Object.keys(window.epdGegevens || {}).forEach(function(bewId) {
      var epd = window.epdGegevens[bewId];
      epd.medicatie.forEach(function(m) {
        if ((m.naam + ' ' + m.indicatie).toLowerCase().indexOf(q) !== -1) {
          resultaten.push({ type: 'Medicatie', tekst: m.naam + ' \u2014 ' + m.dosering, sub: m.indicatie });
        }
      });
    });
  }

  return React.createElement(Modal, { title: 'Zoeken', onClose: onSluit },
    React.createElement('input', {
      value: query, onChange: function(e) { setQuery(e.target.value); }, autoFocus: true,
      placeholder: 'Zoek bewoner, medicatie, rapportage...',
      style: { width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid ' + C_X.border, fontSize: 14, fontFamily: "'DM Sans', sans-serif", outline: 'none', color: C_X.tekstPrimair, marginBottom: 12 }
    }),
    query.trim().length < 2 && React.createElement('div', { style: { fontSize: 12, color: C_X.tekstMuted, textAlign: 'center' } }, 'Typ minimaal 2 tekens'),
    query.trim().length >= 2 && resultaten.length === 0 && React.createElement('div', { style: { fontSize: 13, color: C_X.tekstMuted, textAlign: 'center', padding: '16px 0' } }, 'Geen resultaten voor "' + query + '"'),
    React.createElement('div', { style: { maxHeight: 300, overflowY: 'auto' } },
      resultaten.slice(0, 15).map(function(r, i) {
        return React.createElement('div', { key: i, onClick: function() { addToast('Navigeren naar: ' + r.tekst.substring(0, 30)); onSluit(); }, style: {
          padding: '8px 0', borderBottom: '1px solid ' + C_X.border, cursor: 'pointer',
        } },
          React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 8 } },
            React.createElement('span', { style: { fontSize: 10, color: C_X.tekstMuted, background: C_X.achtergrond, padding: '1px 6px', borderRadius: 4, fontWeight: 500 } }, r.type),
            React.createElement('span', { style: { fontSize: 13, color: C_X.tekstPrimair } }, r.tekst)
          ),
          React.createElement('div', { style: { fontSize: 11, color: C_X.tekstMuted, marginTop: 2 } }, r.sub)
        );
      })
    ),
    resultaten.length > 15 && React.createElement('div', { style: { fontSize: 11, color: C_X.tekstMuted, textAlign: 'center', marginTop: 8 } }, '...en ' + (resultaten.length - 15) + ' meer resultaten')
  );
};
