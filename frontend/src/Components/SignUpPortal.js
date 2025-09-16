import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const SignUp = () => {
  const [username, setUsername] = useState('');
  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const signup = { username, emailAddress, password };

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
    const response = await fetch('http://localhost:4000/api/users', {
      method: 'POST',
      body: JSON.stringify(signup),
      headers: { 'Content-Type': 'application/json' },
    }); // backend implementation required (especially for the correct api link)

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
      console.log('New user added');
      setSuccess('Signed Up successfully');

      setTimeout(() => {
        console.log('This runs after 2 seconds');
        navigate('/login');
      }, 2000); // waits a couple of seconds for the success message to take you to login page
    }
  };

  return (
    <div className="portal-page-container">
      {/* Form Container Wrapper */}
      <div className="portal-form-container-wrapper">
        <div className="portal-form-container">
          <h2>Get Started Now</h2>
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
              {loading ? 'Signing Up...' : 'Sign Up'}
            </button>

            {error && <div className="error">{error}</div>}
            {success && <div className="success">{success}</div>}
          </form>

          <div className="portal">
            Have an account? <Link to="/login">Sign In</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
