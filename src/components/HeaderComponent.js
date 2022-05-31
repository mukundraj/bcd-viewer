import {Navbar, Container, Nav, Button} from 'react-bootstrap'
import { app } from '../firebaseConfig';
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";
import { useState, useEffect } from 'react'
import {useStore, useAuthStore} from '../store/store'


function Header(props){
  
  const isLoggedIn = useAuthStore(state => state.isLoggedIn);
  const setIsLoggedIn = useAuthStore(state => state.setIsLoggedIn);
  const setAccessToken = useAuthStore(state => state.setAccessToken);
  const accessToken = useAuthStore(state => state.accessToken);

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
      signInWithPopup(auth, provider)
        .then((result) => {
          // This gives you a Google Access Token. You can use it to access the Google API.
          const credential = GoogleAuthProvider.credentialFromResult(result);
          const token = credential.accessToken;
          // The signed-in user info.
          const user = result.user;
          // ...
          setAccessToken(token);
          setIsLoggedIn(true);

        }).catch((error) => {
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
        <Container>
          <Navbar.Brand href="/">Brain Cell Data Viewer</Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link href="genex">GeneExp</Nav.Link>
            <Nav.Link href="regag">RegionAgg</Nav.Link>
            <Nav.Link href="normalized">Normalized</Nav.Link>
          </Nav>
          <Nav>
            <Button onClick={logInOut}>{loginButtonText}</Button>
          </Nav>
        </Container>
      </Navbar>
    </>
  );
}

export default Header;

// References
// - https://firebase.google.com/docs/auth/web/google-signin
// https://firebase.google.com/docs/auth/web/google-signin#advanced-handle-the-sign-in-flow-manually
