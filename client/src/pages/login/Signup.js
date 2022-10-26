import React, { useRef, useState } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import { useForm, Controller, FieldError } from 'react-hook-form';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Password } from 'primereact/password';
import { Checkbox } from 'primereact/checkbox';
import { Divider } from 'primereact/divider';
import { classNames } from 'primereact/utils';
import { Toast } from 'primereact/toast';
import './Signup.css';


function Signup() {

    const navigate = useNavigate();
    
    const toast = useRef(null);
    const toastBC = useRef(null);
    const [registerClick, setRegisterClick] = useState(false);

    const showError = (msg) => {
        toast.current.show({severity:'error', summary: 'Error Message', detail: msg || '패스워드가 일치하지 않습니다.', life: 3000});
    }

    const clear = () => {
        toast.current.clear();
    }

    const goMain = () => {
        console.log('register finished');      
        navigate('/');
    }

    const showConfirm = () => {
        toastBC.current.show({ severity: 'warn', sticky: true, content: (
            <div className="flex flex-column" style={{flex: '1'}}>
                <div className="text-center">
                    <i className="pi pi-exclamation-triangle" style={{fontSize: '3rem'}}></i>
                    <h4>회원 가입 완료</h4>     
                    <p>이메일 인증을 완료해주시기 바랍니다.</p>               
                </div>
                <div className="grid p-fluid">
                    <div className="col-6">
                        <Button 
                            type="button" 
                            label="Yes" 
                            className="p-button-success" 
                            onClick={  goMain } 
                        />
                    </div>
                </div>
            </div>
        ) });
    }

  

    const [formData, setFormData] = useState({});
    const defaultValues = {
        id : '',
        password : '',
        confirmPassword : '',        
        name : '',
        email : '',
        phone : '',
        company : '',
        occupation : '',
        purpose : ''
    };

    const { control, formState: { errors }, handleSubmit, reset } = useForm({ defaultValues });

    const onSubmitHandler = (data) => {
        
        console.log(data);
        setRegisterClick(true);
        
        if(data.password !== data.confirmPassword) {            
            showError();
            return;
        }

        fetch(`http://${process.env.REACT_APP_RESTAPI_IP}:8888/api/account/register`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*"
            },
            body: JSON.stringify({
                data
            })
        })
        .then(response => response.json())
        .then(json => {
            console.log(json);
            if(json.status == 200){
                showConfirm();               
            }
            else{
                showError(json.message);
                setRegisterClick(false);
            }
        })
        .catch((err) => {
          console.log('login error: ' + err);
        });
        
        // reset();
        // navigate('/');

    };

    const getFormErrorMessage = (name) => {
        return errors[name] && <small className="p-error">{errors[name].message}</small>
    };

    const passwordHeader = <h6>패스워드 생성 규칙</h6>;
    const passwordFooter = (
        <React.Fragment>
            <Divider />
            <p className="mt-2">Suggestions</p>
            <ul className="pl-2 ml-2 mt-0" style={{ lineHeight: '1.5' }}>
                <li>하나 이상의 영어 소문자</li>
                <li>하나 이상의 영어 대문자</li>
                <li>하나 이상의 숫자</li>
                <li>하나 이상의 특수문자</li>
                <li>최소 8자 이상</li>
            </ul>
        </React.Fragment>
    );

    const onClickLoginPage = () => {
        navigate('/') 
    }

    return (
      <div className="formDiv login-center">
            <Toast ref={toast} position="top-center" />
            <Toast ref={toastBC} position="top-center" />

           <div className="flex justify-content-center">
              <div className="card">
                <h5 className="text-center">Register</h5>
                <form onSubmit={handleSubmit(onSubmitHandler)} className="p-fluid">

                <div className="field">
                    <span className="p-float-label">
                        <Controller name="id" control={control} 
                            rules={{ required: 'ID는 필수 값입니다.' }}
                            render={({ field, fieldState }) => (
                                <InputText id={field.name} {...field} autoComplete="off" className={classNames({ 'p-invalid': fieldState.invalid })} />
                        )} />
                        <label htmlFor="id" className={classNames({ 'p-error': errors.id })}>아이디*</label>
                    </span>
                    {getFormErrorMessage('id')}
                </div>

                <div className="field">
                    <span className="p-float-label">
                        <Controller name="password" control={control}
                            rules={{ 
                                required: 'Password는 필수값입니다.'
                                //, pattern: { value: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/ , message: '패스워드 규칙이 올바르지 않습니다.' }
                            }}
                            render={({ field, fieldState }) => (
                            <Password id={field.name} {...field} autoComplete="off" toggleMask className={classNames({ 'p-invalid': fieldState.invalid })} header={passwordHeader} footer={passwordFooter} />
                        )} />
                        <label htmlFor="password" className={classNames({ 'p-error': errors.password })}>비밀번호*</label>
                    </span>
                    {getFormErrorMessage('password')}
                </div>

                <div className="field">
                    <span className="p-float-label">
                        <Controller name="confirmPassword" control={control}  
                            rules={{ required: '비밀번호 확인은 필수입니다.' }}
                            render={({ field, fieldState }) => (
                            <Password id={field.name} {...field} autoComplete="off" toggleMask className={classNames({ 'p-invalid': fieldState.invalid })} />
                        )} />
                        <label htmlFor="confirmPassword" className={classNames({ 'p-error': errors.confirmPassword })}>비밀번호 확인*</label>
                    </span>
                    {getFormErrorMessage('confirmPassword')}
                </div>

                <div className="field">
                    <span className="p-float-label p-input-icon-right">
                        <i className="pi pi-envelope" />
                        <Controller name="email" control={control}
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
                        <label htmlFor="email" className={classNames({ 'p-error': !!errors.email })}>이메일*</label>
                    </span>
                    {getFormErrorMessage('email')}
                </div>

                <div className="field">
                    <span className="p-float-label">
                        <Controller name="name" control={control} rules={{ required: '이름은 필수값입니다.' }} render={({ field, fieldState }) => (
                            <InputText id={field.name} {...field} autoComplete="off" className={classNames({ 'p-invalid': fieldState.invalid })} />
                        )} />
                        <label htmlFor="name" className={classNames({ 'p-error': errors.name })}>이름*</label>
                    </span>
                    {getFormErrorMessage('name')}
                </div>

                <div className="field">
                    <span className="p-float-label">
                        <Controller name="phone" control={control} render={({ field, fieldState }) => (
                            <InputText id={field.name} {...field} autoComplete="off" className={classNames({ 'p-invalid': fieldState.invalid })} />
                        )} />
                        <label htmlFor="phone" className={classNames({ 'p-error': errors.phone })}>핸드폰(선택)</label>
                    </span>
                    {getFormErrorMessage('phone')}
                </div>

                <div className="field">
                    <span className="p-float-label">
                        <Controller name="company" control={control} render={({ field, fieldState }) => (
                            <InputText id={field.name} {...field} autoComplete="off" className={classNames({ 'p-invalid': fieldState.invalid })} />
                        )} />
                        <label htmlFor="company" className={classNames({ 'p-error': errors.company })}>회사명(선택)</label>
                    </span>
                    {getFormErrorMessage('company')}
                </div>

                <div className="field">
                    <span className="p-float-label">
                        <Controller name="occupation" control={control} render={({ field, fieldState }) => (
                            <InputText id={field.name} {...field} autoComplete="off" className={classNames({ 'p-invalid': fieldState.invalid })} />
                        )} />
                        <label htmlFor="occupation" className={classNames({ 'p-error': errors.occupation })}>직업(선택)</label>
                    </span>
                    {getFormErrorMessage('occupation')}
                </div>

                <div className="field">
                    <span className="p-float-label">
                        <Controller name="purpose" control={control} render={({ field, fieldState }) => (
                            <InputText id={field.name} {...field} autoComplete="off" className={classNames({ 'p-invalid': fieldState.invalid })} />
                        )} />
                        <label htmlFor="purpose" className={classNames({ 'p-error': errors.purpose })}>가입목적(선택)</label>
                    </span>
                    {getFormErrorMessage('purpose')}
                </div>


                <div className="field-checkbox">
                    <Controller name="accept" control={control} rules={{ required: true }} render={({ field, fieldState }) => (
                        <Checkbox inputId={field.name} onChange={(e) => field.onChange(e.checked)} checked={field.value} className={classNames({ 'p-invalid': fieldState.invalid })} />
                    )} />
                    <label htmlFor="accept" className={classNames({ 'p-error': errors.accept })}>  약관동의*</label>
                </div>

                    <Button 
                        type="submit" 
                        label="가입" 
                        className="p-button-success p-button-sm" 
                        disabled={registerClick}
                    />
                    <Button 
                        style={{ width: '100%' }} 
                        className="p-button-warning p-button-text" 
                        label="로그인페이지로" 
                        onClick={ onClickLoginPage }
                    />     
                    {/* <NavLink to="/">로그인페이지로</NavLink> */}
                </form>
              </div>
          </div>
      </div>
  );
}

export default Signup;