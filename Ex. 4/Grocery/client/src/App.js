import { BrowserRouter as Router, Routes, Route, Outlet } from "react-router-dom";

import './App.css';
import DashLayout from "../src/components/layouts/dash/DashLayout";
import SupplierRegistration from "./components/features/supplier/login-register/SupplierRegistration";
import SupplierLogin from "./components/features/supplier/login-register/SupplierLogin"
import OrdersList from "./components/features/Orders/OrdersList";
import AddOrder from "./components/features/Orders/addOrder/AddOrder"
import OrderDetails from "./components/features/Orders/orderDetails/OrderDetails";
import SuppliersOrders from "./components/features/supplier/SuppliersOrders";
import HomePage from "./components/layouts/home_page/Home_page";
function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<DashLayout />}>
          <Route index element={<HomePage/>} />
          <Route path="/register" element={<SupplierRegistration />} />
          <Route path="/login" element={<SupplierLogin />} />
          <Route path="/suppliers" element={<Outlet />}>
            <Route index element={<SuppliersOrders />} />
          </Route>
          <Route path="orders" element={<Outlet />}>
            <Route index element={<OrdersList />} />
            <Route path="add" element={<AddOrder />} />
            <Route path=":_id" element={<OrderDetails />} />

          </Route>
        </Route>
      </Routes>
    </Router>

  );
}

export default App;
