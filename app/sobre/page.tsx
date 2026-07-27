import type { Metadata } from "next";
import Link from "next/link";
import { generatePageMetadata } from "../lib/metadata";
import { Movement } from "../components/letter/movement";
import { LetterInk } from "../components/letter/letter-ink";
import { TOTAL_CONTOURS } from "../components/letter/ink-figure";
import {
  CLOSING,
  MOVEMENTS,
  OPENING,
  WRITTEN_ON,
} from "../components/letter/letter-data";
import { CONTACT } from "../components/edition/edition-data";

export const metadata: Metadata = generatePageMetadata("/sobre");

/**
 * /sobre — A CARTA.
 *
 * Server component de ponta a ponta: os 308 contornos dos três desenhos são
 * renderizados aqui e nunca cruzam a fronteira do cliente. O comportamento
 * entra por <LetterInk />, que renderiza null e opera por seletor.
 */
export default function Sobre() {
  return (
    <div className="ct-page" id="ct-page">
      {/*
        Sem JS o estado armado deixaria os traços invisíveis, porque cada path
        nasce com stroke-dashoffset: 1. Isto desarma.
      */}
      <noscript>
        <style>{`.ct-page [data-ink]>path{stroke-dashoffset:0}.ct-page .ct-fig__flood{fill-opacity:1}`}</style>
      </noscript>

      <LetterInk />

      <div className="ct-inner">
        <header data-tx className="ct-head">
          <p className="ct-head__kind">Carta</p>
          <div className="ct-head__meta">
            <span>Antonio Mesquita</span>
            <span>Ceará · escrita em {WRITTEN_ON}</span>
          </div>
          <div className="ct-head__rule" data-letter-rule />
          <h1 className="ct-head__subject">Assunto: o que não coube na tabela.</h1>
        </header>

        <section data-tx className="ct-mov ct-mov--open">
          <div className="ct-stub" aria-hidden="true" />
          <div className="ct-body">
            <p className="ct-vocative">{OPENING.vocative}</p>
            <p>{OPENING.paragraph}</p>
          </div>
        </section>

        {MOVEMENTS.map((movement) => (
          <Movement key={movement.id} movement={movement} />
        ))}

        <section data-tx className="ct-mov ct-mov--close">
          <div className="ct-stub" aria-hidden="true" />
          <div className="ct-body">
            <p>{CLOSING.paragraph}</p>
            <p className="ct-farewell">{CLOSING.farewell}</p>
            <p className="ct-sign">{CLOSING.signature}</p>
          </div>
        </section>

        <section data-tx className="ct-ps" aria-label="Post scriptum">
          <div className="ct-ps__row">
            <span className="ct-ps__label">P.S.</span>
            <p>
              Se você tem um problema e ainda não sabe se ele é técnico, é
              exatamente o tipo de conversa de que eu mais gosto.{" "}
              <a className="ed-link" href={`mailto:${CONTACT.email}`}>
                Me escreve
              </a>
              .
            </p>
          </div>
          <div className="ct-ps__row">
            <span className="ct-ps__label">P.S. 2</span>
            <p>
              O lado de engenharia disto, produto por produto, está em{" "}
              <Link className="ed-link" href="/projetos">
                /projetos
              </Link>
              , em prancha técnica.
            </p>
          </div>
          <div className="ct-ps__row">
            <span className="ct-ps__label">P.S. 3</span>
            <p>
              Se você caiu aqui direto e quer o registro seco — quando, onde,
              cargo, o que eu fiz —, ele está na{" "}
              <Link className="ed-link" href="/">
                tabela da home
              </Link>
              . Esta página é a outra metade, de propósito.
            </p>
          </div>
        </section>

        <p data-tx className="ct-note">
          <strong>Sobre os desenhos</strong> — Os três saíram do mesmo traço do
          retrato que abre a home, e não são imagem: são caminho. O retrato é
          nanquim sobre papel, feito à mão; estes três foram gerados a partir
          dele e vetorizados — o traço é o mesmo, a mão não. Somam{" "}
          {TOTAL_CONTOURS} contornos. A tinta entra na velocidade em que você
          rola: se você passa rápido, o contorno chega e a tinta não; se você
          para, ela alcança. Voltar drena a tinta e deixa o risco no papel. Esta
          página é de uma tinta só.
        </p>
      </div>
    </div>
  );
}
