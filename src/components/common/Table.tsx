// components/common/Table.tsx
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/common/Checkbox";
import { useState, useMemo, useEffect, useRef } from "react";
import {
  ChevronUp, ChevronDown, ChevronsUpDown,
  Search, ChevronLeft, ChevronRight,
  Pencil, Trash2, X
} from "lucide-react";
import { cn } from "@/lib/utils";
import { FilterIcon, SortingIcon } from "@/assets/icons/components/index";
import SelectDropdown from "@/components/common/SelectDropdown";
import { AlertPopupDialog } from "@/components/common/AlertDialog";

// ── Types ─────────────────────────────────────────────────────────────────────
export type ColumnDef<T> = {
  key: keyof T | string;
  label: string;
  sortable?: boolean;
  width?: string;
  render?: (value: unknown, row: T) => React.ReactNode;
};

export type RowAction<T> = {
  label: string;
  icon?: React.ReactNode;
  onClick: (row: T) => void;
  className?: string;
};

interface FilterConfig {
  key: string;
  label: string;
  type: "select" | "date";
  options?: { label: string; value: string }[];
}

interface DataTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  searchable?: boolean;
  searchPlaceholder?: string;
  selectable?: boolean;
  onSelectionChange?: (rows: T[]) => void;
  pageSize?: number;
  className?: string;
  emptyMessage?: string;
  loading?: boolean;
  onRowClick?: (row: T) => void;
  headerActions?: React.ReactNode;
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
  filters?: FilterConfig[];
}

type SortDir = "asc" | "desc" | null;
type FilterValues = Record<string, string>;

// ── Helpers ───────────────────────────────────────────────────────────────────
function getNestedValue<T>(obj: T, key: string): unknown {
  return key.split(".").reduce((acc: unknown, k) => {
    if (acc && typeof acc === "object") return (acc as Record<string, unknown>)[k];
    return undefined;
  }, obj);
}

