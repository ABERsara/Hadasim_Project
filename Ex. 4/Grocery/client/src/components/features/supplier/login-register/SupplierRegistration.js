import React, { useEffect, useState } from 'react';
import { useRegisterMutation } from '../../../../app/auth/authApiSlice';
import { useAddProductMutation, useGetAllProductsQuery } from '../../products/productApiSlice';
import { useNavigate } from 'react-router-dom';
import PopUp from "../../../layouts/Popup"
import "./register.css"

const SupplierRegistration = () => {
    const [supplierData, setSupplierData] = useState({
        companyName: '',
        phoneNumber: '',
        representativeName: '',
        password: '',
        goodsList: [],
    });
    const [approvedProducts, setApprovedProducts] = useState([]);
    const [selectedRegister, setSelectedRegister] = useState(false);

    const navigate = useNavigate();

    const [registerSupplier, { isLoading, isError, isSuccess }] = useRegisterMutation();
    const [newProducts, setNewProducts] = useState([{ productName: '', price: 0, minimumQuantity: 1 }]);

    const { data: productsData, isLoading: isProductsLoading, isError: isProductsError } = useGetAllProductsQuery();
    const [addProductMutation,
        // { isSuccess: isAddingSuccess, isLoading: isAddingLoading }
    ] = useAddProductMutation();
    const [addingProducts, setAddingProducts] = useState(false);
    const [showProductsPopup, setShowProductsPopup] = useState(false);

    const sortedProducts = productsData?.data && Array.isArray(productsData.data)
        ? [...productsData.data].sort((a, b) => a.productName.localeCompare(b.productName, 'he'))
        : [];
    useEffect(() => {
        if (isSuccess) {
            setSupplierData({
                companyName: '',
                phoneNumber: '',
                representativeName: '',
                password: '',
                goodsList: [],
            });
            setNewProducts([{ productName: '', price: 0, minimumQuantity: 1 }]);
            setAddingProducts(false);
            navigate('/suppliers');
        }
    }, [isSuccess]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSupplierData({ ...supplierData, [name]: value });
    };

    const handleNewProductChange = (index, field, value) => {
        const newProductsCopy = [...newProducts];
        newProductsCopy[index][field] = field === 'price' ? parseFloat(value) : value;
        setNewProducts(newProductsCopy);
    };

    const addProduct = () => {
        setNewProducts([...newProducts, { productName: '', price: 0, minimumQuantity: 1 }]);
    };

    const handleExistingProductSelection = (productId, isChecked) => {
        if (isChecked) {
            setSupplierData({
                ...supplierData,
                goodsList: [...supplierData.goodsList, productId],
            });
        } else {
            setSupplierData({
                ...supplierData,
                goodsList: supplierData.goodsList.filter((id) => id !== productId),
            });
        }
    };

    const handleAddProducts = async () => {
        try {
            const productsToAdd = await Promise.all(
                newProducts.map(async (product) => {
                    try {
                        const response = await addProductMutation(product).unwrap();
                        return response._id;
                    } catch (err) {
                        if (err.data && err.data.message) {
                            alert(err.data.message);
                            return null;
                        } else {
                            throw err;
                        }
                    }
                })
            );
            return productsToAdd.filter((id) => id !== null);
        } catch (err) {
            console.error('Failed to add products: ', err);
            return [];
        }
    };

    const handleRegisterSupplier = async (goodsList) => {
        try {
            await registerSupplier({
                ...supplierData,
                goodsList: goodsList,
            }).unwrap();
        } catch (err) {
            console.error('Failed to register supplier: ', err);
            throw err;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            let validProductsToAdd = [];
            if (addingProducts) {
                validProductsToAdd = await handleAddProducts();
            }

            const goodsListToSubmit = [...supplierData.goodsList];
            if (validProductsToAdd.length > 0) {
                goodsListToSubmit.push(...validProductsToAdd);
            }

            await handleRegisterSupplier(goodsListToSubmit);

            setSupplierData({
                companyName: '',
                phoneNumber: '',
                representativeName: '',
                password: '',
                goodsList: [],
            });
            setNewProducts([{ productName: '', price: 0, minimumQuantity: 1 }]);
            setAddingProducts(false);

        } catch (err) {
            console.error('Failed to submit form: ', err);
        }
    };
    const closeModal = () => {
        setSelectedRegister(false);
    };
    const closeModalProducts = () => {
        setAddingProducts(false)
    }
    const closeModalProductsMarking = () => {
        setShowProductsPopup(false)
    }
    const handleApproveProduct = async (product) => {
        try {
            const response = await addProductMutation(product).unwrap();
            setApprovedProducts([...approvedProducts, response._id]);
            setSupplierData({
                ...supplierData,
                goodsList: [...supplierData.goodsList, response._id],
            });
            setNewProducts(newProducts.filter((p, index) => index !== newProducts.indexOf(product))); // הסרת המוצר מרשימת המוצרים החדשים
        } catch (err) {
            if (err.data && err.data.message) {
                alert(err.data.message);
            } else {
                console.error('Failed to add product: ', err);
            }
        }
    };


    return (
        <div>
            <button className="login-from-home" onClick={() => setSelectedRegister(true)}>הרשמה</button>
            {selectedRegister && <PopUp width={'400px'} close={closeModal} className="pop-up">
                <div className='register-page'>
                    <form id="registerForm" className="register-page-form" onSubmit={handleSubmit}>
                        <img src="/xMark.png" alt="close" className="img-back-register" onClick={closeModal} />
                        <h1 className="register-h1">איזה כיף לעבוד איתך!</h1>
                        <div className='register-inputs'>
                            <div className='input-register-section'>
                                <div>
                                    <label className="register-item name">שם חברה:</label>
                                    <input type="text" name="companyName" value={supplierData.companyName} onChange={handleChange} required />
                                </div>
                                <div>
                                    <label className="register-item password">מספר טלפון:</label>
                                    <input type="tel" name="phoneNumber" value={supplierData.phoneNumber} onChange={handleChange} required />
                                </div>
                                <div>
                                    <label className="register-item password">שם נציג:</label>
                                    <input type="text" name="representativeName" value={supplierData.representativeName} onChange={handleChange} required />
                                </div>
                                <div>
                                    <label className="register-item password">סיסמה:</label>
                                    <input type="password" name="password" value={supplierData.password} onChange={handleChange} required />
                                </div>
                                <div className="product-buttons-row">
                                    <button type="button" onClick={() => setShowProductsPopup(true)}>
                                        בחר מוצרים קיימים
                                    </button>
                                    <button type="button" onClick={() => setAddingProducts(true)}>
                                        הוסף מוצרים חדשים
                                    </button>
                                </div>

                            </div>
                        </div>
                        {showProductsPopup && (
                            <PopUp width={'600px'} close={closeModalProductsMarking} className="pop-up-Marking-products-registration" >
                                {showProductsPopup && (
                                    <div className="products-popup">
                                        <img src="/xMark.png" alt="close" className="img-back" onClick={closeModalProductsMarking} />
                                        <h3>בחר מוצרים</h3>
                                        {sortedProducts.map((product) => {
                                            const isChecked = supplierData.goodsList.includes(product._id);
                                            return (
                                                <div key={product._id} className="checkbox-container">
                                                    <label>
                                                        <input
                                                            type="checkbox"
                                                            value={product._id}
                                                            checked={isChecked}
                                                            onChange={(e) => handleExistingProductSelection(product._id, e.target.checked)}
                                                        />
                                                        {product.productName} - מחיר: {product.price} ₪, כמות מינימלית: {product.minimumQuantity}
                                                    </label>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </PopUp>)}
                        {addingProducts && (
                            <PopUp width={'400px'}close={closeModalProducts} className="pop-up-add-products-registration" >
                                <img src="/xMark.png" alt="close" className="img-back" onClick={closeModalProducts} />
                                <h1>מוצרים חדשים:</h1>
                                {newProducts.map((product, index) => (
                                    <div key={index} className="input-row">
                                        <input
                                            type="text"
                                            placeholder="שם מוצר"
                                            value={product.productName}
                                            onChange={(e) => handleNewProductChange(index, 'productName', e.target.value)}
                                            required
                                        />
                                        <input
                                            type="number"
                                            placeholder="מחיר מוצר"
                                            value={product.price}
                                            onChange={(e) => handleNewProductChange(index, 'price', e.target.value)}
                                            step="0.01"
                                            min="1"
                                            required
                                        />
                                        <input
                                            type="number"
                                            placeholder="כמות מינימלית"
                                            value={product.minimumQuantity}
                                            onChange={(e) => handleNewProductChange(index, 'minimumQuantity', parseInt(e.target.value))}
                                            min="1"
                                            required
                                        />
                                        <button type="button" onClick={() => handleApproveProduct(product)}>אישור</button>
                                    </div>
                                ))}
                                <button className="add-product-button" type="button" onClick={addProduct}>הוסף מוצר</button>
                            </PopUp>
                        )}
                        <button type="submit" disabled={isLoading}>רשום ספק</button>

                        {isSuccess && <p>ספק נרשם בהצלחה!</p>}
                        {isError && <p className="error">שגיאה ברישום הספק.</p>}
                    </form>
                </div>
            </PopUp>}
        </div>
    );
};

export default SupplierRegistration;

