import * as layouts from 'layouts';
import * as pages from 'pages';

const routes = [
    {
        path: '/',
        element: pages.HomePage,
        layout: layouts.DefaultLayout,
    },
    {
        path: '/auth/login',
        element: pages.LoginPage,
    },
    {
        path: '/auth/register',
        element: () => <div>REGISTER</div>,
    },
];

export default routes;
