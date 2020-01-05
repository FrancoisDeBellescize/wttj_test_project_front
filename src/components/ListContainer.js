import React, { Component } from "react";
import { DragDropContext, Droppable } from "react-beautiful-dnd";

import Person from './Person';

export default class ListContainer extends Component {

  onDragEnd = result => {
    const { destination, source, draggableId } = result;

    if (!destination) {
      return;
    } else if (destination.droppableId === source.droppableId &&
    destination.index === source.index) {
      return;
    }

    this.props.updatePerson(draggableId, source, destination);
  }

  render() {
    return (
      <DragDropContext onDragEnd={this.onDragEnd}>
        <div className="columnWrapper">
          {this.props.columnOrder.map(columnId => {
            const column = this.props.columns[columnId];

            return (
              <Droppable key={columnId} droppableId={columnId}>
              {(provided, snapshot) => (
                <div
                  className="column"
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  <div className="columnNameWrapper">
                    <h2 className="columnName">{column.title}</h2>
                    <div className="columnArraySize">{column.itemIds.length}</div>
                  </div>
                  {column.itemIds.map((item, index) => (
                    <Person channel={this.props.channel} key={item.id} index={index} item={item}/>
                  ))}
                  {provided.placeholder}
                </div>
              )}
              </Droppable>
            )
          })}
        </div>
      </DragDropContext>
    );
  }
}
