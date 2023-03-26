import React from 'react';
import Modal from 'react-modal';
import socketIO from 'socket.io-client'
import '../styles/Quick.css';
import notiSound_1 from '../sounds/noti_1.mp3';
import notiSound_2 from '../sounds/noti_2.mp3';
import itemIconPlaceholder from '../images/itemIconPlaceholder.png';

function AddComma(param, nvl) {
    // add NVL
    if (param === 0 && nvl !== undefined) return nvl;
    return Number(param).toLocaleString('en');
}
async function delay (time) {
    console.log("delay");
    return await new Promise(res => setTimeout(res, time));
};

class RealtimeSearch extends React.Component {

    state = {
        //DATA
        snapshot : {},
        prevSnapshot : {},

        overview : {},
        prevOverview : {},

        cuttline : 6700000,
        timeStamp : 0,

        //CSS OPTION
        "--showAttributeRow" : false,
        downloadProgress : '--idle',
        innerWidth : window.innerWidth,
        modalisOpen : false,

        //COMP OPTION
        tempAlramVar : 0,
        messageBox : []
    };

    socket = '';
    timeoutIDs = new Map();
    timeoutID = undefined;
    timeoutID2 = undefined;
    console_title = 'title_placeholder';
    defaultReferencePrice = 1000000;

    //🔌
    componentDidMount () {
        let that = this;
        document.querySelector("body").addEventListener("mouseover", function (e) {
            if (e.target.classList.contains("receive-tm")) {
                console.log(new Date(that.state.timeStamp));
            }
        });

        this.console_title = [`%c@${this.props.TITLE}`, 'background: #222; color: #bada55'];
        console.log(...this.console_title, ` MOUNT`);
        
        // avoiding speech not assigned voice when first time
        this.toTTS(" "); 
        window.addEventListener("resize",  () => {
            this.setState({innerWidth: window.innerWidth});
        }, false);

        if ( localStorage.getItem(this.props.TITLE) === null ) localStorage.setItem(this.props.TITLE, this.defaultReferencePrice);
        else this.setState({cuttline : localStorage.getItem(this.props.TITLE)});

        const serverUrl = window.location.origin.split(':')[1];
        const socket = this.socket = socketIO.connect(serverUrl, {transports: ['websocket']}, {'reconnectionAttempts': 5});



        // TODO:SOCKET CONNECT() IS ASYNC FUNCTION. IF BELOW CODE IS REACHED WHEN BEFORE CONNECT IS ESTABILISHED
        // TODO:SOCKET IO INSERT THIS EMIT() IN QUEUE AND RUN AFTER ESTABILISHED?
        socket.on('connect',  () => {
            console.log(...this.console_title, ` CONNECT`);
            socket.emit(`request_data_from_client`, this.props.TITLE);
        });    
        socket.on('connect_failed', () => {
            console.log(...this.console_title, ` CONNECT FAIL`)
        });
        socket.on('reconnect_failed', () => {
            console.log(...this.console_title, ` RECONNECT FAIL`)
        });

        socket.on(`snapshot`, async (received_snapshot, timeStamp) => {
            if(!window.location.origin.includes('localhost') && this.state.timeStamp !== 0) await delay(2000);

            let viewerConsole = document.querySelector(`.${this.props.TITLE} .viewer-status`);
            let timeDiff = Math.abs(timeStamp - new Date().valueOf());

            viewerConsole.classList.remove("--idle", "--receiveOldData");
            viewerConsole.classList.add("--downloadComplete");

            // timer for viewer-console css
            if(that.timeoutID) clearTimeout(this.timeoutID);
            that.timeoutID = setTimeout(()=> {
                let a = document.querySelector(`.${this.props.TITLE} .viewer-status`);
                if (!a) return;
                viewerConsole.classList.remove("--downloadComplete");
                viewerConsole.classList.add("--idle");
            }, 4000);
            if(timeDiff > 180000) {
                viewerConsole.classList.add("--receiveOldData");
                this.pushMessage(`마지막 데이터를 수신한 지 3분 이상 경과하였습니다`, 5000, '⚠️');
            }

            //timer for no-data while 60s
            if(that.timeoutID2) clearTimeout(this.timeoutID2);
            that.timeoutID2 = setTimeout(()=> {
                let a = document.querySelector(`.${this.props.TITLE} .viewer-status`);
                if (!a) return;
                viewerConsole.classList.add("--receiveOldData");
            }, 180000);

            let snapshot = received_snapshot;
            let prevSnapshot = this.state.snapshot;
            let prevOverview = this.state.overview;
            let isPrevSnapshotExist = Object.keys(this.state.prevSnapshot).length !== 0;

            // re-sorting (for merged columss)
            Object.keys(snapshot).forEach((elem, idx) => {
                if (Array.isArray(snapshot[elem])) snapshot[elem].sort((a, b) =>  a.unitPrice - b.unitPrice);
            });

            // make snapshot's overview
            let overview = Object.keys(snapshot).reduce((acc, itemName) => {
                acc[itemName] = {};

                let cheapestItem = snapshot[itemName][0] || {};
                acc[itemName].cheapest = snapshot[itemName][0];
                acc[itemName].quantity = snapshot[itemName].reduce((acc, cuv) => acc + cuv.count, 0);
                acc[itemName].cheapestPrice = cheapestItem.unitPrice || 0;
                acc[itemName].auctionNo = cheapestItem.auctionNo;

                return acc;
            }, {});

            if(!isPrevSnapshotExist) {
                prevSnapshot = snapshot;
                prevOverview = overview;
            }
            this.setState({
                snapshot : snapshot,
                prevSnapshot: prevSnapshot,

                overview : overview,
                prevOverview : prevOverview,

                timeStamp : timeStamp,
            }, this.notiCallback);
        });
    }

