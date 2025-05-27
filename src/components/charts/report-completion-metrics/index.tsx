import FinalizedReport from "./FinalizedReport";
import GaugeChart from "./GuageChart";


function CompletionMetricsReport() {

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <FinalizedReport />
      <GaugeChart value={75} />
    </div>
  );
}

export default CompletionMetricsReport;
