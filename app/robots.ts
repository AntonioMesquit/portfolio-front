import type { MetadataRoute } from "next";
import { IS_PREVIEW, absoluteUrl } from "./lib/site";

/**
 * `Disallow` NÃO é sinônimo de "não indexe".
 *
 * Disallow proíbe a BUSCA da página — e uma página nunca buscada nunca entrega
 * a própria tag `noindex`. O resultado é o pior dos dois mundos: o Google
 * continua listando a URL (descoberta por link), só que sem título nem
 * descrição, e sem nunca poder ler a instrução que mandava tirá-la dali.
 *
 * Por isso aqui não há Disallow para `/tonio`, `/contato` e `/resumo`: quem as
 * mantém fora do índice é o `robots: { index: false }` em
 * `app/lib/metadata.ts`, que só funciona se o crawler puder ler a página.
 */
export default function robots(): MetadataRoute.Robots {
  /*
    Cada branch deployada ganha URL pública. Indexada, vira conteúdo duplicado
    disputando com o domínio real o mesmo texto — e o rascunho tende a ganhar,
    por ser mais recente.
  */
  if (IS_PREVIEW) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }

  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
