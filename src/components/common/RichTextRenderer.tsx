import { cn } from "@/lib/utils";

interface RichTextRendererProps {
  content: string;
  className?: string;
}

export default function RichTextRenderer({ content, className }: RichTextRendererProps) {
  if (!content) return null;

  return (
    <div
      className={cn(
        "prose prose-slate lg:prose-lg max-w-none prose-headings:font-serif prose-headings:font-bold prose-headings:text-kishtwar-green-900 prose-p:leading-relaxed prose-a:text-kishtwar-emerald hover:prose-a:text-kishtwar-green-500 prose-img:rounded-xl prose-blockquote:border-l-4 prose-blockquote:border-kishtwar-green-500 prose-blockquote:italic prose-blockquote:text-gray-600 prose-kishtwar",
        className
      )}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}
