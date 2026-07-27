"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FolderOpen,
  FileText,
  Plus,
  Loader2,
  Check,
  X,
  ChevronRight,
  LayoutDashboard,
  Link2,
  Trash2,
} from "lucide-react";
import { slugify } from "../lib/slugify";
import MarkdownEditor from "../components/editor/markdown-editor";
import {
  usePosts,
  useCategories,
  useCreatePost,
  useCreateCategory,
} from "../hooks";

type Tab = "categorias" | "posts";

export default function AdminTonioPage() {
  const [tab, setTab] = useState<Tab>("categorias");

  const { data: categories = [], isLoading: categoriesLoading } = useCategories();
  const { data: posts = [], isLoading: postsLoading } = usePosts({ limit: 50 });

  const createCategoryMutation = useCreateCategory();
  const createPostMutation = useCreatePost();

  const loading = categoriesLoading || postsLoading;

  const [catName, setCatName] = useState("");
  const [catSlug, setCatSlug] = useState("");

  const [postTitle, setPostTitle] = useState("");
  const [postSlug, setPostSlug] = useState("");
  const [postContent, setPostContent] = useState("");
  const [postSnippet, setPostSnippet] = useState("");
  const [postReadTime, setPostReadTime] = useState(5);
  const [postFeatured, setPostFeatured] = useState(false);
  const [postCategoryIds, setPostCategoryIds] = useState<string[]>([]);
  const [postPublished, setPostPublished] = useState(false);
  const [postLinks, setPostLinks] = useState<{ label: string; url: string }[]>([]);
  const [newLinkLabel, setNewLinkLabel] = useState("");
  const [newLinkUrl, setNewLinkUrl] = useState("");
  const [editorKey, setEditorKey] = useState(0);
  const [validationError, setValidationError] = useState<string | null>(null);

  useEffect(() => {
    setCatSlug(slugify(catName));
  }, [catName]);

  useEffect(() => {
    setPostSlug(slugify(postTitle));
  }, [postTitle]);

  const saving = createCategoryMutation.isPending || createPostMutation.isPending;

  const error =
    validationError ||
    createCategoryMutation.error?.message ||
    createPostMutation.error?.message;
  const success =
    (createCategoryMutation.isSuccess && "Categoria criada!") ||
    (createPostMutation.isSuccess && "Post criado!");

  const clearMessages = () => {
    setValidationError(null);
    createCategoryMutation.reset();
    createPostMutation.reset();
  };

  const handleCreateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    createCategoryMutation.mutate(
      { name: catName, slug: catSlug },
      {
        onSuccess: () => {
          setCatName("");
          setCatSlug("");
        },
      }
    );
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);
    if (!postContent.trim()) {
      setValidationError("O conteúdo do artigo é obrigatório.");
      return;
    }
    createPostMutation.mutate(
      {
        title: postTitle,
        slug: postSlug,
        content: postContent,
        snippet: postSnippet || undefined,
        read_time_minutes: postReadTime,
        featured: postFeatured,
        published_at: postPublished ? new Date().toISOString() : undefined,
        category_ids: postCategoryIds.length ? postCategoryIds : undefined,
        links: postLinks.length ? postLinks : undefined,
      },
      {
        onSuccess: () => {
          setPostTitle("");
          setPostSlug("");
          setPostContent("");
          setPostSnippet("");
          setPostReadTime(5);
          setPostFeatured(false);
          setPostCategoryIds([]);
          setPostPublished(false);
          setPostLinks([]);
          setEditorKey((k) => k + 1);
        },
      }
    );
  };

  const togglePostCategory = (id: string) => {
    setPostCategoryIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  return (
    <div className="min-h-screen w-full pt-24 pb-16 bg-[var(--paper)]">
      <div className="w-full max-w-6xl mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-neutral-900 flex items-center justify-center">
              <LayoutDashboard className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-neutral-900">
              Painel Admin
            </h1>
          </div>
          <p className="text-neutral-600">
            Crie categorias e posts para o fórum/blog
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="flex gap-2 mb-8"
        >
          <button
            onClick={() => {
              setTab("categorias");
              clearMessages();
            }}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all ${
              tab === "categorias"
                ? "bg-neutral-900 text-white"
                : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
            }`}
          >
            <FolderOpen className="w-4 h-4" />
            Categorias ({categories.length})
          </button>
          <button
            onClick={() => {
              setTab("posts");
              clearMessages();
            }}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all ${
              tab === "posts"
                ? "bg-neutral-900 text-white"
                : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
            }`}
          >
            <FileText className="w-4 h-4" />
            Posts ({posts.length})
          </button>
        </motion.div>

        {(error || success) && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mb-6 flex items-center gap-2 px-4 py-3 rounded-xl ${
              error ? "bg-red-50 text-red-800" : "bg-green-50 text-green-800"
            }`}
          >
            {error ? (
              <X className="w-4 h-4 shrink-0" />
            ) : (
              <Check className="w-4 h-4 shrink-0" />
            )}
            <span>{error ?? success}</span>
          </motion.div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-neutral-400" />
          </div>
        ) : tab === "categorias" ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid gap-8 lg:grid-cols-[1fr,320px]"
          >
            <div className="rounded-2xl border border-neutral-200 bg-white p-6">
              <h2 className="text-lg font-semibold text-neutral-900 mb-4">
                Categorias existentes
              </h2>
              {categories.length === 0 ? (
                <p className="text-neutral-500 py-4">
                  Nenhuma categoria ainda. Crie a primeira!
                </p>
              ) : (
                <ul className="space-y-2">
                  {categories.map((c) => (
                    <li
                      key={c.id}
                      className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-neutral-50"
                    >
                      <span className="font-medium text-neutral-800">
                        {c.name}
                      </span>
                      <span className="text-sm text-neutral-500">
                        {c.slug} • {c.post_count} posts
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="rounded-2xl border border-neutral-200 bg-neutral-50/50 p-6">
              <h2 className="text-lg font-semibold text-neutral-900 mb-4 flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Nova categoria
              </h2>
              <form onSubmit={handleCreateCategory} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Nome
                  </label>
                  <input
                    type="text"
                    value={catName}
                    onChange={(e) => setCatName(e.target.value)}
                    placeholder="Reflexões"
                    required
                    className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 bg-white focus:ring-2 focus:ring-neutral-900 focus:border-transparent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Slug
                  </label>
                  <input
                    type="text"
                    value={catSlug}
                    onChange={(e) => setCatSlug(e.target.value)}
                    placeholder="reflexoes"
                    required
                    className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 bg-white focus:ring-2 focus:ring-neutral-900 focus:border-transparent outline-none"
                  />
                </div>
                <button
                  type="submit"
                  disabled={saving}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-neutral-900 text-white font-medium hover:bg-neutral-800 disabled:opacity-50 transition-colors"
                >
                  {saving ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      Criar categoria
                    </>
                  )}
                </button>
              </form>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid gap-8 lg:grid-cols-[1fr,400px]"
          >
            <div className="rounded-2xl border border-neutral-200 bg-white p-6 space-y-4">
              <h2 className="text-lg font-semibold text-neutral-900 flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Novo post
              </h2>
              <form onSubmit={handleCreatePost} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Título
                  </label>
                  <input
                    type="text"
                    value={postTitle}
                    onChange={(e) => setPostTitle(e.target.value)}
                    placeholder="Título do artigo"
                    required
                    className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 bg-white focus:ring-2 focus:ring-neutral-900 focus:border-transparent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Slug (URL)
                  </label>
                  <input
                    type="text"
                    value={postSlug}
                    onChange={(e) => setPostSlug(e.target.value)}
                    placeholder="titulo-do-artigo"
                    required
                    className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 bg-white focus:ring-2 focus:ring-neutral-900 focus:border-transparent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Resumo (snippet)
                  </label>
                  <textarea
                    value={postSnippet}
                    onChange={(e) => setPostSnippet(e.target.value)}
                    placeholder="Breve descrição para listagem..."
                    rows={2}
                    className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 bg-white focus:ring-2 focus:ring-neutral-900 focus:border-transparent outline-none resize-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Conteúdo
                  </label>
                  <MarkdownEditor
                    key={editorKey}
                    value={postContent}
                    onChange={setPostContent}
                    placeholder="Escreva seu artigo... Use / para comandos (títulos, listas, código...)"
                    className="[&_.bn-block-outer]:py-0.5"
                  />
                </div>
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-neutral-700 mb-2">
                    <Link2 className="w-4 h-4" />
                    Links relacionados
                  </label>
                  <div className="space-y-2">
                    {postLinks.map((link, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2 p-3 rounded-lg bg-neutral-50 border border-neutral-200"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-neutral-900 text-sm truncate">
                            {link.label}
                          </p>
                          <p className="text-xs text-neutral-500 truncate">
                            {link.url}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            setPostLinks((p) => p.filter((_, j) => j !== i))
                          }
                          className="p-1.5 rounded-lg text-neutral-500 hover:bg-neutral-200 hover:text-neutral-700"
                          aria-label="Remover link"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newLinkLabel}
                        onChange={(e) => setNewLinkLabel(e.target.value)}
                        placeholder="Ex: Meus cursos"
                        className="flex-1 px-3 py-2 rounded-lg border border-neutral-200 bg-white text-sm focus:ring-2 focus:ring-neutral-900 outline-none"
                      />
                      <input
                        type="url"
                        value={newLinkUrl}
                        onChange={(e) => setNewLinkUrl(e.target.value)}
                        placeholder="https://..."
                        className="flex-1 px-3 py-2 rounded-lg border border-neutral-200 bg-white text-sm focus:ring-2 focus:ring-neutral-900 outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (newLinkLabel.trim() && newLinkUrl.trim()) {
                            setPostLinks((p) => [
                              ...p,
                              {
                                label: newLinkLabel.trim(),
                                url: newLinkUrl.trim(),
                              },
                            ]);
                            setNewLinkLabel("");
                            setNewLinkUrl("");
                          }
                        }}
                        className="px-4 py-2 rounded-lg bg-neutral-200 hover:bg-neutral-300 text-neutral-800 text-sm font-medium"
                      >
                        Adicionar
                      </button>
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">
                      Tempo de leitura (min)
                    </label>
                    <input
                      type="number"
                      min={1}
                      value={postReadTime}
                      onChange={(e) =>
                        setPostReadTime(parseInt(e.target.value) || 0)
                      }
                      className="w-24 px-4 py-2.5 rounded-xl border border-neutral-200 bg-white focus:ring-2 focus:ring-neutral-900 focus:border-transparent outline-none"
                    />
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer pt-8">
                    <input
                      type="checkbox"
                      checked={postFeatured}
                      onChange={(e) => setPostFeatured(e.target.checked)}
                      className="rounded border-neutral-300"
                    />
                    <span className="text-sm font-medium">Destaque</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer pt-8">
                    <input
                      type="checkbox"
                      checked={postPublished}
                      onChange={(e) => setPostPublished(e.target.checked)}
                      className="rounded border-neutral-300"
                    />
                    <span className="text-sm font-medium">Publicar agora</span>
                  </label>
                </div>
                {categories.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Categorias
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {categories.map((c) => (
                        <button
                          key={c.id}
                          type="button"
                          onClick={() => togglePostCategory(c.id)}
                          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                            postCategoryIds.includes(c.id)
                              ? "bg-neutral-900 text-white"
                              : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
                          }`}
                        >
                          {c.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                <button
                  type="submit"
                  disabled={saving}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-neutral-900 text-white font-medium hover:bg-neutral-800 disabled:opacity-50 transition-colors"
                >
                  {saving ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      Criar post
                    </>
                  )}
                </button>
              </form>
            </div>

            <div className="rounded-2xl border border-neutral-200 bg-neutral-50/50 p-6">
              <h2 className="text-lg font-semibold text-neutral-900 mb-4">
                Posts recentes
              </h2>
              {posts.length === 0 ? (
                <p className="text-neutral-500 py-4">
                  Nenhum post ainda. Crie o primeiro!
                </p>
              ) : (
                <ul className="space-y-3">
                  {posts.slice(0, 10).map((p) => (
                    <li key={p.id}>
                      <a
                        href={`/blog/${p.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 py-2 px-3 rounded-lg hover:bg-white group"
                      >
                        <span className="font-medium text-neutral-800 group-hover:text-neutral-900 truncate flex-1">
                          {p.title}
                        </span>
                        <ChevronRight className="w-4 h-4 text-neutral-400 group-hover:text-neutral-600 shrink-0" />
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
