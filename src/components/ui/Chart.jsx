import React from 'react';
import { Pie, Bar, Radar, Line } from 'react-chartjs-2';
import { useTheme } from 'next-themes';
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

// Biểu đồ tròn (Pie Chart)
const PieChart = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const textColor = isDark ? '#e2e8f0' : '#0f172a';
  const gridColor = isDark ? 'rgba(148, 163, 184, 0.25)' : 'rgba(148, 163, 184, 0.22)';

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
      title: {
        display: true,
        text: 'Số lượng loài của các giới sinh vật',
        color: textColor,
        padding: {
          top: 4,
          bottom: 8,
        },
      },
      legend: {
        position: 'bottom',
        labels: {
          color: textColor,
        },
      },
    }
  };

  return (
    <Box w="100%" h="100%" minW={0} maxW="100%" overflow="hidden" display="flex" flexDirection="column">
      <Box
        flex="1"
        minH={0}
        minW={0}
        w="100%"
        overflow="hidden"
        sx={{
          canvas: {
            maxWidth: '100%',
          },
        }}
      >
        <Pie
          data={data}
          options={options}
        />
      </Box>
    </Box>
  );  
};

// Biểu đồ cột (Bar Chart)
const BarChart = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const textColor = isDark ? '#e2e8f0' : '#0f172a';
  const gridColor = isDark ? 'rgba(148, 163, 184, 0.25)' : 'rgba(148, 163, 184, 0.22)';

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
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: 'Tỉ lệ sống trên Cạn và dưới Nước của các giới (%)',
        color: textColor,
      },
      legend: {
        labels: {
          color: textColor,
        },
      },
    },
    scales: {
      x: {
        stacked: true,
        ticks: {
          color: textColor,
        },
        grid: {
          color: gridColor,
        },
      },
      y: {
        stacked: true,
        beginAtZero: true,
        max: 100,
        ticks: {
          color: textColor,
          callback: (value) => `${value}%`,
        },
        grid: {
          color: gridColor,
        },
      },
    },
  };

  return (
    <Box w="100%" h="100%" minW={0} maxW="100%" overflow="hidden" display="flex" flexDirection="column">
      <Box
        flex="1"
        minH={0}
        minW={0}
        w="100%"
        overflow="hidden"
        sx={{
          canvas: {
            maxWidth: '100%',
          },
        }}
      >
        <Bar data={data} options={options} />
      </Box>
    </Box>
  );
};

// Biểu đồ radar (Radar Chart)
const RadarChart = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const textColor = isDark ? '#e2e8f0' : '#0f172a';
  const gridColor = isDark ? 'rgba(148, 163, 184, 0.25)' : 'rgba(148, 163, 184, 0.22)';

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
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: 'Nhiệt độ môi trường sống trung bình (°C)',
        color: textColor
      },
      legend: {
        labels: {
          color: textColor,
        },
      },
    },
    scales: {
      r: {
        min: 0,
        max: 50,
        angleLines: {
          color: gridColor,
        },
        grid: {
          color: gridColor,
        },
        pointLabels: {
          color: textColor,
        },
        ticks: {
          stepSize: 10,
          color: textColor,
          callback: (value) => `${value}°C`,
          backdropColor: 'transparent',
        },
      }
    }
  }

  return (
    <Box w="100%" h="100%" minW={0} maxW="100%" overflow="hidden" display="flex" flexDirection="column">
      <Box
        flex="1"
        minH={0}
        minW={0}
        w="100%"
        overflow="hidden"
        sx={{
          canvas: {
            maxWidth: '100%',
          },
        }}
      >
        <Radar data={data} options={options} />
      </Box>
    </Box>
  );
};

//Biểu đồ đường (Line Chart)
const EraLineChart = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const textColor = isDark ? '#e2e8f0' : '#0f172a';
  const gridColor = isDark ? 'rgba(148, 163, 184, 0.25)' : 'rgba(148, 163, 184, 0.22)';

  const data = {
    labels: ['Tiền Cambri', 'Cổ Sinh', 'Trung Sinh', 'Tân Sinh'],
    datasets: [
      {
        label: 'Số loài ước tính',
        data: [1000, 10000, 20000, 1000000],
        fill: true,
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.3)',
        tension: 0.3,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: 'Sự phát triển số lượng loài qua các kỷ nguyên',
        color: textColor,
      },
      legend: {
        position: 'top',
        labels: {
          color: textColor,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: textColor,
          callback: (value) => value.toLocaleString(),
        },
        grid: {
          color: gridColor,
        },
      },
      x: {
        ticks: {
          color: textColor,
        },
        grid: {
          color: gridColor,
        },
      },
    },
  };

  return (
    <Box w="100%" h="100%" minW={0} maxW="100%" overflow="hidden" display="flex" flexDirection="column">
      <Box
        flex="1"
        minH={0}
        minW={0}
        w="100%"
        overflow="hidden"
        sx={{
          canvas: {
            maxWidth: '100%',
          },
        }}
      >
        <Line data={data} options={options} />
      </Box>
    </Box>
  );
};

export { PieChart, BarChart, RadarChart, EraLineChart };