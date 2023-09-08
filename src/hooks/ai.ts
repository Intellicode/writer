import { useCallback } from "react";
import OpenAI from "openai";

export function useGenerateText(
  onText: (text: string) => void,
  model = "ollama"
) {
  const generateText = useCallback(
    async (prompt: string) => {
      if (model === "llama2") {
        window.electronAPI.generateOllamaText(prompt, onText);
        // for await (const part of parts) {
        //   onText(part.choices[0]?.delta?.content || "");
        // }
      }

      if (model === "gpt") {
      }
    },
    [onText]
  );

  return {
    generateText,
  };
}
