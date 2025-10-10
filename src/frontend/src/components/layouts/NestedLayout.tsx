import { Layout, theme } from "antd"
import { ReactNode } from "react"
import { LeftCircleOutlined } from "@ant-design/icons"

const { Content } = Layout

type NestedLayoutProps = {
  children: ReactNode
  createdAt: string
  createdBy: string
  title: string
}

const NestedLayout = ({
  children,
  createdAt,
  createdBy,
  title,
}: NestedLayoutProps) => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken()

  return (
    <Layout>
      <div className="min-h-min flex flex-row bg-white border-b-[2px] py-3 items-center">
        <LeftCircleOutlined
          className="text-2xl mr-4 text-secondary"
          onClick={() => {
            history.back()
          }}
        />
        <div className="flex flex-col ">
          <span className="text-xl font-bold">{title}</span>
          <span className="text-sm text-gray-600">
            Created by {createdBy} on {createdAt}
          </span>
        </div>
      </div>
      <Layout>
        {/* <Sider width={200} style={{ background: colorBgContainer }}>
          <Menu
            mode="inline"
            defaultSelectedKeys={['1']}
            defaultOpenKeys={['sub1']}
            style={{ height: '100%', borderRight: 0 }}
            items={items2}
          />
        </Sider> */}
        <Layout>
          <Content
            style={{
              padding: 0,
              margin: 0,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            {children}
          </Content>
        </Layout>
      </Layout>
    </Layout>
  )
}

export default NestedLayout
