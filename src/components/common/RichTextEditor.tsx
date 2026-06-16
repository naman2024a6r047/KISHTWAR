"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";
import Youtube from "@tiptap/extension-youtube";
import CharacterCount from "@tiptap/extension-character-count";
import { 
  Bold, 
  Italic, 
  List, 
  ListOrdered, 
  Heading1, 
  Heading2, 
  Heading3, 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  Link2, 
  Image as ImageIcon, 
  Undo, 
  Redo, 
  Code
} from "lucide-react";
import { cn } from "@/lib/utils";

function YoutubeIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="1em"
      height="1em"
      stroke="currentColor"
      strokeWidth="2"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
      <polygon points="10 15 15 12 10 9" fill="currentColor" />
    </svg>
  );
}

interface RichTextEditorProps {
  content: string;
  onChange: (html: string) => void;
  placeholder?: string;
  limit?: number;
  className?: string;
}

export default function RichTextEditor({
  content,
  onChange,
  placeholder = "Start writing your story here...",
  limit = 20000,
  className,
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-kishtwar-emerald underline cursor-pointer",
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: "rounded-xl max-h-[400px] object-cover mx-auto",
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Youtube.configure({
        HTMLAttributes: {
          class: "aspect-video max-w-2xl mx-auto rounded-xl overflow-hidden shadow-md",
        },
      }),
      CharacterCount.configure({
        limit,
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: "focus:outline-none min-h-[300px] prose prose-slate max-w-none text-sm p-4 w-full prose-headings:font-serif focus:ring-0",
      },
    },
    immediatelyRender: false,
  });

  if (!editor) return null;

  const addLink = () => {
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("URL:", previousUrl);

    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  const addImage = () => {
    const url = window.prompt("Image URL:");
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const addYoutube = () => {
    const url = window.prompt("YouTube Video URL:");
    if (url) {
      editor.chain().focus().setYoutubeVideo({ src: url }).run();
    }
  };

  return (
    <div className={cn("border border-gray-200 rounded-xl bg-white overflow-hidden shadow-sm flex flex-col focus-within:border-kishtwar-green-500 transition-colors tiptap-editor", className)}>
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-2 bg-gray-50 border-b border-gray-100">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={cn("p-1.5 rounded hover:bg-gray-200 transition-colors text-gray-600", editor.isActive("bold") && "bg-gray-200 text-kishtwar-green-900 font-bold")}
          title="Bold"
        >
          <Bold className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={cn("p-1.5 rounded hover:bg-gray-200 transition-colors text-gray-600", editor.isActive("italic") && "bg-gray-200 text-kishtwar-green-900 font-bold")}
          title="Italic"
        >
          <Italic className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleCode().run()}
          className={cn("p-1.5 rounded hover:bg-gray-200 transition-colors text-gray-600", editor.isActive("code") && "bg-gray-200 text-kishtwar-green-900 font-bold")}
          title="Code Inline"
        >
          <Code className="h-4 w-4" />
        </button>

        <span className="w-[1px] h-4 bg-gray-200 mx-1" />

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={cn("p-1.5 rounded hover:bg-gray-200 transition-colors text-gray-600", editor.isActive("heading", { level: 1 }) && "bg-gray-200 text-kishtwar-green-900 font-bold")}
          title="Heading 1"
        >
          <Heading1 className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={cn("p-1.5 rounded hover:bg-gray-200 transition-colors text-gray-600", editor.isActive("heading", { level: 2 }) && "bg-gray-200 text-kishtwar-green-900 font-bold")}
          title="Heading 2"
        >
          <Heading2 className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={cn("p-1.5 rounded hover:bg-gray-200 transition-colors text-gray-600", editor.isActive("heading", { level: 3 }) && "bg-gray-200 text-kishtwar-green-900 font-bold")}
          title="Heading 3"
        >
          <Heading3 className="h-4 w-4" />
        </button>

        <span className="w-[1px] h-4 bg-gray-200 mx-1" />

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={cn("p-1.5 rounded hover:bg-gray-200 transition-colors text-gray-600", editor.isActive("bulletList") && "bg-gray-200 text-kishtwar-green-900 font-bold")}
          title="Bullet List"
        >
          <List className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={cn("p-1.5 rounded hover:bg-gray-200 transition-colors text-gray-600", editor.isActive("orderedList") && "bg-gray-200 text-kishtwar-green-900 font-bold")}
          title="Ordered List"
        >
          <ListOrdered className="h-4 w-4" />
        </button>

        <span className="w-[1px] h-4 bg-gray-200 mx-1" />

        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          className={cn("p-1.5 rounded hover:bg-gray-200 transition-colors text-gray-600", editor.isActive({ textAlign: "left" }) && "bg-gray-200 text-kishtwar-green-900 font-bold")}
          title="Align Left"
        >
          <AlignLeft className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          className={cn("p-1.5 rounded hover:bg-gray-200 transition-colors text-gray-600", editor.isActive({ textAlign: "center" }) && "bg-gray-200 text-kishtwar-green-900 font-bold")}
          title="Align Center"
        >
          <AlignCenter className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          className={cn("p-1.5 rounded hover:bg-gray-200 transition-colors text-gray-600", editor.isActive({ textAlign: "right" }) && "bg-gray-200 text-kishtwar-green-900 font-bold")}
          title="Align Right"
        >
          <AlignRight className="h-4 w-4" />
        </button>

        <span className="w-[1px] h-4 bg-gray-200 mx-1" />

        <button
          type="button"
          onClick={addLink}
          className={cn("p-1.5 rounded hover:bg-gray-200 transition-colors text-gray-600", editor.isActive("link") && "bg-gray-200 text-kishtwar-green-900 font-bold")}
          title="Insert Link"
        >
          <Link2 className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={addImage}
          className="p-1.5 rounded hover:bg-gray-200 transition-colors text-gray-600"
          title="Insert Image URL"
        >
          <ImageIcon className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={addYoutube}
          className="p-1.5 rounded hover:bg-gray-200 transition-colors text-gray-600"
          title="Insert YouTube Video"
        >
          <YoutubeIcon className="h-4 w-4" />
        </button>

        <span className="w-[1px] h-4 bg-gray-200 mx-1" />

        <button
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          className="p-1.5 rounded hover:bg-gray-200 transition-colors text-gray-600 disabled:opacity-30"
          title="Undo"
        >
          <Undo className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          className="p-1.5 rounded hover:bg-gray-200 transition-colors text-gray-600 disabled:opacity-30"
          title="Redo"
        >
          <Redo className="h-4 w-4" />
        </button>
      </div>

      {/* Editor Content Area */}
      <EditorContent editor={editor} className="flex-1 w-full bg-white outline-none" />

      {/* Character / Word count footer */}
      <div className="flex items-center justify-between px-4 py-2 border-t border-gray-100 bg-gray-50 text-[10px] text-gray-400 font-semibold uppercase tracking-wider">
        <span>
          {editor.storage.characterCount.words()} words
        </span>
        <span>
          {editor.storage.characterCount.characters()} / {limit} characters
        </span>
      </div>
    </div>
  );
}
