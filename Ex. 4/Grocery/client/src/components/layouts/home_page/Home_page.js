import { Link, NavLink, Navigate, useNavigate } from "react-router-dom";
import "./home_page.css";
import { useEffect } from "react";
import Navbar from "../navbar/Navbar"

const HomePage = () => {

    useEffect(() => {

    }, []);



    return (
        <div className="home-page-casing">
            <Navbar />
            <div className="home-container">
                <div className="sentence-on-market">
                    <div className="sentence1">המכולת שלך, כל מה שצריך במקום אחד</div>
                    <div className="sentence2">מבחר ענק של מוצרים במחירים משתלמים</div>
                    <div className="info-homepage">
                        אצלנו תמצאו מגוון מוצרים טריים ואיכותיים, החל מהמזון הבסיסי ועד למוצרים מיוחדים. כל מה שאתם צריכים, במחירים שפשוט אי אפשר להתחרות בהם.
                    </div>
                    <div className="home-links more_to_read">
                        <Link to={"/stock"} className="home-link more_to_see">
                            למוצרים שלנו
                        </Link>
                    </div>
                </div>
                <div className="grocery">

                    <img className="grocery-image" src="/grocery.png" />
                </div>
            </div>

            <div className="home-about-section">
                <div id="about-section" className="about-section">
                    <h2>על המכולת שלנו</h2>
                    <p>
                        אנחנו דואגים לספק לך את המוצרים האיכותיים ביותר במחירים הטובים ביותר. כל המוצרים שלנו נבחרים בקפידה, עם דגש על טריות ואיכות. בין אם מדובר במזון, מוצרים לבית, או כל דבר אחר, אנחנו כאן כדי לספק לך את כל הצרכים.
                    </p>
                    <p>
                        מכולתנו פועלת עם המון תשוקה ויחס אישי לכל לקוח, ומציעה חווית קנייה נוחה, מהירה ואמינה. אנחנו כאן תמיד לשירותכם!
                    </p>
                </div>
            </div>


        </div>
    );
};

export default HomePage;
