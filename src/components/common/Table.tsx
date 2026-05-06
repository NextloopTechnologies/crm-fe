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
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useState, useMemo } from "react";
import { ChevronUp, ChevronDown, ChevronsUpDown, MoreHorizontal, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

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

interface DataTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  rowActions?: RowAction<T>[];
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
}

type SortDir = "asc" | "desc" | null;

// ── Helpers ───────────────────────────────────────────────────────────────────
function getNestedValue<T>(obj: T, key: string): unknown {
  return key.split(".").reduce((acc: unknown, k) => {
    if (acc && typeof acc === "object") return (acc as Record<string, unknown>)[k];
    return undefined;
  }, obj);
}

// ── Component ─────────────────────────────────────────────────────────────────
export function DataTable<T extends { id?: string | number }>({
  data,
  columns,
  rowActions,
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
}: DataTableProps<T>) {
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>(null);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(pageSize);
  const [selected, setSelected] = useState<Set<number>>(new Set());

  // ── Search ────────────────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    if (!search.trim()) return data;
    const q = search.toLowerCase();
    return data.filter((row) =>
      columns.some((col) => {
        const val = getNestedValue(row, col.key as string);
        return String(val ?? "").toLowerCase().includes(q);
      })
    );
  }, [data, search, columns]);

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

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className={cn("flex flex-col gap-3", className)}>

      {/* Top Bar */}
      {(searchable || headerActions) && (
        <div className="flex items-center justify-between gap-3">
          {searchable && (
            <div className="relative w-64">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9898b3]" />
              <Input
                placeholder={searchPlaceholder}
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                className="pl-9 h-9 rounded-[8px] border-[#e4e4ee] text-sm focus-visible:border-[#5752FE] focus-visible:ring-[rgba(87,82,254,0.12)]"
              />
            </div>
          )}
          {headerActions && <div className="flex items-center gap-2">{headerActions}</div>}
        </div>
      )}

      {/* Table */}
      <div className="rounded-[12px] border border-[#ECECEC] overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-[#F7F7FB] hover:bg-[#F7F7FB] border-b border-[#ECECEC]">
              {selectable && (
                <TableHead className="w-10 px-4">
                  <Checkbox checked={allChecked} onCheckedChange={toggleAll} className="border-[#dcdcf0]" />
                </TableHead>
              )}
              {columns.map((col) => (
                <TableHead
                  key={col.key as string}
                  style={{ width: col.width }}
                  className={cn(
                    "text-xs font-semibold text-[#6b6b8d] uppercase tracking-wide px-4 py-3",
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
              {rowActions && <TableHead className="w-12 px-4" />}
            </TableRow>
          </TableHeader>

          <TableBody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i} className="border-b border-[#ECECEC]">
                  {selectable && <TableCell className="px-4"><div className="h-4 w-4 rounded bg-[#f0f0f8] animate-pulse" /></TableCell>}
                  {columns.map((col) => (
                    <TableCell key={col.key as string} className="px-4 py-3">
                      <div className="h-4 rounded bg-[#f0f0f8] animate-pulse w-3/4" />
                    </TableCell>
                  ))}
                  {rowActions && <TableCell className="px-4"><div className="h-4 w-4 rounded bg-[#f0f0f8] animate-pulse" /></TableCell>}
                </TableRow>
              ))
            ) : paginated.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length + (selectable ? 1 : 0) + (rowActions ? 1 : 0)} className="text-center py-12 text-sm text-[#9898b3]">
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
                          checked={selected.has(absIdx)}
                          onCheckedChange={() => toggleRow(absIdx)}
                          className="border-[#dcdcf0]"
                        />
                      </TableCell>
                    )}
                    {columns.map((col) => (
                      <TableCell key={col.key as string} className="px-4 py-3 text-sm text-[#111127]">
                        {col.render
                          ? col.render(getNestedValue(row, col.key as string), row)
                          : String(getNestedValue(row, col.key as string) ?? "—")}
                      </TableCell>
                    ))}
                    {rowActions && (
                      <TableCell className="px-4" onClick={(e) => e.stopPropagation()}>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-[#f0f0f8]">
                              <MoreHorizontal size={16} className="text-[#6b6b8d]" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-40 rounded-[10px] border-[#ECECEC]">
                            {rowActions.map((action, ai) => (
                              <DropdownMenuItem
                                key={ai}
                                onClick={() => action.onClick(row)}
                                className={cn("text-sm gap-2 cursor-pointer", action.className)}
                              >
                                {action.icon}
                                {action.label}
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
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
    </div>
  );
}