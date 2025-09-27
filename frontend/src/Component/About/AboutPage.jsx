import '../../CSS/About/About.css'
import gaurd from '../../Images/safe.png'

const AboutPage = () => {
  return <section className='about-main-con'>
    <div className="page">
      <div className="image">
        <div className="first-statement">About <span>&lt;<span>Pass</span>OP&gt;</span></div>
        <div className="second-statement">PassOP – Lock It. Forget It. Secure Forever.</div>
        <div className="third-statement">Pioneering Secure Sharing and Storage for Your Digital Life.</div>
      </div>
      <div className="text-details">
        <div className="text-first">
          <span className='span'>&lt;<span>Pass</span>OP&gt;</span> securely stores all your sensitive information—<span className="highlight">passwords</span>, <span className="highlight">emails</span>, and <span className="highlight">debit/credit cards</span>—with strong <span className="highlight">AES encryption</span>, ensuring that only you have access. Your <span className="highlight">privacy</span> is our top <span className="highlight">priority</span>. we never <span className="highlight">track</span>, <span className="highlight">share</span>, or <span className="highlight">view</span> your <span className="highlight">data</span>.
        </div>
        <div className="text-second">
          <p>Secure  &#x1F6E1;&#xFE0F; & Private &#x1F512;</p>
          <div>
            Your accounts and data are protected with AES encryption, bcrypt hashing, JWT authentication, 2FA, and passwordless login options like fingerprint or face ID. Maximum security, minimum hassle.
          </div>
        </div>
        <div className="text-second">
          <p>Mutual Share Requests &#x1F91D;</p>
          <div>
            Data can only be shared once both users accept the request, giving you complete control over who accesses your information.
          </div>
        </div>
        <div className="text-second">
          <p>Real-time Sync &#x26A1;</p>
          <div>
            All actions—sharing, accepting, rejecting, or updating data—happen instantly using Socket.io, keeping everyone in sync without delays.
          </div>
        </div>
        <div className="text-second">
          <p>Smart Collections &#x1F4C2;</p>
          <div>
            Group your items into collections like Work, School, or Personal. Quickly search and filter to find exactly what you need.
          </div>
        </div>
        <div className="text-second">
          <p>Time-bound Sharing &#x23F3;</p>
          <div>
            Shared items can auto-expire after 1, 7, 15, or 30 days—or never. You set the timer, and PassOP keeps your data safe.
          </div>
        </div>
        <div className="text-second">
          <p>Full Control on Items &#x1F58A;</p>
          <div>
            Perform create, read, update, and delete operations on all your stored data. Even shared items remain under your control at all times.
          </div>
        </div>
        <div className="text-second">
          <p>Secure Notifications &#x1F514;</p>
          <div>
            Stay updated with real-time Firebase FCM notifications for every action—share requests, acceptances, rejections, and deletions—whether your app is open or closed.
          </div>
        </div>
        <div className="text-second">
          <p>Smart Insights &#x1F4CA;</p>
          <div>
            Track password strength, card expiry reminders, and shared/received item analytics with interactive charts and reports.
          </div>
        </div>
        <div className="text-second">
          <p>Smooth Payments &#x1F4B3;</p>
          <div>
            Upgrade easily with Razorpay integration, offering multiple payment methods and instant activation of Pro or Ultimate plans.
          </div>
        </div>
        <div className="text-second">
          <p>Get Started Today &#x1F680;</p>
          <div>
            Join PassOP now and take charge of your digital life with security, simplicity, and complete peace of mind.
          </div>
        </div>
        <div className="text-third">
          <div className="safe-agurd-logo">
            <img src={gaurd} alt="image" height={10} />
          </div>
          <div className="third-text">
            Safer with PassOP
          </div>
        </div>
      </div>
    </div>
  </section>
}

export default AboutPage