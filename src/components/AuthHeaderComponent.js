import {Navbar, Container, Nav, Button} from 'react-bootstrap'
import { app } from '../firebaseConfig';
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut, setPersistence, browserSessionPersistence } from "firebase/auth";
import { useState, useEffect } from 'react'
import {useStore, useAuthStore} from '../store/store'
import {Outlet, useLocation, useNavigate, NavLink} from "react-router-dom"


function AuthHeader(props){
  
  const isLoggedIn = useAuthStore(state => state.isLoggedIn);
  const setIsLoggedIn = useAuthStore(state => state.setIsLoggedIn);
  const setAccessToken = useAuthStore(state => state.setAccessToken);
  const accessToken = useAuthStore(state => state.accessToken);
  const curRoute = useStore(state => state.curRoute);
  const isDemoPortal = useAuthStore(state => state.isDemoPortal);
  const setIsDemoPortal = useAuthStore(state => state.setIsDemoPortal);
  console.log(isDemoPortal);

  const [loginButtonText, setLoginButtonText] = useState("Login");

  let navigate = useNavigate();
  let location = useLocation();
  let from = location.state?.from?.pathname || "/";

  useEffect(()=>{
    let hostname = window.location.hostname;
    console.log('hostname', hostname, 'isDemoPortal', isDemoPortal, hostname==='velina-208320.ue.r.appspot.com' );
    if (hostname==='velina-208320.ue.r.appspot.com'){
      setIsDemoPortal(true);
      setIsLoggedIn(true);
    }

  },[])

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
          // console.log(result);

          navigate(from, { replace: true });

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
            <NavLink className={(navData)=>(navData.isActive?"nav-link active": "nav-link")} to="/genex">GeneExp</NavLink>
            <NavLink className={(navData)=>(navData.isActive?"nav-link active": "nav-link")} to="/singlecell">SingleCell</NavLink>
            <NavLink className={(navData)=>(navData.isActive?"nav-link active": "nav-link")} to="/anaindex">Analysis</NavLink>
            {/* <Nav.Link active={curRoute==="regag"} href="regag">RegionAgg</Nav.Link> */}
            {/* <Nav.Link active={curRoute==="normalized"} href="normalized">Normalized</Nav.Link> */}
            <NavLink className={(navData)=>(navData.isActive?"nav-link active": "nav-link")} to="/qcindex">QC</NavLink>
          </Nav>
        {isDemoPortal?false:
        <Nav>
          <Button onClick={logInOut}>{loginButtonText}</Button>
        </Nav>
        }
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
// https://stackblitz.com/github/remix-run/react-router/tree/main/examples/auth?file=src%2FApp.tsx
