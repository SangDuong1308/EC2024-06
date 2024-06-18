import { Routes, Route } from 'react-router-dom';
import { useSelector } from 'react-redux';

import routes from 'routes';
function App() {
    const { user } = useSelector((state) => state.user);

    return (
        <div>
            <Routes>
                {routes.map((route, index) => (
                    <Route key={index} path={route.path} element={route.element} />
                ))}

                <Route path="*" element={<h1>404</h1>} />
            </Routes>
        </div>
    );
}

export default App;
