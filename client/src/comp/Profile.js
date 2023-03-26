import React from 'react';
import socketIO from 'socket.io-client'
import '../styles/Profile.css';

class Profile extends React.Component {

    state = {
        innerWidth : window.innerWidth,
        workerStatus : undefined
    }
    componentDidMount() {
        window.addEventListener("resize",  () => {
            this.setState({innerWidth: window.innerWidth});
        }, false);

        // add webSocket
        const serverUrl = window.location.origin.split(':')[1];
        const socket = this.socket = socketIO.connect(serverUrl, {transports: ['websocket']}, {'reconnectionAttempts': 5});
        socket.on('connect',  () => {
            //console.log(...this.console_title, ` CONNECT`);
            socket.emit(`request-server-status`, this.props.TITLE);
        });
        socket.on('connect_failed', () => {
            //console.log(...this.console_title, ` CONNECT FAIL`)
        });
        socket.on('reconnect_failed', () => {
            //console.log(...this.console_title, ` RECONNECT FAIL`)
        });
        socket.on(`response`, async (realTimeData) => {
            this.setState({workerStatus : realTimeData});
        });
    }

    refersh = () => {
        this.socket.emit(`request-server-status`, this.props.TITLE);
    }

    render() {
        let state = this.state;
        let workerGrid = function () {
            console.log(state);
            let workerStatus = state.workerStatus;
            let [header, body] = ``;
            if (workerStatus) {
                header = <div className={`row attribute`}>
                    <div className={"cell title attribute"}> workerName </div>
                    <div className={"cell time-stamp attribute"}> lastReceivedTime </div>
                </div>;

                body = Object.keys(workerStatus).map(workerName => {
                    let timeout = 5 * 60 * 1000;
                    let lastReceivedTime = workerStatus[workerName].timeStamp;
                    let isDelayOver = new Date().valueOf() - lastReceivedTime >= timeout? "delayed" : "";
                    return <div className={`row ${workerName}`}>
                        <div className={"cell title"}> @{workerName} </div>
                        <div className={"cell time-stamp "+isDelayOver}> {new Date(workerStatus[workerName].timeStamp).toLocaleString().replace(/ /g, '')} </div>
                    </div>
                });
            }
            return <div className={"worker-status-table"}>
                {header}
                {body}
            </div>;
        }

        return (
            <div>{workerGrid()}</div>
        )
    }
}
export default Profile;
