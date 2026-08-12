(() => {
'use strict';
const BASE_W=1672, BASE_H=941;
const app=document.getElementById('app');
const state={mission:1,selected:null,placed:{1:{},2:{},3:{},4:{},5:{},6:{}},storyIndex:0,meta:{2:{index:0},4:{answers:{},checked:false}}};

const icons={
 reset:()=>document.getElementById('icon-reset').innerHTML,
 next:()=>document.getElementById('icon-next').innerHTML,
 back:()=>document.getElementById('icon-back').innerHTML,
 check:()=>document.getElementById('icon-check').innerHTML,
 speech:()=>document.getElementById('icon-speech').innerHTML
};
const rect=(x,y,w,h)=>({x:x/BASE_W*100,y:y/BASE_H*100,w:w/BASE_W*100,h:h/BASE_H*100});
const pct=r=>`left:${r.x}%;top:${r.y}%;width:${r.w}%;height:${r.h}%;`;

const missions={
1:{
 sources:[
  ['sleeping-bag','sleeping bag',rect(185,455,240,210)],['mug','mug',rect(430,548,160,132)],['sandwiches','sandwiches',rect(110,636,340,159)],['apple','apple',rect(450,660,140,145)],
  ['map','map',rect(600,650,235,160)],['water-bottle','water bottle',rect(830,610,135,215)],['flashlight','flashlight',rect(945,650,155,135)],['book','book',rect(1065,635,220,195)],
  ['umbrella','umbrella',rect(1250,665,265,190)],['boots','hiking boots',rect(1115,485,210,195)],['teddy','teddy bear',rect(1280,490,210,230)],['ball','ball',rect(1440,625,225,200)]
 ],
 target:{id:'backpack',label:'backpack',rect:rect(640,285,355,365)}
},
2:{
 prompts:[
  {text:'He is wearing a blue cap.',answer:'cap'},
  {text:'He is wearing a green T-shirt.',answer:'green-shirt'},
  {text:'He is wearing shorts.',answer:'shorts'},
  {text:'She is wearing pink shoes.',answer:'pink-shoes'},
  {text:'They are wearing socks.',answer:'socks'}
 ],
 sources:[
  ['sun-hat','sun hat',rect(135,210,205,205)],['cap','blue cap',rect(325,210,185,205)],['green-shirt','green T-shirt',rect(135,395,200,170)],['blue-shirt','blue T-shirt',rect(325,395,195,175)],
  ['green-trousers','green trousers',rect(145,555,195,170)],['shorts','shorts',rect(325,555,195,170)],['blue-hoodie','blue hoodie',rect(1165,210,183,205)],['raincoat','yellow raincoat',rect(1345,205,190,210)],
  ['blue-trousers','blue trousers',rect(1160,395,185,185)],['pink-shorts','pink shorts',rect(1338,395,192,185)],['socks','socks',rect(485,595,180,140)],['boots','hiking boots',rect(665,600,170,140)],
  ['sandals','sandals',rect(815,600,170,140)],['pink-shoes','pink shoes',rect(965,590,180,150)],['green-backpack','green backpack',rect(1170,565,180,180)],['pink-backpack','pink backpack',rect(1330,565,185,180)]
 ],
 targets:[['boy','the boy',rect(545,120,255,500)],['girl','the girl',rect(855,120,245,500)]]
},
3:{
 sources:[['sunny','sunny',rect(150,600,210,230),'weather'],['rainy','rainy',rect(370,600,215,230),'weather'],['snowy-and-windy','snowy and windy',rect(590,600,210,230),'weather'],['pick-flowers','pick flowers',rect(800,600,220,230),'action'],['run','run',rect(1010,600,230,230),'action'],['climb','climb',rect(1235,600,245,230),'action']],
 targets:[['sunny-zone','sunny field',rect(0,90,555,500)],['rainy-zone','rainy forest',rect(555,90,555,500)],['snowy-zone','snowy mountain',rect(1110,90,562,500)]]
},
4:{
 story:[
  'Ben and Mia are going camping. Ben has got a backpack and a blue cap. Mia has got sandwiches and water. They have got a tent and sleeping bags.',
  "It is sunny in the morning. They are picking flowers in the field. It is rainy in the afternoon. They are running fast in the forest. They aren't climbing trees in the forest.",
  "It is evening now. Ben and Mia are in the mountains. It is cold and snowy. Let's climb down!"
 ],
 questions:[
  {id:'q1',text:'Ben has got a backpack.',answer:'true'},
  {id:'q2',text:'Mia has got a blue cap.',answer:'false'},
  {id:'q3',text:'They have got a tent.',answer:'true'},
  {id:'q4',text:'They are picking flowers in the forest.',answer:'false'},
  {id:'q5',text:'It is rainy in the forest.',answer:'true'},
  {id:'q6',text:'They are in the mountains in the evening.',answer:'true'}
 ]
},
5:{
 sources:[['wake-up','wake up',rect(28,605,170,145)],['get-up','get up',rect(198,605,167,145)],['get-dressed','get dressed',rect(360,605,165,145)],['brush-teeth','brush teeth',rect(515,605,165,145)],['wash-face','wash face',rect(675,605,160,145)],['breakfast','have sandwiches for breakfast',rect(825,605,150,145)],['swim','swim in the lake',rect(965,605,160,145)],['make-fire','make a fire',rect(1115,605,155,145)],['cook','cook',rect(1260,605,160,145)],['lunch','have lunch',rect(1410,605,175,145)],['read-book','read a book',rect(335,745,185,155)],['play-ball','play with a ball',rect(515,745,175,155)],['dinner','have dinner',rect(680,745,170,155)],['board-game','play a board game',rect(840,745,170,155)],['go-bed','go to bed',rect(995,745,190,155)]],
 slots:[
  rect(198,335,128,84),rect(174,398,128,84),rect(190,463,128,84),rect(252,510,128,84),rect(365,512,128,84),
  rect(490,498,128,84),rect(608,454,128,84),rect(720,432,128,84),rect(835,450,128,84),rect(974,402,128,84),
  rect(1070,367,128,84),rect(1168,320,128,84),rect(1280,286,128,84),rect(1382,304,128,84),rect(1420,374,128,84)
 ]
},
6:{
 sources:[['backpack','backpack',rect(285,600,190,110),'have'],['flashlight','flashlight',rect(468,600,174,110),'have'],['water','water bottle',rect(630,600,175,110),'have'],['sleeping-bag','sleeping bag',rect(795,600,170,110),'have'],['boots','hiking boots',rect(955,600,175,110),'wear'],['mug','mug',rect(1120,600,175,110),'have'],['sandwiches','sandwiches',rect(280,705,190,120),'have'],['raincoat','raincoat',rect(465,705,175,120),'wear'],['rainy','rainy',rect(630,705,175,120),'weather'],['sunny','sunny',rect(795,705,170,120),'weather'],['camp','camp by the river',rect(955,705,175,120),'camp'],['bedtime','go to bed',rect(1120,705,180,120),'routine']],
 targets:[['bubble-left','left speech bubble',rect(260,510,290,92)],['bubble-right','right speech bubble',rect(1040,515,280,92)]]
}
};

function sourceImg(m,id){return `assets/cards/m${m}/${id}.webp`}
function controlButton(kind,label,extra=''){
 return `<button class="round-control ${extra}" data-control="${kind}" aria-label="${label}" title="${label}">${icons[kind]()}</button>`;
}
function sourceHtml(m,s){
 const [id,label,r]=s;return `<button class="source" data-source="${id}" aria-label="${label}" title="${label}" style="${pct(r)}"><span class="mini-check">${icons.check()}</span></button>`;
}
function targetHtml(id,label,r,cls=''){return `<div class="target ${cls}" data-target="${id}" aria-label="${label}" style="${pct(r)}"></div>`}
function missionNav(){
 const xs=[[415,575],[585,748],[760,917],[925,1083],[1090,1248],[1255,1450]];
 return xs.map((p,i)=>`<button class="nav-hit" data-nav="${i+1}" aria-label="Mission ${i+1}" style="left:${p[0]/BASE_W*100}%;width:${(p[1]-p[0])/BASE_W*100}%"></button>`).join('');
}
function shell(m,overlay){
 return `<section class="game-shell" data-mission="${m}"><img class="art" src="assets/mission-${m}.webp" alt="Camp Quest Mission ${m} illustrated game field" draggable="false"><div class="layer">${missionNav()}${overlay}</div><div class="control-dock">${controlButton('reset','Reset this mission')}${m>1?controlButton('back','Previous mission'):''}</div><button class="next-control" data-control="next">${m===6?'Finish':'Next'} ${icons.next()}</button><div class="toast" id="toast"></div></section>`;
}

function renderMission(m){
 state.mission=m;state.selected=null;state.storyIndex=0;
 let overlay=''; const cfg=missions[m];
 if(m===1){overlay+=cfg.sources.map(s=>sourceHtml(m,s)).join('')+targetHtml(cfg.target.id,cfg.target.label,cfg.target.rect,'backpack-target');}
 if(m===2){overlay+=cfg.sources.map(s=>sourceHtml(m,s)).join('')+`<div class="mission2-panel"><div class="mission2-title">Read and click the right clothes.</div><div class="mission2-prompt" id="m2-prompt"></div><div class="mission2-progress" id="m2-progress"></div></div>`;}
 if(m===3){overlay+=cfg.sources.map(s=>sourceHtml(m,s)).join('')+cfg.targets.map(t=>targetHtml(t[0],t[1],t[2],'weather-zone')).join('')+`<div class="zone-tag" data-zone-tag="sunny-zone" style="left:3%;top:53%"></div><div class="zone-tag" data-zone-tag="rainy-zone" style="left:36%;top:53%"></div><div class="zone-tag" data-zone-tag="snowy-zone" style="left:68.5%;top:53%"></div><div class="zone-note" data-zone-note="sunny-zone" style="left:6%;top:9%"></div><div class="zone-note" data-zone-note="rainy-zone" style="left:38%;top:9%"></div><div class="zone-note" data-zone-note="snowy-zone" style="left:70%;top:9%"></div>`;}
 if(m===4){overlay+=`<div class="reading-panel"><h3>Mini story</h3><p>${cfg.story.join('<br><br>')}</p><div class="tf-list">${cfg.questions.map((q,i)=>`<div class=\"tf-item\" data-qwrap=\"${q.id}\"><div class=\"tf-text\">${i+1}. ${q.text}</div><div class=\"tf-actions\"><button class=\"tf-btn\" data-q=\"${q.id}\" data-value=\"true\">True</button><button class=\"tf-btn\" data-q=\"${q.id}\" data-value=\"false\">False</button></div><div class=\"tf-mark\" data-qmark=\"${q.id}\"></div></div>`).join('')}</div><button class="check4-btn" data-control="check4">Check true / false</button><div class="quiz-result" id="quiz4-result"></div></div><div class="reading-footer">Read the story. Choose <strong>True</strong> or <strong>False</strong>.</div>`;}
 if(m===5){overlay+=cfg.sources.map(s=>sourceHtml(m,s)).join('')+cfg.slots.map((r,i)=>targetHtml(`slot-${i}`,`Story position ${i+1}`,r,'path-slot')).join('')+`<button class="story-button" data-control="story">${icons.speech()} Tell my day</button>`;}
 if(m===6){overlay+=cfg.sources.map(s=>sourceHtml(m,s)).join('')+cfg.targets.map(t=>targetHtml(t[0],t[1],t[2],'story-target')).join('');}
 app.innerHTML=shell(m,overlay); bind(); restoreMission(m); if(new URLSearchParams(location.search).get('qa')==='1') runQA();
}

function bind(){
 const shell=document.querySelector('.game-shell');
 shell.querySelectorAll('[data-nav]').forEach(b=>b.addEventListener('click',()=>renderMission(+b.dataset.nav)));
 shell.querySelectorAll('[data-control]').forEach(b=>b.addEventListener('click',()=>handleControl(b.dataset.control)));
 shell.querySelectorAll('.tf-btn').forEach(b=>b.addEventListener('click',()=>pickTF(b.dataset.q,b.dataset.value)));
 shell.querySelectorAll('.source').forEach(src=>{
   if(state.mission!==2) src.addEventListener('pointerdown',e=>startDrag(e,src.dataset.source,false));
   src.addEventListener('click',e=>{
     if(e.detail===0||!src.dataset.dragged){
       if(state.mission===2){mission2Pick(src.dataset.source);}
       else if(src.classList.contains('used')) toggleUsedSource(src.dataset.source);
       else selectSource(src.dataset.source);
     }
     delete src.dataset.dragged;
   });
 });
 shell.querySelectorAll('.target').forEach(t=>t.addEventListener('click',()=>{if(state.selected)placeSelected(t.dataset.target,t)}));
}
function handleControl(c){
 if(c==='reset'){state.placed[state.mission]={}; if(state.mission===2) state.meta[2].index=0; if(state.mission===4){state.meta[4]={answers:{},checked:false}}; renderMission(state.mission)}
 else if(c==='back'){renderMission(Math.max(1,state.mission-1))}
 else if(c==='next'){if(state.mission<6)renderMission(state.mission+1);else finish()}
 else if(c==='story')tellStory();
 else if(c==='check4')checkMission4();
}
function selectSource(id){
 const shell=document.querySelector('.game-shell');
 shell.querySelectorAll('.source').forEach(s=>s.classList.toggle('selected',s.dataset.source===id));
 shell.querySelectorAll('.target').forEach(t=>t.classList.toggle('selected-target',true));
 state.selected=id; const label=findSource(id)?.[1]||id; toast(`Move “${label}” to a place you choose.`);
}
function findSource(id){return missions[state.mission].sources.find(s=>s[0]===id)}
function updateMission2Prompt(){
 const cfg=missions[2], box=document.getElementById('m2-prompt'), prog=document.getElementById('m2-progress');
 if(!box||!prog) return;
 const i=state.meta[2].index;
 if(i>=cfg.prompts.length){box.innerHTML='Great! You found all the clothes.'; prog.textContent=`${cfg.prompts.length} / ${cfg.prompts.length}`; return}
 box.innerHTML=cfg.prompts[i].text;
 prog.textContent=`${i+1} / ${cfg.prompts.length}`;
}
function mission2Pick(id){
 const cfg=missions[2], i=state.meta[2].index, prompt=cfg.prompts[i];
 if(!prompt){toast('Mission complete! Click Next.');return}
 if(id!==prompt.answer){toast(`Try again. Read: ${prompt.text}`); return}
 const p=state.placed[2]; p[id]={id,correct:true}; markUsed();
 toast(`Great! ${prompt.text}`);
 state.meta[2].index=Math.min(cfg.prompts.length, i+1); updateMission2Prompt();
}
function pickTF(qId,value){
 state.meta[4].answers[qId]=value; const wrap=document.querySelector(`[data-qwrap="${qId}"]`); if(!wrap) return;
 wrap.querySelectorAll('.tf-btn').forEach(btn=>btn.classList.toggle('selected', btn.dataset.value===value));
}
function checkMission4(){
 const cfg=missions[4]; let score=0;
 cfg.questions.forEach(q=>{
   const chosen=state.meta[4].answers[q.id]; const mark=document.querySelector(`[data-qmark="${q.id}"]`); const wrap=document.querySelector(`[data-qwrap="${q.id}"]`);
   wrap?.classList.remove('correct','wrong');
   if(!chosen){ if(mark) mark.textContent=''; return; }
   const ok=chosen===q.answer; if(ok) score++;
   if(mark) mark.textContent=ok?'✓':'✗';
   wrap?.classList.add(ok?'correct':'wrong');
 })
 state.meta[4].checked=true;
 const out=document.getElementById('quiz4-result'); if(out) out.textContent=`Score: ${score} / ${cfg.questions.length}`;
 toast(`Mission 4: ${score} out of ${cfg.questions.length}.`);
}

function toggleUsedSource(id){
 const used=document.querySelector(`.source[data-source="${id}"]`)?.classList.contains('used');
 if(!used){selectSource(id);return}
 removePlacement(id);
 state.selected=null;
 document.querySelectorAll('.source').forEach(s=>s.classList.remove('selected'));
 document.querySelectorAll('.target').forEach(t=>t.classList.remove('selected-target'));
 const label=findSource(id)?.[1]||id;
 toast(`Removed “${label}”. You can place it again.`);
}

function removePlacement(id){
 const m=state.mission;
 if(m===1){delete state.placed[1][id]; document.querySelector(`[data-target="backpack"] [data-item="${id}"]`)?.remove();}
 if(m===2){delete state.placed[2][id];}
 if(m===3){const p=state.placed[3]; Object.keys(p).forEach(zone=>{Object.keys(p[zone]||{}).forEach(kind=>{if(p[zone][kind]===id) delete p[zone][kind]})}); renderWeatherZones();}
 if(m===4){delete state.placed[4][id]; document.querySelector(`[data-target="free-stage"] [data-item="${id}"]`)?.remove();}
 if(m===5){const p=state.placed[5]; Object.keys(p).forEach(k=>{if(p[k]===id) delete p[k]}); renderRoutine();}
 if(m===6){const p=state.placed[6]; Object.keys(p).forEach(t=>{if(p[t]===id) delete p[t]}); renderStoryBubbles();}
 markUsed();
}

function startDrag(e,id,placed){
 if(e.button!==undefined&&e.button!==0)return;
 const shell=document.querySelector('.game-shell'); const s=findSource(id); if(!s)return;
 const srcEl=e.currentTarget,startX=e.clientX,startY=e.clientY;let moved=false,ghost=null;
 const ensureGhost=()=>{if(ghost)return;ghost=document.createElement('img');ghost.className='drag-ghost';ghost.src=sourceImg(state.mission,id);ghost.alt='';document.body.appendChild(ghost)};
 const move=ev=>{
   if(Math.hypot(ev.clientX-startX,ev.clientY-startY)>6){moved=true;srcEl.dataset.dragged='1';ensureGhost()}
   if(!moved)return;if(ghost){ghost.style.left=`${ev.clientX}px`;ghost.style.top=`${ev.clientY}px`;}
   shell.querySelectorAll('.target').forEach(t=>t.classList.toggle('active-target',pointInside(ev.clientX,ev.clientY,t.getBoundingClientRect())));
 };
 const up=ev=>{
   if(moved){move(ev);const target=[...shell.querySelectorAll('.target')].find(t=>pointInside(ev.clientX,ev.clientY,t.getBoundingClientRect()));if(target)place(id,target.dataset.target,{clientX:ev.clientX,clientY:ev.clientY});}
   if(ghost)ghost.remove();shell.querySelectorAll('.target').forEach(t=>t.classList.remove('active-target'));
   if(!moved)delete srcEl.dataset.dragged;
   document.removeEventListener('pointermove',move);
 };
 document.addEventListener('pointermove',move,{passive:false});document.addEventListener('pointerup',up,{once:true});
}
function pointInside(x,y,r){return x>=r.left&&x<=r.right&&y>=r.top&&y<=r.bottom}
function placeSelected(targetId,target){place(state.selected,targetId);state.selected=null;document.querySelectorAll('.source').forEach(s=>s.classList.remove('selected'));document.querySelectorAll('.target').forEach(t=>t.classList.remove('selected-target'))}

function place(id,targetId,pointer){
 const m=state.mission, s=findSource(id);if(!s)return;
 if(m===1)placePack(id,targetId);
 if(m===2)placeOutfit(id,targetId);
 if(m===3)placeWeather(id,targetId);
 if(m===4)placeFree(id,targetId,pointer);
 if(m===5)placeRoutine(id,targetId);
 if(m===6)placeStory(id,targetId);
 markUsed();
}
function markUsed(){
 const collect=v=>{if(typeof v==='string')return [v];if(Array.isArray(v))return v.flatMap(collect);if(v&&typeof v==='object'){if(v.id)return [v.id];return Object.values(v).flatMap(collect)}return []};
 const used=new Set(collect(state.placed[state.mission]));
 document.querySelectorAll('.source').forEach(s=>s.classList.toggle('used',used.has(s.dataset.source)));
}
function placePack(id,targetId){
 if(targetId!=='backpack')return; const p=state.placed[1]; p[id]={id};
 const target=document.querySelector('[data-target="backpack"]'); const old=target.querySelector(`[data-item="${id}"]`);if(old)old.remove();
 const img=thumb(id); const n=Object.keys(p).length-1;img.dataset.item=id;img.style.width='16%';img.style.height='17%';img.style.left=`${8+(n%5)*17}%`;img.style.top=`${48-Math.floor(n/5)*19}%`;target.appendChild(img);
 const label=findSource(id)[1];sayNear(target,`I have got <strong>${article(label)}</strong>.`,'left:49%;top:17%');toast(`Say: I have got ${article(label)}.`);
}
function outfitCategory(id){
 if(['sun-hat','cap'].includes(id)) return 'hat';
 if(['green-shirt','blue-shirt','blue-hoodie','raincoat'].includes(id)) return 'top';
 if(['green-trousers','shorts','blue-trousers','pink-shorts'].includes(id)) return 'bottom';
 if(['socks','boots','sandals','pink-shoes'].includes(id)) return 'feet';
 if(['green-backpack','pink-backpack'].includes(id)) return 'backpack';
 return 'other';
}
function renderAvatar(targetId){
 const layer=document.querySelector(`[data-avatar="${targetId}"]`); if(!layer) return; layer.innerHTML='';
 const p=state.placed[2];
 const items=Object.values(p).filter(v=>v.target===targetId).sort((a,b)=>['backpack','bottom','top','hat','feet'].indexOf(outfitCategory(a.id))-['backpack','bottom','top','hat','feet'].indexOf(outfitCategory(b.id)));
 items.forEach(v=>{
   const im=document.createElement('img'); im.src=sourceImg(2,v.id); im.alt=findSource(v.id)[1]; im.dataset.item=v.id; im.className=`avatar-item cat-${outfitCategory(v.id)} ${targetId}`; layer.appendChild(im);
 });
}
function placeOutfit(id,targetId){
 if(!['boy','girl'].includes(targetId))return; const p=state.placed[2]; const cat=outfitCategory(id);
 Object.keys(p).forEach(key=>{if(key!==id && p[key].target===targetId && outfitCategory(key)===cat) delete p[key]});
 p[id]={id,target:targetId};
 renderAvatar('boy'); renderAvatar('girl');
 const label=findSource(id)[1], subj=targetId==='boy'?'He':'She'; const has=cat==='backpack'; const sentence=has?`${subj} has got <strong>${article(label)}</strong>.`:`${subj} is wearing <strong>${article(label)}</strong>.`;
 sayNear(document.querySelector(`[data-target="${targetId}"]`),sentence,targetId==='boy'?'left:35%;top:12%':'left:60%;top:12%');toast(strip(sentence)+` Click the green-checked card to undo.`);
}
function renderWeatherZones(){
 const p=state.placed[3];
 ['sunny-zone','rainy-zone','snowy-zone'].forEach(targetId=>{
   const tag=document.querySelector(`[data-zone-tag="${targetId}"]`); if(tag){ tag.innerHTML=''; Object.values(p[targetId]||{}).forEach(cardId=>{const im=document.createElement('img');im.src=sourceImg(3,cardId);im.alt=findSource(cardId)[1];im.dataset.item=cardId;tag.appendChild(im)}); }
   const note=document.querySelector(`[data-zone-note="${targetId}"]`); if(note){
     const weather=p[targetId]?.weather?findSource(p[targetId].weather)[1]:null; const action=p[targetId]?.action?findSource(p[targetId].action)[1]:null;
     let sentence=''; if(weather) sentence+=`It is <strong>${weather}</strong>. `; if(action) sentence+=`They are <strong>${ing(action)}</strong>.`;
     note.innerHTML=sentence;
   }
 })
}
function placeWeather(id,targetId){
 if(!targetId.endsWith('zone'))return; const type=findSource(id)[3]; const p=state.placed[3];
 Object.keys(p).forEach(zone=>{if(p[zone]?.[type]===id)delete p[zone][type]});
 if(!p[targetId])p[targetId]={}; p[targetId][type]=id;
 renderWeatherZones();
 const weather=p[targetId].weather?findSource(p[targetId].weather)[1]:null; const action=p[targetId].action?findSource(p[targetId].action)[1]:null;
 let sentence='';if(weather)sentence+=`It is <strong>${weather}</strong>. `;if(action)sentence+=`They are <strong>${ing(action)}</strong>.`;
 toast(sentence?strip(sentence)+` Click the checked card to undo.`:'Add another card to build a sentence.');
}
function placeFree(id,targetId,pointer){
 if(targetId!=='free-stage')return; const target=document.querySelector('[data-target="free-stage"]'), r=target.getBoundingClientRect();
 let x=50,y=50;if(pointer){x=(pointer.clientX-r.left)/r.width*100;y=(pointer.clientY-r.top)/r.height*100} else {const n=Object.keys(state.placed[4]).length;x=12+(n%7)*12;y=20+Math.floor(n/7)*23}
 x=Math.max(4,Math.min(93,x));y=Math.max(6,Math.min(88,y));state.placed[4][id]={id,x,y};renderFreeItem(id,x,y,target);
 const label=findSource(id)[1];toast(`Say: We have got ${article(label)}.`); sayNear(target,`We have got <strong>${article(label)}</strong>.`,'left:5%;top:16%');
}
function renderFreeItem(id,x,y,target){
 const old=target.querySelector(`[data-item="${id}"]`);if(old)old.remove();const im=thumb(id);im.dataset.item=id;im.style.left=`${x-3.8}%`;im.style.top=`${y-5.2}%`;target.appendChild(im);
 im.addEventListener('pointerdown',e=>dragPlacedFree(e,id,im,target));
}
function dragPlacedFree(e,id,im,target){
 const move=ev=>{const r=target.getBoundingClientRect();let x=(ev.clientX-r.left)/r.width*100,y=(ev.clientY-r.top)/r.height*100;x=Math.max(4,Math.min(93,x));y=Math.max(6,Math.min(88,y));im.style.left=`${x-3.8}%`;im.style.top=`${y-5.2}%`;state.placed[4][id]={id,x,y}};
 const up=()=>{document.removeEventListener('pointermove',move)};document.addEventListener('pointermove',move,{passive:false});document.addEventListener('pointerup',up,{once:true});e.preventDefault();e.stopPropagation();
}
function placeRoutine(id,targetId){
 if(!targetId.startsWith('slot-'))return; const slot=+targetId.split('-')[1],p=state.placed[5];
 // remove this card from any previous slot
 Object.keys(p).forEach(k=>{if(p[k]===id)delete p[k]});p[slot]=id;renderRoutine();toast(`Your story: position ${slot+1} — ${findSource(id)[1]}.`);
}
function renderRoutine(){
 document.querySelectorAll('.path-slot .placed-thumb').forEach(e=>e.remove());const p=state.placed[5];Object.keys(p).forEach(k=>{const t=document.querySelector(`[data-target="slot-${k}"]`);if(!t)return;const im=thumb(p[k]);im.dataset.item=p[k];t.appendChild(im)});markUsed();
}
function tellStory(){
 const entries=Object.entries(state.placed[5]).sort((a,b)=>+a[0]-+b[0]);if(!entries.length){toast('Put some activity cards on the path first.');return}state.storyIndex%=entries.length;const id=entries[state.storyIndex++][1],label=findSource(id)[1]; const sentence=routineSentence(label);sayNear(document.querySelector('.game-shell'),sentence,'left:58%;top:19%');toast(strip(sentence));
}
function renderStoryBubbles(){
 ['bubble-left','bubble-right'].forEach(targetId=>{
   const t=document.querySelector(`[data-target="${targetId}"]`); if(!t) return; t.querySelectorAll('.placed-thumb,.story-sentence').forEach(e=>e.remove());
   const id=state.placed[6][targetId]; if(!id) return;
   const im=thumb(id); im.dataset.item=id; im.style.left='3%'; t.appendChild(im);
   const sentence=reviewSentence(findSource(id)); const s=document.createElement('div'); s.className='story-sentence'; s.style.left='49%'; s.style.top='18%'; s.style.width='48%'; s.innerHTML=sentence; t.appendChild(s);
 })
}
function placeStory(id,targetId){
 if(!targetId.startsWith('bubble-'))return;Object.keys(state.placed[6]).forEach(k=>{if(state.placed[6][k]===id)delete state.placed[6][k]});state.placed[6][targetId]=id;renderStoryBubbles();toast(strip(reviewSentence(findSource(id)))+` Click the checked card to undo.`);
}
function reviewSentence(s){const [id,label,,type]=s; if(type==='weather')return `It is <strong>${label}</strong>.`;if(type==='wear')return `She is wearing <strong>${article(label)}</strong>.`;if(type==='camp')return `They are <strong>making camp</strong>.`;if(type==='routine')return `At night, I <strong>go to bed</strong>.`;return `We have got <strong>${article(label)}</strong>.`}
function routineSentence(label){const map={'wake up':'In the morning, I <strong>wake up</strong>.','get up':'Then I <strong>get up</strong>.','get dressed':'I <strong>get dressed</strong>.','brush teeth':'I <strong>brush my teeth</strong>.','wash face':'I <strong>wash my face</strong>.','have sandwiches for breakfast':'We <strong>have sandwiches for breakfast</strong>.','swim in the lake':'We <strong>swim in the lake</strong>.','make a fire':'We <strong>make a fire</strong>.','cook':'We <strong>cook</strong>.','have lunch':'We <strong>have lunch</strong>.','read a book':'I <strong>read a book</strong>.','play with a ball':'We <strong>play with a ball</strong>.','have dinner':'We <strong>have dinner</strong>.','play a board game':'We <strong>play a board game</strong>.','go to bed':'At night, I <strong>go to bed</strong>.'};return map[label]||`I <strong>${label}</strong>.`}
function ing(action){return {'pick flowers':'picking flowers','run':'running','climb':'climbing'}[action]||action}
function article(label){if(label==='sandwiches'||label==='hiking boots'||label==='shorts'||label==='socks'||label==='green trousers'||label==='blue trousers'||label==='fruit')return label;return `${/^[aeiou]/i.test(label)?'an':'a'} ${label}`}
function strip(s){const d=document.createElement('div');d.innerHTML=s;return d.textContent}
function thumb(id){const im=document.createElement('img');im.className='placed-thumb';im.src=sourceImg(state.mission,id);im.alt=findSource(id)?.[1]||id;im.tabIndex=0;return im}
function sayNear(_target,html,style){document.querySelectorAll('.say-bubble').forEach(b=>b.remove());const b=document.createElement('div');b.className='say-bubble';b.style.cssText=style;b.innerHTML=html;document.querySelector('.layer').appendChild(b)}
let toastTimer;function toast(msg){const t=document.getElementById('toast');if(!t)return;t.textContent=msg;t.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>t.classList.remove('show'),2600)}

function restoreMission(m){
 const p=state.placed[m];if(m===1)Object.keys(p).forEach(id=>placePack(id,'backpack'));
 if(m===2){updateMission2Prompt();}
 if(m===3)renderWeatherZones();
 if(m===4){Object.entries(state.meta[4].answers).forEach(([q,v])=>pickTF(q,v)); if(state.meta[4].checked) checkMission4();}
 if(m===5)renderRoutine();
 if(m===6)renderStoryBubbles();
 markUsed();
}
function finish(){
 const shell=document.querySelector('.game-shell');const card=document.createElement('div');card.className='finish-card';card.innerHTML=`<div class="finish-panel"><h2>Camp Quest Complete!</h2><p>You packed, dressed, explored, made camp, created your own camp day and told your adventure story.</p><button id="playAgain">Play again</button></div>`;shell.appendChild(card);document.getElementById('playAgain').onclick=()=>{for(let i=1;i<=6;i++)state.placed[i]={}; state.meta[2].index=0; state.meta[4]={answers:{},checked:false}; renderMission(1)};
}

function runQA(){
 try{
  const checks=[];checks.push(document.querySelectorAll('.source').length===(missions[state.mission].sources||[]).length);checks.push(document.querySelectorAll('[data-nav]').length===6);checks.push(!!document.querySelector('[data-control="next"]'));
  if(state.mission===1){place('sleeping-bag','backpack');checks.push(!!state.placed[1]['sleeping-bag'])}
  if(state.mission===2){mission2Pick('cap');checks.push(!!state.placed[2]['cap']?.correct&&state.meta[2].index===1)}
  if(state.mission===3){place('sunny','rainy-zone');place('climb','rainy-zone');checks.push(state.placed[3]['rainy-zone'].weather==='sunny'&&state.placed[3]['rainy-zone'].action==='climb')}
  if(state.mission===4){pickTF('q1','true');checkMission4();checks.push(document.getElementById('quiz4-result')?.textContent.includes('1 / 6'))}
  if(state.mission===5){place('go-bed','slot-0');checks.push(state.placed[5][0]==='go-bed')}
  if(state.mission===6){place('rainy','bubble-left');checks.push(state.placed[6]['bubble-left']==='rainy')}
  document.documentElement.dataset.qa=checks.every(Boolean)?'pass':'fail';document.documentElement.dataset.qaCount=String(checks.filter(Boolean).length)+'/'+checks.length;
 }catch(err){document.documentElement.dataset.qa='error';document.documentElement.dataset.qaError=err.message}
}

const startMission=Math.min(6,Math.max(1,Number(new URLSearchParams(location.search).get('m'))||1));
renderMission(startMission);
})();
