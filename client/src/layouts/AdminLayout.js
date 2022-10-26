import { Outlet } from 'react-router-dom';
import AdminHeader from '../components/commons/AdminHeader';
import AdminNavbar from '../components/commons/AdminNavbar';
import AdminLayoutCss from './AdminLayout.module.css';

function AdminLayout() {

    return (
        <>
            <AdminHeader/>
            <div id={ AdminLayoutCss.body }>
                <AdminNavbar/>
                <Outlet/>
            </div>
        </>
    );
}

export default AdminLayout;