import * as React from "react"
import { useTranslation } from "react-i18next"
import { MapPin } from "lucide-react"
import { cn } from "@/lib/utils"
import addressData from "@/utils/address.json"

interface AddressEntry {
  label: string
  labelAr: string
  labelLower: string
  labelArLower: string
  communeFr: string
  communeAr: string
  wilayaFr: string
  wilayaAr: string
}

const addresses = addressData as AddressEntry[]

/** Strip Arabic diacritics and normalize common letter variants */
function normalizeAr(str: string): string {
  return str
    .replace(/[\u064B-\u065F]/g, "")
    .replace(/[أإآ]/g, "ا")
    .replace(/ة/g, "ه")
    .replace(/ى/g, "ي")
}

function filterAddresses(query: string): AddressEntry[] {
  const qLower = query.toLowerCase()
  const qArNorm = normalizeAr(query)
  const results: AddressEntry[] = []
  for (let i = 0; i < addresses.length; i++) {
    const entry = addresses[i]
    if (
      entry.labelLower.includes(qLower) ||
      normalizeAr(entry.labelArLower).includes(qArNorm)
    ) {
      results.push(entry)
      if (results.length === 5) break
    }
  }
  return results
}

interface AddressComboboxProps {
  /** Stored value — always the French label (e.g. "Chéraga, Alger") */
  value?: string
  onChange: (frenchValue: string) => void
  invalid?: boolean
  /**
   * "default" → uses .input classes (registration / job post forms)
   * "filter"  → uses .input-filter classes (profile search drawer)
   */
  variant?: "default" | "filter"
  className?: string
}

export function AddressCombobox({
  value,
  onChange,
  invalid,
  variant = "default",
  className,
}: AddressComboboxProps) {
  const { i18n, t } = useTranslation("common")
  const isArabic = i18n.language === "ar"

  const [inputValue, setInputValue] = React.useState("")
  const [suggestions, setSuggestions] = React.useState<AddressEntry[]>([])
  const [open, setOpen] = React.useState(false)
  const debounceRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)
  const containerRef = React.useRef<HTMLDivElement>(null)

  /** Resolve display text from a stored French value */
  const toDisplay = React.useCallback(
    (frenchVal: string) => {
      if (!frenchVal) return ""
      const entry = addresses.find((a) => a.label === frenchVal)
      return entry ? (isArabic ? entry.labelAr : entry.label) : frenchVal
    },
    [isArabic],
  )

  // Sync display text when value prop or language changes
  React.useEffect(() => {
    setInputValue(toDisplay(value ?? ""))
  }, [value, isArabic]) // eslint-disable-line react-hooks/exhaustive-deps

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value
    setInputValue(raw)

    if (debounceRef.current) clearTimeout(debounceRef.current)

    if (raw.length < 3) {
      setSuggestions([])
      setOpen(false)
      return
    }

    debounceRef.current = setTimeout(() => {
      const results = filterAddresses(raw)
      setSuggestions(results)
      setOpen(results.length > 0)
    }, 300)
  }

  const handleSelect = (entry: AddressEntry) => {
    onChange(entry.label) // store French
    setInputValue(isArabic ? entry.labelAr : entry.label)
    setSuggestions([])
    setOpen(false)
  }

  const handleBlur = () => {
    // Revert display to the last valid stored value
    setInputValue(toDisplay(value ?? ""))
    // Delay closing so item mousedown fires first
    setTimeout(() => setOpen(false), 150)
  }

  const isFilter = variant === "filter"
  const iconClass = isFilter ? "input-icon-filter h-4 w-4" : "input-icon"
  const inputClass = isFilter
    ? cn("input-filter", className)
    : cn("input", className)

  return (
    <div ref={containerRef} className="relative w-full">
      <MapPin className={iconClass} size={isFilter ? 16 : 20} />
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onBlur={handleBlur}
        aria-invalid={invalid}
        aria-autocomplete="list"
        aria-expanded={open}
        placeholder={t("addressPlaceholder")}
        className={inputClass}
        autoComplete="off"
      />

      {open && suggestions.length > 0 && (
        <ul
          role="listbox"
          className="absolute z-50 mt-1 w-full rounded-lg border border-border bg-popover text-popover-foreground shadow-md overflow-hidden"
        >
          {suggestions.map((entry) => (
            <li
              key={entry.label}
              role="option"
              aria-selected={value === entry.label}
              onMouseDown={(e) => {
                e.preventDefault() // prevent blur before click
                handleSelect(entry)
              }}
              className={cn(
                "flex items-center gap-2 px-3 py-2 text-sm cursor-pointer select-none",
                "hover:bg-accent hover:text-accent-foreground",
                value === entry.label && "bg-accent/50",
              )}
            >
              <MapPin className="w-3.5 h-3.5 shrink-0 text-muted-foreground" />
              <span>{isArabic ? entry.labelAr : entry.label}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
