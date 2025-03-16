import React from 'react'
import '../CSS/header.css'
import logo from '../Image/icon.png'
import Headertooltip from './Headertooltip'
import Headerslider from './Headerslider'
const Header = () => {
  return (
    <section className="header">
      <header>
        <div className="logo">
          <img src={logo} alt="Logo" />
          <div className="texticon">&lt;<span>Pass</span>OP/&gt;</div>
        </div>
        <nav className="desktop-nav">
          <ul>
            <li>Home</li>
            <li>About</li>
            <li>Contact Us</li>
            <div className="profile">A</div>
          </ul>
        </nav>
        {/* <Headertooltip /> */}
        <div className="ham-profile">A</div>
         {/* <Headerslider /> */}
      </header>
    </section>
  )
}

export default Header
