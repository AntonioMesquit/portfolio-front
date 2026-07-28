/**
 * Tira print de todas as rotas e captura erro de console.
 *
 * Existe porque as três páginas novas foram entregues sem nunca terem sido
 * vistas: typecheck, lint e build não pegam erro de runtime nem layout quebrado.
 */
const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");

const BASE = process.env.BASE || "http://localhost:3939";
const OUT = process.env.OUT || "shots";

const ROUTES = ["/", "/sobre", "/projetos", "/blog", "/sobre-o-site"];
const VIEWPORTS = [
  { name: "desktop", width: 1440, height: 900 },
  { name: "mobile", width: 390, height: 844 },
];

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch();
  const problems = [];

  for (const vp of VIEWPORTS) {
    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      deviceScaleFactor: 1,
    });

    for (const route of ROUTES) {
      const page = await context.newPage();
      const logs = [];
      page.on("console", (m) => {
        if (m.type() === "error" || m.type() === "warning") logs.push(`${m.type()}: ${m.text()}`);
      });
      page.on("pageerror", (e) => logs.push(`pageerror: ${e.message}`));
      page.on("requestfailed", (r) =>
        logs.push(`requestfailed: ${r.url().replace(BASE, "")} — ${r.failure()?.errorText}`)
      );

      try {
        await page.goto(BASE + route, { waitUntil: "networkidle", timeout: 30000 });
      } catch (e) {
        logs.push(`goto: ${e.message.split("\n")[0]}`);
      }
      // Deixa as animações de entrada terminarem antes do print.
      await page.waitForTimeout(2600);

      const slug = route === "/" ? "home" : route.replace(/\//g, "-").slice(1);
      const file = path.join(OUT, `${vp.name}-${slug}.png`);
      await page.screenshot({ path: file, fullPage: false });

      // Métricas que denunciam layout quebrado sem eu precisar olhar.
      const metrics = await page.evaluate(() => {
        const de = document.documentElement;
        return {
          scrollW: de.scrollWidth,
          clientW: de.clientWidth,
          scrollH: de.scrollHeight,
          bodyText: document.body.innerText.trim().length,
        };
      });
      const overflow = metrics.scrollW - metrics.clientW;

      console.log(
        `${vp.name.padEnd(8)} ${route.padEnd(15)} ` +
          `alt=${String(metrics.scrollH).padStart(5)} ` +
          `texto=${String(metrics.bodyText).padStart(5)} ` +
          `overflowX=${overflow > 1 ? "SIM +" + overflow : "nao"}` +
          (logs.length ? `  [${logs.length} log]` : "")
      );
      if (overflow > 1) problems.push(`${vp.name} ${route}: overflow horizontal de ${overflow}px`);
      if (metrics.bodyText < 200) problems.push(`${vp.name} ${route}: só ${metrics.bodyText} chars de texto`);
      for (const l of logs.slice(0, 6)) problems.push(`${vp.name} ${route}: ${l.slice(0, 180)}`);

      await page.close();
    }
    await context.close();
  }

  await browser.close();

  if (problems.length) {
    console.log("\n=== PROBLEMAS ===");
    for (const p of problems) console.log("  " + p);
  } else {
    console.log("\nnenhum problema automatico detectado");
  }
})();
