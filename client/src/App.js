import React, {useEffect, useState} from 'react';
import { Route, BrowserRouter as Router } from "react-router-dom"
import './App.css';
import Header from './comp/Header';
import Footer from './comp/Footer';
import unit from "./comp/RtsOverriding";
import About from './comp/About';
import Profile from "./comp/Profile";

function App() {

    return (

        <div className="App">
            <Router>
                <Header/>
                <div className={"container"}>
                    {/* viewer section */}
                    {unit.getListForApp()}
                    {/* about section  */}
                    <Route exact path="/profile" component={Profile} />
                    <Route exact path="/about" component={About} />
                </div>
                <Footer/>
            </Router>

        </div>
    );
}

export default App;
