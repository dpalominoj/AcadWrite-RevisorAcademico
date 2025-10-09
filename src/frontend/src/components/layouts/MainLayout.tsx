import React, { useState, useEffect } from "react";
import { UserOutlined, LogoutOutlined } from "@ant-design/icons";
import { Avatar, Layout, Menu, Dropdown, message, theme } from "antd";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Footer } from "antd/es/layout/layout";
import { getNavItems } from "../../common/siderLinks";
import { clearUser } from "../../redux/slices/userSlice";

const { Header, Content, Sider } = Layout;

interface UserState {
  currentUser: {
    _id: string;
    username: string;
    email: string;
    role: string;
  } | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
}

const MainLayout: React.FC = () => {
  const dispatch = useDispatch();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const user = useSelector(
    (state: { user: UserState }) => state.user.currentUser
  );
  const NAV_ITEMS = getNavItems(user!);

  // --------------------------
  // Logout y aviso al cerrar
  // --------------------------
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };

    const handleUnload = () => {
      dispatch(clearUser());
      localStorage.removeItem("access_token");
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("unload", handleUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("unload", handleUnload);
    };
  }, [dispatch]);

  const handleSignout = () => {
    dispatch(clearUser());
    localStorage.removeItem("access_token");
    message.success("Sesión cerrada");
    navigate("/login");
  };

  // Menú del Dropdown del usuario
  const userMenu = (
    <Menu>
      <Menu.Item key="profile" onClick={() => navigate(`/profile/${user!._id}`)}>
        Perfil
      </Menu.Item>
      <Menu.Item key="signout" danger icon={<LogoutOutlined />} onClick={handleSignout}>
        Salir
      </Menu.Item>
    </Menu>
  );

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header style={{ display: "flex", alignItems: "center" }}>
        <div className="demo-logo" />
        <Menu
          theme="dark"
          mode="horizontal"
          style={{ flex: 1, minWidth: 0 }}
          className="flex justify-end"
        >
          <Dropdown overlay={userMenu} placement="bottomRight" arrow>
            <div className="flex items-center cursor-pointer hover:bg-white/10 p-1 rounded transition-all duration-200">
              <Avatar size={30} icon={<UserOutlined />} className="mr-2 bg-gray-500" />
              <span className="text-white sm:text-md md:text-lg">
                Hola, {user!.username.charAt(0).toUpperCase() + user!.username.slice(1)}
              </span>
            </div>
          </Dropdown>
        </Menu>
      </Header>

      <Layout>
        <Sider
          collapsible
          collapsed={collapsed}
          onCollapse={() => setCollapsed(!collapsed)}
          width={200}
          collapsedWidth={80} // Tamaño mínimo al colapsar
          style={{ background: colorBgContainer }}
          breakpoint="md"
          onMouseEnter={() => setCollapsed(false)} // Expande al hover
          onMouseLeave={() => setCollapsed(true)}  // Colapsa al salir
        >
          <Link to="/home">
            {!collapsed ? (
              <div className="flex justify-center mb-6 mt-6">
                <img
                  src="/logo.png"
                  alt="Logo AcadWrite"
                  width="100"
                  className="rounded-full shadow-md"
                />
              </div>
            ) : (
              <h1 className="text-xl flex justify-center py-10">AW</h1>
            )}
          </Link>

          <Menu
            mode="inline"
            selectedKeys={[window.location.pathname]}
            onClick={({ keyPath }) => navigate(`${keyPath}`)}
            style={{ height: "100%", borderRight: 0 }}
            items={NAV_ITEMS}
          />
        </Sider>

        <Layout>
          <Content
            style={{
              padding: 24,
              margin: 16,
              minHeight: "100vh",
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            <Outlet />
          </Content>
        </Layout>
      </Layout>

      <Footer style={{ textAlign: "center" }}>
        AcadWrite ©{new Date().getFullYear()} | Creado por{" "}
        <a
          target="_blank"
          rel="noopener"
          className="text-red-500 underline"
          href="https://github.com/Phoenix2219"
        >
          @TallerProyectos
        </a>
      </Footer>
    </Layout>
  );
};

export default MainLayout;
