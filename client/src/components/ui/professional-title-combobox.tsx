import * as React from "react"
import { IdCard } from "lucide-react"
import { cn } from "@/lib/utils"
import titlesData from "@/utils/professional_titles.json"

interface TitleEntry {
  id: number
  fr: string
  en: string
  ar: string
  alt: string[]
}

const titles = titlesData as TitleEntry[]

/** Strip Arabic diacritics and normalize common letter variants */
function normalizeAr(str: string): string {
  return str
    .replace(/[ً-ٟ]/g, "")
    .replace(/[أإآ]/g, "ا")
    .replace(/ة/g, "ه")
    .replace(/ى/g, "ي")
}

/** Strip Latin accents and lowercase */
function normalizeLatin(str: string): string {
  return str
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
}

function normalize(str: string): string {
  return normalizeAr(normalizeLatin(str))
}

type Lang = "fr" | "en" | "ar"

/** Tag a normalized token with the language it came from */
interface Tagged {
  norm: string
  lang: Lang
}

/** Precomputed normalized lookup tables — built once at module load */
interface IndexedTitle {
  entry: TitleEntry
  primaries: Tagged[] // normalized fr, en, ar (each tagged with its lang)
  alts: Tagged[] // normalized alt[] (each tagged by detected script)
}

/** Detect the dominant script of a string */
function detectLang(str: string): Lang {
  // Arabic block U+0600..U+06FF
  if (/[؀-ۿ]/.test(str)) return "ar"
  // Heuristic: fr-only chars (accents) → fr, otherwise en
  // (alt entries are messy, so we just split ar vs latin and let "en" be the latin default)
  return "en"
}

const indexedTitles: IndexedTitle[] = titles.map((entry) => ({
  entry,
  primaries: [
    { norm: normalize(entry.fr), lang: "fr" },
    { norm: normalize(entry.en), lang: "en" },
    { norm: normalize(entry.ar), lang: "ar" },
  ],
  alts: entry.alt.map((a) => ({ norm: normalize(a), lang: detectLang(a) })),
}))

/**
 * Search priority (highest score first):
 *   5 = exact match on fr/en/ar
 *   4 = prefix match on fr/en/ar
 *   3 = prefix match on any alt[]
 *   2 = substring match on fr/en/ar
 *   1 = substring match on any alt[]
 *
 * Also returns the language of the matching token, so we can display
 * the suggestion in the same language the user typed in.
 */
interface ScoreResult {
  score: number
  matchLang: Lang | null
}

function scoreEntry(t: IndexedTitle, q: string, queryLang: Lang): ScoreResult {
  // Prefer matches in the same language as the query
  const langBonus = (l: Lang) => (l === queryLang ? 0.5 : 0)

  let best: ScoreResult = { score: 0, matchLang: null }
  const consider = (score: number, lang: Lang) => {
    const adjusted = score + langBonus(lang)
    if (adjusted > best.score) best = { score: adjusted, matchLang: lang }
  }

  for (const p of t.primaries) {
    if (p.norm === q) consider(5, p.lang)
  }
  for (const p of t.primaries) {
    if (p.norm.startsWith(q)) consider(4, p.lang)
  }
  for (const a of t.alts) {
    if (a.norm.startsWith(q)) consider(3, a.lang)
  }
  for (const p of t.primaries) {
    if (p.norm.includes(q)) consider(2, p.lang)
  }
  for (const a of t.alts) {
    if (a.norm.includes(q)) consider(1, a.lang)
  }
  return best
}

interface Suggestion {
  entry: TitleEntry
  /** Language to render this suggestion in */
  lang: Lang
}

function searchTitles(query: string, max = 8): Suggestion[] {
  const q = normalize(query)
  if (!q) return []
  const queryLang = detectLang(query)

  const matched: { entry: TitleEntry; score: number }[] = []
  for (const t of indexedTitles) {
    const { score } = scoreEntry(t, q, queryLang)
    if (score > 0) matched.push({ entry: t.entry, score })
  }
  matched.sort((a, b) => b.score - a.score)

  // Expand each entry into one row per display language.
  // Arabic query → just the Arabic form.
  // Latin query  → both French and English forms (dedup if identical).
  const out: Suggestion[] = []
  const seen = new Set<string>()
  for (const m of matched) {
    const langs: Lang[] = queryLang === "ar" ? ["ar"] : ["fr", "en"]
    for (const lang of langs) {
      const label = m.entry[lang]
      if (!label) continue
      const key = `${lang}:${label.toLowerCase()}`
      if (seen.has(key)) continue
      seen.add(key)
      out.push({ entry: m.entry, lang })
      if (out.length >= max) return out
    }
  }
  return out
}

