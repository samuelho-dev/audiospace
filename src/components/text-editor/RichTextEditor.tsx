"use client";
import { type Editor } from "@tiptap/react";
import { EditorContent } from "@tiptap/react";

import {
  RiBold,
  RiItalic,
  RiH1,
  RiH2,
  RiH3,
  RiH4,
  RiH5,
  RiListUnordered,
  RiListOrdered,
  RiStrikethrough,
  RiUnderline,
  RiDeleteBin6Line,
  RiEraserLine,
} from "react-icons/ri";

interface MenubarProps {
  editor: Editor;
}
const MenuBar = ({ editor }: MenubarProps) => {
  const menuItems = [
    {
      name: "bold",
      isActive: editor.isActive("bold"),
      onClick: () => editor.chain().focus().toggleBold().run(),
      onDisabled: !editor.can().chain().focus().toggleBold().run(),
      icon: <RiBold />,
    },
    {
      name: "italic",
      isActive: editor.isActive("italic"),
      onClick: () => editor.chain().focus().toggleItalic().run(),
      onDisabled: !editor.can().chain().focus().toggleItalic().run(),
      icon: <RiItalic />,
    },
    {
      name: "strike",
      isActive: editor.isActive("strike"),
      onClick: () => editor.chain().focus().toggleStrike().run(),
      onDisabled: !editor.can().chain().focus().toggleStrike().run(),
      icon: <RiStrikethrough />,
    },
    {
      name: "underline",
      isActive: editor.isActive("underline"),
      onClick: () => editor.chain().focus().toggleUnderline().run(),
      onDisabled: !editor.can().chain().focus().toggleUnderline().run(),
      icon: <RiUnderline />,
    },
    {
      name: "clearFormat",
      isActive: editor.isActive("clearFormat"),
      onClick: () => editor.chain().focus().clearNodes().run(),
      onDisabled: !editor.can().chain().focus().clearNodes().run(),
      icon: <RiEraserLine />,
    },
    {
      name: "h1",
      isActive: editor.isActive("h1"),
      onClick: () => editor.chain().focus().setHeading({ level: 1 }).run(),
      onDisabled: false,
      icon: <RiH1 />,
    },
    {
      name: "h2",
      isActive: editor.isActive("h2"),
      onClick: () => editor.chain().focus().setHeading({ level: 2 }).run(),
      onDisabled: false,
      icon: <RiH2 />,
    },
    {
      name: "h3",
      isActive: editor.isActive("h3"),
      onClick: () => editor.chain().focus().setHeading({ level: 3 }).run(),
      onDisabled: false,
      icon: <RiH3 />,
    },
    {
      name: "h4",
      isActive: editor.isActive("h4"),
      onClick: () => editor.chain().focus().setHeading({ level: 4 }).run(),
      onDisabled: false,
      icon: <RiH4 />,
    },
    {
      name: "h5",
      isActive: editor.isActive("h5"),
      onClick: () => editor.chain().focus().setHeading({ level: 5 }).run(),
      onDisabled: false,
      icon: <RiH5 />,
    },
    {
      name: "bullet list",
      isActive: editor.isActive("bulletList"),
      onClick: () => editor.chain().focus().toggleBulletList().run(),
      onDisabled: !editor.can().chain().focus().toggleBulletList().run(),
      icon: <RiListUnordered />,
    },
    {
      name: "ordered list",
      isActive: editor.isActive("orderedList"),
      onClick: () => editor.chain().focus().toggleOrderedList().run(),
      onDisabled: !editor.can().chain().focus().toggleOrderedList().run(),
      icon: <RiListOrdered />,
    },
    {
      name: "clearMarks",
      isActive: editor.isActive("clearMarks"),
      onClick: () => editor.chain().focus().clearContent().run(),
      onDisabled: !editor.can().chain().focus().clearContent().run(),
      icon: <RiDeleteBin6Line />,
    },
  ];

  return (
    <div className="flex w-full gap-1">
      {menuItems.map((item, i) => (
        <button
          onClick={item.onClick}
          disabled={item.onDisabled}
          key={i}
          className={`${
            item.isActive ? "bg-zinc-500" : "bg-zinc-800"
          } flex w-full items-center justify-center rounded-sm p-1`}
        >
          {item.icon ? item.icon : item.name}
        </button>
      ))}
    </div>
  );
};

interface RichTextEditorProps {
  editor: Editor;
}

const RichTextEditor = ({ editor }: RichTextEditorProps) => {
  if (!editor) {
    return null;
  }

  return (
    <div className="flex flex-col gap-1">
      <MenuBar editor={editor} />
      <div className="rounded-md border border-zinc-200">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};

export default RichTextEditor;
