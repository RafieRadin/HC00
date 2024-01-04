import { Link } from "react-router-dom";
import { useAuthContext } from "../../hooks/useAuthContext";

function Home() {
  const {user} = useAuthContext()
  return (
    <div className="hero min-h-screen" style={{backgroundImage: 'url(../src/assets/fishfarming-BG.jpg)'}}>
      <div className="hero-overlay bg-opacity-60"></div>
      <div className="hero-content text-center text-neutral-content">
        <div className="max-w-md">
          <h1 className="mb-5 text-5xl font-bold">Explore the Future</h1>
          <h1 className="mb-5 text-4xl font-semibold">Water Quality Monitoring and Forecasting</h1>
          <p className="mb-5 text-justify">Dive into the future of fish farming with our cutting-edge Water Quality Monitoring and Forecasting System, ensuring optimal conditions for your aquatic ecosystem.</p>
          <div>
            {user && (
            <button className="btn btn-active btn-primary">
              <Link to="/dashboard">Get Started</Link>
            </button>
            )}
            {!user && (
            <button className="btn btn-active btn-primary">
              <Link to="/login">Get Started</Link>
            </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
