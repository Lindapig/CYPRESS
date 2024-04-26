// import React, { useState } from 'react';
// import {login, register, logout, isLoggedIn} from "../../services/userService";
// import "./loginPage.css";

// const LoginPage = () => {
//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');
//   const [loginErr, setLoginErr] = useState('');

//   const handleSubmit = async (event) => {
//     event.preventDefault();
//     const res = await login(username, password);
//     if (!res) {
//         setLoginErr("Invalid username or password");
//         return;
//     }
//     console.log('Logging in with:', username);
//     window.location.reload();
//   };

//   return (
//     <div className="login-page-container">
//       <div className="login-form-container">
//         <h1>Login</h1>
//         <form onSubmit={handleSubmit}>
//           <div>
//             <label htmlFor="username">Username:</label>
//             <input
//               type="text"
//               id="username"
//               value={username}
//               onChange={(e) => setUsername(e.target.value)}
//               required
//             />
//           </div>
//           <div>
//             <label htmlFor="password">Password:</label>
//             <input
//               type="password"
//               id="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               required
//             />
//           </div>
//           {loginErr && <div className="error">{loginErr}</div>}
//           <button type="submit">Login</button>
//         </form>
//         <button className="register-button">Register</button>
//       </div>
//     </div>
//   );
// };

// export default LoginPage;


import React, { useState } from 'react';
import { login, register } from "../../services/userService";
import "./loginPage.css";

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginErr, setLoginErr] = useState('');
  const [isRegistering, setIsRegistering] = useState(false); 

  const handleSubmitLogin = async (event) => {
    event.preventDefault();
    const res = await login(username, password);
    if (!res) {
        setLoginErr("Invalid username or password");
        return;
    }
    console.log('Logging in with:', username);
    window.location.reload(); 
  };

  const handleSubmitRegister = async (event) => {
    event.preventDefault();
    const res = await register(username, password);
    if (!res) {
        setLoginErr("User already exists, please login.");
        return;
    }
    console.log('Registered with:', username);
    setIsRegistering(false); 
    setLoginErr('Successfully registered, please login.');
  };

  const toggleForm = () => {
    setIsRegistering(!isRegistering);
    setLoginErr(''); 
    setUsername('');
    setPassword('');
  };

  return (
    <div className="login-page-container">
      <div className="login-form-container">
        {isRegistering ? (
          <>
            <h1>Register</h1>
            <form onSubmit={handleSubmitRegister}>
              <div>
                <label htmlFor="username">Username:</label>
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div>
                <label htmlFor="password">Password:</label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              {loginErr && <div className="error">{loginErr}</div>}
              <button type="submit">Register</button>
            </form>
            <button onClick={toggleForm}>Back to Login</button>
          </>
        ) : (
          <>
            <h1>Login</h1>
            <form onSubmit={handleSubmitLogin}>
              <div>
                <label htmlFor="username">Username:</label>
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div>
                <label htmlFor="password">Password:</label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              {loginErr && <div className="error">{loginErr}</div>}
              <button type="submit">Login</button>
            </form>
            <button onClick={toggleForm}>Register</button>
          </>
        )}
      </div>
    </div>
  );
};

export default LoginPage;
