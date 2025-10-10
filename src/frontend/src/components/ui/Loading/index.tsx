import { Spin } from "antd"

const Loading = () => {
  return (
    <div className="h-full flex justify-center items-center">
      <Spin size="large" />
    </div>
  )
}

export default Loading
