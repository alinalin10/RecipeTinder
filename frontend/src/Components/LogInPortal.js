import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const LogIn = () => {
  const [username, setUsername] = useState('');
  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const login = { username, emailAddress, password };

    //------- Requires Valid fields + emails (can be alloc to backend if u prefer) --------
    if (!username || !emailAddress || !password) {
      setError('All fields are required');
      return;
    }

    const emailPattern = new RegExp("^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$");
    if (!emailPattern.test(emailAddress)) {
      setError('Please enter a valid email address');
      return;
    }
    //--------------------------------------------------------------------------------------

    setLoading(true);
    const response = await fetch('http://localhost:4000/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: emailAddress, password }),
    }); // sends data inputted to backend (will need to create tokens eventually)

    const json = await response.json();

    setLoading(false);
    if (!response.ok) {
      console.log(json.error);
      setError(json.error);
    }

    if (response.ok) {
      setUsername('');
      setEmailAddress('');
      setPassword('');
      setError('');
      console.log('User Logged in');
      setSuccess('Logged In Successfully');

      setTimeout(() => {
        console.log('This runs after 2 seconds');
        // Takes you to dashboard (a little iffy with the authorization)
      }, 2000); // waits a couple of seconds for the success message to take you to login page
    }
  };

  return (
    <div className="portal-page-container">
      {/* Form Container Wrapper */}
      <div className="portal-form-container-wrapper">
        <div className="portal-form-container">
          <h2>Welcome Back!</h2>
          <form className="portal" onSubmit={handleSubmit}>
            <label>Name</label>
            <input
              type="text"
              placeholder="Enter your name"
              onChange={(e) => {
                setUsername(e.target.value);
                setError('');
              }}
              value={username}
            />

            <label>Email Address</label>
            <input
              type="email"
              placeholder="Enter your email"
              onChange={(e) => {
                setEmailAddress(e.target.value);
                setError('');
              }}
              value={emailAddress}
            />

            <label>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              onChange={(e) => {
                setPassword(e.target.value);
                setError('');
              }}
              value={password}
            />

            <button disabled={loading}>
              {loading ? 'Authorizing...' : 'Log in'}
            </button>

            {error && <div className="error">{error}</div>}
            {success && <div className="success">{success}</div>}
          </form>

          <div className="portal">
            Don't have an account? <Link to="/SignUp">Sign Up</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogIn;
