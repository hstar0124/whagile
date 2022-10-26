import BacklogAndSprintCSS from '../../../components/items/backlog-and-sprint/BacklogAndSprint.module.css';
import PageTitle from '../../../components/items/PageTitle';
import Backlogs from '../../../components/items/backlog-and-sprint/Backlogs';
import Sprints from '../../../components/items/backlog-and-sprint/Sprints';

function BacklogAndSprint() {

    return (
        <>
            <PageTitle
                icon={ <i className="pi pi-fw pi-inbox"></i> }
                text="백로그 및 스프린트"
            />
            <div className={ BacklogAndSprintCSS.pageDivision }>
                <Backlogs/>
            </div>
            <div className={ BacklogAndSprintCSS.pageDivision }>
                <Sprints/>
            </div>
        </>
    );
}

export default BacklogAndSprint;