import defaultCode from "./defaultCode";
import CodeMirror from "@uiw/react-codemirror";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";

export function Editor() {
  // read text from placeholderCode.txt

  return (
    <CodeMirror
      value={defaultCode}
      style={{ height: "100vh", width: "100vw"}}
      theme={vscodeDark}
    />
  );
}
