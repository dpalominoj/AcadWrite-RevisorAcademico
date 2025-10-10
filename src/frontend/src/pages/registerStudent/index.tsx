import { Form, Input, Button, message, Tooltip } from "antd"
import { useSignupStudentMutation } from "../../redux/slices/authSlice"
import { useNavigate } from "react-router-dom"
import { useState } from "react";
import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { useSpring, animated } from "@react-spring/web";

const RegisterStudent = () => {
  const [form] = Form.useForm()
  const [signupStudent, { isLoading }] = useSignupStudentMutation()
  const navigate = useNavigate()
  const password = Form.useWatch("password", form) || "";
  const [showTooltip, setShowTooltip] = useState(false)

  const onFinish = async (values: {
    username: string
    email: string
    password: string
  }) => {
    try {
      console.log("Datos enviados:", values);
      await signupStudent(values).unwrap()
      message.success("Usuario registrado exitosamente!")
      form.resetFields()
      navigate("/login")
    } catch (error: any) {
      console.error("Error backend:", error)
      message.error("Error al registrar usuario. Intente nuevamente.")
    }
  }

  const passwordRequirements = [
    { regex: /.{8,}/, label: "Al menos 8 caracteres" },
    { regex: /[A-Z]/, label: "Una mayúscula" },
    { regex: /[a-z]/, label: "Una minúscula" },
    { regex: /\d/, label: "Un número" },
    { regex: /[@$!%*?&.,;:]/, label: "Un caracter especial" },
  ];

  const renderPasswordChecklist = () => (
    <div className="text-sm">
      {passwordRequirements.map((req, i) => {
        const valid = req.regex.test(password);
        return (
          <div
            key={i}
            className={`flex items-center gap-1 ${valid ? "text-green-600" : "text-red-600"
              }`}
          >
            {valid ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
            {req.label}
          </div>
        );
      })}
    </div>
  );

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
          Registrarse
        </p>

        <Form
          layout="vertical"
          form={form}
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item
            label={<span className="text-white">Nombre</span>}
            name="username"
            rules={[{ required: true, message: "Ingrese su usuario!" }]}
          >
            <Input placeholder="Usuario" className="w-full" />
          </Form.Item>

          <Form.Item
            label={<span className="text-white">Correo</span>}
            name="email"
            rules={[
              { required: true, message: "Ingrese su correo!" },
              { type: "email", message: "Ingrese un correo válido!" }
            ]}
          >
            <Input placeholder="correo@ejemplo.com" className="w-full" />
          </Form.Item>

          <Form.Item
            label={<span className="text-white">Contraseña</span>}
            name="password"
            rules={[
              { required: true, message: "Ingrese su contraseña!" },
              {
                validator: (_, value) => {
                  const regex =
                    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.,;:]).{8,}$/;
                  if (!value) return Promise.resolve();
                  if (!regex.test(value)) {
                    return Promise.reject(
                      "La contraseña no cumple con los requisitos."
                    );
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <Tooltip
              title={renderPasswordChecklist()}
              open={showTooltip}
              placement="right"
              color="white"
              align={{ offset: [40, 0] }}
            >
              <Input.Password
                placeholder="••••••••"
                className="w-full"
                value={password} // 👈 se conecta al estado
                onChange={(e) => {
                  form.setFieldsValue({ password: e.target.value }); // 👈 sincroniza el form
                }}
                onFocus={() => setShowTooltip(true)}
                onBlur={() => setShowTooltip(false)}
              />
            </Tooltip>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={isLoading}
              className="w-full rounded-xl py-2 bg-gradient-to-r from-pink-500 to-purple-600 hover:opacity-90 transition-all duration-300"
            >
              Registrar
            </Button>
          </Form.Item>
        </Form>

        <div className="text-center mt-4 text-sm text-white/80">
          ¿Tienes una cuenta? <a href="/login" className="underline hover:text-white">Ingrese</a>
        </div>
      </animated.div >
    </div>
  )
}

export default RegisterStudent
