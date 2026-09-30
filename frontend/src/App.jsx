import { useState } from "react";
import "./App.css";
const techNames = [
  "Employee Leave",
  "Leave Management",
  "Employee",
  "Admin",
  "Manager",
  "HR Management",
  "Leave Request",
  "Leave Approval",
  "Leave Status",
  "Apply Leave",
  "Leave History",
  "Pending",
  "Approved",
  "Rejected",
  "Sick Leave",
  "Casual Leave",
  "Earned Leave",
  "Annual Leave",
  "Leave Balance",
  "Employee Portal",
  "Admin Portal",
  "Attendance",
  "Employee Profile",
  "Leave Tracking",
  "Request Management",
  "Approval Workflow",
  "Leave Dashboard",
  "Employee Dashboard",
  "Admin Dashboard",
  "Secure Login",
  "User Management",
  "Role Based Access",
  
];
const API_URL = "http://3.90.247.242:5000/api";

function App() {
  const [page, setPage] = useState("login");
  const [user, setUser] = useState(null);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [leaveType, setLeaveType] = useState("Casual Leave");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");

  const [leaves, setLeaves] = useState([]);
  const [message, setMessage] = useState("");

  // =====================================================
  // LOGIN
  // =====================================================

  const handleLogin = async (e) => {
    e.preventDefault();

    setMessage("");

    try {
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Login failed");
        return;
      }

      setUser(data.user);

      if (data.user.role === "admin") {
        setPage("admin");
      } else {
        setPage("employee");
      }

      setMessage("Login successful");
    } catch (error) {
      setMessage("Unable to connect to backend");
    }
  };

  // =====================================================
  // APPLY LEAVE
  // =====================================================

  const handleApplyLeave = async (e) => {
    e.preventDefault();

    setMessage("");

    try {
      const response = await fetch(`${API_URL}/leaves`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: user.id,
          leave_type: leaveType,
          start_date: startDate,
          end_date: endDate,
          reason,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Unable to apply leave");
        return;
      }

      setMessage("Leave request submitted successfully");

      setStartDate("");
      setEndDate("");
      setReason("");

      loadLeaves();
    } catch (error) {
      setMessage("Unable to connect to backend");
    }
  };

  // =====================================================
  // GET LEAVES
  // =====================================================

  const loadLeaves = async () => {
    try {
      const response = await fetch(`${API_URL}/leaves`);

      const data = await response.json();

      setLeaves(data);
    } catch (error) {
      setMessage("Unable to load leave requests");
    }
  };

  // =====================================================
  // APPROVE
  // =====================================================

  const approveLeave = async (id) => {
    try {
      const response = await fetch(
        `${API_URL}/leaves/${id}/approve`,
        {
          method: "PUT",
        }
      );

      const data = await response.json();

      setMessage(data.message);

      loadLeaves();
    } catch (error) {
      setMessage("Unable to approve leave");
    }
  };

  // =====================================================
  // REJECT
  // =====================================================

  const rejectLeave = async (id) => {
    try {
      const response = await fetch(
        `${API_URL}/leaves/${id}/reject`,
        {
          method: "PUT",
        }
      );

      const data = await response.json();

      setMessage(data.message);

      loadLeaves();
    } catch (error) {
      setMessage("Unable to reject leave");
    }
  };

  // =====================================================
  // LOGOUT
  // =====================================================

  const logout = () => {
    setUser(null);
    setPage("login");
    setUsername("");
    setPassword("");
    setLeaves([]);
    setMessage("");
  };

  // =====================================================
  // LOGIN PAGE
  // =====================================================

  if (page === "login") {
    return (
      <div className="login-page">

            <div className="tech-background">
        {techNames.map((tech, index) => (
          <span
            key={tech}
            className="tech-item"
            style={{
              "--i": index,
              "--x": `${(index * 37) % 100}%`,
              "--y": `${(index * 61) % 100}%`,
            }}
          >
            {tech}
          </span>
        ))}
      </div>          

        <div className="login-card">

          <div className="logo-circle">
            EL
          </div>

          <h1>Employee Leave</h1>

          <p className="subtitle">
            Management System
          </p>

          <form onSubmit={handleLogin}>

            <label>Username</label>

            <input
              type="text"
              placeholder="Enter username"
              value={username}
              onChange={(e) =>
                setUsername(e.target.value)
              }
              required
            />

            <label>Password</label>

            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              required
            />

            <button type="submit">
              Login
            </button>

          </form>

          {message && (
            <div className="message">
              {message}
            </div>
          )}

          <div className="demo-info">
            <p>
              <strong>Employee:</strong> john / john123
            </p>

            <p>
              <strong>Admin:</strong> admin / admin123
            </p>
          </div>

        </div>

      </div>
    );
  }

  // =====================================================
  // EMPLOYEE DASHBOARD
  // =====================================================

  if (page === "employee") {
    return (
      <div className="dashboard">

        <header className="navbar">

          <div>
            <h2>Employee Leave Management</h2>

            <span>
              Employee Portal
            </span>
          </div>

          <div className="user-section">

            <span>
              Welcome, <strong>{user.username}</strong>
            </span>

            <button
              className="logout-btn"
              onClick={logout}
            >
              Logout
            </button>

          </div>

        </header>

        <main className="content">

          <div className="welcome-card">

            <div>
              <h1>
                Welcome back, {user.username} 👋
              </h1>

              <p>
                Manage your leave requests easily.
              </p>
            </div>

          </div>

          <div className="dashboard-grid">

            {/* APPLY LEAVE */}

            <div className="card">

              <h2>Apply for Leave</h2>

              <form onSubmit={handleApplyLeave}>

                <label>Leave Type</label>

                <select
                  value={leaveType}
                  onChange={(e) =>
                    setLeaveType(e.target.value)
                  }
                >
                  <option>Casual Leave</option>
                  <option>Sick Leave</option>
                  <option>Annual Leave</option>
                  <option>Emergency Leave</option>
                </select>

                <label>Start Date</label>

                <input
                  type="date"
                  value={startDate}
                  onChange={(e) =>
                    setStartDate(e.target.value)
                  }
                  required
                />

                <label>End Date</label>

                <input
                  type="date"
                  value={endDate}
                  onChange={(e) =>
                    setEndDate(e.target.value)
                  }
                  required
                />

                <label>Reason</label>

                <textarea
                  placeholder="Enter reason for leave"
                  value={reason}
                  onChange={(e) =>
                    setReason(e.target.value)
                  }
                  rows="4"
                />

                <button type="submit">
                  Submit Leave Request
                </button>

              </form>

            </div>

            {/* LEAVE STATUS */}

            <div className="card">

              <div className="card-header">

                <h2>My Leave Requests</h2>

                <button
                  className="secondary-btn"
                  onClick={loadLeaves}
                >
                  Refresh
                </button>

              </div>

              {leaves.length === 0 ? (

                <div className="empty">
                  <p>
                    No leave requests found.
                  </p>

                  <button
                    className="secondary-btn"
                    onClick={loadLeaves}
                  >
                    Load Requests
                  </button>
                </div>

              ) : (

                <div className="leave-list">

                  {leaves
                    .filter(
                      (leave) =>
                        leave.user_id === user.id
                    )
                    .map((leave) => (

                      <div
                        className="leave-item"
                        key={leave.id}
                      >

                        <div>
                          <strong>
                            {leave.leave_type}
                          </strong>

                          <p>
                            {leave.start_date}
                            {" → "}
                            {leave.end_date}
                          </p>

                          <small>
                            {leave.reason}
                          </small>
                        </div>

                        <span
                          className={`status ${leave.status.toLowerCase()}`}
                        >
                          {leave.status}
                        </span>

                      </div>

                    ))}

                </div>

              )}

            </div>

          </div>

          {message && (
            <div className="message success">
              {message}
            </div>
          )}

        </main>

      </div>
    );
  }

  // =====================================================
  // ADMIN DASHBOARD
  // =====================================================

  if (page === "admin") {
    return (
      <div className="dashboard">

        <header className="navbar">

          <div>
            <h2>Employee Leave Management</h2>

            <span>
              Administrator Portal
            </span>
          </div>

          <div className="user-section">

            <span>
              Welcome, <strong>{user.username}</strong>
            </span>

            <button
              className="logout-btn"
              onClick={logout}
            >
              Logout
            </button>

          </div>

        </header>

        <main className="content">

          <div className="welcome-card admin-welcome">

            <div>
              <h1>
                Admin Dashboard
              </h1>

              <p>
                Review and manage employee leave requests.
              </p>
            </div>

            <button
              className="refresh-large"
              onClick={loadLeaves}
            >
              Load Requests
            </button>

          </div>

          <div className="card">

            <div className="card-header">

              <h2>
                Leave Requests
              </h2>

              <span className="request-count">
                {leaves.length} Requests
              </span>

            </div>

            {leaves.length === 0 ? (

              <div className="empty">

                <p>
                  No leave requests loaded.
                </p>

                <button
                  className="secondary-btn"
                  onClick={loadLeaves}
                >
                  Load Requests
                </button>

              </div>

            ) : (

              <div className="table-container">

                <table>

                  <thead>

                    <tr>
                      <th>ID</th>
                      <th>Employee ID</th>
                      <th>Leave Type</th>
                      <th>Dates</th>
                      <th>Reason</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>

                  </thead>

                  <tbody>

                    {leaves.map((leave) => (

                      <tr key={leave.id}>

                        <td>
                          #{leave.id}
                        </td>

                        <td>
                          {leave.user_id}
                        </td>

                        <td>
                          {leave.leave_type}
                        </td>

                        <td>
                          {leave.start_date}
                          <br />
                          {leave.end_date}
                        </td>

                        <td>
                          {leave.reason || "-"}
                        </td>

                        <td>

                          <span
                            className={`status ${leave.status.toLowerCase()}`}
                          >
                            {leave.status}
                          </span>

                        </td>

                        <td>

                          {leave.status === "Pending" ? (

                            <div className="action-buttons">

                              <button
                                className="approve-btn"
                                onClick={() =>
                                  approveLeave(
                                    leave.id
                                  )
                                }
                              >
                                Approve
                              </button>

                              <button
                                className="reject-btn"
                                onClick={() =>
                                  rejectLeave(
                                    leave.id
                                  )
                                }
                              >
                                Reject
                              </button>

                            </div>

                          ) : (

                            <span>
                              Completed
                            </span>

                          )}

                        </td>

                      </tr>

                    ))}

                  </tbody>

                </table>

              </div>

            )}

          </div>

          {message && (
            <div className="message success">
              {message}
            </div>
          )}

        </main>

      </div>
    );
  }

  return null;
}

export default App;
