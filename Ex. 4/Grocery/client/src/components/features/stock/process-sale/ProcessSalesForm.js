import React, { useState } from 'react';
import { useProcessSalesMutation } from '../stockApiSlice';
import "./process.css"
const ProcessSalesForm = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [processSales, { isLoading, isSuccess, isError, error }] = useProcessSalesMutation();
    const [message, setMessage] = useState('');

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!selectedFile) {
            setMessage('יש לבחור קובץ JSON');
            return;
        }

        const reader = new FileReader();
        reader.onload = async (e) => {
            try {
                const salesData = JSON.parse(e.target.result);
                await processSales(salesData).unwrap();
                setMessage('נתוני מכירות נשלחו בהצלחה!');
            } catch (err) {
                console.error('שגיאה בעיבוד קובץ המכירות:', err);
                setMessage(`שגיאה בעיבוד קובץ ה-JSON: ${err.message}`);
            }
        };
        reader.readAsText(selectedFile);
    };

    return (
        <div className='process-sales'>
            <h2>עיבוד מכירות (העלאת קובץ JSON)</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="salesFile">בחר קובץ JSON:</label>
                    <input type="file" id="salesFile" accept=".json" onChange={handleFileChange} required />
                </div>
                <button type="submit" disabled={isLoading}>שלח נתוני מכירות</button>
                {isLoading && <p>מעבד נתונים...</p>}
                {isSuccess && <p>{message}</p>}
                {isError && <p className="error">שגיאה בשליחת נתוני מכירות: {error?.data?.message}</p>}
                {message && !isSuccess && <p>{message}</p>}
            </form>
        </div>
    );
};

export default ProcessSalesForm;