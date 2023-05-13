import Underline from "@tiptap/extension-underline";
import { generateHTML } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import DOMPurify from "isomorphic-dompurify";
import React, { useMemo } from "react";
import { type TiptapOutputSchema } from "~/types/schema";

interface RenderEditorProps {
  content: string;
}
function RenderEditor({ content }: RenderEditorProps) {
  const sanitize = DOMPurify.sanitize(content);
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const json: TiptapOutputSchema = JSON.parse(sanitize);
  const output = useMemo(() => {
    return generateHTML(json, [
      StarterKit.configure({
        paragraph: {
          HTMLAttributes: {
            class: "min-h-[1rem]",
          },
        },
      }),
      Underline,
    ]);
  }, [json]);

  return <div className="p-2" dangerouslySetInnerHTML={{ __html: output }} />;
}

export default RenderEditor;
