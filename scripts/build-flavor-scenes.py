#!/usr/bin/env python3
"""Dark packaging-led catalog scenes. (Тёмные сцены каталога по вкусу товара.)"""
from __future__ import annotations
import hashlib, io, json, math, random, re, subprocess, urllib.request
from collections import deque
from pathlib import Path
from urllib.parse import urlparse
import cairosvg
from PIL import Image, ImageDraw, ImageFilter, ImageOps
ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'assets'/'catalog-scenes'
PALETTES={
 'cookies':('#65503a','cookie'),'strawberry':('#52222b','strawberry'),
 'clear-peach':('#604538','peach'),'clear-lemon':('#555037','lemon'),
 'electro-strawberry':('#49332b','strawberry-lemon'),'electro-mango':('#584b30','mango'),
 'creatine-cherry':('#522230','cherry'),'creatine-pure':('#444d4e','powder'),
 'magnesium':('#472a38','raspberry'),'ashwagandha':('#4c4631','mango'),
 'shilajit':('#293b48','blueberry'),'pre-raspberry':('#532234','raspberry'),'pre-tutti':('#564030','mixed')}

def gradient(name,a,b,c):
 return f'<radialGradient id="{name}" cx="30%" cy="22%" r="80%"><stop stop-color="{a}"/><stop offset=".48" stop-color="{b}"/><stop offset="1" stop-color="{c}"/></radialGradient>'

