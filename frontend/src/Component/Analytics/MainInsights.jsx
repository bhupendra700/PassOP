import { useContext, useEffect, useState } from 'react'
import '../../CSS/Analytics/insights.css'
import { ContextData } from '../../main'
import noinsites from '../../Images/noinsites.png'
import BarChartVault from './BarChartVault'
import PieChart from './PieChart'
import nochart from "../../Images/noinsites.png"

const MainInsights = () => {
    const { data, user, sentDocs, shareableUsers, recieveableUsers, receivedDocs } = useContext(ContextData);

    const backgroundColor = [
        "#a6cee3", "#fdbf6fbc", "#b2df8aca", "#fb9a99", "#cab2d6",
        "#8c6e3177", "#fbb4ae", "#b3b3b3", "#ffff99", "#c6dbef", "#d9f0a3", "#fee391", "#fdae6b", "#dadaeb",
        "#9ecae1", "#a1d99b", "#bcbddc98", "#9696966e", "#fdd0a2"
    ];

    const borderColor = [
        "#7fb0c6", "#e68f4e", "#8ec97b", "#e36b74", "#9c86b2",
        "#6b4f21", "#e68f86", "#8c8c8c", "#dada66", "#9ec1d9", "#bcd88a", "#fdbf61", "#e48f50", "#bfb2d8",
        "#6b9ec6", "#78b47f", "#9999c1", "#6d6d6d", "#fbb080"
    ];

    const [totalVault, setTotalVault] = useState({
        labels: ["Passwords", "Emails", "Cards"],
        label: "Total Vault Store",
        data: []
    });

    useEffect(() => {
        let passcount = 0
        let emailcount = 0
        let cardcount = 0
        data.map((ele) => {
            if (ele.Doctype === "password") {
                passcount++;
            } else if (ele.Doctype === "email") {
                emailcount++;
            } else {
                cardcount++;
            }
        })

        setTotalVault((prev) => ({
            labels: prev.labels,      // yaha labels fix hain
            label: prev.label,        // chart label
            data: [passcount, emailcount, cardcount] // updated values
        }));
    }, [data])

    const [passwordAnalysis, setPasswordAnalysis] = useState({
        labels: ["Strong", "Moderate", "Week"],
        label: "Password Analysis",
        data: []
    })

    const passwordScore = (password) => {
        let score = 0;

        if (password.length > 8) score++;

        if (/[A-Z]/.test(password)) score++;

        if (/[a-z]/.test(password)) score++;

        if (/[0-9]/.test(password)) score++;

        if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score++;

        return score;
    }

    useEffect(() => {
        let strong = 0;
        let moderate = 0;
        let weak = 0;

        data.map((ele) => {
            if (ele.Doctype === "password") {
                let score = passwordScore(ele.password);
                if (score > 3) strong++;
                else if (score > 1) moderate++;
                else weak++;
            }
        })

        setPasswordAnalysis((prev) => ({
            labels: prev.labels,
            label: prev.label,
            data: [strong, moderate, weak]
        }))
    }, [data])

    const [emailAnalysis, setEmailAnalysis] = useState({
        labels: ["Strong", "Moderate", "Week"],
        label: "Email Analysis",
        data: []
    })

    useEffect(() => {
        let strong = 0;
        let moderate = 0;
        let weak = 0;

        data.map((ele) => {
            if (ele.Doctype === "email") {
                let score = passwordScore(ele.password);
                if (score > 3) strong++;
                else if (score > 1) moderate++;
                else weak++;
            }
        })

        setEmailAnalysis((prev) => ({
            labels: prev.labels,
            label: prev.label,
            data: [strong, moderate, weak]
        }))
    }, [data])

    const [cardTypeAnalysis, setCardTypeAnalysis] = useState({
        labels: ["Debit Card", "Credit Card"],
        label: "Card Type",
        data: []
    })

    useEffect(() => {
        let debit = 0;
        let credit = 0;

        data.map((ele) => {
            if (ele.Doctype === "card") {
                if (ele.card_type === "debit") debit++
                else credit++;
            }
        })

        setCardTypeAnalysis((prev) => ({
            labels: prev.labels,
            label: prev.label,
            data: [debit, credit]
        }))

    }, [data])

    const [cardExpiryAnalysis, setCardExpiryAnalysis] = useState({
        labels: ["Expired", "1 Months", "1-6 Months", "6-12 Months", "> 1 Years"],
        label: "Card Expired",
        data: [2, 5, 10, 60, 20]
    })

    useEffect(() => {
        let expired = 0; //0 month
        let onemonth = 0; // 1 month
        let sixmonth = 0; // 1 - 6 month
        let oneyear = 0; // 6 - 12 month
        let morethanoneyear = 0; // > 1 year

        data.map((ele) => {
            if (ele.Doctype === "card") {
                const expireDate = ele.expiry_date
                const month = parseInt(expireDate.split('/')[0]);
                const year = parseInt(expireDate.split('/')[1]) + 2000;

                let currentYear = new Date().getFullYear();
                let currentMonth = new Date().getMonth() + 1;

                let currTotalMonth = currentYear * 12 + currentMonth //2000 se abhi tak total month

                let TotalMonth = year * 12 + month // 2000 se expiry year tak ka month

                let differentMonth = TotalMonth - currTotalMonth; // current month se expry month tak ka difference with year

                if (differentMonth > 12) morethanoneyear++;
                else if (differentMonth > 6 && differentMonth <= 12) oneyear++
                else if (differentMonth > 1 && differentMonth <= 6) sixmonth++;
                else if (differentMonth == 1) onemonth++;
                else expired++;

            }
        })

        setCardExpiryAnalysis((prev) => ({
            labels: prev.labels,
            label: prev.label,
            data: [expired, onemonth, sixmonth, oneyear, morethanoneyear]
        }))
    }, [data])

    const suffleArray = (array, number) => {
        const newArr = [...array];

        const random = (seed) => {
            let x = Math.sin(seed) * 10000;
            return x - Math.floor(x);
        }

        //fisher yet algo
        for (let i = newArr.length - 1; i > 0; i--) {
            let j = Math.floor(random(number + i) * (i + 1));
            let temp = newArr[i];
            newArr[i] = newArr[j];
            newArr[j] = temp;
        }

        return newArr;
    }

    const [sharedVaults, setSharedVaults] = useState({
        labels: ["Passwords", "Emails", "Cards"],
        label: "Shared Vaults",
        data: []
    })

    useEffect(() => {
        let email = 0;
        let password = 0;
        let cards = 0;

        sentDocs.map((ele) => {
            if (ele.Doctype === "email") email++;
            else if (ele.Doctype === "password") password++;
            else cards++;
        })

        setSharedVaults((prev) => ({
            labels: prev.labels,
            label: prev.label,
            data: [password, email, cards]
        }))
    }, [sentDocs])

    const [expiredPassword, setExpiredPassword] = useState({
        labels: ["1 Days", "7 Days", "15 Days", "30 Days", "Never"],
        label: "Passwords Expired",
        data: []
    })

    useEffect(() => {
        let oneDays = 0;
        let sevenDays = 0;
        let fifteenDays = 0;
        let thirtyDays = 0;
        let Never = 0;

        sentDocs.map((ele) => {
            if (ele.Doctype === "password") {
                let Days = Math.ceil((new Date(ele.expiredAt) - new Date(ele.createdAt)) / (1000 * 60 * 60 * 24));

                if (Days === 1) oneDays++;
                else if (Days === 7) sevenDays++;
                else if (Days === 15) fifteenDays++;
                else if (Days === 30) thirtyDays++;
                else Never++;
            }
        })

        setExpiredPassword((prev) => ({
            labels: prev.labels,
            label: prev.label,
            data: [oneDays, sevenDays, fifteenDays, thirtyDays, Never]
        }))

    }, [sentDocs])

    const [expiredEmails, setExpiredEmails] = useState({
        labels: ["1 Days", "7 Days", "15 Days", "30 Days", "Never"],
        label: "Emails Expired",
        data: []
    })

    useEffect(() => {
        let oneDays = 0;
        let sevenDays = 0;
        let fifteenDays = 0;
        let thirtyDays = 0;
        let Never = 0;

        sentDocs.map((ele) => {
            if (ele.Doctype === "email") {
                let Days = Math.ceil((new Date(ele.expiredAt) - new Date(ele.createdAt)) / (1000 * 60 * 60 * 24));

                if (Days === 1) oneDays++;
                else if (Days === 7) sevenDays++;
                else if (Days === 15) fifteenDays++;
                else if (Days === 30) thirtyDays++;
                else Never++;
            }
        })

        setExpiredEmails((prev) => ({
            labels: prev.labels,
            label: prev.label,
            data: [oneDays, sevenDays, fifteenDays, thirtyDays, Never]
        }))

    }, [sentDocs])

    const [expiredCards, setExpiredCards] = useState({
        labels: ["1 Days", "7 Days", "15 Days", "30 Days", "Never"],
        label: "Cards Expired",
        data: []
    })

    useEffect(() => {
        let oneDays = 0;
        let sevenDays = 0;
        let fifteenDays = 0;
        let thirtyDays = 0;
        let Never = 0;

        sentDocs.map((ele) => {
            if (ele.Doctype === "card") {
                let Days = Math.ceil((new Date(ele.expiredAt) - new Date(ele.createdAt)) / (1000 * 60 * 60 * 24));

                if (Days === 1) oneDays++;
                else if (Days === 7) sevenDays++;
                else if (Days === 15) fifteenDays++;
                else if (Days === 30) thirtyDays++;
                else Never++;
            }
        })

        setExpiredCards((prev) => ({
            labels: prev.labels,
            label: prev.label,
            data: [oneDays, sevenDays, fifteenDays, thirtyDays, Never]
        }))

    }, [sentDocs])

    const [userWithShared, setUserWithShared] = useState({
        labels: [],
        label: "Total Shareable User",
        data: []
    })

    useEffect(() => {
        let userWithCount = new Map();

        let labels = shareableUsers.map((ele) => {
            return ele.name;
        });

        sentDocs.map((ele) => {
            if (userWithCount.has(ele.userId)) {
                userWithCount.set(ele.userId, userWithCount.get(ele.userId) + 1);
            } else {
                userWithCount.set(ele.userId, 1);
            }
        })

        let dataValue = shareableUsers.map((ele) => {
            return userWithCount.has(ele.userId) ? userWithCount.get(ele.userId) : 0
        })

        setUserWithShared((prev) => ({
            labels: labels,
            label: prev.label,
            data: dataValue,
        }))

    }, [sentDocs, shareableUsers])

    const [userWithRecieved, setUserWithRecieved] = useState({
        labels: [],
        label: "Total Recieveable User",
        data: []
    })

    useEffect(() => {
        let userWithCount = new Map();

        let labels = recieveableUsers.map((ele) => {
            return ele.name;
        });

        receivedDocs.map((ele) => {
            if (userWithCount.has(ele.userId)) {
                userWithCount.set(ele.userId, userWithCount.get(ele.userId) + 1);
            } else {
                userWithCount.set(ele.userId, 1);
            }
        })

        let dataValue = recieveableUsers.map((ele) => {
            return userWithCount.has(ele.userId) ? userWithCount.get(ele.userId) : 0
        })

        setUserWithRecieved((prev) => ({
            labels: labels,
            label: prev.label,
            data: dataValue,
        }))

    }, [receivedDocs, recieveableUsers])

    const [recievedVaults, setRecievedVaults] = useState({
        labels: ["Passwords", "Emails", "Cards"],
        label: "Recieved Vaults",
        data: []
    })

    useEffect(() => {
        let email = 0;
        let password = 0;
        let cards = 0;

        receivedDocs.map((ele) => {
            if (ele.Doctype === "email") email++;
            else if (ele.Doctype === "password") password++;
            else cards++;
        })

        setRecievedVaults((prev) => ({
            labels: prev.labels,
            label: prev.label,
            data: [password, email, cards],
        }))
    }, [receivedDocs])

    const [recievedExpiredPassword, setRecievedExpiredPassword] = useState({
        labels: ["1 Days", "7 Days", "15 Days", "30 Days", "Never"],
        label: "Passwords Expired",
        data: []
    })

    useEffect(() => {
        let oneDays = 0;
        let sevenDays = 0;
        let fifteenDays = 0;
        let thirtyDays = 0;
        let Never = 0;

        receivedDocs.map((ele) => {
            if (ele.Doctype === "password") {
                let Days = Math.ceil((new Date(ele.expiredAt) - new Date(ele.createdAt)) / (1000 * 60 * 60 * 24));

                if (Days === 1) oneDays++;
                else if (Days === 7) sevenDays++;
                else if (Days === 15) fifteenDays++;
                else if (Days === 30) thirtyDays++;
                else Never++;
            }
        })

        setRecievedExpiredPassword((prev) => ({
            labels: prev.labels,
            label: prev.label,
            data: [oneDays, sevenDays, fifteenDays, thirtyDays, Never]
        }))

    }, [receivedDocs])

    const [recievedExpiredEmail, setRecievedExpiredEmail] = useState({
        labels: ["1 Days", "7 Days", "15 Days", "30 Days", "Never"],
        label: "Emails Expired",
        data: []
    })

    useEffect(() => {
        let oneDays = 0;
        let sevenDays = 0;
        let fifteenDays = 0;
        let thirtyDays = 0;
        let Never = 0;

        receivedDocs.map((ele) => {
            if (ele.Doctype === "email") {
                let Days = Math.ceil((new Date(ele.expiredAt) - new Date(ele.createdAt)) / (1000 * 60 * 60 * 24));

                if (Days === 1) oneDays++;
                else if (Days === 7) sevenDays++;
                else if (Days === 15) fifteenDays++;
                else if (Days === 30) thirtyDays++;
                else Never++;
            }
        })

        setRecievedExpiredEmail((prev) => ({
            labels: prev.labels,
            label: prev.label,
            data: [oneDays, sevenDays, fifteenDays, thirtyDays, Never]
        }))

    }, [receivedDocs])

    const [recievedExpiredCards, setRecievedExpiredCards] = useState({
        labels: ["1 Days", "7 Days", "15 Days", "30 Days", "Never"],
        label: "Cards Expired",
        data: []
    })

    useEffect(() => {
        let oneDays = 0;
        let sevenDays = 0;
        let fifteenDays = 0;
        let thirtyDays = 0;
        let Never = 0;

        receivedDocs.map((ele) => {
            if (ele.Doctype === "card") {
                let Days = Math.ceil((new Date(ele.expiredAt) - new Date(ele.createdAt)) / (1000 * 60 * 60 * 24));

                if (Days === 1) oneDays++;
                else if (Days === 7) sevenDays++;
                else if (Days === 15) fifteenDays++;
                else if (Days === 30) thirtyDays++;
                else Never++;
            }
        })

        setRecievedExpiredCards((prev) => ({
            labels: prev.labels,
            label: prev.label,
            data: [oneDays, sevenDays, fifteenDays, thirtyDays, Never]
        }))

    }, [receivedDocs])

    const [isPremiumUser, setIsPremiumUser] = useState(false);

    useEffect(() => {
        if (user) {
            setIsPremiumUser(user.plan_type === "Ultimate" || ((user.plan_type === "Pro") && (new Date(user.plan_expiry) > new Date())))
        } else {
            setIsPremiumUser(false);
        }
    }, [user])

    return <section className='main-graph'>
        <div>
            {!(!receivedDocs.length && !sentDocs.length && userWithRecieved.data.every((ele) => ele === 0) && userWithShared.data.every((ele) => ele === 0) && !data.length) ? <>
                {(data.length > 0) && <fieldset className='box-1'>
                    <legend>Secure Storage Analytics</legend>
                    <div>
                        <div className='first'>
                            {!totalVault.data.every((ele) => ele === 0) ? <BarChartVault dataObject={totalVault} backgroundColor={suffleArray(backgroundColor, 5)} borderColor={suffleArray(borderColor, 5)} /> :
                                <div>
                                    <p>{totalVault.label}</p>
                                    <div>
                                        <img src={nochart} alt='image' />
                                    </div>
                                </div>
                            }
                        </div>
                        <div className='second'>
                            <div>
                                {!passwordAnalysis.data.every((ele) => ele === 0) ? <PieChart dataObject={passwordAnalysis} backgroundColor={suffleArray(backgroundColor, 50)} borderColor={suffleArray(borderColor, 50)} /> : <div>
                                    <p>{passwordAnalysis.label}</p>
                                    <div><img src={nochart} alt="No_Chart" height={10} /></div>
                                </div>}
                            </div>
                            <div>
                                {!emailAnalysis.data.every((ele) => ele === 0) ? <BarChartVault dataObject={emailAnalysis} backgroundColor={suffleArray(backgroundColor, 30)} borderColor={suffleArray(borderColor, 30)} /> :
                                    <div>
                                        <p>{emailAnalysis.label}</p>
                                        <div><img src={nochart} alt="No_Chart" height={10} /></div>
                                    </div>
                                }
                            </div>
                        </div>
                        <div className='second'>
                            <div>
                                {!cardExpiryAnalysis.data.every((ele => ele === 0)) ? <BarChartVault dataObject={cardTypeAnalysis} backgroundColor={suffleArray(backgroundColor, 13)} borderColor={suffleArray(borderColor, 13)} /> : <div>
                                    <p>{cardTypeAnalysis.label}</p>
                                    <div><img src={nochart} alt="No_Chart" height={10} /></div>
                                </div>}
                            </div>
                            <div>
                                {!cardExpiryAnalysis.data.every((ele => ele === 0)) ? <PieChart dataObject={cardExpiryAnalysis} backgroundColor={suffleArray(backgroundColor, 27)} borderColor={suffleArray(borderColor, 27)} /> : <div>
                                    <p>{cardExpiryAnalysis.label}</p>
                                    <div><img src={nochart} alt="No_Chart" height={10} /></div>
                                </div>}
                            </div>
                        </div>
                    </div>
                </fieldset>}

                {(isPremiumUser && shareableUsers.length > 0 && sentDocs.length > 0) && <fieldset className='box-1'>
                    <legend>Shared Vaults Analytics</legend>
                    <div>
                        <div className='first'>
                            {!userWithShared.data.every((ele) => ele === 0) ? <BarChartVault dataObject={userWithShared} backgroundColor={suffleArray(backgroundColor, 5)} borderColor={suffleArray(borderColor, 5)} /> :
                                <div>
                                    <p>{userWithShared.label}</p>
                                    <div>
                                        <img src={nochart} alt='image' height={20} />
                                    </div>
                                </div>}
                        </div>
                        <div className='second'>
                            <div>
                                {!sharedVaults.data.every((ele) => ele === 0) ? <PieChart dataObject={sharedVaults} backgroundColor={suffleArray(backgroundColor, 40)} borderColor={suffleArray(borderColor, 40)} /> : <div>
                                    <p>{sharedVaults.label}</p>
                                    <div><img src={nochart} alt="No_Chart" height={10} /></div>
                                </div>}
                            </div>
                            <div>
                                {!expiredPassword.data.every((ele) => ele === 0) ? <BarChartVault dataObject={expiredPassword} backgroundColor={suffleArray(backgroundColor, 110)} borderColor={suffleArray(borderColor, 110)} /> : <div>
                                    <p>{expiredPassword.label}</p>
                                    <div><img src={nochart} alt="No_Chart" height={10} /></div>
                                </div>}
                            </div>
                        </div>
                        <div className='second'>
                            <div>
                                {!expiredEmails.data.every((ele) => ele === 0) ? <BarChartVault dataObject={expiredEmails} backgroundColor={suffleArray(backgroundColor, 120)} borderColor={suffleArray(borderColor, 120)} /> : <div>
                                    <p>{expiredEmails.label}</p>
                                    <div><img src={nochart} alt="No_Chart" height={10} /></div>
                                </div>}
                            </div>
                            <div>
                                {!expiredCards.data.every((ele) => ele === 0) ? <PieChart dataObject={expiredCards} backgroundColor={suffleArray(backgroundColor, 130)} borderColor={suffleArray(borderColor, 130)} /> : <div>
                                    <p>{expiredCards.label}</p>
                                    <div><img src={nochart} alt="No_Chart" /></div>
                                </div>}
                            </div>
                        </div>
                    </div>
                </fieldset>}

                {(isPremiumUser && receivedDocs.length > 0 && recieveableUsers.length > 0) && <fieldset className='box-1'>
                    <legend>Recieved Vaults Analytics</legend>
                    <div>
                        <div className='first'>
                            {!userWithRecieved.data.every((ele) => ele === 0) ? <BarChartVault dataObject={userWithRecieved} backgroundColor={suffleArray(backgroundColor, 57)} borderColor={suffleArray(borderColor, 57)} /> :
                                <div>
                                    <p>{userWithRecieved.label}</p>
                                    <div>
                                        <img src={nochart} alt='image' height={20} />
                                    </div>
                                </div>
                            }
                        </div>
                        <div className='second'>
                            <div>
                                {!recievedVaults.data.every((ele) => ele === 0) ? <PieChart dataObject={recievedVaults} backgroundColor={suffleArray(backgroundColor, 43)} borderColor={suffleArray(borderColor, 43)} /> : <div>
                                    <p>{recievedVaults.label}</p>
                                    <div><img src={nochart} alt="No_Chart" height={10} /></div>
                                </div>}
                            </div>
                            <div>
                                {!recievedExpiredPassword.data.every((ele) => ele === 0) ? <BarChartVault dataObject={recievedExpiredPassword} backgroundColor={suffleArray(backgroundColor, 227)} borderColor={suffleArray(borderColor, 227)} /> : <div>
                                    <p>{recievedExpiredPassword.label}</p>
                                    <div><img src={nochart} alt="No_Chart" height={10} /></div>
                                </div>}
                            </div>
                        </div>
                        <div className='second'>
                            <div>
                                {!recievedExpiredEmail.data.every((ele) => ele === 0) ? <BarChartVault dataObject={recievedExpiredEmail} backgroundColor={suffleArray(backgroundColor, 186)} borderColor={suffleArray(borderColor, 186)} /> : <div>
                                    <p>{recievedExpiredEmail.label}</p>
                                    <div><img src={nochart} alt="No_Chart" height={10} /></div>
                                </div>}
                            </div>
                            <div>
                                {!recievedExpiredCards.data.every((ele) => ele === 0) ? <PieChart dataObject={recievedExpiredCards} backgroundColor={suffleArray(backgroundColor, 197)} borderColor={suffleArray(borderColor, 197)} /> : <div>
                                    <p>{recievedExpiredCards.label}</p>
                                    <div><img src={nochart} alt="No_Chart" height={10} /></div>
                                </div>}
                            </div>
                        </div>
                    </div>
                </fieldset>}
            </> :
                <div className="empty">
                    <img src={noinsites} alt="logo" />
                </div>
            }
        </div>
    </section>
}

export default MainInsights