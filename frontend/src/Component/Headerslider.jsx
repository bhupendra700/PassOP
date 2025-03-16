import React from "react";

const Headerslider = () => {
  return (
    <div className="slider">
      <div className="cross">
        <i className="ri-close-large-fill"></i>
      </div>
      <div className="ham-nav">
        <div className="ham-nav-profile">A</div>
        <div className="slider-name">Name: Bhupendra Yadav</div>
        <div className="slider-email">
          Email:
          <span title="bhupendra7021@gmail.com">bhupendra7021@gmail.com</span>
        </div>
        <div className="slider-password">Total Password: 0</div>
        <div className="home">
          <i className="ri-home-4-fill"></i> Home
        </div>
        <div className="about">
          <i className="ri-info-card-fill"></i> About
        </div>
        <div className="contactus">
          <i className="ri-contacts-fill"></i> Contact Us
        </div>
        <div className="contactus">
          <i className="ri-logout-box-r-fill"></i> Logout
        </div>
        <div className="contactus">
          <i className="ri-delete-bin-2-fill"></i>Delete Account
        </div>
      </div>
    </div>
  );
};

export default Headerslider;
