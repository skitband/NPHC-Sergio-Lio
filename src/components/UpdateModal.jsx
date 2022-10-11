import React from 'react';
import { Modal, Form, Input, InputNumber  } from 'antd';

const UpdateModal = ({ details, isVisible, onSave, onCancel }) => {

    const [form] = Form.useForm();

    form.setFieldsValue({
        empId: details.empId,
        loginId: details.loginId,
        name: details.name,
        salary: details.salary,
        id: details.id
    })

    return (
        <Modal 
            getContainer={false}
            open={isVisible}
            title="Edit Employee Record"
            okText="Save"
            cancelText="Cancel"
            onCancel={onCancel}
            onOk={() => {
                form
                .validateFields()
                .then(values => {
                    form.resetFields();
                    onSave(values);
                })
                .catch(info => {
                    console.log('Validate Failed:', info);
                });
            }}
        >
        <Form
            form={form}
            layout="vertical"
            name="form_in_modal"
        >   
            <Form.Item
                name="empId"
                label="Employee ID"
            > 
                <Input readOnly/>
            </Form.Item>
            <Form.Item
                name="id"
                noStyle
            > 
                <Input type="hidden" />
            </Form.Item>
            <Form.Item
                name="loginId"
                label="Login ID"
                rules={[
                    {
                    required: true,
                    message: 'This field is required',
                    },
                ]}
            > 
                <Input />
            </Form.Item>
            <Form.Item
                name="name"
                label="Employee Name"
                rules={[
                    {
                    required: true,
                    message: 'This field is required',
                    },
                ]}
            > 
                <Input />
            </Form.Item>
            <Form.Item
                name="salary"
                label="Salary"
                rules={[
                    {
                    required: true,
                    message: 'This field is required',
                    },
                ]}
            > 
                <InputNumber  />
            </Form.Item>
        </Form>
        </Modal>
    );
}

export default UpdateModal