def ingredients(kind):
 # Nur dekoratives Umfeld. Originalverpackungen werden nicht gezeichnet. (Рисуем только окружение, не упаковку.)
 rng=random.Random(21)
 defs=''.join(gradient(*a) for a in [('biscuit','#e2b876','#af7940','#674627'),('berry','#ed5660','#b81e37','#4a101e'),('rasp','#ec506b','#a91843','#420d24'),('peach','#ffce87','#e99158','#8b4c32'),('lemon','#fff08c','#dccb49','#897c23'),('mango','#ffe197','#eeb347','#a97623'),('cherry','#e95068','#981b38','#310d1b'),('blue','#8aabc8','#4b6c97','#172940'),('leaf','#8a9d5f','#4a6139','#202d20')])
 defs+='<filter id="foodShadow" x="-50%" y="-50%" width="200%" height="220%"><feDropShadow dx="0" dy="10" stdDeviation="9" flood-color="#000" flood-opacity=".55"/></filter>'
 def leaf(x,y,r=0):
  return f'<g transform="translate({x} {y}) rotate({r})"><path d="M0 0Q-10-33 30-36Q36-10 0 0Z" fill="url(#leaf)"/><path d="M0 0L26-32" stroke="#c3ce95" stroke-opacity=".35" fill="none"/></g>'
 def cookie(x,y,s=1,r=0):
  edge=' '.join(f'{math.cos(i*math.pi/18)*(62+rng.uniform(-3,3)):.1f},{math.sin(i*math.pi/18)*(58+rng.uniform(-3,3)):.1f}' for i in range(36))
  chips=''.join(f'<path d="M{x1:.1f} {y1:.1f}l8-3 5 7-6 6-7-3Z" fill="{rng.choice(["#382720","#503126","#392920"])}"/>' for x1,y1 in [(rng.uniform(-43,43),rng.uniform(-38,38)) for _ in range(15)])
  pores=''.join(f'<circle cx="{rng.uniform(-46,46):.1f}" cy="{rng.uniform(-42,42):.1f}" r="{rng.uniform(.4,1.8):.1f}" fill="#59381d" opacity=".28"/>' for _ in range(85))
  return f'<g transform="translate({x} {y}) rotate({r}) scale({s})" filter="url(#foodShadow)"><ellipse cy="6" rx="61" ry="58" fill="#6e482d"/><polygon points="{edge}" fill="url(#biscuit)"/>{pores}{chips}<path d="M-52 7l18-9 9-21M7 40l4-21 26-7" fill="none" stroke="#7d542d" stroke-opacity=".55" stroke-width="1.2"/></g>'
 def strawberry(x,y,s=1,r=0):
  seeds=''.join(f'<ellipse cx="{(j-(n-1)/2)*15}" cy="{yy}" rx="1.9" ry="3.2" fill="#f7c284" opacity=".65"/>' for yy,n in [(-20,5),(-4,6),(13,5),(29,4),(43,3),(56,1)] for j in range(n))
  crown=''.join(f'<path d="M0-41Q{a}-72 {b}-61L0-31Z" fill="url(#leaf)"/>' for a,b in [(-20,-39),(-35,4),(2,35),(26,44)])
  return f'<g transform="translate({x} {y}) rotate({r}) scale({s})" filter="url(#foodShadow)"><path d="M0-42C-62-67-72-19-44 25C-20 70-4 79 7 69C29 50 62 11 59-21C57-49 34-57 0-42Z" fill="url(#berry)"/>{seeds}{crown}<ellipse cx="-26" cy="-17" rx="9" ry="22" fill="#ffc2b6" opacity=".14" transform="rotate(28)"/></g>'
 def lemon(x,y,s=1,r=0):
  segments=''.join(f'<path d="M0 0L{48*math.cos(a):.2f} {42*math.sin(a):.2f}A48 42 0 0 1 {48*math.cos(a+.61):.2f} {42*math.sin(a+.61):.2f}Z" fill="url(#lemon)" stroke="#fff1bf" stroke-width="2"/>' for a in [i*math.tau/9 for i in range(9)])
  return f'<g transform="translate({x} {y}) rotate({r}) scale({s})" filter="url(#foodShadow)"><ellipse rx="61" ry="55" fill="#c3a72b"/><ellipse rx="56" ry="50" fill="#f4dfab"/>{segments}<ellipse rx="5" ry="4" fill="#fff4cf"/></g>'
 def peach(x,y,s=1,r=0):
  return f'<g transform="translate({x} {y}) rotate({r}) scale({s})" filter="url(#foodShadow)"><path d="M0-48C-68-75-78 23-30 54C5 82 64 35 64-6C66-46 28-62 0-48Z" fill="#bf6550"/><path d="M0-43C-57-63-66 23-27 49C3 70 57 29 57-6C59-40 27-57 0-43Z" fill="url(#peach)"/><ellipse cy="2" rx="22" ry="30" fill="#a76b3a"/><ellipse cy="2" rx="15" ry="25" fill="#70472c"/><path d="M-10-16l12 5-7 12 12 9-6 12M4-20L-3-2 8 3" fill="none" stroke="#bd8552" stroke-width="2"/></g>'
 def mango(x,y,s=1,r=0):
  cubes=''.join(f'<rect x="{i*20-39}" y="{j*23-30}" width="19" height="22" rx="4" fill="url(#mango)" stroke="#8e6222" stroke-opacity=".28"/>' for i in range(4) for j in range(3))
  return f'<g transform="translate({x} {y}) rotate({r}) scale({s})" filter="url(#foodShadow)"><ellipse rx="62" ry="50" fill="#789344"/><ellipse rx="59" ry="47" fill="url(#mango)"/>{cubes}</g>'
 def raspberry(x,y,s=1,r=0):
  lumps=''.join(f'<circle cx="{(j-(n-1)/2)*18}" cy="{yy}" r="13" fill="url(#rasp)" stroke="#591526" stroke-opacity=".35" stroke-width=".6"/>' for yy,n in [(-27,3),(-11,4),(7,5),(25,4),(40,3),(51,1)] for j in range(n))
  return f'<g transform="translate({x} {y}) rotate({r}) scale({s})" filter="url(#foodShadow)">{lumps}</g>'
 def cherry(x,y,s=1,r=0):
  return f'<g transform="translate({x} {y}) rotate({r}) scale({s})" filter="url(#foodShadow)"><path d="M-24 5Q-7-29 1-78Q19-27 37 13" fill="none" stroke="#7c8454" stroke-width="4"/><circle cx="-23" cy="17" r="28" fill="url(#cherry)"/><circle cx="37" cy="28" r="30" fill="url(#cherry)"/><ellipse cx="-33" cy="3" rx="6" ry="10" fill="#fff" opacity=".23"/><ellipse cx="27" cy="13" rx="6" ry="10" fill="#fff" opacity=".2"/>{leaf(2,-66,12)}</g>'
 def blueberry(x,y,s=1,r=0):
  return f'<g transform="translate({x} {y}) rotate({r}) scale({s})" filter="url(#foodShadow)"><circle r="33" fill="url(#blue)"/><path d="M-10-18L-2-14 8-19 5-9 12-4 2-2-3 6-8-3-18-5-9-10Z" fill="#253349"/><path d="M-22 3A26 26 0 0 1-6-25" stroke="#d6e4eb" stroke-opacity=".25" stroke-width="2" fill="none"/></g>'
 draw={'cookie':cookie,'strawberry':strawberry,'lemon':lemon,'peach':peach,'mango':mango,'raspberry':raspberry,'cherry':cherry,'blueberry':blueberry}
 if kind=='powder':
  bits=''.join(f'<circle cx="{rng.uniform(113,700):.1f}" cy="{rng.uniform(535,606):.1f}" r="{rng.uniform(.4,1.5):.1f}" fill="#e2e2d9" opacity="{rng.uniform(.2,.6):.2f}"/>' for _ in range(130))
  food='<path d="M78 553Q125 530 157 522Q181 529 211 556Z" fill="#d5d7cf"/><path d="M81 553Q153 549 209 556Q170 566 81 553Z" fill="#8e9d9d"/>'+bits
 elif kind=='strawberry-lemon': food=strawberry(132,511,.91,-25)+lemon(658,531,.86,20)+leaf(660,492,-25)
 elif kind=='mixed': food=peach(132,526,.77,-22)+strawberry(659,528,.65,20)+lemon(675,469,.44,40)
 elif kind=='blueberry': food=blueberry(136,540,1.08)+blueberry(640,546,.95,15)+blueberry(683,533,.78,-12)+leaf(662,526,-5)
 else:
  fn=draw[kind];food=fn(132,515,.96,-20)+fn(658,538,.74,21)
  if kind not in ('cookie','cherry'): food+=leaf(665,500,-17)
 if kind=='cookie':
  food+=''.join(f'<path d="M{x:.1f} {y:.1f}l{size} -2 3 {size} -5 2Z" fill="{rng.choice(["#b58a5c","#8d693e","#674727"])}"/>' for x,y,size in [(rng.uniform(140,670),rng.uniform(551,610),rng.randint(1,4)) for _ in range(44)])
 return '<defs>'+defs+'</defs>'+food

