// react
import React, { useEffect } from "react";
import { useState, useRef } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';

// css
import "gantt-task-react/dist/index.css";
import 'primeicons/primeicons.css';

// gantt-task-react
import { ViewMode } from "gantt-task-react";
import ViewSwitcherCss from './ViewSwitcher.module.css';

// apis, modules
import { callGetSprintsAPI, callGetSprintsCountAPI } from '../../../apis/SprintAPICalls';

// primereact
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';

export const ViewSwitcher = ({
	onViewModeChange,
	onShowInsert,
	// onViewListChange,
	// isChecked,
	setCurrentLimit,
}) => {
	
	const dispatch = useDispatch();
	const { projectCode } = useParams();
	const toast = useRef(null);
	const [viewMode, setViewMode] = useState(ViewMode.Day);
	const [filterMode, setFilterMode] = useState('전체');
	const [condition, setCondition] = useState('name'); // 조건검색 카테고리    
	const [value, setValue] = useState(''); // 조건검색 키워드
    const selectCondition = [
        {label: '스프린트 이름', value: 'name'},
        // {label: '담당자 이름', value: 'backlogChargerName'} //TODO: 담당자 검색 만들거야?
        // {label: '일감 이름', value: 'taskName'} //TODO: 일감 검색 만들거야?
    ];
	const [searchMessage, setSearchMessage] = useState('모든 스프린트를 조회합니다');


	const onKeyPressHandler = e => { // 엔터키 입력

        if(e.key === 'Enter') {
            onClickSearch();
        }
    }

	const onClickSearch = () => { // 검색 버튼 클릭

		setFilterMode('전체');

		setSearchMessage(
			value
			? `'${selectCondition.find(x => x.value === condition).label}'에 '${value}'을(를) 포함한 검색결과입니다.`
			: `모든 스프린트를 조회합니다.`
		);

		dispatch(callGetSprintsAPI({	// 스프린트 목록 조회
			projectCode: parseInt(projectCode),
			isGantt: true,	// true일 경우, 진행 중 sprint가 맨위에 오고 진행 중이 아닌 sprint들은 sprintCode로 내림차순 정렬된다
			searchCondition: condition,
			searchValue: value,
			offset: 0,
			limit: 10
		}));

		setCurrentLimit(10);
    };

	const onSearchAll = () => {

		setValue('');

		setSearchMessage(`모든 스프린트를 조회합니다.`);

		dispatch(callGetSprintsAPI({	// 스프린트 목록 조회
			projectCode: parseInt(projectCode),
			isGantt: true,	// true일 경우, 진행 중 sprint가 맨위에 오고 진행 중이 아닌 sprint들은 sprintCode로 내림차순 정렬된다
			offset: 0,
			limit: 10
		}));

		setCurrentLimit(10);
	}

	useEffect(
		() => {
			dispatch(callGetSprintsCountAPI({ // 스프린트, 일감, 백로그 갯수 조회
				projectCode: projectCode,
				searchCondition: condition,
				searchValue: value
			}));
		},
		[]
	);

	const onSearchIng = () => {

		setSearchMessage(`진행 중인 스프린트를 조회합니다.`);

		dispatch(callGetSprintsAPI({	// 스프린트 목록 조회
			projectCode: parseInt(projectCode),
			isGantt: true,	// true일 경우, 진행 중 sprint가 맨위에 오고 진행 중이 아닌 sprint들은 sprintCode로 내림차순 정렬된다
			searchCondition: 'progress_status',
			searchValue: 'y'
		}));
	}

	return (
		<>
			<div className="ViewContainer" id={ViewSwitcherCss.container}>

				{/* search */}
				<div id={ViewSwitcherCss.search}>
					<span>검색</span>
					<div>
						<Dropdown
							value={condition} 
							options={selectCondition} 
							onChange={(e) => setCondition(e.value)} 
						/>
					</div>
					<span className="p-input">
						<InputText
							value={value} 
							onChange={(e) => setValue(e.target.value)}
							onKeyPress={ onKeyPressHandler }
						/>
					</span>
					<Button 
						icon="pi pi-search" 
						className="p-button-outlined p-button-custom"  
						aria-label="Search"
						style={{
							width: '80px', 
							color: '#FFFFFF', 
							backgroundColor: '#1D1E27', 
							border: '1px solid #333544'
						}}
						onClick={onClickSearch}
					/>
				</div>
				
				<div id={ViewSwitcherCss.period}>
					<Button 
						className="p-button-outlined p-button-custom"  
						label="전체"
						style={{
							width: '80px',
							height: '40px',
							backgroundColor: (filterMode === '전체')? '#00AA9C': '#333544',
							color: '#FFFFFFAA',
							border: '1px solid #333544'
						}}
						onClick={() => {
							setFilterMode('전체');
							onSearchAll();
						}}
					/>

					<Button 
						className="p-button-outlined p-button-custom"  
						label="진행중"
						style={{
							width: '80px',
							height: '40px',
							backgroundColor: (filterMode === '진행중')? '#00AA9C': '#333544',
							color: '#FFFFFFAA',
							border: '1px solid #333544'
						}}
						onClick={() => {
							setFilterMode('진행중');
							onSearchIng();
						}}
					/>
				</div>

				<div id={ViewSwitcherCss.period}>
					<Button 
						className="p-button-outlined p-button-custom"  
						label="Day"
						style={{
							width: '80px',
							height: '40px',
							backgroundColor: (viewMode === ViewMode.Day)? '#00AA9C': '#333544',
							color: '#FFFFFFAA',
							border: '1px solid #333544'
						}}
						onClick={() => {
							setViewMode(ViewMode.Day);
							onViewModeChange(ViewMode.Day);
						}}
					/>

					<Button 
						className="p-button-outlined p-button-custom"  
						label="Week"
						style={{
							width: '80px',
							height: '40px',
							backgroundColor: (viewMode === ViewMode.Week)? '#00AA9C': '#333544',
							color: '#FFFFFFAA',
							border: '1px solid #333544'
						}}
						onClick={() => {
							setViewMode(ViewMode.Week);
							onViewModeChange(ViewMode.Week);
						}}
					/>

					<Button 
						className="p-button-outlined p-button-custom"  
						label="Month"
						style={{
							width: '80px',
							height: '40px',
							backgroundColor: (viewMode === ViewMode.Month)? '#00AA9C': '#333544',
							color: '#FFFFFFAA',
							border: '1px solid #333544',
						}}
						onClick={() => {
							setViewMode(ViewMode.Month);
							onViewModeChange(ViewMode.Month);
						}}
					/>
				</div>

				<Button 
					className="p-button-outlined p-button-custom"  
					label="새 스프린트 생성"
					style={{
						width: '160px',
						height: '40px',
						color: '#FFFFFFAA',
						backgroundColor: '#00AA9C',
						border: '1px solid #333544'
					}}
					onClick={() => onShowInsert()}
				/>

				{/* toast */}
				<Toast ref={toast} position="top-right" />   
			</div>
			<div id={ViewSwitcherCss.searchResult}>
				<span>검색 결과 : </span>
				<span>{ searchMessage }</span>
			</div>
		</>
	);
};
