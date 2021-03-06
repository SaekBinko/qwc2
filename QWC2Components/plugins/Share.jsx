/**
 * Copyright 2016, Sourcepole AG.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react')
const axios = require('axios');
const Message = require('../../MapStore2/web/client/components/I18N/Message');
const ShareSocials = require('../../MapStore2/web/client/components/share/ShareSocials');
const ShareQRCode = require('../../MapStore2/web/client/components/share/ShareQRCode');
const ConfigUtils = require('../../MapStore2/web/client/utils/ConfigUtils');
const ShareLink = require('../components/ShareLink');
const {SideBar} = require('../components/SideBar');
require('./style/Share.css');

const Share = React.createClass({
    propTypes: {
        showSocials: React.PropTypes.bool,
        showLink: React.PropTypes.bool,
        showQRCode: React.PropTypes.bool
    },
    getDefaultProps() {
        return {
            showSocials: true,
            showLink: true,
            showQRCode: true
        }
    },
    getInitialState() {
        return {location: null};
    },
    onShow() {
        let serverUrl = ConfigUtils.getConfigProp("qwc2serverUrl");
        if(serverUrl) {
            this.setState({location: null});
            axios.get(ConfigUtils.getConfigProp("qwc2serverUrl") + "/createpermalink?url=" + encodeURIComponent(window.location.href))
            .then(response => this.setState({location: response.data.permalink}));
        } else {
            this.setState({location: window.location.href});
        }
    },
    renderBody() {
        if(this.state.location) {
            const shareSocials = this.props.showSocials ? <ShareSocials shareUrl={this.state.location} shareTitle="QWC2" getCount={this.props.getCount}/> : null;
            const shareLink = this.props.showLink ? <ShareLink shareUrl={this.state.location}/> : null;
            const shareQRCode = this.props.showQRCode ? <ShareQRCode shareUrl={this.state.location}/> : null;
            return (
                <div role="body" className="scrollable">
                    {shareSocials}
                    {shareLink}
                    {shareQRCode}
                </div>
            );
        } else {
            return (
                <div style={{padding: "1em"}} role="body">
                    <Message msgId="share.generatingpermalink" />
                </div>);
        }
    },
    render() {
        let assetsPath = ConfigUtils.getConfigProp("assetsPath");
        return (
            <SideBar id="Share" onShow={this.onShow} width="20em"
                title="appmenu.items.Share" icon={assetsPath + "/img/share_white.svg"}>
                {this.renderBody()}
            </SideBar>
        );
    }
});

module.exports = {
    SharePlugin: Share,
    reducers: {
        task: require('../reducers/task')
    }
}
