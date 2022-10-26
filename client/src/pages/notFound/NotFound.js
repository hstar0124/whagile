import React from 'react';
import NotFoundStyle from './NotFound.module.css';
import whagileLogo from "./whagile-logo.png";
import { Link } from 'react-router-dom'
import { decodeJwt } from "../../utils/tokenUtils";


export default function NotFound() {
    const user = decodeJwt(window.localStorage.getItem("access_token"));
    console.log("user", user);
    return (
      <>
        <div className={NotFoundStyle.errorPage}>
          <div className={NotFoundStyle.contextBox}>
            <div>
              <h1>404</h1>
              <img
                className={NotFoundStyle.img}
                style={{ width: "400px", height: "115px" }}
                src={whagileLogo}
                alt="bebe"
              ></img>
            </div>
            <h3>
              OOPS. Looks like the page you're looking for no longer exists.
              <br />
            </h3>
            <h5>
              Don't worry. Since you're valuable to us we will bring you back to
              safety
            </h5>
            {user.id === "admin" ? (
              <Link to="/admin/dashboard">
                <button className={NotFoundStyle.errorPageBtn}>
                  Back to Admin-Dashboard
                </button>
              </Link>
            ) : (
              <Link to="/">
                <button className={NotFoundStyle.errorPageBtn}>
                  Back to Home
                </button>
              </Link>
            )}
          </div>
        </div>
      </>
    );
}