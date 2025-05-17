import parse from 'html-react-parser';
import { marked } from 'marked';
import { FileNode } from '../filesystem';

const renderer = new marked.Renderer();

renderer.heading = ({ text, depth }) => {
  return `<h${depth}>${text}</h${depth}>`;
};

renderer.code = ({ text, lang }) => {
  return `<pre><code class="language-${lang}">${text}</code></pre>`;
};

renderer.list = ({ items, ordered }) => {
  const listItems = items.map(item => `<li>${item.text}</li>`).join('');

  if (ordered) {
    return `<ol>${listItems}</ol>`;
  } else {
    return `<ul>${listItems}</ul>`;
  }
};

/**
 * @description 이미지 사이즈 포맷: `title <width>*<height>`
 */
renderer.image = ({ title, text, href }) => {
  title = title || text;
  const [titleText, size] = title.split(' ');
  const [width, height] = size?.split('*') || [];

  let sizeAttr = '';
  if (width) sizeAttr += ` width="${width}"`;
  if (height) sizeAttr += ` height="${height}"`;

  return `<img src="${href}" alt="${text}" title="${titleText}"${sizeAttr}>`;
};

async function renderMarkdownToReact(content: string) {
  const html = marked(content, { renderer });
  return parse(await html);
}

const rendererRegistry: Record<string, (node: FileNode) => React.ReactNode> = {
  '.md': node => renderMarkdownToReact(node.text),
  default: node => <pre className="whitespace-pre-wrap">{node.text}</pre>,
};

export function renderFileNode(node: FileNode): React.ReactNode {
  const renderer = (rendererRegistry[node.extension] ?? rendererRegistry['default']) as (
    node: FileNode,
  ) => React.ReactNode;

  return renderer(node);
}
