import { Button } from 'primereact/button';
import { useNavigate } from 'react-router';
import whagile from '../../assets/images/main/hero-1.png';
import logoImg from '../../assets/images/main/logo_main.png';

function Main() {

    const navigate = useNavigate();

    const login = () => {
        navigate('/login');
    }

    return (
        <>
            <div className="grid grid-nogutter surface-0 text-800">
                <div className="col-12 md:col-6 p-6 text-center md:text-left flex align-items-center ">
                    <section>
                        <p className="mt-0 mb-4 text-700 line-height-3">whAGILE을 이용하여<br/>당신의 생산성을 극대화 하세요.</p>
                        <div className="text-6xl text-primary font-bold mb-3">
                            <img src={logoImg} alt="logo" style={{ width: '300px', height: '70px', marginBottom: '20px' }} />
                        </div>

                        <div className="block text-green-400 text-6xl font-bold mb-3">생산성 극대화</div>
                        <p className="mt-0 mb-1 text-700 line-height-3">작업을 간소화 하세요.</p>
                        <p className="mt-0 mb-4 text-700 line-height-3">프로젝트의 모든 작업 및 프로세스, 파일을 한 눈에 확인할 수 있습니다.</p>

                        <div className="block text-yellow-400 text-6xl font-bold mb-3">최적화된 조직</div>
                        <p className="mt-0 mb-1 text-700 line-height-3">전체 조직이 최적화된 상태로 협업을 진행할 수 있습니다. </p>
                        <p className="mt-0 mb-4 text-700 line-height-3">또한, 모든 작업도 명확하게 파악할 수 있습니다.</p>

                        <div className="block text-pink-400 text-6xl font-bold mb-3">추적 기능</div>
                        <p className="mt-0 mb-1 text-700 line-height-3">대시보드를 통해 조직에 대한 전반적인 개요를 얻으실 수 있습니다.</p>
                        <p className="mt-0 mb-4 text-700 line-height-3"> 추가적인 요구사항에 따라 적합한 결정을 내릴 수 있게 도움을 줍니다.</p>

                        <Button 
                            label="시작하기" 
                            type="button" 
                            className="mr-3 p-button-raised" 
                            onClick={ login }
                        />
                    </section>
                </div>
                <div className="col-12 md:col-6 overflow-hidden">
                    <img src={whagile} alt="hero-1" className="md:ml-auto block md:h-full" style={{ clipPath: 'polygon(8% 0, 100% 0%, 100% 100%, 0 100%)' }} />
                </div>
            </div>
        </>
    );
}

export default Main;