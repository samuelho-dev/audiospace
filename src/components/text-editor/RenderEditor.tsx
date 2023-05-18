import Underline from "@tiptap/extension-underline";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import DOMPurify from "isomorphic-dompurify";
import React from "react";

interface RenderEditorProps {
  content: string;
}
function RenderEditor({ content }: RenderEditorProps) {
  const sanitize = DOMPurify.sanitize(content);
  const editor = useEditor({
    editable: false,
    content: sanitize,
    extensions: [
      StarterKit.configure({
        paragraph: {
          HTMLAttributes: {
            class: "min-h-[1rem]",
          },
        },
      }),
      Underline,
    ],
  });

  return <EditorContent editor={editor} />;
}

export default RenderEditor;
