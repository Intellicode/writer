export async function handleGetOpenAIApiKey(event: IpcMainInvokeEvent) {
  return process.env.OPENAI_API_KEY;
}
