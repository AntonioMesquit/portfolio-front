import { CONTACT } from "./edition-data";

/**
 * Duas células, não três.
 *
 * A célula "procura-se" saiu: era a única promessa da página sem lastro nenhum
 * no material, e existia porque três colunas ficam mais bonitas que duas.
 *
 * O handle do LinkedIn é impresso inteiro. Numa página que se vende como
 * documento conferível, abreviar um endereço que não resolve seria o pior lugar
 * possível para arredondar.
 */
export function Classifieds() {
  return (
    <section data-tx className="ed-section ed-inner" aria-labelledby="ed-ads-head">
      <div className="ed-head" data-print>
        <h2 id="ed-ads-head" className="ed-label">
          Classificados
        </h2>
        <span className="ed-label">O único anunciante sou eu</span>
      </div>

      <div className="ed-ads" data-print>
        <div className="ed-ad">
          <h3 className="ed-label">Oferece-se</h3>
          <p className="ed-ad__body">
            Desenvolvedor full stack, web e mobile — do banco ao layout. Aberto a
            freela e parceria. Me manda um e-mail que eu respondo.
          </p>
          <a className="ed-link ed-ad__cta" href={`mailto:${CONTACT.email}`}>
            Escrever um e-mail →
          </a>
        </div>

        <div className="ed-ad">
          <h3 className="ed-label">Correspondência</h3>
          <ul className="ed-ad__list">
            <li>
              <a className="ed-link" href={`mailto:${CONTACT.email}`}>
                {CONTACT.email}
              </a>
            </li>
            <li>
              <a
                className="ed-link"
                href={CONTACT.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                {CONTACT.linkedinHandle}
              </a>
            </li>
            <li>{CONTACT.place}</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
