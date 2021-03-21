import { PlusOutlined } from '@ant-design/icons';
import { Button, message, Input, Table, Row, Col, Popconfirm, Tooltip, Divider, DatePicker, Select  } from 'antd';
import React, { useState, useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Modal, Form } from 'antd';
import { queryUser, addUser, resetPassword, removeUser, updateUser} from './service';

const { Option } = Select;
const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 },
};
const TableLeft = () => {
  const [form] = Form.useForm();
  const handleAdd = async (fields) => {
    const hide = message.loading('正在添加');

    try {
      await addUser({ ...fields });
      hide();
      message.success('添加成功');
      return true;
    } catch (error) {
      hide();
      message.error('添加失败请重试！');
      return false;
    }
  };
  const handleUpdate = async (fields) => {
    const hide = message.loading('正在编辑');
    try {
      await updateUser(fields);
      hide();
      message.success('编辑成功');
      return true;
    } catch (error) {
      hide();
      message.error('编辑失败请重试！');
      return false;
    }
  };
  const handleRemove = async (selectedRows) => {
    const hide = message.loading('正在删除');
    if (!selectedRows) return true;

    try {
      await removeUser({
        key: selectedRows.key,
      });
      hide();
      message.success('删除成功，即将刷新');
      return true;
    } catch (error) {
      hide();
      message.error('删除失败，请重试');
      return false;
    }
  };

  const handleReset = async (selectedRows) => {
    const hide = message.loading('正在重置');
    if (!selectedRows) return true;

    try {
      await resetPassword({
        key: selectedRows.key,
      });
      hide();
      message.success('重置成功');
      return true;
    } catch (error) {
      hide();
      message.error('重置失败，请重试');
      return false;
    }
  };
  const [createModalVisible, handleModalVisible] = useState(false);
  const [updateModalVisible, handleUpdateModalVisible] = useState(false);
  const [content, setContent] = useState([]);
  useEffect(() => {
    queryUser({ current: 1, pageSize: 20, sorter: {}, filter: {} }).then((res) => {
      setContent(res.data)
    })
  }, [])

  const handleEdit = (res) => {
    form.resetFields();
    form.setFieldsValue(res)
    handleUpdateModalVisible(true);
  }
  const columns = [
    {
      title: 'id',
      dataIndex: 'key',
      key: 'key',
    },
    {
      title: '用户姓名',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '工号',
      dataIndex: 'callNo',
      key: 'callNo',
    },
    {
      title: '用户状态',
      dataIndex: 'progress',
      key: 'progress',
    },
    {
      title: '操作',
      width: 300,
      align: 'center',
      render: (text, record) => (
        <div>
           <a style={{ textAlign: 'center' }} onClick={() => handleEdit(record)}><Tooltip title="编辑">编辑</Tooltip></a>
          <Divider type="vertical" />
          <Popconfirm title="确定注销？" onConfirm={() => handleDelete(record)}>
            <a style={{ textAlign: 'center' }}><Tooltip title="注销">注销</Tooltip></a>
          </Popconfirm>
          <Divider type="vertical" />
          <Popconfirm title="确定重置密码？" onConfirm={() => handleReset(record)}>
            <a style={{ textAlign: 'center' }}><Tooltip title="重置密码">重置密码</Tooltip></a>
          </Popconfirm>
        </div>
      )
    }
  ];
  const handleDelete = async (record) => {
    const success = await handleRemove(record);
    if (success) {
      queryUser({ current: 1, pageSize: 20, sorter: {}, filter: {} }).then((res) => {
        setContent(res.data)
      })
    }
  }
  const onFinishAdd = async (values) => {
    console.log('Success:', values);
    const success = await handleAdd(values);
    if (success) {
      handleModalVisible(false);
      queryUser({ current: 1, pageSize: 20, sorter: {}, filter: {} }).then((res) => {
        setContent(res.data)
      })
    }
  };
  const onFinishUpdate = async (values) => {
    console.log('Success:', values);
    const success = await handleUpdate(values);
    if (success) {
      handleUpdateModalVisible(false);
      queryUser({ current: 1, pageSize: 20, sorter: {}, filter: {} }).then((res) => {
        setContent(res.data)
      })
    }
  };
  return (
    <div>
      <Table
        title={() => (
          <div>
            <span style={{ 'float': 'left' }}>用户列表</span>
            <Button type='primary' style={{ 'float': 'right' }} onClick={() => { handleModalVisible(true); }}>
              <PlusOutlined />添加用户</Button>
          </div>)}
        dataSource={content}
        columns={columns}
      />
      <Modal
        title='添加用户'
        width="460px"
        visible={createModalVisible}
        onCancel={() => handleModalVisible(false)}
        footer={null}
      >
        <Form name="basic"
          onFinish={onFinishAdd}
        >
          <Form.Item {...layout}
            label="用户姓名"
            name="name"
            rules={[{ required: true, message: '请输入分类编码!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item {...layout}
            label="工号"
            name="number"
            rules={[{ required: true, message: '请输入分类名称!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item {...layout}
            label="性别"
            name="sex"
            rules={[{ required: true, message: '请输入分类名称!' }]}
          >
             <Select>
              <Option key='男'>男</Option>
              <Option key='女'>女</Option>
            </Select>
          </Form.Item>
          <Form.Item {...layout}
            label="出生日期"
            name="brithday"
          >
             <DatePicker />
          </Form.Item>
          <Form.Item {...layout}
            label="家庭地址"
            name="address"
          >
            <Input />
          </Form.Item>
          <Form.Item {...layout}
            label="毕业院校"
            name="school"
          >
            <Input />
          </Form.Item>
          <Form.Item style={{ textAlign: 'right' }}>
            <Button type="primary" htmlType="submit">
              提交
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title='编辑用户'
        width="460px"
        visible={updateModalVisible}
        onCancel={() => handleUpdateModalVisible(false)}
        footer={null}
      >
        <Form name="basic" form ={form}
          onFinish={onFinishUpdate}
        >
          <Form.Item {...layout}
            label="用户姓名"
            name="name"
            rules={[{ required: true, message: '请输入分类编码!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item {...layout}
            label="工号"
            name="number"
            rules={[{ required: true, message: '请输入分类名称!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item {...layout}
            label="性别"
            name="sex"
            rules={[{ required: true, message: '请输入分类名称!' }]}
          >
             <Select>
              <Option key='男'>男</Option>
              <Option key='女'>女</Option>
            </Select>
          </Form.Item>
          <Form.Item {...layout}
            label="出生日期"
            name="brithday"
          >
             <DatePicker />
          </Form.Item>
          <Form.Item {...layout}
            label="家庭地址"
            name="address"
          >
            <Input />
          </Form.Item>
          <Form.Item {...layout}
            label="毕业院校"
            name="school"
          >
            <Input />
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