    componentWillUnmount = () => {
        console.log(...this.console_title, ` UNMOUNT`);
        if(this.timeoutID) clearTimeout(this.timeoutID);
        if(this.timeoutID2) clearTimeout(this.timeoutID2);
        this.socket.disconnect();
    };


    componentDidUpdate(prevProps, prevState, snapshot) {
        if(Object.keys(this.state.snapshot).length === 0) return;
        let viewerTitle = this.props.OPTION.title;
        let viewerType = this.props.OPTION.type;
        let viewerTarget = this.props.OPTION.target;
        let currState = this.state;
        let overview = currState.overview;
        let prevOverview = this.state.prevOverview; // it's differnet prevState.overview. state change enyy;.
        let isNotify = false;

        if( viewerType === 'package') {
            let [ _package, _contents, _avatarBox ] = [ viewerTarget.package, viewerTarget.packageContents, viewerTarget.packageAvatarBox ];
            let packagePrice = overview[_package].cheapestPrice;
            let contentsPrice = _contents.reduce((acc,cuv)=> acc + overview[cuv].cheapestPrice, 0);
            let avatarBoxPrice;
            let calculatedPrice = 1*packagePrice - 0.97*contentsPrice;

            let isPackageExist = overview[_package].auctionNo !== undefined;
            let isPackageHasAvatarBox = viewerTarget.packageAvatarBox !== undefined;

            // set Color package-Row
            if (isPackageExist) {
                let rowElement = document.querySelector(`.${viewerTitle}`)?.querySelector(`[data-itemname="${_package}"]`)
                if (this.isOverCuttLine(calculatedPrice) && rowElement) {
                    rowElement.classList.add('--red');
                } else rowElement.classList.remove('--red');
            }

            // set Color packageAvatarBox-Row
            if(isPackageHasAvatarBox) {
                avatarBoxPrice = overview[_avatarBox].cheapestPrice;
                let rowElement = document.querySelector(`.${viewerTitle}`)?.querySelector(`[data-itemname="${_avatarBox}"]`);
                if (this.isOverCuttLine(avatarBoxPrice) && rowElement) {
                    rowElement.classList.add('--red');
                } else rowElement.classList.remove('--red');
            }

            // when getting new snapshot, compare targets
            let isNewSnapshot = (prevState.timeStamp !== currState.timeStamp) && prevState.timeStamp !== 0;
            if (isNewSnapshot && overview[_package].auctionNo !== undefined && this.state.prevOverview[_package].auctionNo !== undefined) {

                let isSamePackage = _package !== undefined && (overview[_package]?.auctionNo === prevOverview[_package]?.auctionNo);
                let isSameAvatarBox =  _avatarBox !== undefined && (overview[_avatarBox]?.auctionNo === prevOverview[_avatarBox]?.auctionNo);

                if( (calculatedPrice <= this.state.cuttline) && !isSamePackage && (overview[_package].auctionNo !== undefined) && (prevOverview[_package].auctionNo !== undefined) ) {
                    let itemName = overview[_package].cheapest.itemName;
                    let price = ' ' + overview[_package].cheapestPrice;
                    let count = ' ' + overview[_package].cheapest.count + '개 ';
                    this.toTTS(itemName + count + price);
                }
                if ( (avatarBoxPrice <= this.state.cuttline) && !isSameAvatarBox && (overview[_avatarBox].auctionNo !== undefined) && (prevOverview[_avatarBox].auctionNo !== undefined) ) {
                    console.log(this.state);
                    let itemName = overview[_avatarBox].cheapest.itemName;
                    let price = ' ' + overview[_avatarBox].cheapestPrice;
                    let count = ' ' + overview[_avatarBox].cheapest.count + '개 ';
                    this.toTTS(itemName + count + price);
                }

                isNotify = ((calculatedPrice <= this.state.cuttline) || (avatarBoxPrice <= this.state.cuttline)) && (overview[_package].cheapestPrice !== 0) && (avatarBoxPrice !== 0) && this.state.tempAlramVar === 0;
            }
        }

        if( viewerType === 'watch') {
            if (overview[viewerTarget].auctionNo === undefined) return;
            let _watchTarget = viewerTarget;
            let itemName = overview[_watchTarget].cheapest.itemName;
            let isSameItem = overview[_watchTarget].auctionNo === prevOverview[_watchTarget].auctionNo;
            let price = overview[_watchTarget].cheapestPrice;

            if (this.isOverCuttLine(price)) {
                // eslint-disable-next-line no-unused-expressions
                document.querySelector(`.${_watchTarget}`)?.querySelector(`[data-itemname="${_watchTarget}"]`).classList.add('--red');
            }
            else {
                // eslint-disable-next-line no-unused-expressions
                document.querySelector(`.${_watchTarget}`)?.querySelector(`[data-itemname="${viewerTarget}"]`).classList.remove('--red');
            }

            if ( (price <= this.state.cuttline) && !isSameItem && (prevState.timeStamp !== this.state.timeStamp) ) {
                this.toTTS(itemName + ' ' + price);
            }
            isNotify = (prevState.timeStamp !== this.state.timeStamp) &&(price <= this.state.cuttline) && (this.state.tempAlramVar === 0);
        }

        if(isNotify) {
            console.log(...this.console_title, ` NOTIFICATION at ${ new Date().toLocaleString() }`);
            let callback = () => setTimeout(() => this.setState({tempAlramVar: 0}), 15000);
            this.setState({tempAlramVar: 1},callback);
            let audioEl = document.getElementsByClassName("audio-element")[(this.props.OPTION.notiSoundType || 0)];
            audioEl.volume = 0.3;
            audioEl.play();
        }
    };

