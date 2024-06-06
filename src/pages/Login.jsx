import styles from "./Login.module.css";
import PageNav from "../components/PageNav";
import { useState } from "react";
import { useAuth } from "../contexts/FakeAuthContexts";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
// import { Navigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  // const authContext = useContext(useAuth);
  // PRE-FILL FOR DEV PURPOSES
  // console.log(authContext);
  const { login, isAuthenticated } = useAuth();
  const [email, setEmail] = useState("jack@example.com");
  const [password, setPassword] = useState("qwerty");

  function handleSubmit(e) {
    e.preventDefault();
    if (email && password) login(email, password);
  }

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/app", { replace: true });
    }
    return () => {
      // second;
    };
  }, [isAuthenticated, navigate]);

  return (
    <main className={styles.login}>
      <PageNav />
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.row}>
          <label htmlFor="email">Email address</label>
          <input
            type="email"
            id="email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
        </div>

        <div className={styles.row}>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
        </div>

        <div>
          <button>Login</button>
        </div>
      </form>
    </main>
  );
}
