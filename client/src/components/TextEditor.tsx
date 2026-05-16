import { useEffect, useRef } from "react";
import Quill from "quill";

interface Props {
  value?: string;
  onChange?: (html: string) => void;
  placeholder?: string;
}

export default function RichEditor({
  value,
  onChange,
  placeholder = "Write something…",
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const quillRef = useRef<Quill | null>(null);

  useEffect(() => {
    if (!containerRef.current || quillRef.current) return;

    quillRef.current = new Quill(containerRef.current, {
      theme: "snow",
      placeholder,
      modules: {
        toolbar: [
          [{ header: [1, 2, 3, false] }],
          ["bold", "italic", "strike"],
          [{ list: "ordered" }, { list: "bullet" }],
          ["clean"],
        ],
      },
    });

    if (value) {
      quillRef.current.root.innerHTML = value;
    }

    quillRef.current.on("text-change", () => {
      const html =
        containerRef.current?.querySelector(".ql-editor")?.innerHTML ?? "";
      onChange?.(html);
    });

    return () => {
      quillRef.current = null;
    };
  }, []);

  return <div ref={containerRef} />;
}
