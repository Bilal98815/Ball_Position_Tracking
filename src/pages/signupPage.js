import "../styles/main.css";
import "../styles/util.css";
import image from "../assets/img-01.png";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ButtonLoader from "../components/buttonLoader";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleNaviagte = () => {
    navigate("/");
  };

  const handleCreate = async (event) => {
    event.preventDefault();

    setLoading(true);

    if (name !== "" && email !== "" && password !== "") {
      try {
        const response = await axios.post("http://localhost:3000/register", {
          name,
          email,
          password,
        });
        console.log(response.data);
        setLoading(false);
        navigate("/", { replace: true });
      } catch (error) {
        console.error(error);
        setLoading(false);
        setTimeout(() => {
          setError("");
        }, 2000);
        setError(error);
      }
    } else {
      setLoading(false);
      setTimeout(() => {
        setError("");
      }, 2000);
      setError("Please Enter Name, Email and Password!");
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
              <span className="login100-form-title">User Register</span>

              <div className="wrap-input100 validate-input">
                <input
                  className="input100"
                  type="text"
                  name="name"
                  placeholder="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <span className="focus-input100"></span>
                <span className="symbol-input100">
                  <i className="fa fa-envelope" aria-hidden="true"></i>
                </span>
              </div>

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
                  onClick={handleCreate}
                  disabled={loading}
                >
                  {loading ? <ButtonLoader /> : "Signup"}
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
                <a className="txt2" href="/" onClick={handleNaviagte}>
                  Already have an account? Login
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

export default Signup;
