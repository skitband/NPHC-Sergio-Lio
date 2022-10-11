import React, { useState, useEffect } from 'react';

import { Layout, message } from 'antd';
import Sidenav from './Sidenav';
import MainContent from './MainContent';
import MainFooter from './MainFooter';

const { Header, Content, Footer } = Layout;

const Main = () => {

  const [employees, setEmployees] = useState([])

  useEffect(() => {
    fetchEmployees()
  },[])

  const fetchEmployees = async () => {
    await fetch("http://localhost:3004/employees")
      .then((response) => response.json())
      .then((data) => {
        let el = [...new Map(data.map(item => [item['empId'], item])).values()]
        setEmployees(el)
      })
      .catch((error) => console.log(error));
  };

  const onAdd = async (emp) => {
    emp.forEach(element => { // to avoid json-server post array of objects flatten bug issue for json-server
      fetch("http://localhost:3004/employees", {
      method: "POST",
      body: JSON.stringify({
        "empId" : element.empId,
        "loginId": element.loginId,
        "name": element.name,
        "salary": element.salary
      }),
      headers: { "Content-type": "application/json; charset=UTF-8" }
    })
    .then((response) => {
      if (response.status === 200) {
        return;
      } else {
        return response.json();
      }
    })
    .then((data) => {
      setEmployees([...employees, data])
      fetchEmployees()
    })
    .catch((error) => console.log(error));
    });
  }

  const onDelete = async (id) => {
    await fetch(`http://localhost:3004/employees/${id}`, {
      method: "DELETE"
    })
    .then((response) => {
      if(response.status === 200){
        message.success("Record deleted succesfully");
      }else{
        message.error("Something went wrong");
      }
      fetchEmployees()
    })
    .catch((error) => console.log(error));
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
        <Sidenav />
        <Layout className="site-layout">
            <Header className="site-layout-sub-header-background" style={{ padding: 0 }} />
            <Content style={{ margin: '0 16px' }}>
                <MainContent getEmp={onAdd} empList={employees} onDelete={onDelete} />
            </Content>
            <Footer style={{ textAlign: 'center' }}>
                <MainFooter />
            </Footer>
        </Layout>
    </Layout>
  )
}

export default Main