"use strict";
// Mobilmenü: Öffnen, Schließen und Wechsel zwischen Bildschirmgrößen. (Мобильное меню: открытие, закрытие и смена размера экрана.)
const mobileLayout = matchMedia(
  "(max-width:700px), (max-width:950px) and (max-height:500px) and (pointer:coarse)",
);
const header = document.querySelector("header");
const menuToggle = document.querySelector(".menu-toggle");
function closeMenu(restoreFocus = false) {
  header.classList.remove("menu-open");
  menuToggle.setAttribute("aria-expanded", "false");
  if (restoreFocus) menuToggle.focus();
}
menuToggle.addEventListener("click", () => {
  const opened = header.classList.toggle("menu-open");
  menuToggle.setAttribute("aria-expanded", String(opened));
});
document
  .querySelectorAll("header a")
  .forEach((link) => link.addEventListener("click", () => closeMenu()));
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && header.classList.contains("menu-open"))
    closeMenu(true);
});
document.addEventListener("click", (event) => {
  if (!header.contains(event.target)) closeMenu();
});
mobileLayout.addEventListener("change", () => closeMenu());
const NS = "http://www.w3.org/2000/svg";
// Produktdaten aus formonenutrition.com; Abschnitt 2 und 4 zeigen denselben Artikel. (Данные товаров с formonenutrition.com; этапы 2 и 4 показывают один товар.)
const featuredProducts = [
  {
    title: "Protein · Schokolade",
    copy: "Molkenprotein mit Kakao und Milchschokoladenaroma. Für deine tägliche Trainingsroutine.",
    facts: [
      "Molkenproteinkonzentrat",
      "Schokoladengeschmack",
      "1.000 g pro Dose",
      "Portionsgröße: 30 g",
    ],
    flavor: "chocolate",
    image: "assets/formone-whey-chocolate.jpg",
    alt: "Originalverpackung von FormOne Premium Whey Protein Chocolate",
    mobile: "SCHOKOLADENPROTEIN",
    mobileDetail: "Molkenprotein · 1.000 g",
  },
  {
    title: "Kreatin-Gummis",
    copy: "Kreatin als Fruchtgummis. Die kompakte Dose ist praktisch für unterwegs.",
    facts: [
      "Kreatin-Gummis",
      "Zuckerfrei",
      "90 Stück pro Dose",
      "Portionsgröße: 3 Stück",
    ],
    flavor: "creatine",
    image: "assets/formone-creatine-gummies.jpg",
    alt: "Originalverpackung von FormOne Creatine Gummies",
    mobile: "KREATIN VON FORMONE",
    mobileDetail: "Zuckerfrei · 90 Stück",
  },
  {
    title: "Protein · Vanille",
    copy: "Molkenprotein mit Vanillegeschmack. Ein milder Geschmack für deinen Alltag.",
    facts: [
      "Molkenproteinkonzentrat",
      "Vanillegeschmack",
      "1.000 g pro Dose",
      "Portionsgröße: 30 g",
    ],
    flavor: "vanilla",
    image: "assets/formone-whey-vanilla.jpg",
    alt: "Originalverpackung von FormOne Premium Whey Protein Vanilla",
    mobile: "VANILLEPROTEIN",
    mobileDetail: "Molkenprotein · 1.000 g",
  },
  {
    title: "Kreatin-Gummis",
    copy: "Zuckerfreie Kreatin-Gummis von FormOne. Im Katalog ist das Produkt auch als vegan gekennzeichnet.",
    facts: [
      "Kreatin-Gummis",
      "Vegan",
      "90 Stück pro Dose",
      "Portionsgröße: 3 Stück",
    ],
    flavor: "creatine",
    image: "assets/formone-creatine-gummies.jpg",
    alt: "Originalverpackung von FormOne Creatine Gummies",
    mobile: "KREATIN VON FORMONE",
    mobileDetail: "Vegan · 90 Stück",
  },
];
const labels = featuredProducts.map((product) => product.title);
const descriptions = featuredProducts.map((product) => product.copy);
// SVG-Bausteine für Dosen und Athleten. (SVG-элементы банок и атлетов.)
function jar(name, x = -100, y = -176, s = 1) {
  const small = name === "ENZYME";
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
    <text y="64" text-anchor="middle" font-family="Arial" font-weight="700" font-size="${small ? 11 : 18}" fill="#f4ead2">${name}</text>
    <text y="78" text-anchor="middle" font-family="Arial" font-size="5.4" letter-spacing="1" fill="#9ea197">FÜR DEINE FORM</text>
  </g>`;
}
function leg(side) {
  return `<g class="leg ${side}" transform="translate(${side === "left" ? -25 : 25} -113)">
    <path d="M-24 -5Q-29 22 -17 59L13 61Q24 23 23 -4Z" fill="url(#body)" stroke="#8e917f" stroke-width="1.5"/>
    <path d="M-17 4L-11 39 3 52" fill="none" stroke="#121a1e" stroke-width="5"/>
    <g class="shin" transform="translate(0 54)">
    <path d="M-17 0Q-23 30 -13 56L14 56Q23 25 14 0Z" fill="url(#body)" stroke="#8e917f" stroke-width="1.5"/>
    <path d="M-14 48L-21 65Q-20 75 16 73L20 65 13 48Z" fill="#161e22" stroke="#b8ac87" stroke-width="2"/>
    <path d="M-16 64L14 66" stroke="#687268" stroke-width="3"/>
    </g>
    </g>`;
}
function arm(side) {
  let left = side === "left";
  return `<g class="arm ${side}" transform="translate(${left ? -54 : 54} -214)">
    <path d="M-15 -4Q-35 6 -26 41L-17 66 6 62Q25 28 14 0Z" fill="url(#body)" stroke="#a7a58c" stroke-width="1.5"/>
    <path d="M-22 17Q-2 7 8 26M-20 42Q-3 35 8 47" fill="none" stroke="#69736b" stroke-width="2"/>
    <g class="forearm" transform="translate(-7 56)">
    <path d="M-13 0L-19 49Q-13 66 4 54L15 8Z" fill="url(#body)" stroke="#a7a58c" stroke-width="1.5"/>
    <path d="M-18 47L-17 62 0 66 9 55 3 44Z" fill="#333e3f" stroke="#a7a58c" stroke-width="1.5"/>
    </g>
    </g>`;
}
const container = document.querySelector("#walkers");
// Kompakte Athleten: Hände und Ladung bewegen sich gemeinsam. (Компактные атлеты: руки и груз движутся вместе.)
function grip(x, y) {
  return `<g class="grip">
    <ellipse cx="${x}" cy="${y}" rx="11" ry="8" fill="#687168" stroke="#b7ab8a" stroke-width="1.5"/>
    <path d="M${x - 7} ${y - 3}q7-5 14 0M${x - 6} ${y + 1}v5m5-6v6m5-5v5" fill="none" stroke="#303936" stroke-width="1.4" stroke-linecap="round"/>
    <path d="M${x - 12} ${y + 4}l-7 4" stroke="#8b846f" stroke-width="5" stroke-linecap="round"/>
    </g>`;
}
function bentArm(d) {
  return `<path d="${d}" fill="none" stroke="#b8ac8c" stroke-width="29" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="${d}" fill="none" stroke="url(#body)" stroke-width="25" stroke-linecap="round" stroke-linejoin="round"/>`;
}
// Oberarm und Unterarm treffen sich am Ellenbogen; die Schulter bleibt am Rumpf. (Плечо и предплечье соединены локтем; плечевой сустав закреплён на торсе.)
function muscleSegment(a, b, root, bulge, tip) {
  const dx = b[0] - a[0],
    dy = b[1] - a[1],
    length = Math.hypot(dx, dy),
    nx = -dy / length,
    ny = dx / length;
  const point = (t, r) => `${a[0] + dx * t + nx * r} ${a[1] + dy * t + ny * r}`;
  return `<path d="M${point(0, root)}Q${point(0.38, bulge)} ${point(1, tip)}Q${point(1.1, 0)} ${point(1, -tip)}Q${point(0.35, -bulge)} ${point(0, -root)}Q${point(-0.12, 0)} ${point(0, root)}Z" fill="url(#body)" stroke="#a8a38c" stroke-width="1.6"/>
    <path d="M${point(0.18, -root * 0.58)}Q${point(0.46, -bulge * 0.6)} ${point(0.77, -tip * 0.7)}" fill="none" stroke="#788278" stroke-opacity=".65" stroke-width="2"/>`;
}
function carryArm(shoulder, elbow, wrist) {
  return `<g class="carry-arm">${muscleSegment(shoulder, elbow, 18, 27, 12)}<circle cx="${elbow[0]}" cy="${elbow[1]}" r="12" fill="#303b3d" stroke="#8a9282" stroke-width="1.2"/>${muscleSegment(elbow, wrist, 13, 22, 8)}<path d="M${shoulder[0] - 13} ${shoulder[1] + 5}q13-11 25 1" fill="none" stroke="#8c9687" stroke-width="2"/>
    </g>`;
}
function load(i) {
  // Die Dose sitzt unterhalb der Brust, die Hände tragen den Boden. (Банка ниже груди, ладони поддерживают её дно.)
  if (i === 0)
    return `${carryArm([-55, -210], [-72, -142], [-1, -79])}${carryArm([55, -210], [91, -145], [52, -79])}${jar("WHEY", 26, -173, 0.82)}${grip(-1, -79)}${grip(52, -79)}`;
  // Die Dose liegt auf der rechten Schulter; der Unterarm stützt sie von unten. (Банка на правом плече; предплечье поддерживает её снизу.)
  if (i === 1)
    return `${carryArm([55, -211], [116, -161], [102, -222])}${jar("BCAA", 76, -311, 0.77)}${grip(102, -222)}`;
  // Der Ellenbogen bleibt am Körper, die Hand trägt die Dose seitlich. (Локоть ближе к торсу, кисть держит банку сбоку.)
  if (i === 2)
    return `${carryArm([-55, -210], [-70, -144], [-108, -171])}${jar("ENZYME", -108, -245, 0.65)}${grip(-108, -171)}`;
  return `<path d="M-65 -100L-86 -414" stroke="#c2b594" stroke-width="6"/>
    <path class="flag" fill="#172226" stroke="#c7b181" stroke-width="2"/>
    <path class="flag-fold flag-fold-a" fill="none" stroke="#d5c49a" stroke-opacity=".23" stroke-width="5"/>
    <path class="flag-fold flag-fold-b" fill="none" stroke="#65706a" stroke-opacity=".55" stroke-width="6"/>
    <text class="flag-word" x="34" y="-340" text-anchor="middle" fill="#eee3c9" font-size="25" letter-spacing="2">FORMONE</text>${bentArm("M-54 -207Q-91 -188 -71 -153")}${grip(-71, -153)}`;
}
// Die hinteren Athleten zuerst zeichnen, damit die Überlagerung stimmt. (Сначала рисуем дальних атлетов, чтобы сохранить порядок перекрытия.)
for (let i = 3; i >= 0; i--) {
  let g = document.createElementNS(NS, "g");
  g.id = "walker-" + i;
  g.dataset.carry = [
    "two-hands-front",
    "right-shoulder",
    "outside-underhand",
    "oversized-flag",
  ][i];
  g.innerHTML = `<ellipse cy="8" rx="79" ry="12" fill="#0b1114" opacity=".5"/>
    <g class="squat" transform="scale(1.12 .76)">${leg("left")}${leg("right")}<g class="upper">
    <path d="M-59 -215Q-47 -242 0 -231Q44 -242 61 -211L39 -153 35 -112Q0 -94 -35 -113L-39 -153Z" fill="url(#body)" stroke="#b8ac8c" stroke-width="2"/>
    <path d="M-49 -207Q-29 -218 -4 -201L-10 -159 -31 -147M49 -207Q29 -218 4 -201L10 -159 31 -147" fill="#293538" stroke="#606e67" stroke-width="2"/>
    <path d="M0 -209V-137M-31 -138Q0 -125 31 -138M-31 -121Q0 -111 31 -121" fill="none" stroke="#101a1e" stroke-width="4"/>
    <g transform="translate(0 -237) scale(1.32 1.25) translate(0 237)">
    <path d="M-24 -260Q-21 -286 5 -286Q27 -283 27 -258L19 -237 -16 -237Z" fill="url(#body)" stroke="#9da18e" stroke-width="2"/>
    <path d="M-26 -263Q-30 -294 7 -293Q31 -291 29 -271L38 -267 23 -262Z" fill="#1c282c" stroke="#abb099" stroke-width="2"/>
    <path d="M-16 -271L-10 -249M-1 -275L3 -250" stroke="#56635b" stroke-width="2"/>
    </g>
    <path d="M-34 -233Q0 -248 34 -233L26 -218Q0 -229 -26 -218Z" fill="#18252a" stroke="#727e71" stroke-width="2"/>
    <text x="${i === 0 ? -17 : 0}" y="-177" fill="#939b87" opacity=".75" font-size="25" font-family="Arial" font-style="italic" font-weight="bold" text-anchor="middle">F1</text>${i === 1 ? arm("left") : i === 2 ? arm("right") : i === 3 ? arm("right") : ""}<g class="cargo">${load(i)}</g>
    </g>
    </g>`;
  container.appendChild(g);
}
// Ein fester Startwert hält Steine und Weglichter beim Zurückscrollen unverändert. (Фиксированное начальное значение сохраняет камни и огни при обратной прокрутке.)
let seed = 12;
function rand() {
  seed = (seed * 1664525 + 1013904223) >>> 0;
  return seed / 4294967296;
}
let terrain = "";
for (let i = 0; i < 95; i++) {
  let x = rand() * 1600,
    y = 450 + rand() * 500,
    w = 8 + rand() * 50;
  terrain += `<path d="M${x} ${y}l${w * 0.3} ${-w * 0.3} ${w * 0.7} ${w * 0.15} ${w * 0.3} ${w * 0.3}Z" fill="${i % 3 ? "#202827" : "#51554b"}" opacity=".7"/>`;
}
for (let i = 0; i < 7; i++) {
  let x = 100 + i * 157,
    y = 854 - i * 62;
  terrain += `<ellipse cx="${x}" cy="${y}" rx="50" ry="35" fill="url(#light)"/>
    <path d="M${x} ${y}v-17" stroke="#706851" stroke-width="3"/>
    <circle cx="${x}" cy="${y - 18}" r="4" fill="#ffe1a0"/>`;
}
document.querySelector("#terrain").innerHTML = terrain;
// Der Katalog nutzt dieselben Produktdaten wie die Startszene. (Каталог использует те же данные товаров, что и первая сцена.)
document.querySelector(".cards").innerHTML = [
  featuredProducts[0],
  featuredProducts[1],
  featuredProducts[2],
]
  .map(
    (product, i) =>
      `<article class="card">
    <span class="tag">FORMONE / 0${i + 1}</span>
    <div class="card-visual product-art" data-flavor="${product.flavor}">
    <img src="${product.image}" alt="${product.alt}" loading="lazy">
    </div>
    <h3>${product.title}</h3>
    <p>${product.copy}</p>
    </article>`,
  )
  .join("");
