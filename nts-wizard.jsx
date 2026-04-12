// NTS Triage Wizard — 5 stappen
// 1:Klacht 2:ABCD 3:Criteria 4:Urgentie+Controles 5:Advies+Override+Media
var C_N = window.COLORS;

window.NTSWizard = function NTSWizard({ onSluit, addToast, prefillPersona, hashPrefix }) {
  var { useState } = React;
  var prefix = hashPrefix || 'triage';
  var updateHash = function(s) {
    var pk = prefillPersona ? prefillPersona.naam.toLowerCase().replace(/[^a-z]/g,'') : 'new';
    window.location.hash = prefix + '/' + pk + '/' + s;
  };
  var setS = function(s) { setStap(s); updateHash(s); };
  var [stap, setStap] = useState(function() {
    var h = window.location.hash.replace('#','').split('/');
    var l = parseInt(h[h.length-1]); return (l>=1&&l<=5)?l:1;
  });
  var [observatie, setObservatie] = useState(prefillPersona?(window.appTaal==='en'?prefillPersona.observatieEN:prefillPersona.observatie):'');
  var [klacht, setKlacht] = useState(prefillPersona?prefillPersona.klacht:null);
  var [zoekK, setZoekK] = useState('');
  var [abcd, setAbcd] = useState({A:null,B:null,C:null,D:null});
  var [critAnt, setCritAnt] = useState([]);
  var [urgentie, setUrgentie] = useState(null);
  var [override, setOverride] = useState(null);
  var [overrideMot, setOverrideMot] = useState('');
  var [controles, setControles] = useState(
    prefillPersona&&window.ntsPersonaControles&&window.ntsPersonaControles[prefillPersona.naam]
    ?Object.assign({},window.ntsPersonaControles[prefillPersona.naam]):{}
  );
  var [ctrlOpmerking, setCtrlOpmerking] = useState('');
  var [notitie, setNotitie] = useState('');
  var [opgeslagen, setOpgeslagen] = useState(false);

  var klachten = window.ntsKlachtenLijst||[];
  var isEN = window.appTaal==='en';
  var abcdI = Object.values(abcd).some(function(v){return v==='nee';});
  var abcdL = [
    {key:'A',label:'Airway',desc:isEN?'Is the airway clear?':'Is de ademweg vrij?'},
    {key:'B',label:'Breathing',desc:isEN?'Breathing normally?':'Ademt normaal?'},
    {key:'C',label:'Circulation',desc:isEN?'Skin color/temp normal?':'Kleur/temp huid normaal?'},
    {key:'D',label:'Disability',desc:isEN?'Alert and oriented?':'Aanspreekbaar en geori\u00EBnteerd?'},
  ];

  var naABCD = function(){
    if(abcdI){setUrgentie(window.bepaalNTSUrgentie(abcd,[],klacht));setS(4);}
    else{setCritAnt((window.ntsCriteria[klacht]||[]).map(function(){return null;}));setS(3);}
  };

  // Context strip
  var Ctx = function(){
    if(stap<2)return null;
    var sk=klachten.find(function(k){return k.id===klacht;});
    var du=override||urgentie;
    var ui2=du&&window.urgentieInfo[du];
    return React.createElement('div',{style:{display:'flex',flexWrap:'wrap',gap:6,marginBottom:10,padding:'6px 10px',background:'#F7F7F7',borderRadius:8,alignItems:'center'}},
      sk&&React.createElement('div',{style:{display:'flex',alignItems:'center',gap:4}},
        React.createElement('span',{style:{fontSize:14}},sk.icon),
        React.createElement('span',{style:{fontSize:12,fontWeight:600,color:C_N.tekstPrimair}},isEN?sk.labelEN:sk.label)
      ),
      stap>=3&&React.createElement('div',{style:{display:'flex',alignItems:'center',gap:2}},
        ['A','B','C','D'].map(function(l){var v=abcd[l];var c=v==='ja'?'#2D9D78':v==='nee'?'#D94F4F':v==='onbekend'?'#4A7FB5':'#DDD';
          return React.createElement('div',{key:l,style:{width:14,height:14,borderRadius:3,background:c,display:'flex',alignItems:'center',justifyContent:'center',color:'#FFF',fontSize:7,fontWeight:700}},l);
        })
      ),
      stap>=4&&ui2&&React.createElement('span',{style:{fontSize:11,fontWeight:700,color:ui2.kleur,background:ui2.bg,padding:'2px 6px',borderRadius:6}},du)
    );
  };

  // Progress
  var Prog = function(){return React.createElement('div',{style:{display:'flex',gap:4,marginBottom:8}},
    [1,2,3,4,5].map(function(s){return React.createElement('div',{key:s,style:{flex:1,height:4,borderRadius:2,background:s<=stap?'#E8732A':s===3&&abcdI?'#EEE':'#DDD',opacity:s===3&&abcdI?0.3:1}});}));};

  if(opgeslagen){var du=override||urgentie;var ui2=window.urgentieInfo[du];
    return React.createElement('div',{style:{textAlign:'center',padding:'32px 0',animation:'scaleIn 0.4s ease'}},
      React.createElement('div',{style:{width:56,height:56,borderRadius:28,background:'#E8F5F0',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 12px',fontSize:28}},'\u2713'),
      React.createElement('div',{style:{fontSize:18,fontWeight:700,color:'#2D9D78'}},isEN?'Triage report saved':'Triageverslag opgeslagen'),
      React.createElement('div',{style:{fontSize:14,color:'#666',marginTop:4}},ui2?ui2.label:du),
      React.createElement('button',{onClick:onSluit,style:{background:'#E8732A',color:'#FFF',border:'none',borderRadius:12,padding:'13px 24px',fontSize:14,fontWeight:700,cursor:'pointer',marginTop:16}},'OK')
    );
  }

  return React.createElement('div',{style:{animation:'fadeIn 0.3s ease'}},
    React.createElement('button',{onClick:stap===1?onSluit:function(){setS(stap-1);},style:{background:'none',border:'none',fontSize:14,color:'#AAA',cursor:'pointer',marginBottom:8}},'\u2190 '+(stap===1?(isEN?'Cancel':'Annuleren'):(isEN?'Previous':'Vorige'))),
    React.createElement(Prog),
    React.createElement('div',{style:{fontSize:12,color:'#AAA',textAlign:'center',marginBottom:6}},(isEN?'Step':'Stap')+' '+stap+' / 5'),
    React.createElement(Ctx),

    // ═══ STAP 1: INGANGSKLACHT ═══
    stap===1&&React.createElement('div',null,
      React.createElement('div',{style:{fontSize:16,fontWeight:700,color:'#2D2D2D',marginBottom:8}},isEN?'Presenting complaint':'Ingangsklacht'),
      React.createElement('textarea',{value:observatie,onChange:function(e){setObservatie(e.target.value);},placeholder:isEN?'Describe what you observed...':'Beschrijf wat u waarnam...',style:{width:'100%',minHeight:70,padding:10,borderRadius:10,border:'1px solid #EEE',fontSize:14,fontFamily:"'DM Sans',sans-serif",resize:'vertical',outline:'none',color:'#2D2D2D',marginBottom:10}}),
      React.createElement('input',{value:zoekK,onChange:function(e){setZoekK(e.target.value);},placeholder:isEN?'Search...':'Zoek...',style:{width:'100%',padding:'8px 10px',borderRadius:10,border:'1px solid #EEE',fontSize:13,fontFamily:"'DM Sans',sans-serif",outline:'none',color:'#2D2D2D',marginBottom:8}}),
      klachten.filter(function(k){var q=zoekK.toLowerCase();return !q||(isEN?k.labelEN:k.label).toLowerCase().indexOf(q)!==-1;}).map(function(k){
        var sel=klacht===k.id;
        return React.createElement('div',{key:k.id,onClick:function(){setKlacht(k.id);},style:{display:'flex',alignItems:'center',gap:10,padding:'10px 12px',marginBottom:4,borderRadius:10,cursor:'pointer',background:sel?'#FFF3EB':'#FFF',border:sel?'2px solid #E8732A':'0.5px solid #EEE'}},
          React.createElement('span',{style:{fontSize:20}},k.icon),
          React.createElement('div',{style:{flex:1}},React.createElement('div',{style:{fontSize:14,fontWeight:600,color:'#2D2D2D'}},isEN?k.labelEN:k.label),React.createElement('div',{style:{fontSize:11,color:'#AAA'}},isEN?k.descEN:k.desc)),
          sel&&React.createElement('div',{style:{width:18,height:18,borderRadius:9,background:'#E8732A',display:'flex',alignItems:'center',justifyContent:'center',color:'#FFF',fontSize:11}},'\u2713')
        );
      }),
      React.createElement('button',{onClick:function(){if(observatie.trim().length>=3&&klacht)setS(2);},style:{background:observatie.trim().length>=3&&klacht?'#E8732A':'#EEE',color:observatie.trim().length>=3&&klacht?'#FFF':'#AAA',border:'none',borderRadius:12,padding:'13px',fontSize:14,fontWeight:700,cursor:observatie.trim().length>=3&&klacht?'pointer':'not-allowed',width:'100%',marginTop:8}},(isEN?'Next':'Volgende')+' \u2192')
    ),

    // ═══ STAP 2: ABCD ═══
    stap===2&&React.createElement('div',null,
      React.createElement('div',{style:{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:8}},
        React.createElement('div',{style:{fontSize:16,fontWeight:700,color:'#2D2D2D'}},'ABCD-check'),
        React.createElement('button',{onClick:function(){setAbcd({A:'ja',B:'ja',C:'ja',D:'ja'});},style:{background:'#E8F5F0',border:'1px solid #2D9D78',borderRadius:8,padding:'6px 12px',fontSize:12,fontWeight:600,color:'#2D9D78',cursor:'pointer'}},isEN?'All stable':'Alle stabiel')
      ),
      abcdI&&React.createElement('div',{style:{background:'#FCEAEA',border:'1px solid #D94F4F',borderRadius:10,padding:'10px 12px',marginBottom:10,fontSize:13,color:'#D94F4F',fontWeight:600}},isEN?'ABCD instability \u2014 immediate escalation':'ABCD-instabiliteit \u2014 directe escalatie'),
      abcdL.map(function(it){var v=abcd[it.key];
        var bs=function(t){var s=v===t;var c={ja:{bg:'#E8F5F0',b:'#2D9D78',c:'#1E7A5A'},nee:{bg:'#FCEAEA',b:'#D94F4F',c:'#7A1F1F'},onbekend:{bg:'#EBF2F9',b:'#4A7FB5',c:'#1A3F6F'}}[t];
          return{flex:1,padding:'8px',borderRadius:8,fontSize:12,fontWeight:s?600:400,cursor:'pointer',background:s?c.bg:'#FFF',border:s?'2px solid '+c.b:'1px solid #EEE',color:s?c.c:'#666'};};
        return React.createElement('div',{key:it.key,style:{background:'#FFF',borderRadius:10,border:'0.5px solid #EEE',padding:12,marginBottom:6}},
          React.createElement('div',{style:{fontSize:14,fontWeight:600,color:'#2D2D2D',marginBottom:2}},it.key+' \u2014 '+it.label),
          React.createElement('div',{style:{fontSize:11,color:'#AAA',marginBottom:8}},it.desc),
          React.createElement('div',{style:{display:'flex',gap:6}},
            React.createElement('button',{onClick:function(){var n=Object.assign({},abcd);n[it.key]='ja';setAbcd(n);},style:bs('ja')},isEN?'Yes':'Ja'),
            React.createElement('button',{onClick:function(){var n=Object.assign({},abcd);n[it.key]='nee';setAbcd(n);},style:bs('nee')},isEN?'No':'Nee'),
            React.createElement('button',{onClick:function(){var n=Object.assign({},abcd);n[it.key]='onbekend';setAbcd(n);},style:bs('onbekend')},isEN?'Unknown':'Onbekend')
          ));
      }),
      React.createElement('button',{onClick:function(){if(Object.values(abcd).every(function(v){return v!==null;}))naABCD();},style:{background:Object.values(abcd).every(function(v){return v!==null;})?(abcdI?'#D94F4F':'#E8732A'):'#EEE',color:Object.values(abcd).every(function(v){return v!==null;})?'#FFF':'#AAA',border:'none',borderRadius:12,padding:'13px',fontSize:14,fontWeight:700,cursor:Object.values(abcd).every(function(v){return v!==null;})?'pointer':'not-allowed',width:'100%',marginTop:8}},abcdI?(isEN?'Escalate \u2192':'Escaleren \u2192'):(isEN?'Next':'Volgende')+' \u2192')
    ),

    // ═══ STAP 3: CRITERIA ═══
    stap===3&&React.createElement('div',null,
      React.createElement('div',{style:{fontSize:16,fontWeight:700,color:'#2D2D2D',marginBottom:8}},isEN?'Triage criteria':'Triagecriteria'),
      (window.ntsCriteria[klacht]||[]).map(function(c,i){var a=critAnt[i];
        return React.createElement('div',{key:i,style:{background:'#FFF',borderRadius:10,border:'0.5px solid #EEE',padding:12,marginBottom:6}},
          React.createElement('div',{style:{display:'flex',alignItems:'center',gap:6,marginBottom:4}},
            React.createElement('span',{style:{fontSize:13,fontWeight:500,color:'#2D2D2D',flex:1}},c.vraag),
            c.urgUp&&React.createElement('span',{style:{fontSize:10,color:'#E8732A',fontWeight:600}},'\u2191')
          ),
          React.createElement('div',{style:{fontSize:11,color:'#AAA',marginBottom:6}},c.hint),
          React.createElement('div',{style:{display:'flex',gap:6}},
            React.createElement('button',{onClick:function(){var n=critAnt.slice();n[i]=true;setCritAnt(n);},style:{flex:1,padding:'8px',borderRadius:8,fontSize:13,fontWeight:a===true?600:400,background:a===true?'#FFF3EB':'#FFF',border:a===true?'2px solid #E8732A':'1px solid #EEE',color:a===true?'#E8732A':'#666',cursor:'pointer'}},isEN?'Yes':'Ja'),
            React.createElement('button',{onClick:function(){var n=critAnt.slice();n[i]=false;setCritAnt(n);},style:{flex:1,padding:'8px',borderRadius:8,fontSize:13,fontWeight:a===false?600:400,background:a===false?'#EBF2F9':'#FFF',border:a===false?'2px solid #4A7FB5':'1px solid #EEE',color:a===false?'#4A7FB5':'#666',cursor:'pointer'}},isEN?'No':'Nee')
          ));
      }),
      React.createElement('button',{onClick:function(){if(critAnt.every(function(a){return a!==null;})){setUrgentie(window.bepaalNTSUrgentie(abcd,critAnt,klacht));setS(4);}},style:{background:critAnt.every(function(a){return a!==null;})?'#E8732A':'#EEE',color:critAnt.every(function(a){return a!==null;})?'#FFF':'#AAA',border:'none',borderRadius:12,padding:'13px',fontSize:14,fontWeight:700,cursor:critAnt.every(function(a){return a!==null;})?'pointer':'not-allowed',width:'100%',marginTop:8}},(isEN?'Next':'Volgende')+' \u2192')
    ),

    // ═══ STAP 4: URGENTIE + CONTROLES (samen) ═══
    stap===4&&(function(){var du=override||urgentie;var info=window.urgentieInfo[du];var signalen=window.checkControleSignalen(controles);
      return React.createElement('div',null,
        // Urgentie uitslag
        React.createElement('div',{style:{fontSize:16,fontWeight:700,color:'#2D2D2D',marginBottom:8}},isEN?'Urgency + Controls':'Urgentie + Controles'),
        React.createElement('div',{style:{background:info.bg,border:'2px solid '+info.kleur,borderRadius:10,padding:14,textAlign:'center',marginBottom:12}},
          React.createElement('div',{style:{fontSize:24}},info.icon),
          React.createElement('div',{style:{fontSize:18,fontWeight:700,color:info.kleur,marginTop:4}},info.label),
          React.createElement('div',{style:{fontSize:12,color:'#666',marginTop:4}},isEN?info.actieEN:info.actie)
        ),
        // Behandelbeperking banner
        prefillPersona&&prefillPersona.behandelbeperking&&React.createElement('div',{style:{background:'#FCEAEA',border:'1px solid #D94F4F',borderRadius:10,padding:12,marginBottom:12}},
          React.createElement('div',{style:{display:'flex',alignItems:'center',gap:8,marginBottom:6}},
            React.createElement('div',{style:{fontSize:18}},'\u26D4'),
            React.createElement('div',{style:{fontSize:14,fontWeight:700,color:'#D94F4F'}},isEN?'Treatment limitations registered':'Behandelbeperking geregistreerd')
          ),
          prefillPersona.behandelbeperking.nietReanimeren&&React.createElement('div',{style:{display:'flex',alignItems:'center',gap:6,marginBottom:3}},
            React.createElement('div',{style:{width:14,height:14,borderRadius:7,background:'#D94F4F',display:'flex',alignItems:'center',justifyContent:'center',color:'#FFF',fontSize:8,fontWeight:700}},'NR'),
            React.createElement('span',{style:{fontSize:13,fontWeight:600,color:'#D94F4F'}},isEN?'Do Not Resuscitate (DNR)':'Niet reanimeren (NR-verklaring)'),
            prefillPersona.behandelbeperking.nrPenning&&React.createElement('span',{style:{fontSize:10,color:'#D94F4F',background:'#FCEAEA',border:'1px solid #D94F4F',padding:'1px 6px',borderRadius:4}},isEN?'NR badge':'NR-penning')
          ),
          prefillPersona.behandelbeperking.geenIC&&React.createElement('div',{style:{fontSize:12,color:'#7A1F1F',marginBottom:2}},'\u2022 '+(isEN?'No ICU admission':'Geen IC-opname')),
          prefillPersona.behandelbeperking.geenBeademing&&React.createElement('div',{style:{fontSize:12,color:'#7A1F1F',marginBottom:2}},'\u2022 '+(isEN?'No mechanical ventilation':'Geen beademing')),
          React.createElement('div',{style:{fontSize:11,color:'#AAA',marginTop:4}},
            (isEN?'Representative: ':'Vertegenwoordiger: ')+(prefillPersona.behandelbeperking.vertegenwoordiger||'-')+' \u00B7 '+(prefillPersona.behandelbeperking.vastgesteldOp||'')
          )
        ),
        // Signalen
        signalen.length>0&&React.createElement('div',{style:{marginBottom:8}},signalen.map(function(s,i){
          return React.createElement('div',{key:i,style:{background:s.ernst==='danger'?'#FCEAEA':'#FFF3EB',border:'1px solid '+(s.ernst==='danger'?'#D94F4F':'#E8732A'),borderRadius:8,padding:'6px 10px',marginBottom:4,fontSize:12,color:s.ernst==='danger'?'#D94F4F':'#E8732A',fontWeight:500}},'\u26A0 '+(isEN?s.tekstEN:s.tekst));})),
        // Controle velden
        React.createElement('div',{style:{fontSize:13,fontWeight:600,color:'#666',marginBottom:6}},isEN?'Vitals (optional)':'Vitalen (optioneel)'),
        (window.controleVelden||[]).map(function(v){var val=controles[v.id]||'';var st=window.getControleStatus(v,val);
          var bk=st==='danger'?'#D94F4F':st==='warning'?'#E8732A':st==='normal'?'#2D9D78':'#EEE';
          return React.createElement('div',{key:v.id,style:{display:'flex',alignItems:'center',gap:6,marginBottom:4,padding:'6px 8px',borderRadius:8,border:'1px solid '+bk,background:st==='danger'?'#FCEAEA':'transparent'}},
            React.createElement('div',{style:{flex:1}},React.createElement('div',{style:{fontSize:12,fontWeight:500,color:'#2D2D2D'}},isEN?v.labelEN:v.label),React.createElement('div',{style:{fontSize:9,color:'#AAA'}},v.normaal)),
            React.createElement('input',{type:'number',step:v.type==='decimal'?'0.1':'1',value:val,onChange:function(e){var n=Object.assign({},controles);n[v.id]=e.target.value;setControles(n);},style:{width:65,padding:'5px 6px',borderRadius:6,border:'1px solid '+bk,fontSize:13,textAlign:'right',outline:'none',fontFamily:"'DM Sans',sans-serif",color:'#2D2D2D'}}),
            React.createElement('span',{style:{fontSize:10,color:'#AAA',minWidth:30}},v.eenheid),
            st!=='empty'&&React.createElement('div',{style:{width:14,height:14,borderRadius:7,background:bk,display:'flex',alignItems:'center',justifyContent:'center',color:'#FFF',fontSize:8}},st==='normal'?'\u2713':'!')
          );
        }),
        React.createElement('textarea',{value:ctrlOpmerking,onChange:function(e){setCtrlOpmerking(e.target.value);},placeholder:isEN?'Notes for doctor...':'Opmerking voor arts...',style:{width:'100%',minHeight:40,padding:8,borderRadius:8,border:'1px solid #EEE',fontSize:12,fontFamily:"'DM Sans',sans-serif",outline:'none',color:'#2D2D2D',marginTop:6,marginBottom:8}}),
        React.createElement('button',{onClick:function(){setS(5);},style:{background:'#E8732A',color:'#FFF',border:'none',borderRadius:12,padding:'13px',fontSize:14,fontWeight:700,cursor:'pointer',width:'100%'}},(isEN?'Next':'Volgende')+' \u2192')
      );
    })(),

    // ═══ STAP 5: ADVIES + HANDELINGEN + OVERRIDE + MEDIA ═══
    stap===5&&(function(){var du=override||urgentie;var info=window.urgentieInfo[du];var sk=klachten.find(function(k){return k.id===klacht;});
      var adviezen=(window.handelingsAdviezen&&window.handelingsAdviezen[du])||[];
      return React.createElement('div',null,
        React.createElement('div',{style:{fontSize:16,fontWeight:700,color:'#2D2D2D',marginBottom:8}},isEN?'Advice & Actions':'Advies & Handelingen'),
        // Urgentie badge
        React.createElement('div',{style:{display:'flex',alignItems:'center',gap:10,marginBottom:10}},
          React.createElement('div',{style:{fontSize:20}},info.icon),
          React.createElement('div',{style:{fontSize:16,fontWeight:700,color:info.kleur}},info.label),
          override&&override!==urgentie&&React.createElement('span',{style:{fontSize:11,color:'#AAA',textDecoration:'line-through'}},urgentie)
        ),
        // Handelingsadviezen met media
        adviezen.length>0&&React.createElement('div',{style:{background:du==='U0'||du==='U1'?'#FCEAEA':'#FFF3EB',borderRadius:10,border:'1px solid '+(du==='U0'||du==='U1'?'#D94F4F':'#E8732A'),padding:14,marginBottom:10}},
          React.createElement('div',{style:{fontSize:13,fontWeight:700,color:du==='U0'||du==='U1'?'#D94F4F':'#E8732A',marginBottom:8}},isEN?'Immediate actions':'Directe handelingen'),
          adviezen.map(function(a,i){
            return React.createElement('div',{key:i,style:{marginBottom:6}},
              React.createElement('div',{style:{display:'flex',alignItems:'flex-start',gap:8}},
                React.createElement('div',{style:{width:18,height:18,borderRadius:9,background:a.prioriteit==='direct'?(du==='U0'||du==='U1'?'#D94F4F':'#E8732A'):'#AAA',display:'flex',alignItems:'center',justifyContent:'center',color:'#FFF',fontSize:10,fontWeight:700,flexShrink:0,marginTop:1}},i+1),
                React.createElement('div',{style:{fontSize:13,color:'#4A4A4A',lineHeight:1.4}},isEN?a.tekstEN:a.tekst)
              ),
              a.media&&React.createElement('a',{href:a.media.url,target:'_blank',rel:'noopener',style:{display:'inline-flex',alignItems:'center',gap:4,marginLeft:26,marginTop:2,fontSize:11,color:'#4A7FB5',textDecoration:'none'}},
                a.media.type==='video'?'\uD83C\uDFA5':a.media.type==='afbeelding'?'\uD83D\uDDBC\uFE0F':'\u2139\uFE0F',
                ' ',a.media.label||a.media.url.substring(0,30)
              )
            );
          })
        ),
        // Override urgentie
        React.createElement('div',{style:{background:'#FFF',borderRadius:10,border:'0.5px solid #EEE',padding:12,marginBottom:10}},
          React.createElement('div',{style:{fontSize:13,fontWeight:600,color:'#666',marginBottom:6}},isEN?'Adjust urgency?':'Urgentie aanpassen?'),
          React.createElement('div',{style:{display:'flex',gap:4,flexWrap:'wrap',marginBottom:6}},
            ['U0','U1','U2','U3','U4','U5'].map(function(u){var s=du===u;var ui2=window.urgentieInfo[u];
              return React.createElement('button',{key:u,onClick:function(){if(u!==urgentie){setOverride(u);}else{setOverride(null);setOverrideMot('');}},style:{padding:'5px 10px',borderRadius:8,fontSize:11,fontWeight:s?700:400,background:s?ui2.kleur:'#FFF',color:s?'#FFF':ui2.kleur,border:'1px solid '+ui2.kleur,cursor:'pointer'}},u);
            })
          ),
          (override&&override!==urgentie)&&React.createElement('textarea',{value:overrideMot,onChange:function(e){setOverrideMot(e.target.value);},placeholder:isEN?'Motivation (required)...':'Motivatie (verplicht)...',style:{width:'100%',minHeight:40,padding:8,borderRadius:8,border:'1px solid #EEE',fontSize:12,fontFamily:"'DM Sans',sans-serif",outline:'none',color:'#2D2D2D'}})
        ),
        // Samenvatting
        React.createElement('div',{style:{background:'#FFF',borderRadius:10,border:'0.5px solid #EEE',padding:12,marginBottom:8}},
          React.createElement('div',{style:{fontSize:12,color:'#AAA'}},isEN?'Complaint':'Klacht'),
          React.createElement('div',{style:{fontSize:13,color:'#2D2D2D',marginBottom:6}},sk?(isEN?sk.labelEN:sk.label):klacht),
          React.createElement('div',{style:{fontSize:12,color:'#AAA'}},isEN?'Observation':'Observatie'),
          React.createElement('div',{style:{fontSize:12,color:'#666'}},observatie)
        ),
        React.createElement('textarea',{value:notitie,onChange:function(e){setNotitie(e.target.value);},placeholder:isEN?'Additional notes...':'Extra opmerking...',style:{width:'100%',minHeight:40,padding:8,borderRadius:10,border:'1px solid #EEE',fontSize:12,fontFamily:"'DM Sans',sans-serif",outline:'none',color:'#2D2D2D',marginBottom:8}}),
        React.createElement('button',{onClick:function(){
          if(override&&override!==urgentie&&!overrideMot.trim()){addToast(isEN?'Provide motivation':'Vul motivatie in');return;}
          setOpgeslagen(true);addToast(isEN?'Triage saved':'Triageverslag opgeslagen','success');
        },style:{background:'#2D9D78',color:'#FFF',border:'none',borderRadius:12,padding:'13px',fontSize:14,fontWeight:700,cursor:'pointer',width:'100%'}},'\u2713 '+(isEN?'Save & confirm':'Opslaan & bevestigen'))
      );
    })()
  );
};
