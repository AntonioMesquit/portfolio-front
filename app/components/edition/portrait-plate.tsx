import Image from "next/image";
import retrato from "@/public/iconAntonioHome.png";

/**
 * A foto de capa.
 *
 * O desenho já é um retrato de jornal — nanquim, sem meio-tom, sem fundo. Antes
 * ele flutuava ao lado de cards de gradiente pastel e perdia a comparação; aqui
 * está no meio a que pertence.
 *
 * A legenda NÃO é decorativa: ela declara de onde saiu a única cor da página, e
 * o leitor confere olhando. Por isso não leva aria-hidden — ao contrário do
 * cartucho da prancha, que é mobília.
 */
export function PortraitPlate() {
  return (
    <div className="ed-plate">
      <figure className="ed-plate__figure">
        <Image
          className="ed-plate__img"
          src={retrato}
          alt="Desenho a nanquim de Antonio Mesquita, de óculos e suéter de tranca, segurando uma caneca."
          priority
          sizes="(min-width: 1024px) 40vw, 100vw"
        />
        <figcaption className="ed-plate__caption">
          <strong>O autor</strong> — nanquim sobre papel, feito à mão. O
          verde-água do vapor é a única cor do desenho, e é a única cor desta
          página.
        </figcaption>
      </figure>
    </div>
  );
}
