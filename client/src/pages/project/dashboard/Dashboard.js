import PageTitle from '../../../components/items/PageTitle';
import '/node_modules/primeflex/primeflex.scss';
import React, { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import DashboardCSS from './Dashboard.module.css';
import { callGetProjectStatisticsAPI } from '../../../apis/ProjectStatisticsAPICalls';
import { callGetNoticeAPI, callGetProjectMemberAPI, callPutModifyNoticeAPI } from '../../../apis/ProjectAPICalls';
import { decodeJwt } from '../../../utils/tokenUtils';
import { Chart } from 'primereact/chart';
import { Editor } from 'primereact/editor';
import { Button } from 'primereact/button';

function Dashboard() {

    const dispatch = useDispatch();
    const {  completedTaskCntToProject, pendingTaskCntToProject, progressingTaskCntToProject, totalTaskCntToProject } = useSelector(state => state.projectStatisticsReducer);
    const notice = useSelector(state => state.ProjectNoticeReducer);
    const members = useSelector(state => state.projectMemberReducer);
    console.log('members', members);
    const [ state, setState ] = useState({});
    const { projectCode } = useParams();
    const [ taskInfo, setTaskInfo ] = useState(false);
    const [text, setText] = useState('');
    const [isNotice, setIsNotice] = useState(true);
    const [noticeComponent, SetNoticeComponent] = useState(notice.content);
    const decoded = decodeJwt(window.localStorage.getItem("access_token"));
    // console.log('통계', taskCounts);
    console.log('공지', notice);
    console.log('멤버목록', members);
    console.log('멤버권한 : ', decoded.role);

    useEffect(
        () =>
        {
            // dispatch(callGetProjectStatisticsAPI({
            //     'projectCode': projectCode
            // }));

            dispatch(callGetNoticeAPI({
                'projectCode': projectCode
            }));

            dispatch(callGetProjectMemberAPI({
                'projectCode': projectCode
            }));
        },
        []
      );


      useEffect(
        () =>
        {
            dispatch(callGetProjectStatisticsAPI({
                'projectCode': projectCode
            }));

            setChartData({...chartData, datasets: [
                {
                    data: [pendingTaskCntToProject, progressingTaskCntToProject, completedTaskCntToProject],
                    
                    backgroundColor: [
                        "#FF6384",
                        "#36A2EB",
                        "#FFCE56"
                      ],
                      hoverBackgroundColor: [
                          "#FF6384",
                          "#36A2EB",
                          "#FFCE56"
                      ]}]});

                setTaskInfo(true);
                setText(`<div>${ notice.content }</div>`);
                SetNoticeComponent(<div><p>{ notice.content }</p></div>)
                // document.getElementById("notice");
                
        },
        [completedTaskCntToProject]
      );

      console.log('completedTaskCntToProject', completedTaskCntToProject);
      
      const [chartData, setChartData] = useState({
          labels: ['진행 전', '진행 중', '완료'],
          datasets: [
              {
                  data: [pendingTaskCntToProject, progressingTaskCntToProject, completedTaskCntToProject],
                  
                  backgroundColor: [
                      "#FF6384",
                      "#36A2EB",
                      "#FFCE56"
                    ],
                    hoverBackgroundColor: [
                        "#FF6384",
                        "#36A2EB",
                        "#FFCE56"
                    ]
                }]
            });

        const [lightOptions] = useState({
            plugins: {
                legend: {
                    labels: {
                        color: 'white',
                        font: { size: 15}
                    }
                },
                title: {
                    display: true,
                    text: '프로젝트 내 상태 별 일감 개수',
                    color: 'white',
                    position: 'bottom',
                    padding: {
                        top: 30,
                        bottom: 30
                    },
                    font: {
                        weight: 'bold',
                        style: 'normal',
                        size: 20
                    }
                }
            }
        });

        const renderHeader = () => {
            return (
                <span className="ql-formats">
                    <button className="ql-bold" aria-label="Bold"></button>
                    <button className="ql-italic" aria-label="Italic"></button>
                    <button className="ql-underline" aria-label="Underline"></button>
                </span>
            );
        }

        const header = renderHeader();

        const editNotice = () => {
            
            setIsNotice(false);
            // return (<Editor style={{ height: '100px' }} value={ text } onTextChange={(e) => setText(e.htmlValue)} />);
        }

        const offNotice = () => {
            
            setIsNotice(true);

            dispatch(callPutModifyNoticeAPI({
                'projectCode' : projectCode,
                'noticeCode' : notice.noticeCode,
                'content' : text,
                'modifier' : (decoded !== 'undefined')? decoded.code: ''
            }))

        }

    return (
        <>
            <PageTitle
                icon={ <i className="pi pi-fw pi-chart-pie"></i> }
                text="대시보드"
            />
            <div className="flex flex-wrap card-container blue-container" style={{minWidth: 100 + '%'}}>
                <div style={{minWidth: 70 + '%', minHeight: 100 + 'px'}}>
                    <div className="flex align-items-center justify-content-center bg-black-alpha-10 font-bold text-white m-2 border-round">
                        {/* <label style={{  }}>업무리포트</label> */}
                        { (taskInfo) && <Chart type="doughnut" data={chartData} options={lightOptions} />}    
                    </div>
                    <div style={{minWidth: 70 + '%', minHeight: 25 + '%', maxHeight: 100 + '%'}} className="flex align-items-center justify-content-center bg-black-alpha-10 font-bold text-white m-2 border-round">
                        <label style={{ position: 'relative', width: '10%', height: '20%' }}>공지사항</label>
                        { (isNotice) && <div style={{ width: '150%', height: '10%', fontWeight: 'lighter' }} dangerouslySetInnerHTML={ {__html: notice.content } } onClick={ editNotice }></div>}
                        { (!isNotice) && <Editor style={{ width: '100%', height: '100px' }} value={ text } onTextChange={(e) => setText(e.htmlValue)}  />}
                        { (!isNotice) && <Button onClick={ offNotice }>제출</Button>}
                    </div>
                </div>
                <div className="flex align-items-center justify-content-center bg-black-alpha-10 text-lg text-white m-2 border-round" style={{minWidth: 20 + '%', minHeight: 20 + '%'}}>
                    <ul className="text-2xl m-3" style={{ listStyle: "none" }}>팀원목록 { members.map(member => <li className="text-lg m-2" key={ member.memberCode }><i className="pi pi-fw pi-user"></i> { member.memberName } : { member.authorityName }</li>)}</ul>
                </div>
                {/* <div className="flex align-items-center justify-content-center bg-blue-500 font-bold text-white m-2 border-round" style={{minWidth: 200 + 'px', minHeight: 100 + 'px'}}>
                    팀원목록
                </div>
                <div className="flex align-items-center justify-content-center bg-blue-500 font-bold text-white m-2 border-round" style={{minWidth: 200 + 'px', minHeight: 100 + 'px'}}>
                    업무목록
                </div> */}
            </div>
        </>
    );
}

export default Dashboard;