#!/usr/bin/env python3
"""Regression for warm studio backgrounds. (Регрессия: тёплый бежевый фон.)"""
import io
from pathlib import Path
from PIL import Image, ImageDraw
ROOT=Path(__file__).resolve().parents[1]
source=ROOT/'scripts/build-flavor-scenes.py'

def check_cutout(text):
 scope={'__file__':str(source),'__name__':'cutout_test'};exec(compile(text,str(source),'exec'),scope)
 photo=Image.new('RGB',(300,300),'white');d=ImageDraw.Draw(photo)
 d.rectangle((60,20,240,280),fill=(239,218,190));d.rectangle((105,40,195,270),fill='#151515');d.rectangle((120,115,180,170),fill='white')
 b=io.BytesIO();photo.save(b,format='PNG');pack=scope['cutout'](b.getvalue())
 assert pack.width<100,f'Warm backdrop incorrectly retained: {pack.width}px wide'
 assert pack.getpixel((pack.width//2,pack.height//2))==(255,255,255,255),'Enclosed white label was changed'

text=source.read_text()
old='if min(c)>=178 and max(c)-min(c)<=24:'
new='if min(c)>=120 and sum(c)/3>=155 and max(c)-min(c)<=105:'
if old in text:
 try: check_cutout(text)
 except AssertionError as e: print('EXPECTED RED:',e)
 else: raise AssertionError('Regression must reproduce before the fix')
 text=text.replace(old,new,1);source.write_text(text)
else: assert new in text,'Unexpected cutout implementation'
check_cutout(text)
print('PASS: warm studio backdrop removed; white label is unchanged')