    toTTS = (utterance) => {
        let synth = window.speechSynthesis;
        if (!synth) return;
        let voice_KR = synth.getVoices()[12];
        let utterThis = new SpeechSynthesisUtterance(utterance);
        utterThis.voice = voice_KR;
        utterThis.volume = 0.5;
        synth.speak(utterThis);
    };

    notiCallback = () => {
    };

    isOverCuttLine = (price) => {
        return !!price === false ? false : Math.sign(price - this.state.cuttline) < 1;
    };

    watchToggle = () => {

    };

    inputVerify = (e) => {
        let numChuck = Number.isInteger(1*e.target.value);
        if(numChuck) {
            localStorage[this.props.TITLE] = 1*e.target.value;
            return this.setState({cuttline: Number(e.target.value)});
        }
    };

    applyNotation = (itemObject) => {
        if( typeof itemObject === 'object') {
            let itemName = itemObject.itemName;

            if(['방어구', '무기', '추가장비', '액세서리'].includes(itemObject.itemType) && itemObject.itemTypeDetail !== '칭호' ) itemName += ` [+${itemObject.reinforce}]`;
            if(itemObject.itemTypeDetail === '무기아바타') itemName += ` [${itemObject.jobName}]`;
            if(itemObject.itemType === '스태커블') itemName += ` [${itemObject.count}개] `;
            itemName = itemName.replace(new RegExp(this.props.OPTION.prefix, 'g'), '');
            if(itemName.includes('아바타 풀세트')) itemName = itemName.replace('풀세트 상자', '');
            return itemName;
        }
        else {
            let itemName = itemObject;
            itemName = itemName.replace(new RegExp(this.props.OPTION.prefix, 'g'), '');
            if(itemName.includes('아바타 풀세트')) itemName = itemName.replace('풀세트 상자', '');
            return itemName;
        }
    };

