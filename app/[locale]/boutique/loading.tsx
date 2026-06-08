const shimmer: React.CSSProperties = {
  background: 'linear-gradient(90deg, #e7e0d5 25%, #f5f0e6 50%, #e7e0d5 75%)',
  backgroundSize: '400% 100%',
  animation: 'shimmer 1.5s infinite',
};

const shimmerDark: React.CSSProperties = {
  background: 'linear-gradient(90deg, #44403c 25%, #57534e 50%, #44403c 75%)',
  backgroundSize: '400% 100%',
  animation: 'shimmer 1.5s infinite',
};

export default function BoutiqueLoading() {
  return (
    <div className="min-h-screen bg-cream-50">
      {/* Hero skeleton */}
      <div className="relative py-16 md:py-24 px-4 bg-stone-800 overflow-hidden">
        <div className="max-w-6xl mx-auto text-center space-y-5">
          <div className="h-11 md:h-14 rounded-lg w-52 mx-auto" style={shimmerDark} />
          <div className="h-5 rounded w-72 mx-auto" style={shimmerDark} />
          <div className="flex justify-center gap-8 pt-2">
            <div className="h-5 rounded w-32" style={shimmerDark} />
            <div className="h-5 rounded w-32" style={shimmerDark} />
          </div>
        </div>
      </div>

      {/* Tab nav skeleton */}
      <div className="bg-white border-b border-stone-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 flex">
          <div className="flex-1 py-5 flex justify-center">
            <div className="h-5 rounded w-40" style={shimmer} />
          </div>
          <div className="flex-1 py-5 flex justify-center">
            <div className="h-5 rounded w-40" style={shimmer} />
          </div>
        </div>
      </div>

      {/* Products grid skeleton */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl overflow-hidden shadow-sm border border-stone-100">
              <div className="aspect-square" style={shimmer} />
              <div className="p-3 space-y-2.5">
                <div className="h-4 rounded w-3/4" style={shimmer} />
                <div className="h-3 rounded w-1/2" style={shimmer} />
                <div className="h-9 rounded-lg w-full mt-1" style={shimmer} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
