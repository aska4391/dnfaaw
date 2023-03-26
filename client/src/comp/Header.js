import React from 'react';
import { Link } from "react-router-dom";
import logo from '../images/logo35.png';
import '../styles/Header.css';
import unit from "../comp/RtsOverriding";
let origin = window.origin.toString();

class Header extends React.Component {

    state = {

    };

    componentDidMount () {
        let pathname = window.location.pathname;
        let elem = document.getElementsByClassName(pathname.replace('/',''))[0];
        if(elem !== undefined) elem.click();
    }

    toggleClass = (e) => {
        //e.preventDefault();
        let otherElems = document.querySelectorAll('.header__elem1__link');
        otherElems.forEach( elem => elem.classList.remove('--selected'));
        let elem = e.currentTarget.classList;
        elem.add('--selected');
    };

    cleanConsole = () => {
        console.clear();
    };

    render () {

        let simbol;
        simbol = origin.includes('localhost') ? '🐋️' : '🐋️';

        return(
            <div className={"header"}>
                <div className={"header__elem1"}>
                    {/* logo */}
                    <div className={"header__elem1__logo"}> <img src={logo} alt={"site-logo"} width={35} height={35}/></div>
                    {/* viewer section */}
                    {unit.getListForHeader(1)}
                </div>
                <div className={"header__elem2 about"}>
                    {/* about section */}
                    <Link to="/profile" onClick={this.cleanConsole}> { simbol } </Link>
                </div>
            </div>
            )
    }
}

export default Header;
