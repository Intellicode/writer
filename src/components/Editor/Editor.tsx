import { Box } from "@mui/material";
import * as monaco from "monaco-editor";
import MonacoEditor, { Monaco, loader } from "@monaco-editor/react";
import { useContext } from "react";
import { EditorContext } from "./EditorContext";

loader.config({ monaco });

function setEditorTheme(instance: Monaco) {
  instance.editor.defineTheme("onedark", {
    base: "vs",
    inherit: true,
    rules: [],
    colors: {},
  });
}

interface EditorProps {
  content: string;
  onChange: (content: string) => void;
}

export default function Editor({ content, onChange }: EditorProps) {
  const { setEditor } = useContext(EditorContext);

  const handleOnMount = (editor: monaco.editor.IStandaloneCodeEditor) => {
    setEditor(editor);
  };

  return (
    <Box className="editor">
      <MonacoEditor
        defaultLanguage="markdown"
        defaultValue="// some comment"
        value={content}
        onChange={onChange}
        theme="onedark"
        options={{
          automaticLayout: true,
          fontFamily: "Monaco",
          fontSize: 16,
          wordWrap: "on",
        }}
        beforeMount={setEditorTheme}
        onMount={handleOnMount}
      />
    </Box>
  );
}
