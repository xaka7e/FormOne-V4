'use strict';
const NS='http://www.w3.org/2000/svg';
// Confirmed products from formonenutrition.com; stages 2 and 4 use the same real SKU.
const featuredProducts=[
  {title:'Протеин · шоколад',copy:'Premium Whey Protein Chocolate · 1 000 г.',image:'assets/formone-whey-chocolate.jpg',alt:'Оригинальная упаковка FormOne Premium Whey Protein Chocolate',mobile:'ШОКОЛАДНЫЙ ПРОТЕИН'},
  {title:'Креатин · яблоко',copy:'Creatine Gummies · 90 пастилок, вкус яблока.',image:'assets/formone-creatine-gummies.jpg',alt:'Оригинальная упаковка FormOne Creatine Gummies Apple',mobile:'КРЕАТИН FORMONE'},
  {title:'Протеин · ваниль',copy:'Premium Whey Protein Vanilla · 1 000 г.',image:'assets/formone-whey-vanilla.jpg',alt:'Оригинальная упаковка FormOne Premium Whey Protein Vanilla',mobile:'ВАНИЛЬНЫЙ ПРОТЕИН'},
  {title:'Креатин · яблоко',copy:'Creatine Gummies · 90 пастилок. В каталоге указано: без сахара, веганский продукт.',image:'assets/formone-creatine-gummies.jpg',alt:'Оригинальная упаковка FormOne Creatine Gummies Apple',mobile:'КРЕАТИН FORMONE'}
];
const labels=featuredProducts.map(product=>product.title);
const descriptions=featuredProducts.map(product=>product.copy);
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
 // Both palms sit beneath the WHEY base; the entire load moves as one group.
 if(i===0)return `<g transform="rotate(-3 48 -196)">${jar('WHEY',48,-238,1.34)}${bentArm('M-52 -205Q-83 -150 -49 -116Q-27 -92 8 -82')}${bentArm('M54 -208Q126 -180 124 -127Q121 -96 91 -82')}${grip(8,-82)}${grip(91,-82)}</g>`;
 // Character's right shoulder is on the image's right: elbow and palm support the jar from underneath.
 if(i===1)return `<g transform="rotate(-7 72 -230)">${jar('BCAA',72,-330,1.05)}${bentArm('M55 -210Q119 -184 119 -220L94 -211')}${grip(94,-211)}</g>`;
 // ENZYMES stays outside the left side of the torso, with its base on the open palm.
 if(i===2)return `<g transform="rotate(-8 -96 -174)">${jar('ENZYMES',-97,-272,.97)}${bentArm('M-55 -209Q-137 -204 -128 -172L-100 -157')}${grip(-100,-157)}</g>`;
 return `<path d="M-65 -100L-86 -414" stroke="#c2b594" stroke-width="6"/><path class="flag" fill="#172226" stroke="#c7b181" stroke-width="2"/><path class="flag-fold flag-fold-a" fill="none" stroke="#d5c49a" stroke-opacity=".23" stroke-width="5"/><path class="flag-fold flag-fold-b" fill="none" stroke="#65706a" stroke-opacity=".55" stroke-width="6"/><text class="flag-word" x="-56" y="-349" fill="#eee3c9" font-size="25" letter-spacing="3" transform="rotate(11 -56 -349)">FORMONE</text>${bentArm('M-54 -207Q-91 -188 -71 -153')}${grip(-71,-153)}`;
}
for(let i=3;i>=0;i--){let g=document.createElementNS(NS,'g');g.id='walker-'+i;g.dataset.carry=['two-hands-front','right-shoulder','outside-underhand','oversized-flag'][i];g.innerHTML=`<ellipse cy="8" rx="79" ry="12" fill="#0b1114" opacity=".5"/><g class="squat" transform="scale(1.12 .76)">${leg('left')}${leg('right')}<g class="upper"><path d="M-59 -215Q-47 -242 0 -231Q44 -242 61 -211L39 -153 35 -112Q0 -94 -35 -113L-39 -153Z" fill="url(#body)" stroke="#b8ac8c" stroke-width="2"/><path d="M-49 -207Q-29 -218 -4 -201L-10 -159 -31 -147M49 -207Q29 -218 4 -201L10 -159 31 -147" fill="#293538" stroke="#606e67" stroke-width="2"/><path d="M0 -209V-137M-31 -138Q0 -125 31 -138M-31 -121Q0 -111 31 -121" fill="none" stroke="#101a1e" stroke-width="4"/><g transform="translate(0 -237) scale(1.32 1.25) translate(0 237)"><path d="M-24 -260Q-21 -286 5 -286Q27 -283 27 -258L19 -237 -16 -237Z" fill="url(#body)" stroke="#9da18e" stroke-width="2"/><path d="M-26 -263Q-30 -294 7 -293Q31 -291 29 -271L38 -267 23 -262Z" fill="#1c282c" stroke="#abb099" stroke-width="2"/><path d="M-16 -271L-10 -249M-1 -275L3 -250" stroke="#56635b" stroke-width="2"/></g><path d="M-34 -233Q0 -248 34 -233L26 -218Q0 -229 -26 -218Z" fill="#18252a" stroke="#727e71" stroke-width="2"/><text x="${i===0?-17:0}" y="-177" fill="#939b87" opacity=".75" font-size="25" font-family="Arial" font-style="italic" font-weight="bold" text-anchor="middle">F1</text>${i===1?arm('left'):i===2?arm('right'):i===3?arm('right'):''}<g class="cargo">${load(i)}</g></g></g>`;container.appendChild(g);}
// Deterministic terrain avoids assets and remains identical when scrolling back.
let seed=12;function rand(){seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;}
let terrain='';for(let i=0;i<95;i++){let x=rand()*1600,y=450+rand()*500,w=8+rand()*50;terrain+=`<path d="M${x} ${y}l${w*.3} ${-w*.3} ${w*.7} ${w*.15} ${w*.3} ${w*.3}Z" fill="${i%3?'#202827':'#51554b'}" opacity=".7"/>`;}
for(let i=0;i<7;i++){let x=100+i*157,y=854-i*62;terrain+=`<ellipse cx="${x}" cy="${y}" rx="50" ry="35" fill="url(#light)"/><path d="M${x} ${y}v-17" stroke="#706851" stroke-width="3"/><circle cx="${x}" cy="${y-18}" r="4" fill="#ffe1a0"/>`;}
document.querySelector('#terrain').innerHTML=terrain;
document.querySelector('.cards').innerHTML=[featuredProducts[0],featuredProducts[1],featuredProducts[2]].map((product,i)=>`<article class="card"><span class="tag">FORMONE / 0${i+1}</span><img src="${product.image}" alt="${product.alt}" loading="lazy"><h3>${product.title}</h3><p>${product.copy}</p></article>`).join('');
const rigs=[0,1,2,3].map(i=>document.querySelector('#walker-'+i));
const starts=[[360,843,1.20],[650,702,.94],[867,584,.73],[1036,518,.53]];
const clamp=(n,a=0,b=1)=>Math.max(a,Math.min(b,n));
function showFeaturedProduct(stage){
  const product=featuredProducts[stage];
  for(const prefix of ['','mobile-']){
    const image=document.querySelector(`#${prefix}featured-image`);
    if(!image)continue;
    if(image.getAttribute('src')!==product.image)image.setAttribute('src',product.image);
    image.alt=product.alt;
    const note=document.querySelector(`#${prefix}featured-note`);
    if(note)note.textContent=prefix?product.mobile:'ОРИГИНАЛЬНЫЙ ПРОДУКТ FORMONE';
  }
}
function renderMobile(p){
  const scene=document.querySelector('.mobile-scene');
  if(!scene)return;

  // Мобильная версия — отдельная история, а не уменьшенная desktop-сцена.
  const personIn=clamp((p-.05)/.13);
  const pourIn=clamp((p-.15)/.13);
  const pourOut=1-clamp((p-.43)/.08);
  const powder=pourIn*pourOut;
  const waterIn=clamp((p-.27)/.13);
  const waterOut=1-clamp((p-.57)/.08);
  const water=waterIn*waterOut;
  const mix=clamp((p-.35)/.38);
  const final=clamp((p-.70)/.12);
  const fade=clamp((p-.90)/.075);

  const athlete=document.querySelector('#mobile-athlete');
  const jarNode=document.querySelector('#mobile-protein-jar');
  if(athlete){
    athlete.setAttribute('transform',`translate(${302+(1-personIn)*52} ${225-(1-personIn)*7})`);
    athlete.style.opacity=String(.2+.8*personIn);
  }
  if(jarNode){
    const tilt=-8-43*powder;
    jarNode.setAttribute('transform',`translate(-61 -14) rotate(${tilt})`);
  }

  const powderPath=document.querySelector('#mobile-powder');
  const powderCloud=document.querySelector('#mobile-powder-cloud');
  if(powderPath){
    powderPath.style.opacity=String(powder);
    powderPath.setAttribute('stroke-dashoffset',String(1-pourIn));
  }
  if(powderCloud)powderCloud.style.opacity=String(powder*.7);

  ['#mobile-water','#mobile-water-hi'].forEach(sel=>{
    const el=document.querySelector(sel);
    if(el){
      el.style.opacity=String(water*(sel.endsWith('-hi')?.55:.92));
      el.setAttribute('stroke-dashoffset',String(1-waterIn));
    }
  });

  const liquid=document.querySelector('#mobile-liquid');
  const wave=document.querySelector('#mobile-wave');
  const swirl=document.querySelector('#mobile-swirl');
  const topY=790-355*mix;
  if(liquid){
    liquid.setAttribute('y',topY.toFixed(1));
    liquid.setAttribute('height',(792-topY).toFixed(1));
  }
  if(wave){
    wave.setAttribute('cy',topY.toFixed(1));
    wave.setAttribute('rx',String(120+26*mix));
    wave.style.opacity=String(.3+.56*mix);
  }
  if(swirl){
    swirl.style.opacity=String(clamp((mix-.12)/.45)*(1-clamp((p-.82)/.08)));
    swirl.setAttribute('transform',`translate(0 ${20*(1-mix)}) rotate(${mix*18} 195 650)`);
  }

  const copy=document.querySelector('.mobile-copy');
  if(copy){
    const copyFade=1-clamp((p-.12)/.16);
    copy.style.opacity=String(copyFade);
    copy.style.transform=`translateY(${-14*clamp((p-.08)/.18)}px)`;
  }

  const statusNum=document.querySelector('#mobile-status-num');
  const statusLabel=document.querySelector('#mobile-status-label');
  let status=['01','ДОБАВЛЯЕМ ПРОТЕИН'];
  if(p>=.27)status=['02','ДОБАВЛЯЕМ ВОДУ'];
  if(p>=.46)status=['03','СМЕШИВАЕМ'];
  if(p>=.72)status=['04','ГОТОВО'];
  if(statusNum)statusNum.textContent=status[0];
  if(statusLabel)statusLabel.textContent=status[1];

  // На финале готовая смесь чуть приближается — акцент на результате.
  const shaker=document.querySelector('#mobile-shaker');
  if(shaker)shaker.setAttribute('transform',`translate(0 ${-7*final}) scale(${1+.015*final} ${1+.015*final})`);

  scene.style.opacity=String(1-fade);
  scene.style.visibility=fade===1?'hidden':'visible';
  scene.setAttribute('aria-hidden',fade===1?'true':'false');
  const reveal=document.querySelector('.reveal');
  reveal.style.opacity=String(fade);
  reveal.style.visibility=fade>0?'visible':'hidden';
  reveal.style.pointerEvents=fade>.5?'auto':'none';
  document.querySelector('.progress i').style.width=p*100+'%';
  showFeaturedProduct(Math.min(3,Math.floor(p/.22)));
  document.body.dataset.stage=fade===1?'5':status[0];
  document.body.dataset.progress=p.toFixed(4);
}

