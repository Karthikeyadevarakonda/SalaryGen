import SalaryComponentCrud from '../designingComponents/SalaryComponentsCrud'

const SalaryComponents = () => {
  return (
    <div>
      <SalaryComponentCrud baseUrl="https://salarygenbackend-3.onrender.com/api/hr/salary-components" />
    </div>
  )
}

export default SalaryComponents
