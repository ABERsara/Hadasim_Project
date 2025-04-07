import { Outlet } from "react-router-dom"
import Navbar from "../navbar/Navbar"
import Footer from "../footer/Footer"
const DashLayout = () => {
    return (
        <div className="container">
            <Navbar/>

            <div className="content">
                <div className="menu">
                </div>
                <div className="display">
                    <Outlet />
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default DashLayout