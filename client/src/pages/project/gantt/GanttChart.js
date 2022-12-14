// common, css
import PageTitle from '../../../components/items/PageTitle';
import 'gantt-task-react/dist/index.css';
import GanttCss from './GanttChart.module.css';
import { useEffect, useState, useRef } from "react";
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { decodeJwt } from '../../../utils/tokenUtils';

// gantt-task-react
import { Gantt, Task, EventOption, StylingOption, ViewMode, DisplayOption } from 'gantt-task-react';
import { ViewSwitcher } from './ViewSwitcher';
import { TaskListHeaderDefault } from './task-list-header';
import { TaskListTableDefault } from './task-list-table';
import { TooltipContentDefault } from './tooltip';

// apis, modules
import { callGetSprintsAPI
	, callGetSprintAPI
	, callPostSprintAPI
	, callPutSprintAPI
	, callDeleteSprintAPI
	, callGetTaskAPI
	, callUpdateTaskAPI 
	, callUpdateTaskForGanttAPI
	, callUpdateSprintProgressAPI } from '../../../apis/SprintAPICalls';
import { callGetProjectMemberAPI } from '../../../apis/ProjectAPICalls';
import { SET_COLLAPSED_SPRINTS } from "../../../modules/SprintsModule";
import { SET_SPRINT, INIT_SPRINT } from "../../../modules/SprintModule";

// primereact
import { Button } from 'primereact/button';
import { ConfirmDialog } from 'primereact/confirmdialog';
import { Calendar } from 'primereact/calendar';
import { Chips } from 'primereact/chips';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Tooltip } from 'primereact/tooltip';
import { MultiSelect } from 'primereact/multiselect';
import { Toast } from 'primereact/toast';
import 'primeicons/primeicons.css';

