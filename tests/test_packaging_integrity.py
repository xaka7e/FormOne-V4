"""Real-photo regression: removal must not punch holes in labels or silver foil."""
import importlib.util
import io
import os
from pathlib import Path
import unittest
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
impl = ROOT / os.environ.get('PACKAGING_BUILDER', 'scripts/repair-packaging.py')
spec = importlib.util.spec_from_file_location('packaging_builder', impl)
builder = importlib.util.module_from_spec(spec)
spec.loader.exec_module(builder)

class PackagingIntegrity(unittest.TestCase):
    def test_all_real_product_interiors_remain_opaque(self):
        photos = sorted((ROOT / 'diagnostics/originals').glob('*.jpg'))
        self.assertEqual(len(photos), 13, 'All 13 original photos must be tested')
        for path in photos:
            with self.subTest(product=path.stem):
                product = builder.cutout(path.read_bytes())
                w, h = product.size
                core = product.getchannel('A').crop((int(w*.22), int(h*.26), int(w*.78), int(h*.88)))
                self.assertEqual(core.getextrema(), (255, 255),
                    f'{path.stem}: the label or package body has transparent holes')

    def test_source_rgb_is_not_recolored(self):
        for path in sorted((ROOT / 'diagnostics/originals').glob('*.jpg')):
            with self.subTest(product=path.stem):
                source = Image.open(path).convert('RGB')
                masked = builder.masked_source(path.read_bytes())
                self.assertEqual(masked.size, source.size)
                self.assertEqual(masked.convert('RGB').tobytes(), source.tobytes(),
                    'Only the outer alpha mask may change; source RGB must be identical')
                self.assertEqual(masked.getchannel('A').getpixel((600,600)),255)
                self.assertEqual(masked.getchannel('A').getpixel((0,0)),0)

    def test_a_new_unreviewed_photo_is_not_processed_silently(self):
        # A light label touches both package edges, reproducing the actual defect.
        from PIL import ImageDraw
        image=Image.new('RGB',(300,300),(239,218,190));d=ImageDraw.Draw(image)
        d.rounded_rectangle((65,30,235,275),radius=30,fill='#171a1b')
        d.rectangle((65,115,235,215),fill='white')
        raw=io.BytesIO();image.save(raw,format='PNG')
        try:
            product=builder.cutout(raw.getvalue())
        except ValueError:
            return  # Unknown source requires a reviewed outline, never a color guess.
        w,h=product.size
        self.assertEqual(product.getchannel('A').crop((w//3,h//2,2*w//3,2*h//3)).getextrema(),(255,255),
            'A white label touching the backdrop was erased')

if __name__ == '__main__':
    unittest.main()
