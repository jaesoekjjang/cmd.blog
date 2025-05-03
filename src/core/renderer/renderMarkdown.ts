import { marked } from "marked";

const renderer = new marked.Renderer();

renderer.heading = ({ text, depth }) => {
  return `<h${depth} class="text-2xl font-bold mb-2">${text}</h${depth}>`;
};

renderer.code = ({ text, lang }) => {
  return `<pre class="bg-gray-100 dark:bg-gray-800 p-4 rounded"><code class="language-${lang}">${text}</code></pre>`;
};

renderer.list = ({ items, ordered }) => {
  const listItems = items
    .map((item) => {
      return `<li className=''>${item.text}</li>`;
    })
    .join("");

  if (ordered) {
    return `<ol class="list-decimal list-inside">${listItems}</ol>`;
  } else {
    return `<ul class="list-disc list-inside">${listItems}</ul>`;
  }
};

/**
 * @description 이미지 사이즈 포맷: `title <width>*<height>`
 * */
renderer.image = ({ title, text, href }) => {
  title = title || text;
  const [titleText, size] = title.split(" ");

  const [width, height] = size?.split("*") || [];

  if (width && height) {
    return `<img src="${href}" alt="${text}" title="${titleText}" class="rounded-lg shadow-md border border-gray-200 dark:border-gray-700" width=${width}" height=${height} />`;
  }

  if (width) {
    return `<img src="${href}" alt="${text}" title="${titleText}" class="rounded-lg shadow-md border border-gray-200 dark:border-gray-700" width=${width} />`;
  }

  if (height) {
    return `<img src="${href}" alt="${text}" title="${titleText}" class="rounded-lg shadow-md border border-gray-200 dark:border-gray-700" height=${height}/>`;
  }

  return `<img src="${href}" alt="${text}" title="${titleText}" class="rounded-lg shadow-md border border-gray-200 dark:border-gray-700" />`;
};

export async function renderMarkdown(content: string) {
  return await marked(content, { renderer });
}
