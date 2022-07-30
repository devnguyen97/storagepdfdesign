import React, { Component } from 'react';
// custom loader component
const AppContext = React.createContext({});
export const AppConsumer = AppContext.Consumer;
export class AppProvider extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            textLoading: ''
        };
        this.showProgress = this.showProgress.bind(this);
        this.hideProgress = this.hideProgress.bind(this);
    }

    hideProgress = () => this.setState({ loading: false, textLoading: '' })
    showProgress = (textLoading) => this.setState({ loading: true, textLoading: textLoading ? textLoading : this.state.textLoading })
    render() {
        const { loading, textLoading } = this.state;
        const funcs = {
            showLoader: this.showProgress,
            hideLoader: this.hideProgress
        };
        return (
            <AppContext.Provider
                value={{ ...funcs }}>
                {this.props.children}
            </AppContext.Provider>
        );
    }
}