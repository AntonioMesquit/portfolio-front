/**
 * Taxonomia de papéis da prancha de arquitetura.
 *
 * O `NodeRole` é a peça central do redesign: ele é estável entre projetos e vira
 * o `data-flip-id` lido pelo GSAP Flip. Dois projetos que declaram o papel `api`
 * compartilham o MESMO nó na tela — ele viaja de uma posição para a outra em vez
 * de sumir e reaparecer, trocando apenas o rótulo (NestJS → Express → FastAPI).
 *
 * `client`, `api` e `db` existem nos quatro projetos. Os demais são satélites:
 * nascem a partir do nó `api` e colapsam de volta nele quando o projeto muda.
 */
export const NODE_ROLES = [
  "client",
  "mobile",
  "api",
  "db",
  "cache",
  "ai",
  "chatbot",
  "payment",
  "realtime",
  "cms",
  "storage",
  "video",
  "auth",
  "maps",
] as const;

export type NodeRole = (typeof NODE_ROLES)[number];

export interface BlueprintNode {
  /** Estável entre projetos. Vira o data-flip-id. */
  role: NodeRole;
  /** Rótulo exibido neste projeto. */
  label: string;
  /** Stack exibida neste projeto. */
  tech: string;
  /** Centro horizontal do nó, 0-100, relativo à área de desenho. */
  x: number;
  /** Centro vertical do nó, 0-100, relativo à área de desenho. */
  y: number;
}

export interface BlueprintEdge {
  from: NodeRole;
  to: NodeRole;
}

export interface Blueprint {
  nodes: BlueprintNode[];
  edges: BlueprintEdge[];
}

export interface Project {
  id: string;
  name: string;
  /** Uma linha. Aparece sob o nome, em destaque. */
  tagline: string;
  /** Um parágrafo. O único texto corrido da página. */
  description: string;
  year: string;
  technologies: string[];
  /** Cor de acento. Só em traço, borda, anel de foco e sombra — nunca em texto. */
  color: string;
  /**
   * Variante escura da mesma cor, para texto. `color` reprova o contraste AA nos
   * tamanhos usados aqui (0,54 a 0,76rem): rosa 4,36:1, verde 3,58:1, âmbar 3,02:1.
   */
  colorText: string;
  blueprint: Blueprint;
}

/** Chave estável de uma aresta, para casar arestas entre projetos. */
export function edgeKey(edge: BlueprintEdge): string {
  return `${edge.from}->${edge.to}`;
}
