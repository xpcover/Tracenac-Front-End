function ChartFilter() {
  return (
    <div className="flex justify-center mt-3 gap-3">
      <button className="text-xs bg-slate-100 px-2 py-1 rounded-md hover:bg-slate-200">
        1m
      </button>
      <button className="text-xs bg-slate-100 px-2 py-1 rounded-md hover:bg-slate-200">
        6m
      </button>
      <button className="text-xs bg-slate-100 px-2 py-1 rounded-md hover:bg-slate-200">
        9m
      </button>
      <button className="text-xs bg-slate-100 px-2 py-1 rounded-md hover:bg-slate-200">
        1y
      </button>
    </div>
  );
}

export default ChartFilter;
