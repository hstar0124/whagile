import React, { useState, useRef, useEffect } from 'react'
import { useNavigate, NavLink } from 'react-router-dom';
import { useForm, Controller, FieldError } from 'react-hook-form';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Password } from 'primereact/password';
import { classNames } from 'primereact/utils';
import { Toast } from 'primereact/toast';
import CryptoJS from 'react-native-crypto-js';
import './Login.css';

function Login() {

    // const [id, setId] = useState("");
    // const [password, setPassword] = useState("");
    const [isLogin, setIsLogin] = useState(window.sessionStorage.getItem('isLogin', true) || false);
    const [searchIDForm, setSearchIDForm] = useState(false);
    const [loginform, setLoginform] = useState(true);
    const [searchPwForm, setSearchPwForm] = useState(false);

    const secretKey = process.env.REACT_APP_KEY;

    useEffect(() => {        
            
        if(isLogin) {
            //navigate('/projects');
            console.log('test');
            setIsLogin(true);
            navigate('/projects', { replace: true });
        }
        

    },
    [isLogin]);

    const navigate = useNavigate();
    const defaultValues = {
        memberId : '',
        password : '',
        email: '',
        searchIDEmail: '',
        searchPWMemberId: '',
        searchPWEmail: '',
    };

    const toast = useRef(null);
    const showError = (msg) => {
        toast.current.show({severity:'error', summary: 'Error Message', detail:msg, life: 3000});
    }

    const showSuccess = (msg) => {
        toast.current.show({severity:'success', summary: 'Success Message', detail:msg, life: 3000});
    }

    const clear = () => {
        toast.current.clear();
    }

    const getFormErrorMessage = (name) => {
        return errors[name] && <small className="p-error">{errors[name].message}</small>
    };

    const { control, formState: { errors }, handleSubmit } = useForm({ defaultValues });

    const onClickRegister = () => {
        navigate('/signup') 
    };

    const onClickLogin = () => {
        setLoginform(true);
        setSearchPwForm(false);
        setSearchIDForm(false);
    }

    const onClickSearchID = () => {
        setLoginform(false);
        setSearchPwForm(false);
        setSearchIDForm(true);
    };

    const onClickSearchPW = () => {
        setLoginform(false);
        setSearchPwForm(true);
        setSearchIDForm(false);
    };



    const onSubmitHandler = (data) => {
        
        // 비밀번호 대칭키 암호화
        data.password = CryptoJS.AES.encrypt(data.password , secretKey).toString();
        console.log(data);
        fetch(`http://${process.env.REACT_APP_RESTAPI_IP}:8888/api/account/login`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*"
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(json => {

            console.log('Login', json);
            if(json.status == 200){                
                window.sessionStorage.setItem('isLogin', true);
                setIsLogin(true);
                
                window.localStorage.setItem('access_token', json.accessToken);
                window.localStorage.getItem('access_token') !== 'undefined' 
                ? ((json.result[0].role == 'ROLE_ADMIN')? navigate('/admin/dashboard', { replace: true }) : navigate('/projects', { replace: true }))
                : showError('로그인에 실패하였습니다.');
            } else {
                showError('로그인에 실패하였습니다.');
            }            

            // ? ((data.memberId === 'admin')? navigate('/admin') : navigate('/main'))
            // : console.log('login Failed');         

        })
        .catch((err) => {
          console.log('login error: ' + err);
          showError('로그인에 실패하였습니다.');
        });
    };

    const onSearchIDHandler = (data) => {
        console.log(data);
        
        fetch(`http://${process.env.REACT_APP_RESTAPI_IP}:8888/api/account/search?email=${data.searchIDEmail}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*"
            }
        })
        .then(response => response.json())
        .then(json => {

            console.log(json);
            if(json.status == 200){
                showSuccess('이메일에서 아이디를 확인해주세요.');
                onClickLogin();
            } else {
                showError('ID 찾기 기능이 실패하였습니다.');
            }            

            // ? ((data.memberId === 'admin')? navigate('/admin') : navigate('/main'))
            // : console.log('login Failed');         

        })
        .catch((err) => {
          console.log('login error: ' + err);
          showError('ID 찾기 기능이 실패하였습니다.');
        });


    }



    const onSearchPWHandler = (data) => {
        console.log(data);

        fetch(`http://${process.env.REACT_APP_RESTAPI_IP}:8888/api/account/temppwd?id=${data.searchPWMemberId}&email=${data.searchPWEmail}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*"
            }
        })
        .then(response => response.json())
        .then(json => {

            console.log(json);
            if(json.status == 200){
                showSuccess('이메일에서 임시비밀번호를 확인해주세요.');
                onClickLogin();
            } else {
                showError('비밀번호 찾기 기능이 실패하였습니다.');
            }                   

        })
        .catch((err) => {
          console.log('login error: ' + err);
          showError('비밀번호 찾기 기능이 실패하였습니다.');
        });

    }


    return (
        <div className="flex justify-content-center login-center">
            <Toast ref={toast} position="top-center" />
            { loginform && 
                <div className='formDiv'>
                    <div className='card'>
                        <h5 className="text-center">로그인</h5>
                        <form 
                            style={{display: 'flex', flexDirection: 'column' }}
                            onSubmit={handleSubmit(onSubmitHandler)}
                            className="p-fluid"
                        >
                            <div className="field">
                                <span className="p-float-label">
                                    <Controller 
                                        name="memberId" 
                                        control={control} 
                                        rules={{ required: '아이디는 필수값입니다.' }} 
                                        render={({ field, fieldState }) => (
                                            <InputText 
                                                id={field.name} 
                                                {...field}
                                                autoComplete="off" 
                                                autoFocus 
                                                className={classNames({ 'p-invalid': fieldState.invalid })} 
                                            />
                                    )} />
                                    <label htmlFor="memberId" className={classNames({ 'p-error': errors.memberId })}>ID*</label>
                                </span>
                                {getFormErrorMessage('memberId')}
                            </div>

                            <div className="field">
                                <span className="p-float-label">
                                    <Controller 
                                        name="password" 
                                        control={control} 
                                        rules={{ required: '비밀번호는 필수값입니다.' }} 
                                        render={({ field, fieldState }) => (
                                            <Password 
                                                id={field.name} 
                                                {...field} 
                                                toggleMask 
                                                autoComplete="off"
                                                className={classNames({ 'p-invalid': fieldState.invalid })} 
                                            />
                                    )} />
                                    <label htmlFor="password" className={classNames({ 'p-error': errors.password })}>Password*</label>
                                </span>
                                {getFormErrorMessage('password')}
                            </div>

                            <Button 
                                type="submit"
                                label="로그인"  
                                className="p-button-success p-button-sm" 
                            />
                        </form>
                        <Button 
                            style={{ width: '34%' }} 
                            className="p-button-warning p-button-text" 
                            label="아이디찾기" 
                            onClick={ onClickSearchID }
                        />            
                        <Button 
                            style={{ width: '38%' }} 
                            className="p-button-warning p-button-text" 
                            label="비밀번호찾기" 
                            onClick={ onClickSearchPW }
                        />
                        <Button 
                            style={{ width: '28%' }} 
                            className="p-button-warning p-button-text" 
                            label="회원가입" 
                            onClick={ onClickRegister}
                        />            
                        {/* <NavLink to="/signup">회원가입</NavLink> */}
                    </div>
                </div>
            }





            { searchIDForm && 
                <div className='formDiv'>
                    <div className='card'>
                        <h5 className="text-center">아이디 찾기</h5>
                        <form 
                            style={{display: 'flex', flexDirection: 'column' }}
                            onSubmit={handleSubmit(onSearchIDHandler)}
                            className="p-fluid"
                        >

                        <div className="field">
                            <span className="p-float-label p-input-icon-right">
                                <i className="pi pi-envelope" />
                                <Controller name="searchIDEmail" control={control}
                                    rules={{ required: 'Email은 필수값입니다.', 
                                            pattern: 
                                            { 
                                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i, 
                                                message: '이메일 주소가 올바르지 않습니다. E.g. example@email.com' 
                                            }
                                        }}
                                    render={({ field, fieldState }) => (
                                        <InputText id={field.name} {...field} autoComplete="off" className={classNames({ 'p-invalid': fieldState.invalid })} />
                                )} />
                                <label htmlFor="searchIDEmail" className={classNames({ 'p-error': !!errors.searchIDEmail })}>이메일*</label>
                            </span>
                            {getFormErrorMessage('searchIDEmail')}
                        </div>

                        <Button 
                            type="submit"
                            label="이메일로 아이디 받기"  
                            className="p-button-success p-button-sm"  
                        />
                        </form>
                        <Button 
                            style={{ width: '100%' }} 
                            className="p-button-warning p-button-text" 
                            label="로그인 페이지로" 
                            onClick={ onClickLogin }
                        />            
                    </div>
                </div>
            }





            { searchPwForm && 
                <div className='formDiv'>
                    <div className='card'>
                        <h5 className="text-center">비밀번호 찾기</h5>
                        <form 
                            style={{display: 'flex', flexDirection: 'column' }}
                            onSubmit={handleSubmit(onSearchPWHandler)}
                            className="p-fluid"
                        >

                        <div className="field">
                            <span className="p-float-label">
                                <Controller 
                                    name="searchPWMemberId" 
                                    control={control} 
                                    rules={{ required: '아이디는 필수값입니다.' }} 
                                    render={({ field, fieldState }) => (
                                        <InputText 
                                            id={field.name} 
                                            {...field}
                                            autoComplete="off"                                          
                                            className={classNames({ 'p-invalid': fieldState.invalid })} 
                                        />
                                )} />
                                <label htmlFor="searchPWMemberId" className={classNames({ 'p-error': errors.searchPWMemberId })}>ID*</label>
                            </span>
                            {getFormErrorMessage('searchPWMemberId')}
                        </div>

                        <div className="field">
                            <span className="p-float-label p-input-icon-right">
                                <i className="pi pi-envelope" />
                                <Controller name="searchPWEmail" control={control}
                                    rules={{ required: 'Email 필수값입니다.', 
                                            pattern: 
                                            { 
                                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i, 
                                                message: '이메일 주소가 올바르지 않습니다. E.g. example@email.com' 
                                            }
                                        }}
                                    render={({ field, fieldState }) => (
                                        <InputText 
                                            id={field.name} {...field} 
                                            autoComplete="off" 
                                            className={classNames({ 'p-invalid': fieldState.invalid })} />
                                )} />
                                <label htmlFor="emasearchPWEmailil" className={classNames({ 'p-error': !!errors.searchPWEmail })}>이메일*</label>
                            </span>
                            {getFormErrorMessage('searchPWEmail')}
                        </div>

                        <Button 
                            label="이메일로 임시비밀번호 받기"  
                            className="p-button-success p-button-sm"  
                            // onClick={ onClickTempPwd }
                            type="submit"
                        />
                        </form>
                        <Button 
                            style={{ width: '100%' }} 
                            className="p-button-warning p-button-text" 
                            label="로그인 페이지로" 
                            onClick={ onClickLogin }
                        />            
                    </div>
                </div>
            }            
        </div>
    );
}

export default Login;