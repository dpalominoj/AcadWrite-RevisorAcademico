import {  
  LaptopOutlined,
  FilePdfOutlined,
  UserOutlined,
  UsergroupAddOutlined,
  HomeOutlined,
  FileSearchOutlined,
} from "@ant-design/icons"

interface UserProps {
  _id: string
  username: string
  email: string
  role: string
}

export const getNavItems = (user: UserProps) => {
  const { _id, role } = user

  const ADMIN_ITEMS = [
    { label: "Panel", key: "/dashboard", icon: <LaptopOutlined /> },
    { label: "Users", key: `/users`, icon: <UsergroupAddOutlined /> },
    { label: "Perfil", key: `/profile/${_id}`, icon: <UserOutlined /> },
  ] 

  const DOCENTE_ITEMS = [
    { label: "Revisar", key: "/revise", icon: <FileSearchOutlined /> },    
    { label: "Perfil", key: `/profile/${_id}`, icon: <UserOutlined /> },
  ] 

  const ESTUDIANTE_ITEMS = [
    { label: "Inicio", key: "/home", icon: <HomeOutlined /> },
    { label: "Archivos", key: "/file", icon: <FilePdfOutlined /> },
    { label: "Perfil", key: `/profile/${_id}`, icon: <UserOutlined /> },
  ]

  switch (role) {
    case "administrador":
      return ADMIN_ITEMS
    case "docente":
      return DOCENTE_ITEMS    
    default:
      return ESTUDIANTE_ITEMS
  }
}
