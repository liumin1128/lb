export default [
  {
    path: '/',
    wrappers: ['@/wrappers/material-ui'],
    routes: [
      {
        path: '/',
        component: '@/pages/home',
        title: 'Home',
      },
    ],
  },
];
