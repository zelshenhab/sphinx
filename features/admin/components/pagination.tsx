'use client';
export function Pagination({
  page,
  total,
  onChange,
  disabled = false,
}: {
  page: number;
  total: number;
  onChange: (page: number) => void;
  disabled?: boolean;
}) {
  const pages = Math.max(1, Math.ceil(total / 24));
  return (
    <nav
      aria-label="Pagination"
      className="flex flex-wrap justify-between items-center gap-3 text-sm"
    >
      <span>
        {total} · {page + 1} / {pages}
      </span>
      <div className="flex gap-2">
        <button
          className="btn border disabled:opacity-40"
          disabled={disabled || page === 0}
          onClick={() => onChange(page - 1)}
        >
          ←
        </button>
        <button
          className="btn border disabled:opacity-40"
          disabled={disabled || page + 1 >= pages}
          onClick={() => onChange(page + 1)}
        >
          →
        </button>
      </div>
    </nav>
  );
}