def scene_svg(flavor):
 tint,kind=PALETTES[flavor]
 return f'<svg xmlns="http://www.w3.org/2000/svg" width="800" height="650" viewBox="0 0 800 650"><defs><radialGradient id="light"><stop stop-color="{tint}"/><stop offset=".52" stop-color="#202526"/><stop offset="1" stop-color="#111617"/></radialGradient><linearGradient id="floor" x2="0" y2="1"><stop stop-color="#b6ab90" stop-opacity=".08"/><stop offset="1" stop-color="#111617" stop-opacity="0"/></linearGradient></defs><rect width="800" height="650" fill="#111617"/><ellipse cx="402" cy="305" rx="437" ry="374" fill="url(#light)"/><ellipse cx="400" cy="554" rx="360" ry="92" fill="url(#floor)"/><path d="M68 513Q399 495 740 513" fill="none" stroke="#d3b988" stroke-opacity=".075"/>{ingredients(kind)}</svg>'

def download(url):
 if urlparse(url).hostname not in ('formonenutrition.com','cdn.shopify.com'): raise ValueError('Unexpected product-image host')
 request=urllib.request.Request(url,headers={'User-Agent':'Mozilla/5.0 (compatible; FormOne site asset build)'})
 with urllib.request.urlopen(request,timeout=35) as response: data=response.read(10_000_001)
 if len(data)>10_000_000: raise ValueError('Product image is unexpectedly large')
 return data

def cutout(data):
 # Entfernt nur zusammenhängenden neutralen Außenhintergrund. (Убираем только связный нейтральный внешний фон.)
 image=Image.open(io.BytesIO(data)).convert('RGBA');image.thumbnail((1000,1000),Image.Resampling.LANCZOS)
 w,h=image.size;px=image.convert('RGB').load();alpha=Image.new('L',(w,h),255);a=alpha.load();visited=bytearray(w*h);q=deque()
 def add(x,y):
  i=y*w+x
  if visited[i]: return
  visited[i]=1;c=px[x,y]
  if min(c)>=120 and sum(c)/3>=155 and max(c)-min(c)<=105: a[x,y]=0;q.append((x,y))
 for x in range(w): add(x,0);add(x,h-1)
 for y in range(h): add(0,y);add(w-1,y)
 while q:
  x,y=q.popleft()
  if x: add(x-1,y)
  if x+1<w: add(x+1,y)
  if y: add(x,y-1)
  if y+1<h: add(x,y+1)
 removed=sum(v==0 for v in alpha.getdata())/(w*h)
 if not .10<removed<.96: raise ValueError(f'Backdrop needs manual review: removed={removed:.3f}')
 alpha=alpha.filter(ImageFilter.MinFilter(3));box=alpha.getbbox()
 if not box or box[3]-box[1]<h*.25: raise ValueError('No plausible package silhouette')
 image.putalpha(alpha);return image.crop(box)

def render_product(flavor,photo):
 stage=Image.open(io.BytesIO(cairosvg.svg2png(bytestring=scene_svg(flavor).encode()))).convert('RGBA')
 pack=ImageOps.contain(cutout(photo),(300,446),Image.Resampling.LANCZOS);x=(800-pack.width)//2;y=544-pack.height
 shadow=Image.new('RGBA',stage.size);mask=Image.new('L',stage.size);d=ImageDraw.Draw(mask)
 d.ellipse((x-11,529,x+pack.width+11,561),fill=155);mask=mask.filter(ImageFilter.GaussianBlur(12));shadow.putalpha(mask)
 stage.alpha_composite(shadow);stage.alpha_composite(pack,(x,y));return stage.convert('RGB')

