import Link from "next/link";
import { Mark } from "./mark";
import { NavTabs } from "./nav-tabs";

/**
 * A BARRA DE REGISTRO.
 *
 * Em gráfica, "casar o registro" é acertar o alinhamento entre chapas. O header
 * é a chapa que nunca sai: ele carrega, permanentemente, duas marcas de corte —
 * a mesma geometria de `.bp-mark`, que a prancha usa nos cantos da folha.
 *
 * O fio de baixo é um ELEMENTO, não um `border-b`. Não é preciosismo: borda não
 * pode ser transladada sozinha, elemento pode — e é ele que entra fora de
 * registro junto com a página, como a terceira chapa.
 *
 * Server component. Só a faixa de abas precisa de cliente.
 */
export default function Navbar() {
  return (
    <header className="rg-bar">
      <span className="rg-crop rg-crop--l" aria-hidden="true" />
      <span className="rg-crop rg-crop--r" aria-hidden="true" />

      <div className="rg-bar__inner">
        <Link
          className="rg-lockup"
          href="/"
          aria-label="Antonio Mesquita — ir para a página inicial"
        >
          <Mark />
          <span>Antonio Mesquita</span>
        </Link>

        <NavTabs />
      </div>

      <div className="rg-bar__rule" data-plate="fio" aria-hidden="true" />
    </header>
  );
}
