import MainNavbarCSS from "./MainNavbar.module.css";
import { callGetProjectAPI, callGetProjectMemberInfoAPI } from "../../apis/ProjectAPICalls";
import { decodeJwt } from '../../utils/tokenUtils';

import { TieredMenu } from 'primereact/tieredmenu';
import { Button } from "primereact/button";
import Icon from "@mdi/react";
import { PrimeIcons } from 'primereact/api';
import { mdiMonitorDashboard } from "@mdi/js";

import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from "react-router-dom"; /* 페이지 강제 이동 */

function MainNavbar({projectCode}) {
  
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const project = useSelector(state => state.projectsReducer);
  const projectMember12 = useSelector(state => state.projectMembersReducer);
  console.log('projectMember12',projectMember12);
  const [selectedMenu, setSelectedMenu] = useState();
  const [isManagement, setIsmanageMent] = useState(false);
  const decoded = decodeJwt(window.localStorage.getItem("access_token"));
  const menus = [
    'dashboard',
    'backlog-and-sprint',
    'gantt',
    'kanban-board',
    'history',
    'management'
  ];

  const style1 = () => {

    if(selectedMenu ==='management') {
      setIsmanageMent(true);
    }
  }

  const style2 = {
    backgroundColor: '#00AA9C',
    color: '#FFFFFF'
  }

  const number = parseInt(`${projectCode}`);
  
   let items = [
    {
      label: "대시보드",
      icon: "pi pi-fw pi-chart-pie",
      style: { backgroundColor: (selectedMenu ==='dashboard')? 'rgba(0, 170, 156, .16)': '' },
      command: () => {
        navigate(`/project/${ projectCode }/dashboard`);
      },
    },
    {
      label: "백로그 및 스프린트",
      icon: "pi pi-fw pi-inbox",
      style: { backgroundColor: (selectedMenu ==='backlog-and-sprint')? 'rgba(0, 170, 156, .16)': '' },
      command: () => {
        navigate(`/project/${ projectCode }/backlog-and-sprint`);
      },
    },
    {
      label: "간트차트",
      icon: "pi pi-fw pi-chart-bar",
      style: { backgroundColor: (selectedMenu ==='gantt')? 'rgba(0, 170, 156, .16)': '' },
      command: () => {
        navigate(`/project/${ projectCode }/gantt`);
      },
    },
    {
      label: "칸반보드",
      icon: "pi pi-fw pi-th-large",
      style: { backgroundColor: (selectedMenu ==='kanban-board')? 'rgba(0, 170, 156, .16)': '' },
      command: () => {
        navigate(`/project/${ projectCode }/kanban-board`);
      },
    },
    {
      label: "히스토리",
      icon: "pi pi-fw pi-history",
      style: { backgroundColor: (selectedMenu ==='history')? 'rgba(0, 170, 156, .16)': '' },
      command: () => {
        navigate(`/project/${ projectCode }/history`);
      },
    },
    (projectMember12.authorityCode === 1) && {
      label: "프로젝트 관리",
      items: [{label: '프로젝트 세부사항', icon: 'pi pi-fw pi-pencil', command:()=>{ navigate(`/project/${ projectCode }/management/information`); }},
              {label: '팀원 목록', icon: 'pi pi-fw pi-users', command:()=>{ navigate(`/project/${ projectCode }/management/teamMateList`); }},
              {label: '프로젝트 통계', icon: 'pi pi-fw pi-chart-pie', command:()=>{ navigate(`/project/${ projectCode }/management/statistics`); }}],
      icon: "pi pi-fw pi-cog",
      style: { backgroundColor: (selectedMenu ==='management')? 'rgba(0, 170, 156, .16)' : '', color: (selectedMenu ==='management')? '#FFFFFF' : ''}
    }
  ];


  useEffect(
    () => {
         dispatch(callGetProjectAPI({
            'projectCode': number
        }));
        dispatch(callGetProjectMemberInfoAPI({
          'projectCode': number,
          'memberCode' : (decoded !== 'undefined')? decoded.code: '',
        }))
    },
    []
  );

  useEffect(
    () => {
        const url = window.location.pathname;
        const path = url.substring(9);
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

  return (
    <nav id={ MainNavbarCSS.navbar }>
      <div className={ MainNavbarCSS.projectName }>
        <Icon
          path={mdiMonitorDashboard}
          title="User Profile"
          size={0.8}
          color="#9B9EA3"
        />
        <span style={{ marginLeft: "8px" }}>{ (project.length !== 0)? project[0].projectName: '' }</span>
      </div>
      <div>
        <TieredMenu model={ items } />
      </div>
      <div>
        <Button
          id={MainNavbarCSS.projectListBtn}
          label="프로젝트 목록"
          className="p-button-raised"
          onClick={() => navigate("/projects")}
        />
      </div>
    </nav>
  );
}

export default MainNavbar;
