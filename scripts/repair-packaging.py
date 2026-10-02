#!/usr/bin/env python3
"""Repair product cutouts using reviewed outer silhouettes, never color keying.
(Исправление упаковок: маски по внешнему контуру, а не удаление светлых цветов.)
"""
from __future__ import annotations
import hashlib
import importlib.util
import io
import json
from pathlib import Path
import re
import urllib.request

import cairosvg
from PIL import Image, ImageDraw, ImageFilter, ImageOps

ROOT = Path(__file__).resolve().parents[1]
MANIFEST = ROOT / 'assets/catalog-scenes/sources.json'

# Paths use the same 1000x1000 coordinate system as the reviewed source photos.
# White label bands, silver foil and transparent plastic remain fully opaque.
# (Контуры проверены по оригиналам. Внутри не удаляем этикетки, фольгу или блики.)
OUTLINES = {
    'whey': 'M305 176C306 138 688 138 688 176L688 224Q689 237 681 245L676 250Q673 255 676 260Q682 269 698 280Q716 296 726 320Q741 351 741.5 390L741.5 756C741.5 793 732 818 703 834C665 857 589 865 496 865C402 865 324 855 288 832C260 812 250 788 250 756L250 390Q250 351 264.5 320Q275 296 293.5 280Q309 267 314.5 260Q316 255 314 250L308 245Q305 239 305 222Z',
    'gummies': 'M345 116Q500 98 654 116L654 230L632 235L632 260C677 270 696 289 696 330L696 875Q696 911 501 915Q304 915 304 875L304 330Q303 280 370 260L370 235L345 230Z',
    'pouch': 'M232 57L752 57Q759 57 759 63L759 126L752 128L752 133L758 138L720 892Q719 902 704 903Q493 945 279 909Q267 907 266 896L226 141L234 136L234 131L225 128L226 64Q226 58 232 57Z',
    'electrolyte': 'M220 127C222 99 778 99 778 127L778 225Q775 230 761 232L761 242Q778 245 778 262L774 820Q774 882 500 887Q224 881 222 832L222 264Q221 248 239 244L239 232Q222 230 220 225Z',
    'preworkout': 'M258 103Q495 75 742 103L742 211L740 222L742 258L741 864Q741 900 502 903Q258 900 258 864L258 223L257 212Z',
}
TYPES = {
    'cookies':'whey', 'strawberry':'whey',
    'clear-peach':'pouch', 'clear-lemon':'pouch', 'creatine-pure':'pouch',
    'magnesium':'gummies', 'ashwagandha':'gummies', 'shilajit':'gummies', 'creatine-cherry':'gummies',
    'electro-strawberry':'electrolyte', 'electro-mango':'electrolyte',
    'pre-raspberry':'preworkout', 'pre-tutti':'preworkout',
}

def entry_for(data: bytes) -> dict:
    digest=hashlib.sha256(data).hexdigest()
    for entry in json.loads(MANIFEST.read_text()):
        if entry['sha256'] == digest:
            return entry
    raise ValueError('Unreviewed image: add a verified outline before processing this source')

def masked_source(data: bytes) -> Image.Image:
    entry=entry_for(data)
    image=Image.open(io.BytesIO(data)).convert('RGBA')
    if image.size != (1200,1200):
        raise ValueError('The reviewed package outline requires its original 1200x1200 photo')
    path=OUTLINES[TYPES[entry['flavor']]]
    svg=f'<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="1200" viewBox="0 0 1000 1000"><path d="{path}" fill="white"/></svg>'
    alpha=Image.open(io.BytesIO(cairosvg.svg2png(bytestring=svg.encode()))).getchannel('A')
    image.putalpha(alpha)  # Only alpha changes; never multiply, tint or recolor the RGB pixels.
    return image

def cutout(data: bytes) -> Image.Image:
    image=masked_source(data)
    box=image.getchannel('A').getbbox()
    if box is None:
        raise ValueError('Empty package mask')
    return image.crop(box)

def render_product(flavor: str, photo: bytes) -> Image.Image:
    # Keep the same decorative scene for an isolated packaging-integrity fix.
    # (Окружение пока прежнее: отдельно исправляем целостность упаковки.)
    spec=importlib.util.spec_from_file_location('scene_art',ROOT/'scripts/catalog-environment.py')
    scene_art=importlib.util.module_from_spec(spec);spec.loader.exec_module(scene_art)
    stage=Image.open(io.BytesIO(cairosvg.svg2png(bytestring=scene_art.scene_svg(flavor).encode()))).convert('RGBA')
    pack=ImageOps.contain(cutout(photo),(300,446),Image.Resampling.LANCZOS)
    x=(800-pack.width)//2; y=544-pack.height
    shadow=Image.new('RGBA',stage.size);mask=Image.new('L',stage.size)
    ImageDraw.Draw(mask).ellipse((x-11,532,x+pack.width+11,555),fill=160)
    shadow.putalpha(mask.filter(ImageFilter.GaussianBlur(10)))
    stage.alpha_composite(shadow);stage.alpha_composite(pack,(x,y))
    return stage.convert('RGB')

def original(entry: dict) -> bytes:
    cached=ROOT/'diagnostics/originals'/f"{entry['flavor']}.jpg"
    if cached.exists():
        data=cached.read_bytes()
    else:
        request=urllib.request.Request(entry['source'],headers={'User-Agent':'Mozilla/5.0 FormOne asset verification'})
        with urllib.request.urlopen(request,timeout=40) as response:
            data=response.read(12_000_001)
        if len(data)>12_000_000:
            raise ValueError('Source is unexpectedly large')
        cached.parent.mkdir(parents=True,exist_ok=True);cached.write_bytes(data)
    if hashlib.sha256(data).hexdigest()!=entry['sha256']:
        raise ValueError('Source changed; re-review required: '+entry['flavor'])
    return data

def main() -> None:
    entries=json.loads(MANIFEST.read_text())
    out=ROOT/'assets/catalog-scenes'; qa=ROOT/'qa';qa.mkdir(exist_ok=True)
    for entry in entries:
        photo=original(entry)
        image=render_product(entry['flavor'],photo)
        filename=f"{entry['flavor']}-packaging-v3.webp"
        image.save(out/filename,'WEBP',quality=95,method=6)
        entry['artwork']='assets/catalog-scenes/'+filename
        print('REPAIRED',entry['flavor'],flush=True)
    js_path=ROOT/'animation.js';js=js_path.read_text()
    for entry in entries:
        js=js.replace(f"assets/catalog-scenes/{entry['flavor']}.webp",entry['artwork'])
    js_path.write_text(js)
    html=ROOT/'index.html';html.write_text(html.read_text().replace('catalog-flavors-2','packaging-v3'))
    MANIFEST.write_text(json.dumps(entries,ensure_ascii=False,indent=2)+'\n')
    sheet=Image.new('RGB',(1200,4*280),'#111617');d=ImageDraw.Draw(sheet)
    for i,entry in enumerate(entries):
        image=Image.open(ROOT/entry['artwork']);image.thumbnail((300,244))
        sheet.paste(image,((i%4)*300,(i//4)*280));d.text(((i%4)*300+10,(i//4)*280+250),entry['flavor'],fill='#eee5d2')
    sheet.save(qa/'packaging-v3-review.jpg',quality=91)

if __name__=='__main__':
    main()
