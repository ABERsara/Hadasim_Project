import React, { useEffect, useState } from 'react';
import { useAddOrderMutation } from '../orderApiSlice';
import { useNavigate } from 'react-router-dom';
import { useGetAllSuppliersQuery, useGetSupplierProductsQuery } from '../../supplier/supplierApiSlice';
import "./addOrder.css"
import PopUp from '../../../layouts/Popup';

const AddOrder = () => {
    const [addOrder, { isSuccess }] = useAddOrderMutation();
    const { data: suppliers, isLoading: isSuppliersLoading, isError: isSuppliersError } = useGetAllSuppliersQuery();

    const [selectedSupplierId, setSelectedSupplierId] = useState('');
    const { data: products, isLoading: isProductsLoading, isError: isProductsError } = useGetSupplierProductsQuery(selectedSupplierId, { skip: !selectedSupplierId });

    const [orderData, setOrderData] = useState({
        supplierId: '',
        products: [],
        status: 'inProgress',
        orderDate: new Date().toISOString().slice(0, 10),
    });

    const navigate = useNavigate();

    useEffect(() => {
        if (isSuccess) {
            navigate('/orders');
        }
    }, [isSuccess, navigate]);

    const formSubmit = async (e) => {
        e.preventDefault();
        try {
            await addOrder({ ...orderData }).unwrap();
        } catch (err) {
            console.error('Failed to add the order: ', err);
        }
    };

    const handleSupplierChange = (e) => {
        setSelectedSupplierId(e.target.value);
        setOrderData({ ...orderData, supplierId: e.target.value });
    };

    const handleProductChange = (e, productId) => {
        const { checked } = e.target;
        if (checked) {
            setOrderData({
                ...orderData,
                products: [
                    ...orderData.products,
                    { productId, quantity: 1 },
                ],
            });
        } else {
            setOrderData({
                ...orderData,
                products: orderData.products.filter(
                    (p) => p.productId !== productId
                ),
            });
        }
    };

    const handleQuantityChange = (e, productId) => {
        const { value } = e.target;
        setOrderData({
            ...orderData,
            products: orderData.products.map((p) =>
                p.productId === productId ? { ...p, quantity: parseInt(value) } : p
            ),
        });
    };
    const closePopup = () => {
        navigate('/orders')
    }
    return (
        <div className="modal-update">
            <PopUp close={closePopup} className="pop-up" width={'400px'}>
                <div >
                    <img
                        className="img-back"
                        src="/xMark.png"
                        alt="x"
                        onClick={closePopup}
                    />
                    <h1>הזמנה חדשה</h1>
                    <form onSubmit={formSubmit} className="single-form-add-order">
                        <label>פרטי ספק</label>
                        <select
                            value={orderData.supplierId}
                            onChange={handleSupplierChange}
                        >
                            <option value="">בחר ספק</option>
                            {isSuppliersLoading && <p>טוען ספקים...</p>}
                            {isSuppliersError && <p>לא נמצאו ספקים</p>}
                            {suppliers && suppliers.data && suppliers.data.map((supplier) => {
                                if (!supplier._id || !supplier.companyName) {
                                    console.error('ספק חסר _id או companyName:', supplier);
                                    return null;
                                }
                                return (
                                    <option key={supplier._id} value={supplier._id}>
                                        {supplier.companyName}
                                    </option>
                                );
                            })}
                        </select>

                        <label>בחירת מוצרים להזמנה</label>
                        <div>
                            {isProductsLoading && <p>טוען מוצרים...</p>}
                            {isProductsError && <p>שגיאה בטעינת מוצרים.</p>}
                            {products && products.data && products.data.length > 0 && products.data.map((product) => (
                                <div key={product._id}>
                                    <label>
                                        <input
                                            type="checkbox"
                                            checked={orderData.products.some(
                                                (p) => p.productId === product._id
                                            )}
                                            onChange={(e) =>
                                                handleProductChange(e, product._id)
                                            }
                                        />
                                        {product.productName}
                                    </label>
                                    <input
                                        type="number"
                                        value={
                                            orderData.products.find(
                                                (p) => p.productId === product._id
                                            )?.quantity || product.minimumQuantity || 1
                                        }
                                        onChange={(e) =>
                                            handleQuantityChange(e, product._id)
                                        }
                                        min={product.minimumQuantity || 1}
                                    />
                                </div>
                            ))}
                            <button className="button-form-add-order">הוסף</button>

                        </div>

                    </form>
                </div>
            </PopUp>
        </div>
    );
};

export default AddOrder;