def patch_site(products):
 js_path=ROOT/'animation.js';js=js_path.read_text();old=js;match=re.search(r'const catalogProducts = \[.*?\n\];',js,re.S)
 if not match: raise RuntimeError('Catalog data block not found')
 for p in products:
  if p.get('scene'): p['copy']=p['copy'].split(' – ')[0].rstrip('.')+'.'
  else:
   p['image']=f'assets/catalog-scenes/{p["flavor"]}.webp';p['copy']=p['copy'].split('. ')[0].rstrip('.')+'.'
 next(p for p in products if p['flavor']=='creatine-pure')['copy']='Kreatin-Monohydrat in Pulverform.'
 js=js[:match.start()]+'const catalogProducts = '+json.dumps(products,ensure_ascii=False,indent=2)+';'+js[match.end():]
 js=js.replace('"scene-art" : "snow-art"','"scene-art" : "flavor-art"')
 js=js.replace('die übrigen Produkte bekommen ein helles Frost/Snow-Artwork.','die übrigen Produkte bekommen eine zum Geschmack passende dunkle Szene.').replace('остальные получают светлый снежный стиль.','остальные получают тёмные сцены по вкусу и рисункам на упаковке.')
 if js==old or '"scene-art" : "flavor-art"' not in js: raise RuntimeError('Renderer patch did not apply')
 js_path.write_text(js)
 css_path=ROOT/'styles.css';css=css_path.read_text();marker='/* Vollständiger Produktkatalog: Snow/Frost-System'
 if marker not in css: raise RuntimeError('Expected catalog styling block not found')
 start=css.index('.card-visual.snow-art',css.index(marker));end=css.index('@media (max-width: 980px)',start)
 css=css[:start]+'''/* Geschmacks-Szenen: Originalverpackung, ruhiger Hintergrund, keine Schneeschicht.
   (Сцены вкусов: оригинальная упаковка, спокойное окружение, без снега.) */
.card-visual.flavor-art {
  isolation: isolate;
  overflow: hidden;
  background: #111617;
  border: 1px solid #ffffff0d;
  border-radius: 7px;
}
.card .flavor-art img,
.card:hover .flavor-art img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  max-width: 100%;
  transform: none;
  clip-path: none;
  object-fit: contain;
  mix-blend-mode: normal;
  filter: none;
}
.card-visual.flavor-art::before,
.card-visual.flavor-art::after { content: none; }
@media (prefers-reduced-motion: reduce) {
  .card, .catalog-filter { transition: none; }
  .card:hover, .catalog-filter:hover { transform: none; }
}

'''+css[end:]
 css=css.replace('Snow/Frost-System für die neuen Karten. (Полный каталог: снежно-морозная система для новых карточек.)','Geschmacks-Szenen für die neuen Karten. (Полный каталог: сцены по вкусам новых товаров.)').replace('.card-visual.snow-art {','.card-visual.flavor-art {');css_path.write_text(css)
 html_path=ROOT/'index.html';html_path.write_text(html_path.read_text().replace('catalog-snow-1','catalog-flavors-2'))

def main():
 OUT.mkdir(parents=True,exist_ok=True);js=(ROOT/'animation.js').read_text();match=re.search(r'const catalogProducts = \[.*?\n\];',js,re.S)
 if not match: raise RuntimeError('No catalog in source')
 literal=match.group(0).replace('const catalogProducts = ','',1).rstrip(';')
 products=json.loads(subprocess.check_output(['node','-e','const vm=require("node:vm"); console.log(JSON.stringify(vm.runInNewContext(process.argv[1])))',literal],text=True))
 assert len(products)==16 and sum(bool(p.get('scene')) for p in products)==3
 sources=[]
 for p in products:
  if p.get('scene'): continue
  flavor=p['flavor'];source=p['image'];photo=download(source);image=render_product(flavor,photo);image.save(OUT/f'{flavor}.webp','WEBP',quality=90,method=6)
  sources.append({'flavor':flavor,'source':source,'sha256':hashlib.sha256(photo).hexdigest(),'artwork':f'assets/catalog-scenes/{flavor}.webp'})
  print(f'BUILT {flavor}: original packaging + {PALETTES[flavor][1]}',flush=True)
 (OUT/'sources.json').write_text(json.dumps(sources,ensure_ascii=False,indent=2)+'\n');patch_site(products)
 sheet=Image.new('RGB',(960,780),'#111617')
 for i,p in enumerate(p for p in products if not p.get('scene')):
  thumb=Image.open(OUT/f'{p["flavor"]}.webp');thumb.thumbnail((240,195));sheet.paste(thumb,((i%4)*240,(i//4)*195))
 (ROOT/'qa').mkdir(exist_ok=True);sheet.save(ROOT/'qa/flavor-scenes-review.jpg',quality=78)
 print('PASS built 13 scenes; retained the 3 original hero images and animation.',flush=True)
if __name__=='__main__': main()
