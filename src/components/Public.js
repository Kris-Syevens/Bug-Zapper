import { Link } from "react-router-dom";
import welcomeImg from "../img/bug-fix.svg";

const Public = () => {
  const content = (
    <section className="public">
      <main className="public__main">
        <h1>Bug-Zapper</h1>
        <p>Ticket Management System</p>

        <img src={welcomeImg} alt="Welcome" className="welcome-img" />

        <Link to="/login" className="btn-login">
          Employee Login
        </Link>
      </main>
    </section>
  );

  return content;
};
export default Public;
