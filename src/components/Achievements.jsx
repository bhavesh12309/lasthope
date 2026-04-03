import React, { useState, useEffect, useRef, useCallback } from 'react';

const WORLDS = {
  egypt:   { name:'Ancient Egypt',   emoji:'🏜️', color:'#c9822a', glow:'#ff9d3d', bg:'linear-gradient(135deg,#1a0a00,#2d1500,#1a0a00)', accent:'#e8a43a' },
  cyber:   { name:'Cyberpunk 2099',  emoji:'🌆', color:'#00ffe7', glow:'#00b3ff', bg:'linear-gradient(135deg,#000814,#001a2e,#000814)', accent:'#00ffe7' },
  fantasy: { name:'Fantasy Realm',   emoji:'🏰', color:'#c77dff', glow:'#9d4edd', bg:'linear-gradient(135deg,#0d001a,#1a0033,#0d001a)', accent:'#c77dff' },
  space:   { name:'Deep Space',      emoji:'🚀', color:'#4cc9f0', glow:'#3a86ff', bg:'linear-gradient(135deg,#000010,#000020,#000010)', accent:'#4cc9f0' },
  ocean:   { name:'Ocean Depths',    emoji:'🌊', color:'#48cae4', glow:'#0096c7', bg:'linear-gradient(135deg,#000814,#001529,#000814)', accent:'#48cae4' },
  volcano: { name:'Volcanic Forge',  emoji:'🌋', color:'#ff4500', glow:'#ff6b35', bg:'linear-gradient(135deg,#1a0000,#2d0a00,#1a0000)', accent:'#ff4500' },
};

const SCENES = {
  egypt:[
    {type:'narrative', text:'The sphinx gazes into eternity.', prompt:'sand hides ancient truth',difficulty:1},
    {type:'battle',    text:'A stone golem rises from rubble!', prompt:'shatter the crumbling stone',difficulty:2,time:9},
    {type:'quicktime', text:'Spiked walls close in fast!', prompt:'roll beneath the spikes',difficulty:2,time:5},
    {type:'puzzle',    text:'Glowing hieroglyphs pulse on the wall.', prompt:'wisdom unlocks the vault',difficulty:1.5},
    {type:'boss',      text:'THE PHARAOH KING AWAKES!', prompt:'break the ancient pharaoh curse',difficulty:3,time:12,boss:true},
    {type:'quicktime', text:'Temple floor collapses!', prompt:'leap across the void',difficulty:2.1,time:5},
    {type:'dialogue',  text:'A spirit speaks from the beyond.', prompt:'I seek eternal truth now',difficulty:1.4},
    {type:'narrative', text:'The golden chamber opens.', prompt:'claim the sacred relic here',difficulty:1.3},
  ],
  cyber:[
    {type:'narrative', text:'Neon rain reflects on wet asphalt.', prompt:'the city never sleeps tonight',difficulty:1},
    {type:'battle',    text:'Rogue combat drones lock on!', prompt:'jam every hostile signal fast',difficulty:2.2,time:8},
    {type:'quicktime', text:'Security grid activates!', prompt:'override the firewall system',difficulty:2,time:6},
    {type:'puzzle',    text:'An encrypted terminal blinks.', prompt:'decrypt the hidden data core',difficulty:1.7},
    {type:'boss',      text:'MEGA CORP AI UNLEASHED!', prompt:'destroy the corporate mainframe now',difficulty:3.2,time:11,boss:true},
    {type:'dialogue',  text:'A ghost in the machine speaks.', prompt:'I accept your offer deal',difficulty:1.5},
    {type:'quicktime', text:'Bridge explodes beneath you!', prompt:'jump across the burning gap',difficulty:2.3,time:5},
    {type:'narrative', text:'You reach the top of the spire.', prompt:'upload the viral program file',difficulty:1.6},
  ],
  fantasy:[
    {type:'narrative', text:'A mystical forest hums with power.', prompt:'follow the glowing fairy light',difficulty:1},
    {type:'battle',    text:'A fire dragon dives from the clouds!', prompt:'strike the heart of dragon',difficulty:2.5,time:9},
    {type:'quicktime', text:'Dark lightning strikes the castle!', prompt:'cast your barrier ward spell',difficulty:1.9,time:6},
    {type:'puzzle',    text:'An ancient wizard poses a riddle.', prompt:'the answer is pure magic',difficulty:1.6},
    {type:'boss',      text:'THE SHADOW OVERLORD DESCENDS!', prompt:'banish evil back to shadow realm',difficulty:3.5,time:12,boss:true},
    {type:'dialogue',  text:'The elven queen speaks to you.', prompt:'we seek your eternal blessing',difficulty:1.4},
    {type:'quicktime', text:'Drawbridge starts rising fast!', prompt:'sprint through the castle gate',difficulty:2.1,time:5},
    {type:'narrative', text:'The throne room fills with light.', prompt:'claim the crystal power crown',difficulty:1.5},
  ],
  space:[
    {type:'narrative', text:'Stars stretch beyond the viewport glass.', prompt:'engage the quantum warp drive',difficulty:1},
    {type:'battle',    text:'Alien warships open fire!', prompt:'fire all plasma laser banks',difficulty:2.3,time:8},
    {type:'quicktime', text:'Hull breach detected on deck three!', prompt:'seal the emergency airlock hatch',difficulty:2,time:5},
    {type:'puzzle',    text:'Ancient star charts appear on screen.', prompt:'plot the hyperspace jump course',difficulty:1.7},
    {type:'boss',      text:'COSMIC TITAN EMERGES!', prompt:'collapse the singularity before impact',difficulty:3.3,time:13,boss:true},
    {type:'dialogue',  text:'First contact with alien civilization.', prompt:'we arrive here in peace',difficulty:1.5},
    {type:'quicktime', text:'Asteroid field incoming at speed!', prompt:'roll the ship hard port',difficulty:2.2,time:5},
    {type:'narrative', text:'The wormhole pulses with raw energy.', prompt:'jump through the portal now',difficulty:1.4},
  ],
  ocean:[
    {type:'narrative', text:'Bioluminescent creatures drift past silently.', prompt:'dive deeper into the abyss',difficulty:1},
    {type:'battle',    text:'A giant squid wraps around the hull!', prompt:'cut through every writhing tentacle',difficulty:2.4,time:8},
    {type:'quicktime', text:'Pressure crack splits the viewport!', prompt:'weld the crack shut quickly',difficulty:1.9,time:6},
    {type:'puzzle',    text:'Ancient ruins pulse with blue light.', prompt:'match the forgotten ocean rhythm',difficulty:1.6},
    {type:'boss',      text:'THE LEVIATHAN AWAKENS!', prompt:'drive it back into the abyss below',difficulty:3.4,time:12,boss:true},
    {type:'dialogue',  text:'A mermaid appears from the dark.', prompt:'follow me to safe haven',difficulty:1.3},
    {type:'quicktime', text:'Volcanic vent erupts beneath you!', prompt:'ascend with emergency full thrust',difficulty:2.3,time:5},
    {type:'narrative', text:'Lost Atlantis glows ahead.', prompt:'enter the golden ancient gates',difficulty:1.5},
  ],
  volcano:[
    {type:'narrative', text:'The magma river flows endlessly below.', prompt:'walk the obsidian stone path',difficulty:1.2},
    {type:'battle',    text:'Lava golems rise from the molten rock!', prompt:'shatter every burning stone giant',difficulty:2.6,time:8},
    {type:'quicktime', text:'Eruption begins! The ground shakes!', prompt:'run toward the stone bridge',difficulty:2.1,time:5},
    {type:'puzzle',    text:'Fire runes glow on the forge altar.', prompt:'forge the legendary weapon blade',difficulty:1.8},
    {type:'boss',      text:'THE VOLCANO GOD AWAKENS!', prompt:'seal the molten core before it burns',difficulty:3.8,time:14,boss:true},
    {type:'dialogue',  text:'A fire spirit offers you power.', prompt:'grant me your ember flame',difficulty:1.6},
    {type:'quicktime', text:'Lava wave surges toward you!', prompt:'leap onto the floating rock',difficulty:2.4,time:5},
    {type:'narrative', text:'The forge heart glows before you.', prompt:'claim the undying fire power',difficulty:1.6},
  ],
};

