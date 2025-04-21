import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const GaugeChart = ({ value = 65 }) => {

    const data =  {
    datasets: [{
      data: [30,30,30],
      value: value,
      backgroundColor: ['green', 'yellow', 'red'],
      borderWidth: 2
    }]
  }

  const options = {
    responsive: true,
    circumference: 180,
    rotation: 270,
    title: {
      display: true,
      text: 'Gauge chart'
    },
    layout: {
      padding: {
        bottom: 30
      }
    },
    needle: {
      radiusPercentage: 2,
      widthPercentage: 3.2,
      lengthPercentage: 80,
      color: 'rgba(0, 0, 0, 1)'
    },
    valueLabel: {
      formatter: Math.round
    }
  }  

  const gaugeNeedle = {
    id: 'gaugeNeedle',
    afterDraw(chart, args, options) {
      const { ctx, chartArea: { width, height } } = chart;
      
      // Get value and max value
      const value = chart.data.datasets[0].value;
      const maxValue = options.maxValue || 100;
      
      // Calculate angle (180° range from left to right)
      const angle = Math.PI + (Math.PI * (value / maxValue));
      
      // Needle configuration
      const cx = width / 2;
      const cy = height / 1.25;
      const length = width / 2.5;
      const pointerWidth = 5;
      
      // Draw needle
      ctx.translate(cx, cy);
      ctx.rotate(angle);
      ctx.beginPath();
      ctx.moveTo(0, -pointerWidth);
      ctx.lineTo(length, 0);
      ctx.lineTo(0, pointerWidth);
      ctx.fillStyle = options.needleColor || 'rgba(0, 0, 0, 1)';
      ctx.fill();
      
      // Draw needle dot center
      ctx.rotate(-angle);
      ctx.beginPath();
      ctx.arc(0, 0, pointerWidth, 0, Math.PI * 2);
      ctx.fill();
      ctx.translate(-cx, -cy);
    }
  };

  return (
      <div className='bg-white shadow-md rounded-lg w-56 h-56'>
      <Doughnut plugins={[gaugeNeedle]} data={data} options={options} />
      </div>
  );
};

export default GaugeChart;