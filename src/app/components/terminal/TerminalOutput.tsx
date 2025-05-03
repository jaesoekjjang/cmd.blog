"use client";

import { TextStyle, TerminalOutputItem } from "@/core/terminal";

interface OutputProps {
  output: TerminalOutputItem[];
}

export function TerminalOutput({ output }: OutputProps) {
  return (
    <div className="text-sm space-y-2 whitespace-pre-wrap">
      {output.map((item) =>
        item.type === "react" ? (
          <div key={item.id}>{item.content}</div>
        ) : (
          <StyledText key={item.id} style={item.style}>
            {item.content as string}
          </StyledText>
        ),
      )}
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
