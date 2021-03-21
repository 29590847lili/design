import request from '@/utils/request';

export async function queryList(params) {
  return request('/api/rule', {
    params,
  });
}
export async function removeList(params) {
  return request('/api/rule', {
    method: 'POST',
    data: { ...params, method: 'delete' },
  });
}
export async function addList(params) {
  return request('/api/rule', {
    method: 'POST',
    data: { ...params, method: 'post' },
  });
}
export async function updateList(params) {
  return request('/api/rule', {
    method: 'POST',
    data: { ...params, method: 'update' },
  });
}

export async function cancelList(params) {
  return request('/api/rule', {
    method: 'POST',
    data: { ...params, method: 'update' },
  });
}
// 审批页面
export async function queryApprovalList(params) {
  return request('/api/rule', {
    params,
  });
}