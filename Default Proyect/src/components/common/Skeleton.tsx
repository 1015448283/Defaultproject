export function Skeleton({ width = 'w-full', height = 'h-4', lines = 1 }: { width?: string; height?: string; lines?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className={`bg-dark-700/80 rounded animate-pulse ${width} ${height}`} />
      ))}
    </div>
  );
}
