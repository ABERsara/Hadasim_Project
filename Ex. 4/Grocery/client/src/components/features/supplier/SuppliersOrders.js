import { useState } from "react";
import { useUpdateStatusOrderMutation, useGetAllordersQuery } from "../Orders/orderApiSlice";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import useAuth from "../../../hooks/useAuth";
import "./supplier.css";

const SupplierOrders = () => {
  const { _id: supplierId } = useAuth();

  const { data: ordersObject, isLoading, isError, error } = useGetAllordersQuery();
  const [updateStatusOrder, { isSuccess: isUpdateSuccess, isLoading: isUpdateLoading }] = useUpdateStatusOrderMutation();
  const [updatedOrders, setUpdatedOrders] = useState({});
  const [hoveredRow, setHoveredRow] = useState(null);  // נוספה סטייט לעקוב אחרי השורה המורחבת

  const handleApprove = async (orderId) => {
    try {
      await updateStatusOrder({ order: { _id: orderId, status: "inProgress" } }).unwrap();
      setUpdatedOrders({ ...updatedOrders, [orderId]: true });
    } catch (err) {
      console.error("Failed to update status: ", err);
    }
  };

  const getOrderStatusText = (status) => {
    switch (status) {
      case "pending":
        return  "ממתין לאישור";
      case "completed":
        return "הזמנה התקבלה";
      case "inProgress":
        return "בתהליך";
      default:
        return status;
    }
  };

  if (isLoading) return <h1>טוען...</h1>;
  if (isError) return <h1>{JSON.stringify(error)}</h1>;

  const suppliersOrders = ordersObject?.data?.filter((order) => {
    const orderSupplierId = typeof (order.supplierId._id) === 'object' ? order.supplierId.toString() : order.supplierId._id;
    return orderSupplierId === supplierId;
  });

  return (
    <div className="list">
      <table className="list-table">
        <thead>
          <tr>
            <td>סטטוס הזמנה</td>
            <td>רשימת מוצרים</td>
            <td>תאריך הזמנה</td>
            <td>אישור ההזמנה</td>
          </tr>
        </thead>
        <tbody>
          {suppliersOrders?.length > 0 ? (
            suppliersOrders.map((order) => (
              <tr
                key={order._id}
                className={hoveredRow === order._id ? 'hovered' : ''}
                onMouseEnter={() => setHoveredRow(order._id)}
                onMouseLeave={() => setHoveredRow(null)}
              >
                <td>{getOrderStatusText(order.status)}</td>
                <td>
                  <div className="orders-list-buttons">
                    <Link to={`${order._id}`} className="list-button list-view">
                      צפייה
                    </Link>
                  </div>
                </td>
                <td>{format(new Date(order.createdAt), "dd-MM-yyyy")}</td>
                <td>
                  {order.status === "pending" && !updatedOrders[order._id] && (
                    <button onClick={() => handleApprove(order._id)} className="list-button list-approved">אישור</button>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">אין הזמנות לספק זה.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default SupplierOrders;
