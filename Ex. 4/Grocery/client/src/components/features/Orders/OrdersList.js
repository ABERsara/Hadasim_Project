import { useState } from "react";
import { useGetAllordersQuery, useUpdateStatusOrderMutation } from "./orderApiSlice";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import "./orders-list.css"
const OrdersList = () => {
    const { data: ordersObject, isError, error, isLoading, isSuccess } = useGetAllordersQuery();
    const [updateStatusOrder, { isSuccess: isUpdateSuccess, isLoading: isUpdateLoading }] = useUpdateStatusOrderMutation();
    const [updatedOrders, setUpdatedOrders] = useState({});

    const handleApprove = async (orderId) => {
        try {
            await updateStatusOrder({ order: { _id: orderId, status:"completed" } }).unwrap();
            setUpdatedOrders({ ...updatedOrders, [orderId]: true });
        } catch (err) {
            console.error("Failed to update status: ", err);
        }
    };

    const getOrderStatusText = (status) => {
        switch (status) {
            case "pending":
                return "ממתין";
            case "completed":
                return "הזמנה התקבלה";
            case "inProgress":
                return "בתהליך";
            default:
                return status;
        }
    };

    if (isLoading) return <h1>Loading...</h1>;
    if (isError) return <h1>{JSON.stringify(error)}</h1>;

    return (
        <div className="orders-list">
            <div className="orders-list-top">
                <Link to="/orders/add" className="orders-list-add-button">
                    הזמנה חדשה
                </Link>
            </div>
            <table className="orderss-list-table">
                <thead>
                    <tr>
                        <td>שם הספק</td>
                        <td>שם הנציג</td>
                        <td>סטטוס הזמנה</td>
                        <td>רשימת מוצרים</td>
                        <td>תאריך הזמנה</td>
                        <td>אישור ההזמנה</td>
                    </tr>
                </thead>
                <tbody>
                    {ordersObject.data?.map((order) => (
                        <tr key={order._id}>
                            <td>{order.supplierId.companyName}</td>
                            <td>{order.supplierId.representativeName}</td>
                            <td>{getOrderStatusText(order.status)}</td>
                            <td>
                                <div className="orders-list-buttons">
                                    <Link to={`${order._id}`} className="orders-list-button orders-list-view">
                                        צפייה
                                    </Link>
                                </div>
                            </td>
                            <td>{format(new Date(order.createdAt), "dd-MM-yyyy")}</td>
                            <td>
                                {order.status === "inProgress" && !updatedOrders[order._id] && (
                                    <button onClick={() => handleApprove(order._id)}>אישור</button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default OrdersList;