/**
 * Nanquim gerado -> traços vetoriais animáveis.
 *
 *   PNG do Higgsfield
 *     -> sharp: limiariza (o cinza do modelo vira tinta preta uniforme)
 *     -> potrace: vetoriza os contornos
 *     -> split: cada subcaminho vira um <path> próprio, para poder ser desenhado
 *     -> módulo .ts com { viewBox, paths }
 *
 * O passo do limiar é o que faz o desenho gerado casar com a mão do original:
 * sem ele o modelo entrega contorno preto com interior cinza, e é esse peso
 * duplo que denuncia que são duas mãos diferentes.
 *
 * Saída como módulo TypeScript, e não .svg, porque o componente precisa dos
 * caminhos como array para renderizar um <path> por traço — é isso que permite
 * ao GSAP desenhá-los um a um.
 *
 * ARMADILHA DOS BURACOS, verificada: o potrace emite UM <path> com
 * fill-rule="evenodd", e os buracos (o vão dentro das lentes dos óculos, por
 * exemplo) são subcaminhos desse mesmo path. Separá-los para preencher um a um
 * transformaria cada buraco numa mancha sólida.
 *
 * Por isso o consumidor renderiza DUAS camadas a partir do mesmo dado:
 *   - traço  → um <path> por item de `paths`, fill:none + stroke, para o GSAP animar;
 *   - tinta  → UM <path> só, com d = paths.join(" ") e fillRule="evenodd".
 * Como evenodd não depende de ordem nem de winding, ordenar os traços de cima
 * para baixo é seguro e o preenchimento continua correto. Custo de payload: zero,
 * porque a junção acontece em runtime.
 */
const fs = require("fs");
const path = require("path");
const zlib = require("zlib");
const sharp = require("sharp");
const potrace = require("potrace");

let lastThreshold = 0;
let lastCoverage = 0;
const TURD_SIZE = Number(process.env.TURD_SIZE || 8);

/**
 * Limiar ADAPTATIVO, e não fixo. Há dois modos de falha opostos:
 *
 *   - o modelo entrega LINHAS cinza (tranças do suéter) que precisam virar tinta
 *     → exige limiar alto;
 *   - o modelo entrega ÁREAS cinza (corpo preenchido) que precisam virar papel
 *     → exige limiar baixo, senão a figura vira uma mancha sólida.
 *
 * Um limiar fixo erra num dos dois. A regra que resolve os dois: escolher o MAIOR
 * limiar cuja cobertura de tinta ainda seja plausível para um desenho de linha.
 * Acima de ~20% de cobertura já não é traço, é preenchimento.
 */
const MAX_INK_COVERAGE = 0.2;
const CANDIDATE_THRESHOLDS = [235, 225, 200, 170, 140, 110, 90, 70];

function pickThreshold(data, channels, pixels) {
  let fallback = CANDIDATE_THRESHOLDS[CANDIDATE_THRESHOLDS.length - 1];
  for (const t of CANDIDATE_THRESHOLDS) {
    let ink = 0;
    for (let i = 0; i < pixels; i++) if (data[i * channels] < t) ink++;
    if (ink / pixels <= MAX_INK_COVERAGE) return t;
    fallback = t;
  }
  return fallback;
}

async function inkify(input) {
  const { data, info } = await sharp(input)
    .flatten({ background: "#ffffff" })
    .greyscale()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height } = info;
  const pixels = width * height;
  const threshold = pickThreshold(data, info.channels, pixels);

  const mono = Buffer.alloc(pixels);
  let ink = 0;
  for (let i = 0; i < pixels; i++) {
    const isInk = data[i * info.channels] < threshold;
    if (isInk) ink++;
    mono[i] = isInk ? 0 : 255;
  }
  lastThreshold = threshold;
  lastCoverage = ink / pixels;

  // PNG preto-e-branco puro, já aparado, para o potrace morder.
  return sharp(mono, { raw: { width, height, channels: 1 } })
    .png()
    .trim({ background: "#ffffff", threshold: 10 })
    .toBuffer();
}

function trace(buffer) {
  return new Promise((resolve, reject) => {
    potrace.trace(
      buffer,
      { threshold: 128, turdSize: TURD_SIZE, optCurve: true, optTolerance: 0.2 },
      (err, svg) => (err ? reject(err) : resolve(svg))
    );
  });
}

/** Ordena os traços de cima para baixo: a mão desenha o rosto antes do suéter. */
function firstY(d) {
  const m = /^M\s*([\d.-]+)[\s,]+([\d.-]+)/.exec(d.trim());
  return m ? parseFloat(m[2]) : 0;
}

async function build(input, outFile, exportName) {
  const svg = await trace(await inkify(input));

  const viewBox = (/viewBox="([^"]+)"/.exec(svg) || [])[1];
  const d = (/ d="([^"]+)"/.exec(svg) || [])[1] || "";
  if (!viewBox || !d) throw new Error("potrace não devolveu viewBox ou path");

  const paths = d
    .split(/(?=M)/)
    .map((s) => s.trim())
    .filter((s) => s.length > 8)
    // Arredondar a 1 casa decimal corta 20-30% do gzip sem diferença visível.
    .map((s) => s.replace(/\d+\.\d{2,}/g, (m) => (+m).toFixed(1)))
    .sort((a, b) => firstY(a) - firstY(b));

  const body =
    `// GERADO POR scripts/ink-pipeline — não editar à mão.\n` +
    `// Origem: ${path.basename(input)} · limiar ${lastThreshold} (auto, ` +
    `${(lastCoverage * 100).toFixed(1)}% de tinta) · ${paths.length} traços\n\n` +
    `export const ${exportName} = {\n` +
    `  viewBox: ${JSON.stringify(viewBox)},\n` +
    `  paths: [\n${paths.map((p) => `    ${JSON.stringify(p)},`).join("\n")}\n  ],\n` +
    `} as const;\n`;

  fs.writeFileSync(outFile, body, "utf8");

  /*
   * Também emite um .svg estático.
   *
   * Motivo medido: o Next serializa a saída de um Server Component DUAS vezes —
   * no markup e no payload RSC de hidratação. Com os três desenhos inline o HTML
   * de /sobre ia a 331KB. Só o primeiro fica inline; os outros dois são buscados
   * destes arquivos, que pagam o dado uma vez e ganham cache immutable.
   */
  const svgOut = outFile.replace(/^.*[\\/]/, "").replace(/^ink-(\d+)\.ts$/, "$1.svg");
  if (svgOut.endsWith(".svg")) {
    const staticSvg =
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}">` +
      `<path d="${paths.join(" ")}" fill-rule="evenodd"/>` +
      `</svg>`;
    fs.mkdirSync("public/ink", { recursive: true });
    fs.writeFileSync(path.join("public/ink", svgOut), staticSvg, "utf8");
  }

  const gz = zlib.gzipSync(Buffer.from(body)).length;
  console.log(
    `${path.basename(outFile).padEnd(26)} ${String(paths.length).padStart(4)} traços  ` +
      `${String(Math.round(body.length / 1024)).padStart(3)}KB bruto  ` +
      `${String(Math.round(gz / 1024)).padStart(3)}KB gzip  viewBox="${viewBox}"`
  );
  return { paths: paths.length, gz };
}

(async () => {
  const [input, outFile, exportName] = process.argv.slice(2);
  await build(input, outFile, exportName || "ink");
})();
