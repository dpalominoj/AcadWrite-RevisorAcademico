import { useEffect, useState } from "react";
import {
  Space,
  Table,
  Tag,
  message,
  Form,
  Input,
  Button,
  Select,
  Popconfirm,
} from "antd";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import {
  useGetAllUsersQuery,
  useDeleteUserMutation,
  useUpdateUserMutation,
} from "../../redux/slices/usersSlice";
import Loading from "../../components/ui/Loading";
import ModalComponent from "../../components/ui/Modal";
import { useDispatch, useSelector } from "react-redux";
import {
  toggleModal,
  selectConfiguration,
} from "../../redux/slices/configurationSlice";
import { MODAL_STATE } from "../../common/states";
import { Breakpoint } from "antd";
interface Roles {
  estudiante: string;
  docente: string;
  administrador: string;
}

interface UserProps {
  _id: string;
  username: string;
  email: string;
  role: keyof Roles;
}

interface FormValues {
  username: string;
  email: string;
  role: keyof Roles;
  newPassword?: string;
  confirmPassword?: string;
}

const Users = () => {
  const {
    data: getAllUsers = [],
    isLoading,
    isError,
    refetch,
  } = useGetAllUsersQuery(undefined);
  const [deleteUser] = useDeleteUserMutation();
  const [updateUserMutation] = useUpdateUserMutation();
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const Configuration = useSelector(selectConfiguration);
  const [selectedUser, setSelectedUser] = useState<UserProps | null>(null);
  const [isChangePassword, setIsChangePassword] = useState(false);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const handleEdit = (user: UserProps) => {
    setSelectedUser(user);
    setIsChangePassword(false);
    dispatch(toggleModal(MODAL_STATE.UPDATE_USER_MODAL));
    form.setFieldsValue({
      username: user.username,
      email: user.email,
      role: user.role,
    });
  };

  const handleChangePassword = (user: UserProps) => {
    setSelectedUser(user);
    setIsChangePassword(true);
    dispatch(toggleModal(MODAL_STATE.UPDATE_USER_MODAL));
    form.resetFields();
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      await deleteUser(userId).unwrap();
      message.success("User deleted successfully!");
      refetch();
    } catch (error) {
      message.error("Error while deleting user");
      console.log(error);
    }
  };

  const handleUpdateUser = async (values: FormValues) => {
    try {
      if (isChangePassword) {
        if (values.newPassword !== values.confirmPassword) {
          message.error("Passwords do not match!");
          return;
        }
        await updateUserMutation({
          id: selectedUser!._id,
          ...values,
          password: values.newPassword,
        }).unwrap();
        message.success("Password updated successfully!");
      } else {
        await updateUserMutation({ id: selectedUser!._id, ...values }).unwrap();
        message.success("User updated successfully!");
      }
      refetch();
      dispatch(toggleModal(MODAL_STATE.UPDATE_USER_MODAL));
    } catch (error) {
      message.error("Error updating user");
      console.log(error)
    }
  };

  const roles = [
    { value: "estudiante", title: "Estudiante" },
    { value: "docente", title: "Docente" },
    { value: "administrador", title: "Administrador" },
  ];

  const columns = [
    {
      title: "Nombre de usuario",
      dataIndex: "username",
      key: "username",
      render: (username: string) => (
        <span>{username.charAt(0).toUpperCase() + username.slice(1)}</span>
      ),
    },
    {
      title: "Correo electrónico",
      dataIndex: "email",
      key: "email",
      responsive: ['md'] as Breakpoint[],
    },
    {
      title: "Rol",
      dataIndex: "role",
      key: "role",
      render: (role: keyof Roles) => (
        <Tag
          color={
            role === "estudiante"
              ? "green"
              : role === "docente"
                ? "blue"
                : role === "administrador"
                  ? "orange"
                  : "cyan"
          }
        >
          {role.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: "Acciones",
      key: "action",
      responsive: ['lg'] as Breakpoint[],
      render: (record: UserProps) => (
        <Space size="middle">
          <a className="text-blue-500" onClick={() => handleEdit(record)}>
            Editar
          </a>
          <a
            className="text-yellow-600"
            onClick={() => handleChangePassword(record)}
          >
            Cambiar contraseña
          </a>
          <Popconfirm
            title="Eliminar usuario"
            description="¿Desea eliminar este usuario?"
            onConfirm={() => handleDeleteUser(record._id)}
            icon={<DeleteOutlined style={{ color: "red" }} />}
            okText="Eliminar"
            okType="danger"
            cancelText="Cancelar"
          >
            <a className="text-red-500">Eliminar</a>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const pagination = {
    pageSize: 8,
    total: getAllUsers?.length,
    showTotal: (total: number, range: [number, number]) =>
      `Mostrar ${range[0]}-${range[1]} de ${total} elementos`,
  };

  if (isLoading) return <Loading />;
  if (isError) return <div>Error fetching data</div>;

  return (
    <div className="sm:p-2 md:p-6">
      <div className="mb-4 flex justify-end">
        <Link to="/register">
          <Button type="primary" icon={<PlusOutlined />}>
            Agregar usuario
          </Button>
        </Link>
      </div>
      <Table
        loading={isLoading}
        pagination={pagination}
        dataSource={getAllUsers}
        columns={columns}
      />
      <ModalComponent
        modalTitle={isChangePassword ? "Cambiar contraseña" : "Actualizar usuario"}
        open={Configuration[MODAL_STATE.UPDATE_USER_MODAL]}
        onCancel={() => dispatch(toggleModal(MODAL_STATE.UPDATE_USER_MODAL))}
      >
        <Form
          className="p-5"
          form={form}
          onFinish={handleUpdateUser}
          layout="vertical"
          initialValues={{
            username: selectedUser?.username,
            email: selectedUser?.email,
            role: selectedUser?.role,
          }}
        >
          {!isChangePassword ? (
            <>
              <Form.Item
                label="Nombre de usuario"
                name="username"
                rules={[
                  { required: true, message: "Ingrese su usuario!" },
                ]}
              >
                <Input placeholder="Ingrese su usuario.." />
              </Form.Item>
              <Form.Item
                label="Correo electrónico"
                name="email"
                rules={[{ required: true, message: "Ingrese su correo!" }]}
              >
                <Input placeholder="Ingrese su correo.." />
              </Form.Item>
              <Form.Item
                label="Rol"
                name="role"
                rules={[{ required: true, message: "Seleccione su rol!" }]}
              >
                <Select placeholder="Seleccione su rol..">
                  {roles.map((role) => (
                    <Select.Option key={role.value} value={role.value}>
                      {role.title}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </>
          ) : (
            <>
              <Form.Item
                label="Nueva contraseña"
                name="newPassword"
                rules={[
                  { required: true, message: "Ingrese su nueva contraseña" },
                ]}
              >
                <Input.Password
                  visibilityToggle={false}
                  placeholder="Ingrese su nueva contraseña.."
                />
              </Form.Item>
              <Form.Item
                label="Confirmar nueva contraseña"
                name="confirmPassword"
                rules={[
                  {
                    required: true,
                    message: "Confirme su nueva contraseña",
                  },
                ]}
              >
                <Input.Password
                  visibilityToggle={false}
                  placeholder="Confirme su nueva contraseña.."
                />
              </Form.Item>
            </>
          )}
          <Form.Item>
            <Button
              className="bg-secondary w-full"
              type="primary"
              htmlType="submit"
              loading={isLoading}
            >
              {isChangePassword ? "Cambiar contraseña" : "Actualizar"}
            </Button>
          </Form.Item>
        </Form>
      </ModalComponent>
    </div>
  );
};

export default Users;
