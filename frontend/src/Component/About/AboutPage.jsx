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
          <span className='span'>&lt;<span>Pass</span>OP&gt;</span> securely stores all your sensitive information—<span className="highlight">passwords</span>, <span className="highlight">emails</span>, and <span className="highlight">debit/credit cards</span>—with strong <span className="highlight">AES encryption</span>, ensuring that only you have access. Your <span className="highlight">privacy</span> is our top <span className="highlight">priority</span>: we never <span className="highlight">track</span>, <span className="highlight">share</span>, or <span className="highlight">view</span> your data.
        </div>
        <div className="text-second">
          <p>Secure  &#x1F6E1;&#xFE0F; & Private &#x1F512;</p>
          <div>
            All your passwords, emails, and card details are encrypted and fully private, giving you complete peace of mind. Share items securely with trusted users, and enjoy real-time updates with our advanced Socket.io integration.
          </div>
        </div>
        <div className="text-second">
          <p>Mutual Share Requests &#x1F91D;</p>
          <div>
            Items can only be shared after a mutual request is accepted by both users, ensuring complete control over who can access your data.
          </div>
        </div>
        <div className="text-second">
          <p>Real-time Updates &#x26A1;</p>
          <div>
            All shared items, requests, and changes update instantly using Socket.io, keeping everyone in sync.
          </div>
        </div>
        <div className="text-second">
          <p>Collection-based Organization &#x1F4C2;</p>
          <div>
            Organize your passwords, emails, and cards into custom collections like Work, School, or Personal for easy management.
          </div>
        </div>
        <div className="text-second">
          <p>Time-bound Sharing &#x23F3;</p>
          <div>
            Shared items can automatically disappear after the timer set by the sharing user, keeping your sensitive data safe.
          </div>
        </div>
        <div className="text-second">
          <p>Full CRUD on Shared Items &#x1F58A;</p>
          <div>
            Users can add, edit, or delete items even after sharing, maintaining full control over their information.
          </div>
        </div>
        <div className="text-second">
          <p>Secure Notifications &#x1F514;</p>
          <div>
            Every action—share request, acceptance, rejection, or deletion—triggers Firebase FCM notifications, keeping all users informed in real-time.
          </div>
        </div>
        <div className="text-second">
          <p>Completely Free &#x1F4B8;</p>
          <div>
            No subscriptions, no hidden fees—just a secure, easy-to-use platform to manage your digital life safely.
          </div>
        </div>
        <div className="text-second">
          <p>Get Started &#x1F680;</p>
          <div>
            Start using PassOP today and keep your digital life secure!
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