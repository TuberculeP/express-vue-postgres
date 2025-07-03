export type ArticleExcerpt = {
  id: number;
  slug: number;
  html_title: string;
  html_excerpt: string;
  date: string;
};

export type RawArticleExcerpt = {
  id: number;
  slug: number;
  title: { rendered: string };
  excerpt: { rendered: string };
  date: string;
};
