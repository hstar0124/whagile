import AdminNavbarCss from './AdminNavbar.module.css';
import { Menu } from 'primereact/menu';
import { useState, useProps, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function AdminNavbar() {

    const navigate = useNavigate();
    const [selectedMenu, setSelectedMenu] = useState();
    const menus = [
        'dashboard',
        'member',
        'auth',
        'product',
        'inquery',
        'statistics'
    ];

    useEffect(
        () => {
            const url = window.location.pathname;
            const path = url.substring(7);
            const copyMenus = [...menus];

            copyMenus.filter(
                (menu) => {
                    if(path.includes(menu)) {
                        setSelectedMenu(menu);
                    }
                }
            )
        },
        [window.location.pathname]
    );

    let items = [
        {label: '대시보드', icon: 'pi pi-fw pi-chart-bar', command:()=>{ navigate(`/admin/dashboard`); }, style: { backgroundColor: (selectedMenu ==='dashboard')? 'rgba(248, 96, 100, .16)': '' }},
        {label: '회원관리', icon: 'pi pi-fw pi-user', command:()=>{ navigate(`/admin/member`); }, style: { backgroundColor: (selectedMenu ==='member')? 'rgba(248, 96, 100, .16)': '' }},
        {label: '권한관리', icon: 'pi pi-fw pi-key', command:()=>{ navigate(`/admin/auth`); }, style: { backgroundColor: (selectedMenu ==='auth')? 'rgba(248, 96, 100, .16)': '' }},
        // {label: '상품관리', icon: 'pi pi-fw pi-shopping-bag', command:()=>{ navigate(`/admin/product`); }, style: { backgroundColor: (selectedMenu ==='product')? 'rgba(248, 96, 100, .16)': '' }},
        {label: '고객센터', icon: 'pi pi-fw pi-phone', command:()=>{ navigate(`/admin/inquery`); }, style: { backgroundColor: (selectedMenu ==='inquery')? 'rgba(248, 96, 100, .16)': '' }},
        // {label: '데이터통계', icon: 'pi pi-fw pi-chart-line', command:()=>{ navigate(`/admin/statistics`); }, style: { backgroundColor: (selectedMenu ==='statistics')? 'rgba(248, 96, 100, .16)': '' }},
    ];

    return (
        <nav id={AdminNavbarCss.admin}>
            <div id={AdminNavbarCss.title}>
                <i className="pi pi-fw pi-chart-line"/>
                <span>WHY-AGILE 관리자</span>
            </div>
            <Menu model={items} style={{width: '198px'}}/>
        </nav>
    );
}

export default AdminNavbar;