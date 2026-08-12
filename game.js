(() => {
  'use strict';

  const app = document.getElementById('app');
  const progressDots = document.getElementById('progressDots');
  const toast = document.getElementById('toast');
  const confettiBox = document.getElementById('confetti');
  const soundBtn = document.getElementById('soundBtn');
  const homeBtn = document.getElementById('homeBtn');
  const teacherBtn = document.getElementById('teacherBtn');
  const teacherModal = document.getElementById('teacherModal');
  const closeTeacher = document.getElementById('closeTeacher');

  const state = {
    screen: 0,
    mission: 0,
    score: 0,
    sound: true,
    backpackDone: new Set(),
    outfitDone: new Set(),
    journeyStop: 0,
    journeyStage: 'weather',
    campStep: 0,
    routineRound: 0,
    routinePick: 0,
  };

  const missionTitles = [
    ['Pack the backpack', 'What do we need for a summer camp?'],
    ['Dress for the hike', 'Choose the best clothes for our campers.'],
    ['Weather trail', 'The weather changes on our journey!'],
    ['Make camp', 'We are by the river. Let’s set up camp.'],
    ['Camp day', 'Put our camping day in the right order.'],
    ['Sunset celebration', 'You finished the whole adventure!']
  ];

  const backpackItems = [
    { id:'tent', label:'a tent', icon:'i-tent', need:true },
    { id:'sleepingbag', label:'a sleeping bag', icon:'i-sleepingbag', need:true },
    { id:'cup', label:'a cup', icon:'i-cup', need:true },
    { id:'sandwich', label:'sandwiches', icon:'i-sandwich', need:true },
    { id:'apple', label:'apples', icon:'i-apple', need:true },
    { id:'water', label:'water', icon:'i-water', need:true },
    { id:'torch', label:'a torch', icon:'i-torch', need:true },
    { id:'cap', label:'a cap', icon:'i-cap', need:true },
    { id:'book', label:'a book', icon:'i-book', need:true },
    { id:'tv', label:'a TV', icon:'i-tv', need:false },
    { id:'heels', label:'high heels', icon:'i-heels', need:false },
    { id:'skateboard', label:'a skateboard', icon:'i-skateboard', need:false },
  ];

  const clothes = [
    {id:'shirt',label:'T-shirt',icon:'i-shirt',good:true},
    {id:'shorts',label:'shorts',icon:'i-shorts',good:true},
    {id:'cap',label:'cap',icon:'i-cap',good:true},
    {id:'boots',label:'hiking boots',icon:'i-boots',good:true},
    {id:'raincoat',label:'raincoat',icon:'i-raincoat',good:true},
    {id:'dress',label:'party dress',icon:'i-dress',good:false},
    {id:'slippers',label:'slippers',icon:'i-slippers',good:false},
    {id:'scarf',label:'thick scarf',icon:'i-scarf',good:false},
  ];

  const journey = [
    { key:'field', title:'In the field', weather:'It is sunny.', action:'They are picking flowers.', wrongWeather:['It is rainy.','It is snowy.'], wrongAction:['They are sleeping.','They are cooking.'] },
    { key:'forest', title:'In the forest', weather:'It is rainy.', action:'They are running.', wrongWeather:['It is sunny.','It is snowy.'], wrongAction:['They are swimming.','They are reading.'] },
    { key:'mountain', title:'In the mountains', weather:'It is snowy and windy.', action:'They are climbing.', wrongWeather:['It is hot and sunny.','It is rainy.'], wrongAction:['They are brushing their teeth.','They are having lunch.'] },
  ];

  const campSteps = [
    {text:'Put up the tent.', visual:'tent'},
    {text:'Unroll the sleeping bag.', visual:'bag'},
    {text:'Make a small fire with a grown-up.', visual:'fire'},
    {text:'Go to sleep in the tent.', visual:'sleep'},
  ];

  const routines = [
    [
      {id:'wake',label:'wake up',art:'sunrise'},
      {id:'getup',label:'get up',art:'bed'},
      {id:'dress',label:'get dressed',art:'shirt'},
      {id:'teeth',label:'brush teeth',art:'toothbrush'},
    ],
    [
      {id:'wash',label:'wash face',art:'wash'},
      {id:'breakfast',label:'have sandwiches for breakfast',art:'sandwich'},
      {id:'swim',label:'swim in the lake',art:'swim'},
      {id:'fire',label:'make a fire',art:'fire'},
    ],
    [
      {id:'cook',label:'cook',art:'cook'},
      {id:'lunch',label:'have lunch',art:'plate'},
      {id:'read',label:'read a book',art:'book'},
      {id:'ball',label:'play with a ball',art:'ball'},
    ],
    [
      {id:'dinner',label:'have dinner',art:'plate'},
      {id:'board',label:'play a board game',art:'boardgame'},
      {id:'bed',label:'go to bed',art:'bed'},
    ]
  ];

  const routineSentence = [
    'We wake up, get up, get dressed and brush our teeth.',
    'We wash our faces, have breakfast, swim and make a fire.',
    'We cook, have lunch, read a book and play with a ball.',
    'We have dinner, play a board game and go to bed.'
  ];

  let audioCtx = null;

  function initAudio(){
    if(!state.sound) return null;
    if(!audioCtx){
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if(audioCtx.state === 'suspended') audioCtx.resume();
    return audioCtx;
  }
  function tone(freq=440,dur=.12,type='sine',gain=.04,delay=0){
    const ctx=initAudio(); if(!ctx) return;
    const o=ctx.createOscillator(), g=ctx.createGain();
    o.type=type;o.frequency.value=freq;g.gain.value=gain;
    o.connect(g);g.connect(ctx.destination);
    const t=ctx.currentTime+delay;o.start(t);g.gain.setValueAtTime(gain,t);g.gain.exponentialRampToValueAtTime(.001,t+dur);o.stop(t+dur);
  }
  function sfx(kind){
    if(!state.sound) return;
    if(kind==='good'){tone(620,.12,'triangle',.05);tone(820,.16,'triangle',.04,.09)}
    else if(kind==='bad'){tone(210,.16,'square',.025);tone(160,.15,'square',.02,.09)}
    else if(kind==='click'){tone(380,.06,'sine',.025)}
    else if(kind==='whoosh'){tone(500,.18,'sine',.02);tone(850,.16,'sine',.016,.08)}
    else if(kind==='finish'){[523,659,784,1047].forEach((f,i)=>tone(f,.22,'triangle',.035,i*.11))}
  }

  function icon(id, cls=''){
    return `<svg class="${cls}" viewBox="0 0 120 100" aria-hidden="true"><use href="#${id}"></use></svg>`;
  }

  function backpackSVG(cls='open-backpack'){
    return `<svg class="backpack-svg ${cls}" viewBox="0 0 220 240" aria-label="Open backpack">
      <path class="strap" d="M62 71C53 38 68 18 110 18s57 20 48 53"/>
      <path class="body" d="M43 76c5-24 21-38 67-38s62 14 67 38l14 111c3 24-14 42-39 42H68c-25 0-42-18-39-42Z"/>
      <path class="opening" d="M48 75c18-18 106-18 124 0l-12 25c-31-9-70-9-100 0Z"/>
      <path class="pocket" d="M63 146h94v51c0 10-8 18-18 18H81c-10 0-18-8-18-18Z"/>
      <path class="lid" d="M49 77c6-26 23-42 61-42s55 16 61 42c-35-12-86-12-122 0Z" fill="#79c8ff" stroke="#274d9d" stroke-width="6"/>
      <path d="M100 162h20" stroke="#274d9d" stroke-width="7" stroke-linecap="round"/>
    </svg>`;
  }

  function renderProgress(){
    progressDots.innerHTML='';
    for(let i=1;i<=6;i++){
      const d=document.createElement('span');
      d.className='progress-dot'+(state.mission>i?' done':state.mission===i?' active':'');
      d.textContent=state.mission>i?'✓':i;
      d.setAttribute('aria-label',`Mission ${i}${state.mission>i?' complete':state.mission===i?' current':''}`);
      progressDots.appendChild(d);
    }
  }

  function setMission(n){ state.mission=n; renderProgress(); }
  function addScore(n=1){state.score+=n;const el=document.querySelector('[data-score]');if(el)el.textContent=state.score;}
  function showToast(msg,type='good'){
    toast.textContent=msg;toast.className=`toast ${type} show`;
    clearTimeout(showToast.t);showToast.t=setTimeout(()=>toast.className='toast',1300);
  }
  function burstConfetti(amount=38){
    confettiBox.innerHTML='';
    for(let i=0;i<amount;i++){
      const p=document.createElement('i');p.style.left=Math.random()*100+'vw';p.style.setProperty('--dx',(Math.random()*260-130)+'px');p.style.animationDelay=(Math.random()*.35)+'s';confettiBox.appendChild(p);
    }
    setTimeout(()=>confettiBox.innerHTML='',2200);
  }

  function missionHead(num){
    const [title,sub]=missionTitles[num-1];
    return `<div class="mission-head"><div class="num">${num}</div><div class="mission-copy"><div class="mission-label">MISSION ${num} OF 6</div><h2>${title}</h2><p>${sub}</p></div><div class="spacer"></div><div class="score-chip"><span class="score-star">★</span> Stars <b data-score>${state.score}</b></div></div>`;
  }

  function home(){
    setMission(0);
    app.innerHTML=`<section class="screen hero-screen">
      <div class="hero-cloud"></div>
      <div class="hero-content">
        <div class="hero-copy">
          <div class="star-badge"><span class="star-shape"></span> ENGLISH ADVENTURE · A1</div>
          <div class="eyebrow" style="margin-top:20px">SUMMER CAMP GAME</div>
          <h1>Camp <span class="accent">Quest</span></h1>
          <p>Pack your bag, dress for the hike, cross sunny fields, rainy forests and windy mountains — then enjoy a full day at camp!</p>
          <button class="primary-btn" id="startGame">Start adventure</button>
        </div>
        <div class="hero-art" aria-hidden="true">
          <div class="hill one"></div><div class="hill two"></div>
          <svg class="big-tent" viewBox="0 0 120 100"><use href="#i-tent"></use></svg>
          ${backpackSVG('big-backpack')}
        </div>
      </div>
    </section>`;
    document.getElementById('startGame').onclick=()=>{state.score=0;sfx('click');mission1();};
  }

  function mission1(){
    setMission(1);
    state.backpackDone=new Set();
    const left=backpackItems.slice(0,6), right=backpackItems.slice(6);
    app.innerHTML=`<section class="screen mission-screen theme-m1">${missionHead(1)}
      <div class="panel backpack-stage" id="backpackStage">
        <div class="challenge-bar"><strong>Tap an item. Do we need it?</strong><small>Say: “We need …” or “We don’t need …”</small></div>
        <div class="items-zone left">${left.map(itemCard).join('')}</div>
        <div class="backpack-zone">${backpackSVG()}</div>
        <div class="items-zone right">${right.map(itemCard).join('')}</div>
        <div id="needPop" class="choice-pop hidden"></div>
      </div>
    </section>`;
    document.querySelectorAll('.item-card').forEach(btn=>btn.onclick=()=>openNeedChoice(btn.dataset.id));
  }

  function itemCard(x){return `<button class="item-card" data-id="${x.id}" aria-label="${x.label}">${icon(x.icon)}<span>${x.label}</span></button>`}

  function openNeedChoice(id){
    const item=backpackItems.find(x=>x.id===id); if(!item || state.backpackDone.has(id))return;
    sfx('click');
    document.querySelectorAll('.item-card').forEach(x=>x.classList.toggle('active',x.dataset.id===id));
    const pop=document.getElementById('needPop');pop.classList.remove('hidden');
    pop.innerHTML=`<div class="eyebrow">CAMP CHECK</div><h3>Do we need ${item.label}?</h3><p>Choose the best answer.</p><div class="choice-row"><button class="choice-btn yes">We need it!</button><button class="choice-btn no">We don’t need it!</button></div>`;
    pop.querySelector('.yes').onclick=()=>checkNeed(item,true);
    pop.querySelector('.no').onclick=()=>checkNeed(item,false);
  }

  function checkNeed(item,answer){
    const pop=document.getElementById('needPop');
    if(answer===item.need){
      sfx(item.need?'whoosh':'good');addScore();state.backpackDone.add(item.id);
      const card=document.querySelector(`.item-card[data-id="${item.id}"]`);
      if(item.need){
        const target=document.querySelector('.open-backpack');
        if(target){
          const a=card.getBoundingClientRect(), b=target.getBoundingClientRect();
          card.style.setProperty('--pack-x',`${b.left+b.width*.5-(a.left+a.width*.5)}px`);
          card.style.setProperty('--pack-y',`${b.top+b.height*.58-(a.top+a.height*.5)}px`);
        }
      }else{
        const a=card.getBoundingClientRect();
        const dir=(a.left+a.width*.5)<innerWidth*.5?-1:1;
        card.style.setProperty('--fly-x',`${dir*(innerWidth*.52)}px`);
      }
      card.classList.remove('active');card.classList.add(item.need?'packed':'rejected');
      pop.classList.add('hidden');
      showToast(item.need?`Yes! We need ${item.label}.`:`Right! We don’t need ${item.label}.`,'good');
      setTimeout(()=>card.classList.add('done'),700);
      if(state.backpackDone.size===backpackItems.length) setTimeout(backpackGrammar,900);
    }else{
      sfx('bad');showToast('Try again — think about camping!','bad');
      pop.animate([{transform:'translate(-50%,-50%) translateX(-7px)'},{transform:'translate(-50%,-50%) translateX(7px)'},{transform:'translate(-50%,-50%)'}],{duration:280});
    }
  }

  function backpackGrammar(){
    app.innerHTML=`<section class="screen mission-screen theme-m1">${missionHead(1)}
      <div class="panel grammar-card"><div class="badge-round"><span class="star-shape"></span></div><div class="eyebrow">BONUS LANGUAGE CHECK</div><h2>What have we got?</h2><div class="prompt">We ______ a tent.</div><div class="answer-grid"><button class="answer-btn" data-ok="1">have got</button><button class="answer-btn">has got</button><button class="answer-btn">haven’t got</button><button class="answer-btn">is</button></div><p class="small-note">Say the whole sentence aloud before you click.</p></div>
    </section>`;
    document.querySelectorAll('.answer-btn').forEach(b=>b.onclick=()=>{
      if(b.dataset.ok){sfx('good');addScore(2);b.classList.add('correct-flash');burstConfetti(24);setTimeout(()=>missionComplete(1,mission2),650)}
      else{sfx('bad');b.classList.add('wrong-flash');setTimeout(()=>b.classList.remove('wrong-flash'),350)}
    });
  }

  function missionComplete(num,next){
    setMission(Math.min(num+1,6));
    app.innerHTML=`<section class="screen completion-screen"><div class="completion-layout"><div class="mission-postcard" style="--mission-art:url('assets/mission-${num}.webp')"><span class="postcard-badge">Mission ${num} ✓</span></div><div class="panel mission-complete"><div class="badge-round"><span class="star-shape"></span></div><div class="eyebrow">MISSION COMPLETE</div><h2>${missionTitles[num-1][0]} — done!</h2><p>Great English! Ready for the next part of our camping adventure?</p><div class="complete-stars">★ ★ ★</div><button class="primary-btn" id="nextMission">Next mission</button></div></div></section>`;
    burstConfetti(35);sfx('finish');document.getElementById('nextMission').onclick=()=>{sfx('click');next();};
  }

  function camperSVG(){
    return `<svg class="camper" viewBox="0 0 260 430" aria-label="Camper">
      <ellipse cx="130" cy="405" rx="82" ry="12" fill="rgba(61,70,90,.12)"/>
      <path d="M85 170 56 253" class="line" fill="none"/><path d="M175 170 204 253" class="line" fill="none"/>
      <circle cx="130" cy="78" r="49" class="skin"/>
      <path d="M83 76c0-45 29-64 61-55 23 6 36 27 32 58-18-9-31-24-36-39-9 21-30 33-57 36Z" class="hair"/>
      <circle cx="113" cy="79" r="4" fill="#384052"/><circle cx="147" cy="79" r="4" fill="#384052"/><path d="M117 98c8 6 18 6 26 0" fill="none" stroke="#a95f5d" stroke-width="4" stroke-linecap="round"/>
      <path d="M91 137c11-12 27-18 39-18s28 6 39 18l15 112H76Z" class="base-shirt" stroke="#444d63" stroke-width="5"/>
      <path d="M78 245h104l-12 74h-34l-6-45-7 45H90Z" class="base-shorts" stroke="#444d63" stroke-width="5"/>
      <path d="M95 315 82 390" class="line"/><path d="M166 315 180 390" class="line"/><path d="M69 388h42v24H63c-8 0-11-12-4-17Z" class="shoe"/><path d="M153 388h42l10 7c7 5 4 17-4 17h-48Z" class="shoe"/>
      <g id="wear-shirt" class="wear-layer"><path d="M91 137 65 157l13 28 13-11v74h78v-74l13 11 13-28-26-20c-10 13-68 13-78 0Z" fill="#ff6f7d" stroke="#444d63" stroke-width="5"/></g>
      <g id="wear-shorts" class="wear-layer"><path d="M78 245h104l-10 77-37-2-5-46-7 46-35 2Z" fill="#57b5ff" stroke="#444d63" stroke-width="5"/></g>
      <g id="wear-cap" class="wear-layer"><path d="M90 49c9-30 33-39 55-30 14 6 25 20 27 38-28-9-54-9-82-8Z" fill="#4bbcff" stroke="#444d63" stroke-width="5"/><path d="M145 51c29-2 47 5 59 17-25 6-43 4-59-4Z" fill="#64c9ff" stroke="#444d63" stroke-width="5"/></g>
      <g id="wear-boots" class="wear-layer"><path d="M76 355h32v34c10 8 19 11 32 11v16H68c-9 0-12-10-7-17l15-15Z" fill="#8b674e" stroke="#443c43" stroke-width="5"/><path d="M155 355h32v34c10 8 19 11 32 11v16h-72c-9 0-12-10-7-17l15-15Z" fill="#966f53" stroke="#443c43" stroke-width="5"/></g>
      <g id="wear-raincoat" class="wear-layer"><path d="M91 137c12-12 26-18 39-18s27 6 39 18l17 115H74Z" fill="rgba(255,213,70,.88)" stroke="#4c465d" stroke-width="5"/><path d="M130 128v117" stroke="#d9ae33" stroke-width="4"/></g>
    </svg>`;
  }

  function mission2(){
    setMission(2);state.outfitDone=new Set();
    const left=clothes.slice(0,4),right=clothes.slice(4);
    app.innerHTML=`<section class="screen mission-screen theme-m2">${missionHead(2)}<div class="panel dress-stage"><div class="outfit-meter">Good clothes: <b id="outfitCount">0</b>/5</div><div class="wardrobe left">${left.map(clothingCard).join('')}</div><div class="camper-wrap">${camperSVG()}</div><div class="wardrobe right">${right.map(clothingCard).join('')}</div></div></section>`;
    document.querySelectorAll('.clothing-card').forEach(b=>b.onclick=()=>chooseClothes(b.dataset.id,b));
  }
  function clothingCard(x){return `<button class="clothing-card" data-id="${x.id}">${icon(x.icon)}<span>${x.label}</span></button>`}
  function chooseClothes(id,btn){
    const x=clothes.find(c=>c.id===id);sfx('click');
    if(!x.good){sfx('bad');btn.classList.add('wrong');showToast(`Not the best choice for our hike!`,'bad');setTimeout(()=>btn.classList.remove('wrong'),500);return;}
    if(state.outfitDone.has(id))return;state.outfitDone.add(id);addScore();btn.classList.add('selected');
    const layer=document.getElementById(`wear-${id}`);if(layer)layer.classList.add('on');
    document.getElementById('outfitCount').textContent=state.outfitDone.size;sfx('good');showToast(`Great! The camper is wearing ${x.label}.`,'good');
    if(state.outfitDone.size===5)setTimeout(outfitDescribe,700);
  }

  function miniHero(color='#ff6f7d',pants='#54a8e9',hair='#6a4434'){
    return `<svg viewBox="0 0 150 190" aria-hidden="true"><ellipse cx="75" cy="180" rx="43" ry="7" fill="rgba(55,63,90,.12)"/><circle cx="75" cy="43" r="25" fill="#efb183"/><path d="M50 42c1-23 15-35 33-31 14 3 22 15 20 31-10-5-19-13-23-23-5 12-15 20-30 23Z" fill="${hair}"/><path d="M51 69c16-10 32-10 48 0l10 57H41Z" fill="${color}" stroke="#46506a" stroke-width="3"/><path d="M45 124h60l-7 36H78l-3-22-4 22H52Z" fill="${pants}" stroke="#46506a" stroke-width="3"/><path d="M57 159 52 178M91 159l7 19" stroke="#46506a" stroke-width="6" stroke-linecap="round"/><path d="M52 178h20M94 178h20" stroke="#7d6a59" stroke-width="9" stroke-linecap="round"/><path d="M50 27c11-12 37-15 50 4" fill="none" stroke="#48b8ff" stroke-width="8" stroke-linecap="round"/></svg>`;
  }

  function outfitDescribe(){
    app.innerHTML=`<section class="screen mission-screen theme-m2">${missionHead(2)}<div style="width:min(1050px,100%)"><div class="eyebrow" style="text-align:center">LOOK & SAY</div><h2 style="text-align:center">What are they wearing?</h2><div class="hero-cards"><div class="panel mini-hero">${miniHero('#ff6f7d','#5eaff0')}<div class="tag">Mia</div></div><div class="panel mini-hero">${miniHero('#66c676','#536dd8','#4d332c')}<div class="tag">Ben</div></div><div class="panel mini-hero">${miniHero('#ffd65f','#7c6bca','#8a5c38')}<div class="tag">Leo</div></div></div><div class="panel grammar-card"><div class="prompt">Mia ______ a T-shirt and shorts.</div><div class="answer-grid"><button class="answer-btn" data-ok="1">is wearing</button><button class="answer-btn">are wearing</button><button class="answer-btn">wear</button><button class="answer-btn">has wear</button></div></div></div></section>`;
    document.querySelectorAll('.answer-btn').forEach(b=>b.onclick=()=>{if(b.dataset.ok){sfx('good');addScore(2);b.classList.add('correct-flash');setTimeout(()=>missionComplete(2,mission3),650)}else{sfx('bad');b.classList.add('wrong-flash');setTimeout(()=>b.classList.remove('wrong-flash'),350)}})
  }

  function landscapeMarkup(index){
    const x=journey[index];
    if(x.key==='field')return `<div class="landscape field" data-scene="0"><div class="scene-sky"></div><div class="scene-ground"></div><div class="sun-orb"></div><div class="cloud-shape" style="left:14%;top:13%"></div>${[14,23,34,46,58,70].map((v,i)=>`<span class="flower" style="left:${v}%;height:${35+i%3*8}px"></span>`).join('')}</div>`;
    if(x.key==='forest')return `<div class="landscape forest hidden-scene" data-scene="1"><div class="scene-sky"></div><div class="scene-ground"></div>${[7,21,37,55,70,84].map((v,i)=>`<span class="tree" style="left:${v}%;transform:scale(${.8+(i%3)*.13})"></span>`).join('')}${Array.from({length:22},(_,i)=>`<i class="rain-drop" style="left:${(i*11)%100}%;top:${-50+(i%5)*28}px;animation-delay:${(i%7)*.13}s"></i>`).join('')}</div>`;
    return `<div class="landscape mountain hidden-scene" data-scene="2"><div class="scene-sky"></div><div class="scene-ground"></div><div class="peak" style="left:4%;transform:scale(.85)"></div><div class="peak" style="left:28%;"></div><div class="peak" style="left:58%;transform:scale(.78)"></div>${[18,43,68].map((v,i)=>`<div class="wind-line" style="top:${20+i*18}%;left:${-10-i*14}%;animation-delay:${i*.45}s"></div>`).join('')}</div>`;
  }

  function mission3(){
    setMission(3);state.journeyStop=0;state.journeyStage='weather';
    app.innerHTML=`<section class="screen mission-screen theme-m3">${missionHead(3)}<div class="panel journey-stage" id="journeyStage">${landscapeMarkup(0)}${landscapeMarkup(1)}${landscapeMarkup(2)}<div class="walkers"><div class="walker"><div class="head"></div><div class="body"></div><div class="bag"></div><div class="leg l"></div><div class="leg r"></div></div><div class="walker"><div class="head"></div><div class="body"></div><div class="bag"></div><div class="leg l"></div><div class="leg r"></div></div></div><div class="panel stop-card" id="stopCard"></div></div></section>`;
    renderJourneyQuestion();
  }

  function renderJourneyQuestion(){
    const x=journey[state.journeyStop], card=document.getElementById('stopCard');
    const isWeather=state.journeyStage==='weather';
    const correct=isWeather?x.weather:x.action;
    const wrongs=isWeather?x.wrongWeather:x.wrongAction;
    const choices=shuffle([correct,...wrongs]);
    card.innerHTML=`<div class="eyebrow">STOP ${state.journeyStop+1} · ${x.title}</div><h3>${isWeather?'What’s the weather like?':'What are they doing?'}</h3><p>Say your answer, then choose it.</p><div class="${isWeather?'weather-options':'action-options'}">${choices.map(c=>`<button class="mini-choice" data-answer="${escapeAttr(c)}">${c}</button>`).join('')}</div><div class="stop-progress"><span class="${state.journeyStop>=0?'on':''}"></span><span class="${state.journeyStop>=1?'on':''}"></span><span class="${state.journeyStop>=2?'on':''}"></span></div>`;
    card.querySelectorAll('.mini-choice').forEach(b=>b.onclick=()=>checkJourney(b,b.dataset.answer===correct));
  }
  function checkJourney(btn,ok){
    if(!ok){sfx('bad');btn.classList.add('nope');showToast('Look at the picture and try again.','bad');setTimeout(()=>btn.classList.remove('nope'),380);return;}
    sfx('good');addScore();btn.classList.add('ok');showToast('Yes! Great sentence.','good');
    if(state.journeyStage==='weather'){state.journeyStage='action';setTimeout(renderJourneyQuestion,450)}
    else if(state.journeyStop<2){state.journeyStop++;state.journeyStage='weather';setTimeout(()=>{document.querySelectorAll('.landscape').forEach((el,i)=>el.classList.toggle('hidden-scene',i!==state.journeyStop));renderJourneyQuestion();},500)}
    else setTimeout(()=>missionComplete(3,mission4),650);
  }

  function mission4(){
    setMission(4);state.campStep=0;
    app.innerHTML=`<section class="screen mission-screen theme-m4">${missionHead(4)}<div class="panel camp-stage"><div class="sun-orb" style="right:11%;top:8%"></div><div class="cloud-shape" style="left:10%;top:12%"></div><div class="river"></div><svg class="camp-tent" viewBox="0 0 120 100"><use href="#i-tent"></use></svg><svg class="sleeping-bag" viewBox="0 0 120 100"><use href="#i-sleepingbag"></use></svg><svg class="camp-fire" viewBox="0 0 120 100"><use href="#i-fire"></use></svg><div class="panel sequence-panel"><div class="eyebrow">RIVER CAMP</div><h3>What do we do first?</h3><p>Tap the actions in the correct order.</p><div class="sequence-list">${shuffle(campSteps.map((x,i)=>({x,i}))).map(({x,i})=>`<button class="seq-btn" data-step="${i}">${x.text}</button>`).join('')}</div><div class="can-strip">We <b>can</b> swim in the river when a grown-up says it is safe.<div class="safety">At camp, fire and water activities are always with an adult.</div></div></div></div></section>`;
    document.querySelectorAll('.seq-btn').forEach(b=>b.onclick=()=>chooseCampStep(b));
  }
  function chooseCampStep(btn){
    const n=Number(btn.dataset.step);
    if(n!==state.campStep){sfx('bad');btn.classList.add('wrong');showToast(`Try again. What do we do ${state.campStep===0?'first':'next'}?`,'bad');setTimeout(()=>btn.classList.remove('wrong'),350);return;}
    sfx('good');addScore();btn.classList.add('done');btn.textContent='✓ '+campSteps[n].text;showToast('Good order!','good');
    if(n===0)document.querySelector('.camp-tent').classList.add('on');
    if(n===1)document.querySelector('.sleeping-bag').classList.add('on');
    if(n===2)document.querySelector('.camp-fire').classList.add('on');
    state.campStep++;
    if(state.campStep===campSteps.length)setTimeout(campCanCheck,700);
  }

  function campCanCheck(){
    app.innerHTML=`<section class="screen mission-screen theme-m4">${missionHead(4)}<div class="panel grammar-card"><div class="eyebrow">CAN / CAN’T</div><h2>Choose the safe camping sentence.</h2><div class="prompt">At camp, children ______ make a fire alone.</div><div class="answer-grid"><button class="answer-btn">can</button><button class="answer-btn" data-ok="1">can’t</button></div><p class="small-note">A grown-up must help with a campfire.</p></div></section>`;
    document.querySelectorAll('.answer-btn').forEach(b=>b.onclick=()=>{if(b.dataset.ok){sfx('good');addScore(2);b.classList.add('correct-flash');setTimeout(()=>missionComplete(4,mission5),650)}else{sfx('bad');b.classList.add('wrong-flash');setTimeout(()=>b.classList.remove('wrong-flash'),350)}})
  }

  function routineArt(x){
    const map={bed:'i-bed',shirt:'i-shirt',toothbrush:'i-toothbrush',sandwich:'i-sandwich',swim:'i-swim',fire:'i-fire',plate:'i-plate',book:'i-book',ball:'i-ball',boardgame:'i-boardgame'};
    if(map[x]) return icon(map[x]);
    if(x==='sunrise') return `<div class="routine-art"><span style="width:54px;height:54px;border-radius:50%;background:#ffd45e;display:block;box-shadow:0 0 0 10px rgba(255,212,94,.22)"></span></div>`;
    if(x==='wash') return `<div class="routine-art"><span style="width:52px;height:36px;border-radius:50% 50% 45% 45%;background:#71c9f1;display:block;position:relative"><i style="position:absolute;width:8px;height:8px;border-radius:50%;background:#fff;left:8px;top:5px;box-shadow:16px 9px #fff,31px -2px #fff"></i></span></div>`;
    if(x==='cook') return `<div class="routine-art"><span style="width:56px;height:36px;border-radius:8px 8px 16px 16px;background:#747f98;display:block;position:relative"><i style="position:absolute;left:8px;right:8px;top:-7px;height:6px;background:#596278;border-radius:9px"></i><i style="position:absolute;width:48px;height:5px;background:#596278;right:-41px;top:13px;border-radius:5px"></i></span></div>`;
    return `<div class="routine-art"></div>`;
  }

  function mission5(){
    setMission(5);state.routineRound=0;state.routinePick=0;renderRoutineRound();
  }
  function renderRoutineRound(){
    const r=routines[state.routineRound];state.routinePick=0;
    const shuffled=shuffle(r.map((x,i)=>({x,i})));
    app.innerHTML=`<section class="screen mission-screen theme-m5">${missionHead(5)}<div class="panel routine-wrap"><div class="eyebrow" style="text-align:center">OUR CAMP DAY · PART ${state.routineRound+1} OF 4</div><h2 style="text-align:center">What do we do first, next, then…?</h2><div class="day-meter"><span style="width:${state.routineRound*25}%"></span></div><p class="round-hint">Tap the 4 activities in the right order.</p><div class="routine-round">${shuffled.map(({x,i})=>`<button class="routine-card" data-order="${i}">${routineArt(x.art)}<b>${x.label}</b><span class="order-num"></span></button>`).join('')}</div><div class="sentence-strip" id="routineSentence">Say: <span class="blank">What do we do first?</span></div></div></section>`;
    document.querySelectorAll('.routine-card').forEach(b=>b.onclick=()=>chooseRoutine(b));
  }
  function chooseRoutine(btn){
    const order=Number(btn.dataset.order);
    if(order!==state.routinePick){sfx('bad');btn.classList.add('wrong');showToast('Not yet — what happens before that?','bad');setTimeout(()=>btn.classList.remove('wrong'),350);return;}
    sfx('good');addScore();state.routinePick++;btn.classList.add('picked');btn.querySelector('.order-num').textContent=state.routinePick;
    const r=routines[state.routineRound];document.getElementById('routineSentence').innerHTML=`Say: <span class="blank">We ${r[order].label}.</span>`;
    if(state.routinePick===r.length){
      const meter=document.querySelector('.day-meter span');meter.style.width=((state.routineRound+1)*25)+'%';
      setTimeout(()=>{
        showToast(routineSentence[state.routineRound],'good');
        if(state.routineRound<routines.length-1){state.routineRound++;setTimeout(renderRoutineRound,900)}else setTimeout(routineGrammar,900);
      },500);
    }
  }

  function routineGrammar(){
    app.innerHTML=`<section class="screen mission-screen theme-m5">${missionHead(5)}<div class="panel grammar-card"><div class="eyebrow">PRESENT SIMPLE</div><h2>Our camp routine</h2><div class="prompt">We ______ breakfast in the morning.</div><div class="answer-grid"><button class="answer-btn" data-ok="1">have</button><button class="answer-btn">has</button><button class="answer-btn">are having</button><button class="answer-btn">is</button></div><p class="small-note">Present Simple tells us about our routine.</p></div></section>`;
    document.querySelectorAll('.answer-btn').forEach(b=>b.onclick=()=>{if(b.dataset.ok){sfx('good');addScore(2);b.classList.add('correct-flash');setTimeout(()=>missionComplete(5,mission6),650)}else{sfx('bad');b.classList.add('wrong-flash');setTimeout(()=>b.classList.remove('wrong-flash'),350)}})
  }

  function mission6(){
    setMission(6);sfx('finish');burstConfetti(65);
    app.innerHTML=`<section class="screen sunset-screen"><div class="sunset-art" aria-hidden="true"></div><div class="finish-card"><div class="eyebrow">CAMP QUEST COMPLETE</div><div class="big-stars"><span class="star-shape"></span><span class="star-shape"></span><span class="star-shape"></span></div><h2>Fantastic camping team!</h2><p>You packed, dressed, travelled, made camp and planned a whole day in English.</p><div class="recap-tags"><span>have got</span><span>to be</span><span>can / can’t</span><span>Present Continuous</span><span>Present Simple</span></div><div class="score-chip" style="display:inline-block;margin-bottom:18px"><span class="score-star">★</span> Adventure stars: <b>${state.score}</b></div><div class="final-actions"><button class="primary-btn" id="playAgain">Play again</button><button class="secondary-btn" id="speakingBtn">Speaking challenge</button></div><p class="small-note" id="finalPrompt">Teacher: ask “What have you got in your backpack?” and “What do you do at camp?”</p></div></section>`;
    document.getElementById('playAgain').onclick=()=>{state.score=0;sfx('click');mission1();};
    document.getElementById('speakingBtn').onclick=()=>{
      const prompts=[
        'Say 3 things you have got in your backpack.',
        'Describe a camper: What is he or she wearing?',
        'Say 3 weather sentences: sunny, rainy, snowy.',
        'Say 3 things you can do at camp.',
        'Tell us your camp day: First…, then…, after that…'
      ];
      const p=prompts[Math.floor(Math.random()*prompts.length)];document.getElementById('finalPrompt').textContent=p;sfx('click');
    };
  }

  function shuffle(a){
    a=[...a];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a;
  }
  function escapeAttr(s){return String(s).replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;').replace(/>/g,'&gt;')}

  soundBtn.onclick=()=>{state.sound=!state.sound;soundBtn.classList.toggle('sound-on',state.sound);soundBtn.classList.toggle('sound-off',!state.sound);if(state.sound)sfx('good');};
  homeBtn.onclick=()=>{sfx('click');home();};
  teacherBtn.onclick=()=>{sfx('click');teacherModal.classList.remove('hidden');};
  closeTeacher.onclick=()=>teacherModal.classList.add('hidden');
  teacherModal.onclick=e=>{if(e.target===teacherModal)teacherModal.classList.add('hidden')};
  document.addEventListener('keydown',e=>{if(e.key==='Escape')teacherModal.classList.add('hidden')});

  home();
})();