const rigs = [0, 1, 2, 3].map((i) => document.querySelector("#walker-" + i));
const starts = [
  [420, 843, 1.2],
  [680, 702, 0.94],
  [895, 584, 0.73],
  [1050, 518, 0.53],
];
const clamp = (n, a = 0, b = 1) => Math.max(a, Math.min(b, n));
const smooth = (t) => t * t * (3 - 2 * t);
// Schokoladenfarben stufenlos mischen. (Плавно смешиваем шоколадные оттенки.)
function blendColor(dark, light, amount) {
  const channels = dark.map((value, i) =>
    Math.round(value + (light[i] - value) * amount),
  );
  return `rgb(${channels.join(", ")})`;
}
// Bild, Alternativtext und Produktkennung gemeinsam aktualisieren. (Изображение, альтернативный текст и тип товара обновляются вместе.)
function showFeaturedProduct(stage) {
  const product = featuredProducts[stage];
  document.querySelector(".featured-product").dataset.flavor = product.flavor;
  document.querySelector(".mobile-featured-product").dataset.flavor =
    product.flavor;
  document.querySelector("#mobile-featured-title").textContent = product.title;
  document.querySelector("#mobile-featured-detail").textContent =
    product.mobileDetail;
  for (const prefix of ["", "mobile-"]) {
    const image = document.querySelector(`#${prefix}featured-image`);
    if (!image) continue;
    if (image.getAttribute("src") !== product.image)
      image.setAttribute("src", product.image);
    image.alt = product.alt;
    const note = document.querySelector(`#${prefix}featured-note`);
    if (note)
      note.textContent = prefix
        ? product.mobile
        : "ORIGINALPRODUKT VON FORMONE";
  }
}
// Mobile Animation: Fortschritt von 0 bis 1 steuert Pulver, Wasser und Mischung. (Мобильная анимация: прогресс от 0 до 1 управляет порошком, водой и смесью.)
function renderMobile(p) {
  const scene = document.querySelector(".mobile-scene");
  if (!scene) return;

  // Auf dem Smartphone erzählt der Shaker seine eigene Geschichte. (На телефоне используется отдельный сюжет с шейкером.)
  const personIn = clamp((p - 0.02) / 0.11);
  const pourIn = smooth(clamp((p - 0.13) / 0.05));
  const pourOut = 1 - smooth(clamp((p - 0.275) / 0.05));
  const powder = clamp((p - 0.18) / 0.025) * (1 - clamp((p - 0.25) / 0.035));
  const powderAmount = clamp((p - 0.18) / 0.09);
  const waterIn = clamp((p - 0.27) / 0.09);
  const waterOut = 1 - clamp((p - 0.55) / 0.07);
  const water = waterIn * waterOut;
  const waterAmount = clamp((p - 0.34) / 0.28);
  const mix = clamp((p - 0.35) / 0.38);
  const dilution = smooth(clamp((p - 0.35) / 0.32));
  const final = clamp((p - 0.7) / 0.12);
  const fade = clamp((p - 0.9) / 0.075);

  const athlete = document.querySelector("#mobile-athlete");
  const jarNode = document.querySelector("#mobile-protein-jar");
  const athleteX = 326 - 24 * personIn;
  const athleteY = 176 - 2 * Math.sin(personIn * Math.PI * 2) ** 2;
  const tilt = -8 - 102 * pourIn * pourOut;
  if (athlete) {
    athlete.setAttribute("transform", `translate(${athleteX} ${athleteY})`);
    athlete.style.opacity = String(0.85 + 0.15 * personIn);
  }
  // Zwei kurze Schritte: Der Standfuß bleibt auf der Plattform, nur der andere hebt ab. (Два коротких шага: опорная стопа остаётся на площадке, другая поднимается.)
  ["left", "right"].forEach((side, index) => {
    const step = clamp(personIn * 2 - index);
    const lift = 13 * Math.sin(step * Math.PI);
    const hipX = index === 0 ? -14 : 14;
    const footX = 326 + (index === 0 ? -24 : 24) - 24 * smooth(step) - athleteX;
    const footY = 47 + (176 - athleteY) - lift;
    const kneeX = hipX + (footX - hipX) * 0.45 - lift * 0.45;
    const leg = document.querySelector(`#mobile-leg-${side}`);
    leg
      .querySelector("path")
      .setAttribute(
        "d",
        `M${hipX} -8L${kneeX} ${18 - lift * 0.3}L${footX} ${footY - 6}`,
      );
    leg
      .querySelector(".mobile-foot")
      .setAttribute("d", `M${footX - 9} ${footY}H${footX + 7}`);
  });
  if (jarNode) {
    jarNode.setAttribute("transform", `translate(-61 -14) rotate(${tilt})`);
  }
  const lidOpen = clamp((p - 0.13) / 0.035) * (1 - clamp((p - 0.34) / 0.06));
  const lid = document.querySelector("#mobile-jar-lid");
  lid.setAttribute("transform", `translate(0 ${-25 * lidOpen})`);
  lid.style.opacity = String(1 - lidOpen);

  const powderPath = document.querySelector("#mobile-powder");
  const powderCloud = document.querySelector("#mobile-powder-cloud");
  if (powderPath) {
    powderPath.style.opacity = String(powder);
    powderPath.setAttribute("stroke-dashoffset", String(-p * 18));
  }
  if (powderCloud) powderCloud.style.opacity = String(powder * 0.7);

  ["#mobile-water", "#mobile-water-hi"].forEach((sel) => {
    const el = document.querySelector(sel);
    if (el) {
      el.style.opacity = String(water * (sel.endsWith("-hi") ? 0.55 : 0.92));
      el.setAttribute("stroke-dashoffset", String(1 - waterIn));
    }
  });

  const liquid = document.querySelector("#mobile-liquid");
  const wave = document.querySelector("#mobile-wave");
  const swirl = document.querySelector("#mobile-swirl");
  // Zuerst sammelt sich dunkles Pulver; erst Wasser erhöht Volumen und Helligkeit. (Сначала накапливается тёмный порошок; вода увеличивает объём и осветляет смесь.)
  const fillHeight = 110 * powderAmount + 245 * waterAmount;
  const topY = 792 - fillHeight;
  document
    .querySelector("#mobile-liquid-top")
    .setAttribute(
      "stop-color",
      blendColor([99, 67, 48], [182, 142, 106], dilution),
    );
  document
    .querySelector("#mobile-liquid-bottom")
    .setAttribute(
      "stop-color",
      blendColor([48, 33, 27], [110, 76, 54], dilution),
    );
  // Pulver und Wasser fließen von Öffnung und Hahn bis zur aktuellen Füllhöhe. (Порошок и вода идут от горлышка и крана до текущего уровня смеси.)
  const angle = (tilt * Math.PI) / 180;
  const mouthX = athleteX - 61 + 36 * Math.sin(angle);
  const mouthY = athleteY - 14 - 36 * Math.cos(angle);
  powderPath.setAttribute("d", `M${mouthX} ${mouthY}Q200 280 205 ${topY}`);
  powderPath.setAttribute("stroke-width", "6");
  powderCloud.setAttribute("transform", `translate(0 ${topY - 400})`);
  ["#mobile-water", "#mobile-water-hi"].forEach((sel) =>
    document
      .querySelector(sel)
      .setAttribute("d", `M65 276C67 309 135 325 145 ${topY}`),
  );
  if (liquid) {
    liquid.setAttribute("y", topY.toFixed(1));
    liquid.setAttribute("height", fillHeight.toFixed(1));
  }
  if (wave) {
    wave.setAttribute("cy", topY.toFixed(1));
    wave.setAttribute("rx", String(120 + 26 * mix));
    wave.setAttribute("ry", String(4 + 12 * waterAmount));
    wave.setAttribute(
      "fill",
      blendColor([120, 81, 58], [206, 170, 131], dilution),
    );
    wave.style.opacity = String(powderAmount * (0.7 + 0.16 * mix));
  }
  if (swirl) {
    swirl.style.opacity = String(
      clamp((mix - 0.12) / 0.45) * (1 - clamp((p - 0.82) / 0.08)),
    );
    swirl.setAttribute(
      "transform",
      `translate(0 ${20 * (1 - mix)}) rotate(${mix * 18} 195 650)`,
    );
  }

  const statusNum = document.querySelector("#mobile-status-num");
  const statusLabel = document.querySelector("#mobile-status-label");
  let status = ["01", "PROTEIN HINZUFÜGEN"];
  if (p >= 0.27) status = ["02", "WASSER HINZUFÜGEN"];
  if (p >= 0.46) status = ["03", "MISCHEN"];
  if (p >= 0.72) status = ["04", "FERTIG"];
  if (statusNum) statusNum.textContent = status[0];
  if (statusLabel) statusLabel.textContent = status[1];

  // Zum Abschluss rückt der fertige Shake leicht näher. (В финале готовая смесь немного приближается.)
  const shaker = document.querySelector("#mobile-shaker");
  if (shaker)
    shaker.setAttribute(
      "transform",
      `translate(0 ${-7 * final}) scale(${1 + 0.015 * final} ${1 + 0.015 * final})`,
    );

  scene.style.opacity = String(1 - fade);
  scene.style.visibility = fade === 1 ? "hidden" : "visible";
  scene.setAttribute("aria-hidden", fade === 1 ? "true" : "false");
  const reveal = document.querySelector(".reveal");
  reveal.style.opacity = String(fade);
  reveal.style.visibility = fade > 0 ? "visible" : "hidden";
  reveal.style.pointerEvents = fade > 0.5 ? "auto" : "none";
  document.querySelector(".progress i").style.width = p * 100 + "%";
  // Jeder Zubereitungsschritt zeigt einen Produktabschnitt wie auf dem Desktop. (Каждый этап приготовления переключает товарный блок, как на компьютере.)
  showFeaturedProduct(Number(status[0]) - 1);
  document.body.dataset.stage = fade === 1 ? "5" : status[0];
  document.body.dataset.progress = p.toFixed(4);
}

