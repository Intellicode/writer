import { PropsWithChildren, createContext, useState } from "react";
import * as monaco from "monaco-editor";

interface EditorContextType {
  setEditor: (editor: monaco.editor.IStandaloneCodeEditor) => void;
  insertTextAtCursor?: (text: string) => void;
}

export const EditorContext = createContext<EditorContextType>({
  setEditor: () => {
    /* no implementation */
  },
});

function createEditorFunctions(editor: monaco.editor.IStandaloneCodeEditor) {
  return {
    insertTextAtCursor: (text: string) => {
      if (editor) {
        const selection = editor.getSelection();
        const id = { major: 1, minor: 1 };
        const op = {
          identifier: id,
          range: {
            startLineNumber: selection?.selectionStartLineNumber || 1,
            startColumn: selection?.selectionStartColumn || 1,
            endLineNumber: selection?.endLineNumber || 1,
            endColumn: selection?.endColumn || 1,
          },
          text,
          forceMoveMarkers: true,
        };
        editor.executeEdits("my-source", [op]);
      }
    },
  };
}

export default function EditorContextProvider({ children }: PropsWithChildren) {
  const [editor, setEditor] =
    useState<monaco.editor.IStandaloneCodeEditor | null>(null);

  return (
    <EditorContext.Provider
      value={{
        setEditor,
        ...createEditorFunctions(editor),
      }}
    >
      {children}
    </EditorContext.Provider>
  );
}
