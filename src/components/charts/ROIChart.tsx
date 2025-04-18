import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { ArrowUpWideNarrow, BadgeDollarSign, BadgePercent, TrendingUp } from 'lucide-react';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const ROIChart = () => {
  // Sample data for the line chart
  const chartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    datasets: [
      {
        label: 'Revenue',
        data: [65000, 59000, 80000, 81000, 56000, 55000, 72000],
        borderColor: 'rgb(74, 222, 128)', // green-400
        backgroundColor: 'rgba(74, 222, 128, 0.1)',
        tension: 0.3,
        borderWidth: 2,
      },
      {
        label: 'Expenses',
        data: [28000, 32000, 40000, 38000, 42000, 35000, 45000],
        borderColor: 'rgb(248, 113, 113)', // red-400
        backgroundColor: 'rgba(248, 113, 113, 0.1)',
        tension: 0.3,
        borderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'ROI & Valuation Analysis',
        font: {
          size: 16
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `${context.dataset.label}: $${context.raw.toLocaleString()}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: false,
        ticks: {
          callback: function(value: number) {
            return '$' + value.toLocaleString();
          }
        },
        grid: {
          color: 'rgba(209, 213, 219, 0.3)' // gray-300 with opacity
        }
      },
      x: {
        grid: {
          color: 'rgba(209, 213, 219, 0.3)' // gray-300 with opacity
        }
      }
    }
  };

  // KPI data
  const kpis = [
    {
      title: 'Total Revenue',
      value: '$452,000',
      change: '+12%',
      changeColor: 'text-green-500',
      icon: <BadgeDollarSign className='text-green-500' />
    },
    {
      title: 'Total Expenses',
      value: '$264,000',
      change: '+5%',
      changeColor: 'text-red-500',
      icon: <BadgePercent className='text-red-500' />
    },
    {
      title: 'Profit Margin',
      value: '41.6%',
      change: '+3.2%',
      changeColor: 'text-green-500',
      icon: <ArrowUpWideNarrow className='text-blue-500' />
    },
    {
      title: 'Avg. Monthly Profit',
      value: '$15,700',
      change: '+8.5%',
      changeColor: 'text-green-500',
      icon: <TrendingUp className='text-purple-500' />
    }
  ];

  return (
    <div className='col-span-6'>
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {kpis.map((kpi, index) => (
          <div key={index} className="bg-white rounded-lg shadow p-6 flex flex-col">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500">{kpi.title}</p>
                <p className="text-2xl font-semibold text-gray-800 mt-1">{kpi.value}</p>
                <p className={`text-sm font-medium ${kpi.changeColor} mt-1`}>
                  {kpi.change} <span className="text-gray-500">vs last period</span>
                </p>
              </div>
                {kpi.icon}
            </div>
          </div>
        ))}
      </div>
      
      {/* Line Chart */}
      <div className="bg-white rounded-lg shadow-md p-5">
        <div className="h-80">
          <Line data={chartData} options={chartOptions} />
        </div>
      </div>
    </div>
  );
};

export default ROIChart;