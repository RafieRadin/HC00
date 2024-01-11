import {
    Chart as ChartJS,
    Filler,
    ArcElement,
    Tooltip,
    Legend,
  } from 'chart.js';
  import { Doughnut } from 'react-chartjs-2';
  
  ChartJS.register(ArcElement, Tooltip, Legend,
      Tooltip,
      Filler,
      Legend);

function DoughnutChart() {
  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false, // Hide the legend for simplicity
      },
      center: {
        text: '${accuracyPercentage}%', // Will be dynamically set based on accuracy percentage
        color: '#36A2EB',
        fontStyle: 'Arial',
        sidePadding: 20,
        minFontSize: 25,
        lineHeight: 25,
      },
    },
    cutoutPercentage: 70,
  };

  const labels = ['Correct', 'Incorrect'];
  const correctCount = 310;
  const incorrectCount = 50;
  const total = correctCount + incorrectCount;

  const accuracyPercentage = ((correctCount / total) * 100).toFixed(2);

  const data = {
    labels,
    datasets: [
      {
        data: [correctCount, incorrectCount],
        backgroundColor: ['rgba(75, 192, 192, 0.8)', 'rgba(255, 99, 132, 0.8)'],
        borderColor: ['rgba(75, 192, 192, 1)', 'rgba(255, 99, 132, 1)'],
        borderWidth: 1,
      },
    ],
  };

  options.plugins.center.text = `${accuracyPercentage}%`;

  return (
    <div className="card bg-base-200 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">Accuracy</h2>
        <p>Show the percentage accuracy of the model.</p>
      </div>
      <div className="pl-52 pr-52 mb-10">
        <Doughnut options={options} data={data} />
      </div>
    </div>
  );
}

export default DoughnutChart;
