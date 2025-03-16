import React, { useContext, useEffect, useState } from "react";
import "../CSS/main.css";
import { DataContext } from "../App";
import { v4 as uuid } from "uuid";
import { Toaster, toast } from 'sonner'
import {checkisLink} from "../Function/Link";
import {checkHTTPS} from "../Function/Link";
import handlePassword from "../Function/handlePassword";
import { handleEdit, handleSubmit, updateData } from "../Function/CRUD";

const Main = () => {
  let [heropassword, setHeropassword] = useState(false);
  let [isEdit, setIsEdit] = useState(false);
  let [EditIdx, setEditIdx] = useState(0);
  let { data, setData } = useContext(DataContext);

  let [formdata, setFormdata] = useState({
    url: "",
    username: "",
    password: "",
  });

  const handlechange = (e) => {
    setFormdata({ ...formdata, [e.target.name]: e.target.value });
  };

  return (
    <section className="main">
      <Toaster richColors position="bottom-center"/> 
      <div className="hero">
        <div className="hero-logo">
          <div>
            &lt;<span>Pass</span>OP/&gt;
          </div>
          <div>Your own Password Manager</div>
        </div>
        <form className="hero-input" onSubmit={(e)=>{isEdit ?  updateData(e , setData , data , setFormdata , formdata , setIsEdit ,EditIdx) : handleSubmit(e,formdata , setFormdata , data , setData , isEdit)}}>
          <input
            className="input1"
            type="text"
            value={formdata.url}
            onChange={(e) => {
              handlechange(e);
            }}
            name="url"
            placeholder="Enter URL or App Name"
            required
          />
          <div className="row">
            <input
              className="input2"
              value={formdata.username}
              onChange={(e) => {
                handlechange(e);
              }}
              name="username"
              type="text"
              placeholder="Enter Username"
              required
            />
            <div className="password-wrap">
              <input
                className="input3"
                value={formdata.password}
                onChange={(e) => {
                  handlechange(e);
                }}
                name="password"
                type={heropassword ? "text" : "password"}
                placeholder="Enter Password"
                required
              />
              {heropassword ? (
                <i
                  className="ri-eye-line"
                  onClick={() => setHeropassword(!heropassword)}
                ></i>
              ) : (
                <i
                  className="ri-eye-off-line"
                  onClick={() => setHeropassword(!heropassword)}
                ></i>
              )}
            </div>
          </div>
          <button type="submit" className="hero-btn">
            <i className="ri-list-check-3"></i> Save
          </button>
        </form>
      </div>
      <div className="password-table">
        <div className="heading">Your Password</div>
        {/* <div>No passwords to show</div> */}
        <div className="table">
          <table>
            <thead>
              <tr>
              <th>Site or App Name</th>
              <th>Username or Email</th>
              <th>Password</th>
              <th>Action</th>
              </tr>
            </thead>
            <tbody>
            {data.length !== 0 &&
              data.map((ele) => {
                return (
                  <tr key={ele.id}>
                    <td>
                      <div className="td-flex">
                        <div>
                          {checkisLink(ele.url) ? (
                            <a
                              href={
                                checkHTTPS(ele.url)
                                  ? ele.url
                                  : "https://" + ele.url
                              }
                              target="_blank"
                            >
                              {ele.url}
                            </a>
                          ) : (
                            ele.url
                          )}
                        </div>
                        {checkisLink(ele.url) ? (
                          <i
                            className="ri-file-copy-fill"
                            onClick={(e) => {
                              e.stopPropagation();
                              toast.dismiss();
                              setTimeout(() => {
                                navigator.clipboard.writeText(ele.url);
                                toast.success("Copied to Clipboard" , { duration: 1000 });
                              }, 100);
                            }}
                          ></i>
                        ) : null}
                      </div>
                    </td>
                    <td>
                      <div className="td-flex">
                        <div>{ele.username}</div>                       
                        <i
                          className="ri-file-copy-fill"
                          onClick={(e) => {
                            e.stopPropagation();
                            toast.dismiss();
                            setTimeout(() => {
                              navigator.clipboard.writeText(ele.username);
                              toast.success("Copied to Clipboard" , { duration: 1000 });
                            }, 100);
                          }}
                        ></i>
                      </div>
                    </td>
                    <td>
                      <div className="td-flex">
                        <div>
                          {ele.showPassword
                            ? ele.password
                            : "•".repeat(ele.password.length)}
                        </div>
                        <div>
                          <i
                            className="ri-file-copy-fill"
                            onClick={(e) => {
                              e.stopPropagation();
                              toast.dismiss();
                              setTimeout(() => {
                                navigator.clipboard.writeText(ele.password);
                                toast.success("Copied to Clipboard" , { duration: 1000 });
                              }, 100);
                            }}
                          ></i>
                          {ele.showPassword ? (
                            <i
                              className="ri-eye-line"
                              onClick={(e) => {
                                handlePassword(e, ele.id , setData , data);
                              }}
                            ></i>
                          ) : (
                            <i
                              className="ri-eye-off-line"
                              onClick={(e) => {
                                handlePassword(e, ele.id , setData , data);
                              }}
                            ></i>
                          )}
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="td-flex">
                        <i className="ri-edit-2-fill" onClick={()=>{
                          setIsEdit(true);
                          handleEdit(ele.id , setEditIdx , data , setFormdata)
                          }}></i>
                        <i className="ri-delete-bin-6-line"></i>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default Main;
