import "./App.css"
import { Route, Routes, Navigate } from "react-router-dom"
import Register from "./pages/register"
import RegisterStudent from "./pages/registerStudent"
import Login from "./pages/login"
import MainLayout from "./components/layouts/MainLayout"
import Profile from "./pages/profile"
import PrivateRoute from "./utils/PrivateRoute"
import Homes from "./pages/homes"
import DashboardPage from "./pages/dashboard"
import NotFoundComponent from "./components/ui/NotFound"
import Users from "./pages/users"
import Files from "./pages/files"
import Revise from "./pages/revise"

function App() {
  return (
    <Routes>     
      <Route path="/login" element={<Login />} />
      <Route path="/register-student" element={<RegisterStudent />} />     
      <Route path="*" element={<NotFoundComponent pageTitle={"Page"} />} />
      <Route element={<PrivateRoute />}>
      <Route path="/register" element={<Register />} />
        <Route element={<MainLayout />}>
          <Route path="/" element={<Navigate to="/home" />} />
          <Route path="/home" element={<Homes />} />
          <Route path="/revise" element={<Revise />} />
          <Route path="/file" element={<Files />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/users" element={<Users />} />
          <Route path="/profile/:id" element={<Profile />} />
        </Route>
      </Route>
    </Routes>
  )
}

export default App
