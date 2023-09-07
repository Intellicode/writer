import { useCallback } from "react";
import OpenAI from "openai";

export function useGenerateText(
  onText: (text: string) => void,
  model = "ollama"
) {
  const generateText = useCallback(
    async (prompt: string) => {
      if (model === "llama2") {
        const result = await fetch("http://localhost:11434/api/generate", {
          method: "POST",
          body: JSON.stringify({
            model,
            prompt,
          }),
        });

        const textDecoder = new TextDecoder("utf-8");
        const reader = result.body.getReader();
        // eslint-disable-next-line no-constant-condition
        while (true) {
          const { done, value } = await reader.read();
          try {
            const json = value ? JSON.parse(textDecoder.decode(value)) : {};
            if (json["response"] !== undefined) {
              onText(json["response"]);
              console.log("inserting");
            }
          } catch (e) {
            // nothing
            console.log(e, textDecoder.decode(value));
          }

          if (done) {
            // Do something with last chunk of data then exit reader
            return;
          }
          // Otherwise do something here to process current chunk
        }
      }

      if (model === "gpt") {
        const apiKey = await window.electronAPI.getOpenAIApiKey();
        const openai = new OpenAI({
          apiKey: apiKey,
          dangerouslyAllowBrowser: true,
        });
        const stream = await openai.chat.completions.create({
          messages: [{ role: "user", content: "Say this is a test" }],
          model: "gpt-3.5-turbo",
          stream: true,
        });
        for await (const part of stream) {
          onText(part.choices[0]?.delta?.content || "");
        }
        return;
      }
    },
    [onText]
  );

  return {
    generateText,
  };
}
