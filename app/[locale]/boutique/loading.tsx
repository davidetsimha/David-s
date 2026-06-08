export default function BoutiqueLoading() {
  return (
    <div className="min-h-screen bg-cream-50 animate-pulse">
      {/* Hero skeleton */}
      <div className="relative py-16 md:py-24 px-4 bg-stone-800">
        <div className="max-w-6xl mx-auto text-center space-y-4">
          <div className="h-10 md:h-14 bg-stone-700/60 rounded-lg w-64 mx-auto" />
          <div className="h-5 bg-stone-700/40 rounded w-80 mx-auto" />
          <div className="flex justify-center gap-8 pt-2">
            <div className="h-5 bg-stone-700/30 rounded w-36" />
            <div className="h-5 bg-stone-700/30 rounded w-36" />
          </div>
        </div>
      </div>

      {/* Tab nav skeleton */}
      <div className="bg-white border-b border-stone-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 flex">
          <div className="flex-1 py-4 flex justify-center">
            <div className="h-5 bg-stone-200 rounded w-40" />
          </div>
          <div className="flex-1 py-4 flex justify-center">
            <div className="h-5 bg-stone-200 rounded w-40" />
          </div>
        </div>
      </div>

      {/* Products skeleton */}
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl overflow-hidden shadow-sm">
              <div className="aspect-square bg-stone-200" />
              <div className="p-3 space-y-2">
                <div className="h-4 bg-stone-200 rounded w-3/4" />
                <div className="h-3 bg-stone-100 rounded w-1/2" />
                <div className="h-8 bg-stone-200 rounded w-full mt-2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
