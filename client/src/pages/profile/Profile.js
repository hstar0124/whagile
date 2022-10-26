import { useState, useEffect, useRef } from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import ProfileCSS from './Profile.module.css';
import { decodeJwt } from '../../utils/tokenUtils';
import { Toast } from 'primereact/toast';
import { Password } from 'primereact/password';
import { useNavigate, NavLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import CryptoJS from 'react-native-crypto-js';
import MainHeader from '../../components/commons/MainHeader';

import { 
    callGetMemberAPI
} from '../../apis/MemberAPICalls';

function Profile() {

    const [userID, setUserID] = useState('');
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [phone, setPhone] = useState('');
    const [company, setCompany] = useState('');
    const [purpose, setPurpose] = useState('');

    const [originPassword, setOriginPassword] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [modifyEmail, setModifyEmail] = useState('');
    const [emailAuthCode, setEmailAuthCode] = useState('');
    const [authCode, setAuthCode] = useState('');
    const [authBtn, setAuthBtn] = useState('');

    const [profileform, setProfileform] = useState(true);
    const [passwordform, setPasswordform] = useState(false);
    const [emailform, setEmailform] = useState(false);

    const [memberInfoClick, setMemberInfoClick] = useState(false);
    const [passwordFormClick, setPasswordFormClick] = useState(false);
    const [emailFormClick, setEmailFormClick] = useState(false);

    const secretKey = process.env.REACT_APP_KEY;

    const member = useSelector(state => state.memberReducer);
    const dispatch = useDispatch();


    const navigate = useNavigate();

    const toast = useRef(null);
    const toastBC = useRef(null);

    const decoded = decodeJwt(window.localStorage.getItem("access_token"));

    const [snapshot, setSnapshot] = useState({});

    useEffect(() => {
        
        console.log("Profile useEffect");
        //dispatch(callGetMemberAPI(decoded));
        
        console.log('member', member);
        console.log(decoded);
        fetch(`http://${process.env.REACT_APP_RESTAPI_IP}:8888/api/account/member?code=${decoded.code}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*",
              "Access_token": window.localStorage.getItem("access_token")
            }
        })
        .then(response => response.json())
        .then(json => {
            console.log(json);
            const result = json.results[0];            
            setUserID(result.memberId || '');
            setEmail(result.email  || '');
            setUsername(result.name  || '') ;
            setPhone(result.phone  || '');
            setCompany(result.company  || '');
            setPurpose(result.purpose  || '');
            setSnapshot({
                memberId: result.memberId,
                email: result.email,
                name: result.name,
                phone: result.phone,
                company: result.company,
                purpose: result.purpose
            });
        })
        .catch((err) => {
            showError('내 정보 불러오기를 실패하였습니다.');
        });
    },
    []);



    const showError = (msg) => {
        toast.current.show({severity:'error', summary: 'Error Message', detail:msg, life: 3000});
    }

    const showSuccess = (msg) => {
        toast.current.show({severity:'success', summary: 'Success Message', detail:msg, life: 3000});
    }


    const showConfirm = () => {
        toastBC.current.show({ severity: 'warn', sticky: true, content: (
            <div className="flex flex-column" style={{flex: '1'}}>
                <div className="text-center">
                    <i className="pi pi-exclamation-triangle" style={{fontSize: '3rem'}}></i>
                    <h4>정보 변경 완료</h4>     
                    <p>다시 로그인 해주시기 바랍니다.</p>               
                </div>
                <div className="grid p-fluid">
                    <div className="col-6">
                        <Button 
                            type="button" 
                            label="Yes" 
                            className="p-button-success" 
                            onClick={ goMain } 
                        />
                    </div>
                </div>
            </div>
        ) });
    }

    const goMain = () => {
        console.log('logout process finished');
        sessionStorage.clear();
        navigate('/' , { replace: true });
    }

    const init = () => {
        setOriginPassword('');
        setPassword('');
        setConfirmPassword('');
        setModifyEmail('');
        setEmailAuthCode('');
        setAuthCode('');
        setAuthBtn('');
    }

    const onClickMypage = () => {
        setProfileform(true);
        setPasswordform(false);
        setEmailform(false);
        init();
    }

    const onClickModifyEmail = () => {
        setProfileform(false);
        setPasswordform(false);
        setEmailform(true);        
        init();
    }

    const onClickModifyPW = () => {
        setProfileform(false);
        setPasswordform(true);
        setEmailform(false);
        init();
    }

    const header = (
        <div id={ProfileCSS.logoContainer}>
            <img            
                alt="Card" 
                src={`${process.env.PUBLIC_URL}/logo_user.png`}
                id={ProfileCSS.logo}
            />
        </div>
    );

    
    const onClickModifyPasswordSubmit = () => {
        console.log('onClickModifyPasswordSubmit');

        
        if(originPassword == '' || password == '' || passwordform == '') {
            console.log('password required');
            showError('필수값을 입력하셔야 합니다.');
            return;
        }
        
        if(password !== confirmPassword){
            console.log('password not equal');
            showError('비밀번호가 일치하지 않습니다');
            return;
        }
        
        setPasswordFormClick(true);
        console.log('pass');
        const originPasswordEncrypted = CryptoJS.AES.encrypt(originPassword , secretKey).toString();
        const passwordEncrypted = CryptoJS.AES.encrypt(password , secretKey).toString();

        console.log('origin', originPasswordEncrypted);
        console.log('password', passwordEncrypted);

        const pwdUpdateData = {
            memberCode: decoded.code,
            originPassword: originPasswordEncrypted,
            password: passwordEncrypted
        };

        console.log(pwdUpdateData);
        fetch(`http://${process.env.REACT_APP_RESTAPI_IP}:8888/api/account/updatepwd`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*",
              "Access_token": window.localStorage.getItem("access_token")
            },
            body: JSON.stringify({
                pwdUpdateData
            })
        })
        .then(response => response.json())
        .then(json => {
            showConfirm();
            //console.log(json);           
            // showSuccess("비밀번호 변경에 성공하였습니다. 다시 로그인 해주세요.");
            // console.log('logout process finished');
            // sessionStorage.clear();
            // setIsLogin(false);           
            // navigate('/');
           
        })
        .catch((err) => {
            showError('비밀번호 변경에 실패하였습니다.');
            setPasswordFormClick(false);
        });
    };


    const onClickModifyEmailSubmit = () => {
        console.log('onClickModifyEmailSubmit');


        if(emailAuthCode == ''){
            showError('인증번호를 입력해주세요');
            return;
        }
        if(emailAuthCode !== authCode){
            showError('인증번호가 일치하지 않습니다.');
            return;
        }

        const emailInfo = {
            memberCode: decoded.code,
            email: modifyEmail
        }
        setEmailFormClick(true);
      
        fetch(`http://${process.env.REACT_APP_RESTAPI_IP}:8888/api/account/email`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*",
              "Access_token": window.localStorage.getItem("access_token")
            },
            body: JSON.stringify({
                emailInfo
            })

        })
        .then(response => response.json())
        .then(json => {
            console.log(json);
            if(json.status == 200){
                showConfirm();

                // showSuccess('이메일 변경에 성공하였습니다. 다시 로그인 해주세요.');
                // console.log('logout process finished');
                // sessionStorage.clear();
                // setIsLogin(false);               
                // navigate('/');
    
            }
        })
        .catch((err) => {
            showError('이메일 변경에 실패하였습니다.');
            setEmailFormClick(false);
        });

    };

    
    const onClickMemberInfo = () => {
        console.log('정보 변경 눌림');
        console.log(snapshot);

        const memberInfo = {
            memberCode: decoded.code,
            phone: phone,
            company: company,
            purpose: purpose
        };

        if(snapshot.phone === phone && snapshot.company === company && snapshot.purpose === purpose) {
            showError('변경된 값이 없습니다.');
            return;
        }

        setMemberInfoClick(true);

        fetch(`http://${process.env.REACT_APP_RESTAPI_IP}:8888/api/account/member`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*",
              "Access_token": window.localStorage.getItem("access_token")
            },
            body: JSON.stringify({
                memberInfo
            })

        })
        .then(json => {
            console.log(json);           
            //showSuccess("정보 변경에 성공하였습니다. 다시 로그인 해주세요.");
            showConfirm();
            // console.log('logout process finished');
            // sessionStorage.clear();
            // setIsLogin(false);
           
            // navigate('/');
           
        })
        .catch((err) => {
            showError('정보 변경에 실패하였습니다.');
            setMemberInfoClick(false);
        });



    }


    const emailRegex =
      /^(([^<>()\[\].,;:\s@"]+(\.[^<>()\[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i;

    

    const onClickAuthNumber = () => {
        console.log('onClickAuthNumber');

        if(modifyEmail == '') {
            showError('필수값을 입력해주세요.');
            return;
        }

        if(!emailRegex.test(modifyEmail)){
            showError('이메일 주소가 유효하지 않습니다.');
            return;
        }

        const random = Math.random().toString(36).substring(2, 11);
        console.log('random', random);
        setAuthCode(random);
        setAuthBtn(true);


        const authNumberData = {
            memberCode: decoded.code,
            authCode: random,
            email: modifyEmail
        };


        fetch(`http://${process.env.REACT_APP_RESTAPI_IP}:8888/api/account/authsend`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*",
              "Access_token": window.localStorage.getItem("access_token")
            },
            body: JSON.stringify({
                authNumberData
            })

        })
        .then(response => response.json())
        .then(json => {
            console.log(json);
            if(json.status == 200){
                showSuccess('인증번호 발급이 완료되었습니다. 이메일을 확인해주세요.');
            }
        })
        .catch((err) => {
            showError('인증 번호 발급이 실패하였습니다.');
        });
    }
    

    const footer = (
        <div>
            <div className={ ProfileCSS.cardFooter }>
                <Button 
                    style={{ width: '40%' }} 
                    className="p-button-warning p-button-text" 
                    label="비밀번호변경" 
                    onClick={ onClickModifyPW }
                />
                <Button 
                    style={{ width: '40%' }} 
                    className="p-button-warning p-button-text" 
                    label="이메일변경" 
                    onClick={ onClickModifyEmail } 
                />
            </div>
            <div className={ ProfileCSS.cardFooter }>
                <Button 
                    style={{ width: '90%' }} 
                    label="저장하기" 
                    onClick={ onClickMemberInfo }
                    disabled={ memberInfoClick }
                />
            </div>
        </div>
    );

    const modifyFooter = (
        <div>
            <div className={ ProfileCSS.cardFooter }>
                <Button 
                    style={{ width: '90%' }} 
                    className="p-button-warning p-button-text" 
                    label="마이페이지로" 
                    onClick={ onClickMypage }
                />
            </div>
            <div className={ ProfileCSS.cardFooter }>
                <Button 
                    style={{ width: '90%' }} 
                    label="저장하기" 
                    onClick={ passwordform ? onClickModifyPasswordSubmit : onClickModifyEmailSubmit }
                    disabled={ passwordform ? passwordFormClick : emailFormClick}
                />
            </div>
        </div>
    );







    return (
        <>
        <MainHeader/>
        
            <div className={ ProfileCSS.profileContainer }>
                <Toast ref={toast} position="top-center" />
                <Toast ref={toastBC} position="top-center" />
                {profileform &&
                <Card style={{ width: '30em' }} footer={footer} header={header}>         
                    <span className="p-float-label p-inputtext-sm memberInfo" style={{ margin: '1.4em' }}>
                        <InputText 
                            id="userID" 
                            style={{ width: '100%' }} 
                            value={userID} 
                            onChange={(e) => setUserID(e.target.value)} 
                            readOnly
                        />
                        <label htmlFor="userID">ID</label>
                    </span>

                    <span className="p-float-label p-inputtext-sm memberInfo" style={{ margin: '1.4em' }}>
                        <InputText 
                            id="username" 
                            style={{ width: '100%' }} 
                            value={username} 
                            onChange={(e) => setUsername(e.target.value)} 
                            readOnly
                        />
                        <label htmlFor="username">username</label>
                    </span>

                    <span className="p-float-label p-inputtext-sm memberInfo" style={{ margin: '1.4em' }}>
                        <InputText 
                            id="phone" 
                            style={{ width: '100%' }} 
                            value={phone} 
                            onChange={(e) => setPhone(e.target.value)}                         
                        />
                        <label htmlFor="phone">phone</label>
                    </span>

                    <span className="p-float-label p-inputtext-sm memberInfo" style={{ margin: '1.4em' }}>
                        <InputText 
                            id="email" 
                            style={{ width: '100%' }} 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)}  
                            readOnly                       
                        />
                        <label htmlFor="email">email</label>
                    </span>

                    <span className="p-float-label p-inputtext-sm memberInfo" style={{ margin: '1.4em' }}>
                        <InputText id="company" style={{ width: '100%' }} value={company} onChange={(e) => setCompany(e.target.value)} />
                        <label htmlFor="company">company</label>
                    </span>

                    <span className="p-float-label p-inputtext-sm memberInfo" style={{ margin: '1.4em' }}>
                        <InputText id="purpose" style={{ width: '100%' }} value={purpose} onChange={(e) => setPurpose(e.target.value)} />
                        <label htmlFor="purpose">purpose</label>
                    </span>

                </Card>
                }


                
                {passwordform &&
                <Card style={{ width: '30em' }} footer={modifyFooter} header={header}>         

                    <span className="p-float-label p-inputtext-sm memberInfo" style={{ margin: '1.4em' }}>
                        <Password id={ProfileCSS.password} value={originPassword} autoComplete="off"  onChange={(e) => setOriginPassword(e.target.value)} />
                        <label htmlFor="originPassword">원래 비밀번호</label>
                    </span>

                    <span className="p-float-label p-inputtext-sm memberInfo" style={{ margin: '1.4em' }}>
                        <Password id={ProfileCSS.password} value={password} autoComplete="off"  onChange={(e) => setPassword(e.target.value)} />
                        <label htmlFor="password">바꿀 비밀번호</label>
                    </span>

                    <span className="p-float-label p-inputtext-sm memberInfo" style={{ margin: '1.4em' }}>
                        <Password id={ProfileCSS.confirmPassword}  value={confirmPassword} autoComplete="off"  onChange={(e) => setConfirmPassword(e.target.value)} />
                        <label htmlFor="confirmPassword">바꿀 비밀번호 확인</label>
                    </span>            

                </Card>
                }

                {emailform &&
                <Card style={{ width: '30em' }} footer={modifyFooter} header={header}>         


                    <span className="p-float-label p-inputtext-sm memberInfo" style={{ margin: '1.4em' }}>
                        <InputText 
                            id="modifyEmail" 
                            style={{ width: '100%' }} 
                            value={modifyEmail} 
                            onChange={(e) => setModifyEmail(e.target.value)}    
                            disabled={ authBtn }                      
                        />
                        <label htmlFor="modifyEmail">바꿀 이메일 주소</label>
                    </span>

                    <span className="p-float-label p-inputtext-sm memberInfo" style={{ margin: '1.4em' }}>
                        <InputText 
                            id="emailAuthCode" 
                            style={{ width: '60%' }} 
                            value={emailAuthCode} 
                            onChange={(e) => setEmailAuthCode(e.target.value)}                         
                        />
                        <label htmlFor="emailAuthCode">인증번호</label>
                        <Button 
                            id="authNumberBtn"
                            style={{ width: '35%', marginLeft: '10px' }} 
                            className="p-button-sm p-button-success p-button-rounded" 
                            label="인증번호 발급" 
                            onClick={ onClickAuthNumber }
                            disabled={ authBtn } 
                        />
                    </span>



                </Card>
                }




            </div>
        </>


    );
}

export default Profile;