function GanttChart() {

	const [view, setView] = useState(ViewMode.Day);
	const [isChecked, setIsChecked] = useState(true);
	let columnWidth = 48;
	if (view === ViewMode.Month) {
	  	columnWidth = 150;
	} else if (view === ViewMode.Week) {
	  	columnWidth = 120;
	}

	const sprints = useSelector(state => state.sprintsReducer);
	const counts = useSelector(state => state.sprintsCountReducer);
	const sprint = useSelector(state => state.sprintReducer);
	const backlogs = useSelector(state => state.sprintBacklogsReducer);
	const members = useSelector(state => state.projectMemberReducer);
	const sprintTask = useSelector(state => state.sprintTaskReducer);
	const dispatch = useDispatch();
	const { projectCode } = useParams();
	const [dialogShow, setDialogShow] = useState(false); // ???????????? ????????? ON/OFF
	const [dialogMode, setDialogMode] = useState('');   // ????????? ???????????? ??????/????????????(insert, update)
	const [dialogTaskMode, setDialogTaskMode] = useState('');   // ????????? ???????????? ??????/????????????(insert, update)
	const [alertShowDeleteSprint, setAlertShowDeleteSprint] = useState(false); // ???????????? ?????? alert??? ON/OFF
	const [alertShowStopSprint, setAlertShowStopSprint] = useState(false); // ???????????? ???????????? alert??? ON/OFF
	const [alertShowStartSprint, setAlertShowStartSprint] = useState(false); // ???????????? ???????????? alert??? ON/OFF
	const [tasksShow, setTasksShow] = useState(false); // ?????? ?????? ?????? ????????? ON/OFF
	const [taskShow, setTaskShow] = useState(false); // ?????? ????????? ????????? ON/OFF
	const [tasks, setTasks] = useState([]); // api?????? ????????? ?????? ??????
	const [deletedTasks, setDeletedTasks] = useState([]); // ?????? ?????? ???????????? ????????? ?????????
	const [oldBacklogs, setOldBacklogs] = useState([]); // ?????? ?????????([{name, value, type}, ...])
	const [newBacklogs, setNewBacklogs] = useState([]); // ?????? ?????????([{backlogTitle, backlogDescription...}, ...])
	const [selectedOldBacklogs, setSelectedOldBacklogs] = useState([]);	// ????????? ?????? ?????????([{name, code, type}, ...])
	const [selectedNewBacklogs, setSelectedNewBacklogs] = useState([]); // ?????? ?????????([{name, type}, ...])
	const [tasksSum, setTasksSum] = useState([]); // ?????? ?????? + ?????? ????????? + ?????? ?????????
	const [newBacklog, setNewBacklog] = useState({ // ?????? ????????? or ??????
		backlogTitle: '',
		backlogDescription: '',
		backlogStartDate: '',
		backlogEndDate: '',
		backlogUrgency: '??????',
		backlogIssue: 0,
		backlogChargerCode: '',
		backlogCode: '',
	});
	const [currentLimit, setCurrentLimit] = useState(10); // ??????????????? ????????? sprints ??????
	const [sprintFormError, setSprintFormError] = useState(false); // ????????? ??????(????????????)
	const [taskFormError, setTaskFormError] = useState(false); // ????????? ??????(??????)
	const toast = useRef(null);

	const options = {
		urgency: [
			{name: '??????', value: '??????'},
			{name: '??????', value: '??????'},
			{name: '??????', value: '??????'},
		],
		issue: [
			{name: '??????', value: 0},
			{name: '??????', value: 1},
		],
	};

	useEffect( // ???????????? ????????? ?????? ?????? ???
		() => {
			dispatch(callGetSprintsAPI({ // ???????????? ?????? ??????
				projectCode: projectCode,
				isGantt: true,	// true??? ??????, ?????? ??? sprint??? ????????? ?????? ?????? ?????? ?????? sprint?????? sprintCode??? ???????????? ????????????
				offset: 0,
				limit: currentLimit,
			}));

			dispatch(callGetProjectMemberAPI({ // ???????????? ?????? ??????
				projectCode: projectCode
			}));
		},
		[]
	);

	useEffect( // ?????? ??????????????? ?????? ??? tasks(state)??? ??????
		() => {
			if(dialogMode === 'update') {
				setTasks((Object.keys(sprint).length > 0)
					? sprint.tasks.map((task) => {
						return {
							name: task.backlogTitle,
							code: task.backlogCode,
							type: 'task'
						}
					})
					: []
				);
			}
		},
		[sprint]
	);

	useEffect( // ????????? ?????? ????????????
		() => {
			setOldBacklogs(
				(Object.keys(backlogs).length > 0)
				? backlogs.map((backlog) => {
					return {
						name: backlog.backlogTitle,
						code: backlog.backlogCode,
						type: 'oldBacklog'
					}
				})
				: []
			);
		},
		[backlogs]
	);

	useEffect( // ??????, ???????????????, ?????????????????? ????????? ??? ??????/?????? ????????? ?????? ?????? ????????? ????????????
		() => {
			let allTasks = [];
			
			allTasks = allTasks.concat(tasks, selectedOldBacklogs, selectedNewBacklogs);
			
			setTasksSum(allTasks);
		},
		[tasks, selectedOldBacklogs, selectedNewBacklogs]
	);
	
	useEffect( // ?????? ?????? ????????? ?????? ??? ????????? ?????? ????????? ?????????
		() => {
			
			setNewBacklog({
				backlogTitle: sprintTask.backlogTitle,
				backlogDescription: sprintTask.backlogDescription,
				backlogStartDate: (sprintTask.startDate)? new Date(sprintTask.startDate): '',
				backlogEndDate: (sprintTask.endDate)? new Date(sprintTask.endDate): '',
				backlogUrgency: sprintTask.urgency,
				backlogIssue: sprintTask.issue,
				backlogChargerCode: sprintTask.backlogChargerCode,
				backlogProgressStatus: sprintTask.progressStatus,
				backlogCategory: sprintTask.category,
				backlogCode: sprintTask.backlogCode,
				sprintCode: sprintTask.sprintCode,
			});
		},
		[sprintTask]
	);

	const getMoreSprints = () => { // ???????????? ?????? ?????????(?????????, ???????????????)

		const nextLimit = currentLimit + 10;
		setCurrentLimit(nextLimit);

		dispatch(callGetSprintsAPI({ // ???????????? ?????? ??????
			projectCode: projectCode,
			isGantt: true,	// true??? ??????, ?????? ??? sprint??? ????????? ?????? ?????? ?????? ?????? sprint?????? sprintCode??? ???????????? ????????????
			offset: 0,
			limit: nextLimit,
		}, sprints));
	}

	/* Gantt?????????????????? ???????????? ???????????? */
	const handleTaskChange = (task) => { // ?????????????????? ????????? ??????????????? ????????? ??????

		const selectedSprint = {
			id: task.id,
			start: task.start,
			end: task.end
		}

		const currentInfo = {
			projectCode: projectCode,
			memberCode: decodeJwt(window.localStorage.getItem("access_token")).code,
			offset: 0,
			limit: currentLimit,
			prevSprints: sprints
		}

		dispatch(callUpdateTaskForGanttAPI(selectedSprint, currentInfo));

		toast.current.show({
            severity: 'success', 
            summary: `?????? ?????? ?????? ??????`, 
            detail: '????????? ????????? ?????????????????????.',
            life: 3000
        });
	};
  
	const handleDblClick = (task) => { // ???????????? ??? ???????????? ??? ????????????/?????? ????????? ??????
		
		if(task.type === 'project') {
			dispatch(callGetSprintAPI({	// ???????????? ?????? ??????
				sprintCode: parseInt(task.id),
			}));

			onShowUpdate();
		}

		if(task.type === 'task') {
			dispatch(callGetTaskAPI({	// ?????? ?????? ??????
				taskCode: parseInt(task.id.slice(1)),
			}));
			
			onShowUpdateTask();
		}
	};
  
	const handleExpanderClick = (task) => { // ??????????????? ?????? ??????????????? ??????/??????
		
		dispatch({ 
            type: SET_COLLAPSED_SPRINTS,
			payload: task
		});
	};


	/* ???????????? ??????/?????? ?????????(dialogShow) */
	const onShowInsert = () => { // ??? ???????????? ??????
		
		setDialogMode('insert');

        setDialogShow(true);
    }

    const onShowUpdate = () => { // ???????????? ??????(???????????? ??? ????????????)

		setDialogMode('update');

        setDialogShow(true);
    }

	const onChangeSprint = (e) => {
		
		if(e.target.name === 'sprintName') {
            if(e.target.value) {
                setSprintFormError(false);
            } else {
                setSprintFormError(true);
            }
        }

		let params = {
            ...sprint,
            [e.target.name]: e.target.value
        };
		
		dispatch({ 
            type: SET_SPRINT, 
            payload: params
        })

	};

	const initBacklogs = () => { // ????????? ?????? state??? ????????? ??? 
		// setOldBacklogs([]);
		setSelectedOldBacklogs([]);
		setNewBacklogs([]);
		setSelectedNewBacklogs([]);
	}

	const confirmInsertSprint = () => { // ???????????? ?????? - ?????? ?????? 

		if(!sprint.sprintName) {
            setSprintFormError(true);
            return;
        }

		const changedTasks = {
			oldBacklogs: simpleArrToObjectArr(selectedOldBacklogs, backlogs),
			newBacklogs: simpleArrToObjectArr(selectedNewBacklogs, newBacklogs),
		}
		
		const currentInfo = {
			projectCode: projectCode,
			backlogCreatorCode: decodeJwt(window.localStorage.getItem("access_token")).code,
			offset: 0,
			limit: currentLimit,
			prevSprints: sprints
		}

		dispatch(callPostSprintAPI(sprint, changedTasks, currentInfo));

		dispatch({type: INIT_SPRINT, payload: {}});
		initBacklogs();
		setDialogShow(false);
		setSprintFormError(false);

		toast.current.show({
            severity: 'success', 
            summary: `???????????? ?????? ??????`, 
            detail: '??????????????? ?????????????????????.',
            life: 3000
        });
	};

	const confirmUpdateSprint = async () => { // ???????????? ?????? - ?????? ?????? 
		
		if(!sprint.sprintName) {
            setSprintFormError(true);
            return;
        }

		const changedTasks = {
			// tasks: simpleArrToObjectArr(tasks, sprint.tasks),
			deletedTasks: deletedTasks,
			oldBacklogs: simpleArrToObjectArr(selectedOldBacklogs, backlogs),
			newBacklogs: simpleArrToObjectArr(selectedNewBacklogs, newBacklogs),
		}
		
		const currentInfo = {
			projectCode: projectCode,
			memberCode: decodeJwt(window.localStorage.getItem("access_token")).code,
			backlogCreatorCode: decodeJwt(window.localStorage.getItem("access_token")).code,
			offset: 0,
			limit: currentLimit,
			prevSprints: sprints
		}

		await dispatch(callPutSprintAPI(sprint, changedTasks, currentInfo));

		await dispatch({type: INIT_SPRINT, payload: {}});
		initBacklogs();
		setDialogShow(false);
		setSprintFormError(false);

		toast.current.show({
            severity: 'success', 
            summary: `???????????? ?????? ??????`, 
            detail: '??????????????? ?????????????????????.',
            life: 3000
        });
	};

	const confirmDeleteSprint = () => { // ???????????? ?????? alert??? - Yes ?????? 

		const currentInfo = {
			projectCode: projectCode,
			memberCode: decodeJwt(window.localStorage.getItem("access_token")).code,
			offset: 0,
			limit: currentLimit,
			prevSprints: sprints
		}

		dispatch(callDeleteSprintAPI(sprint.sprintCode, currentInfo));

		dispatch({type: INIT_SPRINT, payload: {}});
		initBacklogs();
		setAlertShowDeleteSprint(false);
		setDialogShow(false);
		setSprintFormError(false);

		toast.current.show({
            severity: 'success', 
            summary: `???????????? ?????? ??????`, 
            detail: '??????????????? ?????????????????????.',
            life: 3000
        });
	}

	const cancelSprint = () => { // ???????????? ??????/?????? - ?????? ?????? 

		dispatch({type: INIT_SPRINT, payload: {}});
		initBacklogs();
		setDialogShow(false);
		setSprintFormError(false);
	};


	/* ?????? ?????? ?????? ?????????(tasksShow) */
	const onShowTasks = () => {

		setTasksShow(true);
	}

	const confirmTasks = () => { // ?????? ?????? ?????? ?????? ??????

		setTasksShow(false);
	};

	const cancelTasks = () => { // ?????? ?????? ?????? ?????? ??????

		setTasksShow(false);
	};

	const onChangeTasks = (e) => { // x???????????? ?????? ?????? ??????
		let afterTasks = e.target.value;
		
		let copyDeletedTasks = [...deletedTasks];
		copyDeletedTasks.push(tasks.filter((el) => !afterTasks.includes(el.name))[0].code);	//FIXME: ???????????? ????????? filter????????? ????????????
		setDeletedTasks(copyDeletedTasks);

		let copyTasks = [...tasks]; // ??????????????? ?????? ?????? [{}, {}, ...]
		let copyEvent = [...e.value]; // ????????? ????????? ????????? ?????? [...]
		let changedTasks = []; 

		// TODO: ?????? ????????? ???????????? ????????? ????????? ????????????
		// ????????? ????????? ????????? ????????? ????????? ??????
		for(let i = 0; i < copyTasks.length; i++) {
			
			for(let j = 0; j < copyEvent.length; j++) {

				if(copyTasks[i].name === copyEvent[j]) {

					changedTasks.push({
						name: copyTasks[i].name,
						code: copyTasks[i].code,
						type: copyTasks[i].type
					});
					
					break;
				}
			}
		}

		setTasks(changedTasks);
	}

	const onChangeNewBacklogs = (e) => { //x???????????? ?????? ????????? ??????
		
		let copyNewBacklogs = [...selectedNewBacklogs]; // ??????????????? ?????? ?????? [{}, {}, ...]
		let copyEvent = [...e.value]; // ????????? ????????? ????????? ?????? [...]
		let changedNewBacklogs = []; 

		// TODO: ?????? ????????? ???????????? ????????? ????????? ????????????
		// ????????? ????????? ????????? ????????? ????????? ??????
		for(let i = 0; i < copyNewBacklogs.length; i++) {
			
			for(let j = 0; j < copyEvent.length; j++) {

				if(copyNewBacklogs[i].name === copyEvent[j]) {

					changedNewBacklogs.push({
						name: copyNewBacklogs[i].name,
						type: copyNewBacklogs[i].type
					});
					
					break;
				}
			}
		}

		setSelectedNewBacklogs(changedNewBacklogs);
	}


	/* ?????? ????????? ??????/?????? ?????? ?????????(taskShow) */
	const onShowInsertTask = () => { // ?????? ????????? ?????? ?????? ???

		setNewBacklog({
			backlogTitle: '',
			backlogDescription: '',
			backlogStartDate: '',
			backlogEndDate: '',
			backlogUrgency: '??????',
			backlogIssue: 0,
			backlogChargerCode: '',
		});

		setDialogTaskMode('insert');

		setTaskShow(true);
	}

	const onShowUpdateTask = () => { // ?????? ?????? ?????? ?????? ???
		
		setDialogTaskMode('update');

		setTaskShow(true);
	}

	const confirmInsertTask = () => { // ?????? ????????? ?????? ?????? ??????
		
		if(!newBacklog.backlogTitle) {
            setTaskFormError(true);
            return;
        }

		let changedBacklogs = [...selectedNewBacklogs];
		changedBacklogs.push({
			name: newBacklog.backlogTitle,
			type: 'newBacklog'
		});
		setSelectedNewBacklogs(changedBacklogs); // ??????/?????? ???????????? ???????????? ??????
		
		let copyNewBacklogs = [...newBacklogs];
		copyNewBacklogs.push({ // ??????/???????????? ??? API??? ????????? ??????
			...newBacklog,
			backlogStartDate: (newBacklog.backlogStartDate)? dateFormat(new Date(newBacklog.backlogStartDate), 'start'): '',
			backlogEndDate: (newBacklog.backlogEndDate)? dateFormat(new Date(newBacklog.backlogEndDate), 'end'): '',
		});
		setNewBacklogs(copyNewBacklogs);
		
		setTaskShow(false);
		setTaskFormError(false);

		initTask();
	};

	const confirmUpdateTask = () => { // ?????? ?????? - ?????? ??????

		if(!newBacklog.backlogTitle) {
            setTaskFormError(true);
            return;
        }

		let changedBacklog = { // ?????? ?????? ?????? ??? API??? ????????? ??????
			...newBacklog,
			backlogStartDate: (newBacklog.backlogStartDate)? newBacklog.backlogStartDate: null,
			backlogEndDate: (newBacklog.backlogEndDate)? newBacklog.backlogEndDate: null,
		};

		const currentInfo = {
			projectCode: projectCode,
			memberCode: decodeJwt(window.localStorage.getItem("access_token")).code,
			offset: 0,
			limit: currentLimit,
			prevSprints: sprints
		}

		dispatch(callUpdateTaskAPI(changedBacklog, currentInfo));

		setTaskShow(false);
		setTaskFormError(false);

		initTask();

		toast.current.show({
            severity: 'success', 
            summary: `?????? ?????? ??????`, 
            detail: '????????? ?????????????????????.',
            life: 3000
        });
	};

	const cancelTask = () => { // ?????? ????????? ??????/?????? ?????? ?????? ??????

		setTaskShow(false);
		setTaskFormError(false);

		initTask();
	};

	const onChangeNewBacklog = (e) => {

		if(e.target.name === 'backlogTitle') {
            if(e.target.value) {
                setTaskFormError(false);
            } else {
                setTaskFormError(true);
            }
        }

		setNewBacklog({
			...newBacklog,
			[e.target.name]: e.target.value
		});
	}

	const initTask = () => { // ?????? ????????? ????????? ?????????

		setNewBacklog({
			backlogTitle: '',
			backlogDescription: '',
			backlogStartDate: '',
			backlogEndDate: '',
			backlogUrgency: '??????',
			backlogIssue: 0,
			backlogChargerCode: '',
		});
	}

	const panelFooterTemplate = () => { // ?????? ????????? ?????? ??????
        const selectedItems = selectedOldBacklogs;
        const length = selectedItems ? selectedItems.length : 0;
        return (
            <div className="py-2 px-3"
				style={{
					padding: '7px 20px',
					borderTop: '1px solid #333544'
				}}
			>
                <b>{length}</b>?????? ???????????? ?????????????????????.
            </div>
        );
    }

	const customChip = (item) => { // ?????? ?????? ??????, ?????? ?????????, ?????? ????????? chips ?????????
		return (
			<div>
				<i className="pi pi-hashtag" style={{ fontSize: "12px", marginRight: "5px" }}></i>
				<span>{item}</span>
			</div>
		);
	};

	const simpleArrToObjectArr = (sArr, oArr) => {

		// backlogs				[{backlogTitle, backlogDescription...}, ...]		
		// oldBacklogs 			[{name, code, type}, ...]
		// selectedOldBacklogs	[{name, code, type}, ...]
		// -----------------------------------------------------------------
		// newBacklogs 			[{backlogTitle, backlogDescription...}, ...]
		// selectedNewBacklogs	[{name, type}, ...]

		let result = [];
		for(let i = 0; i < sArr.length; i++) {
			let matched = oArr.find(o => o.backlogTitle === sArr[i].name);
			result.push(matched);
		}

		return result;
	}

	const onSprintProgressChange = () => { // ???????????? ????????????/???????????? ???????????? ??????
		
		const currentInfo = {
			projectCode: projectCode,
			memberCode: decodeJwt(window.localStorage.getItem("access_token")).code,
			sprintCode: sprint.sprintCode,
			offset: 0,
			limit: currentLimit,
			prevSprints: sprints
		}

		dispatch(callUpdateSprintProgressAPI(sprint, currentInfo));

		dispatch({type: INIT_SPRINT, payload: {}});
		initBacklogs();
		setDialogShow(false);
	}

	return (
		<>
			<PageTitle
				icon={ <i className="pi pi-fw pi-chart-bar"/> }
				text="????????????"
			/>
		
			<ViewSwitcher
				onViewModeChange={(viewMode) => setView(viewMode)}
				onViewListChange={setIsChecked}
				isChecked={isChecked}
				onShowInsert={onShowInsert}
				setCurrentLimit={setCurrentLimit}
			/>		

			<div id={GanttCss.container}>
				{
					(Object.keys(sprints).length !== 0)
					? <>
						<div 
							id={GanttCss.unfoldButton}
							onClick={() => setIsChecked(!isChecked)}
						>
							{
								(isChecked)
								? <i className="pi pi-angle-left"/>
								: <i className="pi pi-angle-right"/>
							}
						</div>
						<div id={GanttCss.ganttContainer}>
							<Gantt
								tasks={sprints}
								viewMode={view}
								onDateChange={handleTaskChange}
								onDoubleClick={handleDblClick}
								onExpanderClick={handleExpanderClick}
								barCornerRadius="5"
								barProgressColor="grey"
								barProgressSelectedColor="#808080"
								headerHeight={36}
								rowHeight={32}
								columnWidth={columnWidth}
								listCellWidth={isChecked ? "155px" : ""}
								todayColor="rgba(0, 170, 156, .1)"
								locale="kor"
								TaskListTable={TaskListTableDefault}
								TaskListHeader={TaskListHeaderDefault}
								TooltipContent={TooltipContentDefault}
							/>

							{
								(counts.sprintsCount > currentLimit) &&
								<div id={GanttCss.moreSprints}
									onClick={() => getMoreSprints()}
								>
									<i className="pi pi-angle-down" style={{width: '14px', height: '14px'}}/>
								</div>
							}
						</div>
					</>
					: <div id={GanttCss.emptySprint}>
						<i className="pi pi-chart-bar" style={{fontSize: '20em', transform: 'rotate(90deg)'}} />
						<h1>??????????????? ????????????.</h1>
					</div>
				}
			</div>

			{/* ???????????? ??????/?????? ????????? */}
            <Dialog 
				id={GanttCss.dialogContainer}
                visible={dialogShow} 
                style={{ width: '40vw', height: '80vh' }}
                onHide={() => cancelSprint()}
				draggable={false}
                header={
                    <div id={GanttCss.dialogHeader}>
                        <span>
                            { 
                                (dialogMode==='update')
                                ? `???????????? ??????`
                                : `???????????? ??????`
                            }
                        </span>
                    </div>
                }
                footer={
                    <div id={GanttCss.dialogFooter}>
                        <div>
                            { 
                                (dialogMode==='update') &&
                                <Button
                                    className="p-button-danger" 
                                    label="???????????? ??????" 
                                    icon="pi pi-check" 
                                    onClick={() => setAlertShowDeleteSprint(true)} 
                                />
                            }
                        </div>
                        <div>
                            <Button 
                                label={
                                    (dialogMode==='update')
                                    ? '??????'
                                    : '??????'
                                }
                                icon="pi pi-check" 
                                onClick={
                                    () => {
                                        (dialogMode==='update')
                                        ? confirmUpdateSprint()
                                        : confirmInsertSprint()
                                    }
                                } 
                                autoFocus 
                            />
                            <Button 
                                className="p-button-text" 
                                label="??????" 
                                icon="pi pi-times" 
                                onClick={() => cancelSprint()} 
                            />
                        </div>
                    </div>
                } 
            >
                <div id={GanttCss.dialogBody}>
                    <div>
						<div style={{paddingBottom: '10px'}}>
                        	<label>???????????? ??????</label>
							{
								(sprint.sprintProgressStatus === 'Y')
								? <Button 
									label="???????????? ????????????"
									style={{height: '20px', marginLeft: '20px', backgroundColor: 'rgba(248, 96, 100, .16)', border: '1px solid #333544', color: '#F86064'}}
									onClick={() => setAlertShowStopSprint(true)}
								/>
								: (sprint.sprintProgressStatus === 'N')
									? <Button 
										label="???????????? ????????????"
										style={{height: '20px', marginLeft: '20px', backgroundColor: 'rgba(255, 185, 95, .16)', border: '1px solid #333544', color: '#FFB95F'}}
										onClick={() => setAlertShowStartSprint(true)}
									/>
									: <></>
							}
						</div>
                        <InputText
							className={(sprintFormError)? 'p-invalid': ''}
                            name="sprintName"
                            value={sprint.sprintName || ''}
                            onChange={(e) => onChangeSprint(e)}
                            placeholder="?????? ?????? ???????????????."
							maxLength="30"
                        />
						{
                            (sprintFormError)
                            ? <small className="p-error block">???????????? ????????? ?????? ?????????????????????.</small>
                            : <></>
                        }
                    </div>
					<div>
						<div>
							<div>
								<label>?????????</label>
								<Calendar 
									id="startDate" 
									name="sprintStartDate"
									value={sprint.sprintStartDate}
									placeholder="???????????? ??????"
									showIcon
									dateFormat="yy-mm-dd"
									onChange={(e) => onChangeSprint(e)}
								/>
							</div>
							<div>
								<label>?????????</label>
								<Calendar 
									id="endDate"
									name="sprintEndDate"
									value={sprint.sprintEndDate}
									placeholder="???????????? ??????"
									showIcon
									dateFormat="yy-mm-dd"
									onChange={(e) => onChangeSprint(e)}
								/>
							</div>
						</div>
						<div>
							<label>???????????? ??????</label>
							<InputTextarea
								name="sprintTarget"
								value={sprint.sprintTarget || ''} 
								onChange={(e) => onChangeSprint(e)}
								rows={2} 
								cols={30} 
								style={{minHeight: '140px'}}
								maxLength="150"
								autoResize 
							/>
						</div>
					</div>
					<div>
						<div style={{paddingBottom: '10px'}}>
							<label>
								?????? ?????? ??????
								<Tooltip target=".allTasks" />
								<i 
									className="allTasks pi pi-info-circle"
									data-pr-tooltip={`${(dialogMode === 'update')? '?????? ?????? ????????? ': ''}?????? ?????????, ?????? ??????????????? 
														\n???????????? ?????? ??????????????? ??????????????????.`}
									data-pr-position="right" 
									data-pr-at="right+10 top" 
									data-pr-my="left center-2" 
									style={{ marginLeft: '10px', cursor: 'pointer' }}
								/>
							</label>
							<Button 
								label="????????????"
								style={{height: '20px', marginLeft: '20px', backgroundColor: 'rgba(0, 170, 156, .16)', border: '1px solid #333544', color: '#00AA9C'}}
								onClick={onShowTasks}
							/>
						</div>
						<Chips
							value={tasksSum.map((task) => task.name)}
							itemTemplate={customChip}
							readOnly={true}
						/>
					</div>
                </div>
            </Dialog>

			{/* ?????? ?????? ?????? ????????? */}
            <Dialog
				id={GanttCss.taskContainer}
                visible={tasksShow} 
                style={{ width: '35vw', height: '80vh' }}
                onHide={cancelTasks}
				draggable={false}
                header={ 
                    <h4>?????? ?????? ??????</h4>
                }
                footer={
                    <div style={{marginTop: '20px'}}>
                        <Button 
                            label="??????"
                            icon="pi pi-check"
                            onClick={confirmTasks}
                            autoFocus 
                        />
                        <Button 
                            label="??????" 
                            icon="pi pi-times" 
                            onClick={cancelTasks}
                            className="p-button-text"
                        />
                    </div>
                }
            >
                <div id={GanttCss.taskBody}>
					{
						(dialogMode === 'update') &&
						<div>
							<label>
								?????? ?????? ??????
								<Tooltip target=".tasks" />
								<i 
									className="tasks pi pi-info-circle"
									data-pr-tooltip={`???????????? ??????????????? ?????? ?????? ???????????? ???????????????.
														\n?????? ?????? ??? ?????? ??????????????? ???????????? ?????????.`}
									data-pr-position="right" 
									data-pr-at="right+10 top" 
									data-pr-my="left center-2" 
									style={{ marginLeft: '10px', cursor: 'pointer' }}
								/>
							</label>
							{
								<Chips
									value={tasks.map((task) => task.name)}
									onChange={(e) => onChangeTasks(e)}
									itemTemplate={customChip}
									style={{display: 'block'}}
								/>
							}
						</div>
					}

                    <div>
                        <label>
							?????? ?????????
							<Tooltip target=".oldBacklogs" />
							<i 
								className="oldBacklogs pi pi-info-circle"
								data-pr-tooltip="??????????????? ?????? ?????? ??????, ???????????? ?????? ?????? ??????????????? ???????????????" 
								data-pr-position="right" 
								data-pr-at="right+10 top" 
								data-pr-my="left center-2" 
								style={{ marginLeft: '10px', cursor: 'pointer' }}
							/>
						</label>
						<MultiSelect 
							className="multiselect-custom"
							value={selectedOldBacklogs} 
							options={oldBacklogs}
							onChange={(e) => {
								setSelectedOldBacklogs(e.value);
								onChangeSprint(e);
							}} 
							optionLabel="name" 
							display="chip"
							filter
							panelFooterTemplate={panelFooterTemplate}
						/>
					</div>

					<div>
						<div style={{padding: '10px 0'}}>
							<label>
								?????? ?????????
								<Tooltip target=".newBacklogs" />
								<i 
									className="newBacklogs pi pi-info-circle"
									data-pr-tooltip="????????? ???????????? ????????????, ??????????????? ???????????????" 
									data-pr-position="right" 
									data-pr-at="right+10 top" 
									data-pr-my="left center-2" 
									style={{ marginLeft: '10px', cursor: 'pointer' }}
								/>
							</label>
							<Button 
								label="????????????"
								style={{height: '20px', marginLeft: '20px', backgroundColor: 'rgba(0, 170, 156, 0.16)', border: '1px solid #333544', color: '#00AA9C'}}
								// style={{height: '20px', marginLeft: '20px', backgroundColor: 'rgba(255, 185, 95, .16)', border: '1px solid #333544', color: '#FFB95F'}}
								onClick={onShowInsertTask}
							/>
						</div>
						<Chips
							value={selectedNewBacklogs.map(newBacklog => newBacklog.name)}
							onChange={(e) => onChangeNewBacklogs(e)}
							itemTemplate={customChip}
							style={{display: 'block'}}
						/>

                    </div>
                </div>
            </Dialog>

			{/* ?????? ????????? ??????/?????? ?????? ????????? */}
            <Dialog 
                visible={taskShow} 
				position='right'
                style={{ width: '31vw', height: '80vh' }}
                onHide={cancelTask}
				draggable={false}
                header={ 
                    <h4>
						{
							(dialogTaskMode === 'insert')
							? '?????? ????????? ??????'
							: '?????? ??????'
						}
					</h4>
                }
                footer={
                    <div style={{marginTop: '20px'}}>
                        <Button 
                            label="??????"
                            icon="pi pi-check"
                            onClick={() =>
								(dialogTaskMode === 'insert')
								? confirmInsertTask()
								: confirmUpdateTask()
							}
                            autoFocus 
                        />
                        <Button 
                            label="??????" 
                            icon="pi pi-times" 
                            onClick={cancelTask}
                            className="p-button-text"
                        />
                    </div>
                }
            >
                <div id={GanttCss.taskBody}>
					<div>
                        <label>????????? ??????</label>
                        <InputText
							className={(taskFormError)? 'p-invalid': ''}
                            name="backlogTitle"
                            value={(newBacklog.backlogTitle)? newBacklog.backlogTitle: ''}
                            onChange={(e) => onChangeNewBacklog(e)}
                            placeholder="?????? ?????? ???????????????."
                        />
						{
                            (taskFormError)
                            ? <small className="p-error block">????????? ?????? ?????????????????????.</small>
                            : <></>
                        }
                    </div>
					<div>
                        <label>????????? ??????</label>
                        <InputText
                            name="backlogDescription"
                            value={(newBacklog.backlogDescription)? newBacklog.backlogDescription: ''}
                            onChange={(e) => onChangeNewBacklog(e)}
							placeholder="???????????? ?????? ????????? ??????????????????."
                        />
                    </div>
					<div>
                        <label>????????????</label>
						<div id={GanttCss.backlogContainer}>

							<div id={GanttCss.backlogDetail}>
								<label>?????????</label>
								<label>?????????</label>
								<label>?????????</label>
								<label>????????????</label>
								<label>?????????</label>
							</div>
							<div>
								<Calendar 
									name="backlogStartDate"
									value={(newBacklog.backlogStartDate)? newBacklog.backlogStartDate: ''} 
									placeholder="???????????? ??????"
									showIcon
									dateFormat="yy-mm-dd"
									onChange={(e) => onChangeNewBacklog(e)}
								/>
								<Calendar 
									name="backlogEndDate"
									value={(newBacklog.backlogEndDate)? newBacklog.backlogEndDate: ''} 
									placeholder="???????????? ??????"
									showIcon
									dateFormat="yy-mm-dd"
									onChange={(e) => onChangeNewBacklog(e)}
								/>
								<Dropdown 
									name="backlogUrgency"
									value={(newBacklog.backlogUrgency)? newBacklog.backlogUrgency: '??????'} 
									options={options.urgency} 
									onChange={(e) => onChangeNewBacklog(e)}
									optionLabel="name" 
									placeholder="???????????? ??????" 
								/>
								<Dropdown 
									name="backlogIssue"
									value={(newBacklog.backlogIssue)? newBacklog.backlogIssue: 0} 
									options={options.issue} 
									onChange={(e) => onChangeNewBacklog(e)}
									optionLabel="name" 
									placeholder="???????????? ??????" 
								/>
								<Dropdown 
									name="backlogChargerCode"
									value={(newBacklog.backlogChargerCode)? newBacklog.backlogChargerCode: null} 
									options={ 
										[{
											name: '???????????? ??????', 
											value: null
										}].concat(members.map(member => {
												return {
													name: member.memberName,
													value: member.memberCode
												}
											})
										)
									}
									onChange={(e) => onChangeNewBacklog(e)}
									optionLabel="name" 
									placeholder="???????????? ??????"
								/>
							</div>

						</div>
                    </div>
                </div>
            </Dialog>

			{/* ???????????? ?????? alert??? */}
			<ConfirmDialog 
                visible={ alertShowDeleteSprint } 
                onHide={() => setAlertShowDeleteSprint(false)} 
                header="???????????? ??????" 
                message={
					<span>
						???????????? ?????? ??? ?????? ???, ?????? ??? ???????????? ???????????? ??????, <br/>
						??????????????? ???????????? ????????? ??????????????? ?????????. <br/>
						?????? ??????????????? ?????????????????????????
					</span>
				}
                icon="pi pi-exclamation-triangle"
                style={{width: '24vw'}}
                accept={() => confirmDeleteSprint()} 
                reject={() => setAlertShowDeleteSprint(false)}
				draggable={false}
            />

			{/* ???????????? ???????????? alert??? */}
			<ConfirmDialog 
                visible={ alertShowStopSprint } 
                onHide={() => setAlertShowStopSprint(false)} 
                header="???????????? ????????????" 
                message={
					<span>
						???????????? ?????? ??? ?????? ???, ?????? ??? ???????????? ???????????? ??????, <br/>
						??????????????? ???????????? ?????? ??????????????? ?????? ?????????. <br/>
						?????? ??????????????? ?????????????????????????
					</span>
				}
                icon="pi pi-exclamation-triangle"
                style={{width: '24vw'}}
                accept={() => onSprintProgressChange()} 
                reject={() => setAlertShowStopSprint(false)}
				draggable={false}
            />

			{/* ???????????? ???????????? alert??? */}
			<ConfirmDialog 
                visible={ alertShowStartSprint } 
                onHide={() => setAlertShowStartSprint(false)} 
                header="???????????? ????????????" 
                message={
					<span>
						???????????? ?????? ???, ?????? ?????? ??????????????? ???????????? <br/>
						?????? ???, ?????? ??? ???????????? ???????????? ??????, <br/>
						??????????????? ???????????? ?????? ??????????????? ?????? ?????????. <br/>
						?????? ??????????????? ?????????????????????????
					</span>
				}
                icon="pi pi-exclamation-triangle"
                style={{width: '24vw'}}
                accept={() => onSprintProgressChange()} 
                reject={() => setAlertShowStartSprint(false)}
				draggable={false}
            />

			{/* toast */}
			<Toast ref={toast} position="top-right" />
		</>
	);
}

function dateFormat(date, when) { // Fri Jul 01 2022 00:00:00 GMT+0900 (?????? ?????????) ????????? '2022-07-01 00:00:00'?????? ?????????
	
    let month = date.getMonth() + 1;
    let day = date.getDate();
    let hour = date.getHours();
    let minute = date.getMinutes();
    let second = date.getSeconds();

    month = month >= 10 ? month : '0' + month;
    day = day >= 10 ? day : '0' + day;
    hour = hour >= 10 ? hour : '0' + hour;
    minute = minute >= 10 ? minute : '0' + minute;
    second = second >= 10 ? second : '0' + second;

    if(when === 'start') {
        return date.getFullYear() + '-' + month + '-' + day  + ' 00:00:00';
    }

    if(when === 'end') {
        return date.getFullYear() + '-' + month + '-' + day  + ' 23:59:59';
    }
}

export default GanttChart;