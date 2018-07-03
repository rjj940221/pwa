import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Info from './InfoComponent'
import {Button, ListGroup, ListGroupItem} from 'react-bootstrap'
import registerServiceWorker from './registerServiceWorker';
import idb from 'idb';

const dbPromise = idb.open('toDo', 1, upgradeDB => {
    if (!upgradeDB.objectStoreNames.contains('addItems')) {
        upgradeDB.createObjectStore('addItems', {keyPath: 'id'});
    }
    if (!upgradeDB.objectStoreNames.contains('updateItems')) {
        upgradeDB.createObjectStore('updateItems', {keyPath: 'id'});
    }
});

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
            <Button bsSize='large' block className='ToDoItem' onClick={props.refresh}>
                refresh
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
        this.saveItem = this.saveItem.bind(this);
        this.fetchList = this.fetchList.bind(this);

        if ('serviceWorker' in navigator){
            console.log('service worker');
            if ('SyncManager' in window){
                console.log('sync manager');
            }
        }
    }

    componentDidMount() {
        this.fetchList();
    }

    fetchList() {
        fetch(`/todo/${this.state.userId}`, {method: 'get'})
            .then(response => {
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

    saveItem(item) {
        let list;
        let update;
        if (!item.id) {
            let id = item.createDate + item.title;
            id = this.b64Encode(id);
            item.id = id;
            list = this.state.list.concat([item]);

            const req = {
                method: 'POST',
                body: JSON.stringify(item),
                headers: {
                    'content-type': 'application/json',
                    'user-agent': 'Mozilla/4.0 MDN Example',
                },
                mode: 'cors',
            };

            if ('serviceWorker' in navigator && 'SyncManager' in window) {
                console.log('adding data to index db and creating sync');
                update = dbPromise.then(db => {
                    const tx = db.transaction('addItems', 'readwrite');
                    tx.objectStore('addItems').put(item);
                    return tx.complete;
                }).then(() => navigator.serviceWorker.ready).then(function (reg) {
                    return reg.sync.register('add-item-tag');
                }).catch(function () {
                    return fetch('/todo/add', req);
                });
            } else {
                update = fetch('/todo/add', req);
            }


        } else {
            list = this.state.list.slice();
            let idx = list.findIndex((iterItem) => {
                return (iterItem.id === item.id)
            });
            list[idx] = item;
            update = fetch(`/todo/update/${item.id}`, {
                method: 'PUT',
                body: JSON.stringify(item),
                headers: {
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
                      refresh={this.fetchList}
                />
                <Info item={this.state.selected}
                      saveItem={this.saveItem}
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