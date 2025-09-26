import { CircularProgress } from '@mui/material';
import '../../CSS/Pricing/price.css'
import { FaIndianRupeeSign } from "react-icons/fa6";
import useWindowSize from '../../Functions/useWindowSize';
import { paymentAxios } from '../../config/axiosconfig';
import { useContext, useEffect, useState } from 'react';
import { ContextData } from "../../main"
import logo from "../../Images/icon1.png"

function MainPricing() {
    const size = useWindowSize();

    const { user, setUser, notify } = useContext(ContextData)

    const [loader, setLoader] = useState(0);

    const razorpayPayment = async (currency, amount) => {
        try {
            setLoader(amount);
            const response = await paymentAxios.post('/create-order', { amount, currency })

            const { id: order_id, amount: order_amount, currency: order_currency } = response.data.createdOrder;

            const option = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID,
                amount: order_amount,
                currency: order_currency,
                name: "PassOP – Vault for Passwords",
                description: amount === 999 ? "Pro Plan – ₹999" : "Ultimate Plan – ₹9999",
                order_id,
                image: logo,
                handler: async (response) => {
                    try {
                        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = response;
                        const { data: verifyPayment } = await paymentAxios.post('/verify-payment', { razorpay_order_id, razorpay_payment_id, razorpay_signature, plan_type: amount === 999 ? "Pro" : "Ultimate" });

                        if (verifyPayment.success) {
                            const currentDate = new Date();
                            const oneYearLater = new Date(currentDate);
                            oneYearLater.setFullYear(currentDate.getFullYear() + 1);

                            setUser({ ...user, plan_type: amount === 999 ? "Pro" : "Ultimate", plan_expiry: amount === 999 ? oneYearLater.toString() : null })
                            notify("success", `Your payment was successful. The ${amount === 999 ? "Pro" : "Ultimate"} Plan has been activated on your account.`)
                            console.log(verifyPayment);
                        }
                    } catch (error) {
                        notify("error", "Payment failed. Please retry or use another payment method.")
                        console.log(error);
                    }
                },
                prefill: {
                    name: user.name,
                    email: user.email,
                },
                theme: {
                    color: "#299f29"
                },
                method: {
                    card: true,
                    netbanking: true,
                    wallet: true,
                    upi: true,
                    emi: false,
                    paylater: false
                }
            }

            const paymentObject = new window.Razorpay(option);

            paymentObject.on('payment.failed', function (response) {
                notify("error", "Payment Failed");
                // console.log("error: ", response.error.description);
            });

            paymentObject.on('checkout.dismiss', function () {
                notify("error", "Payment Failed")
                // console.log("error: ", "Something went wrong");
            });

            paymentObject.open();
            setLoader(0);
        } catch (error) {
            setLoader(0);
            notify("error", "Payment failed. Please try again or use a different payment method.")
        }
    }

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
                <div className='free'>{((user?.plan_type === "Ultimate") || (user?.plan_type === "Pro" && new Date(user?.plan_expiry) > new Date())) ? "Get Free" : "Your current plan"}</div>
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
                {((user?.plan_type === "Ultimate") || ((user?.plan_type === "Pro") && (new Date() < new Date(user.plan_expiry)))) ? <div className='free'>{user?.plan_type === "Ultimate" ? "Get Pro" : "Your Current Plan"}</div> : !(loader === 999) ? <div onClick={() => { razorpayPayment("INR", 999) }}>Get Pro</div> :
                    <div><CircularProgress className="loader" size={25} /></div>}
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
                {user?.plan_type === "Ultimate" ? <div className='free'>Your Current Plan</div> : !(loader === 9999) ? <div onClick={() => { razorpayPayment("INR", 9999) }}>Get Ultimate</div> :
                    <div><CircularProgress className="loader" size={25} /></div>}
            </div>
        </div>
    </section>
}

export default MainPricing