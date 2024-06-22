import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/login.css";
import "../styles/util.css";
import image from "../assets/img-01.png";
import ButtonLoader from "../components/buttonLoader";
import axios from "axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleNaviagte = () => {
    navigate("/register");
  };

  // login function
  const userLogin = async (event) => {
    event.preventDefault();

    setLoading(true);

    if (email !== "" && password !== "") {
      try {
        // login API integration
        const response = await axios.post("http://localhost:3000/login", {
          email,
          password,
        });

        // handlind different status codes
        switch (response.status) {
          case 200:
            localStorage.setItem("token", response.data.token);
            localStorage.setItem("name", response.data.user.name);
            setLoading(false);
            navigate(`/dashboard`, { replace: true });
            break;
          case 400:
            setLoading(false);
            setTimeout(() => {
              setError("");
            }, 2000);
            setError(response.data.message);
            break;
          case 401:
            setLoading(false);
            setTimeout(() => {
              setError("");
            }, 2000);
            setError(response.data.message);
            break;
          case 500:
            setLoading(false);
            setTimeout(() => {
              setError("");
            }, 2000);
            setError(response.data.message);
            break;
          default:
            setLoading(false);
            setTimeout(() => {
              setError("");
            }, 2000);
            setError("Something went wrong");
            break;
        }
      } catch (error) {
        setLoading(false);
        if (error.response) {
          console.error(error.response.data);
          setTimeout(() => {
            setError("");
          }, 2000);
          setError(error.response.data.message);
        } else if (error.request) {
          console.error("No response received from server:", error.request);
          setTimeout(() => {
            setError("");
          }, 2000);
          setError("No response received from server. Please try again later.");
        } else {
          console.error("Error during request setup:", error.message);
          setTimeout(() => {
            setError("");
          }, 2000);
          setError("Error during request setup. Please try again later.");
        }
      }
    } else {
      setLoading(false);
      setTimeout(() => {
        setError("");
      }, 2000);
      setError("Please Enter Email and Password!");
    }
  };

  return (
    <div>
      <div className="limiter">
        <div className="container-login100">
          <div className="wrap-login100">
            <div className="login100-pic js-tilt" data-tilt>
              <img src={image} alt="IMG" />
            </div>
            <form className="login100-form validate-form">
              <span className="login100-form-title">Ball Monitor Login</span>

              <div className="wrap-input100 validate-input">
                <input
                  className="input100"
                  type="text"
                  name="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <span className="focus-input100"></span>
                <span className="symbol-input100">
                  <i className="fa fa-envelope" aria-hidden="true"></i>
                </span>
              </div>

              <div className="wrap-input100 validate-input">
                <input
                  className="input100"
                  type="password"
                  name="pass"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <span className="focus-input100"></span>
                <span className="symbol-input100">
                  <i className="fa fa-lock" aria-hidden="true"></i>
                </span>
              </div>

              <div className="container-login100-form-btn">
                <button
                  className="login100-form-btn"
                  onClick={userLogin}
                  disabled={loading}
                >
                  {loading ? <ButtonLoader /> : "Login"}
                </button>
              </div>
              {error && (
                <p
                  style={{
                    color: "#9d0208",
                    justifyContent: "center",
                    display: "flex",
                  }}
                >
                  {error}
                </p>
              )}

              <div className="text-center p-t-136">
                <a className="txt2" href="/register" onClick={handleNaviagte}>
                  Create your Account
                  <i
                    className="fa fa-long-arrow-right m-l-5"
                    aria-hidden="true"
                  ></i>
                </a>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
