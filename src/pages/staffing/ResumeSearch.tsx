import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { FileText, Loader2, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { showToast } from '@/components/common/Toast'
import { ROUTES } from '@/lib/route'
import { openDocument, searchResumes } from '@/api/staffing.api'
import { BENCH_CHIP, NEUTRAL_CHIP } from '@/constants/Staffing'
import { apiErrorMessage, type ResumeSearchHit } from '@/types/staffing.types'

/**
 * Renders a server snippet, highlighting the matched terms.
 *
 * The server wraps hits in << >> rather than HTML, so this builds elements
 * instead of setting innerHTML — a resume is user-supplied content and must
 * never be injected into the page as markup.
 */
function Snippet({ text }: { text?: string }) {
  if (!text) return null

  const parts = text.split(/(<<[^>]*>>)/g)

  return (
    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
      {parts.map((part, i) =>
        part.startsWith('<<') && part.endsWith('>>') ? (
          <mark key={i} className="bg-amber-100 text-amber-900 rounded px-0.5">
            {part.slice(2, -2)}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </p>
  )
}

export default function ResumeSearch() {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [hits, setHits] = useState<ResumeSearchHit[] | null>(null)

  const search = useMutation({
    mutationFn: (q: string) => searchResumes(q),
    onSuccess: (res) => {
      if (res?.status === 'Success' || res?.code === '0x0200') {
        setHits(Array.isArray(res.data) ? res.data : [])
      } else {
        showToast({ title: 'Search failed', description: res?.description ?? '', type: 'error' })
      }
    },
    onError: (err: unknown) =>
      showToast({ title: 'Search failed', description: apiErrorMessage(err), type: 'error' }),
  })

  const open = useMutation({
    mutationFn: (documentNumber: string) => openDocument(documentNumber),
    onError: (err: unknown) =>
      showToast({ title: 'Could not open the file', description: apiErrorMessage(err), type: 'error' }),
  })

  const run = () => {
    const q = query.trim()
    if (!q) return
    search.mutate(q)
  }

  return (
    <section className="border border-[#E0E0E0] rounded-xl p-4 mb-4">
      <div className="flex items-start justify-between gap-3 flex-wrap mb-3">
        <div>
          <h2 className="text-sm font-semibold text-slate-800">Search resumes</h2>
          <p className="text-xs text-slate-500">
            Searches inside the CVs themselves. Try <code>Kafka</code>,{' '}
            <code>"spring boot"</code>, or <code>java -react</code> to exclude a term.
          </p>
        </div>
      </div>

      <div className="flex gap-2">
        <Input
          placeholder="e.g. Kafka Bengaluru"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          // Enter is what anyone types in a search box; requiring the button
          // would be a small, constant annoyance.
          onKeyDown={(e) => e.key === 'Enter' && run()}
        />
        <Button
          className="bg-[#5752FE] hover:bg-[#4a45e0] text-white gap-1 shrink-0"
          disabled={search.isPending || query.trim() === ''}
          onClick={run}
        >
          {search.isPending ? <Loader2 size={14} className="animate-spin" /> : <Search size={14} />}
          Search
        </Button>
        {hits !== null && (
          <Button
            variant="outline"
            className="shrink-0"
            onClick={() => {
              setHits(null)
              setQuery('')
            }}
          >
            Clear
          </Button>
        )}
      </div>

      {hits !== null && (
        <div className="mt-3">
          <p className="text-xs text-slate-500 mb-2">
            {hits.length === 0
              ? 'Nobody in the pool matches that.'
              : `${hits.length} candidate${hits.length === 1 ? '' : 's'} matched.`}
          </p>

          <div className="flex flex-col gap-2">
            {hits.map((hit) => {
              const chip = hit.benchStatus ? BENCH_CHIP[hit.benchStatus] ?? NEUTRAL_CHIP : null
              return (
                <div
                  key={hit.candidateNumber}
                  className="border border-[#ECECEC] rounded-lg p-3 hover:border-[#5752FE] transition-colors"
                >
                  <div className="flex items-center gap-2 flex-wrap">
                    <button
                      type="button"
                      className="text-sm font-semibold text-slate-800 hover:text-[#5752FE] hover:underline"
                      onClick={() => navigate(ROUTES.STAFFING_CANDIDATE_EDIT(hit.candidateNumber))}
                    >
                      {hit.fullName}
                    </button>

                    {hit.totalExperienceYears != null && (
                      <span className="text-xs text-slate-500">{hit.totalExperienceYears} yrs</span>
                    )}
                    {hit.currentLocation && (
                      <span className="text-xs text-slate-500">· {hit.currentLocation}</span>
                    )}
                    {chip && (
                      <span
                        className={`px-2 py-0.5 rounded-pill text-[10px] font-semibold ${chip.bg} ${chip.text}`}
                      >
                        {hit.benchStatus?.replace('_', ' ')}
                      </span>
                    )}

                    <button
                      type="button"
                      onClick={() => open.mutate(hit.documentNumber)}
                      className="ml-auto inline-flex items-center gap-1 text-xs font-medium text-[#5752FE] hover:underline"
                    >
                      <FileText size={12} /> {hit.fileName}
                    </button>
                  </div>

                  <Snippet text={hit.snippet} />
                </div>
              )
            })}
          </div>
        </div>
      )}
    </section>
  )
}
