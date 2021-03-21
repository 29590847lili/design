import { PlusOutlined } from '@ant-design/icons';
import { Button, message, Input, Table, Row, Col, Popconfirm, Tooltip, Divider, InputNumber, DatePicker, Select  } from 'antd';
import React, { useState, useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Modal, Form } from 'antd';
import { queryList, addList, removeList, updateList, cancelList } from './service';
import { queryUser } from '../../System/components/service'
import { queryRule, queryGoods } from '../../Warehouse/components/service'

const { Option } = Select;

const TableLeft = () => {
  const [form] = Form.useForm();
  const handleAdd = async (fields) => {
    const hide = message.loading('正在入库');

    try {
      await addList({ ...fields });
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
      await removeList({
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
  const handleUpdate = async (fields) => {
    const hide = message.loading('正在编辑');
    try {
      await updateList(fields);
      hide();
      message.success('编辑成功');
      return true;
    } catch (error) {
      hide();
      message.error('编辑失败请重试！');
      return false;
    }
  };

  const cancleList = async (fields) => {
    const hide = message.loading('正在撤回');
    try {
      await cancelList(fields);
      hide();
      message.success('撤回成功');
      return true;
    } catch (error) {
      hide();
      message.error('撤回失败请重试！');
      return false;
    }
  };
  
  const [createModalVisible, handleModalVisible] = useState(false);
  const [updateModalVisible, handleUpdateModalVisible] = useState(false);
  const [viewModalVisible, handleViewModalVisible] = useState(false);
  const [content, setContent] = useState([]);
  const [type, setType] = useState([]);
  const [user, setUser] = useState([]);
  const [goods, setGoods] = useState([]);

  useEffect(() => {
    queryList({ current: 1, pageSize: 20, sorter: {}, filter: {} }).then((res) => {
      setContent(res.data)
    })
    queryRule({ current: 1, pageSize: 20, sorter: {}, filter: {} }).then((res) => {
      setType(res.data.map(item => ( <Option key={item.key}>{item.name}</Option> )))
    })
    queryUser({ current: 1, pageSize: 20, sorter: {}, filter: {} }).then((res) => {
      setUser(res.data.map(item => ( <Option key={item.key}>{item.name}</Option> )))
    })
    queryGoods({ current: 1, pageSize: 20, sorter: {}, filter: {} }).then((res) => {
      setGoods(res.data.map(item => ( <Option key={item.key}>{item.name}</Option> )))
    })
  }, [])
  
  const columns = [
    {
      title: 'id',
      dataIndex: 'key',
      key: 'key',
    },
    {
      title: '申请人',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '申领物品',
      dataIndex: 'stockName',
      key: 'stockName',
    },
    {
      title: '所属类别',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: '申请数量',
      dataIndex: 'number',
      key: 'number',
    },
    {
      title: '申请时间',
      dataIndex: 'time',
      key: 'time',
    },
    {
      title: '申请状态',
      dataIndex: 'state',
      key: 'state',
    },
    {
      title: '备注',
      dataIndex: 'tip',
      key: 'tip',
    },
    {
      title: '操作',
      width: 300,
      align: 'center',
      render: (text, record) => (
        <div>
          {/* <a style={{ textAlign: 'center' }} onClick={() => handleView(record)}><Tooltip title="查看">查看</Tooltip></a>
          <Divider type="vertical" /> */}
          <a style={{ textAlign: 'center' }} onClick={() => handleEdit(record)}><Tooltip title="编辑">编辑</Tooltip></a>
          <Divider type="vertical" />
          <a style={{ textAlign: 'center' }} onClick={() => handleCancel(record)}><Tooltip title="撤回">撤回</Tooltip></a>
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
      queryList({ current: 1, pageSize: 20, sorter: {}, filter: {} }).then((res) => {
        setContent(res.data)
      })
    }
  }
  const onFinishAdd = async (values) => {
    console.log('Success:', values);
    const success = await handleAdd(values);
    if (success) {
      handleModalVisible(false);
      queryList({ current: 1, pageSize: 20, sorter: {}, filter: {} }).then((res) => {
        setContent(res.data)
      })
    }
  };
  const handleEdit = (res) => {
    form.resetFields();
    form.setFieldsValue(res)
    handleUpdateModalVisible(true);
  }
  const handleView = (res) => {
    form.resetFields();
    form.setFieldsValue(res)
    handleViewModalVisible(true);
  }
  const onFinishUpdate = async (values) => {
    console.log('Success:', values);
    const success = await handleUpdate(values);
    if (success) {
      handleUpdateModalVisible(false);
      queryList({ current: 1, pageSize: 20, sorter: {}, filter: {} }).then((res) => {
        setContent(res.data)
      })
    }
  };

  const handleCancel = async (values) => {
    console.log('Success:', values);
    const success = await cancleList(values);
    if (success) {
      queryList({ current: 1, pageSize: 20, sorter: {}, filter: {} }).then((res) => {
        setContent(res.data)
      })
    }
  };
  return (
    <div>
      <Table
        title={() => (
          <div>
            <span style={{ 'float': 'left' }}>申请单列表</span>
            <Button type='primary' style={{ 'float': 'right' }} onClick={() => { handleModalVisible(true); }}>
              <PlusOutlined />添加申请单</Button>
          </div>)}
        dataSource={content}
        columns={columns}
      />
      <Modal
        title='添加申请单'
        width="400px"
        visible={createModalVisible}
        onCancel={() => handleModalVisible(false)}
        footer={null}
      >
        <Form name="basic"
          onFinish={onFinishAdd}
        >
          <Form.Item
            label="申请人"
            name="name"
            rules={[{ required: true, message: '请输入申请人!' }]}
          >
            <Select
              showSearch
              optionFilterProp="children"
            >
              {user}
            </Select>          
          </Form.Item>
          <Form.Item
            label="申领物品"
            name="stockName"
            rules={[{ required: true, message: '请输入分类名称!' }]}
          >
            <Select
              showSearch
              optionFilterProp="children"
            >
              {goods}
            </Select>
          </Form.Item>
          <Form.Item
            label="所属类别"
            name="type"
            rules={[{ required: true, message: '请输入分类名称!' }]}
          >
            <Select
              showSearch
              optionFilterProp="children"
            >
              {type}
            </Select>
          </Form.Item>
          <Form.Item
            label="申请数量"
            name="number"
            rules={[{ required: true, message: '请输入分类名称!' }]}
          >
            <InputNumber min={1} />
          </Form.Item>
          <Form.Item
            label="申请时间"
            name="time"
            rules={[{ required: true, message: '请输入分类名称!' }]}
          >
            <DatePicker />
          </Form.Item>
          <Form.Item
            label="备注"
            name="tip"
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
        title='编辑申请单'
        width="400px"
        visible={updateModalVisible}
        onCancel={() => handleUpdateModalVisible(false)}
        footer={null}
      >
        <Form name="basic"
          onFinish={onFinishUpdate}
          form = {form}
        >
          <Form.Item
            label="申请人"
            name="name"
            rules={[{ required: true, message: '请输入申请人!' }]}
          >
            <Select
              showSearch
              optionFilterProp="children"
            >
              {user}
            </Select>          
          </Form.Item>
          <Form.Item
            label="申领物品"
            name="stockName"
            rules={[{ required: true, message: '请输入分类名称!' }]}
          >
            <Select
              showSearch
              optionFilterProp="children"
            >
              {goods}
            </Select>
          </Form.Item>
          <Form.Item
            label="所属类别"
            name="type"
            rules={[{ required: true, message: '请输入分类名称!' }]}
          >
            <Select
              showSearch
              optionFilterProp="children"
            >
              {type}
            </Select>
          </Form.Item>
          <Form.Item
            label="申请数量"
            name="number"
            rules={[{ required: true, message: '请输入分类名称!' }]}
          >
            <InputNumber min={1} />
          </Form.Item>
          <Form.Item
            label="申请时间"
            name="time"
            rules={[{ required: true, message: '请输入分类名称!' }]}
          >
            <DatePicker />
          </Form.Item>
          <Form.Item
            label="备注"
            name="tip"
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

