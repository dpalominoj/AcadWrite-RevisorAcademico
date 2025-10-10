const NotFoundComponent = ({ pageTitle }: {pageTitle: string}) => {
  return (
    <div className="">
      <div className="flex justify-center items-center">
        <h1 className="text-3xl text-center">{pageTitle} not found :(</h1>
      </div>
    </div>
  )
}

export default NotFoundComponent