const ACHIEVEMENTS = {
  first_win:   {name:'First Blood',       icon:'⚔️', desc:'Complete your first scene',xp:50},
  speed_60:    {name:'Speed Demon',        icon:'⚡', desc:'Hit 60 WPM',xp:100},
  speed_100:   {name:'Lightning Fingers', icon:'🌩️', desc:'Hit 100 WPM',xp:200},
  combo_5:     {name:'On Fire',            icon:'🔥', desc:'5x combo streak',xp:100},
  combo_10:    {name:'Unstoppable',        icon:'💥', desc:'10x combo streak',xp:300},
  coin_10k:    {name:'Coin Hoarder',       icon:'💰', desc:'Accumulate 10,000 coins',xp:150},
  boss_slayer: {name:'Boss Slayer',        icon:'👑', desc:'Defeat a boss',xp:250},
  perfect:     {name:'Perfectionist',      icon:'💎', desc:'100% accuracy on a scene',xp:200},
  survivor:    {name:'Iron Will',          icon:'🛡️', desc:'Finish a world at full health',xp:200},
  world_clear: {name:'World Conqueror',   icon:'🌍', desc:'Clear all 6 worlds',xp:1000},
  no_powerup:  {name:'Purist',             icon:'🏆', desc:'Clear a world without power-ups',xp:300},
};

const SKILL_TREE = {
  speed:  {name:'Speed Mastery',   icon:'⚡', levels:[{cost:300,bonus:'WPM display +10%'},{cost:600,bonus:'WPM display +25%'},{cost:1200,bonus:'WPM +50%'}]},
  health: {name:'Iron Body',       icon:'❤️', levels:[{cost:250,bonus:'+20 max HP'},{cost:500,bonus:'+40 max HP'},{cost:1000,bonus:'+60 max HP'}]},
  coins:  {name:'Gold Sense',      icon:'🪙', levels:[{cost:400,bonus:'Coins +25%'},{cost:800,bonus:'Coins +50%'},{cost:1600,bonus:'Coins +100%'}]},
  combo:  {name:'Combo Arts',      icon:'🔥', levels:[{cost:350,bonus:'Combo +15%'},{cost:700,bonus:'Combo +30%'},{cost:1400,bonus:'Combo +60%'}]},
  time:   {name:'Time Warp',       icon:'⏱️', levels:[{cost:300,bonus:'+2s timed scenes'},{cost:600,bonus:'+4s timed scenes'},{cost:1200,bonus:'+6s timed scenes'}]},
  crit:   {name:'Critical Hit',    icon:'💥', levels:[{cost:500,bonus:'10% crit: 2× coins'},{cost:1000,bonus:'20% crit: 2× coins'},{cost:2000,bonus:'30% crit: 3× coins'}]},
};

const LEADERBOARD_DATA = [
  {rank:1,name:'ShadowTyper',   wpm:187,score:98420},
  {rank:2,name:'NeonFingers',   wpm:172,score:91200},
  {rank:3,name:'KeystrokePro',  wpm:165,score:88700},
  {rank:4,name:'QuantumKeys',   wpm:158,score:82300},
  {rank:5,name:'VoidTypist',    wpm:151,score:79100},
  {rank:6,name:'CryptoKeys',    wpm:144,score:74500},
  {rank:7,name:'StormCoder',    wpm:139,score:71200},
];

const DAILY_CHALLENGES = [
  {id:'d1',name:'Speed Run',    desc:'Complete a world in under 3 min',reward:500,icon:'⚡'},
  {id:'d2',name:'Perfectionist',desc:'Get 95%+ accuracy on 5 scenes',reward:800,icon:'🎯'},
  {id:'d3',name:'Combo Master', desc:'Maintain 5x streak for a world',reward:600,icon:'🔥'},
  {id:'d4',name:'Big Spender',  desc:'Spend 1000 coins in the shop',reward:1000,icon:'💸'},
  {id:'d5',name:'Explorer',     desc:'Play 3 different worlds',reward:400,icon:'🗺️'},
];

function hexRgb(hex) {
  return `${parseInt(hex.slice(1,3),16)},${parseInt(hex.slice(3,5),16)},${parseInt(hex.slice(5,7),16)}`;
}

