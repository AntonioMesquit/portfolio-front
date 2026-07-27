import Link from "next/link";
import { CONTACT } from "./edition-data";

export interface ColophonProps {
  printedOn: string;
}

/**
 * O rodapé que o site nunca teve.
 *
 * Recebe uma prop e nada mais, de propósito: quando /sobre e /blog receberem o
 * mesmo tratamento de papel, este componente sobe para `app/layout.tsx` e passa
 * a servir o site inteiro de uma vez. Içar antes disso poria um expediente de
 * jornal embaixo de páginas que ainda não são jornal.
 *
 * Sem lista de stack e sem lista de fontes: é a linha mais previsível que um
 * rodapé desses pode ter, e /sobre-o-site já existe inteirinha para isso.
 *
 * A tira de links omite /contato, /resumo, /tonio e /sobre-o-site: os dois
 * primeiros são stubs de texto branco sobre fundo branco, o terceiro é admin, e
 * o quarto descreve no próprio corpo a home que este componente substitui.
 */
export function Colophon({ printedOn }: ColophonProps) {
  return (
    <footer data-tx className="ed-colophon ed-inner" data-print>
      <p className="ed-colophon__body">
        <strong>Expediente</strong> — Escrito, desenhado e programado por Antonio
        Mesquita, no Ceará. O desenho é nanquim sobre papel, feito à mão. Os
        textos do blog vêm de uma API que eu também mantenho.
      </p>
      <p className="ed-colophon__body">
        Esta edição foi composta às <time data-print-time>--:--:--</time> de{" "}
        {printedOn}, no seu navegador. Tiragem: 1 exemplar. Recarregue para uma
        nova.
      </p>

      <nav className="ed-colophon__links" aria-label="Links do rodapé">
        <Link className="ed-link" href="/sobre">
          Sobre
        </Link>
        <Link className="ed-link" href="/projetos">
          Projetos
        </Link>
        <Link className="ed-link" href="/blog">
          Blog
        </Link>
        <a className="ed-link" href={`mailto:${CONTACT.email}`}>
          E-mail
        </a>
        <a
          className="ed-link"
          href={CONTACT.linkedinUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          LinkedIn
        </a>
      </nav>
    </footer>
  );
}
