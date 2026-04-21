import React from 'react';
import { Pie, Bar, Radar } from 'react-chartjs-2';
import { 
  Chart as ChartJS,
  ArcElement, 
  Tooltip, 
  Legend, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  scales,
 } from 'chart.js';
import { Box } from '@chakra-ui/react';

ChartJS.register(
  ArcElement, 
  Tooltip, 
  Legend, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  RadialLinearScale, 
  PointElement, 
  LineElement, 
  Filler
);

const PieChart = () => {
  const data = {
    labels: ['Động vật', 'Thực vật', 'Nấm', 'Nguyên sinh', 'Khởi sinh'],
    datasets: [
        {
        data: [1500000, 390000, 144000, 80000, 10000],
        backgroundColor: [
            '#FF6384',
            '#4CAF50',
            '#9C27B0',
            '#03A9F4',
            '#FFC107'
        ],
        borderWidth: 1,
        },
    ],
  };
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom'
      }
    }
  };

  return (
    <>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <Box w="350px" h="350px">
            <Pie data={data} options={options} />
        </Box>
      </Box>
    </>
  );  
};

const BarChart = () => {
  const data = {
    labels: ['Khởi sinh', 'Nguyên sinh', 'Nấm', 'Thực vật', 'Động vật'],
    datasets: [
      {
        label: 'Sống trên Cạn (%)',
        data: [35, 15, 85, 95, 70],
        backgroundColor: 'rgba(255, 159, 64, 0.75)',
      },
      {
        label: 'Sống dưới Nước (%)',
        data: [65, 85, 15, 5, 30],
        backgroundColor: 'rgba(54, 162, 235, 0.75)',
      },
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Tỉ lệ sống trên Cạn và dưới Nước của các giới (%)',
      },
    },
    scales: {
      x: {
        stacked: true,
      },
      y: {
        stacked: true,
        beginAtZero: true,
        max: 100,
        ticks: {
          callback: (value) => `${value}%`,
        },
      },
    },
  };

  return (
    <Box w="350px" h="350px">
      <Bar data={data} options={options} />
    </Box>
  );
};

const RadarChart = () => {
  const data = {
    labels: ['Động vật', 'Thực vật', 'Nấm', 'Nguyên sinh', 'Khởi sinh'],
    datasets: [
      {
        label: 'Nhiệt độ trung bình (°C)',
        data: [30, 22, 20, 25, 45],
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
      },
    ],
  };

  const options = {
    scales: {
      r: {
        min: 0,
        max: 50,
        ticks: {
          stepSize: 10,
          callback: (value) => `${value}°C`,
        },
      }
    }
  }

  return (
    <Box w="350px" h="350px">
      <Radar data={data} options={options} />
    </Box>
  );
};

export { PieChart, BarChart, RadarChart };