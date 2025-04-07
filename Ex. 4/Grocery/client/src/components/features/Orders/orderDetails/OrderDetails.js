import { useNavigate, useParams } from 'react-router-dom';
import { useGetSingleOrderQuery } from '../orderApiSlice';
import "./order_details.css"
const OrderDetails = () => {
    const { _id } = useParams();
    const { data: order, isLoading, isError, error } = useGetSingleOrderQuery(_id);
    const navigate = useNavigate()
    if (isLoading) return <h1>Loading...</h1>;
    if (isError) return <h1>{JSON.stringify(error)}</h1>;

    if (!order || !order.data) return <h1>Order not found</h1>;

    const { status } = order.data;
    const { companyName } = order.data.supplierId;
    const getOrderStatusText = (status) => {
        switch (status) {
            case "pending":
                return "ממתין לאישור";
            case "completed":
                return "הזמנה התקבלה";
            case "inProgress":
                return "בתהליך";
            default:
                return status;
        }
    };
    const closeModal = () => {
        navigate("/")
    };
    return (
        <div className="order-details-container">
            <img src="/xMark.png" alt="close" className="img-back-from-order" onClick={closeModal} />
            <h1>הזמנה מספר {_id}</h1>
            {companyName && <p className="supplier">ספק: {companyName}</p>}
            <p className="status">סטטוס: {getOrderStatusText(status)}</p>
            <p>המוצרים שהוזמנו:</p>
            <div className="products-list">
                {order.data.products?.map((product) => (
                    <div key={product._id} className="product-item">
                        <span>{product.productId.productName}</span>
                        <span>כמות: {product.quantity}</span>
                    </div>
                ))}
            </div>
        </div>
    );

};


export default OrderDetails;