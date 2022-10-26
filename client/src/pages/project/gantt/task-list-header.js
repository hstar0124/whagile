import React from "react";
import styles from "./task-list-header.module.css";
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { callGetBacklogsAPI } from '../../../apis/SprintAPICalls';
import { SET_COLLAPSED_ALL_SPRINTS } from "../../../modules/SprintsModule";

export const TaskListHeaderDefault = ({ headerHeight, fontFamily, fontSize, rowWidth, isChecked }) => {

	const sprints = useSelector(state => state.sprintsReducer);
	const backlogs = useSelector(state => state.sprintBacklogReducer);
	const counts = useSelector(state => state.sprintsCountReducer);
	const { projectCode } = useParams();
	const dispatch = useDispatch();

	const collapseGantt = () => {

		dispatch({ 
            type: SET_COLLAPSED_ALL_SPRINTS,
			payload: sprints
		});
	}

	useEffect(
		() => {
			dispatch(callGetBacklogsAPI({	// 스프린트 내 백로그 목록 조회
				offset: 0,
				limit: 1000,
				projectCode: projectCode
			}));
		},
		[]
	);

	return (
		<div
			className={styles.ganttTable}
			style={{
				fontFamily: fontFamily,
				fontSize: fontSize,
				minWidth: '360px',
				height: '36px',
				border: '1px solid grey',
				backgroundColor: '#282936',
			}}
			onClick={collapseGantt}
		>
			<div
				className={styles.ganttTable_Header}
				style={{
					height: headerHeight - 2,
				}}
			>
				<div
					className={styles.ganttTable_HeaderItem}
					style={{
						minWidth: rowWidth,
					}}
				>
					<div className={styles.cells} title="일감 목록 접기">

						<i className="pi pi-list" style={{margin: '0 10px 0 20px'}}/>
						<span>스프린트</span>
						<span style={{fontSize: '12px', marginLeft: '10px'}}>[{counts.sprintsCount}]</span>
					</div>
				</div>
			</div>
		</div>
	);
};