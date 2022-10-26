import AdminHeaderCss from './AdminHeader.module.css';
import { Button } from 'primereact/button';
import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect, useRef } from 'react';
import { OverlayPanel } from 'primereact/overlaypanel';
import { decodeJwt } from '../../utils/tokenUtils';

function AdminHeader() {

    const navigate = useNavigate();

    const op = useRef(null);
    const onClickHandler = () => navigate(`/admin/dashboard`)
    const [isLogin, setIsLogin] = useState(window.sessionStorage.getItem('isLogin'));
    const decoded = decodeJwt(window.localStorage.getItem("access_token"));

    const onClickLogout = () => {
        console.log('logout process finished');
        sessionStorage.clear();
        setIsLogin(false);
        navigate('/', { replace: true })
    }

    useEffect(() => {    
        console.log(decoded.role);
        if(!isLogin){
            console.log('AdminHeader isLogin?', isLogin);
            navigate('/', { replace: true })
        }

        if(decoded.role != 'ROLE_ADMIN'){
            onClickLogout();
        }
      },
    []);

    return (
        <header id={AdminHeaderCss.admin}>
            {/* logo */}
            <div id={AdminHeaderCss.logo}>
                <img 
                    src={process.env.PUBLIC_URL + '/logo_admin.png'} 
                    alt="logo_admin"
                    width="160"
                    onClick={ onClickHandler }
                />
            </div>
            
            {/* welcome */}
            <div id={AdminHeaderCss.welcome}>
                <span>{ decoded.id }님 환영합니다</span>
                <div className="profile-container" style={ { width:"5%", marginRight:"auto"}}>
                    {/* <Button 
                    type="button" 
                    icon="pi pi-user" 
                    onClick={(e) => op.current.toggle(e)} 
                    aria-haspopup 
                    aria-controls="overlay_panel" 
                    className="p-button-raised p-button-rounded" 
                    /> */}
                    <Button 
                    icon="pi pi-user" 
                    className="p-button-rounded p-button-outlined" 
                    aria-label="User"
                    aria-haspopup 
                    aria-controls="overlay_panel"
                    onClick={(e) => op.current.toggle(e)} 
                    style={{
                        color: 'white',
                        width: '40px',
                        height: '40px'
                    }}
                    />
                    <OverlayPanel ref={op} id="overlay_panel" style={{width: '150px'}} className="overlaypanel">                            
                        <Button label="Logout" className="p-button-text p-button-plain" icon="pi pi-power-off" onClick={ onClickLogout }/>             
                    </OverlayPanel>          
                </div>

            </div>

           

        </header>
    );
}

export default AdminHeader;