export default function TypingGame() {
  const [screen,setScreen]     = useState('menu');
  const [tab,setTab]           = useState('play');
  const [world,setWorld]       = useState('egypt');
  const [sceneIdx,setSceneIdx] = useState(0);
  const [diff,setDiff]         = useState('normal');
  const [inputVal,setInputVal] = useState('');
  const [hp,setHp]             = useState(100);
  const [maxHp,setMaxHp]       = useState(100);
  const [combo,setCombo]       = useState(0);
  const [maxCombo,setMaxCombo] = useState(0);
  const [score,setScore]       = useState(0);
  const [coins,setCoins]       = useState(8000);
  const [xp,setXp]             = useState(0);
  const [level,setLevel]       = useState(1);
  const [timeLeft,setTimeLeft] = useState(null);
  const [feedback,setFeedback] = useState([]);
  const [result,setResult]     = useState(null);
  const [achToast,setAchToast] = useState(null);
  const [achievements,setAchievements] = useState({});
  const [skills,setSkills]     = useState({speed:0,health:0,coins:0,combo:0,time:0,crit:0});
  const [powerUps,setPowerUps] = useState({shield:2,freeze:2,hint:3,double:1});
  const [activePU,setActivePU] = useState(null);
  const [stats,setStats]       = useState({maxWpm:0,totalChars:0,games:0,perfectScenes:0,bossKills:0,worldsCleared:[]});
  const [daily,setDaily]       = useState({});
  const [purePuRun,setPurePuRun] = useState(true);
  const [bossHp,setBossHp]     = useState(100);
  const [bossDmg,setBossDmg]   = useState(null);
  const [liveWpm,setLiveWpm]   = useState(0);
  const [sessionCoins,setSessionCoins] = useState(0);
  const [critFlash,setCritFlash] = useState(false);
  const [comboFlash,setComboFlash] = useState(false);

  const inputRef  = useRef(null);
  const startRef  = useRef(0);
  const timerRef  = useRef(null);
  const wpmRef    = useRef(null);
  const inputSnapshot = useRef('');

  const diffConf = {
    easy:   {mult:0.75,timePlus:4, dmg:10,label:'Easy',  col:'#4ade80'},
    normal: {mult:1,   timePlus:0, dmg:20,label:'Normal',col:'#facc15'},
    hard:   {mult:1.5, timePlus:-2,dmg:30,label:'Hard',  col:'#f97316'},
    expert: {mult:2.2, timePlus:-3,dmg:45,label:'Expert',col:'#e879f9'},
  };

  const scenes = SCENES[world]||SCENES.egypt;
  const scene  = scenes[sceneIdx];
  const wld    = WORLDS[world];
  const dc     = diffConf[diff];

  const calcWpm = (str,ms) => {
    if(ms<400) return 0;
    const words = str.trim().split(/\s+/).filter(Boolean).length||1;
    return Math.round((words/(ms/60000))*(1+skills.speed*0.1));
  };

  const calcAcc = (target,inp) => {
    if(!inp.length) return 0;
    let ok=0;
    for(let i=0;i<Math.min(target.length,inp.length);i++)
      if(target[i].toLowerCase()===inp[i]?.toLowerCase()) ok++;
    return (ok/target.length)*100;
  };

  const calcCoins = (acc,wpm,sDiff,comboN) => {
    const sm = 1+skills.coins*0.25;
    const cb = 1+skills.combo*0.15;
    const isCrit = Math.random()<skills.crit*0.1;
    const cm = isCrit?(skills.crit>=3?3:2):1;
    if(isCrit){setCritFlash(true);setTimeout(()=>setCritFlash(false),700);}
    const du = activePU==='double'?2:1;
    return Math.max(15,Math.floor((acc*2*sDiff+wpm/6+comboN*10)*dc.mult*sm*cb*cm*du));
  };

  const unlock = (key) => {
    if(achievements[key]) return;
    const a = ACHIEVEMENTS[key];
    setAchievements(p=>({...p,[key]:true}));
    setAchToast(a);
    setXp(p=>{const n=p+a.xp;setLevel(Math.floor(n/500)+1);return n;});
    setTimeout(()=>setAchToast(null),3200);
  };

  const buildFeedback = (target,inp) =>
    target.split('').map((c,i)=>({c,state:i>=inp.length?'pending':c.toLowerCase()===inp[i]?.toLowerCase()?'correct':'wrong'}));

  const startScene = useCallback(() => {
    clearInterval(timerRef.current); clearInterval(wpmRef.current);
    setInputVal(''); inputSnapshot.current='';
    setFeedback([]); setResult(null); setLiveWpm(0);
    startRef.current = Date.now();
    const s = scenes[sceneIdx];
    if(s.time){
      const total = Math.max(3,s.time+(skills.time*2)+dc.timePlus);
      setTimeLeft(total);
      timerRef.current = setInterval(()=>{
        setTimeLeft(prev=>{
          if(activePU==='freeze') return prev;
          if(prev<=1){clearInterval(timerRef.current);endScene(false);return 0;}
          return prev-1;
        });
      },1000);
    } else setTimeLeft(null);
    wpmRef.current = setInterval(()=>{
      const elapsed=Date.now()-startRef.current;
      if(inputSnapshot.current.length>0) setLiveWpm(calcWpm(inputSnapshot.current,elapsed));
    },400);
  },[sceneIdx,skills.time,dc.timePlus,activePU]);

  const endScene = useCallback((success)=>{
    clearInterval(timerRef.current); clearInterval(wpmRef.current);
    const elapsed = Date.now()-startRef.current;
    const inp = inputSnapshot.current;
    const wpm = calcWpm(inp,elapsed);
    const acc = success ? calcAcc(scene.prompt,inp) : 0;

    if(success){
      const earned = calcCoins(acc,wpm,scene.difficulty,combo);
      const newCombo = acc>=90 ? combo+1 : 0;
      const newMaxC = Math.max(maxCombo,newCombo);
      const healAmt = acc>=95?20:acc>=80?10:5;
      const newHp   = Math.min(maxHp,hp+healAmt);
      const newScore= score+Math.floor(acc*scene.difficulty*150*dc.mult);
      const xpEarned= Math.floor(acc*scene.difficulty*20);

      if(scene.boss){
        const dmg=Math.floor(acc*1.2);
        setBossHp(p=>{const n=Math.max(0,p-dmg);
          if(n<=0){setStats(s=>({...s,bossKills:s.bossKills+1}));unlock('boss_slayer');}
          return n;
        });
        setBossDmg(dmg); setTimeout(()=>setBossDmg(null),1200);
      }

      setCoins(c=>c+earned); setSessionCoins(s=>s+earned);
      setCombo(newCombo); setMaxCombo(newMaxC);
      setHp(newHp); setScore(newScore);
      setXp(p=>{const n=p+xpEarned;setLevel(Math.floor(n/500)+1);return n;});
      setStats(p=>({...p,maxWpm:Math.max(p.maxWpm,wpm),totalChars:p.totalChars+inp.length,
        perfectScenes:acc===100?p.perfectScenes+1:p.perfectScenes}));

      if(newCombo>=5){setComboFlash(true);setTimeout(()=>setComboFlash(false),1200);unlock('combo_5');}
      if(newCombo>=10) unlock('combo_10');
      if(acc===100) unlock('perfect');
      if(wpm>=60)  unlock('speed_60');
      if(wpm>=100) unlock('speed_100');
      unlock('first_win');

      setResult({success:true,acc:Math.round(acc),wpm,earned,combo:newCombo});
    } else {
      const dmg = activePU==='shield'?0:dc.dmg;
      const newHp = Math.max(0,hp-dmg);
      setHp(newHp); setCombo(0);
      setResult({success:false});
      if(newHp<=0){setTimeout(()=>setScreen('gameover'),900);return;}
    }

    setActivePU(null);
    const isLast = sceneIdx===scenes.length-1;
    if(isLast){
      setTimeout(()=>{
        setStats(p=>{
          const nw=[...new Set([...p.worldsCleared,world])];
          if(nw.length===6) unlock('world_clear');
          return {...p,games:p.games+1,worldsCleared:nw};
        });
        if(hp>80) unlock('survivor');
        if(purePuRun) unlock('no_powerup');
        setScreen('victory');
      },1200);
    } else {
      setTimeout(()=>setSceneIdx(i=>i+1),1200);
    }
  },[combo,hp,maxHp,score,bossHp,scene,sceneIdx,world,activePU,purePuRun,diff,dc]);

  const startGame=(w)=>{
    const ww=w||world; setWorld(ww);
    setSceneIdx(0); setHp(maxHp); setCombo(0); setMaxCombo(0);
    setScore(0); setSessionCoins(0);
    setInputVal(''); inputSnapshot.current='';
    setFeedback([]); setResult(null); setBossHp(100); setPurePuRun(true);
    setScreen('game');
  };

  useEffect(()=>{if(screen==='game') startScene();},[sceneIdx,screen]);
  useEffect(()=>{if(screen==='game') inputRef.current?.focus();},[sceneIdx,screen]);
  useEffect(()=>{
    const bonus=skills.health*20; setMaxHp(100+bonus);
    setHp(h=>Math.min(h,100+bonus));
  },[skills.health]);

  useEffect(()=>{if(coins>=10000) unlock('coin_10k');},[coins]);

  const handleInput=(e)=>{
    const v=e.target.value; setInputVal(v); inputSnapshot.current=v;
    setFeedback(buildFeedback(scene.prompt,v));
    if(scene.type!=='battle'&&v.trim().toLowerCase()===scene.prompt.trim().toLowerCase())
      setTimeout(()=>endScene(true),80);
  };

  const handleKey=(e)=>{
    if(e.key==='Enter'&&scene.type==='battle'){
      endScene(calcAcc(scene.prompt,inputVal)>65);
    }
  };

  const usePU=(type)=>{
    if(powerUps[type]<=0) return;
    setPowerUps(p=>({...p,[type]:p[type]-1}));
    setActivePU(type); setPurePuRun(false);
    if(type==='hint'){const w=scene.prompt.split(' ');setInputVal(w.slice(0,2).join(' ')+' ');inputSnapshot.current=w.slice(0,2).join(' ')+' ';}
    if(type==='freeze'||type==='double') setTimeout(()=>setActivePU(null),type==='freeze'?5000:10000);
  };

  const upgradeSkill=(key)=>{
    const cur=skills[key]; if(cur>=3) return;
    const cost=SKILL_TREE[key].levels[cur].cost; if(coins<cost) return;
    setCoins(c=>c-cost); setSkills(s=>({...s,[key]:s[key]+1}));
  };

  const progress = ((sceneIdx+1)/scenes.length)*100;
  const hpPct    = (hp/maxHp)*100;
  const xpPct    = ((xp%500)/500)*100;
  const hpCol    = hpPct>60?'#4ade80':hpPct>30?'#facc15':'#ef4444';

  // ─── INLINE STYLES ───
  const root={minHeight:'100vh',fontFamily:'"Exo 2","Rajdhani","Segoe UI",system-ui,sans-serif',
    background:screen==='game'?wld.bg:'linear-gradient(135deg,#05050f,#0a0a1e,#05050f)',
    color:'#e2e8f0',position:'relative',overflow:'hidden'};
  const scanline={position:'fixed',inset:0,pointerEvents:'none',zIndex:1,
    backgroundImage:'repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(0,0,0,0.025) 3px,rgba(0,0,0,0.025) 6px)'};
  const wrap=(mw=860)=>({position:'relative',zIndex:2,maxWidth:mw,margin:'0 auto',padding:'1rem 1rem 2rem'});
  const card=(border='rgba(255,255,255,0.08)')=>({background:'rgba(255,255,255,0.04)',border:`1px solid ${border}`,
    borderRadius:14,padding:'1.1rem',backdropFilter:'blur(6px)'});
  const glowCard=(col)=>({background:`rgba(${hexRgb(col)},0.06)`,border:`1px solid rgba(${hexRgb(col)},0.3)`,
    borderRadius:14,padding:'1.1rem',boxShadow:`0 0 18px rgba(${hexRgb(col)},0.08)`});
  const btn=(bg='rgba(124,58,237,0.6)',bd='rgba(167,139,250,0.5)')=>({
    background:bg,border:`1px solid ${bd}`,borderRadius:10,color:'#fff',
    fontWeight:700,padding:'9px 18px',cursor:'pointer',transition:'all .15s',fontSize:13});
  const bigBtn=(bg='rgba(124,58,237,0.8)',bd='#9d5af0')=>({
    background:bg,border:`1px solid ${bd}`,borderRadius:12,color:'#fff',
    fontWeight:800,fontSize:15,padding:'13px 30px',cursor:'pointer',
    transition:'all .15s',letterSpacing:'0.06em',textTransform:'uppercase'});
  const hudItem=(col='rgba(255,255,255,0.06)')=>({background:col,border:'1px solid rgba(255,255,255,0.08)',
    borderRadius:10,padding:'5px 11px',display:'flex',alignItems:'center',gap:5,fontSize:12});
  const inp={width:'100%',background:'rgba(0,0,0,0.45)',border:'1px solid rgba(255,255,255,0.18)',
    borderRadius:12,color:'#fff',fontSize:17,padding:'13px 15px',outline:'none',
    boxSizing:'border-box',fontFamily:'inherit',letterSpacing:'0.02em'};
  const tabStyle=(a)=>({padding:'7px 16px',borderRadius:8,
    border:`1px solid ${a?'rgba(255,255,255,0.25)':'rgba(255,255,255,0.07)'}`,
    background:a?'rgba(255,255,255,0.1)':'rgba(255,255,255,0.03)',
    color:a?'#fff':'rgba(255,255,255,0.45)',fontWeight:600,fontSize:12,
    cursor:'pointer',whiteSpace:'nowrap'});
  const tConf={
    battle:    {label:'⚔️ Battle',   bg:'rgba(239,68,68,.12)', bd:'rgba(239,68,68,.4)',  tx:'#fca5a5'},
    quicktime: {label:'⚡ Quick!',   bg:'rgba(249,115,22,.12)',bd:'rgba(249,115,22,.4)', tx:'#fdba74'},
    puzzle:    {label:'🔮 Puzzle',   bg:'rgba(167,139,250,.12)',bd:'rgba(167,139,250,.4)',tx:'#c4b5fd'},
    narrative: {label:'📖 Story',    bg:'rgba(96,165,250,.12)', bd:'rgba(96,165,250,.4)', tx:'#93c5fd'},
    dialogue:  {label:'💬 Talk',     bg:'rgba(52,211,153,.12)', bd:'rgba(52,211,153,.4)', tx:'#6ee7b7'},
    boss:      {label:'☠️ BOSS',     bg:'rgba(220,38,38,.25)',  bd:'rgba(220,38,38,.6)',  tx:'#fca5a5'},
  };

  /* ══ GAME SCREEN ══ */
  if(screen==='game'&&scene){
    const tc=tConf[scene.type]||tConf.narrative;
    return(
      <div style={root}>
        <div style={scanline}/>
        <div style={{position:'fixed',top:-150,left:'50%',transform:'translateX(-50%)',
          width:500,height:350,borderRadius:'50%',pointerEvents:'none',zIndex:1,
          background:`radial-gradient(ellipse,rgba(${hexRgb(wld.color)},0.07) 0%,transparent 70%)`}}/>

        {critFlash&&<div style={{position:'fixed',inset:0,background:'rgba(250,204,21,0.12)',zIndex:10,pointerEvents:'none'}}/>}

        {comboFlash&&(
          <div style={{position:'fixed',top:'28%',left:'50%',transform:'translateX(-50%)',
            fontSize:44,fontWeight:900,color:'#f97316',zIndex:20,pointerEvents:'none',
            textShadow:`0 0 28px #f97316`,letterSpacing:'0.08em'}}>
            🔥 {combo}x COMBO!
          </div>
        )}

        {achToast&&(
          <div style={{position:'fixed',top:16,left:'50%',transform:'translateX(-50%)',zIndex:50,
            background:'rgba(5,5,20,0.96)',border:'1px solid #facc15',borderRadius:14,
            padding:'11px 22px',display:'flex',gap:11,alignItems:'center',
            boxShadow:'0 0 28px rgba(250,204,21,0.25)',minWidth:260}}>
            <span style={{fontSize:26}}>{achToast.icon}</span>
            <div>
              <div style={{color:'#facc15',fontWeight:700,fontSize:11,textTransform:'uppercase',letterSpacing:'0.1em'}}>Achievement Unlocked</div>
              <div style={{fontWeight:800,fontSize:15}}>{achToast.name}</div>
              <div style={{color:'rgba(255,255,255,0.4)',fontSize:11}}>+{achToast.xp} XP</div>
            </div>
          </div>
        )}

        {result&&(
          <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.55)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:30,pointerEvents:'none'}}>
            <div style={{...glowCard(result.success?'#4ade80':'#ef4444'),textAlign:'center',minWidth:200,padding:'1.5rem'}}>
              <div style={{fontSize:52,marginBottom:8}}>{result.success?'✓':'✗'}</div>
              {result.success?(
                <>
                  <div style={{color:'#4ade80',fontWeight:700,fontSize:17,marginBottom:8}}>Scene Clear!</div>
                  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:6}}>
                    <div><div style={{fontSize:10,opacity:.4}}>ACCURACY</div><div style={{color:'#4ade80',fontWeight:800,fontSize:22}}>{result.acc}%</div></div>
                    <div><div style={{fontSize:10,opacity:.4}}>WPM</div><div style={{color:'#60a5fa',fontWeight:800,fontSize:22}}>{result.wpm}</div></div>
                    <div style={{gridColumn:'1/-1'}}><div style={{fontSize:10,opacity:.4}}>COINS</div><div style={{color:'#facc15',fontWeight:900,fontSize:24}}>+{result.earned} 🪙</div></div>
                  </div>
                  {result.combo>=3&&<div style={{marginTop:8,color:'#f97316',fontWeight:700,fontSize:12}}>🔥 {result.combo}x streak!</div>}
                </>
              ):<div style={{color:'#ef4444',fontWeight:700,fontSize:16}}>Scene Failed!</div>}
            </div>
          </div>
        )}

        <div style={wrap(740)}>
          {/* Topbar */}
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:10}}>
            <button onClick={()=>setScreen('menu')} style={{...btn('rgba(255,255,255,0.05)','rgba(255,255,255,0.12)'),padding:'7px 13px',fontSize:12}}>← Menu</button>
            <div style={{fontSize:12,opacity:.5}}>
              <span>{wld.emoji} {wld.name}</span>
              <span style={{opacity:.4,margin:'0 6px'}}>·</span>
              <span style={{color:dc.col,fontWeight:700}}>{dc.label}</span>
            </div>
            <div style={{fontSize:12,opacity:.4}}>Scene {sceneIdx+1}/{scenes.length}</div>
          </div>

          {/* Progress */}
          <div style={{width:'100%',height:3,background:'rgba(255,255,255,0.07)',borderRadius:3,marginBottom:12,overflow:'hidden'}}>
            <div style={{height:'100%',width:`${progress}%`,background:`linear-gradient(90deg,${wld.color},${wld.glow})`,borderRadius:3,transition:'width .5s'}}/>
          </div>

          {/* HUD */}
          <div style={{display:'flex',gap:7,flexWrap:'wrap',marginBottom:12}}>
            <div style={hudItem()}>
              <span style={{color:'#ef4444',fontSize:14}}>❤️</span>
              <div style={{width:72,height:5,background:'rgba(255,255,255,0.09)',borderRadius:3,overflow:'hidden'}}>
                <div style={{height:'100%',width:`${hpPct}%`,background:hpCol,transition:'width .4s',borderRadius:3}}/>
              </div>
              <span style={{fontWeight:700,color:hpCol,fontSize:12}}>{Math.round(hp)}</span>
            </div>
            <div style={hudItem(`rgba(249,115,22,${combo>0?.14:.03})`)}>
              <span style={{fontSize:13}}>🔥</span>
              <span style={{fontWeight:800,color:combo>0?'#f97316':'rgba(255,255,255,.3)',fontSize:13}}>{combo}x</span>
            </div>
            <div style={hudItem()}>
              <span style={{fontSize:13}}>🪙</span>
              <span style={{fontWeight:700,color:'#facc15',fontSize:12}}>{coins.toLocaleString()}</span>
            </div>
            <div style={hudItem()}>
              <span style={{color:'#60a5fa',fontSize:13}}>⚡</span>
              <span style={{fontWeight:700,color:'#60a5fa',fontSize:12}}>{liveWpm} WPM</span>
            </div>
            <div style={hudItem()}>
              <span style={{color:'#a78bfa',fontSize:13}}>🏆</span>
              <span style={{fontWeight:700,fontSize:12}}>{score.toLocaleString()}</span>
            </div>
          </div>

          {/* Scene type + timer */}
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:10}}>
            <div style={{background:tc.bg,border:`1px solid ${tc.bd}`,borderRadius:8,padding:'5px 13px',color:tc.tx,fontWeight:700,fontSize:12}}>
              {tc.label}
            </div>
            {timeLeft!==null&&(
              <div style={{
                background:`rgba(${timeLeft<=3?'239,68,68':'255,255,255'},${timeLeft<=3?.2:.05})`,
                border:`1px solid rgba(${timeLeft<=3?'239,68,68':'255,255,255'},${timeLeft<=3?.5:.12})`,
                borderRadius:10,padding:'5px 15px',fontWeight:800,fontSize:19,
                color:timeLeft<=3?'#fca5a5':'#fff',transition:'all .3s',
              }}>
                {activePU==='freeze'?<span style={{color:'#93c5fd'}}>❄️ FROZEN</span>:`⏱ ${timeLeft}s`}
              </div>
            )}
          </div>

          {/* Boss bar */}
          {scene.boss&&(
            <div style={{...glowCard('#ef4444'),marginBottom:10,position:'relative'}}>
              <div style={{display:'flex',justifyContent:'space-between',marginBottom:5}}>
                <span style={{fontWeight:800,color:'#fca5a5',fontSize:13}}>☠️ BOSS HEALTH</span>
                <span style={{color:'#ef4444',fontWeight:700}}>{bossHp}%</span>
              </div>
              <div style={{width:'100%',height:10,background:'rgba(0,0,0,0.5)',borderRadius:5,overflow:'hidden'}}>
                <div style={{height:'100%',width:`${bossHp}%`,background:'linear-gradient(90deg,#991b1b,#ef4444)',transition:'width .5s',borderRadius:5}}/>
              </div>
              {bossDmg&&<div style={{position:'absolute',top:-18,right:10,color:'#ef4444',fontWeight:800,fontSize:20,textShadow:'0 0 10px #ef4444'}}>-{bossDmg}</div>}
            </div>
          )}

          {/* Scene card */}
          <div style={{...glowCard(wld.color),marginBottom:12}}>
            <p style={{fontSize:16,fontWeight:500,marginBottom:14,lineHeight:1.7,opacity:.9}}>{scene.text}</p>

            {scene.type==='battle'&&(
              <div style={{background:'rgba(239,68,68,0.09)',border:'1px solid rgba(239,68,68,0.28)',borderRadius:8,
                padding:'7px 13px',marginBottom:12,fontSize:12,color:'#fca5a5'}}>
                ⚔️ Battle — type then press Enter (70%+ accuracy to win)
              </div>
            )}

            {/* Prompt */}
            <div style={{background:'rgba(0,0,0,0.3)',border:`1px solid rgba(${hexRgb(wld.color)},0.18)`,borderRadius:12,padding:'14px',marginBottom:12}}>
              <div style={{fontSize:10,opacity:.35,letterSpacing:'0.15em',marginBottom:6,textTransform:'uppercase'}}>Type this:</div>
              <div style={{fontSize:20,fontWeight:700,letterSpacing:'0.03em',lineHeight:1.9,display:'flex',flexWrap:'wrap'}}>
                {feedback.length>0
                  ? feedback.map((lf,i)=>(
                      <span key={i} style={{
                        color:lf.state==='correct'?'#4ade80':lf.state==='wrong'?'#ef4444':'rgba(255,255,255,.7)',
                        textDecoration:lf.state==='wrong'?'underline':'none',
                        textShadow:lf.state==='correct'?'0 0 7px rgba(74,222,128,.45)':lf.state==='wrong'?'0 0 7px rgba(239,68,68,.45)':'none',
                      }}>{lf.c}</span>
                    ))
                  : <span style={{color:`rgba(${hexRgb(wld.color)},0.85)`}}>{scene.prompt}</span>
                }
              </div>
            </div>

            <input
              ref={inputRef} value={inputVal} onChange={handleInput} onKeyDown={handleKey}
              placeholder="Start typing…" autoComplete="off" spellCheck="false" autoCorrect="off"
              style={{...inp,
                borderColor:inputVal.length>0?`rgba(${hexRgb(wld.color)},0.5)`:'rgba(255,255,255,0.15)',
                boxShadow:inputVal.length>0?`0 0 0 2px rgba(${hexRgb(wld.color)},0.12)`:'none',
              }}
            />

            {inputVal.length>0&&(
              <div style={{marginTop:7,display:'flex',gap:14,fontSize:11,opacity:.55}}>
                <span>🎯 {Math.round(calcAcc(scene.prompt,inputVal))}%</span>
                <span>✍️ {inputVal.length}/{scene.prompt.length}</span>
                {combo>0&&<span style={{color:'#f97316'}}>🔥 {combo}x</span>}
                {activePU==='double'&&<span style={{color:'#facc15',fontWeight:700}}>2× COINS!</span>}
              </div>
            )}
          </div>

          {scene.type==='battle'&&(
            <button onClick={()=>endScene(calcAcc(scene.prompt,inputVal)>65)}
              style={{...bigBtn('rgba(220,38,38,0.7)','rgba(239,68,68,0.55)'),width:'100%',marginBottom:12}}>
              ⚔️ Attack!
            </button>
          )}

          {/* Power-ups */}
          <div style={{display:'flex',gap:7,justifyContent:'center',flexWrap:'wrap'}}>
            {[{k:'shield',e:'🛡️',l:'Shield',d:'Block hit'},{k:'freeze',e:'❄️',l:'Freeze',d:'5s stop'},{k:'hint',e:'💡',l:'Hint',d:'2 words'},{k:'double',e:'2×',l:'Double',d:'2× coins 10s'}].map(pu=>(
              <button key={pu.k} onClick={()=>usePU(pu.k)} disabled={powerUps[pu.k]<=0} title={pu.d}
                style={{background:activePU===pu.k?'rgba(250,204,21,0.18)':'rgba(255,255,255,0.04)',
                  border:`1px solid ${activePU===pu.k?'#facc15':powerUps[pu.k]>0?'rgba(255,255,255,0.13)':'rgba(255,255,255,0.04)'}`,
                  borderRadius:10,padding:'8px 12px',color:powerUps[pu.k]>0?'#fff':'rgba(255,255,255,.2)',
                  cursor:powerUps[pu.k]>0?'pointer':'not-allowed',fontSize:11,fontWeight:600,
                  display:'flex',flexDirection:'column',alignItems:'center',gap:3,minWidth:62,
                  boxShadow:activePU===pu.k?'0 0 10px rgba(250,204,21,0.25)':'none'}}>
                <span style={{fontSize:18}}>{pu.e}</span>
                <span>{pu.l} ×{powerUps[pu.k]}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  /* ══ VICTORY ══ */
  if(screen==='victory') return(
    <div style={{...root,display:'flex',alignItems:'center',justifyContent:'center'}}>
      <div style={scanline}/>
      <div style={{...wrap(500),textAlign:'center'}}>
        <div style={{fontSize:72,marginBottom:6}}>🏆</div>
        <h1 style={{fontSize:44,fontWeight:900,color:'#facc15',margin:'0 0 4px',letterSpacing:'0.05em'}}>VICTORY!</h1>
        <p style={{opacity:.4,marginBottom:22,fontSize:13,textTransform:'uppercase',letterSpacing:'0.15em'}}>{wld.name} · {dc.label}</p>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:9,marginBottom:18}}>
          {[{l:'Final Score',v:score.toLocaleString(),c:'#a78bfa',i:'🏆'},
            {l:'Coins Earned',v:sessionCoins.toLocaleString(),c:'#facc15',i:'🪙'},
            {l:'Best WPM',v:stats.maxWpm,c:'#60a5fa',i:'⚡'},
            {l:'Max Combo',v:`${maxCombo}x`,c:'#f97316',i:'🔥'},
            {l:'Health Left',v:`${Math.round(hp)}/${maxHp}`,c:hp>60?'#4ade80':hp>30?'#facc15':'#ef4444',i:'❤️'},
            {l:'Perfect Scenes',v:stats.perfectScenes,c:'#4ade80',i:'💎'},
          ].map(s=><div key={s.l} style={card()}><div style={{fontSize:10,opacity:.4}}>{s.i} {s.l}</div><div style={{fontSize:24,fontWeight:900,color:s.c}}>{s.v}</div></div>)}
        </div>
        <div style={{display:'flex',gap:9,justifyContent:'center',flexWrap:'wrap'}}>
          <button onClick={()=>setScreen('menu')} style={bigBtn('rgba(124,58,237,0.8)','#9d5af0')}>Main Menu</button>
          <button onClick={()=>startGame(world)} style={bigBtn('rgba(37,99,235,0.8)','#3b82f6')}>Play Again</button>
        </div>
      </div>
    </div>
  );

  /* ══ GAME OVER ══ */
  if(screen==='gameover') return(
    <div style={{...root,display:'flex',alignItems:'center',justifyContent:'center'}}>
      <div style={scanline}/>
      <div style={{textAlign:'center',maxWidth:400,padding:'2rem',position:'relative',zIndex:2}}>
        <div style={{fontSize:72,marginBottom:6}}>💀</div>
        <h1 style={{fontSize:42,fontWeight:900,color:'#ef4444',margin:'0 0 4px',letterSpacing:'0.04em'}}>GAME OVER</h1>
        <p style={{opacity:.4,marginBottom:22,fontSize:13}}>Your health reached zero</p>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:9,marginBottom:22}}>
          {[{l:'Score',v:score.toLocaleString(),c:'#a78bfa'},{l:'Coins',v:sessionCoins.toLocaleString(),c:'#facc15'},
            {l:'Best WPM',v:stats.maxWpm,c:'#60a5fa'},{l:'Max Combo',v:`${maxCombo}x`,c:'#f97316'}
          ].map(s=><div key={s.l} style={card()}><div style={{fontSize:10,opacity:.4}}>{s.l}</div><div style={{fontSize:22,fontWeight:900,color:s.c}}>{s.v}</div></div>)}
        </div>
        <div style={{display:'flex',gap:9,justifyContent:'center'}}>
          <button onClick={()=>setScreen('menu')} style={bigBtn('rgba(124,58,237,0.8)','#9d5af0')}>Menu</button>
          <button onClick={()=>startGame(world)} style={bigBtn('rgba(220,38,38,0.8)','#ef4444')}>Retry</button>
        </div>
      </div>
    </div>
  );

  /* ══ MENU ══ */
  return(
    <div style={root}>
      <div style={scanline}/>
      <div style={{position:'fixed',top:-80,left:'22%',width:360,height:360,borderRadius:'50%',
        background:'radial-gradient(ellipse,rgba(124,58,237,0.05) 0%,transparent 70%)',pointerEvents:'none',zIndex:1}}/>
      <div style={{position:'fixed',bottom:-80,right:'18%',width:440,height:440,borderRadius:'50%',
        background:'radial-gradient(ellipse,rgba(37,99,235,0.04) 0%,transparent 70%)',pointerEvents:'none',zIndex:1}}/>

      {achToast&&(
        <div style={{position:'fixed',top:16,left:'50%',transform:'translateX(-50%)',zIndex:100,
          background:'rgba(5,5,20,0.96)',border:'1px solid #facc15',borderRadius:14,
          padding:'11px 22px',display:'flex',gap:11,alignItems:'center',
          boxShadow:'0 0 28px rgba(250,204,21,0.25)',minWidth:260}}>
          <span style={{fontSize:26}}>{achToast.icon}</span>
          <div>
            <div style={{color:'#facc15',fontWeight:700,fontSize:11,textTransform:'uppercase',letterSpacing:'0.1em'}}>Achievement Unlocked</div>
            <div style={{fontWeight:800,fontSize:15}}>{achToast.name}</div>
            <div style={{color:'rgba(255,255,255,0.4)',fontSize:11}}>+{achToast.xp} XP · {achToast.desc}</div>
          </div>
        </div>
      )}

      <div style={wrap()}>
        {/* Header */}
        <div style={{textAlign:'center',padding:'1.8rem 0 1.4rem'}}>
          <div style={{fontSize:52,fontWeight:900,letterSpacing:'-0.02em',marginBottom:3,
            background:'linear-gradient(135deg,#a78bfa,#60a5fa,#4ade80)',
            WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text'}}>
            ⚡ TYPE QUEST
          </div>
          <div style={{fontSize:11,opacity:.35,letterSpacing:'0.25em',textTransform:'uppercase',marginBottom:16}}>
            Master the Keys · Conquer the Realms
          </div>
          <div style={{display:'flex',justifyContent:'center',gap:10,flexWrap:'wrap',marginBottom:14}}>
            {[{l:'Level',v:level,c:'#a78bfa',i:'⭐'},{l:'Coins',v:coins.toLocaleString(),c:'#facc15',i:'🪙'},
              {l:'Best WPM',v:stats.maxWpm,c:'#60a5fa',i:'⚡'},{l:'Games',v:stats.games,c:'#4ade80',i:'🎮'}
            ].map(s=>(
              <div key={s.l} style={hudItem()}>
                <span style={{fontSize:13}}>{s.i}</span>
                <span style={{opacity:.45,fontSize:10}}>{s.l}</span>
                <span style={{fontWeight:700,color:s.c,fontSize:13}}>{s.v}</span>
              </div>
            ))}
          </div>
          <div style={{maxWidth:280,margin:'0 auto'}}>
            <div style={{display:'flex',justifyContent:'space-between',fontSize:10,opacity:.35,marginBottom:3}}>
              <span>XP {xp%500}</span><span>Lv {level+1}: {level*500}</span>
            </div>
            <div style={{width:'100%',height:4,background:'rgba(255,255,255,0.07)',borderRadius:4,overflow:'hidden'}}>
              <div style={{height:'100%',width:`${xpPct}%`,background:'linear-gradient(90deg,#a78bfa,#60a5fa)',borderRadius:4,transition:'width .5s'}}/>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{display:'flex',gap:5,marginBottom:20,overflowX:'auto',paddingBottom:3}}>
          {[['play','🎮 Play'],['daily','📅 Daily'],['skills','🌿 Skills'],['leaderboard','🏆 Ranks'],['shop','🛍️ Shop'],['profile','👤 Profile']].map(([k,l])=>(
            <button key={k} onClick={()=>setTab(k)} style={tabStyle(tab===k)}>{l}</button>
          ))}
        </div>

        {/* ── PLAY ── */}
        {tab==='play'&&(
          <div>
            <div style={{marginBottom:18}}>
              <div style={{fontSize:10,opacity:.35,letterSpacing:'0.15em',textTransform:'uppercase',marginBottom:9}}>Difficulty</div>
              <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:7}}>
                {Object.entries(diffConf).map(([k,d])=>(
                  <button key={k} onClick={()=>setDiff(k)}
                    style={{...btn(diff===k?`rgba(${hexRgb(d.col)},0.18)`:'rgba(255,255,255,0.03)',diff===k?d.col:'rgba(255,255,255,0.09)'),
                      padding:'9px 6px',textAlign:'center'}}>
                    <div style={{color:d.col,fontWeight:800,fontSize:13}}>{d.label}</div>
                    <div style={{fontSize:10,opacity:.5,marginTop:1}}>×{d.mult} coins</div>
                  </button>
                ))}
              </div>
            </div>
            <div style={{fontSize:10,opacity:.35,letterSpacing:'0.15em',textTransform:'uppercase',marginBottom:9}}>Choose Your World</div>
            <div style={{display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:9}}>
              {Object.entries(WORLDS).map(([id,w])=>(
                <button key={id} onClick={()=>startGame(id)}
                  style={{background:`linear-gradient(135deg,rgba(${hexRgb(w.color)},0.07),rgba(${hexRgb(w.glow)},0.03))`,
                    border:`1px solid rgba(${hexRgb(w.color)},0.28)`,borderRadius:13,padding:'16px',
                    textAlign:'left',cursor:'pointer',color:'#fff',transition:'all .2s'}}>
                  <div style={{fontSize:30,marginBottom:6}}>{w.emoji}</div>
                  <div style={{fontWeight:800,fontSize:14,color:w.accent,marginBottom:3}}>{w.name}</div>
                  <div style={{fontSize:11,opacity:.45}}>8 scenes · 1 boss fight</div>
                  {stats.worldsCleared.includes(id)&&<div style={{marginTop:5,fontSize:11,color:'#4ade80'}}>✓ Cleared</div>}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── DAILY ── */}
        {tab==='daily'&&(
          <div>
            <div style={{fontSize:10,opacity:.35,letterSpacing:'0.15em',textTransform:'uppercase',marginBottom:12}}>Daily Challenges — Reset in 14h 32m</div>
            <div style={{display:'flex',flexDirection:'column',gap:9}}>
              {DAILY_CHALLENGES.map(ch=>(
                <div key={ch.id} style={{...card(daily[ch.id]?'rgba(74,222,128,0.28)':'rgba(255,255,255,0.08)'),
                  display:'flex',alignItems:'center',justifyContent:'space-between',gap:12}}>
                  <div style={{display:'flex',gap:12,alignItems:'center'}}>
                    <div style={{fontSize:26}}>{ch.icon}</div>
                    <div>
                      <div style={{fontWeight:700,fontSize:14}}>{ch.name}</div>
                      <div style={{fontSize:11,opacity:.45,marginTop:1}}>{ch.desc}</div>
                    </div>
                  </div>
                  <div>
                    {daily[ch.id]
                      ? <span style={{color:'#4ade80',fontWeight:700,fontSize:12}}>✓ Done</span>
                      : <button onClick={()=>{setDaily(d=>({...d,[ch.id]:true}));setCoins(c=>c+ch.reward);}}
                          style={{...btn('rgba(250,204,21,0.13)','rgba(250,204,21,0.28)'),fontSize:11,padding:'5px 11px'}}>
                          Claim {ch.reward}🪙
                        </button>
                    }
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── SKILLS ── */}
        {tab==='skills'&&(
          <div>
            <div style={{fontSize:10,opacity:.35,letterSpacing:'0.15em',textTransform:'uppercase',marginBottom:12}}>Skill Tree — Coins: {coins.toLocaleString()} 🪙</div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:9}}>
              {Object.entries(SKILL_TREE).map(([key,sk])=>(
                <div key={key} style={card()}>
                  <div style={{display:'flex',alignItems:'center',gap:7,marginBottom:9}}>
                    <span style={{fontSize:20}}>{sk.icon}</span>
                    <div style={{fontWeight:700,fontSize:13}}>{sk.name}</div>
                    <div style={{marginLeft:'auto',fontSize:11,opacity:.4}}>Lv {skills[key]}/3</div>
                  </div>
                  <div style={{display:'flex',gap:4,marginBottom:9}}>
                    {[0,1,2].map(i=><div key={i} style={{flex:1,height:4,borderRadius:3,
                      background:i<skills[key]?'#a78bfa':'rgba(255,255,255,0.09)'}}/>)}
                  </div>
                  {skills[key]<3
                    ? <button onClick={()=>upgradeSkill(key)} style={{
                        ...btn('rgba(124,58,237,0.18)','rgba(167,139,250,0.38)'),
                        width:'100%',fontSize:11,padding:'7px',
                        opacity:coins>=SKILL_TREE[key].levels[skills[key]].cost?1:.35,
                        cursor:coins>=SKILL_TREE[key].levels[skills[key]].cost?'pointer':'not-allowed',
                      }}>
                        <div style={{color:'#c4b5fd',fontWeight:700}}>{SKILL_TREE[key].levels[skills[key]].bonus}</div>
                        <div style={{fontSize:10,opacity:.6,marginTop:2}}>{SKILL_TREE[key].levels[skills[key]].cost.toLocaleString()} 🪙</div>
                      </button>
                    : <div style={{textAlign:'center',color:'#4ade80',fontWeight:700,fontSize:12,padding:'5px'}}>✓ Max Level</div>
                  }
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── LEADERBOARD ── */}
        {tab==='leaderboard'&&(
          <div>
            <div style={{fontSize:10,opacity:.35,letterSpacing:'0.15em',textTransform:'uppercase',marginBottom:12}}>Global Leaderboard</div>
            <div style={{display:'flex',flexDirection:'column',gap:6}}>
              {[...LEADERBOARD_DATA,{rank:8,name:'YOU',wpm:stats.maxWpm,score,isYou:true}].map((p,i)=>(
                <div key={i} style={{...card(p.isYou?'rgba(250,204,21,0.3)':i<3?'rgba(167,139,250,0.18)':'rgba(255,255,255,0.06)'),
                  display:'flex',alignItems:'center',gap:12,
                  background:p.isYou?'rgba(250,204,21,0.05)':'rgba(255,255,255,0.04)'}}>
                  <div style={{fontSize:18,width:30,textAlign:'center',fontWeight:900,
                    color:i===0?'#facc15':i===1?'#94a3b8':i===2?'#cd7f32':'rgba(255,255,255,.35)'}}>
                    {i===0?'👑':i===1?'🥈':i===2?'🥉':p.rank}
                  </div>
                  <div style={{flex:1}}>
                    <div style={{fontWeight:p.isYou?800:600,color:p.isYou?'#facc15':'#fff',fontSize:14}}>
                      {p.name}{p.isYou?' (You)':''}
                    </div>
                    <div style={{fontSize:11,opacity:.45}}>{p.wpm} WPM</div>
                  </div>
                  <div style={{textAlign:'right'}}>
                    <div style={{fontWeight:700,color:'#a78bfa',fontSize:14}}>{p.score.toLocaleString()}</div>
                    <div style={{fontSize:10,opacity:.35}}>pts</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── SHOP ── */}
        {tab==='shop'&&(
          <div>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:12}}>
              <div style={{fontSize:10,opacity:.35,letterSpacing:'0.15em',textTransform:'uppercase'}}>Marketplace</div>
              <div style={{fontWeight:700,color:'#facc15',fontSize:14}}>🪙 {coins.toLocaleString()}</div>
            </div>
            <div style={{fontSize:11,opacity:.45,marginBottom:8}}>⚡ Power-Ups</div>
            <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:8,marginBottom:18}}>
              {[{k:'shield',e:'🛡️',l:'Shield',d:'Block 1 hit',cost:100},{k:'freeze',e:'❄️',l:'Freeze',d:'Stop timer 5s',cost:120},
                {k:'hint',e:'💡',l:'Hint',d:'Fill 2 words',cost:80},{k:'double',e:'2×',l:'Double',d:'2× coins 10s',cost:200}
              ].map(pu=>(
                <div key={pu.k} style={{...card(),textAlign:'center'}}>
                  <div style={{fontSize:24,marginBottom:4}}>{pu.e}</div>
                  <div style={{fontSize:11,fontWeight:600,marginBottom:1}}>{pu.l}</div>
                  <div style={{fontSize:10,opacity:.35,marginBottom:7}}>×{powerUps[pu.k]}</div>
                  <button onClick={()=>{if(coins>=pu.cost){setCoins(c=>c-pu.cost);setPowerUps(p=>({...p,[pu.k]:p[pu.k]+3}))}}}
                    disabled={coins<pu.cost}
                    style={{...btn('rgba(250,204,21,0.13)','rgba(250,204,21,0.3)'),padding:'4px',width:'100%',
                      fontSize:10,opacity:coins>=pu.cost?1:.35,cursor:coins>=pu.cost?'pointer':'not-allowed'}}>
                    +3 · {pu.cost}🪙
                  </button>
                </div>
              ))}
            </div>
            <div style={{fontSize:11,opacity:.35,marginBottom:8}}>🎨 Cosmetics</div>
            <div style={{...card(),opacity:.4,textAlign:'center',padding:'1.8rem',fontSize:13}}>
              More items unlock at higher levels — keep playing!
            </div>
          </div>
        )}

        {/* ── PROFILE ── */}
        {tab==='profile'&&(
          <div>
            <div style={{...glowCard('#a78bfa'),marginBottom:13}}>
              <div style={{display:'flex',gap:13,alignItems:'center',marginBottom:14}}>
                <div style={{width:56,height:56,borderRadius:'50%',
                  background:'linear-gradient(135deg,#7c3aed,#3b82f6)',
                  display:'flex',alignItems:'center',justifyContent:'center',fontSize:22,fontWeight:900}}>{level}</div>
                <div>
                  <div style={{fontWeight:800,fontSize:19}}>Type Master</div>
                  <div style={{opacity:.45,fontSize:12}}>Level {level} · {xp.toLocaleString()} XP total</div>
                </div>
              </div>
              <div style={{width:'100%',height:5,background:'rgba(0,0,0,0.3)',borderRadius:4,overflow:'hidden'}}>
                <div style={{height:'100%',width:`${xpPct}%`,background:'linear-gradient(90deg,#a78bfa,#60a5fa)',borderRadius:4,transition:'width .5s'}}/>
              </div>
            </div>
            <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:8,marginBottom:13}}>
              {[{l:'Max WPM',v:stats.maxWpm,c:'#60a5fa',i:'⚡'},{l:'Total Coins',v:coins.toLocaleString(),c:'#facc15',i:'🪙'},
                {l:'Games',v:stats.games,c:'#4ade80',i:'🎮'},{l:'Perfect Scenes',v:stats.perfectScenes,c:'#a78bfa',i:'💎'},
                {l:'Boss Kills',v:stats.bossKills,c:'#ef4444',i:'☠️'},{l:'Worlds Cleared',v:`${stats.worldsCleared.length}/6`,c:'#f97316',i:'🌍'},
                {l:'Keys Typed',v:stats.totalChars.toLocaleString(),c:'#c4b5fd',i:'⌨️',span:true},
              ].map(s=>(
                <div key={s.l} style={{...card(),gridColumn:s.span?'1/-1':undefined}}>
                  <div style={{fontSize:10,opacity:.35,marginBottom:3}}>{s.i} {s.l}</div>
                  <div style={{fontSize:s.span?16:19,fontWeight:900,color:s.c}}>{s.v}</div>
                </div>
              ))}
            </div>
            <div style={{fontSize:10,opacity:.35,letterSpacing:'0.15em',textTransform:'uppercase',marginBottom:9}}>
              Achievements — {Object.keys(achievements).length}/{Object.keys(ACHIEVEMENTS).length}
            </div>
            <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:7}}>
              {Object.entries(ACHIEVEMENTS).map(([key,ach])=>{
                const unlocked=achievements[key];
                return(
                  <div key={key} title={ach.desc} style={{...card(unlocked?'rgba(250,204,21,0.28)':'rgba(255,255,255,0.04)'),
                    textAlign:'center',opacity:unlocked?1:.28,transition:'opacity .2s',padding:'10px 6px'}}>
                    <div style={{fontSize:22,marginBottom:3}}>{ach.icon}</div>
                    <div style={{fontSize:10,fontWeight:600,lineHeight:1.3}}>{ach.name}</div>
                    {unlocked&&<div style={{fontSize:9,color:'#facc15',marginTop:2}}>+{ach.xp}xp</div>}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
