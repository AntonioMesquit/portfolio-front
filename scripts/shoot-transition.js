/**
 * Captura a transição entre rotas MID-FLIGHT, em instantes precisos.
 *
 * Um print depois que tudo assentou não prova nada sobre uma animação — foi
 * assim que uma "transição" que nem chegava a rodar passou despercebida.
 */
const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");

const BASE = process.env.BASE || "http://localhost:3970";
const OUT = "shots-transition";
const MARKS = [70, 140, 220, 300, 420, 560, 750, 1000];

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));

  await page.goto(BASE + "/", { waitUntil: "networkidle" });
  await page.waitForTimeout(2500);

  const t0 = Date.now();
  await page.click('a[href="/projetos"]', { noWaitAfter: true });

  for (const mark of MARKS) {
    const wait = mark - (Date.now() - t0);
    if (wait > 0) await page.waitForTimeout(wait);
    const at = Date.now() - t0;
    const shot = path.join(OUT, `t-${String(mark).padStart(3, "0")}.png`);
    await page.screenshot({ path: shot });

    const s = await page.evaluate(() => {
      const bl = Array.from(document.querySelectorAll("[data-tx]"));
      const escalas = bl.map((b) => {
        const m = new DOMMatrixReadOnly(getComputedStyle(b).transform);
        return m.d.toFixed(2);
      });
      return { blocos: bl.length, escalaY: escalas.join(" "), rota: location.pathname };
    });
    console.log(
      `t=${String(at).padStart(4)}ms  blocos=${s.blocos}  scaleY=[${s.escalaY}]  rota=${s.rota}`
    );
  }

  console.log(errors.length ? `ERROS: ${errors.join(" | ")}` : "sem erro de runtime");
  await browser.close();
})();
