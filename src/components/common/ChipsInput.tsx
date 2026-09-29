import { useRef, useState } from 'react'
import { X } from 'lucide-react'
import { Label } from '@/components/ui/label'
import { Input as BaseInput } from '@/components/ui/input'
import { cn } from '@/lib/utils'

interface ChipsInputProps {
  id: string
  label?: string
  placeholder?: string
  /** Current values. Order is preserved as given. */
  value: string[]
  onChange: (next: string[]) => void
  /** Rejects a candidate before it becomes a chip. Return a message, or null. */
  validate?: (candidate: string) => string | null
  /** Refuses further additions once reached. */
  max?: number
  /** Server-side error for the whole field. */
  error?: string
  helpText?: string
}

/**
 * A list of short free-text values entered one at a time.
 *
 * Enter and comma both commit the current text, because people type city lists
 * with commas without thinking about it. Backspace on an empty box removes the
 * last chip, which is what every other tag input does.
 *
 * Duplicates are dropped silently rather than shown as an error: the backend
 * collapses them case-insensitively anyway, and an error for typing a city you
 * already added reads as a bug rather than a correction.
 */
export function ChipsInput({
  id,
  label,
  placeholder,
  value,
  onChange,
  validate,
  max,
  error,
  helpText,
}: ChipsInputProps) {
  const [draft, setDraft] = useState('')
  const [localError, setLocalError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const commit = (raw: string) => {
    const candidate = raw.trim().replace(/\s+/g, ' ')
    if (!candidate) return

    if (max !== undefined && value.length >= max) {
      setLocalError(`You can add at most ${max}.`)
      return
    }

    const message = validate?.(candidate)
    if (message) {
      setLocalError(message)
      return
    }

    // Case-insensitive, matching the backend's unique index.
    const exists = value.some((v) => v.toLowerCase() === candidate.toLowerCase())
    if (!exists) onChange([...value, candidate])

    setDraft('')
    setLocalError(null)
  }

  const remove = (index: number) => {
    onChange(value.filter((_, i) => i !== index))
    setLocalError(null)
  }

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      // Enter would otherwise submit the surrounding form with a half-typed
      // city still sitting in the box, silently losing it.
      e.preventDefault()
      commit(draft)
      return
    }
    if (e.key === 'Backspace' && draft === '' && value.length > 0) {
      remove(value.length - 1)
    }
  }

  const shown = error ?? localError

  return (
    <div className="col-span-full flex flex-col gap-2">
      {label && (
        <Label htmlFor={id} className="text-sm font-medium text-[#111127]">
          {label}
        </Label>
      )}

      <div
        onClick={() => inputRef.current?.focus()}
        className={cn(
          'flex min-h-10 w-full flex-wrap items-center gap-2 rounded-[10px] border-[1.5px] px-2 py-1.5',
          'border-[#e4e4ee] focus-within:border-[#5b5bd6]',
          'focus-within:ring-2 focus-within:ring-[rgba(91,91,214,0.12)]',
          shown && 'border-red-500',
        )}
      >
        {value.map((city, i) => (
          <span
            key={`${city}-${i}`}
            className="inline-flex items-center gap-1 rounded-pill bg-[#ebebff] px-2.5 py-1 text-[0.8125rem] font-medium text-[#5b5bd6]"
          >
            {city}
            <button
              type="button"
              aria-label={`Remove ${city}`}
              onClick={(e) => {
                e.stopPropagation()
                remove(i)
              }}
              className="rounded-full p-0.5 hover:bg-[#d9d9ff]"
            >
              <X size={12} />
            </button>
          </span>
        ))}

        <BaseInput
          ref={inputRef}
          id={id}
          value={draft}
          placeholder={value.length === 0 ? placeholder : ''}
          onChange={(e) => {
            setDraft(e.target.value)
            setLocalError(null)
          }}
          onKeyDown={onKeyDown}
          // Committing on blur too, so clicking Save with text still in the box
          // does not quietly drop it.
          onBlur={() => commit(draft)}
          className={cn(
            'h-7 flex-1 min-w-[10rem] border-0 bg-transparent px-1 text-[0.9375rem] shadow-none',
            'text-[#111127] placeholder:text-[#9898b3]',
            'focus-visible:ring-0 focus-visible:ring-offset-0',
          )}
        />
      </div>

      {shown ? (
        <p className="text-[0.8125rem] font-medium text-red-500">{shown}</p>
      ) : (
        helpText && <p className="text-[0.8125rem] text-[#6b6b8a]">{helpText}</p>
      )}
    </div>
  )
}

export default ChipsInput
