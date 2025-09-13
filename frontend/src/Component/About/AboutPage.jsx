import '../../CSS/About/About.css'
import gaurd from '../../Images/safe.png'

const AboutPage = () => {
  return <section className='about-main-con'>
    <div className="page">
      <div className="image">
        <div className="first-statement">About <span>&lt;<span>Pass</span>OP&gt;</span></div>
        <div className="second-statement">PassOP – Lock It. Forget It. Secure Forever.</div>
        <div className="third-statement">Pioneering Password Protection for a Safer Digital World.</div>
      </div>
      <div className="text-details">
        <div className="text-first">
          <span className='span'>&lt;<span>Pass</span>OP&gt;</span> securely stores all your passwords with strong <span className="highlight">AES encryption</span>, ensuring only you have access. Your <span className="highlight">privacy</span> is our <span className="highlight">priority</span>—we never <span className="highlight">track</span>, <span className="highlight">share</span>, or <span className="highlight">view</span> your data.
        </div>
        <div className="text-second">
          <p>Secure  &#x1F6E1;&#xFE0F; & Private &#x1F512;</p>
          <div>
            All passwords are encrypted and fully private, giving you peace of mind.
          </div>
        </div>
        <div className="text-second">
          <p>Completely Free &#x1F4B8;</p>
          <div>
            No subscriptions, no hidden fees—just safe and easy password management.
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
            <img src={gaurd} alt="image" height={10}/>
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