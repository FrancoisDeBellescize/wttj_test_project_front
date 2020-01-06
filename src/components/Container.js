import React from 'react';
import {Socket} from 'phoenix';

import ListContainer from './ListContainer';

const socketOptions = {
  logger: (kind, msg, data) => { console.log(`${kind}: ${msg}`, data); },
};
const url = process.env.REACT_APP_BACK_URL ? process.env.REACT_APP_BACK_URL : 'ws://localhost:4000/socket';
console.log("Socket url", url);

let socket = new Socket(url, socketOptions)

socket.connect();

const channel = socket.channel("person:lobby", {});
channel.join()
  .receive("ok", resp => { console.log("Joined successfully", resp) })
  .receive("error", resp => { console.log("Unable to join", resp) })

export default class Container extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      name: '',
      items: {},
      columns: {
        'toMeet': {
          id: 'toMeet',
          title: 'À RENCONTRER',
          itemIds: []
        },
        'toNotMeet': {
          id: 'toNotMeet',
          title: 'ENTRETIEN',
          itemIds: []
        }
      },
      columnOrder: ['toMeet', 'toNotMeet']
    };

    this.updatePerson = this.updatePerson.bind(this)
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    channel.on('updatePersons', this.updateData);
  }

  updatePerson(id, source, destination) {
    let newArray = this.state.columns[destination.droppableId].itemIds;

    if (source.droppableId !== destination.droppableId) {
      const newSource = this.state.columns[source.droppableId].itemIds;
      const save = newSource[source.index];

      save.toMeet = !save.toMeet;
      newSource.splice(source.index, 1);
      newArray.splice(destination.index, 0, save);
    } else {
      const save = newArray[source.index];

      newArray.splice(source.index, 1);
      newArray.splice(destination.index, 0, save);
    }

    newArray.map((item, index) => item.position = index);
    console.log(newArray);

    channel.push("updatePersons", { persons: newArray });
  }

  updateData = payload => {
    const newState = {
      ...this.state,
      items: payload.persons
    }

    newState.columns['toMeet'].itemIds = payload.persons.filter(person => person.toMeet);
    newState.columns['toNotMeet'].itemIds = payload.persons.filter(person => !person.toMeet);

    this.setState(newState);
  }

  handleChange(event) {
    this.setState({ name: event.target.value });
  }

  handleSubmit(event) {
    event.preventDefault();
    if (this.state.name === '')
      return;

    channel.push("createPerson", { name: this.state.name });
    this.setState({ name: '' });
  }

  render() {
    return(
      <div>
        <form onSubmit={this.handleSubmit}>
          <input className="field" placeholder="Prénom" type="text" value={this.state.name} onChange={this.handleChange} />
          <input className="button" type="submit" value="Créer" />
        </form>
        <ListContainer channel={channel} items={this.state.items} columns={this.state.columns} columnOrder={this.state.columnOrder} updatePerson={this.updatePerson} />
      </div>
    )
  }
}
