import { Link } from "react-router-dom"

function PageNotFound() {
  return (
    <div className="hero min-h-screen bg-base-200">
      <div className="hero-content text-center">
        <div className="max-w-md">
          <h1 className="text-9xl font-bold">404</h1>
          <h1 className="text-xl font-semibold">It seems that you're lost.</h1>
          <p className="py-6">Let's get you back on track:</p>
          <div>
            <button className="btn btn-active btn-primary">
              <Link to="/">Go back to Homepage</Link>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PageNotFound