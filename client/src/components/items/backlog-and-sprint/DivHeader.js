import BacklogAndSprintCSS from './BacklogAndSprint.module.css';

function DivHeader() {

    return (
        <div id={ BacklogAndSprintCSS.divHeader }>
            <div>구분</div>
            <div>제목</div>
            <div>진행상태</div>
            <div>긴급도</div>
            <div>생성자</div>
            <div>자세히</div>
        </div>
    );
}

export default DivHeader;