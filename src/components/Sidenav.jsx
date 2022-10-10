import React, { useState } from 'react'

import { UserOutlined, TeamOutlined } from '@ant-design/icons';
import { Layout, Menu } from 'antd';

const { Sider } = Layout;

const Sidenav = () => {

    const [collapsed, setCollapsed] = useState(false);

    const items = [
        {
            key: '1',
            icon: <UserOutlined />,
            label: "Dashboard"
        },
        {
            key: '2',
            icon: <TeamOutlined />,
            label: "Employees"
        }
    ]
    return (
        <>
            <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
                <div className="logo text-white">NPHC Software Engineer Assignment</div>
                <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline" items={items} />
            </Sider>
        </>
    )
}

export default Sidenav