interface ProfessionalTitleComboboxProps {
  /** Stored free-text value (whatever the user typed or selected) */
  value?: string
  onChange: (val: string) => void
  invalid?: boolean
  placeholder?: string
  /**
   * "default" → uses .input classes (registration form)
   * "filter"  → uses .input-filter classes (profile header / dashboard)
   */
  variant?: "default" | "filter"
  className?: string
}

export function ProfessionalTitleCombobox({
  value,
  onChange,
  invalid,
  placeholder,
  variant = "default",
  className,
}: ProfessionalTitleComboboxProps) {
  const [suggestions, setSuggestions] = React.useState<Suggestion[]>([])
  const [open, setOpen] = React.useState(false)
  const [activeIndex, setActiveIndex] = React.useState(-1)
  const debounceRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)
  const containerRef = React.useRef<HTMLDivElement>(null)

  // Close dropdown on outside click
  React.useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleOutside)
    return () => document.removeEventListener("mousedown", handleOutside)
  }, [])

  const runSearch = (raw: string) => {
    if (raw.trim().length < 3) {
      setSuggestions([])
      setOpen(false)
      setActiveIndex(-1)
      return
    }
    const results = searchTitles(raw)
    setSuggestions(results)
    setOpen(results.length > 0)
    setActiveIndex(-1)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value
    onChange(raw) // free-text: store exactly what the user types

    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => runSearch(raw), 250)
  }

  const handleSelect = (s: Suggestion) => {
    onChange(s.entry[s.lang])
    setSuggestions([])
    setOpen(false)
    setActiveIndex(-1)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open || suggestions.length === 0) return
    if (e.key === "ArrowDown") {
      e.preventDefault()
      setActiveIndex((i) => (i + 1) % suggestions.length)
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setActiveIndex((i) => (i <= 0 ? suggestions.length - 1 : i - 1))
    } else if (e.key === "Enter" && activeIndex >= 0) {
      e.preventDefault()
      handleSelect(suggestions[activeIndex])
    } else if (e.key === "Escape") {
      setOpen(false)
      setActiveIndex(-1)
    }
  }

  const handleBlur = () => {
    // Delay so onMouseDown on a list item can fire first
    setTimeout(() => setOpen(false), 150)
  }

  const isFilter = variant === "filter"
  const iconClass = isFilter ? "input-icon-filter h-4 w-4" : "input-icon"
  const inputClass = isFilter
    ? cn("input-filter", className)
    : cn("input", className)

  return (
    <div ref={containerRef} className="relative w-full">
      <IdCard className={iconClass} size={isFilter ? 16 : 20} />
      <input
        type="text"
        value={value ?? ""}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onFocus={() => {
          if (value && value.trim().length >= 3) runSearch(value)
        }}
        onBlur={handleBlur}
        aria-invalid={invalid}
        aria-autocomplete="list"
        aria-expanded={open}
        placeholder={placeholder}
        className={inputClass}
        autoComplete="off"
      />

      {open && suggestions.length > 0 && (
        <ul
          role="listbox"
          className="absolute z-50 mt-1 w-full rounded-lg border border-border bg-popover text-popover-foreground shadow-md overflow-hidden max-h-72 overflow-y-auto"
        >
          {suggestions.map((s, idx) => (
            <li
              key={`${s.entry.id}-${s.lang}`}
              role="option"
              aria-selected={idx === activeIndex}
              dir={s.lang === "ar" ? "rtl" : "ltr"}
              onMouseDown={(e) => {
                e.preventDefault()
                handleSelect(s)
              }}
              onMouseEnter={() => setActiveIndex(idx)}
              className={cn(
                "flex items-center gap-2 px-3 py-2 text-sm cursor-pointer select-none",
                "hover:bg-accent hover:text-accent-foreground",
                idx === activeIndex && "bg-accent text-accent-foreground",
              )}
            >
              <IdCard className="w-3.5 h-3.5 shrink-0 text-muted-foreground" />
              <span className="flex-1 truncate">{s.entry[s.lang]}</span>
              <span className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground shrink-0 px-1.5 py-0.5 rounded bg-muted">
                {s.lang}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
