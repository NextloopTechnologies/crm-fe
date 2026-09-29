import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Loader2, TrendingDown, TrendingUp } from 'lucide-react'
import SelectDropdown from '@/components/common/SelectDropdown'
import { useCurrentRole } from '@/hooks/useCurrentRole'
import {
  getHrDashboard,
  getSalesDashboard,
  getStaffingMembers,
  getStandup,
} from '@/api/staffing.api'
import { isHr, PERIOD_OPTIONS, STAGE_LABEL } from '@/constants/Staffing'
import type {
  DashboardPeriod,
  KpiScore,
  StaffingDashboard,
  Standup,
  SubmissionStage,
} from '@/types/staffing.types'

const VIEW_OPTIONS = [
  { label: 'HR', value: 'HR' },
  { label: 'Sales', value: 'SALES' },
]

export default function StaffingDashboardPage() {
  const role = useCurrentRole()

  // HR has no business defaulting into the Sales view, and Sales reads its own.
  const [view, setView] = useState<'HR' | 'SALES'>(isHr(role) ? 'HR' : 'SALES')
  const [period, setPeriod] = useState<DashboardPeriod>('WEEKLY')
  // Radix refuses an empty-string option value — it reserves that for
  // "cleared" — so the whole-team choice carries a sentinel and is translated
  // back to an absent parameter at the API boundary.
  const ALL_MEMBERS = '__ALL__'

  // Only the scorecard narrows to one person; the pipeline and outcome panels
  // stay team-wide, because a single recruiter's slice of them is rarely the
  // question being asked.
  const [member, setMember] = useState(ALL_MEMBERS)
  const scopedMember = member === ALL_MEMBERS ? '' : member

  const { data: memberData } = useQuery({
    queryKey: ['staffing-members'],
    queryFn: getStaffingMembers,
  })

  const memberOptions = useMemo(() => {
    const names: string[] = Array.isArray(memberData?.data) ? memberData.data : []
    return [{ label: 'Whole team', value: ALL_MEMBERS }, ...names.map((n) => ({ label: n, value: n }))]
  }, [memberData, ALL_MEMBERS])

  const { data, isLoading } = useQuery({
    queryKey: ['staffing-dashboard', view, period, scopedMember],
    queryFn: () =>
      view === 'HR'
        ? getHrDashboard(period, undefined, scopedMember || undefined)
        : getSalesDashboard(period, undefined, scopedMember || undefined),
  })

  const { data: standupData } = useQuery({
    queryKey: ['staffing-standup'],
    queryFn: () => getStandup(),
  })

  const dashboard: StaffingDashboard | undefined = data?.data
  const standup: Standup | undefined = standupData?.data

  const pipeline = useMemo(() => {
    const entries = Object.entries(dashboard?.pipelineByStage ?? {})
    const max = Math.max(1, ...entries.map(([, v]) => v))
    return entries
      .sort((a, b) => b[1] - a[1])
      .map(([stage, count]) => ({ stage, count, pct: Math.round((count / max) * 100) }))
  }, [dashboard])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px] bg-white rounded-xl">
        <Loader2 className="animate-spin text-[#5752FE]" />
      </div>
    )
  }

  return (
    <div className="bg-white min-h-screen rounded-xl p-4">
      <div className="flex items-start justify-between gap-4 flex-wrap mb-4">
        <div>
          <h1 className="text-lg font-semibold text-gray-900">Staffing Dashboard</h1>
          <p className="text-xs text-gray-500">
            {dashboard ? `${dashboard.from?.slice(0, 10)} → ${dashboard.to?.slice(0, 10)}` : ''}
          </p>
        </div>
        <div className="flex items-end gap-2">
          <div className="w-[130px]">
            <SelectDropdown
              placeholder="View"
              options={VIEW_OPTIONS}
              value={view}
              onChange={(v) => setView(v as 'HR' | 'SALES')}
            />
          </div>
          <div className="w-[150px]">
            <SelectDropdown
              placeholder="Period"
              options={PERIOD_OPTIONS}
              value={period}
              onChange={(v) => setPeriod(v as DashboardPeriod)}
            />
          </div>
          <div className="w-[170px]">
            <SelectDropdown
              placeholder="Whole team"
              options={memberOptions}
              value={member}
              onChange={setMember}
            />
          </div>
        </div>
      </div>

      {/* ── Headline numbers ── */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
        {(dashboard?.kpis ?? []).map((kpi) => {
          const up = (kpi.delta ?? 0) > 0
          const flat = (kpi.delta ?? 0) === 0
          return (
            <div key={kpi.key} className="border border-[#E0E0E0] rounded-xl p-3">
              <p className="text-[11px] text-slate-500">{kpi.label}</p>
              <p className="text-2xl font-semibold text-slate-900">{kpi.value}</p>
              {kpi.delta != null && (
                <p
                  className={`text-[11px] flex items-center gap-1 ${
                    flat ? 'text-slate-400' : up ? 'text-emerald-600' : 'text-rose-500'
                  }`}
                >
                  {!flat && (up ? <TrendingUp size={12} /> : <TrendingDown size={12} />)}
                  {up ? '+' : ''}
                  {kpi.delta} vs previous
                </p>
              )}
            </div>
          )
        })}
      </div>

      {/* ── KPI scorecard ── */}
      <section className="mb-6">
        <div className="flex items-baseline justify-between mb-2">
          <h2 className="text-sm font-semibold text-slate-800">Targets</h2>
          <span className="text-xs text-slate-500">
            {scopedMember ? `${scopedMember} only` : 'Whole team'}
          </span>
        </div>
        <div className="border border-[#E0E0E0] rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-[#FAFAFB] text-slate-500">
              <tr>
                <th className="text-left font-medium px-3 py-2">KPI</th>
                <th className="text-left font-medium px-3 py-2">Actual</th>
                <th className="text-left font-medium px-3 py-2">Target</th>
                <th className="text-left font-medium px-3 py-2 w-[180px]">Attainment</th>
              </tr>
            </thead>
            <tbody>
              {(dashboard?.scorecard ?? []).map((kpi: KpiScore) => (
                <tr key={kpi.key} className="border-t border-[#ECECEC]">
                  <td className="px-3 py-2 text-slate-700">{kpi.label}</td>
                  <td className="px-3 py-2 font-semibold text-slate-900">
                    {kpi.actual ?? <span className="text-slate-300">—</span>}
                  </td>
                  <td className="px-3 py-2 text-slate-500">
                    {kpi.comparator === 'GT' ? '>' : '<'} {kpi.target} {kpi.unit}
                  </td>
                  <td className="px-3 py-2">
                    {kpi.attainment == null ? (
                      <span className="text-slate-300">
                        {scopedMember && kpi.key === 'TIME_TO_FIRST_PROFILE_HOURS'
                          ? 'team only'
                          : 'no data'}
                      </span>
                    ) : (
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 flex-1 rounded-pill bg-slate-100 overflow-hidden">
                          <div
                            className={`h-full rounded-pill ${kpi.met ? 'bg-emerald-500' : 'bg-amber-400'}`}
                            // Capped at 100% so a KPI at 300% does not run off
                            // the row; the number beside it carries the truth.
                            style={{ width: `${Math.min(100, kpi.attainment)}%` }}
                          />
                        </div>
                        <span
                          className={`text-xs font-semibold ${
                            kpi.met ? 'text-emerald-600' : 'text-amber-600'
                          }`}
                        >
                          {kpi.attainment}%
                        </span>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* ── Pipeline ── */}
        <section className="border border-[#E0E0E0] rounded-lg p-3">
          <h2 className="text-sm font-semibold text-slate-800 mb-3">Pipeline right now</h2>
          {pipeline.length === 0 && <p className="text-xs text-slate-400">Nothing in the pipeline.</p>}
          <div className="flex flex-col gap-2">
            {pipeline.map((row) => (
              <div key={row.stage} className="flex items-center gap-2">
                <span className="text-xs text-slate-600 w-[120px] shrink-0">
                  {STAGE_LABEL[row.stage as SubmissionStage] ?? row.stage}
                </span>
                <div className="h-2 flex-1 rounded-pill bg-slate-100 overflow-hidden">
                  <div className="h-full rounded-pill bg-[#5752FE]" style={{ width: `${row.pct}%` }} />
                </div>
                <span className="text-xs font-semibold text-slate-700 w-[26px] text-right">
                  {row.count}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* ── Where it leaks ── */}
        <section className="border border-[#E0E0E0] rounded-lg p-3">
          <h2 className="text-sm font-semibold text-slate-800 mb-3">Where submissions close</h2>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-[11px] text-slate-500 mb-1">Outcomes</p>
              {Object.entries(dashboard?.outcomes ?? {}).length === 0 && (
                <p className="text-xs text-slate-400">—</p>
              )}
              {Object.entries(dashboard?.outcomes ?? {}).map(([k, v]) => (
                <div key={k} className="flex justify-between text-xs py-0.5">
                  <span className="text-slate-600">{k.replace('_', ' ')}</span>
                  <span className="font-semibold text-slate-800">{v}</span>
                </div>
              ))}
            </div>
            <div>
              <p className="text-[11px] text-slate-500 mb-1">Rejected at</p>
              {Object.entries(dashboard?.rejectionsByStage ?? {}).length === 0 && (
                <p className="text-xs text-slate-400">—</p>
              )}
              {Object.entries(dashboard?.rejectionsByStage ?? {}).map(([k, v]) => (
                <div key={k} className="flex justify-between text-xs py-0.5">
                  <span className="text-slate-600">
                    {STAGE_LABEL[k as SubmissionStage] ?? k}
                  </span>
                  <span className="font-semibold text-rose-600">{v}</span>
                </div>
              ))}
            </div>
          </div>

          {dashboard?.margin != null && (
            <div className="border-t border-[#ECECEC] mt-3 pt-3">
              <p className="text-[11px] text-slate-500">Margin from placements this period</p>
              <p className="text-xl font-semibold text-emerald-600">{dashboard.margin}</p>
            </div>
          )}
        </section>
      </div>

      {/* ── Standup ── */}
      <section className="border border-[#E0E0E0] rounded-lg p-3 mt-4">
        <h2 className="text-sm font-semibold text-slate-800">Today's standup</h2>
        <p className="text-xs text-slate-500 mb-3">
          {standup
            ? `${standup.date} · ${standup.totalMoves} moves by ${standup.peopleActive} people`
            : 'Loading...'}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-[11px] font-semibold text-slate-600 mb-1">By person</p>
            {(standup?.people ?? []).length === 0 && (
              <p className="text-xs text-slate-400">Nothing moved today.</p>
            )}
            {(standup?.people ?? []).map((person) => (
              <div key={person.username} className="mb-2">
                <p className="text-xs font-medium text-slate-700">
                  {person.username} · {person.moves} moves
                </p>
                <ul className="text-[11px] text-slate-500 list-disc pl-4">
                  {person.highlights.slice(0, 4).map((h, i) => (
                    <li key={i}>{h}</li>
                  ))}
                  {person.highlights.length > 4 && (
                    <li className="text-slate-400">+{person.highlights.length - 4} more</li>
                  )}
                </ul>
              </div>
            ))}
          </div>

          <div>
            <p className="text-[11px] font-semibold text-slate-600 mb-1">By requirement</p>
            {(standup?.requirements ?? []).length === 0 && (
              <p className="text-xs text-slate-400">No requirement activity today.</p>
            )}
            {(standup?.requirements ?? []).map((req) => (
              <div key={req.requirementNumber} className="mb-2">
                <p className="text-xs font-medium text-slate-700">{req.jobTitle}</p>
                <p className="text-[11px] text-slate-500">
                  {req.moves} moves · {req.activeMinutes} min span ·{' '}
                  {req.candidatesTouched.length} candidates
                </p>
              </div>
            ))}
            <p className="text-[10px] text-slate-400 mt-2">
              Span is the time between the first and last action, not hours worked.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
