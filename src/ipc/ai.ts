import { IpcMainInvokeEvent } from "electron";
import OpenAI from "openai";

export async function* handleGenerateOllamaText(
  event: IpcMainInvokeEvent,
  prompt: string,
  model = "llama2"
) {
  let result;
  try {
    result = await fetch("http://127.0.0.1:11434/api/generate", {
      method: "POST",
      body: JSON.stringify({
        model,
        prompt,
      }),
    });
  } catch (e) {
    return;
  }

  const textDecoder = new TextDecoder("utf-8");
  const reader = result.body.getReader();
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const { done, value } = await reader.read();
    try {
      const json = value ? JSON.parse(textDecoder.decode(value)) : {};
      if (json["response"] !== undefined) {
        yield json["response"];
      }
    } catch (e) {
      // nothing
    }

    if (done) {
      // Do something with last chunk of data then exit reader
      return;
    }
    // Otherwise do something here to process current chunk
  }
}

export async function* handleGenerateOpenAIText(
  event: IpcMainInvokeEvent,
  prompt: string
) {
  const apiKey = await window.electronAPI.getOpenAIApiKey();
  const openai = new OpenAI({
    apiKey: apiKey,
    dangerouslyAllowBrowser: true,
  });
  const stream = await openai.chat.completions.create({
    messages: [{ role: "user", content: prompt }],
    model: "gpt-3.5-turbo",
    stream: true,
  });
  for await (const part of stream) {
    yield part.choices[0]?.delta?.content || "";
  }
  return;
}
