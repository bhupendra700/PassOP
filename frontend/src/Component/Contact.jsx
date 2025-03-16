import React from 'react'
import '../CSS/contact.css'

const Contact = () => {
  return (
    <section className="contact-page">
    <form>
      <h1>Contact Us</h1>
      <div className="con-name">
        <label for="name">Name</label>
        <input type="text" placeholder="Enter Your name" />
      </div>
      <div className="con-email">
        <label for="email">Email</label>
        <input type="email" placeholder="Enter Your email" />
      </div>
      <div className="message">
        <label for="message">Message</label>
        <textarea id="message" cols="5" rows="10" placeholder="Write Message here"></textarea>
      </div>
      <button type="submit">Submit</button>
    </form>
  </section>
  )
}

export default Contact
