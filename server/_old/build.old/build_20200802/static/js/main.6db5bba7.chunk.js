(this.webpackJsonpclient=this.webpackJsonpclient||[]).push([[0],{47:function(e,t,a){e.exports=a.p+"static/media/logo.5d5d9eef.svg"},50:function(e,t,a){e.exports=a(95)},55:function(e,t,a){},57:function(e,t,a){},87:function(e,t){},90:function(e,t,a){},95:function(e,t,a){"use strict";a.r(t);var n=a(0),r=a.n(n),s=a(45),c=a.n(s),o=(a(55),a(24)),l=a.n(o),i=a(46),m=a(48),u=a(1),h=a(47),p=a.n(h),d=(a(57),a(10)),v=a(15),f=a(12),g=a(11),y=a(16),E=a.n(y);E.a.connect();var N=function(e){Object(f.a)(a,e);var t=Object(g.a)(a);function a(){return Object(d.a)(this,a),t.apply(this,arguments)}return Object(v.a)(a,[{key:"render",value:function(){return r.a.createElement("div",null,"dd")}}]),a}(r.a.Component),S=(a(90),E.a.connect(window.location.origin));var b=function(e){Object(f.a)(a,e);var t=Object(g.a)(a);function a(){var e;Object(d.a)(this,a);for(var n=arguments.length,r=new Array(n),s=0;s<n;s++)r[s]=arguments[s];return(e=t.call.apply(t,[this].concat(r))).state={snapshot:{},prevSnapshot:{},summary:{},prevSummary:{},cuttline:75e5,timeStamp:0,connect:0,shown:!0,color:"--white",tempAlramVar:0},e.notiCallback=function(){var t=e.state.summary.lowest,a=1*t["\uc0ac\ub3c4\uc758 \uac15\ub9bc \ud328\ud0a4\uc9c0"]-.97*(t["\uc0ac\ub3c4\uc758 \uac15\ub9bc \uce6d\ud638 \uc0c1\uc790"]+t["\uc0ac\ub3c4\uc758 \uac15\ub9bc \uc624\ub77c \uc0c1\uc790"]+t["\uc0ac\ub3c4\uc758 \uac15\ub9bc \uc138\ub77c \uc0c1\uc790"]+t["\uc0ac\ub3c4\uc758 \uac15\ub9bc \uc2a4\ud398\uc15c \ubcf4\ubb3c \uc0c1\uc790"]);if(console.log(a,e.state.hash,e.hashConvert(e.state.hash)),console.log(e.state.cuttline),a<=e.state.cuttline&&0===e.state.tempAlramVar){e.setState({tempAlramVar:1},(function(){setTimeout((function(){return e.setState({tempAlramVar:0})}),15e3)})),new Notification("\uc54c\ub9bc",{body:"".concat(e.hashConvert(e.state.hash),"\uff20").concat(Math.floor(a))})}},e.hashCode=function(e){return e.split("").reduce((function(e,t){return(e=(e<<5)-e+t.charCodeAt(0))&e}),0)},e.hashConvert=function(e){return String(Math.abs(e)).split("").map((function(e){return 1*e})).reduce((function(e,t){return e+=String.fromCharCode(97+t)}),"")},e.signString=function(e,t){var a=t-e,n=Math.sign(a)+0;return 0===n?["--zero","","-"]:1===n?["--plus","\u2191 ",Math.abs(a).toLocaleString("en")]:-1===n?["--minus","\u2193 ",Math.abs(a).toLocaleString("en")]:void 0},e.toggle=function(e){console.log(e.target.classList);var t=document.querySelector("#".concat(e.target.getAttribute("id")));"none"===t.style.display?t.style.display="flex":t.style.display="none"},e}return Object(v.a)(a,[{key:"componentDidMount",value:function(){var e=this;Notification.requestPermission(),S.on("snapshot-2",(function(t,a){e.setState({color:"--green"},(function(){setTimeout((function(){return e.setState({color:"--white"})}),500)}));var n=t,r=e.state.snapshot,s=e.hashCode(JSON.stringify(n)),c=e.hashCode(JSON.stringify(r)),o=0!==Object.keys(e.state.prevSnapshot).length,l={lowest:Object.keys(n).reduce((function(e,t){return e[t]=n[t][0].unitPrice,e}),{}),prevLowest:Object.keys(r).reduce((function(e,t){return e[t]=r[t][0].unitPrice,e}),{}),quantity:Object.keys(n).reduce((function(e,t){return e[t]=n[t].reduce((function(e,t){return e+=t.count}),0),e}),{}),hash:s};if(o)if(0!==c-s){var i=e.state.snapshot,m=e.state.summary;e.setState({snapshot:n,prevSnapshot:i,summary:l,prevSummary:m,timeStamp:a,hash:s},e.notiCallback)}else e.setState({snapshot:n,summary:l,timeStamp:a,hash:s});else e.setState({snapshot:n,prevSnapshot:n,summary:l,prevSummary:l,timeStamp:a,hash:s},(function(){return console.log("")}))}))}},{key:"render",value:function(){var e=this,t=this.state.snapshot,a=(this.state.prevSnapshot,this.state.summary,this.state.prevSummary,this.state.summary.lowest||{}),n=this.state.prevSummary.lowest||{},s=this.state.summary.quantity||{},c=1*a["\uc0ac\ub3c4\uc758 \uac15\ub9bc \ud328\ud0a4\uc9c0"]-.97*(a["\uc0ac\ub3c4\uc758 \uac15\ub9bc \uce6d\ud638 \uc0c1\uc790"]+a["\uc0ac\ub3c4\uc758 \uac15\ub9bc \uc624\ub77c \uc0c1\uc790"]+a["\uc0ac\ub3c4\uc758 \uac15\ub9bc \uc138\ub77c \uc0c1\uc790"]+a["\uc0ac\ub3c4\uc758 \uac15\ub9bc \uc2a4\ud398\uc15c \ubcf4\ubb3c \uc0c1\uc790"]),o=!1===!!c?"":Math.sign(c-this.state.cuttline)>=1?"--none":"--red";n["\uc0ac\ub3c4\uc758 \uac15\ub9bc \ud328\ud0a4\uc9c0"],n["\uc0ac\ub3c4\uc758 \uac15\ub9bc \uce6d\ud638 \uc0c1\uc790"],n["\uc0ac\ub3c4\uc758 \uac15\ub9bc \uc624\ub77c \uc0c1\uc790"],n["\uc0ac\ub3c4\uc758 \uac15\ub9bc \uc138\ub77c \uc0c1\uc790"],n["\uc0ac\ub3c4\uc758 \uac15\ub9bc \uc2a4\ud398\uc15c \ubcf4\ubb3c \uc0c1\uc790"],!1===!!c||Math.sign(c-this.state.cuttline);return r.a.createElement(r.a.Fragment,null,r.a.createElement("div",{className:"wrapper"},r.a.createElement("div",{className:"lowest"},r.a.createElement("div",{className:"attribute row --shown-"+this.state.shown,onClick:function(){return e.setState({shown:!e.state.shown})}},r.a.createElement("div",{className:"attribute cell --long"}," \uac80\uc0c9\uc5b4 "),r.a.createElement("div",{className:"attribute cell --short"}," \uac00\uaca9 "),r.a.createElement("div",{className:"attribute cell --short"}," \ubcc0\ub3d9\ud3ed "),r.a.createElement("div",{className:"attribute cell --extra-short"}," \ubb3c\ub7c9 ")),Object.keys(a).map((function(c,o){var l,i=(l=a[c],Number(l).toLocaleString("en")),m=e.signString(n[c],a[c]);return r.a.createElement("div",{className:"data row"},r.a.createElement("div",{className:"data cell --long --elipsis"}," ",Object.keys(t).length>=1?t[c][0].itemName:c," "),r.a.createElement("div",{className:"data cell --short --num"}," ",i," "),r.a.createElement("div",{className:"data cell --short --num "+m[0]}," ",m[1],m[2]," "),r.a.createElement("div",{className:"data cell --extra-short --num "}," ",s[c]," "))})),r.a.createElement("div",{className:"data row "+o},r.a.createElement("div",{className:"data cell --long"}," ","\uc2e4\uc81c \uc544\ubc14\ud0c0\uac12"," "),r.a.createElement("div",{className:"data cell --short --num "}," ",Math.floor(c||0).toLocaleString("en")||0," "),r.a.createElement("div",{className:"data cell --short"}," "," "),r.a.createElement("div",{className:"data cell --extra-short"}," "," ")),r.a.createElement("div",{className:"lowest-tail --flex"},r.a.createElement("div",{className:"--flex --space-between"},r.a.createElement("div",{className:"--flex"},r.a.createElement("div",null,r.a.createElement("i",{className:"fas fa-caret-square-down "+this.state.color+" --temp"})),r.a.createElement("div",null," ",new Date(this.state.timeStamp||0).toLocaleTimeString()," ")),r.a.createElement("div",null," ",this.hashConvert(this.state.hash)," ")),r.a.createElement("div",{className:"--flex --relative"},r.a.createElement("i",{className:"fas fa-eye --inner-eye"}),r.a.createElement("input",{className:"--simpleInput",value:this.state.cuttline,onChange:function(t){return e.setState({cuttline:Number(t.target.value)})}})))),r.a.createElement("div",{className:"snapshot"})),r.a.createElement("div",{className:"honey-bee"}))}}]),a}(r.a.Component),w=(r.a.Component,b);(function(){var e=Object(i.a)(l.a.mark((function e(){var t;return l.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,fetch("/api/\ucc2c\ub780\ud55c \ubd89\uc740\ube5b \uc5e0\ube14\ub818[\ud798]");case 2:return t=e.sent,e.next=5,t.json();case 5:t=e.sent,console.log(t);case 7:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}})()();var k=function(){return r.a.createElement("div",{className:"App"},r.a.createElement(m.a,null,r.a.createElement(u.a,{path:"/quick",component:w}),r.a.createElement(u.a,{path:"/about",component:N})),r.a.createElement("header",{className:"App-header"},r.a.createElement("img",{src:p.a,className:"App-logo",alt:"logo"}),r.a.createElement("p",null,"\uac38\uc544ss\uc545,,, ",r.a.createElement("code",null,"src/App.js")," and save to reload."),r.a.createElement("a",{className:"App-link",href:"https://reactjs.org",target:"_blank",rel:"noopener noreferrer"},"Learn React")))};Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));c.a.render(r.a.createElement(r.a.StrictMode,null,r.a.createElement(k,null)),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()})).catch((function(e){console.error(e.message)}))}},[[50,1,2]]]);
//# sourceMappingURL=main.6db5bba7.chunk.js.map