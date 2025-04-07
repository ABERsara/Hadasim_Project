
import "./footer.css";
import { 
    useEffect } from 'react';

const Footer = () => {


  useEffect(() => {
    
  }, []);



  return (
    <div className="footer">
  <div className="formContact">
    <h2 className="contactSection">Contact Us</h2>
    <div className="add-form-contact">
      <div className="contact-item">כתובת: מרקט 123, תל אביב</div>
      <div className="contact-item">טלפון: 052-1234567</div>
      <div className="contact-item">מייל: avi@grocery.com</div>
    </div>
  </div>
</div>
  );
}

export default Footer;
