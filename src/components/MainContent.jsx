import React, { useState, useEffect } from 'react'

import { Space, Form, Input, Button, message, Upload, Row, Col, Modal, Table } from 'antd';
import { UploadOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import Papa from "papaparse";
import UpdateModal from './UpdateModal';

const MainContent = ({getEmp, empList, onDelete }) => {

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isVisible, setisVisible] = useState(false);
  const [details, setDetails] = useState([]);
  const [newList, setNewList] = useState(empList);
  const [min, setMin] = useState(0);
  const [max, setMax] = useState(0);

  useEffect(() => {
    setNewList(empList)
  },[empList])

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleDelete = (id, name) => {
    Modal.confirm({
      title: 'Confirm Delete',
      icon: <ExclamationCircleOutlined />,
      content: `Are you sure you want to Delete ${name}?`,
      okText: 'Delete',
      cancelText: 'Cancel',
      onOk() {
        onDelete(id);
      },
    });
  }

  const handleEdit = async (id) => {
    setisVisible(true)
    await fetch(`http://localhost:3004/employees/${id}`)
      .then((response) => response.json())
      .then((data) => {
        setDetails(data)
      })
      .catch((error) => console.log(error));
  };

  const handleMin = (e) => {
    setMin(e.target.value)
    if(e.target.value <= 0 || e.target.value != null){
      setNewList(empList)
    }
  }

  const handleMax = (e) => {
    setMax(e.target.value)
    if(e.target.value <= 0 && e.target.value != null){
      setNewList(empList)
    }
  }

  const handleFilter = () => {
    const filterTable = newList.filter(arr => {
      return parseFloat(arr.salary) <= max && parseFloat(arr.salary) >= min;
    });
    setNewList(filterTable)
  }

  const props = {
    name: 'file',
    action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
    headers: {
      authorization: 'authorization-text',
    },
    accept: '.csv',
  
    onChange(info) {
      if (info.file.status === 'done') {
        message.success(`${info.file.name} file uploaded successfully`);
        Papa.parse(info.file.originFileObj, {
          header: true,
          skipEmptyLines: true,
          comments: true,
          complete: function (results) {
            getEmp(results.data)
          },
        });
        setIsModalOpen(false);
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    },

    beforeUpload(file) {
      const isCSV = file.type === 'text/csv';
      if (!isCSV) {
        message.error('You can only upload csv file!');
      }
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        message.error('Image must smaller than 2MB!');
      }
      return isCSV && isLt2M;
    }
  };

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 150 },
    {
      title: 'EMPLOYEE ID',
      dataIndex: 'empId',
      key: 'empId'
    },
    {
      title: 'LOGIN ID',
      dataIndex: 'loginId',
      key: 'loginId'
    },
    {
      title: 'NAME',
      dataIndex: 'name',
      key: 'name',
      defaultSortOrder: 'descend',
      sorter: (a, b) => a.name.length - b.name.length,
    },
    {
      title: 'SALARY',
      dataIndex: 'salary',
      key: 'salary',
      align: 'right',
      render: (text) => <a>{parseFloat(text)}</a>,
      defaultSortOrder: 'descend',
      sorter: (a, b) => a.salary - b.salary,
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <a onClick={() => handleEdit(record.id)}>Edit</a>
          <a onClick={() => handleDelete(record.id, record.name)}>Delete</a>
        </Space>
      ),
      align: 'center'
    },
  ];

  const onSave = async (values) => {
      fetch(`http://localhost:3004/employees/${values.id}`, {
        method: "PUT",
        body: JSON.stringify(values),
        headers: { "Content-type": "application/json; charset=UTF-8" }
      })
      .then((response) => {
        if (response.status === 200) {
          message.success("Employee updated succesfully");
        } else {
          message.error("Something went wrong");
        }
      })
      .then((data) => {
        setNewList(empList =>
          empList.map(obj => {
            if (obj.id === values.id) {
              return {...obj, "salary" : values.salary, "name" : values.name, "loginId" : values.loginId, "empId" : values.empId };
            }
            return obj;
          }),
        );
      })
      .catch((error) => console.log(error));
    setisVisible(false)
  };

  return (
    <div>
      <Space direction="vertical" size="middle" style={{ display: 'flex', marginTop: '30px'}}>
        <Row>
          <Col span={12}>
              <Button type="primary" onClick={showModal}>
                Upload CSV
              </Button>
              <Modal title="CSV File Upload" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                <Row>
                  <Col span={12}>
                  <Upload {...props} >
                    <Button icon={<UploadOutlined />}>Click to Upload</Button>
                  </Upload>
                  </Col>
                </Row>
              </Modal>
          </Col>
          <Col span={12}>
            <Form
              layout="inline"
              style={{ float: 'right'}}
            >
            <Form.Item label="filter"> 
              <Input name="min" placeholder="min salary" onChange={handleMin}/>
            </Form.Item>
            <Form.Item> 
              <Input name="max" placeholder="max salary" onChange={handleMax}/>
            </Form.Item>
            <Form.Item>
              <Button type="primary" onClick={() => handleFilter()}>Filter</Button>
            </Form.Item>
            </Form>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <div className="site-layout-background">
              <Table columns={columns} dataSource={newList} rowKey="id"/>
            </div>
          </Col>
        </Row>
      </Space>
      <UpdateModal
        details={details}
        isVisible={isVisible}
        onSave={onSave}
        onCancel={() => {
          setisVisible(false)
        }}
      />
    </div>
  )
}

export default MainContent