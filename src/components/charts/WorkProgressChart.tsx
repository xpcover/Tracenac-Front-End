import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from 'chart.js';
import ChartFilter from './ChartFilter';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

const data = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  datasets: [
    {
      label: 'Work %',
      data: [5, 20, 40, 60, 80, 100],
      fill: false,
      borderColor: 'rgba(75,192,192,1)',
      tension: 0.4,
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
      text: 'Completion Tren',
    }
  },
  scales: {
    y: {
      min: 0,
      max: 100,
      ticks: {
        stepSize: 20,
        callback: value => `${value}%`,
      },
    },
  },
};

export default function WorkProgressChart() {
  return <div className='bg-white shadow-md px-1 py-3 rounded-lg'>
      
      <ChartFilter />
      <Line data={data} options={options} />
    </div>
}