    downloadSnapshot = () => {
        var filename = `rawData__${this.props.TITLE}__${new Date().toLocaleString().replace(/:/g, '꞉')}.json`;
        var a = document.createElement('a');
        var blob = new Blob([JSON.stringify(this.state)]);
        a.download = filename;
        a.href = URL.createObjectURL(blob);
        a.click();
        URL.revokeObjectURL(blob);
    };

    pushMessage = (message, timeOut, icon) => {
        console.log(this.state.messageBox);
        this.setState({messageBox : [...this.state.messageBox, {icon : icon, message : message, timeStamp : Date.now(), timeOut : timeOut}]},
        () => {
            setTimeout( ()=> {
                let m = this.state.messageBox;
                m.splice(0,1);
                this.setState({messageBox : m});}, timeOut);
            });
        };

        copy = (param) => {
            navigator.clipboard.readText().then((text) => {
            });
            let cheapestPriceList = Object.keys(this.state.overview).map(itemName => this.state.overview[itemName].cheapestPrice);
            let str = '';
            str += new Date(this.state.timeStamp).toLocaleString();
            str += '\t';
            let space = '\t';
            if(param === 'vertical') space = '\n';
            let len = Object.keys(cheapestPriceList).length;
            Object.keys(cheapestPriceList).forEach((elem, idx) => {
                if(idx !== len -1) str += cheapestPriceList[elem] + space;
                else str += cheapestPriceList[elem];
            });
            navigator.clipboard.writeText(str);
            this.pushMessage('복사되었습니다', 2000, '✔️');
        };

        keyEventHandler = (e) => {
            if(e.key === 'c' || e.key === 'C') { this.copy() }
            // ...
        };

        openModal = (itemName) => {
            this.setState({modalisOpen : itemName});
        }

