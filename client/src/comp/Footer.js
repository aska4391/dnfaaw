import React from 'react';
import neople from '../images/neople.png';
import '../styles/Footer.css';
import {Link} from "react-router-dom";

class Footer extends React.Component {
    // ⚡
    openAsPopup () {
        window.open(document.URL, '','width=341,height=480');
    }
    render () {
        return (<div className={"footer"}>
            {/*<div className={"honey-bee"}></div> */}
            <div></div>
            <div>2022 DNFΛΛW</div>
            <div className="footer-menu">
            <div> <a href={"javascript:window.open(document.URL, '','width=341,height=480');"} rel="noopener noreferrer" >popup</a></div>
            <div> <a href={'https://developers.neople.co.kr/contents/apiDocs/df'} target={"_blank"} rel="noopener noreferrer" >api</a> </div>
            <div> <a href={"https://docs.google.com/spreadsheets/d/1aCrR2Yl6NJox0LjZrFMaxN6KkFXgJUGJrcth8OSxs24/edit#gid=1405080628"} target={"_blank"} rel="noopener noreferrer" >sheet</a> </div>
            <div> <Link to={"/about"}>about</Link> </div>
            </div>
            <a href={'https://developers.neople.co.kr/contents/apiDocs/df'} target={"_blank"} rel="noopener noreferrer" >Powered by Neople OpenAPI</a>
            <div> <span role={"img"} className={"footer-div"}>&nbsp;</span> </div>
            <img className={"footer-img"} alt={"neopleAPI-bl"} src={neople} href="https://developers.neople.co.kr/contents/apiDocs/df"></img>
        </div>)
    }

}

export default Footer;
