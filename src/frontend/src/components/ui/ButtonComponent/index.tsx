import { Button } from "antd"

interface ButtonProps {
  name?: string
  onClick?: () => void
  icon?: string | React.ReactNode
  bgColor?: string
  loading?: boolean
}

const ButtonComponent = ({ name, onClick, icon, bgColor, loading }: ButtonProps) => {
  return (
    <Button
      type="primary"
      className={`${bgColor} flex text-primary`}
      size="large"
      icon={icon}
      onClick={onClick}
      loading={loading}
    >
      {name}
    </Button>
  )
}

export default ButtonComponent
