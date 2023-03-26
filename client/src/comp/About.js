import React from 'react';
import '../styles/About.css';
import about3 from '../images/about3.png';
require.context('../images', false);

function importAll(r) {
    let images = {};
    r.keys().forEach((item, index) => { images[item.replace('./', '')] = r(item); });
    return images
}
const images = importAll(require.context('../images/kejang', false, /\.(png|jpe?g|svg)$/));

class About extends React.Component {

    state = {
        innerWidth : window.innerWidth
    }
    componentDidMount() {
        window.addEventListener("resize",  () => {
            this.setState({innerWidth: window.innerWidth});
        }, false);
    }

    render() {
        return (
            <div className={"about-elem"} style={this.state.innerWidth >= 490 ? {width : '514px'} : {width: '443px'}}>

                <div className={"about profile"}>
                    <div><img src={about3} alt={"profile"} /><br/><br/></div>
                </div>
                <div className={"about info"}>
                    <div className={"about title"}>DNFΛΛW</div>
                    <div className={"about desc"}>
                        scraping ingame auction data using dungeon&fighters API <br/><br/>
                        project : dnfauctionworker <br/>
                        author  &nbsp;: vwvw <br/>
                        contact : aska4391@gmail.com <br/>
                        license : MIT License <br/>
                        powerd by neople API
                    </div>
                </div>
                <div style={{"margin-top" : "50px"}}>
                    {Object.keys(images).map(image => <img src={images[image]} alt={""}/>)}
                </div>
            </div>
        )
    }
}
export default About;
