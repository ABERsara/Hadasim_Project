import { useLoginMutation } from "../../../../app/auth/authApiSlice";
import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import { setCredentials } from '../../../../app/auth/authSlice';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { selectedToken } from '../../../../app/auth/authSlice'
import PopUp from "../../Popup"
import "./login-register.css"
const LoginPage = () => {
    const dispatch = useDispatch();
    const [login] = useLoginMutation();
    const token = useSelector(selectedToken);
    const [selectLogin, setSelectedlogin] = useState(false);
    const [formData, setFormData] = useState({
        phoneNumber: '',
        password: '',
        rememberMeLogin: false,
    });
    const navigate=useNavigate()
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value,
        });
    };
    const onsubmit = async (e) => {
        e.preventDefault();

        if (!formData.phoneNumber || !formData.password) {
            return false;
        }

        const supObject = {
            phoneNumber: formData.phoneNumber,
            password: formData.password,
        };
        console.log("phone number: " + formData.phoneNumber, "password: " + formData.password);
        try {
            const res = await login(supObject).unwrap();
            console.log("Response from login:", res);
            if (res && res.accessToken) {
                dispatch(setCredentials({ accessToken: res.accessToken }));
                console.log("Token stored:", res.accessToken);
                if (formData.rememberMeLogin) {
                    localStorage.setItem('supplier', JSON.stringify(res));
                    console.log("remember " + formData.phoneNumber);
                }
                navigate("/suppliers");
            }
        } catch (err) {
            console.log('Error during login:', err);
        }
    };

    const closeModal = () => {
        setSelectedlogin(false);
    };
    return (
        <div>
            <button className="login-from-home" onClick={() => setSelectedlogin(true)}>התחברות</button>
            {selectLogin ? <PopUp width={'350px'} close={closeModal}>
                <div className="login-page">
                    <form id="loginForm" className="login-page-form" onSubmit={onsubmit}>
                        <img src="assets/xMark.png" alt="close" className="img-back" onClick={closeModal} />
                        <h1 className="login-h1">איזה כיף לעבוד איתך!</h1>
                        <div>
                            <label className="login-item name">מספר נייד:</label>
                            <input type="text" required name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} />
                        </div>
                        <div className="login-item password">
                            <label className="login-item password">סיסמא:</label>
                            <input type="password" required name="password" value={formData.password} onChange={handleChange} />
                        </div>
                        <div className="login-item checkbox">
                            <label>
                                <input type="checkbox" name="rememberMeLogin" checked={formData.rememberMeLogin} onChange={handleChange} /> זכור אותי
                            </label>
                        </div>
                        <button type="submit">אני רוצה להיכנס!</button>
                        <div id="error-message" className="error-message"></div>
                    </form>
                </div>
            </PopUp> : null}
        </div>
    );
};

export default LoginPage;