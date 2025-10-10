import { useSelector } from "react-redux"
import { Navigate, Outlet } from "react-router-dom"
import { selectCurrentUser } from "../redux/slices/userSlice"

const PrivateRoute = () => {
  const currentUser  = useSelector(selectCurrentUser)
  return currentUser ? <Outlet /> : <Navigate to="/login" />
}

export default PrivateRoute