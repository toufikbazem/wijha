import type { ReactNode } from "react";
import { useRef, useState, useEffect } from "react";
import { useCountUp } from "@/features/public/components/hooks/useCountUp";
import { cn } from "@/lib/utils";

interface CounterCardProps {
  label: string;
  target: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
  icon?: ReactNode;
  className?: string;
}

const CounterCard = ({
  label,
  target,
  suffix = "",
  prefix = "",
  duration = 2000,
  icon,
  className,
}: CounterCardProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setInView(true);
      },
      { threshold: 1.0 },
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const value = useCountUp(target, duration, inView);

  return (
    <div
      ref={ref}
      className={cn(
        " p-8 text-center transition-colors flex flex-col justify-between min-h-32",
        className,
      )}
    >
      {icon && (
        <div className="w-9 h-9 rounded-lg flex items-center justify-center mx-auto mb-4  text-white">
          {icon}
        </div>
      )}
      <p className="text-5xl font-bold tabular-nums text-white leading-none mb-3">
        {prefix}
        {value.toLocaleString()}
        {suffix}
      </p>
      <p className="text-lg text-white">{label}</p>
    </div>
  );
};

export default CounterCard;
