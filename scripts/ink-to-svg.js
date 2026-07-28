/**
 * Módulo .ts de tinta -> SVG estático em public/ink.
 *
 * Por que existe: a capa do artigo é grande (centenas de contornos). Inline num
 * Server Component ela é serializada DUAS vezes pelo Next — no markup e no
 * payload RSC — e o custo entra no HTML de toda visita. Como capa de artigo não
 * se anima, ela não precisa dos caminhos separados em runtime: pode ser um
 * arquivo, servido uma vez e cacheado.
 *
 *   node scripts/ink-to-svg.js app/.../cover-autos.ts public/ink/autos.svg
 */
const fs = require("fs");
const path = require("path");
const zlib = require("zlib");

const [input, output] = process.argv.slice(2);
if (!input || !output) {
  console.error("uso: node scripts/ink-to-svg.js <modulo.ts> <saida.svg>");
  process.exit(1);
}

const src = fs.readFileSync(input, "utf8");

const viewBoxMatch = /viewBox:\s*"([^"]+)"/.exec(src);
if (!viewBoxMatch) throw new Error(`sem viewBox em ${input}`);

// Cada traço é uma linha `    "M...",` no array. JSON.parse devolve o valor já
// desescapado, sem eu ter que reimplementar escape de string.
const paths = src
  .split("\n")
  .map((line) => line.trim())
  .filter((line) => line.startsWith('"') && line.endsWith('",'))
  .map((line) => JSON.parse(line.slice(0, -1)));

if (paths.length === 0) throw new Error(`nenhum traço em ${input}`);

const svg =
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBoxMatch[1]}">` +
  `<path d="${paths.join(" ")}" fill-rule="evenodd" fill="#17170f"/>` +
  `</svg>`;

fs.mkdirSync(path.dirname(output), { recursive: true });
fs.writeFileSync(output, svg, "utf8");

console.log(
  `${output}  ${paths.length} traços  ` +
    `${Math.round(svg.length / 1024)}KB bruto  ` +
    `${Math.round(zlib.gzipSync(svg).length / 1024)}KB gzip  ` +
    `viewBox="${viewBoxMatch[1]}"`
);
