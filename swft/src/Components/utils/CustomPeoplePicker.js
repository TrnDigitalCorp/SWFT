/*
 *  Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license.
 *  See LICENSE in the source repository root for complete license information.
 */

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {CompactPeoplePicker} from 'office-ui-fabric-react/lib/Pickers';
import {Persona, PersonaPresence} from 'office-ui-fabric-react/lib/Persona';
import {
    searchForPeople,
    getProfilePics,
    getPeople,
    getAuthenticatedClient,
} from '../../services/graph-service';
import CacheManager from '../../services/CachecManager';

const pickrClassName = {
    root: {
        width: '100%',
    },
};

export default class PeoplePicker extends Component {
    constructor() {
        super();
        // Set the initial state for the picker data source.
        // The people list is populated in the _onFilterChanged function.
        this._peopleList = null;
        this._searchResults = [];

        // Helper that uses the JavaScript SDK to communicate with Microsoft Graph.
        //this.sdkHelper = window.sdkHelper;
        const cacheAccountInfo = CacheManager.getCacheItem('accountInfo');
        let accountInfo = {},
            accessToken = '';
        try {
            accountInfo = JSON.parse(cacheAccountInfo.value);
            accessToken = accountInfo.jwtAccessToken
                ? accountInfo.jwtAccessToken
                : getAuthenticatedClient();
        } catch (err) {
            console.log('account Info error', err);
        }

        this.state = {
            selectedPeople: [],
            isLoadingPeople: true,
            isLoadingPics: true,
            accessToken: accessToken,
        };
    }
    componentDidMount() {
        const {selectedPeople} = this.props;
        this.setState({
            selectedPeople: this._mapUsersToPersonas(selectedPeople, true),
        });
    }
    getInitials = (displayName) => {
        let returnItials =  displayName.substring(0, 1);
        try {
            let dispSplitArr = displayName.split(' ');
            if(dispSplitArr.length>0){
                returnItials =   dispSplitArr[0].substring(0, 1) + dispSplitArr[dispSplitArr.length-1].substring(0, 1);
            }
        } catch (error) {
            console.log(error);
        }
        return  returnItials;
    }
    // Map user properties to persona properties.
    _mapUsersToPersonas(users, useMailProp) {
        return users.map(p => {
            // The email property is returned differently from the /users and /people endpoints.
            let email = useMailProp
                ? p.mail
                : p.scoredEmailAddresses[0].address;
            let persona = new Persona();

            persona.text = p.displayName;
            persona.secondaryText = email || p.userPrincipalName;
            persona.presence = PersonaPresence.none; // Presence isn't supported in Microsoft Graph yet
            persona.imageInitials =
                !!p.givenName && !!p.surname
                    ? p.givenName.substring(0, 1) + p.surname.substring(0, 1)
                    : this.getInitials(p.displayName);
            persona.initialsColor = Math.floor(Math.random() * 15) + 0;
            persona.props = {id: p.id, userPrincipalName: p.userPrincipalName};
            // this._getPics(persona);
            return persona;
        });
    }

    // Gets the profile photo for each user.
    async _getPics(persona) {
        // Make suggestions available before retrieving profile pics.
        this.setState({
            isLoadingPeople: false,
        });

        getProfilePics(persona, this.state.accessToken)
            .then()
            .catch(err => {
                console.log(err);
                this.setState({
                    isLoadingPics: false,
                });
            });
    }

    // Handler for when text is entered into the picker control.
    // Populate the people list.
    _onFilterChanged(filterText, items) {
        if (this._peopleList) {
            this.setState({
                isLoadingPeople: false,
            });
            return filterText
                ? this._peopleList
                      .concat(this._searchResults)
                      .filter(
                          item =>
                              item.text
                                  .toLowerCase()
                                  .indexOf(filterText.toLowerCase()) === 0,
                      )
                      .filter(item => !this._listContainsPersona(item, items))
                : [];
        } else {
            // return (async (resolve, reject) => await getPeople((err, people) => {
            return new Promise(resolve =>
                getPeople(this.state.accessToken)
                    .then(people => {
                        this._peopleList = this._mapUsersToPersonas(
                            people,
                            false,
                        );
                        this.setState({
                            isLoadingPeople: false,
                        });
                        resolve(this._peopleList);
                    })
                    .catch(() => {
                        // this._showError(err);
                    }),
            ).then(value =>
                value
                    .concat(this._searchResults)
                    .filter(
                        item =>
                            item.text
                                .toLowerCase()
                                .indexOf(filterText.toLowerCase()) === 0,
                    )
                    .filter(item => !this._listContainsPersona(item, items)),
            );
        }
    }

    // Remove currently selected people from the suggestions list.
    _listContainsPersona(persona, items) {
        if (!items || !items.length || items.length === 0) {
            return false;
        }
        return items.filter(item => item.text === persona.text).length > 0;
    }

    // Handler for when the Search button is clicked.
    // This sample returns the first 20 matches as suggestions.
    _onGetMoreResults(searchText) {
        this.setState({
            isLoadingPeople: false,
            isLoadingPics: true,
        });
        if (searchText.length === 0) {
            return;
        }
        return new Promise(resolve => {
            searchForPeople(searchText.toLowerCase(), this.state.accessToken)
                .then(people => {
                    //if (!err) {
                    this._searchResults = this._mapUsersToPersonas(
                        people,
                        true,
                    );
                    this.setState({
                        isLoadingPeople: false,
                    });
                    // this._getPics(this._searchResults);
                    resolve(this._searchResults);
                    // }
                })
                .catch(err => {
                    console.log(err);
                    // this._showError(err);
                });
        });
    }

    // Handler for when the selection changes in the picker control.
    // This sample updates the list of selected people and clears any messages.
    _onSelectionChanged(items) {
        // console.log(items);
        this.setState({
            result: null,
            selectedPeople: items,
        });
        this.props.updateSelection(items);
    }

    // Renders the people picker using the NormalPeoplePicker template.
    render() {
        const {placeholderTxt,disabled,description} = this.props;
        return (
            <>
                <CompactPeoplePicker
                    onResolveSuggestions={this._onFilterChanged.bind(this)}
                    pickerSuggestionsProps={{
                        suggestionsHeaderText: 'Suggested People',
                        noResultsFoundText: 'No results found',
                        searchForMoreText: 'Search',
                        searchingText: 'Searching more...',
                        loadingText: 'Loading...',
                        isLoading: this.state.isLoadingPeople,
                    }}
                    inputProps={{placeholder: placeholderTxt}}
                    itemLimit={1}
                    selectedItems={this.state.selectedPeople}
                    getTextFromItem={persona => persona.text}
                    onChange={this._onSelectionChanged.bind(this)}
                    onGetMoreResults={this._onGetMoreResults.bind(this)}
                    key="normal-people-picker"
                    styles={pickrClassName}
                    disabled={disabled}
                />
            </>
        );
    }
}
PeoplePicker.propTypes = {
    updateSelection: PropTypes.func,
    disabled: PropTypes.bool,
    selectedPeople: PropTypes.array,
    placeholderTxt: PropTypes.string,
    description: PropTypes.string,
};
