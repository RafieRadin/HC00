import { useState } from "react"
import { Link } from "react-router-dom"
import { useLogin } from "../../hooks/useLogin"

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const {login, error, isLoading} = useLogin()

  const handleSubmit = async (e) =>{
    e.preventDefault()
    await login(email, password)
  }
  return (
    <div className="hero min-h-screen bg-base-100"  style={{backgroundImage: 'url(../src/assets/fishfarming-BG.jpg)'}}>
      <div className="hero-content flex-col lg:flex-row-reverse">
        <div className="card shrink-0 w-full max-w-lg shadow-2xl bg-base-300">
          <form className="card-body" onSubmit={handleSubmit}>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input type="email" onChange={(e) => setEmail(e.target.value)} value={email} placeholder="Email" className="input input-bordered bg-base-200" required />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <input type="password" onChange={(e) => setPassword(e.target.value)} value={password} placeholder="Password" className="input input-bordered bg-base-200" required />
              <div className="label">
                <a className="label-text-alt">Don't have an account? <Link to="/register" className="label-text-alt link link-hover text-color text-purple-500">Sign Up</Link></a>
              </div>
            </div>
            {error && <div role="alert" className="alert alert-warning">
              <span>{error}</span>
            </div>}
            <div className="form-control mt-6">
              <button disabled={isLoading} className="btn btn-primary">Login</button>
            </div>         
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login