import { PlusOutlined } from '@ant-design/icons';
import { Button, message, Input, Table, Row, Col, Popconfirm, Tooltip, Divider, InputNumber, Select  } from 'antd';
import React, { useState, useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Modal, Form } from 'antd';
import { queryRule, queryStock, addStock, approval, removeStock} from './service';

const { Option } = Select;

const TableLeft = () => {
  const [form] = Form.useForm();
  const handleAdd = async (fields) => {
    const hide = message.loading('正在入库');

    try {
      await addStock({ ...fields });
      hide();
      message.success('入库成功');
      return true;
    } catch (error) {
      hide();
      message.error('添加失败请重试！');
      return false;
    }
  };
  
  const handleRemove = async (selectedRows) => {
    const hide = message.loading('正在删除');
    if (!selectedRows) return true;

    try {
      await removeStock({
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
  const [createModalVisible, handleModalVisible] = useState(false);
  const [content, setContent] = useState([]);
  const [type, setType] = useState([]);
  useEffect(() => {
    queryStock({ current: 1, pageSize: 20, sorter: {}, filter: {} }).then((res) => {
      setContent(res.data)
    })
    queryRule({ current: 1, pageSize: 20, sorter: {}, filter: {} }).then((res) => {
      setType(res.data)
    })
  }, [])
  const handleApproval = async (selectedRows) => {
    const hide = message.loading('正在审批');
    if (!selectedRows) return true;

    try {
      await approval({
        key: selectedRows.key,
      });
      hide();
      message.success('审批成功，即将刷新');
      return true;
    } catch (error) {
      hide();
      message.error('审批失败，请重试');
      return false;
    }
  }
  const columns = [
    {
      title: 'id',
      dataIndex: 'key',
      key: 'key',
    },
    {
      title: '物品名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '所属分类',
      dataIndex: 'callNo',
      key: 'callNo',
    },
    {
      title: '库存数量',
      dataIndex: 'progress',
      key: 'progress',
    },
    {
      title: '操作',
      width: 300,
      align: 'center',
      render: (text, record) => (
        <div>
          <Popconfirm title="确定审批通过？" onConfirm={() => handleSure(record)}>
            <a style={{ textAlign: 'center' }}><Tooltip title="审批通过">审批通过</Tooltip></a>
          </Popconfirm>
          <Divider type="vertical" />
          <Popconfirm title="确定删除此条数据？" onConfirm={() => handleDelete(record)}>
            <a style={{ textAlign: 'center' }}><Tooltip title="删除">删除</Tooltip></a>
          </Popconfirm>
        </div>
      )
    }
  ];
  const handleDelete = async (record) => {
    const success = await handleRemove(record);
    if (success) {
      queryRule({ current: 1, pageSize: 20, sorter: {}, filter: {} }).then((res) => {
        setContent(res.data)
      })
    }
  }
  const onFinishAdd = async (values) => {
    console.log('Success:', values);
    const success = await handleAdd(values);
    if (success) {
      handleModalVisible(false);
      queryStock({ current: 1, pageSize: 20, sorter: {}, filter: {} }).then((res) => {
        setContent(res.data)
      })
    }
  };
  const handleSure =  async (values) => {
    console.log('Success:', values);
    const success = await handleApproval(values);
    if (success) {
      handleModalVisible(false);
      form.resetFields();
      queryStock({ current: 1, pageSize: 20, sorter: {}, filter: {} }).then((res) => {
        setContent(res.data)
      })
    }
  };
  return (
    <div>
      <Table
        title={() => (
          <div>
            <span style={{ 'float': 'left' }}>库存列表</span>
            <Button type='primary' style={{ 'float': 'right' }} onClick={() => { handleModalVisible(true); }}>
              <PlusOutlined />添加库存</Button>
          </div>)}
        dataSource={content}
        columns={columns}
      />
      <Modal
        title='添加物品库存'
        width="400px"
        visible={createModalVisible}
        onCancel={() => handleModalVisible(false)}
        footer={null}
      >
        <Form name="basic"
          onFinish={onFinishAdd}
        >
          <Form.Item
            label="物品名称"
            name="callNo"
            rules={[{ required: true, message: '请输入分类编码!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="所属分类"
            name="type"
            rules={[{ required: true, message: '请输入分类名称!' }]}
          >
            <Select
              showSearch
              optionFilterProp="children"
            >
              {type.map(item => ( <Option key={item.key}>{item.name}</Option> ))}
            </Select>
          </Form.Item>
          <Form.Item
            label="库存数量"
            name="name"
            rules={[{ required: true, message: '请输入分类名称!' }]}
          >
            <InputNumber min={1} />
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