// ── Add this new helper ──
function safeString(val: unknown): string {
  if (val === null || val === undefined) return "—";
  if (typeof val === "object") return "—"; // object/array/ReactNode — let render() handle it
  return String(val);
}
// ── Filter Dropdown ───────────────────────────────────────────────────────────
function FilterDropdown({
  filters,
  initialValues,
  onApply,
  onClose,
  triggerRef,
}: {
  filters: FilterConfig[];
  initialValues: FilterValues;
  onApply: (values: FilterValues) => void;
  onClose: () => void;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
}) {
  const [values, setValues] = useState<FilterValues>(initialValues);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const set = (key: string, val: string) =>
    setValues((prev) => ({ ...prev, [key]: val }));

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement;

      if (target.closest('[role="listbox"]') || target.closest('[role="option"]') || target.closest('[data-radix-popper-content-wrapper]')) {
        return;
      }

      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(target) &&
        triggerRef.current &&
        !triggerRef.current.contains(target)
      ) {
        onClose();
      }
    };

    const timer = setTimeout(() => {
      document.addEventListener("mousedown", handler);
    }, 150);

    return () => {
      clearTimeout(timer);
      document.removeEventListener("mousedown", handler);
    };
  }, [onClose, triggerRef]);
  return (
    <div
      ref={dropdownRef}
      className="absolute z-50 top-[calc(100%+8px)] left-0 bg-white rounded-2xl shadow-2xl border border-[#ECECEC] w-80 p-2"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-base font-semibold text-[#111127]">Filters</h2>
        <button
          onClick={onClose}
          className="h-5 w-7 flex items-center justify-center rounded-full hover:bg-[#f0f0f8] text-[#6b6b8d] transition-colors"
        >
          <X size={15} />
        </button>
      </div>

      {/* Fields */}
      <div className="flex flex-col gap-1">
        {filters.map((filter) => (
          <div key={filter.key} className="flex flex-col gap-1">
            <label className="text-xs text-[#111127]">
              {filter.label}
            </label>

            {filter.type === "select" && filter.options ? (
              <SelectDropdown
                placeholder={`Select ${filter.label.toLowerCase()}`}
                options={filter.options}
                value={values[filter.key] || ""}
                onChange={(val) => set(filter.key, val)}
              />
            ) : (
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9898b3] pointer-events-none">
                  <svg width="15" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                    <rect x="3" y="4" width="18" height="18" rx="2" />
                    <path d="M16 2v4M8 2v4M3 10h18" />
                  </svg>
                </span>
                <Input
                  type="date"
                  value={values[filter.key] || ""}
                  onChange={(e) => set(filter.key, e.target.value)}
                  className="h-8 pl-9 rounded-[10px] border-[#e4e4ee] text-sm text-[#6b6b8d] w-full"
                />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="flex items-center gap-3 mt-2">
        <Button
          variant="outline"
          className="flex-1 h-8 rounded-[10px] border-[#e4e4ee] text-[#6b6b8d] text-sm"
          onClick={() => { setValues({}); onApply({}); onClose(); }}
        >
          Cancel
        </Button>
        <Button
          className="flex-1 h-8 rounded-[10px] bg-[#5752FE] hover:bg-[#4a45e0] text-white text-sm font-medium"
          onClick={() => { onApply(values); onClose(); }}
        >
          Apply Filters
        </Button>
      </div>
    </div>
  );
}


// ── Sort Dropdown ─────────────────────────────────────────────────────────────
function SortDropdown<T>({
  columns,
  sortKey,
  sortDir,
  onApply,
  onClose,
  triggerRef,
}: {
  columns: ColumnDef<T>[];
  sortKey: string;
  sortDir: "asc" | "desc";
  onApply: (key: string, dir: "asc" | "desc") => void;
  onClose: () => void;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
}) {
  const [key, setKey] = useState(sortKey);
  const [dir, setDir] = useState<"asc" | "desc">(sortDir);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement;

      // ── Add these three guards (same as FilterDropdown) ──
      if (
        target.closest('[role="listbox"]') ||
        target.closest('[role="option"]') ||
        target.closest('[data-radix-popper-content-wrapper]')
      ) {
        return;
      }

      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(target) &&
        triggerRef.current &&
        !triggerRef.current.contains(target)
      ) {
        onClose();
      }
    };
    const timer = setTimeout(() => document.addEventListener("mousedown", handler), 150);
    return () => { clearTimeout(timer); document.removeEventListener("mousedown", handler); };
  }, [onClose, triggerRef]);

  const sortableColumns = columns.filter((c) => c.sortable !== false);


  return (
    <div
      ref={dropdownRef}
      className="absolute z-50 top-[calc(100%+8px)] left-0 bg-white rounded-2xl shadow-2xl border border-[#ECECEC] w-72 p-3"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold text-[#111127]">Sort by</h2>
        <button
          onClick={onClose}
          className="h-5 w-7 flex items-center justify-center rounded-full hover:bg-[#f0f0f8] text-[#6b6b8d] transition-colors"
        >
          <X size={15} />
        </button>
      </div>

      {/* Fields row */}
      <div className="flex gap-2 mb-3">
        {/* Field selector */}
        <div className="flex-1 flex flex-col gap-1">
          <label className="text-xs text-[#111127]">Field</label>
          <SelectDropdown
            placeholder="None"
            options={sortableColumns.map((col) => ({
              label: col.label,
              value: col.key as string,
            }))}
            value={key}
            onChange={(val) => setKey(val)}
          />
        </div>

        {/* Direction selector */}
        <div className="flex-1 flex flex-col gap-1">
          <label className="text-xs text-[#111127]">Order</label>
          <SelectDropdown
            placeholder="Select order"
            options={[
              { label: "Ascending", value: "asc" },
              { label: "Descending", value: "desc" },
            ]}
            value={dir}
            onChange={(val) => setDir(val as "asc" | "desc")}
          />
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          className="flex-1 h-8 rounded-[10px] border-[#e4e4ee] text-[#6b6b8d] text-sm"
          onClick={() => { onApply("", "asc"); onClose(); }}
        >
          Cancel
        </Button>
        <Button
          className="flex-1 h-8 rounded-[10px] bg-[#5752FE] hover:bg-[#4a45e0] text-white text-sm font-medium"
          onClick={() => { onApply(key, dir); onClose(); }}
        >
          Apply
        </Button>
      </div>
    </div>
  );
}


// ── Component ─────────────────────────────────────────────────────────────────
export function DataTable<T extends { id?: string | number }>({
  data,
  columns,
  searchable = true,
  searchPlaceholder = "Search...",
  selectable = false,
  onSelectionChange,
  pageSize = 10,
  className,
  emptyMessage = "No records found.",
  loading = false,
  onRowClick,
  headerActions,
  onEdit,
  onDelete,
  filters,
}: DataTableProps<T>) {
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>(null);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(pageSize);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState<FilterValues>({});
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const sortBtnRef = useRef<HTMLButtonElement>(null);
  const filterBtnRef = useRef<HTMLButtonElement>(null);
  const [deleteTarget, setDeleteTarget] = useState<T | null>(null);

  const activeFilterCount = Object.values(appliedFilters).filter(Boolean).length;

  // ── Filtering + Search ────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    let result = data;

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((row) =>
        columns.some((col) => {
          const val = getNestedValue(row, col.key as string);
          return String(val ?? "").toLowerCase().includes(q);
        })
      );
    }

    result = result.filter((row) =>
      Object.entries(appliedFilters).every(([key, value]) => {
        if (!value) return true;
        const val = getNestedValue(row, key);
        return String(val ?? "").toLowerCase().includes(value.toLowerCase());
      })
    );

    return result;
  }, [data, search, appliedFilters, columns]);

  // ── Sort ──────────────────────────────────────────────────────────────────
  const sorted = useMemo(() => {
    if (!sortKey || !sortDir) return filtered;
    return [...filtered].sort((a, b) => {
      const av = getNestedValue(a, sortKey);
      const bv = getNestedValue(b, sortKey);
      const cmp = String(av ?? "").localeCompare(String(bv ?? ""), undefined, { numeric: true });
      return sortDir === "asc" ? cmp : -cmp;
    });
  }, [filtered, sortKey, sortDir]);

  // ── Pagination ────────────────────────────────────────────────────────────
  const totalPages = Math.max(1, Math.ceil(sorted.length / perPage));
  const paginated = sorted.slice((page - 1) * perPage, page * perPage);

  const handleSort = (key: string) => {
    if (sortKey !== key) { setSortKey(key); setSortDir("asc"); }
    else if (sortDir === "asc") setSortDir("desc");
    else { setSortKey(null); setSortDir(null); }
  };

  // ── Selection ─────────────────────────────────────────────────────────────
  const allChecked = paginated.length > 0 && paginated.every((_, i) => selected.has((page - 1) * perPage + i));
  const toggleAll = () => {
    const next = new Set(selected);
    if (allChecked) paginated.forEach((_, i) => next.delete((page - 1) * perPage + i));
    else paginated.forEach((_, i) => next.add((page - 1) * perPage + i));
    setSelected(next);
    onSelectionChange?.(sorted.filter((_, i) => next.has(i)));
  };
  const toggleRow = (absIdx: number) => {
    const next = new Set(selected);
    next.has(absIdx) ? next.delete(absIdx) : next.add(absIdx);
    setSelected(next);
    onSelectionChange?.(sorted.filter((_, i) => next.has(i)));
  };

  const SortIcon = ({ col }: { col: ColumnDef<T> }) => {
    if (!col.sortable) return null;
    if (sortKey !== col.key) return <ChevronsUpDown size={13} className="ml-1 text-[#9898b3]" />;
    return sortDir === "asc"
      ? <ChevronUp size={13} className="ml-1 text-[#5752FE]" />
      : <ChevronDown size={13} className="ml-1 text-[#5752FE]" />;
  };

  const hasActions = onEdit || onDelete;

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className={cn("flex flex-col gap-3 border border-[#E0E0E0] rounded-[8px] p-6", className)}>

      {/* Top Bar */}
      {(searchable || headerActions) && (
        <div className="flex items-center justify-between gap-3">

          {/* Left: Search + Filter */}
          <div className="flex items-center gap-2">

            {searchable && (
              <div className="relative w-64">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#5752FE]" />
                <Input
                  placeholder={searchPlaceholder}
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                  className="pl-9 h-9 rounded-[8px] border-[#e4e4ee] text-sm focus-visible:border-[#5752FE] focus-visible:ring-[rgba(87,82,254,0.12)]"
                />
              </div>
            )}

            {/* Filter Button + Dropdown */}
            {filters && (
              <div className="relative">
                <Button
                  ref={filterBtnRef}
                  variant="outline"
                  className={cn(
                    "h-9 px-4 text-sm rounded-[10px] gap-2 border-[#e4e4ee]",
                    activeFilterCount > 0
                      ? "border-[#5752FE] text-[#5F616E] bg-[#f5f4ff]"
                      : "text-[#6b6b8d]"
                  )}
                  onClick={() => setShowFilterDropdown((prev) => !prev)}
                >
                  <FilterIcon />
                  Filters
                  {activeFilterCount > 0 && (
                    <span className="bg-[#5752FE] text-white text-[10px] font-semibold rounded-full h-4 w-4 flex items-center justify-center">
                      {activeFilterCount}
                    </span>
                  )}
                </Button>

                {showFilterDropdown && (
                  <FilterDropdown
                    filters={filters}
                    initialValues={appliedFilters}
                    onApply={(vals) => { setAppliedFilters(vals); setPage(1); }}
                    onClose={() => setShowFilterDropdown(false)}
                    triggerRef={filterBtnRef}
                  />
                )}
              </div>


            )}

            {/* Replace the existing Sort button div with this: */}
            <div className="relative">
              <Button
                ref={sortBtnRef}
                variant="outline"
                className={cn(
                  "h-9 px-4 text-sm rounded-[10px] gap-2 border-[#e4e4ee]",
                  sortKey
                    ? "border-[#5752FE] text-[#5F616E] bg-[#f5f4ff]"
                    : "text-[#6b6b8d]"
                )}
                onClick={() => setShowSortDropdown((prev) => !prev)}
              >
                <SortingIcon />
                Sort
                {sortKey && (
                  <span className="bg-[#5752FE] text-white text-[10px] font-semibold rounded-full h-4 w-4 flex items-center justify-center">
                    1
                  </span>
                )}
              </Button>

              {showSortDropdown && (
                <SortDropdown
                  columns={columns}
                  sortKey={sortKey ?? ""}
                  sortDir={(sortDir as "asc" | "desc") ?? "asc"}
                  onApply={(key, dir) => {
                    setSortKey(key || null);
                    setSortDir(key ? dir : null);
                  }}
                  onClose={() => setShowSortDropdown(false)}
                  triggerRef={sortBtnRef}
                />
              )}
            </div>
          </div>

          {/* Right: Header Actions */}
          {headerActions && (
            <div className="flex items-center gap-2">{headerActions}</div>
          )}
        </div>
      )}

      {/* Active Filter Tags */}
      {activeFilterCount > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-[#9898b3]">Filtered by:</span>
          {Object.entries(appliedFilters).map(([key, value]) => {
            if (!value) return null;
            const filterConfig = filters?.find((f) => f.key === key);
            const label = filterConfig?.options?.find((o) => o.value === value)?.label ?? value;
            return (
              <span
                key={key}
                className="flex items-center gap-1 bg-[#f5f4ff] text-[#5752FE] border border-[#e0dfff] text-xs px-2.5 py-1 rounded-full"
              >
                <span className="text-[#9898b3] mr-0.5 capitalize">{filterConfig?.label ?? key}:</span>
                {label}
                <button
                  onClick={() => setAppliedFilters((prev) => ({ ...prev, [key]: "" }))}
                  className="hover:text-[#3f3bd4] ml-0.5"
                >
                  <X size={10} />
                </button>
              </span>
            );
          })}
          <button
            onClick={() => setAppliedFilters({})}
            className="text-xs text-red-400 hover:text-red-500 ml-1"
          >
            Clear all
          </button>
        </div>
      )}

      {/* Table */}
      <div className="rounded-[12px] border border-[#ECECEC] overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-[#F8F8FA] hover:bg-[#F7F7FB] border-b border-[#ECECEC]">
              {selectable && (
                <TableHead className="w-10 px-4">
                  <Checkbox id="select-all-checkbox" checked={allChecked} onCheckedChange={toggleAll} className="border-[#dcdcf0] hover:border-[#5b5bd6]" />
                </TableHead>
              )}
              {columns.map((col) => (
                <TableHead
                  key={col.key as string}
                  style={{ width: col.width }}
                  className={cn(
                    "text-xs font-semibold text-[#000000] uppercase tracking-wide px-4 py-3",
                    col.sortable && "cursor-pointer select-none hover:text-[#5752FE]"
                  )}
                  onClick={() => col.sortable && handleSort(col.key as string)}
                >
                  <span className="flex items-center">
                    {col.label}
                    <SortIcon col={col} />
                  </span>
                </TableHead>
              ))}
              {onEdit && (
                <TableHead className="w-16 px-4 text-xs font-semibold text-[#000000] uppercase tracking-wide">
                  Actions
                </TableHead>
              )}
            </TableRow>
          </TableHeader>

          <TableBody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i} className="border-b border-[#ECECEC]">
                  {selectable && <TableCell className="px-4"><div className="h-4 w-4 rounded bg-[#FFFFFF00] animate-pulse" /></TableCell>}
                  {columns.map((col) => (
                    <TableCell key={col.key as string} className="px-4 py-3 text-[#000000]">
                      <div className="h-4 rounded bg-[#f0f0f8] animate-pulse w-3/4" />
                    </TableCell>
                  ))}
                  {hasActions && <TableCell className="px-4"><div className="h-4 w-4 rounded bg-[#f0f0f8] animate-pulse" /></TableCell>}
                </TableRow>
              ))
            ) : paginated.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length + (selectable ? 1 : 0) + (onEdit ? 1 : 0) + (onDelete ? 1 : 0)}
                  className="text-center py-12 text-sm text-[#000000]"
                >
                  {emptyMessage}
                </TableCell>
              </TableRow>
            ) : (
              paginated.map((row, i) => {
                const absIdx = (page - 1) * perPage + i;
                return (
                  <TableRow
                    key={absIdx}
                    className={cn(
                      "border-b border-[#ECECEC] transition-colors",
                      onRowClick && "cursor-pointer hover:bg-[#F7F7FB]",
                      selected.has(absIdx) && "bg-[#f5f4ff]"
                    )}
                    onClick={() => onRowClick?.(row)}
                  >
                    {selectable && (
                      <TableCell className="px-4" onClick={(e) => e.stopPropagation()}>
                        <Checkbox
                          id="remember-me-checkbox"
                          checked={selected.has(absIdx)}
                          onCheckedChange={() => toggleRow(absIdx)}
                          className="border-[#dcdcf0]"
                        />
                      </TableCell>
                    )}
                    {columns.map((col) => (
                      <TableCell key={col.key as string} className="px-4 py-3 text-sm">
                        {col.render
                          ? col.render(getNestedValue(row, col.key as string), row)
                          : safeString(getNestedValue(row, col.key as string))}  {/* ← use safeString */}
                      </TableCell>
                    ))}
                    {(onEdit || onDelete) && (
                      <TableCell
                        className="px-4"  // ← remove flex from td
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex items-center gap-1">  {/* ← wrap buttons in a div */}
                          {onEdit && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 hover:bg-[#f0f0f8] text-[#6b6b8d] hover:text-[#5752FE]"
                              onClick={() => onEdit(row)}
                            >
                              <Pencil size={15} />
                            </Button>
                          )}

                          {onDelete && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 hover:bg-red-50 text-[#6b6b8d] hover:text-red-500"
                              onClick={(e) => {
                                e.stopPropagation();
                                console.log("Delete clicked", row); // ← add this
                                setDeleteTarget(row);

                              }}
                            >
                              <Trash2 size={15} />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    )}
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between text-sm text-[#6b6b8d]">
        <div className="flex items-center gap-2">
          <span>Rows per page</span>
          <Select value={String(perPage)} onValueChange={(v) => { setPerPage(Number(v)); setPage(1); }}>
            <SelectTrigger className="h-8 w-16 rounded-[8px] border-[#e4e4ee] text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[5, 10, 20, 50].map((n) => (
                <SelectItem key={n} value={String(n)} className="text-xs">{n}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-3">
          <span>{Math.min((page - 1) * perPage + 1, sorted.length)}–{Math.min(page * perPage, sorted.length)} of {sorted.length}</span>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-[8px] hover:bg-[#f0f0f8]" disabled={page === 1} onClick={() => setPage(p => p - 1)}>
              <ChevronLeft size={15} />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-[8px] hover:bg-[#f0f0f8]" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>
              <ChevronRight size={15} />
            </Button>
          </div>
        </div>
      </div>

      <AlertPopupDialog
        open={!!deleteTarget}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
        variant="danger"
        title="Delete Record?"
        subtitle="Are you sure you want to delete this record? This action cannot be undone."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        onConfirm={() => {
          if (deleteTarget && onDelete) {
            onDelete(deleteTarget);
          }
          setDeleteTarget(null);
        }}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}