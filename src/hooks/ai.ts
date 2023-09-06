import { useCallback } from "react";

export function useGenerateText(
  onText: (text: string) => void,
  model = "llama2"
) {
  const generateText = useCallback(
    async (prompt: string) => {
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
          const json = JSON.parse(textDecoder.decode(value));
          if (json["response"] !== undefined) {
            onText(json["response"]);
            console.log("inserting");
          }
        } catch (e) {
          // nothing
          console.log(e);
        }

        if (done) {
          // Do something with last chunk of data then exit reader
          return;
        }
        // Otherwise do something here to process current chunk
      }
    },
    [onText]
  );

  return {
    generateText,
  };
}
