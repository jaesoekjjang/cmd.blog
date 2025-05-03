"use client";

import { TextStyle, TerminalOutputItem } from "@/core/terminal";

interface OutputProps {
  output: TerminalOutputItem[];
}

export function TerminalOutput({ output }: OutputProps) {
  return (
    <div className="text-sm space-y-2 whitespace-pre-wrap">
      {output.map((item) => (
        <StyledText key={item.id} style={item.style}>
          {item.content}
        </StyledText>
      ))}
    </div>
  );
}

function StyledText({
  children,
  style,
}: {
  children: string;
  style?: TextStyle;
}) {
  // TODO: markdown 렌더링 지원
  // return (
  //   <div
  //     dangerouslySetInnerHTML={{ __html: children }}
  //     // className="prose prose-sm max-w-none dark:prose-invert prose-img:rounded-lg prose-img:shadow-md prose-img:border prose-img:border-gray-200 dark:prose-img:border-gray-700 prose-code:bg-gray-100 dark:prose-code:bg-gray-800 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:font-mono prose-blockquote:border-l-4 prose-blockquote:border-gray-300 dark:prose-blockquote:border-gray-600 prose-blockquote:pl-4 prose-blockquote:not-italic"
  //   />
  // );

  return (
    <span
      style={{
        color: style?.foreground,
        backgroundColor: style?.background,
        fontWeight: style?.bold ? "bold" : undefined,
        fontStyle: style?.italic ? "italic" : undefined,
        textDecoration: style?.underline ? "underline" : undefined,
      }}
    >
      {children}
    </span>
  );
}
