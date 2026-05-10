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
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const value = useCountUp(target, duration, inView);

  return (
    <div
      ref={ref}
      className={cn(
        "rounded-xl border-2 p-5 text-center transition-colors",
        className
      )}
    >
      {icon && (
        <div className="w-9 h-9 rounded-lg flex items-center justify-center mx-auto mb-3 bg-[#008CBA] text-white">
          {icon}
        </div>
      )}
      <p className="text-3xl font-medium tabular-nums text-white leading-none mb-1.5">
        {prefix}{value.toLocaleString()}{suffix}
      </p>
      <p className="text-sm text-[#7cc4d8]">{label}</p>
    </div>
  );
};

export default CounterCard;