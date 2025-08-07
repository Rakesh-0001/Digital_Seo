import React, { useState } from "react";
import "../Css/Login.css";

function Login({ onLogin }) {
  const [email, setEmail] = useState("manager@digital.com");
  const [password, setPassword] = useState("manager123");
  const [alert, setAlert] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAlert("");

    let data = {};
    if (email === "manager@digital.com" && password === "manager123") {
      data = { token: "manager-token", pass: true, role: "Manager", name: "Karthick Raja" };
    } else if (email === "hr@digital.com" && password === "hr123") {
      data = { token: "hr-token", pass: true, role: "Hr", name: "Raj Sree" };
    } else if (email === "guest@digital.com" && password === "guest123") {
      data = { token: "guest-token", pass: true, role: "Guste", name: "Guest User" };
    } else {
      data = { pass: false };
    }

    if (data.pass) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);
      localStorage.setItem("name", data.name);
      onLogin(data);
    } else {
      setAlert("Credentials do not match!");
    }
  };

  return (
    <div className="login-root">
      <div className="">
        <div className="row justify-content-center align-items-center min-vh-100">
          <div className="col-lg-10 col-xl-9">
            <div className="card shadow-lg border-0 overflow-hidden">
              <div className="row g-0">
                {/* Left Column - Form */}
                <div className="col-md-6 col-lg-6 p-4 p-xl-5 d-flex flex-column login-left">
                  <div className="login-logo mb-4">Digital SEO</div>
                  <h2 className="login-title mb-4">
                    Welcome to <br />Sign into your account
                  </h2>
                  
                  <form onSubmit={handleSubmit} className="login-form">
                    <div className="mb-3">
                      <input
                        type="text"
                        placeholder="Phone or Email address"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        className="form-control login-input"
                        required
                      />
                    </div>
                    
                    <div className="mb-3">
                      <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        className="form-control login-input"
                        required
                      />
                    </div>
                    
                    <button type="submit" className="btn w-100 login-btn">
                      Log In
                    </button>
                    
                    {alert && <div className="alert alert-danger mt-3 login-alert">{alert}</div>}
                  </form>
                </div>
                
                {/* Right Column - Image */}
                <div className="col-md-6 col-lg-6 d-none d-md-flex login-right">
                  <div className="d-flex align-items-center justify-content-center h-100 p-4">
                    <img
                      src="https://img.freepik.com/free-vector/mobile-login-concept-illustration_114360-135.jpg"
                      alt="login illustration"
                      className=" login-img"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;