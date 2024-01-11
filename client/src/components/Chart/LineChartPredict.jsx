import { Chart as ChartJS, LinearScale, PointElement, LineElement, Title, Tooltip, Filler } from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(LinearScale, PointElement, LineElement, Title, Tooltip, Filler);

function LineChartPredict({ dataset, labels, chartTitle }) {
  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
      },
    },
    scales: {
      x: {
        display: false,
      },
      y: {
        beginAtZero: false,
      },
    },
  };

  const data = {
    labels,
    datasets: [dataset],
  };

  return (
    <div className="card bg-base-200 shadow-xl pb-6">
      <div className="card-body">
        <h2 className="card-title">{chartTitle}</h2>
      </div>
      <div className="divider"></div>
      <div>
        <Line data={data} options={options} />
      </div>
    </div>
  );
}

export default LineChartPredict;