// Desktop-Animation: Weg, Schritte und Produktwechsel. (Анимация на компьютере: путь, шаги и смена товара.)
function renderDesktop(p) {
  // Die Athleten gehen während der ersten 88 Prozent der Scrollstrecke zum Studio. (Атлеты идут к залу на первых 88 процентах прокрутки.)
  const travel = clamp(p / 0.88);

  // Zehn Schrittzyklen über die ganze Strecke sorgen für einen ruhigen Gang. (Десять циклов шага на весь путь задают спокойную походку.)
  const phase = travel * Math.PI * 20;

  rigs.forEach((g, i) => {
    const [x, y, s] = starts[i];
    const t = travel * 0.76;
    const scale = s * (1 - t * 0.69);
    const wave = Math.sin(phase + i * 1.9);

    g.setAttribute(
      "transform",
      `translate(${x + (1218 - x) * t} ${y + (467 - y) * t}) scale(${scale})`,
    );
    g.querySelector(".upper").setAttribute(
      "transform",
      `translate(0 ${-Math.abs(wave) * 5.5}) rotate(${(i === 0 ? 7 : i === 1 ? -5 : i === 2 ? 4 : -7) + wave * 2.2} 0 -120)`,
    );

    ["left", "right"].forEach((side, k) => {
      const a = Math.sin(phase + i * 1.9 + k * Math.PI);
      g.querySelector(".leg." + side).setAttribute(
        "transform",
        `translate(${k ? 25 : -25} -113) rotate(${a * 22})`,
      );
      g.querySelector(".leg." + side + " .shin").setAttribute(
        "transform",
        `translate(0 54) rotate(${Math.max(0, -a) * 34})`,
      );
      const armNode = g.querySelector(".arm." + side);
      if (armNode) {
        armNode.setAttribute(
          "transform",
          `translate(${k ? 54 : -54} -214) rotate(${-a * 13})`,
        );
        armNode
          .querySelector(".forearm")
          .setAttribute("transform", `translate(-7 56) rotate(${a * 8.5})`);
      }
    });

    // Tragende Arme folgen dem Rumpf, damit die Schultern an ihrem Platz bleiben. (Руки с грузом следуют за корпусом, не смещая плечевые суставы.)
    g.querySelector(".cargo").setAttribute(
      "transform",
      i < 3 ? "translate(0 0)" : `rotate(${wave * 1.2} -54 -207)`,
    );
  });

  const w = Math.sin(phase * 1.15) * 17;
  const edge = Math.sin(phase * 1.15 + 1.3) * 22;
  document
    .querySelector(".flag")
    .setAttribute(
      "d",
      `M-86 -410C-19 ${-431 + w * 0.25} 63 ${-407 - w * 0.45} 150 ${-375 + edge}Q164 ${-325 + edge * 0.5} 143 ${-270 - edge * 0.65}C59 ${-310 - w * 0.55} -11 ${-325 + w * 0.4} -80 -303Z`,
    );
  document
    .querySelector(".flag-fold-a")
    .setAttribute(
      "d",
      `M-34 ${-416 + w * 0.17}Q-9 ${-369 - w * 0.15} -13 ${-318 + w * 0.24}`,
    );
  document
    .querySelector(".flag-fold-b")
    .setAttribute(
      "d",
      `M66 ${-402 - w * 0.4}Q85 ${-347 + edge * 0.2} 64 ${-292 - edge * 0.25}`,
    );
  document
    .querySelector(".flag-word")
    .setAttribute(
      "transform",
      `translate(${w * 0.13} ${edge * 0.08}) rotate(${w * 0.08} 34 -340)`,
    );
  document
    .querySelector("#cape")
    .setAttribute(
      "d",
      `M-38 -208C25 -233 73 ${-144 + w} 176 ${-133 + w}L137 ${-33 - w}Q58 ${-58 + w} 23 -103Z`,
    );

  // Jeder Produktabschnitt belegt 22 Prozent der Scrollstrecke. (Каждый товарный этап занимает 22 процента прокрутки.)
  const chapter = 0.22;
  const stage = Math.min(3, Math.floor(p / chapter));
  showFeaturedProduct(stage);
  document.querySelector("#number").textContent = "0" + (stage + 1);
  document.querySelector("#stage-title").textContent = labels[stage];
  document.querySelector("#stage-copy").textContent = descriptions[stage];
  document.querySelector("#stage-facts").innerHTML = featuredProducts[
    stage
  ].facts
    .map((fact) => `<li>${fact}</li>`)
    .join("");
  document.querySelectorAll(".dots button").forEach((b, i) => {
    b.classList.toggle("active", i === stage);
    b.setAttribute("aria-current", i === stage ? "step" : "false");
  });

  // Nach dem Weg zum Studio wird der Übergang zum Sortiment eingeblendet. (После пути к залу появляется переход к каталогу.)
  const fade = clamp((p - 0.89) / 0.085);
  const scene = document.querySelector(".desktop-scene");
  const reveal = document.querySelector(".reveal");
  scene.style.opacity = 1 - fade;
  scene.style.visibility = fade === 1 ? "hidden" : "visible";
  scene.setAttribute("aria-hidden", fade === 1 ? "true" : "false");
  reveal.style.opacity = fade;
  reveal.style.visibility = fade > 0 ? "visible" : "hidden";
  reveal.style.pointerEvents = fade > 0.5 ? "auto" : "none";
  document.querySelector(".progress i").style.width = p * 100 + "%";
  document.body.dataset.stage = fade === 1 ? "5" : String(stage + 1);
  document.body.dataset.progress = p.toFixed(4);
}

// Die tatsächliche Höhe der fixierten Szene bestimmt die Scrollstrecke. (Реальная высота закреплённой сцены определяет длину прокрутки.)
function render() {
  const journey = document.querySelector(".journey");
  const maxScroll = Math.max(
    1,
    journey.offsetHeight - document.querySelector(".sticky").offsetHeight,
  );
  const p = clamp(scrollY / maxScroll);
  if (mobileLayout.matches) renderMobile(p);
  else renderDesktop(p);
}
// Die Scrollposition bestimmt jede Pose; pro Bild wird höchstens einmal neu gezeichnet. (Каждая поза зависит от прокрутки; перерисовка выполняется не чаще одного раза за кадр.)
let queued = false;
function update() {
  if (!queued) {
    queued = true;
    requestAnimationFrame(() => {
      queued = false;
      render();
    });
  }
}
addEventListener("scroll", update, { passive: true });
addEventListener("resize", update);
document
  .querySelectorAll(".dots button")
  .forEach((b, i) =>
    b.addEventListener("click", () =>
      scrollTo(
        0,
        (i === 0 ? 0 : i * 0.22 + 0.003) *
          (document.querySelector(".journey").offsetHeight - innerHeight),
      ),
    ),
  );
render();
