import { PlusOutlined, EditOutlined, MinusCircleOutlined, AntDesignOutlined } from '@ant-design/icons';
import { Button, message, Input, Table, Row, Col, Popconfirm, Tooltip, Divider, Radio } from 'antd';
import React, { useState, useRef, useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Modal, Form } from 'antd';
import { queryRule, updateRule, addRule, removeRule, queryGoods, addGoods, removeGoods, updateGoods } from './service';
import styles from './styles.less'

const { TextArea } = Input
const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 },
};

const TableRight = (props) => {
  const [form] = Form.useForm();
  const handleAdd = async (fields) => {
    const hide = message.loading('正在添加');

    try {
      await addGoods({ ...fields });
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
      await updateGoods({
        name: fields.name,
        code: fields.code,
        key: fields.key,
      });
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
      await removeGoods({
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
  const columns = [
    {
      title: 'id',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: '物品名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '型号',
      dataIndex: 'code',
      key: 'code',
    },
    {
      title: '是否有效',
      dataIndex: 'valid',
      key: 'valid',
    },
    {
      title: '备注',
      dataIndex: 'tip',
      key: 'tip',
    },
    {
      title: '操作',
      width: 100,
      align: 'center',
      render: (text, record) => (
        <div>
          <a style={{ textAlign: 'center' }} onClick={() => handleEdit(record)}><Tooltip title="编辑"><EditOutlined /></Tooltip></a>
          <Divider type="vertical" />
          <Popconfirm title="确定删除此条数据？" onConfirm={() => handleDelete(record)}>
            <a style={{ textAlign: 'center' }}><Tooltip title="删除"><MinusCircleOutlined /></Tooltip></a>
          </Popconfirm>
        </div>
      )
    }
  ];
  const handleDelete = async (record) => {
    const success = await handleRemove(record);
    if (success) {
      queryGoods({ current: 1, pageSize: 20, sorter: {}, filter: {} }).then((res) => {
        setContent(res.data)
      })
    }
  }
  const onFinishAdd = async (values) => {
    console.log('Success:', values);
    const success = await handleAdd(values);
    if (success) {
      handleModalVisible(false);
      queryGoods({ current: 1, pageSize: 20, sorter: {}, filter: {} }).then((res) => {
        props.setContent(res.data)
      })
    }
  };
  const onFinishUpdate = async (values) => {
    console.log('Success:', values);
    const success = await handleUpdate(values);
    if (success) {
      handleUpdateModalVisible(false);
      queryGoods({ current: 1, pageSize: 20, sorter: {}, filter: {} }).then((res) => {
        props.setContent(res.data)
      })
    }
  };
  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };
  const handleEdit = (res) => {
    handleUpdateModalVisible(true);
    form.setFieldsValue(res)
  }
  const [createModalVisible, handleModalVisible] = useState(false);
  const [updateModalVisible, handleUpdateModalVisible] = useState(false);
  const [record, setRecord] = useState({ name: '', code: '', valid: 1, tip: '' });
  const [value, setValue] = React.useState(1);
  const [editValue, setEditValue] = React.useState(record.valid);
  const onChange = e => {
    setValue(e.target.value);
  };
  const onChangeEdit = e => {
    setEditValue(e.target.value);
  };
  return (
    <div>
      <Table
        title={() => (<div><span style={{ 'float': 'left' }}>物品列表</span><Button onClick={() => { handleModalVisible(true); }} type='primary' style={{ 'float': 'right' }}><PlusOutlined />添加</Button></div>)}
        dataSource={props.content}
        columns={columns}
      />
      <Modal
        title='添加物品'
        width="600px"
        visible={createModalVisible}
        onCancel={() => handleModalVisible(false)}
        footer={null}
        initialValues={record}
      >
        <Form name="basic"
          onFinish={onFinishAdd}
          onFinishFailed={onFinishFailed}
        >
          <Form.Item {...layout}
            label="物品名称"
            name="name"
            rules={[{ required: true, message: '请输入物品名称!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item {...layout}
            label="物品型号"
            name="code"
            rules={[{ required: true, message: '请输入物品型号!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item {...layout}
            label="是否有效"
            name="valid"
          >
            <Radio.Group onChange={onChange} value={value}>
              <Radio value={1}>是</Radio>
              <Radio value={0}>否</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item {...layout}
            label="备注"
            name="tip"
          >
            <TextArea />
          </Form.Item>
          <Form.Item style={{ textAlign: 'right' }}>
            <Button type="primary" htmlType="submit">
              提交
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title='编辑物品'
        width="600px"
        visible={updateModalVisible}
        onCancel={() => handleUpdateModalVisible(false)}
        footer={null}
        form={form}
      >
        <Form name="basic"
          onFinish={onFinishUpdate}
          onFinishFailed={onFinishFailed}
          initialValues={record}
          form={form}
        >
          <Form.Item {...layout}
            label="物品名称"
            name="name"
            rules={[{ required: true, message: '请输入物品名称!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item {...layout}
            label="物品型号"
            name="code"
            rules={[{ required: true, message: '请输入物品型号!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item {...layout}
            label="是否有效"
            name="valid"
          >
            <Radio.Group value={editValue} onChange={onChangeEdit}>
              <Radio value={1}>是</Radio>
              <Radio value={0}>否</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item {...layout}
            label="备注"
            name="tip"
          >
            <TextArea />
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

const TableLeft = (props) => {
  const [form] = Form.useForm();
  const handleAdd = async (fields) => {
    const hide = message.loading('正在添加');

    try {
      await addRule({ ...fields });
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
      await updateRule({
        name: fields.name,
        code: fields.code,
        key: fields.key,
      });
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
      await removeRule({
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
  const [updateModalVisible, handleUpdateModalVisible] = useState(false);
  const [content, setContent] = useState([]);
  useEffect(() => {
    queryRule({ current: 1, pageSize: 20, sorter: {}, filter: {} }).then((res) => {
      setContent(res.data)
    })
  }, [])
  const handleEdit = (res) => {
    form.resetFields();
    form.setFieldsValue({ name: res.name, callNo: res.callNo })
    handleUpdateModalVisible(true);
  }
  const columns = [
    {
      title: 'id',
      dataIndex: 'key',
      key: 'key',
    },
    {
      title: '分类编码',
      dataIndex: 'callNo',
      key: 'callNo',
    },
    {
      title: '分类名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '操作',
      width: 100,
      align: 'center',
      render: (text, record) => (
        <div>
          <a
            style={{ textAlign: 'center' }}
            onClick={() => handleEdit(record)}>
            <Tooltip title="编辑"><EditOutlined /></Tooltip>
          </a>
          <Divider type="vertical" />
          <Popconfirm title="确定删除此条数据？" onConfirm={() => handleDelete(record)}>
            <a style={{ textAlign: 'center' }}><Tooltip title="删除"><MinusCircleOutlined /></Tooltip></a>
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
      queryRule({ current: 1, pageSize: 20, sorter: {}, filter: {} }).then((res) => {
        setContent(res.data)
      })
    }
  };
  const onFinishUpdate = async (values) => {
    console.log('Success:', values);
    const success = await handleUpdate(values);
    if (success) {
      handleUpdateModalVisible(false);
      queryRule({ current: 1, pageSize: 20, sorter: {}, filter: {} }).then((res) => {
        setContent(res.data)
      })
    }
  };
  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  const handleRow = (e, record) => {
    if (e.target.tagName != "svg" && e.target.tagName != "path" && e.target.tagName != "BUTTON") {
      const tbd = e.currentTarget.parentNode, trs = tbd.childNodes;
      for (let node of trs) {
        node.classList.remove('active');
      }
      e.currentTarget.classList.add("active");
    }
    props.setShowRight(true)
    console.log(record.key)
    queryGoods({ current: 1, pageSize: 20, sorter: {}, filter: {} }).then((res) => {
      props.setContent(res.data)
    })
  }
  return (
    <div>
      <Table
        title={() => (
          <div>
            <span style={{ 'float': 'left' }}>物品分类</span>
            <Button type='primary' style={{ 'float': 'right' }} onClick={() => { handleModalVisible(true); }}>
              <PlusOutlined />添加</Button>
          </div>)}
        dataSource={content}
        columns={columns}
        onRow={record => {
          return {
            onClick: event => handleRow(event, record), // 点击行
          };
        }}
      />
      <Modal
        title='新建物品分类'
        width="400px"
        visible={createModalVisible}
        onCancel={() => handleModalVisible(false)}
        footer={null}
      >
        <Form name="basic"
          onFinish={onFinishAdd}
          onFinishFailed={onFinishFailed}
        // initialValues={{remember: true,}}
        >
          <Form.Item
            label="分类编码"
            name="callNo"
            rules={[{ required: true, message: '请输入分类编码!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="分类名称"
            name="name"
            rules={[{ required: true, message: '请输入分类名称!' }]}
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
        title='编辑物品分类'
        width="400px"
        visible={updateModalVisible}
        onCancel={() => handleUpdateModalVisible(false)}
        footer={null}
      >
        <Form name="basic"
          onFinish={onFinishUpdate}
          onFinishFailed={onFinishFailed}
          form={form}
        >
          <Form.Item
            label="分类编码"
            name="callNo"
            rules={[{ required: true, message: '请输入分类编码!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="分类名称"
            name="name"
            rules={[{ required: true, message: '请输入分类名称!' }]}
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
  const [showRight, setShowRight] = useState(false);
  const [content, setContent] = useState([]);
  return (
    <PageContainer>
      <Row gutter={24}>
        <Col span={12}><TableLeft setContent={setContent} setShowRight={setShowRight} /></Col>
        {showRight && <Col span={12}><TableRight content={content} setContent={setContent} /></Col>}
      </Row>
    </PageContainer>
  )
}

export default Page;

