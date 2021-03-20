export default [
  {
    path: '/',
    component: '../layouts/BlankLayout',
    routes: [
      {
        path: '/user',
        component: '../layouts/UserLayout',
        routes: [
          {
            name: 'login',
            path: '/user/login',
            component: './User/login',
          },
        ],
      },
      {
        path: '/',
        component: '../layouts/SecurityLayout',
        routes: [
          {
            path: '/',
            component: '../layouts/BasicLayout',
            authority: ['admin', 'user'],
            routes: [
              {
                path: '/',
                redirect: '/welcome',
              },
              {
                path: '/welcome',
                name: 'welcome',
                icon: 'smile',
                component: './Welcome',
              },
              {
                path: '/admin',
                name: 'admin',
                icon: 'crown',
                component: './Admin',
                authority: ['admin'],
                routes: [
                  {
                    path: '/admin/sub-page',
                    name: 'sub-page',
                    icon: 'smile',
                    component: './Welcome',
                    authority: ['admin'],
                  },
                ],
              },
              {
                name: 'list.table-list',
                icon: 'table',
                path: '/list',
                component: './TableList',
              }, 
              {
                name: 'warehouse',
                icon: 'table',
                path: '/warehouse',
                routes: [
                  {
                    path: '/warehouse/classified-manage',
                    name: 'classified-manage',
                    icon: 'home',
                    component: './Warehouse/components/ClassifiedManage',
                  },
                  {
                    path: '/warehouse/detailed-view',
                    name: 'detailed-view',
                    icon: 'home',
                    component: './Warehouse/components/DetailedView',
                  },
                ]
              },
              {
                name: 'application',
                icon: 'form',
                path: '/application',
                routes: [
                  {
                    path: '/application/application-form',
                    name: 'application-form',
                    icon: 'home',
                    component: './Application/components/ApplicationForm',
                  },
                  {
                    path: '/application/application-approval',
                    name: 'application-approval',
                    icon: 'home',
                    component: './Application/components/ApplicationApproval',
                  },
                ]
              },
              {
                name: 'system',
                icon: 'profile',
                path: '/system',
                routes: [
                  {
                    path: '/system/user-management',
                    name: 'user-management',
                    icon: 'home',
                    component: './System/components/UserManagement',
                  },
                  {
                    path: '/system/user-info',
                    name: 'user-info',
                    icon: 'home',
                    component: './System/components/UserInfo',
                  },
                ]
              },
              {
                component: './404',
              },
            ],
          },
          {
            component: './404',
          },
        ],
      },
    ],
  },
  {
    component: './404',
  },
];
