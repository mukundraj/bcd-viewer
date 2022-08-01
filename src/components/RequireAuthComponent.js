import {useStore,useAuthStore} from '../store/store'
import {Navigate, useLocation} from "react-router-dom"

function RequireAuth(props){

  const isLoggedIn = useAuthStore(state => state.isLoggedIn);
  let location = useLocation();

  if (!isLoggedIn){
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return(
      props.children
  );
}

export default RequireAuth;
