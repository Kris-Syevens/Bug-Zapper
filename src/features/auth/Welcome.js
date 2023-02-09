import { Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import useTitle from "../../hooks/useTitle";

const Welcome = () => {
  const { isManager, isAdmin, firstName } = useAuth();

  useTitle(`Bug-Zapper: Welcome, ${firstName}!`);

  const date = new Date();
  const today = new Intl.DateTimeFormat("en-US", {
    dateStyle: "full",
    timeStyle: "long",
  }).format(date);

  const content = (
    <section className="welcome">
      <div className="greeting-container">
        <h1>Welcome, {firstName}!</h1>
        <p>{today}</p>
      </div>

      <p>
        <Link to="/dash/tickets">View Tickets</Link>
      </p>

      <p>
        <Link to="/dash/tickets/new">Add New Ticket</Link>
      </p>

      {(isManager || isAdmin) && (
        <p>
          <Link to="/dash/users">View User Settings</Link>
        </p>
      )}

      {(isManager || isAdmin) && (
        <p>
          <Link to="/dash/users/new">Add New User</Link>
        </p>
      )}
    </section>
  );

  return content;
};
export default Welcome;
