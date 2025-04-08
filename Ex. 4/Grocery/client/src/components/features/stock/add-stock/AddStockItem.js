import React, { useState } from 'react';
import { useAddStockItemMutation } from '../stockApiSlice';
import { useNavigate } from 'react-router-dom';
import "./add-stock.css"

const AddStockItemForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        uniqueId: '',
        minimumQuantity: 0,
    });
    const [addStockItem, { isSuccess, isError, error }] = useAddStockItemMutation();
    const navigate = useNavigate();

    const { name, uniqueId, minimumQuantity } = formData;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await addStockItem(formData).unwrap();
            setFormData({ name: '', uniqueId: '', minimumQuantity: 0 });
            navigate('/stock');
        } catch (err) {
            console.error('Failed to add stock item: ', err);
        }
    };

    return (
        <div className='add-stock'>
            <h2>הוספת פריט מלאי חדש</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="name">שם המוצר:</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={name}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="uniqueId">מק"ט/ברקוד:</label>
                    <input
                        type="text"
                        id="uniqueId"
                        name="uniqueId"
                        value={uniqueId}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="minimumQuantity">כמות מינימלית:</label>
                    <input
                        type="number"
                        id="minimumQuantity"
                        name="minimumQuantity"
                        value={minimumQuantity}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit">הוסף פריט מלאי</button>
                {isSuccess && <p>פריט מלאי נוסף בהצלחה!</p>}
                {isError && <p className="error">שגיאה בהוספת פריט מלאי: {error?.data?.message}</p>}
            </form>
        </div>
    );
};

export default AddStockItemForm;