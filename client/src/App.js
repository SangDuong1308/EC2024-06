import { Routes, Route } from 'react-router-dom';
import { useSelector } from 'react-redux';

import routes from 'routes';
import { Fragment } from 'react';
function App() {
    const { user } = useSelector((state) => state.user);

    return (
        <div>
            <Routes>
                {routes.map((route, index) => {
                    const Layout = route.layout ? route.layout : Fragment;
                    const Page = route.element;

                    return (
                        <Route
                            key={index}
                            path={route.path}
                            element={
                                <Layout>
                                    <Page />
                                </Layout>
                            }
                        />
                    );
                })}

                <Route path="*" element={<h1>404</h1>} />
            </Routes>
        </div>
    );
}

export default App;
