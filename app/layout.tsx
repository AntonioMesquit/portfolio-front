import type { Metadata } from "next";
import { Geist_Mono, Poppins } from "next/font/google";
import "./globals.css";
import Navbar from "./components/navbar/components/navbar";
import { Providers } from "./providers";
import { AppLoader } from "./components/app-loader";
import { RegisterTransition } from "./components/navbar/components/register-transition";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Antonio Mesquita",
  description: "Portfolio de Antonio Mesquita - Desenvolvedor Full Stack",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  /*
    Sem <head> manual: havia ali uma folha do Google Fonts pedindo "Asset" e
    "Cherry Bomb One". "Asset" não era usada em lugar nenhum, e "Cherry Bomb
    One" só aparecia em dois títulos de páginas ainda não redesenhadas. A folha
    era bloqueante em TODAS as rotas para servir dois <h1>. As duas famílias do
    sistema (Poppins e Geist Mono) vêm por next/font, que auto-hospeda e não
    bloqueia.
  */
  return (
    <html lang="pt-br" className="overflow-x-hidden">
      {/*
        Sem `overflow-x-hidden` no body: ele torna o body um contêiner de
        rolagem e quebra `position: sticky` em todo descendente — era por isso
        que o sumário do artigo rolava para fora da tela. O corte horizontal
        continua no <html>, onde não tem esse efeito colateral.
      */}
      <body className={`${poppins.variable} ${geistMono.variable} antialiased`}>
        <Providers>
          <AppLoader>
            <Navbar />
            <RegisterTransition />
            {/* Alvo estável da transição: existe em toda rota, inclusive nas
                que ainda não foram redesenhadas. */}
            <div id="page-root">{children}</div>
          </AppLoader>
        </Providers>
      </body>
    </html>
  );
}
