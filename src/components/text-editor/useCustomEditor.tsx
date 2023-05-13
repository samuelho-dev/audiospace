import Underline from "@tiptap/extension-underline";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

const useCustomEditor = () => {
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
  });
  return editor;
};

export default useCustomEditor;
