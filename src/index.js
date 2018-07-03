import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Info from './InfoComponent'
import {Button, ListGroup, ListGroupItem} from 'react-bootstrap'
import registerServiceWorker from './registerServiceWorker';


function List(props) {
    let items;
    if (props && props.list) {
        items = props.list.map((data) => {
            const desc = data.title;
            return <ListGroupItem key={data.id} className='ToDoItem' onClick={() => {
                props.itemSelected(data);
            }}>
                {desc}
            </ListGroupItem>;
        });
    }

    return (
        <div className='List'>
            <Button bsSize='large' block className='ToDoItem' onClick={props.newItem}>
                ADD NEW TODO
            </Button>
            <div className='ListItems'>
                <ListGroup>
                    {items}
                </ListGroup>
            </div>
        </div>
    )
}

class ToDo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            count: 0,
            userId: '5b38ff6569edbd3bb5c3d263',
            selected: null,
            list: []

        };
        this.newItem = this.newItem.bind(this);
        this.itemSelected = this.itemSelected.bind(this);
        this.addItem = this.addItem.bind(this);
    }

    componentDidMount() {
        fetch(`/todo/${this.state.userId}`, {method: 'get'})
            .then(response => {
                console.log(response);
                return response.json();
            })
            .then(data => this.setState({list: data}));
    }

    itemSelected(item) {
        const selectedItem = Object.assign({
            id: '',
            title: '',
            note: '',
            createDate: '',
            done: false,
            userId: this.state.userId
        }, item);
        this.setState({
            selected: selectedItem
        });
    }

    newItem() {
        this.setState({
            selected: {
                title: '',
                note: '',
                createDate: new Date(),
                done: false,
                userId: this.state.userId
            },
        });
    }

    b64Encode(str) {
        // first we use encodeURIComponent to get percent-encoded UTF-8,
        // then we convert the percent encodings into raw bytes which
        // can be fed into btoa.
        return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g,
            function toSolidBytes(match, p1) {
                return String.fromCharCode('0x' + p1);
            }));
    }

    addItem(item) {
        let list;
        let update;
        if (!item.id) {
            let id = item.createDate + item.title;
            id = this.b64Encode(id);
            item.id = id;
            list = this.state.list.concat([item]);
            console.log("add new item");
            console.log(item);
            update = fetch('/todo/add', {
                method: 'POST',
                body: JSON.stringify(item),
                headers: {
                    'user-agent': 'Mozilla/4.0 MDN Example',
                    'content-type': 'application/json'
                },
                mode: 'cors',
            });

        } else {
            list = this.state.list.slice();
            let idx = list.findIndex((iterItem) => {
                return (iterItem.id === item.id)
            });
            list[idx] = item;
            console.log(item);
            update = fetch(`/todo/update/${item.id}`, {
                method: 'PUT',
                body: JSON.stringify(item),
                headers: {
                    'user-agent': 'Mozilla/4.0 MDN Example',
                    'content-type': 'application/json'
                },
                mode: 'cors',
            });
        }
        update.then(() => {
            this.setState({
                list: list,
                selected: undefined
            })
        });
    }

    render() {
        return (
            <div className='pane'>

                <List itemSelected={this.itemSelected}
                      newItem={this.newItem}
                      list={this.state.list}
                      add={this.add}
                      count={this.state.count}
                />
                <Info item={this.state.selected}
                      addItem={this.addItem}
                />
            </div>
        );
    }
}

// ========================================

ReactDOM.render(
    <ToDo/>,
    document.getElementById('root')
);
registerServiceWorker();