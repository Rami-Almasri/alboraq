export default function ProductSkeleton() {
  return (
    <div className="card overflow-hidden p-4">
      <div className="skeleton mb-4 h-44 w-full" />
      <div className="skeleton mb-2 h-3 w-1/3" />
      <div className="skeleton mb-2 h-4 w-3/4" />
      <div className="mt-4 flex items-center justify-between">
        <div className="skeleton h-6 w-20" />
        <div className="skeleton h-10 w-10 rounded-xl" />
      </div>
    </div>
  );
}
