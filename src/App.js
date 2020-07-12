import React, { useState } from 'react';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import firebaseConfig from './firebase.config';

//firebase initialize
firebase.initializeApp(firebaseConfig);

function App() {
  //initialstate
  const [user, setUser] = useState({
    isSignedIn: false,
    name: '',
    email: '',
    photo: '',
    password: '',
    error: '',
    isValid: false,
    existingUser: false,
  });

  const provider = new firebase.auth.GoogleAuthProvider();

  //handle signIn
  const handleSignIn = () => {
    firebase
      .auth()
      .signInWithPopup(provider)
      .then((res) => {
        const { displayName, photoURL, email } = res.user;
        const signedInUser = {
          isSignedIn: true,
          name: displayName,
          email: email,
          photo: photoURL,
        };
        setUser(signedInUser);
      })
      .catch((err) => {
        console.log(err);
        console.log(err.message);
      });
  };

  //Handle SignOut
  const handleSignOut = () => {
    firebase
      .auth()
      .signOut()
      .then((res) => {
        const signedOutUser = {
          isSignedIn: false,
          name: '',
          email: '',
          photo: '',
        };
        setUser(signedOutUser);
      })
      .catch((err) => {
        console.log(err);
        console.log(err.message);
      });
  };

  //email & password validation with rejax
  const is_valid_email = (email) => {
    return /(.+)@(.+){2,}\.(.+){2,}/.test(email);
  };
  const hasNumber = (input) => /\d/.test(input);

  //Switch Form
  const switchForm = (e) => {
    const createUser = { ...user };
    createUser.existingUser = e.target.checked;
    setUser(createUser);
  };

  //Handle Cahange
  const handleChange = (e) => {
    const newUserInfo = {
      ...user,
    };

    //perform validation
    let isValid = true;
    if (e.target.name === 'email') {
      isValid = is_valid_email(e.target.value);
    }
    if (e.target.name === 'password') {
      isValid = e.target.value.length > 6 && hasNumber(e.target.value);
    }
    newUserInfo[e.target.name] = e.target.value;
    newUserInfo.isValid = isValid;
    setUser(newUserInfo);
  };

  //Create Account
  const createAccount = (e) => {
    e.preventDefault();
    if (user.isValid) {
      firebase
        .auth()
        .createUserWithEmailAndPassword(user.email, user.password)
        .then((res) => {
          console.log(res);
          const createdUser = { ...user };
          createdUser.isSignedIn = true;
          createdUser.error = '';
          setUser(createdUser);
        })
        .catch((err) => {
          const createdUser = { ...user };
          createdUser.isSignedIn = false;
          createdUser.error = err.message;
          setUser(createdUser);
        });
    }
    e.target.reset();
  };

  const signInUser = (e) => {
    e.preventDefault();

    if (user.isValid) {
      firebase
        .auth()
        .signInWithEmailAndPassword(user.email, user.password)
        .then((res) => {
          console.log(res);
          const createdUser = { ...user };
          createdUser.isSignedIn = true;
          createdUser.error = '';
          setUser(createdUser);
        })
        .catch((err) => {
          const createdUser = { ...user };
          createdUser.isSignedIn = false;
          createdUser.error = err.message;
          setUser(createdUser);
        });
    }

    e.target.reset();
  };

  return (
    <div className="app">
      <div className="signIn-area">
        {user.isSignedIn ? (
          <button onClick={handleSignOut}>Sign Out</button>
        ) : (
          <button onClick={handleSignIn}>Sign in</button>
        )}
        {user.isSignedIn && (
          <div className="user-info">
            <li className="name">Name: {user.name}</li>
            <li className="email">Email: {user.email}</li>
            <li className="img">
              <img src={user.photo} alt="" />
            </li>
          </div>
        )}

        <div style={{ display: user.existingUser ? 'block' : 'none' }}>
          <form onSubmit={signInUser}>
            <ul className="form-container">
              <li>
                <label htmlFor="email">Email:</label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  onChange={handleChange}
                  required
                />
              </li>
              <li>
                <label htmlFor="password">Password:</label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  onChange={handleChange}
                  required
                />
              </li>
              <li>
                <button className="btn-primary" type="submit">
                  Sign In
                </button>
              </li>
              <li className="err-message">
                {user.error && <small>{user.error}</small>}
              </li>
            </ul>
          </form>
        </div>

        <div style={{ display: user.existingUser ? 'none' : 'block' }}>
          <form onSubmit={createAccount}>
            <ul className="form-container">
              <li>
                <label htmlFor="name">Name:</label>
                <input
                  type="name"
                  name="name"
                  id="name"
                  onChange={handleChange}
                  required
                />
              </li>
              <li>
                <label htmlFor="email">Email:</label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  onChange={handleChange}
                  required
                />
              </li>
              <li>
                <label htmlFor="password">Password:</label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  onChange={handleChange}
                  required
                />
              </li>
              <li>
                <button className="btn-primary" type="submit">
                  Create Account
                </button>
              </li>
              <li className="err-message">
                {user.error && <small>{user.error}</small>}
              </li>
            </ul>
          </form>
        </div>

        {/* start check-box */}
        <div className="check-box">
          <input
            type="checkbox"
            name="switchForm"
            id="switchForm"
            onChange={switchForm}
          />
          <label htmlFor="switchForm">Returning User</label>
        </div>
        {/* end check-box */}
      </div>
    </div>
  );
}

export default App;
