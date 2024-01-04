import 'daisyui/dist/full.css';
import 'tailwindcss/tailwind.css';

function Dashboard() {
  return (
    <div className="bg-light-blue-500 p-6 min-h-screen">
      <header className="text-4xl text-white">Dashboard</header>
      <main className="mt-5">
        <div className="stats stats-vertical lg:stats-horizontal shadow">
          
          <div className="stat">
            <div className="stat-title">Downloads</div>
            <div className="stat-value">31K</div>
            <div className="stat-desc">Jan 1st - Feb 1st</div>
          </div>
          
          <div className="stat">
            <div className="stat-title">New Users</div>
            <div className="stat-value">4,200</div>
            <div className="stat-desc">↗︎ 400 (22%)</div>
          </div>
          
          <div className="stat">
            <div className="stat-title">New Registers</div>
            <div className="stat-value">1,200</div>
            <div className="stat-desc">↘︎ 90 (14%)</div>
          </div>
                   
        </div>
      </main>
    </div>
  );
}

export default Dashboard;