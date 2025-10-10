import { Form, Input, Button, message } from "antd";
import { useSigninMutation } from "../../redux/slices/authSlice";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "../../redux/slices/userSlice";
import { useSpring, animated } from "@react-spring/web";

const Login = () => {
  const [form] = Form.useForm();
  const [signin, { isLoading }] = useSigninMutation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onFinish = async (values: { email: string; password: string }) => {
    try {
      const user = await signin(values).unwrap();

      // Guardar en localStorage
      localStorage.setItem("token", user.token);
      localStorage.setItem(
        "user",
        JSON.stringify({
          _id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
        })
      );

      // Actualizar Redux (si quieres mantener el estado sincronizado)
      dispatch(setUser({ user: user, accessToken: user.token }));

      message.success("Login exitoso");
      form.resetFields();

      // Redirigir según el rol
      switch (user.role) {
        case "administrador":
          navigate("/dashboard");
          break;
        case "docente":
          navigate("/revise");
          break;
        default:
          navigate("/home");
          break;
      }
    } catch (error) {
      message.error("Credenciales inválidas");
    }
  };

  // Animación del contenedor
  const fadeIn = useSpring({
    from: { opacity: 0, transform: "translateY(-40px)" },
    to: { opacity: 1, transform: "translateY(0px)" },
    config: { tension: 200, friction: 18 }
  });

  return (
    <div className="relative flex justify-center items-center h-screen bg-gradient-to-br from-gray-900 via-black to-indigo-950 overflow-hidden">
      {/* Luces futuristas de fondo */}
      <div className="absolute w-[600px] h-[600px] bg-indigo-500/30 rounded-full blur-3xl animate-pulse -top-40 -left-40"></div>
      <div className="absolute w-[500px] h-[500px] bg-pink-500/20 rounded-full blur-3xl animate-pulse bottom-0 right-0"></div>

      <animated.div
        style={fadeIn}
        className="z-10 w-[90%] sm:w-[420px] bg-white/10 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/20 p-10 text-center"
      >
        <div className="flex items-center justify-center gap-3 mb-6 mt-1">
          <h1 className="text-3xl font-extrabold text-white tracking-wide">
            AcadWrite <span className="text-indigo-400">IA</span>
          </h1>
        </div>

        <p className="text-2xl font-semibold text-indigo-300 mb-8 tracking-wide hover:text-indigo-100 transition-colors duration-300">
          Iniciar Sesión
        </p>
        
        <Form
          layout="vertical"
          form={form}
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item
            label={<span className="text-white">Correo</span>}
            name="email"
            rules={[
              { required: true, message: "Ingrese su correo!" },
              { type: "email", message: "Ingrese un correo válido!" }
            ]}
          >
            <Input placeholder="correo@ejemplo.com" className="rounded-xl py-2" />
          </Form.Item>

          <Form.Item
            label={<span className="text-white">Contraseña</span>}
            name="password"
            rules={[{ required: true, message: "Ingrese su contraseña!" }]}
          >
            <Input.Password placeholder="••••••••" className="rounded-xl py-2" />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={isLoading}
              className="w-full rounded-xl py-2 bg-gradient-to-r from-pink-500 to-purple-600 hover:opacity-90 transition-all duration-300"
            >
              Ingresar
            </Button>
          </Form.Item>
        </Form>

        <div className="text-center mt-4 text-sm text-white/80">
          ¿No tienes cuenta? <a href="/register-student" className="underline hover:text-white">Regístrate</a>
        </div>
      </animated.div>
    </div>
  );
};

export default Login;
