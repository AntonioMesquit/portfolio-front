/**
 * A ORIGEM CANÔNICA.
 *
 * Um lugar só: `metadataBase`, `sitemap.xml` e `robots.txt` precisam concordar
 * sobre qual é o endereço do site. Canonical apontando para um host diferente
 * do que serviu a página é pior que canonical nenhum — o Google ignora a dica
 * e escolhe sozinho qual versão indexa, e a escolha costuma ser a URL feia do
 * deploy.
 *
 * Sem isto, `metadataBase` fica indefinido e o Next resolve as imagens de
 * Open Graph contra `http://localhost:3000`: o link compartilhado no WhatsApp
 * pede uma imagem que só existe na máquina de quem postou.
 */
const PRODUCTION = "https://antoniomesquiita.online";

/**
 * `NEXT_PUBLIC_SITE_URL` é o override explícito — troca de domínio não deveria
 * exigir deploy de código. Sem ele, produção assume o domínio próprio e o resto
 * (preview, dev) assume a URL efêmera do deploy, que é o que de fato serviu a
 * página.
 */
function resolveOrigin(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  if (process.env.VERCEL_ENV === "production") return PRODUCTION;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return PRODUCTION;
}

export const SITE_URL = new URL(resolveOrigin());

export const SITE_NAME = "Antonio Mesquita";

/**
 * Todo deploy de branch ganha uma URL pública própria. Indexada, ela vira
 * conteúdo duplicado competindo com o domínio real pelo mesmo texto — e é o
 * rascunho que costuma ganhar, porque é mais novo.
 */
export const IS_PREVIEW = process.env.VERCEL_ENV === "preview";

/** URL absoluta a partir de um caminho interno. */
export function absoluteUrl(path: string): string {
  return new URL(path, SITE_URL).toString();
}
