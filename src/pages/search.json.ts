import { getCollection } from 'astro:content';

function cleanMarkdown(text: string): string {
  if (!text) return '';
  return text
    .replace(/```[\s\S]*?```/g, ' ') // strip fenced code blocks
    .replace(/`([^`]+)`/g, '$1')     // unwrap inline code
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // unwrap links
    .replace(/#+\s+/g, '')          // remove markdown headers
    .replace(/[*_~>]/g, '')         // remove formatting characters
    .replace(/\s+/g, ' ')           // collapse whitespace
    .trim();
}

export interface SearchDoc {
  id: string;
  url: string;
  title: string;
  description: string;
  category: string;
  type: 'Docs' | 'Blog';
  body: string;
}

export async function GET() {
  const docs = await getCollection('docs');
  const blog = await getCollection('blog');

  const searchItems: SearchDoc[] = [];

  // Documentation entries
  for (const doc of docs) {
    searchItems.push({
      id: `/docs/${doc.id}`,
      url: `/docs/${doc.id}`,
      title: doc.data.title,
      description: doc.data.description,
      category: doc.data.category,
      type: 'Docs',
      body: cleanMarkdown(doc.body || ''),
    });
  }

  // Blog posts
  for (const post of blog) {
    if (post.data.draft) continue;
    searchItems.push({
      id: `/blog/${post.id}`,
      url: `/blog/${post.id}`,
      title: post.data.title,
      description: post.data.description,
      category: 'blog',
      type: 'Blog',
      body: cleanMarkdown(post.body || ''),
    });
  }

  return new Response(JSON.stringify(searchItems), {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
    },
  });
}
