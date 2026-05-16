import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type FadeMode = "words" | "letters" | "lines";

interface FadeTextProps {
  text: string;
  mode?: FadeMode;
  stagger?: number;
  duration?: number;
  className?: string;
}

const FadeText = ({
  text,
  mode = "words",
  stagger = 80,
  duration = 600,
  className,
}: FadeTextProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setInView(true);
      },
      { threshold: 0.2 },
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const items =
    mode === "letters"
      ? text.split("")
      : mode === "lines"
        ? text.split("\n")
        : text.split(" ");

  return (
    <div ref={ref} className={cn("flex flex-wrap gap-x-2", className)}>
      {items.map((item, i) => (
        <span
          key={i}
          style={{
            opacity: inView ? 1 : 0,
            transform: inView ? "translateY(0)" : "translateY(12px)",
            transition: `opacity ${duration}ms ease, transform ${duration}ms ease`,
            transitionDelay: `${i * stagger}ms`,
            display: mode === "lines" ? "block" : "inline-block",
          }}
        >
          {item === " " ? "\u00A0" : item}
        </span>
      ))}
    </div>
  );
};

export default FadeText;
