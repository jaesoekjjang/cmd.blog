"use client";

import { useState } from "react";
import { Renderer } from "./Renderer";

export default function useReactRenderer() {
  const [outputs, setOutputs] = useState<string[]>([]);
  const [prompt, setPrompt] = useState<string>("$ ");

  const renderer: Renderer = {
    renderPrompt({ directory, prompt }) {
      setPrompt(`${directory} ${prompt}`);
    },
    renderOutput(output: string) {
      setOutputs((prev) => [...prev, output]);
    },
    clearOutput: () => {
      setOutputs([]);
    },
  };

  return { outputs, prompt, renderer };
}
