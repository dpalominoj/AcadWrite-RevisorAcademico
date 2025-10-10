import { Input } from "antd"
import { Header } from "antd/es/layout/layout"
import ButtonComponent from "../ButtonComponent"
import { useSelector } from "react-redux"
import { AppstoreAddOutlined } from "@ant-design/icons"
import React from "react"

type PageNavbarProps = {
  title: string
  canSearch: boolean
  buttonName: string
  searchOnChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  searchTerm: string
  onClick: () => void
}

interface UserProps {
  role: string
}
interface StateProps {
  state: string
  user: {
    user: UserProps
  }
}

const PageNavbar = ({
  title,
  canSearch,
  buttonName,
  searchOnChange,
  searchTerm,
  onClick,
}: PageNavbarProps) => {
  const { Search } = Input
  const user = useSelector((state: StateProps) => state.user.user)
  return (
    <Header className="bg-white border-b mb-5">
      <div className="flex">
        {canSearch && (
          <Search
            size="large"
            placeholder={`Search ${title}..`}
            onChange={searchOnChange}
            value={searchTerm}
            className="px-6"
            enterButton
          />
        )}
        {user?.role === "user" ? (
          ""
        ) : (
          <ButtonComponent
            icon={<AppstoreAddOutlined />}
            bgColor="bg-secondary"
            onClick={onClick}
            name={buttonName}
            loading={false}
          />
        )}
      </div>
    </Header>
  )
}

export default PageNavbar
