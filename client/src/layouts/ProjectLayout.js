import { Outlet, useParams } from 'react-router-dom';
import MainHeader from '../components/commons/MainHeader';
import MainNavbar from '../components/commons/MainNavbar';
import ProjectLayoutCSS from './ProjectLayout.module.css';

function ProjectLayout() {

    const { projectCode } = useParams();

    return (
        <div>
            <MainHeader/>
            <div className={ ProjectLayoutCSS.layout }>
                <MainNavbar projectCode={ projectCode }/>
                <main className={ ProjectLayoutCSS.main }>
                    <Outlet/>
                </main>
            </div>
        </div>
    );
}

export default ProjectLayout;