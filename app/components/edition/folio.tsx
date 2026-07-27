import { CONTACT } from "./edition-data";

export interface FolioProps {
  /** Data já formatada no servidor, no fuso do Ceará. */
  printedOn: string;
}

/**
 * A tira de identificação, sangrando de borda a borda.
 *
 * O nome vive aqui, pequeno — não existe cabeçalho com o nome em corpo gigante.
 * Numa página em que o editor e o assunto são a mesma pessoa, ampliar o próprio
 * nome é o pedaço de tinta mais genérico que a página poderia gastar. A maior
 * coisa impressa passa a ser a manchete, que é o que se lê em cinco segundos.
 *
 * A última célula é o e-mail, link de verdade, na primeira tela: jornal imprime
 * o endereço da redação no folio, e isso resolve na linha 1 a lacuna de contato
 * que o site inteiro tem no desktop.
 */
export function Folio({ printedOn }: FolioProps) {
  return (
    <div className="ed-folio ed-bleed">
      <div className="ed-folio__rule" data-rule />
      <div className="ed-folio__row">
        {/*
          A primeira célula declara O QUE É o artefato, não quem assina — o
          header já imprime "Antonio Mesquita" em toda rota, e repetir o nome
          quatro centímetros abaixo era a única duplicação da página.
          Rima com o "Carta" que abre /sobre.
        */}
        <span className="ed-folio__cell ed-folio__name">Jornal</span>
        <span className="ed-folio__cell">{CONTACT.place}</span>
        <span className="ed-folio__cell">{printedOn}</span>
        <span className="ed-folio__cell">
          Impressa às{" "}
          {/*
            Renderiza um marcador no HTML e é carimbada uma vez depois do mount.
            Relógio que anda é widget; o que a página afirma é "esta cópia foi
            impressa neste instante", não "agora são".
          */}
          <time data-print-time>--:--:--</time>
        </span>
        <span className="ed-folio__cell ed-folio__cell--mail">
          <a className="ed-link" href={`mailto:${CONTACT.email}`}>
            {CONTACT.email}
          </a>
        </span>
      </div>
      <div className="ed-folio__rule" data-rule />
    </div>
  );
}
