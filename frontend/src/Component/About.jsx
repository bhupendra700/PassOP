import React from 'react'
import '../CSS/about.css'

const About = () => {
  return (
    <section className="about-page">
      <div className="title1">
      <h1>About <span className="span1">&lt;<span>Pass</span>OP/&gt;</span> - Your Secure Password Manager</h1>
      <div>
        In today's digital world, security is everything. Passop is a powerful and secure password manager designed to keep your credentials safe while ensuring complete privacy. We understand the importance of protecting your personal data, which is why even we cannot see your passwords.
      </div>
    </div>
<div className="title2">
      <h3>🔒 Unbreakable Security</h3>
      <div>
        Every password you save in Passop is securely encrypted using bcrypt hashing before being stored in our MongoDB database. This means that no one—not even us—can access or view your original password.
      </div>
</div>
<div className="title3">
      <h3>🛡️ Privacy First</h3>
      <div>
        Your data is yours alone. No other user can access your stored credentials, and we do not track or share any of your information.
      </div>
</div>
<div className="title4">
      <h3>📩 Need Help? Contact Us</h3>
      <div>
        If you ever face any issues, our dedicated support team is here to help. Simply reach out via email through our contact section, and we'll assist you as soon as possible.
      </div>
</div>

<h2>🚀 Start using <span className="span2">&lt;<span>Pass</span>OP/&gt;</span> today and secure your digital world with confidence!</h2>
    </section>
  )
}

export default About
