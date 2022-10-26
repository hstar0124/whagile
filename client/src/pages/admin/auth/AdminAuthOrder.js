import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { UPDATE_AUTH_ORDER } from "../../../modules/AuthOrderModule";

const reorder = (list, startIndex, endIndex) => {
	
	const result = Array.from(list);
	const [removed] = result.splice(startIndex, 1);
	result.splice(endIndex, 0, removed);

	return result;
};

const grid = 8;

const getItemStyle = (isDragging, draggableStyle, isSelected) => ({
  
	userSelect: "none",
	padding: grid * 2,
	margin: `0 0 ${grid}px 0`,
	background: isDragging ? "#1B1A20" : "#1D1E27",
	border: isDragging? "1px solid #eb9a9c": (isSelected? "1px solid #00AA9C": "1px solid #3e4053"),
	borderLeft: isDragging? "7px solid #eb9a9c": (isSelected? "7px solid #00AA9C": "7px solid #3e4053"),
	borderRadius: "10px",
	minHeight: "50px",

	...draggableStyle
});

const getListStyle = isDraggingOver => ({

	background: "#282936",
	padding: grid,
	width: '100%',
});

function AdminAuthOrder({selectedCode}) {
  
	const [items, setItems] = useState([]);
	const authOrder = useSelector(state => state.authOrderReducer); // api에서 가져온 권한목록(순서 수정을 위함)
	const dispatch = useDispatch();

	useEffect(
		() => {

			setItems(authOrder);
		},
		[]
	);

	useEffect(
		() => {

			dispatch({
				type: UPDATE_AUTH_ORDER,
				payload: items
			});
		},
		[items]
	);

	const onDragEnd = (result) => {
		
		if (!result.destination) {
			return;
		}

		setItems(reorder(
			items,
			result.source.index,
			result.destination.index
		));
	}

	return (
		<DragDropContext onDragEnd={onDragEnd}>
			<Droppable droppableId="droppable">
				{(provided, snapshot) => (
					<div
						{...provided.droppableProps}
						ref={provided.innerRef}
						style={getListStyle(snapshot.isDraggingOver)}
					>
						{items.map((item, index) => (
							<Draggable 
								key={item.authorityCode.toString()} 
								draggableId={item.authorityCode.toString()}
								index={index}
							>
								{(provided, snapshot) => (
									<div ref={provided.innerRef}
										{...provided.draggableProps}
										{...provided.dragHandleProps}
										style={            
											getItemStyle(
												snapshot.isDragging,
												provided.draggableProps.style,
												(item.authorityCode === selectedCode) || (item.authorityCode.toString().includes('-')) 
												/* 권한 수정 || 권한 등록 */
											)
										}
									>
										{item.authorityName}
										<i className="pi pi-fw pi-bars" style={{float: 'right'}}></i>
									</div>
								)}
							</Draggable>
						))}
						{provided.placeholder}
					</div>
				)}
			</Droppable>
		</DragDropContext>
	);
}

export default AdminAuthOrder;