function renderDesktop(p){

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

  const w=Math.sin(phase*1.15)*17;
  const edge=Math.sin(phase*1.15+1.3)*22;
  document.querySelector('.flag').setAttribute('d',`M-86 -410C-19 ${-431+w*.25} 63 ${-407-w*.45} 150 ${-375+edge}Q164 ${-325+edge*.5} 143 ${-270-edge*.65}C59 ${-310-w*.55} -11 ${-325+w*.4} -80 -303Z`);
  document.querySelector('.flag-fold-a').setAttribute('d',`M-34 ${-416+w*.17}Q-9 ${-369-w*.15} -13 ${-318+w*.24}`);
  document.querySelector('.flag-fold-b').setAttribute('d',`M66 ${-402-w*.4}Q85 ${-347+edge*.2} 64 ${-292-edge*.25}`);
  document.querySelector('.flag-word').setAttribute('transform',`rotate(${11+w*.1} -56 -349)`);
  document.querySelector('#cape').setAttribute('d',`M-38 -208C25 -233 73 ${-144+w} 176 ${-133+w}L137 ${-33-w}Q58 ${-58+w} 23 -103Z`);

  // Four chapters spread evenly through 90% of the journey.
  const chapter=.22;
  const stage=Math.min(3,Math.floor(p/chapter));
  showFeaturedProduct(stage);
  document.querySelector('#number').textContent='0'+(stage+1);
  document.querySelector('#stage-title').textContent=labels[stage];
  document.querySelector('#stage-copy').textContent=descriptions[stage];
  document.querySelectorAll('.dots button').forEach((b,i)=>{
    b.classList.toggle('active',i===stage);
    b.setAttribute('aria-current',i===stage?'step':'false');
  });

  // Reveal starts only after the walk has essentially finished.
  const fade=clamp((p-.89)/.085);
  const scene=document.querySelector('.desktop-scene');
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

function render(){
  const journey=document.querySelector('.journey');
  const maxScroll=Math.max(1,journey.offsetHeight-innerHeight);
  const p=clamp(scrollY/maxScroll);
  if(matchMedia('(max-width:700px)').matches)renderMobile(p);
  else renderDesktop(p);
}
// No free-running timeline: every pose is a pure function of scroll position.
let queued=false;function update(){if(!queued){queued=true;requestAnimationFrame(()=>{queued=false;render();});}}addEventListener('scroll',update,{passive:true});addEventListener('resize',update);document.querySelectorAll('.dots button').forEach((b,i)=>b.addEventListener('click',()=>scrollTo(0,i*.22*(document.querySelector('.journey').offsetHeight-innerHeight))));render();
