import Underline from "@tiptap/extension-underline";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import DOMPurify from "isomorphic-dompurify";

interface customEditorProps {
  editable: boolean;
  content?: string;
  handleUpdate?: (content: string) => void;
}

const useCustomEditor = ({
  editable,
  content,
  handleUpdate,
}: customEditorProps) => {
  const editor = useEditor({
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
    editable,
    content,
    onUpdate({ editor }) {
      if (handleUpdate) {
        handleUpdate(DOMPurify.sanitize(editor.getHTML()));
      }
    },
  });
  return editor;
};

export default useCustomEditor;
