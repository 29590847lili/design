import { PlusOutlined, EditOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { Button, message, Input, Drawer, Table, Row, Col, Popconfirm, Tooltip, Divider  } from 'antd';
import React, { useState, useRef } from 'react';
import { useIntl, FormattedMessage } from 'umi';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import { ModalForm, ProFormText, ProFormTextArea } from '@ant-design/pro-form';
import ProDescriptions from '@ant-design/pro-descriptions';
import UpdateForm from './UpdateForm';
import { queryRule, updateRule, addRule, removeRule } from './service';
/**
 * 添加节点
 *
 * @param fields
 */

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
/**
 * 更新节点
 *
 * @param fields
 */

const handleUpdate = async (fields) => {
  const hide = message.loading('正在配置');

  try {
    await updateRule({
      name: fields.name,
      desc: fields.desc,
      key: fields.key,
    });
    hide();
    message.success('配置成功');
    return true;
  } catch (error) {
    hide();
    message.error('配置失败请重试！');
    return false;
  }
};
/**
 * 删除节点
 *
 * @param selectedRows
 */

const handleRemove = async (selectedRows) => {
  const hide = message.loading('正在删除');
  if (!selectedRows) return true;

  try {
    await removeRule({
      key: selectedRows.map((row) => row.key),
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

const TableList = () => {
  /** 新建窗口的弹窗 */
  const [createModalVisible, handleModalVisible] = useState(false);
  /** 分布更新窗口的弹窗 */

  const [updateModalVisible, handleUpdateModalVisible] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const actionRef = useRef();
  const [currentRow, setCurrentRow] = useState();
  const [selectedRowsState, setSelectedRows] = useState([]);
  /** 国际化配置 */

  const intl = useIntl();
  const columns = [
    {
      title: 'id',
      dataIndex: 'name',
      render: (dom, entity) => {
        return (
          <a
            onClick={() => {
              setCurrentRow(entity);
              setShowDetail(true);
            }}
          >
            {dom}
          </a>
        );
      },
    },
    {
      title: '分类编码',
      dataIndex: 'desc',
      valueType: 'textarea',
    },
    {
        title: '分类名称',
        dataIndex: 'desc',
        valueType: 'textarea',
      },
    {
      title: <FormattedMessage id="pages.searchTable.titleOption" defaultMessage="操作" />,
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [
        <a
          key="config"
          onClick={() => {
            handleUpdateModalVisible(true);
            setCurrentRow(record);
          }}
        >
          编辑
        </a>,
        <a key="subscribeAlert">
          删除
        </a>,
      ],
    },
  ];
  return (
    <PageContainer>
      <ProTable
        headerTitle={intl.formatMessage({
          id: 'pages.searchTable.title',
          defaultMessage: '查询表格',
        })}
        actionRef={actionRef}
        rowKey="key"
        search={{
          labelWidth: 120,
        }}
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              handleModalVisible(true);
            }}
          >
             <FormattedMessage id="pages.searchTable.new" defaultMessage="新建" />
          </Button>,
        ]}
        request={(params, sorter, filter) => queryRule({ ...params, sorter, filter })}
        columns={columns}
      />
      <ModalForm
        title={intl.formatMessage({
          id: 'pages.searchTable.createForm.newRule',
          defaultMessage: '新建规则',
        })}
        width="400px"
        visible={createModalVisible}
        onVisibleChange={handleModalVisible}
        onFinish={async (value) => {
          const success = await handleAdd(value);

          if (success) {
            handleModalVisible(false);

            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
      >
        <ProFormText
          rules={[
            {
              required: true,
              message: (
                <FormattedMessage
                  id="pages.searchTable.ruleName"
                  defaultMessage="规则名称为必填项"
                />
              ),
            },
          ]}
          width="md"
          name="name"
        />
        <ProFormTextArea width="md" name="desc" />
      </ModalForm>
      <UpdateForm
        onSubmit={async (value) => {
          const success = await handleUpdate(value);

          if (success) {
            handleUpdateModalVisible(false);
            setCurrentRow(undefined);

            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
        onCancel={() => {
          handleUpdateModalVisible(false);
          setCurrentRow(undefined);
        }}
        updateModalVisible={updateModalVisible}
        values={currentRow || {}}
      />

      <Drawer
        width={600}
        visible={showDetail}
        onClose={() => {
          setCurrentRow(undefined);
          setShowDetail(false);
        }}
        closable={false}
      >
        {currentRow?.name && (
          <ProDescriptions
            column={2}
            title={currentRow?.name}
            request={async () => ({
              data: currentRow || {},
            })}
            params={{
              id: currentRow?.name,
            }}
            columns={columns}
          />
        )}
      </Drawer>
    </PageContainer>
  );
};

const TableRight = () => {
    const dataSource = [
        {
          key: '1',
          name: '胡彦斌',
          age: 32,
          address: '西湖区湖底公园1号',
        },
        {
          key: '2',
          name: '胡彦祖',
          age: 42,
          address: '西湖区湖底公园1号',
        },
      ];
      
    const columns = [
    {
        title: 'id',
        dataIndex: 'name',
        key: 'name',
    },
    {
        title: '物品名称',
        dataIndex: 'age',
        key: 'age',
    },
    {
        title: '型号',
        dataIndex: 'address',
        key: 'address',
    },
    {
        title: '是否有效',
        dataIndex: 'address',
        key: 'address',
    },
    {
        title: '备注',
        dataIndex: 'address',
        key: 'address',
    },
    {
		title: '操作',
		width: 100,
		align: 'center',
		render: (text, record) => (
			<div>
				<a style={{textAlign:'center'}} onClick={() => this.handleMenuClick('edit',record)}><Tooltip title="编辑"><EditOutlined /></Tooltip></a>
				<Divider type="vertical" />
				<Popconfirm title="确定删除此条数据？" onConfirm={() => this.handleMenuClick('del',record)}>
					<a style={{textAlign:'center'}}><Tooltip title="删除"><MinusCircleOutlined /></Tooltip></a>
				</Popconfirm>
			</div>
	    )
    }
    ];
    return (
        <div>
            <Table 
                title={()=>(<div><span style={{'float':'left'}}>物品列表</span><Button type='primary' style={{'float':'right'}}><PlusOutlined/>添加</Button></div>)}
                dataSource={dataSource}
                columns={columns} 
            />
        </div>
        
    )
}

const TableLeft = () => {
    const dataSource = [
        {
          key: '1',
          name: '胡彦斌',
          age: 32,
          address: '西湖区湖底公园1号',
        },
        {
          key: '2',
          name: '胡彦祖',
          age: 42,
          address: '西湖区湖底公园1号',
        },
    ];
      
    const columns = [
    {
        title: 'id',
        dataIndex: 'name',
        key: 'name',
    },
    {
        title: '分类编码',
        dataIndex: 'age',
        key: 'age',
    },
    {
        title: '分类名称',
        dataIndex: 'address',
        key: 'address',
    },
    {
		title: '操作',
		width: 100,
		align: 'center',
		render: (text, record) => (
			<div>
				<a style={{textAlign:'center'}} onClick={() => this.handleMenuClick('edit',record)}><Tooltip title="编辑"><EditOutlined /></Tooltip></a>
				<Divider type="vertical" />
				<Popconfirm title="确定删除此条数据？" onConfirm={() => this.handleMenuClick('del',record)}>
					<a style={{textAlign:'center'}}><Tooltip title="删除"><MinusCircleOutlined /></Tooltip></a>
				</Popconfirm>
			</div>
	    )
    }
    ];
    return (
        <div>
            <Table 
                title={()=>(<div><span style={{'float':'left'}}>物品分类</span><Button type='primary' style={{'float':'right'}}><PlusOutlined/>添加</Button></div>)}
                dataSource={dataSource}
                columns={columns} 
            />
        </div>
    )
}
const Page = () => {
    return (
        <PageContainer>
            <Row gutter={24}>
                <Col span={12}>{TableLeft()}</Col>
                <Col span={12}>{TableRight()}</Col>
            </Row>
        </PageContainer>
    )
}
export default Page;