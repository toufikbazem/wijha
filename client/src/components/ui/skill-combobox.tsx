import * as React from "react";
import { Award } from "lucide-react";
import { cn } from "@/lib/utils";
import competencesData from "@/utils/competences.json";

interface CompetenceEntry {
  id: string;
  lang: string;
  label: string;
}

const competences = competencesData as CompetenceEntry[];

/** Strip Latin accents and lowercase */
function normalize(str: string): string {
  return str.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();
}

interface IndexedCompetence {
  entry: CompetenceEntry;
  norm: string;
}

const indexedCompetences: IndexedCompetence[] = competences.map((entry) => ({
  entry,
  norm: normalize(entry.label),
}));

/**
 * Search priority (highest score first):
 *   4 = exact match
 *   3 = prefix match
 *   2 = word-boundary match (token starts with q)
 *   1 = substring match
 */
function scoreEntry(c: IndexedCompetence, q: string): number {
  if (c.norm === q) return 4;
  if (c.norm.startsWith(q)) return 3;
  // word-boundary: any whitespace-separated token starts with q
  for (const token of c.norm.split(/\s+/)) {
    if (token.startsWith(q)) return 2;
  }
  if (c.norm.includes(q)) return 1;
  return 0;
}

function searchCompetences(query: string, max = 8): CompetenceEntry[] {
  const q = normalize(query);
  if (!q) return [];

  const matched: { entry: CompetenceEntry; score: number }[] = [];
  for (const c of indexedCompetences) {
    const score = scoreEntry(c, q);
    if (score > 0) matched.push({ entry: c.entry, score });
    // Early exit: if we already have many top-tier matches, stop scanning
    if (matched.length > max * 8) break;
  }
  matched.sort(
    (a, b) => b.score - a.score || a.entry.label.length - b.entry.label.length,
  );
  return matched.slice(0, max).map((m) => m.entry);
}

interface SkillComboboxProps {
  /** Current draft text */
  value: string;
  onChange: (val: string) => void;
  /** Called when user picks a suggestion (mouse click or Enter on highlighted item) */
  onSelect?: (label: string) => void;
  /** Called when user presses Enter with no suggestion highlighted (fallback to "add free-text") */
  onPlainEnter?: () => void;
  placeholder?: string;
  className?: string;
}

export function SkillCombobox({
  value,
  onChange,
  onSelect,
  onPlainEnter,
  placeholder,
  className,
}: SkillComboboxProps) {
  const [suggestions, setSuggestions] = React.useState<CompetenceEntry[]>([]);
  const [open, setOpen] = React.useState(false);
  const [activeIndex, setActiveIndex] = React.useState(-1);
  const debounceRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  const runSearch = (raw: string) => {
    if (raw.trim().length < 2) {
      setSuggestions([]);
      setOpen(false);
      setActiveIndex(-1);
      return;
    }
    const results = searchCompetences(raw);
    setSuggestions(results);
    setOpen(results.length > 0);
    setActiveIndex(-1);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    onChange(raw);

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => runSearch(raw), 200);
  };

  const pick = (entry: CompetenceEntry) => {
    onChange(entry.label);
    onSelect?.(entry.label);
    setSuggestions([]);
    setOpen(false);
    setActiveIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (open && suggestions.length > 0) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((i) => (i + 1) % suggestions.length);
        return;
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((i) => (i <= 0 ? suggestions.length - 1 : i - 1));
        return;
      }
      if (e.key === "Escape") {
        setOpen(false);
        setActiveIndex(-1);
        return;
      }
      if (e.key === "Enter") {
        if (activeIndex >= 0) {
          e.preventDefault();
          pick(suggestions[activeIndex]);
          return;
        }
        // No highlight → close dropdown and let parent handle Enter as "add"
        setOpen(false);
        e.preventDefault();
        onPlainEnter?.();
        return;
      }
    } else if (e.key === "Enter") {
      e.preventDefault();
      onPlainEnter?.();
    }
  };

  const handleBlur = () => {
    setTimeout(() => setOpen(false), 150);
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <input
        type="text"
        value={value}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onFocus={() => {
          if (value && value.trim().length >= 2) runSearch(value);
        }}
        onBlur={handleBlur}
        aria-autocomplete="list"
        aria-expanded={open}
        placeholder={placeholder}
        className={cn("input-filter ltr:pl-3! rtl:pr-3!", className)}
        autoComplete="off"
      />

      {open && suggestions.length > 0 && (
        <ul
          role="listbox"
          className="absolute z-50 mt-1 w-full rounded-lg border border-border bg-popover text-popover-foreground shadow-md overflow-hidden max-h-72 overflow-y-auto"
        >
          {suggestions.map((s, idx) => (
            <li
              key={s.id}
              role="option"
              aria-selected={idx === activeIndex}
              onMouseDown={(e) => {
                e.preventDefault();
                pick(s);
              }}
              onMouseEnter={() => setActiveIndex(idx)}
              className={cn(
                "flex items-center gap-2 px-3 py-2 text-sm cursor-pointer select-none",
                "hover:bg-accent hover:text-accent-foreground",
                idx === activeIndex && "bg-accent text-accent-foreground",
              )}
            >
              <Award className="w-3.5 h-3.5 shrink-0 text-muted-foreground" />
              <span className="flex-1 truncate">{s.label}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
