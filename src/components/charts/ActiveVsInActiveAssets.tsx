import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

const data = {
  labels: ['Active', 'Inactive'],
  datasets: [
    {
      label: '# of Votes',
      data: [12, 19],
      backgroundColor: [
        'rgba(54, 162, 235, 11)',
        'rgba(255, 99, 132, 11)',
      ]
    }
  ]
};

const options = {
  responsive: true,
  plugins: {
    title: {
      display: true,
      text: 'Active vs Inactive Assets',
    },
  },
};

export default  function ActiveVsInActiveAssets() {
  return <div className='bg-white shadow-md px-1 py-3 rounded-lg'>
      <Pie options={options} data={data} />
    </div>
}
