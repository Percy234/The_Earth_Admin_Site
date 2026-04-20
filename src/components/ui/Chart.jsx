import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Box } from '@chakra-ui/react';

ChartJS.register(ArcElement, Tooltip, Legend);

const PieChartComponent = () => {
  const data = {
    labels: ['Động vật', 'Thực vật', 'Nấm', 'Nguyên sinh', 'Vi khuẩn'],
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

export default PieChartComponent;