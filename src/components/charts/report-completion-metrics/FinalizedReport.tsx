import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import ChartFilter from "../ChartFilter";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function FinalizedReport() {
  const data = {
    labels: ["January", "February", "March", "April", "May", "June"],
    datasets: [
      {
        data: [10, 20, 30, 40, 50, 60],
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
      },
      title: {
        display: true,
        text: "Number of Finalized Reports",
      },
    },
  };
  return (
    <div className="bg-white shadow-md px-1 py-3 rounded-lg h-fit">
        <ChartFilter />

      <Bar options={options} data={data} />
    </div>
  );
}

export default FinalizedReport;
