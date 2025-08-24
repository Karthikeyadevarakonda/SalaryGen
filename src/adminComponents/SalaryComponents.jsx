import SalaryComponentCrud from '../designingComponents/SalaryComponentsCrud'

const SalaryComponents = () => {
  return (
    <div>
      <SalaryComponentCrud baseUrl="http://localhost:8081/api/hr/salary-components" />
    </div>
  )
}

export default SalaryComponents
