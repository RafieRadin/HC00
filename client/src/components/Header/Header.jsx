import { Link } from "react-router-dom"
import { useLogout } from "../../hooks/useLogout"
import { useAuthContext } from "../../hooks/useAuthContext"

function Header() {
    const {logout} = useLogout()
    const {user} = useAuthContext()
    const handleClick = () => {
        logout()
    }

  return (
    <div className="drawer-content flex flex-col">
        {/* Navbar */}
        <div className="w-full navbar bg-base-300">
            <div className="flex-none lg:hidden">
                <label htmlFor="my-drawer-3" aria-label="open sidebar" className="btn btn-square btn-ghost">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-6 h-6 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
                </label>
            </div> 
            <div className="btn btn-ghost btn-circle avatar lg:ml-10 sm:ml-2">
                <Link to="/">
                    <div className="avatar">
                        <div className="w-9 rounded-xl ring ring-primary ring-offset-base-100 ring-offset-1">
                            <img alt="Pic" src="../src/assets/logo2.jpg" />
                        </div>
                    </div>
                </Link>
            </div>
            <div className="flex-1 px-2 mx-2">
                myWaQu
            </div>
            <div className="flex-none gap-3">
                <div className="dropdown dropdown-end">
                    <label tabIndex={0} className="btn btn-ghost btn-circle">
                        <div className="indicator">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                                <span className="badge badge-sm indicator-item">8</span>
                        </div>
                    </label>
                    <div tabIndex={0} className="mt-3 card card-normal dropdown-content w-52 bg-base-300 shadow">
                        <div className="card-body">
                            <span className="font-bold text-lg">Error</span>
                            <span className="text-info">Notifications not yet configured.</span>
                            <div className="card-actions">
                                <button className="btn btn-primary btn-block">Clear Notifications</button>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="flex-none hidden lg:block">
                {user && (
                    <div className="flex justify-end flex-1 px-2">
                        <div className="flex items-stretch">
                            <Link to="/dashboard" className="btn btn-ghost rounded-btn">Dashboard</Link>
                            <div className="dropdown dropdown-end">
                                <label tabIndex={0} className="btn btn-ghost rounded-btn">Predictions</label>
                                <ul tabIndex={0} className="menu dropdown-content z-[1] p-2 shadow bg-base-300 rounded-box w-52 mt-4">
                                    <h2 className="menu-title">Sensor List</h2>
                                    <li><Link to="/temp-sensor">Temp Sensors</Link></li>
                                    <li><Link to="/ph-sensor">pH Sensors</Link></li>
                                    <li><Link to="/do-sensor">DO Sensors</Link></li>
                                </ul>
                            </div>
                            <Link to="/reports" className="btn btn-ghost rounded-btn">Reports</Link>
                        </div>
                    </div>
                )}
                </div>
            
                <div className="form-control">
                    <input type="text" placeholder="Search" className="input input-bordered w-24 md:w-auto" />
                </div>
                {user && (
                <div className="dropdown dropdown-end pr-10">
                    <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
                    <div className="w-9 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                        <img alt="Pic" src="../src/assets/profile2.jpg" />
                    </div>
                    </label>
                    <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[10] p-2 shadow bg-base-300 rounded-box w-52">
                        <li className="items-center">{user.email}</li>
                        <li>
                            <Link to="/profile" className="justify-between">
                                Profile
                            </Link>
                        </li>
                        <li><Link to="/modelsettings">Settings</Link></li>
                        <li onClick={handleClick}><Link to="/login">Logout</Link></li>
                    </ul>
                </div>
                )}
                {!user && (
                <div className="pr-10">
                    <Link to="/login" className="btn btn-ghost rounded-btn">Login</Link>
                </div>
                )}
            
            </div>
        </div>
    </div>
    )
}

export default Header