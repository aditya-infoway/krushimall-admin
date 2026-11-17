import { useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
// import Underline from "@tiptap/extension-underline";

interface TextEditorProps {
  value: string;
  onChange: (value: string) => void;
  readOnly?: boolean;
}

export default function TextEditor({
  value,
  onChange,
  readOnly = false,
}: TextEditorProps) {
 const editor = useEditor({
  extensions: [StarterKit],
  content: value || "",
  editable: !readOnly,
  immediatelyRender: false,
  onUpdate: ({ editor }) => {
    onChange(editor.getHTML());
  },
});
  // API se data aane ke baad saved terms dikhao
  useEffect(() => {
    if (!editor || editor.isDestroyed) return;

    const savedContent = value || "";

    let currentContent = "";
    try {
      currentContent = editor.getHTML();
    } catch {
      // schema abhi ready nahi, agle render par dobara chalega
      return;
    }

    if (currentContent !== savedContent) {
      editor.commands.setContent(savedContent, { emitUpdate: false });
    }
  }, [editor, value]);

  // Editable / read-only mode update
  useEffect(() => {
    if (!editor || editor.isDestroyed) return;

    editor.setEditable(!readOnly);
  }, [editor, readOnly]);

  return (
    <div className="overflow-hidden rounded-xl border border-gray-300 dark:border-gray-700">
      {!readOnly && (
        <div className="flex flex-wrap gap-2 border-b border-gray-300 p-2 dark:border-gray-700">
          <button
            type="button"
            onClick={() => editor?.chain().focus().toggleBold().run()}
            className={`rounded px-3 py-1 font-bold ${
              editor?.isActive("bold")
                ? "bg-primary-500 text-white"
                : "bg-gray-100 dark:bg-gray-700"
            }`}
          >
            B
          </button>

          <button
            type="button"
            onClick={() => editor?.chain().focus().toggleItalic().run()}
            className={`rounded px-3 py-1 italic ${
              editor?.isActive("italic")
                ? "bg-primary-500 text-white"
                : "bg-gray-100 dark:bg-gray-700"
            }`}
          >
            I
          </button>

          <button
            type="button"
            onClick={() => editor?.chain().focus().toggleUnderline().run()}
            className={`rounded px-3 py-1 underline ${
              editor?.isActive("underline")
                ? "bg-primary-500 text-white"
                : "bg-gray-100 dark:bg-gray-700"
            }`}
          >
            U
          </button>

          <button
            type="button"
            onClick={() => editor?.chain().focus().toggleBulletList().run()}
            className={`rounded px-3 py-1 ${
              editor?.isActive("bulletList")
                ? "bg-primary-500 text-white"
                : "bg-gray-100 dark:bg-gray-700"
            }`}
          >
            • List
          </button>

          <button
            type="button"
            onClick={() => editor?.chain().focus().toggleOrderedList().run()}
            className={`rounded px-3 py-1 ${
              editor?.isActive("orderedList")
                ? "bg-primary-500 text-white"
                : "bg-gray-100 dark:bg-gray-700"
            }`}
          >
            1. List
          </button>
        </div>
      )}

      <EditorContent
        editor={editor}
        className="
          min-h-[180px]
          p-4

          [&_.ProseMirror]:min-h-[150px]
          [&_.ProseMirror]:outline-none

          [&_.ProseMirror_p]:my-1

          [&_.ProseMirror_ol]:ml-6
          [&_.ProseMirror_ol]:list-decimal

          [&_.ProseMirror_ul]:ml-6
          [&_.ProseMirror_ul]:list-disc

          [&_.ProseMirror_li]:my-1
        "
      />
    </div>
  );
}