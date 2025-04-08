import React from 'react';
import { useGetAllStockItemsQuery } from '../stockApiSlice';
import "./stock-list.css"
const StockItemsList = () => {
    const { data: stockData, isLoading, isError, error } = useGetAllStockItemsQuery();

    let content;

    if (isLoading) {
        content = <p>טוען מלאי...</p>;
    } else if (isError) {
        content = <p className="error">שגיאה בטעינת מלאי: {error?.data?.message}</p>;
    } else if (stockData?.data) {
        content = (
            <table>
                <thead>
                    <tr>
                        <th>שם המוצר</th>
                        <th>מק"ט/ברקוד</th>
                        <th>כמות נוכחית</th>
                        <th>כמות מינימלית</th>
                    </tr>
                </thead>
                <tbody>
                    {stockData.data.map(item => (
                        <tr key={item._id}>
                            <td>{item.name}</td>
                            <td>{item.uniqueId}</td>
                            <td>{item.currentQuantity}</td>
                            <td>{item.minimumQuantity}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        );
    }

    return (
        <div className='stock-list'>
            <h2>רשימת פריטי מלאי</h2>
            {content}
        </div>
    );
};

export default StockItemsList;