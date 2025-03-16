import React from "react";

const Headertooltip = () => {
  return (
    <div className="tooltip">
      <div className="name">Name: Bhupendra Yadav</div>
      <div className="email">Email: bhupendra7021@gmail.com</div>
      <div className="email">Total Password: 10</div>
      <button>
        <i className="ri-logout-box-r-fill"></i> Logout
      </button>
      <button>
        <i className="ri-delete-bin-2-fill"></i>Delete Account
      </button>
    </div>
  );
};

export default Headertooltip;
