import React from 'react';
import { Draggable } from 'react-beautiful-dnd';

export default class Person extends React.Component {
  deletePerson(id) {
    console.log("Deleting", id);
    this.props.channel.push("deletePerson", { id });
  }

  render() {
    return (
      <Draggable draggableId={this.props.item.id.toString()} index={this.props.index}>
      {(provided, snapshot) => (
        <div
            className='personCard'
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
        >
            <img className='personImage' alt="profile" src={`https://robohash.org/${this.props.item.id}?set=set3`} />
            <h4 className='personName'>{this.props.item.name}</h4>
            <button className='closeButton' onClick={() => this.deletePerson(this.props.item.id)}>
              X
            </button>
        </div>
      )}
      </Draggable>
    )
  }
}
