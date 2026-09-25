'use strict';
const NS='http://www.w3.org/2000/svg';
const labels=['Сывороточный протеин','BCAA','Пищевые ферменты','Премиум качество'];
const descriptions=['Основа твоего ежедневного рациона.','Продолжай движение. Держи свой ритм.','Продуманный подход к твоему рациону.','Внимание к каждой детали. На каждом шаге.'];
const productNames=['WHEY','BCAA','ENZYMES'];
function jar(name,x=-100,y=-176,s=1){
  const small=name==='ENZYMES';
  return `<g class="product-jar" transform="translate(${x} ${y}) scale(${s})">
    <ellipse cx="0" cy="116" rx="43" ry="9" fill="#050708" opacity=".48"/>
    <rect x="-43" y="2" width="86" height="108" rx="17" fill="url(#jar)" stroke="#8f876f" stroke-width="1"/>
    <path d="M-38 18Q0 8 38 18V91Q0 101-38 91Z" fill="#070b0c" opacity=".26"/>
    <path d="M-33 10Q-24 4 -18 5V101Q-29 98-33 91Z" fill="#fff" opacity=".045"/>
    <path d="M25 7Q37 12 39 24V91Q35 101 27 105Z" fill="#000" opacity=".36"/>
    <ellipse cy="4" rx="40" ry="8" fill="#252b2a" stroke="#87816b" stroke-width="1"/>
    <rect x="-41" y="-10" width="82" height="19" rx="6" fill="#171d1d" stroke="#777462" stroke-width="1"/>
    <path d="M-34 -7V5M-28 -7V5M-22 -7V5M-16 -7V5M-10 -7V5M-4 -7V5M2 -7V5M8 -7V5M14 -7V5M20 -7V5M26 -7V5M32 -7V5" stroke="#4b514b" stroke-width="1.2" opacity=".9"/>
    <rect x="-31" y="25" width="62" height="60" rx="3" fill="#0b0f10" stroke="#6f6958" stroke-width=".8"/>
    <path d="M-31 60L31 45V72L-31 84Z" fill="#806b47" opacity=".18"/>
    <text y="40" text-anchor="middle" font-family="Arial" font-size="8" letter-spacing="1.5" fill="#ded3b8">FORMONE</text>
    <path d="M-15 47H15" stroke="#a88f5f" stroke-width="1"/>
    <text y="64" text-anchor="middle" font-family="Arial" font-weight="700" font-size="${small?11:18}" fill="#f4ead2">${name}</text>
    <text y="78" text-anchor="middle" font-family="Arial" font-size="5.4" letter-spacing="1" fill="#9ea197">FUEL YOUR FORM</text>
  </g>`;
}
function leg(side){return `<g class="leg ${side}" transform="translate(${side==='left'?-25:25} -113)"><path d="M-24 -5Q-29 22 -17 59L13 61Q24 23 23 -4Z" fill="url(#body)" stroke="#8e917f" stroke-width="1.5"/><path d="M-17 4L-11 39 3 52" fill="none" stroke="#121a1e" stroke-width="5"/><g class="shin" transform="translate(0 54)"><path d="M-17 0Q-23 30 -13 56L14 56Q23 25 14 0Z" fill="url(#body)" stroke="#8e917f" stroke-width="1.5"/><path d="M-14 48L-21 65Q-20 75 16 73L20 65 13 48Z" fill="#161e22" stroke="#b8ac87" stroke-width="2"/><path d="M-16 64L14 66" stroke="#687268" stroke-width="3"/></g></g>`;}
function arm(side){let left=side==='left';return `<g class="arm ${side}" transform="translate(${left?-54:54} -214)"><path d="M-15 -4Q-35 6 -26 41L-17 66 6 62Q25 28 14 0Z" fill="url(#body)" stroke="#a7a58c" stroke-width="1.5"/><path d="M-22 17Q-2 7 8 26M-20 42Q-3 35 8 47" fill="none" stroke="#69736b" stroke-width="2"/><g class="forearm" transform="translate(-7 56)"><path d="M-13 0L-19 49Q-13 66 4 54L15 8Z" fill="url(#body)" stroke="#a7a58c" stroke-width="1.5"/><path d="M-18 47L-17 62 0 66 9 55 3 44Z" fill="#333e3f" stroke="#a7a58c" stroke-width="1.5"/></g></g>`;}
const container=document.querySelector('#walkers');
// Short, broad silhouettes; each load and its supporting hands share one rig.
function grip(x,y){return `<g class="grip"><ellipse cx="${x}" cy="${y}" rx="11" ry="8" fill="#687168" stroke="#b7ab8a" stroke-width="1.5"/><path d="M${x-7} ${y-3}q7-5 14 0M${x-6} ${y+1}v5m5-6v6m5-5v5" fill="none" stroke="#303936" stroke-width="1.4" stroke-linecap="round"/><path d="M${x-12} ${y+4}l-7 4" stroke="#8b846f" stroke-width="5" stroke-linecap="round"/></g>`;}
function bentArm(d){return `<path d="${d}" fill="none" stroke="#b8ac8c" stroke-width="29" stroke-linecap="round" stroke-linejoin="round"/><path d="${d}" fill="none" stroke="url(#body)" stroke-width="25" stroke-linecap="round" stroke-linejoin="round"/>`;}
function load(i){
 if(i===0)return `<g transform="rotate(-3 48 -196)">${jar('WHEY',48,-238,1.34)}</g>${bentArm('M-52 -205Q-73 -165 -43 -128L-4 -106')}${bentArm('M54 -208Q112 -191 116 -145L101 -108')}${grip(-4,-106)}${grip(101,-108)}`;
 if(i===1)return `<g transform="rotate(8 -68 -161)">${jar('BCAA',-69,-204,1.08)}</g>${bentArm('M-54 -208Q-99 -224 -111 -184L-110 -148')}${bentArm('M52 -207Q66 -154 18 -136L-34 -129')}${grip(-110,-148)}${grip(-34,-129)}`;
 if(i===2)return `<g transform="rotate(58 50 -246)">${jar('ENZYMES',50,-294,1.12)}</g>${bentArm('M52 -211Q96 -205 105 -249L85 -269')}${grip(85,-269)}`;
 return `<path d="M-65 -100L-86 -414" stroke="#c2b594" stroke-width="6"/><path class="flag" fill="#172226" stroke="#c7b181" stroke-width="2"/><text x="-56" y="-349" fill="#eee3c9" font-size="25" letter-spacing="3" transform="rotate(11 -56 -349)">FORMONE</text>${bentArm('M-54 -207Q-91 -188 -71 -153')}${grip(-71,-153)}`;
}
for(let i=3;i>=0;i--){let g=document.createElementNS(NS,'g');g.id='walker-'+i;g.dataset.carry=['two-hands-front','side-hug','shoulder','oversized-flag'][i];g.innerHTML=`<ellipse cy="8" rx="79" ry="12" fill="#0b1114" opacity=".5"/><g class="squat" transform="scale(1.12 .76)">${leg('left')}${leg('right')}<g class="upper"><path d="M-59 -215Q-47 -242 0 -231Q44 -242 61 -211L39 -153 35 -112Q0 -94 -35 -113L-39 -153Z" fill="url(#body)" stroke="#b8ac8c" stroke-width="2"/><path d="M-49 -207Q-29 -218 -4 -201L-10 -159 -31 -147M49 -207Q29 -218 4 -201L10 -159 31 -147" fill="#293538" stroke="#606e67" stroke-width="2"/><path d="M0 -209V-137M-31 -138Q0 -125 31 -138M-31 -121Q0 -111 31 -121" fill="none" stroke="#101a1e" stroke-width="4"/><g transform="translate(0 -237) scale(1.32 1.25) translate(0 237)"><path d="M-24 -260Q-21 -286 5 -286Q27 -283 27 -258L19 -237 -16 -237Z" fill="url(#body)" stroke="#9da18e" stroke-width="2"/><path d="M-26 -263Q-30 -294 7 -293Q31 -291 29 -271L38 -267 23 -262Z" fill="#1c282c" stroke="#abb099" stroke-width="2"/><path d="M-16 -271L-10 -249M-1 -275L3 -250" stroke="#56635b" stroke-width="2"/></g><path d="M-34 -233Q0 -248 34 -233L26 -218Q0 -229 -26 -218Z" fill="#18252a" stroke="#727e71" stroke-width="2"/><text x="${i===0?-17:0}" y="-177" fill="#939b87" opacity=".75" font-size="25" font-family="Arial" font-style="italic" font-weight="bold" text-anchor="middle">F1</text>${i===2?arm('left'):i===3?arm('right'):''}<g class="cargo">${load(i)}</g></g></g>`;container.appendChild(g);}
// Deterministic terrain avoids assets and remains identical when scrolling back.
let seed=12;function rand(){seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;}
let terrain='';for(let i=0;i<95;i++){let x=rand()*1600,y=450+rand()*500,w=8+rand()*50;terrain+=`<path d="M${x} ${y}l${w*.3} ${-w*.3} ${w*.7} ${w*.15} ${w*.3} ${w*.3}Z" fill="${i%3?'#202827':'#51554b'}" opacity=".7"/>`;}
for(let i=0;i<7;i++){let x=100+i*157,y=854-i*62;terrain+=`<ellipse cx="${x}" cy="${y}" rx="50" ry="35" fill="url(#light)"/><path d="M${x} ${y}v-17" stroke="#706851" stroke-width="3"/><circle cx="${x}" cy="${y-18}" r="4" fill="#ffe1a0"/>`;}
document.querySelector('#terrain').innerHTML=terrain;
document.querySelector('.cards').innerHTML=productNames.map((n,i)=>`<article class="card"><span class="tag">FORMONE / 0${i+1}</span><svg viewBox="-100 -20 200 170" aria-label="Банка ${n}"><defs>${document.querySelector('#world defs').innerHTML}</defs>${jar(n,0,5,1.1)}</svg><h3>${labels[i]}</h3><p>${descriptions[i]}</p></article>`).join('');
const rigs=[0,1,2,3].map(i=>document.querySelector('#walker-'+i));
const starts=[[360,843,1.20],[650,702,.94],[867,584,.73],[1036,518,.53]];
const clamp=(n,a=0,b=1)=>Math.max(a,Math.min(b,n));
function render(){
  const journey=document.querySelector('.journey');
  const maxScroll=Math.max(1,journey.offsetHeight-innerHeight);
  const p=clamp(scrollY/maxScroll);

  // Main movement now uses more of the scroll range, so the group travels more calmly.
  const travel=clamp(p/.88);

  // Gait is intentionally slower than forward travel. 20π = 10 full step cycles over the whole route.
  const phase=travel*Math.PI*20;

  rigs.forEach((g,i)=>{
    const [x,y,s]=starts[i];
    const t=travel*.76;
    const scale=s*(1-t*.69);
    const wave=Math.sin(phase+i*1.9);

    g.setAttribute('transform',`translate(${x+(1218-x)*t} ${y+(467-y)*t}) scale(${scale})`);
    g.querySelector('.upper').setAttribute('transform',`translate(0 ${-Math.abs(wave)*5.5}) rotate(${(i===0?7:i===1?-5:i===2?4:-7)+wave*2.2} 0 -120)`);

    ['left','right'].forEach((side,k)=>{
      const a=Math.sin(phase+i*1.9+k*Math.PI);
      g.querySelector('.leg.'+side).setAttribute('transform',`translate(${k?25:-25} -113) rotate(${a*22})`);
      g.querySelector('.leg.'+side+' .shin').setAttribute('transform',`translate(0 54) rotate(${Math.max(0,-a)*34})`);
      const armNode=g.querySelector('.arm.'+side);
      if(armNode){
        armNode.setAttribute('transform',`translate(${k?54:-54} -214) rotate(${-a*13})`);
        armNode.querySelector('.forearm').setAttribute('transform',`translate(-7 56) rotate(${a*8.5})`);
      }
    });

    // The jars/flag now stay much steadier in the hands; no nervous wobble.
    const cargoRot=wave*(i===0?.65:i===1?.9:i===2?1.05:1.2);
    g.querySelector('.cargo').setAttribute('transform',`rotate(${cargoRot} 0 -210) translate(0 ${wave*.8})`);
  });

  const w=Math.sin(phase*1.15)*11;
  document.querySelector('.flag').setAttribute('d',`M-86 -410Q-15 ${-431+w} 150 ${-375-w}L143 ${-270-w}Q1 ${-325+w} -80 -303Z`);
  document.querySelector('#cape').setAttribute('d',`M-38 -208C25 -233 73 ${-144+w} 176 ${-133+w}L137 ${-33-w}Q58 ${-58+w} 23 -103Z`);

  // Four chapters spread evenly through 90% of the journey.
  const chapter=.22;
  const stage=Math.min(3,Math.floor(p/chapter));
  document.querySelector('#number').textContent='0'+(stage+1);
  document.querySelector('#stage-title').textContent=labels[stage];
  document.querySelector('#stage-copy').textContent=descriptions[stage];
  document.querySelectorAll('.dots button').forEach((b,i)=>{
    b.classList.toggle('active',i===stage);
    b.setAttribute('aria-current',i===stage?'step':'false');
  });

  // Reveal starts only after the walk has essentially finished.
  const fade=clamp((p-.89)/.085);
  const scene=document.querySelector('.scene');
  const reveal=document.querySelector('.reveal');
  scene.style.opacity=1-fade;
  scene.style.visibility=fade===1?'hidden':'visible';
  scene.setAttribute('aria-hidden',fade===1?'true':'false');
  reveal.style.opacity=fade;
  reveal.style.visibility=fade>0?'visible':'hidden';
  reveal.style.pointerEvents=fade>.5?'auto':'none';
  document.querySelector('.progress i').style.width=p*100+'%';
  document.body.dataset.stage=fade===1?'5':String(stage+1);
  document.body.dataset.progress=p.toFixed(4);
}
// No free-running timeline: every pose is a pure function of scroll position.
let queued=false;function update(){if(!queued){queued=true;requestAnimationFrame(()=>{queued=false;render();});}}addEventListener('scroll',update,{passive:true});addEventListener('resize',update);document.querySelectorAll('.dots button').forEach((b,i)=>b.addEventListener('click',()=>scrollTo(0,i*.22*(document.querySelector('.journey').offsetHeight-innerHeight))));render();