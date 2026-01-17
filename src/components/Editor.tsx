"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import { Video } from "@/components/extensions/Video";

export default function Editor({
  content,
  onChange,
}: {
  content: string;
  onChange: (html: string) => void;
}) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      Link.configure({ openOnClick: false }),
      Video,
    ],
    content,
    immediatelyRender: false, // Next.js 16 SSR fix
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
  });

  if (!editor) return null;

  async function upload(file: File) {
    const data = new FormData();
    data.append("file", file);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: data,
    });

    if (!res.ok) {
      throw new Error("Upload failed");
    }

    return res.json() as Promise<{
      url: string;
      type: "image" | "video";
    }>;
  }

  async function addImage(file: File) {
    const { url } = await upload(file);
    editor.chain().focus().setImage({ src: url }).run();
  }

  async function addVideo(file: File) {
    const { url } = await upload(file);

    editor
      .chain()
      .focus()
      .insertContent([
        {
          type: "video",
          attrs: {
            src: url,
            type: file.type,
          },
        },
        { type: "paragraph" },
      ])
      .run();
  }

  return (
    <div className="border rounded-lg bg-white dark:bg-gray-900">
      {/* TOOLBAR */}
      <div
        className="
          flex flex-wrap gap-2 p-2 border-b
          bg-gray-100 text-gray-900
          dark:bg-gray-800 dark:text-gray-100
        "
      >
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className="editor-btn"
        >
          Bold
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className="editor-btn"
        >
          Italic
        </button>

        <button
          type="button"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          className="editor-btn"
        >
          H2
        </button>

        <label className="editor-btn cursor-pointer">
          Image
          <input
            type="file"
            hidden
            accept="image/*"
            onChange={e =>
              e.target.files && addImage(e.target.files[0])
            }
          />
        </label>

        <label className="editor-btn cursor-pointer">
          Video
          <input
            type="file"
            hidden
            accept="video/mp4,video/webm"
            onChange={e =>
              e.target.files && addVideo(e.target.files[0])
            }
          />
        </label>
      </div>

      {/* CONTENT */}
      <EditorContent
        editor={editor}
        className="
          p-4 min-h-[300px] outline-none
          bg-white text-gray-900
          dark:bg-gray-900 dark:text-gray-100
        "
      />
    </div>
  );
}
