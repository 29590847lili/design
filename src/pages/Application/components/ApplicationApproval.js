import { PlusOutlined } from '@ant-design/icons';
import { List, Button, message, Input, Table, Row, Col, Popconfirm, Tooltip, Divider, InputNumber, DatePicker, Select  } from 'antd';
import React, { useState, useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { queryApprovalList, addList, removeList, updateList, cancelList } from './service';

const { Option } = Select;
const Page = () => {
    const [data, setData] = useState([])
    useEffect(()=>{
        queryApprovalList({ current: 1, pageSize: 20, sorter: {}, filter: {} }).then((res) => {
            setData(res.data)
          })
    }, [])
    return (
      <PageContainer>
        <div  style={{display: 'flex', justifyContent: 'center'}}>
            <span style={{lineHeight: '32px'}}>申请单状态</span>&nbsp;
            <Select style={{width: '200px'}}>
              <Option value='1' key='1'>待审批</Option>
              <Option value='2' key='2'>审批通过</Option>
              <Option value='3' key='4'>驳回</Option>
            </Select>
        </div>
        <List
            itemLayout="horizontal"
            dataSource={data}
            renderItem={(item, index) => (
            <List.Item>
                {index+1}&nbsp;{item.time} &nbsp;请审批{item.name}&nbsp; {item.status} &nbsp; &nbsp; 
                <Button type='primary' size='small'>同意</Button>
                <Divider type="vertical" />
                <Button type='primary' size='small'>驳回</Button>
            </List.Item>
            )}
       />
      </PageContainer>
    )
  }
  
  export default Page;