        render() {
            let overview = this.state.overview;
            let prevOverview = this.state.prevOverview;

            let viewerTarget = this.props.OPTION.target;
            let viewerType = this.props.OPTION.type;

            let attributeRow;
            let dataRow;
            let dummyRow;
            let additionalRow;
            let viewerConsole;
            let modal;


            let isExistSnapshot = Object.keys(this.state.snapshot).length !== 0;

            attributeRow = <div className={"attribute row --shown-"+this.state["--showAttributeRow"] } onClick={() => this.setState({"--showAttributeRow": !this.state["--showAttributeRow"]})}>
            <div className={"data cell --super-short"}> </div>
            <div className={"attribute cell itemname --long"}> 검색어 </div>
            <div className={"attribute cell --short"}> 가격 </div>
            <div className={"attribute cell --short"}> 변동폭 </div>
            {this.state.innerWidth >= 490 ? <div className={"attribute cell --extra-short"}> 물량 </div> : null}
            </div>;

            dataRow = (itemName, idx) => {
                let currentItem = overview[itemName];
                let prevItem = prevOverview[itemName]; 
                let priceDiff = currentItem.cheapestPrice - prevItem.cheapestPrice;
                return(
                    <div className={"data row"} data-itemname={itemName} key={idx} >
                    <div className={"data cell --super-short"}><img alt={""} src={ currentItem.cheapest ? `https://img-api.neople.co.kr/df/items/${currentItem.cheapest.itemId}` : null } /></div>
                        <div className={"data cell itemname --long --elipsis"} title={itemName}> { currentItem.cheapest !== undefined ? this.applyNotation(currentItem.cheapest) : itemName } </div>
                        <div className={"data cell --short --num --hover-bold --pointer"} onClick={() => this.openModal(itemName)}> <div className={"--hover-mint"}>{ AddComma(currentItem.cheapestPrice, '×') }</div> </div>
                        <div className={"data cell priceDiff --short --elipsis --num "} data-sign={ Math.sign(priceDiff) }> { Math.abs(priceDiff).toLocaleString() } </div>
                        {this.state.innerWidth >= 490 ? <div className={"data cell --extra-short --num "}> { currentItem.quantity } </div> : null }
                        </div>
                )
            };

            dummyRow = <div className={"data row"} >
                <div className={"data cell --super-short"}> <img src={itemIconPlaceholder} alt={"item-placeholder"}/></div>
                <div className={"data cell itemname --long --elipsis"}>  </div>
                <div className={"data cell --short --num --hover-bold --pointer"}> {"\u00A0"}  </div>
                <div className={"data cell --short --elipsis --num "}> </div>
                {this.state.innerWidth >= 490 ? <div className={"data cell --extra-short --num "}> </div> : null }
                </div>

                //addtionalRow, with calculating
            if(viewerType === 'package' && isExistSnapshot) {
                //console.log(overview);
                let packagePrice = 1*(overview[viewerTarget.package].cheapestPrice);
                let contentsPrice = viewerTarget.packageContents.reduce((acc,cuv) => acc += overview[cuv].cheapestPrice, 0);
                let calculatedPrice = packagePrice - 0.97*contentsPrice;

                additionalRow = <div className={"data row additional-row"} data-itemname={"additionalRow"}><div className={"data cell --super-short"}> ▶ </div>
                    <div className={"data cell itemname --long"}> { this.props.OPTION.additionalRowTag || "실제 아바타값" } </div>
                    <div className={"data cell --short --num "} title={Math.floor(0.97 * contentsPrice )}> { Math.floor(calculatedPrice)?.toLocaleString('en') } </div>
                    <div className={"data cell --short"}> {  } </div>
                    { this.state.innerWidth >= 490 ? <div className={"data cell --extra-short"}> {  } </div> : null }
                    </div>;
            }
            else if (viewerType === 'none') {
                additionalRow = "";
            }


            // viewerConsole
            let typeBoolean = viewerType === 'watch' || viewerType === 'package';
            let referencePrice = this.props.OPTION.type === 'none'  ? ' °˖✧◝(⁰▿⁰)◜✧˖°' : this.state.cuttline;
            // ( ꒪⌓꒪)
            //  °˖✧◝(⁰▿⁰)◜✧˖°
            let timeFormat = this.state.timeStamp !== 0 ? new Date(this.state.timeStamp).toLocaleTimeString() : "오전 00:00:00";
            let expireDate = Math.floor( ( new Date().getTime() - new Date(this.props.OPTION.expireDate).getTime() ) / (24*3600*1000) );
            if (Math.sign(expireDate) > 0 && !isNaN(expireDate)) expireDate = "+" + expireDate;
            viewerConsole =
                <div className={"viewer-console --flex"}>
                    <div className={"viewer-info --flex --space-between"}>
                        <div className={"viewer-status --flex "}>
                            <div className={"--pointer"} onClick={this.downloadSnapshot}>
                                <div className={"--test"}><i className={"fas fa-caret-square-down --viewer-progress "}></i></div>
                            </div>
                            <div className={"receive-tm"}> { timeFormat } </div>
                        </div>
                        <div className={ "expire-date" } data-expire-date = { expireDate+"" }> { isNaN(expireDate) ? "" : "D" + expireDate } </div>
                        <div onClick={this.copy.bind(this, 'horizon')} style={{cursor: "pointer"}}> { ' ' } </div>
                    </div>
                    <div className={"input-reference-price --flex --relative " + ( typeBoolean ? '' : '--unable')}>
                        { typeBoolean ? <i className="far fa-eye --inner-eye" onClick={this.watchToggle}></i> : <i className="far fa-eye-slash --inner-eye"></i>}
                        <input className={"--simpleInput"} id={`autoComplete2-`+this.props.TITLE} value={ referencePrice } onChange={ this.inputVerify }/>
                    </div>
                </div>;

            // modal
            modal = <div>
                <Modal
                isOpen={!!this.state.modalisOpen}
                onRequestClose={() => this.setState({modalisOpen : false})}
                shouldReturnFocusAfterClose={false}
                appElement={document.getElementsByClassName('App')}
                style={{
                    overlay:{
                        'backgroundColor' : 'rgb(64 64 64 / 56%)',
                        'transition' : '3s'
                    },
                    content:{
                        '::WebkitScrollbar' : 'block',
                        'background' : 'whitesmoke',
                        'fontSize' : '18px',
                        'fontFamily' : 'Kopub M',
                        'color' : '#333',
                        left                  : '50%',
                        right                 : 'auto',
                        transform             : 'translate(-50%, -0%)',
                        'minWidth': '370px'
                    }
                }}
                >
                {!!this.state.modalisOpen ?
                    <div onClick={() => this.openModal(false)}>
                    {
                        this.state.snapshot[this.state.modalisOpen].map((item, idx) => {
                            return (<div className={"modal-row"} style={{"display" : "flex"}} key={idx}>
                            <div className={"p1"} style={{"margin" : "0 8px 3px 0"}}>{ this.applyNotation(item) }</div>
                            <div className={"p2"} style={{"margin" : "0 8px 3px 0"  }}>[{item.count}]</div>
                            <div className={"p3"}> ||&nbsp;&nbsp;&nbsp;&nbsp;  {AddComma(item.unitPrice)}</div>
                            </div>)
                        })
                    }
                    </div>
                    : <div> </div>}
                    {/*<button onClick={()=> this.setState({modalisOpen : false})}>x</button>*/}
                    <div className={"modal-endline"}></div>
                    </Modal></div>

                    //rendering
                    return (
                        <div id={"quick"} className={this.props.OPTION.title}  tabIndex={0} onKeyPress={this.keyEventHandler}>
                        <div className={"float-message-box"} style={{display : "none"}}>
                        {
                            this.state.messageBox.map((elem, idx) => {
                                return (
                                    <div className={`floating-modal` } style={{'animation': `fadeout ${elem.timeOut/1000}s`,
                                    'animationFillMode': 'forwards'}} key={elem.timeStamp}><span style={{'color' : 'black'}}>{elem.icon}</span> {elem.message} </div>
                                )
                            })
                        }
                        </div>

                        {modal}

                        <audio className={"audio-element"}>
                        <source src={notiSound_1}/>
                        </audio>
                        <audio className={"audio-element"}>
                        <source src={notiSound_2}/>
                        </audio>
                        <div className={"wrapper"}>
                        <div className={"auction-viewer"}>
                        { attributeRow }
                        { isExistSnapshot ? Object.keys(overview).map(dataRow) : React.Children.toArray(new Array(this.props.OPTION.expectedRowSize || 5).fill(dummyRow)) }
                        { additionalRow }
                        </div>
                        { viewerConsole }
                        <div className={"notification-bar"}> </div>
                        </div>
                        </div>
                    );
                }
            }

            RealtimeSearch.defaultProps  = { OPTION : {}};

            export default RealtimeSearch;
