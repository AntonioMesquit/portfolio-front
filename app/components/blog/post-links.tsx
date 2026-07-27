"use client";

interface PostLink {
  label: string;
  url: string;
}

interface PostLinksProps {
  links: PostLink[];
}

/** Só http, https e mailto. O campo vem de conteúdo, e `javascript:` num href
 *  renderizado sem checagem é um vetor barato de fechar. */
function safe(url: string): boolean {
  try {
    return ["http:", "https:", "mailto:"].includes(new URL(url).protocol);
  } catch {
    return false;
  }
}

export function PostLinks({ links }: PostLinksProps) {
  const usable = links.filter((link) => safe(link.url));
  if (!usable.length) return null;

  return (
    <div className="cd-foot">
      <p className="cd-foot__label">Links relacionados</p>
      <ul className="cd-links">
        {usable.map((link) => (
          <li key={link.url}>
            <a
              className="ed-link"
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              {link.label}
            </a>{" "}
            <span style={{ color: "var(--ink-mute)" }}>{link.url}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
