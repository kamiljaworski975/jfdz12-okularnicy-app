import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Image, List, Segment, Loader, Dimmer } from 'semantic-ui-react';

import SelectType from '../select/Select';
import { ItemSearchInput } from '../input/Input'
import { RadioSelect } from '../radio/Radio';
import { getItems } from '../api/items';
import { AddToList } from '../user-list/AddToList';

import "./Main-list.css"


export default class MainList extends React.Component {
    state = {
        typeFilter: 11,
        search: '',
        sortBy: '',
        items: [],
        loading: true,
        error: null
    }

    componentDidMount() {
        this.fetchItems()
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const filtersChanged = prevState.typeFilter !== this.state.typeFilter;
        const searchChanged = prevState.search !== this.state.search;
        const sortByChanged = prevState.sortBy !== this.state.sortBy;
        if (
            (
                filtersChanged || searchChanged || sortByChanged
            ) && !this.state.isLoading
        ) {
            this.fetchItems();
        }
    }

    handleSearchChange = (e) => {
        this.setState({
            search: e.target.value.toLowerCase(),
        });
    }

    handleTypeChange = (e, data) => {
        this.setState({
            typeFilter: data.value,
        })
    }

    handleRadioChange = (e, data) => {
        this.setState({
            sortBy: data.value,
        })
    }

    fetchItems() {
        this.setState({
            loading: true,
            error: '',
        }, () => {
            getItems({
                search: this.state.search,
                typeFilter: this.state.typeFilter,
                sortBy: this.state.sortBy,
            })
                .then(data => {
                    this.setState({
                        items: data,
                        loading: false,
                    });
                })
                .catch((error) => {
                    this.setState({
                        error: error.toString(),
                    });
                });
        });
    }


    render() {
        if (this.state.loading) {
            return (
                <Segment>
                    <Dimmer active inverted>
                        <Loader size='large'>Loading</Loader>
                    </Dimmer>
                    <Image src='https://react.semantic-ui.com/images/wireframe/paragraph.png' />
                </Segment>)
        }
        if (this.state.error) {
            return <h1>"An error occured"</h1>
        }
        return <>
            <h1> What you need ? ;)</h1>

            <Segment.Group horizontal className="filters">
                <Segment className="filter">
                    <ItemSearchInput
                        value={this.state.search}
                        onChange={this.handleSearchChange} />
                </Segment>
                <Segment className="filter">
                    <RadioSelect
                        value={this.state.sortBy}
                        onChange={this.handleRadioChange}
                    />
                </Segment>
                <Segment className="filter">
                    <SelectType
                        value={this.state.typeFilter}
                        onChange={this.handleTypeChange} />
                </Segment>
            </Segment.Group>
            <List divided>
                {
                    this.state.items.map(item => (
                        <List.Item key={item.id}>
                            <List.Content floated='right'>
                                <AddToList itemId={item.id} iconic={true} />
                            </List.Content>
                            <List.Content>
                                <Link to={{
                                    pathname: `/items/${item.id}`,
                                    state: {
                                        item
                                    }
                                }}>
                                    <List.Header>{item.img}{item.name}</List.Header>
                                    <List.Description>{item.description}</List.Description>
                                </Link>
                            </List.Content>
                        </List.Item>
                    ))
                }
                <List.Item>
                    <Link to="/item-add">
                        <Button fluid>Missed?</Button>
                    </Link>
                </List.Item>
            </List>
        </>
    }
}