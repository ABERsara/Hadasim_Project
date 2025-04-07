import { useParams } from 'react-router-dom';
import { useGetSingleOrderQuery } from '../orderApiSlice';
import "./order_details.css"
const OrderDetails = () => {
    const { _id } = useParams();
    const { data: order, isLoading, isError, error } = useGetSingleOrderQuery(_id);

    if (isLoading) return <h1>Loading...</h1>;
    if (isError) return <h1>{JSON.stringify(error)}</h1>;

    if (!order || !order.data) return <h1>Order not found</h1>;

    const { status } = order.data;
    const { companyName } = order.data.supplierId;

    return (
        <div>
            <h1>הזמנה מספר {_id}</h1>

            {companyName && <p>ספק: {companyName}</p>}
            <p>סטטוס: {status}</p>
            <p>המוצרים שהוזמנו:</p>
            <div>
                {order.data.products?.map((product) => (
                    <div key={product._id}>
                        {product.productId.productName} - כמות: {product.quantity}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default OrderDetails;