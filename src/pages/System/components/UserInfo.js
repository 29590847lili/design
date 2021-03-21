import { Button, message, Input, Descriptions , Row, Col, Popconfirm, Tooltip, Divider, Radio } from 'antd';
import React, { useState, useRef, useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Modal, Form } from 'antd';
import { getUserInfo, updatePassword } from './service';

const TableLeft = () => {
  const [form] = Form.useForm();
  const updatePws = async (fields) => {
    const hide = message.loading('正在修改');
    try {
      await updatePassword({
        name: fields.name,
        code: fields.code,
        key: fields.key,
      });
      hide();
      message.success('修改密码成功');
      return true;
    } catch (error) {
      hide();
      message.error('修改密码失败请重试！');
      return false;
    }
  };
  const [updateModalVisible, handleUpdateModalVisible] = useState(false);
  const [userInfo, setUserInfo] = useState({name:'',number:'',brithday:'',address:'', marry:'', school:'' });
  useEffect(() => {
    getUserInfo({ current: 1, pageSize: 20, sorter: {}, filter: {} }).then((res) => {
      // setUserInfo(res.data)
      setUserInfo({name:'aaa',number:'111',brithday:'1993',address:'beijing', marry:'已婚', school:'北京大学' })
    })
  }, [])

  const onFinishUpdate = async (values) => {
    console.log('Success:', values);
    const success = await updatePws(values);
    if (success) {
      handleUpdateModalVisible(false);
    }
  };
  return (
    <div>
      <Descriptions title="" layout="vertical" bordered>
        <Descriptions.Item label="姓名">{userInfo.name}</Descriptions.Item>
        <Descriptions.Item label="工号">{userInfo.number}</Descriptions.Item>
        <Descriptions.Item label="出生年月">{userInfo.brithday}</Descriptions.Item>
        <Descriptions.Item label="家庭地址">{userInfo.address}</Descriptions.Item>
        <Descriptions.Item label="婚姻状态">{userInfo.marry} </Descriptions.Item>
        <Descriptions.Item label="毕业院校">{userInfo.school}</Descriptions.Item>
      </Descriptions>
      <Button onClick={() => handleUpdateModalVisible(true)}>修改密码</Button>
     <Modal
        title='修改密码'
        width="400px"
        visible={updateModalVisible}
        onCancel={() => handleUpdateModalVisible(false)}
        footer={null}
      >
        <Form name="basic"
          onFinish={onFinishUpdate}
          form={form}
        >
          <Form.Item
            label="旧密码"
            name="old"
            rules={[{ required: true, message: '请输入旧密码!' }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            label="新密码"
            name="new"
            rules={[{ required: true, message: '请输入新密码!' }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item style={{ textAlign: 'right' }}>
            <Button type="primary" htmlType="submit">
              提交
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
const Page = () => {
  return (
    <PageContainer>
      <Row gutter={24}>
        <Col span={24}><TableLeft/></Col>
      </Row>
    </PageContainer>
  )
}

export default Page;

