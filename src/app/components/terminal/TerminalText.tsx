import { TextStyle } from '@/core/lineEditor';

export function TermianlText({ children, style }: { children: string; style?: TextStyle }) {
  return (
    <span
      style={{
        color: style?.foreground,
        backgroundColor: style?.background,
        fontWeight: style?.bold ? 'bold' : undefined,
        fontStyle: style?.italic ? 'italic' : undefined,
        textDecoration: style?.underline ? 'underline' : undefined,
      }}
    >
      {children}
    </span>
  );
}
