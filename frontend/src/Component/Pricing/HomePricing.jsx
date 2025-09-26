import { CircularProgress } from '@mui/material';
import '../../CSS/Pricing/price.css'
import { FaIndianRupeeSign } from "react-icons/fa6";
import useWindowSize from '../../Functions/useWindowSize';
import { useContext } from 'react';
import { ContextData } from "../../main"

function HomePricing() {
    const size = useWindowSize();

    const { notify } = useContext(ContextData)

    return <section className='pricing-con'>
        <div className={`${size < 800 ? "wrap" : ""}`}>
            <div className="price-cards">
                <div>
                    <div>Free</div>
                    <div><FaIndianRupeeSign className='currency' /> <span>0</span> INR / Month</div>
                    <div>Free Forever</div>
                    <div>
                        <div>Ideal for newcomers:</div>
                        <div>
                            <p><i className="ri-lock-2-line"></i> Store up to 50 items – Passwords, Cards & Emails</p>
                            <p><i className="ri-user-shared-2-line"></i> Share with up to 5 users at a time</p>
                            <p><i className="ri-time-line"></i> 10 items/day sharing limit</p>
                            <p><i className="ri-calendar-line"></i> Expiry options: 1 Day & 7 Days only</p>
                            <p><i className="ri-bar-chart-box-line"></i> Basic Insights – Monitor stored items with detailed password and email strength analysis, along with comprehensive card insights including card type and expiry reminders.</p>
                            <p><i className="ri-folder-line"></i> Manage up to 2 Collections</p>
                        </div>
                    </div>
                </div>
                <div onClick={()=>{notify("info", "Kindly log in before making a purchase");}}>Get Free</div>
            </div>

            <div className="price-cards">
                <div>
                    <div>Pro</div>
                    <div><FaIndianRupeeSign className='currency' /> <span>999</span> INR / Year</div>
                    <div>Annual Subscription</div>
                    <div>
                        <div>For power users who share frequently:</div>
                        <div>
                            <p><i className="ri-database-2-line"></i> Unlimited Storage – Passwords, Cards & Emails</p>
                            <p><i className="ri-user-follow-line"></i> Unlimited Sharing – With unlimited users at a time.</p>
                            <p><i className="ri-infinity-line"></i> No Daily Limit – Share as many items as you want every day.</p>
                            <p><i className="ri-calendar-line"></i> Smart Expiry Controls – Choose 1 Day, 7 Days, 15 Days, 30 Days, or Never</p>
                            <p><i className="ri-pie-chart-line"></i> Advanced Analytics – Get complete visibility into stored, shared, and received items with expiry tracking, recipient-level history, and detailed insights across passwords, emails, and cards for smarter management.</p>
                            <p><i className="ri-folder-2-line"></i> Unlimited Collections – Organize items freely.</p>
                        </div>
                    </div>
                </div>
                <div onClick={() => {
                    notify("info", "Kindly log in before making a purchase");
                }}>Get Pro</div>
            </div>

            <div className="price-cards">
                <div>
                    <div>Ultimate</div>
                    <div><FaIndianRupeeSign className='currency' /> <span>9999</span> INR / Lifetime access</div>
                    <div>One-Time Payment</div>
                    <div>
                        <div>The complete premium experience:</div>
                        <div>
                            <p><i className="ri-database-2-line"></i> Unlimited Storage – Passwords, Cards & Emails</p>
                            <p><i className="ri-user-follow-line"></i> Unlimited Sharing – With unlimited users at a time.</p>
                            <p><i className="ri-infinity-line"></i> No Daily Limit – Share as many items as you want every day.</p>
                            <p><i className="ri-calendar-line"></i> Smart Expiry Controls – Choose 1 Day, 7 Days, 15 Days, 30 Days, or Never</p>
                            <p><i className="ri-pie-chart-line"></i> Advanced Analytics – Get complete visibility into stored, shared, and received items with expiry tracking, recipient-level history, and detailed insights across passwords, emails, and cards for smarter management.</p>
                            <p><i className="ri-folder-2-line"></i> Unlimited Collections – Organize items freely.</p>
                        </div>
                    </div>
                </div>
                <div onClick={() => {
                    notify("info", "Kindly log in before making a purchase");
                }}>Get Ultimate</div>
            </div>
        </div>
    </section>
}

export default HomePricing;