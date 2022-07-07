import {Navbar, Container, Nav, Button} from 'react-bootstrap'
import { app } from '../firebaseConfig';
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut, setPersistence, browserSessionPersistence } from "firebase/auth";
import { useState, useEffect } from 'react'
import {useStore, useAuthStore} from '../store/store'
import {Outlet} from "react-router-dom"


function AuthHeader(props){
  
  const isLoggedIn = useAuthStore(state => state.isLoggedIn);
  const setIsLoggedIn = useAuthStore(state => state.setIsLoggedIn);
  const setAccessToken = useAuthStore(state => state.setAccessToken);
  const accessToken = useAuthStore(state => state.accessToken);
  const curRoute = useStore(state => state.curRoute)

  const [loginButtonText, setLoginButtonText] = useState("Login");

  useEffect(()=>{

    if (isLoggedIn){
      setLoginButtonText("Logout")
    }else{
      setLoginButtonText("Login")
    }

  },[isLoggedIn]);

  function logInOut(){
    console.log("logInOut called..");

    if(!isLoggedIn){
      const provider = new GoogleAuthProvider();
      // provider.addScope('https://www.googleapis.com/auth/contacts.readonly');
      provider.addScope('https://www.googleapis.com/auth/devstorage.read_only')
      const auth = getAuth();
      setPersistence(auth, browserSessionPersistence)
  .then(() => {
      return signInWithPopup(auth, provider)
        .then((result) => {
          // This gives you a Google Access Token. You can use it to access the Google API.
          const credential = GoogleAuthProvider.credentialFromResult(result);
          const token = credential.accessToken;
          // The signed-in user info.
          const user = result.user;
          // ...
          setAccessToken(token);
          setIsLoggedIn(true);
          sessionStorage.setItem('Auth Token', result._tokenResponse.refreshToken)


        })}).catch((error) => {
          // Handle Errors here.
          const errorCode = error.code;
          const errorMessage = error.message;
          // The email of the user's account used.
          const email = error.customData.email;
          // The AuthCredential type that was used.
          const credential = GoogleAuthProvider.credentialFromError(error);
          // ...
        });
    }else{
      const auth = getAuth();
      signOut(auth).then(()=>{

        setIsLoggedIn(false);

      }).catch((error)=>{

      });

    }
  }

  return(
    <>
      <Navbar bg="light" variant="light">
          <Navbar.Brand href="/">Brain Cell Data Viewer</Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link active={curRoute==="genex"} href="genex">GeneExp</Nav.Link>
            <Nav.Link active={curRoute==="regag"} href="regag">RegionAgg</Nav.Link>
            <Nav.Link active={curRoute==="normalized"} href="normalized">Normalized</Nav.Link>
            <Nav.Link active={curRoute==="qcindex"} href="qcindex">QC</Nav.Link>
          </Nav>
          <Nav>
            <Button onClick={logInOut}>{loginButtonText}</Button>
          </Nav>
      </Navbar>
      <Outlet/>
    </>
  );
}

export default AuthHeader;

// References
// - https://firebase.google.com/docs/auth/web/google-signin
// https://firebase.google.com/docs/auth/web/google-signin#advanced-handle-the-sign-in-flow-manually
// https://firebase.google.com/docs/auth/web/auth-state-persistence
// https://stackoverflow.com/questions/37828543/how-to-pass-props-without-value-to-component
// https://stackoverflow.com/questions/54843302/reactjs-bootstrap-navbar-and-routing-not-working-together
