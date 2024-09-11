import { Link } from "react-router-dom";

const Dashboard = () => {
  return (
    <div className="container-fluid">
      <div className="row">
        {/* Sidebar */}
        <nav className="col-md-3 col-lg-2 d-md-block bg-light sidebar">
          <div className="position-sticky">
            <ul className="nav flex-column">
              <li className="nav-item">
                <Link to="/mytasks" className="nav-link active">
                  My Tasks
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/categories" className="nav-link">
                  Task Categories
                </Link>
              </li>
            </ul>
          </div>
        </nav>

        {/* Main content */}
        <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
          <h2 className="mt-4">Welcome to the Dashboard</h2>
          <p>Here are your tasks and task statistics.</p>
          <button className="btn btn-primary">Invite Users</button>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
