export function Prose({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="whitespace-normal
              leading-snug dark:prose-invert
              prose-h1:text-4xl prose-h1:font-bold prose-h1:mb-2
              prose-h2:text-3xl prose-h2:font-bold prose-h2:mb-2
              prose-h3:text-2xl prose-h3:font-bold prose-h3:mb-2
              prose-pre:bg-gray-100 dark:prose-pre:bg-gray-800 prose-pre:p-4 prose-pre:rounded
              prose-code:before:content-none prose-code:after:content-none
              prose-ul:list-disc prose-ul:list-inside prose-ul:my-5
              prose-ol:list-decimal prose-ol:list-inside prose-ol:my-5
              prose-img:rounded-lg prose-img:mt-8 prose-img:shadow-md prose-img:border prose-img:border-gray-200 dark:prose-img:border-gray-700
              prose-blockquote:border-l-4 prose-blockquote:my-5 prose-blockquote:border-gray-300 prose-blockquote:pl-4 prose-blockquote:italic dark:prose-blockquote:border-gray-700
            "
    >
      {children}
    </div>
  );
}
