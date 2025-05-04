"use client";

import { TextStyle, TerminalOutputItem } from "@/core/terminal";
import { Prose } from "../prose/prose";

interface OutputProps {
  output: TerminalOutputItem[];
}

export function TerminalOutput({ output }: OutputProps) {
  return (
    <div
      className="whitespace-pre-line data-[output-exists=true]:mb-4"
      data-output-exists={output.length > 0}
    >
      {output.map((item) =>
        item.type === "react" ? (
          <Prose key={item.id}>{item.content}</Prose>
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
