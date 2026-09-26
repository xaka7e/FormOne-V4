const { chromium } = require(process.env.PLAYWRIGHT_PATH || "playwright");
const assert = require("node:assert/strict");

const baseURL = process.argv[2] || "http://127.0.0.1:4173/";

async function main() {
  const browser = await chromium.launch({
    headless: true,
    ...(process.env.CHROME_PATH
      ? { executablePath: process.env.CHROME_PATH }
      : {}),
  });
  try {
    const page = await browser.newPage({
      viewport: { width: 390, height: 844 },
      isMobile: true,
      hasTouch: true,
    });
    await page.goto(baseURL, { waitUntil: "networkidle" });

    // Echte Scrollpositionen prüfen, auch beim Zurückscrollen. (Проверяем реальные позиции прокрутки, в том числе назад.)
    async function at(progress) {
      await page.evaluate((p) => {
        const distance =
          document.querySelector(".journey").offsetHeight -
          document.querySelector(".sticky").offsetHeight;
        scrollTo(0, p * distance);
      }, progress);
      await page.waitForFunction(
        (p) => Math.abs(Number(document.body.dataset.progress) - p) < 0.002,
        progress,
      );
      return page.evaluate(() => {
        const liquid = document.querySelector("#mobile-liquid");
        const color = getComputedStyle(document.querySelector("#m-liquid stop"))
          .stopColor.match(/[\d.]+/g)
          .map(Number);
        return {
          image: document
            .querySelector("#mobile-featured-image")
            .getAttribute("src"),
          title: document.querySelector(".mobile-product-copy h2").textContent,
          detail: document.querySelector(".mobile-product-copy p").textContent,
          mask: getComputedStyle(
            document.querySelector("#mobile-featured-image"),
          ).clipPath,
          height: Number(liquid.getAttribute("height")),
          brightness: color[0] * 0.2126 + color[1] * 0.7152 + color[2] * 0.0722,
          water: Number(
            getComputedStyle(document.querySelector("#mobile-water")).opacity,
          ),
          legs: [
            ...document.querySelectorAll(
              '#mobile-athlete path[stroke-width="13"]',
            ),
          ].map((leg) => leg.getAttribute("d")),
          athlete: document
            .querySelector("#mobile-athlete")
            .getAttribute("transform"),
        };
      });
    }

    const failures = [];
    async function check(name, run) {
      try {
        await run();
        console.log("PASS " + name);
      } catch (error) {
        failures.push(name + ": " + error.message);
        console.error("FAIL " + name + ": " + error.message);
      }
    }

    await check("Produktkarte folgt den vier Scrollabschnitten", async () => {
      for (const [p, image, title, detail] of [
        [
          0,
          "formone-whey-chocolate.jpg",
          "Protein · Schokolade",
          "Molkenprotein · 1.000 g",
        ],
        [
          0.3,
          "formone-creatine-gummies.jpg",
          "Kreatin-Gummis",
          "Zuckerfrei · 90 Stück",
        ],
        [
          0.53,
          "formone-whey-vanilla.jpg",
          "Protein · Vanille",
          "Molkenprotein · 1.000 g",
        ],
        [
          0.8,
          "formone-creatine-gummies.jpg",
          "Kreatin-Gummis",
          "Vegan · 90 Stück",
        ],
        [
          0,
          "formone-whey-chocolate.jpg",
          "Protein · Schokolade",
          "Molkenprotein · 1.000 g",
        ],
      ]) {
        const state = await at(p);
        assert(
          state.image.endsWith(image),
          `Falsches Produkt bei ${p}: ${state.image}`,
        );
        assert.equal(state.title, title);
        assert.equal(state.detail, detail);
        assert(
          state.mask.includes(
            image.includes("creatine")
              ? "creatine-silhouette"
              : "whey-silhouette",
          ),
        );
      }
    });

    await check(
      "Athlet bewegt die Beine und steht beim Eingießen still",
      async () => {
        const first = await at(0.055);
        const second = await at(0.105);
        assert.notDeepEqual(
          first.legs,
          second.legs,
          "Die Beine bleiben beim Gehen starr",
        );
        const pouring = await at(0.22);
        const mixing = await at(0.53);
        assert.equal(
          pouring.athlete,
          mixing.athlete,
          "Der Athlet rutscht nach dem Ankommen weiter",
        );
        assert.deepEqual(pouring.legs, mixing.legs);
      },
    );

    await check(
      "Dunkles Pulver sammelt sich vor dem Wasser und wird beim Mischen heller",
      async () => {
        const empty = await at(0);
        const dry = await at(0.25);
        assert(
          dry.height > empty.height + 30,
          "Vor dem Wasser fehlt die Pulverschicht",
        );
        assert.equal(dry.water, 0);
        assert(dry.brightness < 110, "Das trockene Pulver ist zu hell");
        const wet = await at(0.46);
        const ready = await at(0.8);
        assert(wet.height > dry.height && ready.height > wet.height);
        assert(wet.brightness > dry.brightness + 10);
        assert(ready.brightness > wet.brightness + 10);
        assert.equal(
          (await at(0.86)).brightness,
          ready.brightness,
          "Der fertige Shake wird wieder dunkler",
        );
        const reverse = await at(0.25);
        assert.equal(reverse.height, dry.height);
        assert.equal(reverse.brightness, dry.brightness);
      },
    );
    assert.deepEqual(failures, []);
  } finally {
    await browser.close();
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
