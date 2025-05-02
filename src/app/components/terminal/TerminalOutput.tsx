"use client";

import { OutputItem } from "@/core/terminal/useTerminal";
import { TextStyle } from "@/types/terminal";

interface OutputProps {
  output: OutputItem[];
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
