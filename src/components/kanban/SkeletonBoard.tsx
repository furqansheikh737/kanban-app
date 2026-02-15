export default function SkeletonBoard() {
  return (
    <div className="flex h-full p-6 gap-6 animate-pulse">
      {[1, 2, 3].map((i) => (
        <div key={i} className="w-80 bg-slate-200 rounded-xl p-4 h-[500px]">
          <div className="h-6 w-24 bg-slate-300 rounded mb-6" />
          <div className="space-y-3">
            {[1, 2, 3, 4].map((j) => (
              <div key={j} className="h-24 bg-slate-300 rounded-lg" />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}