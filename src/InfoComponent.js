import React from "react";
import {Button, Col, ControlLabel, Form, FormControl, FormGroup, PageHeader} from "react-bootstrap";

export default class InfoComponent extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.props = props;
        if (props.item) {
            this.state = {
                active: true,
                id: props.item.id || undefined,
                title: props.item.title || '',
                note: props.item.note || '',
                createDate: props.item.createDate || '',
                done: props.item.done || false,
                userId: props.item.userId || '',
                valid: false
            };
        } else {
            this.state = {
                active: false,
                id: undefined,
                title: undefined,
                note: undefined,
                createDate: undefined,
                done: false,
                userId: undefined,
                valid: false
            };
        }
        this.cancel = this.cancel.bind(this);
        this.validToDo = this.validToDo.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

    }


    componentWillReceiveProps(props) {
        if (props.item) {
            this.setState({
                active: true,
                id: props.item.id || undefined,
                title: props.item.title || '',
                note: props.item.note || '',
                createDate: props.item.createDate || '',
                done: props.item.done || false,
                userId: props.item.userId || '',
                valid: this.validToDo()
            });
        } else {
            this.setState({
                active: false,
                id: undefined,
                title: undefined,
                note: undefined,
                createDate: undefined,
                done: false,
                userId: undefined,
                valid: false
            });
        }
    }

    handleChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        const fields = ['title', 'note', 'done'];

        if (fields.includes(name)) {
            this.setState({
                [name]: value
            });
        }
        this.validToDo();
    }

    handleSubmit(event) {
        event.preventDefault();
        let formData = {
            id: this.state.id,
            title: this.state.title.trim(),
            note: this.state.note,
            createDate: this.state.createDate,
            done: this.state.done,
            userId: this.state.userId
        };
        this.props.saveItem(formData);
    }

    cancel() {
        this.setState({
            title: this.props.item.title || '',
            note: this.props.item.note || '',
            createDate: this.props.item.createDate || '',
            valid: false
        });
    }

    validToDo() {
        if (this.state.title && this.state.title.trim().length > 0) {
            this.setState({valid: true});
        } else {
            this.setState({valid: false});
        }
    }

    validForm() {
        if (this.state.title) {
            return 'success'
        }
    }

    render() {

        if (this.state.active) {
            return (
                <div className='Info'>
                    <PageHeader>{this.state.title}</PageHeader>
                    <Form horizontal onSubmit={this.handleSubmit}>
                        <FormGroup role='form' validationState={this.validForm()}>
                            <Col componentClass={ControlLabel} sm={2}>
                                Title
                            </Col>
                            <Col sm={10}>
                                <FormControl type='text'
                                             placeholder='title'
                                             name='title'
                                             id='title'
                                             ref='title'
                                             value={this.state.title}
                                             onChange={this.handleChange}/>
                            </Col>
                        </FormGroup>
                        <FormGroup role='form'>
                            <Col componentClass={ControlLabel} sm={2}>
                                Note
                            </Col>
                            <Col sm={10}>
                                <FormControl componentClass='textarea'
                                             placeholder='what do you actually mean'
                                             name='note'
                                             id='note'
                                             ref='note'
                                             value={this.state.note}
                                             onChange={this.handleChange}/>
                            </Col>
                        </FormGroup>
                        <FormGroup role='form'>
                            <Col componentClass={ControlLabel} sm={2}>
                                create date
                            </Col>
                            <Col sm={10}>
                                <FormControl type='text'
                                             id='createDate'
                                             ref='createDate'
                                             value={this.state.createDate}
                                             disabled/>
                            </Col>
                        </FormGroup>
                        <FormGroup role='form'>
                            <Col componentClass={ControlLabel} sm={2}>
                                Done
                            </Col>
                            <Col sm={10}>
                                <FormControl type='checkbox'
                                             id='done'
                                             ref='done'
                                             name='done'
                                             value={this.state.done}
                                             onChange={this.handleChange}
                                             checked={this.state.done}
                                />
                            </Col>
                        </FormGroup>
                        <FormGroup role='form'>
                            <Col sm={6}>
                                <Button onClick={this.cancel}>cancel</Button>
                            </Col>
                            <Col sm={6}>
                                <Button type='submit' disabled={!this.state.valid}>Save</Button>
                            </Col>
                        </FormGroup>
                    </Form>;
                </div>
            );
        }
        return (<div className='Info'><PageHeader>Info will show here</PageHeader></div>);
    }
}