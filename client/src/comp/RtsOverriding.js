import React from 'react';
import RealtimeSearch from "./RealtimeSearch";
import {Link, Route} from "react-router-dom";

const unit = {};
const mount = {};
const unMount = {};

unit.getListForApp = () => {
    return Object.keys(mount).map((viewerName, index) => {
        return <Route exact path={"/@"+viewerName.toLowerCase()} component={mount[viewerName]} key={index} />
    })
}
unit.getListForHeader = (seperatorIndex) => {
    let toggleClass = (e) => {
        //e.preventDefault();
        let otherElems = document.querySelectorAll('.header__elem1__link');
        otherElems.forEach( elem => elem.classList.remove('--selected'));
        let elem = e.currentTarget.classList;
        elem.add('--selected');
    };

    let headerList =  Object.keys(mount).map((viewerName, index) => {
        return <Link to={"/@"+viewerName.toLowerCase()} className={"header__elem1__link quick "+viewerName.toLowerCase()} onClick={toggleClass} key={index}> {viewerName.toUpperCase().slice(0,4)} </Link>
    })
    headerList.splice(seperatorIndex, 0, <div className={"nav-vertical-bar"} key={headerList.length}>  </div>);
    return headerList;
}
// example
/*{
    type : package | watch | none
    target : new targetObject or String
    prefix : /regExp/ or String
        - default : undefined
        - remove words includse prefix
    addtionalRowTag : undefined or String
        - default : undefined
        - set field addtionalRow
    expectedRowSize : number
        - default : 5
        - set emptyRow size before listening data
    expireDate : '2022-04-16'
        - default : undefined
    notiSoundType : ''
}*/
// mount
mount.Neoawakenpkg2023 = function () {
    let Neoawakenpkg2023 = {
        title : 'NEOAWAKENPKG2023',
        type : 'package',
        target : {
            package : "진 각성의 서 패키지",
            packageContents : ["진 각성의 서 칭호 상자", "진 각성의 서 오라 상자", "진 각성의 서 크리쳐 상자", "진 각성의 서 세라 상자", "진 각성의 서 보너스 상자"],
            packageAvatarBox : "진 각성의 서 아바타 풀세트 상자"
        },
        prefix : '진 각성의 서',
        additionalRowTag : '아바타 실구매가',
        expectedRowSize : 7,
        expireDate : '2023-04-06    ',
        notiSoundType: 0
    }
    return (<RealtimeSearch TITLE={Neoawakenpkg2023.title} OPTION={Neoawakenpkg2023}/>)
}
mount.Aradawardspkg2022 = function () {
    let Aradawardspkg2022 = {
        title : 'ARADAWARDSPKG2022',
        type : 'package',
        target : {
            package : "아라드 어워즈 패키지",
            packageContents : ["아라드 어워즈 오라 상자", "아라드 어워즈 무기 클론 아바타 상자", "아라드 어워즈 크리쳐 상자", "아라드 어워즈 칭호 상자", "아라드 어워즈 세라 상자", "아라드 어워즈 보너스 상자"],
            packageAvatarBox : "아라드 어워즈 아바타 풀세트 상자"
        },
        prefix : '라드|워즈|클론 아바타',
        expireDate : '2023-02-02',
        additionalRowTag : undefined,
        notiSoundType: 0
    };
    return (<RealtimeSearch TITLE={Aradawardspkg2022.title} OPTION={Aradawardspkg2022}/>)
}
unMount.NobleRareAvatar = function () {
    let NobleRareAvatar = {
        title : 'NOBLERAREAVATAR',
        type : 'none',
        target : undefined,
        prefix : undefined,
        additionalRowTag : undefined,
        notiSoundType: 0
    };
    return (<RealtimeSearch TITLE={NobleRareAvatar.title} OPTION={NobleRareAvatar}/>)
}
unMount.Butterflypkg2022 = function () {
    let Butterflypkg2022 = {
        title : 'BUTTERFLYPKG2022',
        type : 'package',
        target : {
            package : "나비 무도회 패키지",
            packageContents : ["나비 무도회 크리쳐 상자", "나비 무도회 칭호 상자", "나비 무도회 세라 상자", "나비 무도회 오라 상자", "나비 무도회 무기 아바타 상자", "나비 무도회 보너스 상자"],
            packageAvatarBox : "나비 무도회 아바타 풀세트 상자"
        },
        prefix : '비|도회',
        additionalRowTag : '아바타 실구매가',
        expectedRowSize : 7,
        expireDate : '2022-11-03',
        notiSoundType: 0
    }

    return (
        <React.Fragment>
            <RealtimeSearch TITLE={Butterflypkg2022.title} OPTION={Butterflypkg2022}/>
        </React.Fragment>
    )
}

mount.Emblem = function () {
    let emblem = {
        title : 'EMBLEM',
        type : 'none',
        target : undefined,
        prefix : '란한|려한|은빛|색빛|란빛|른빛|얼|리|격|동|도|법|티컬|엠블렘',
        additionalRowTag : undefined,
        notiSoundType: 0
    };
    return (<RealtimeSearch TITLE={emblem.title} OPTION={emblem}/>)
};
mount.RareAvatar = function () {
    let rareAvatar = {
        title : 'RAREAVATAR',
        type : 'none',
        target : undefined,
        prefix : undefined,
        additionalRowTag : undefined,
        notiSoundType: 0
    };
    return (<RealtimeSearch TITLE={rareAvatar.title} OPTION={rareAvatar}/>)
};

// unmount
unMount.Forestelfpkg2022 = function () {
    let Forestelfpkg2022 = {
        title : 'FORESTELFPKG2022',
        type : 'package',
        target : {
            package : "포레스트 하이 엘프 패키지",
            packageContents : ["포레스트 엘프 크리쳐 상자", "포레스트 엘프 오라 상자", "포레스트 엘프 칭호 상자", "포레스트 엘프 세라 상자", "포레스트 엘프 무기 클론 아바타 상자", "포레스트 엘프 순수한 황금 증폭서", "엘프 보물 상자 열쇠"],
            packageAvatarBox : "포레스트 엘프 아바타 풀세트 상자"
        },
        prefix : '포레스트',
        additionalRowTag : '아바타 실구매가',
        expectedRowSize : 7,
        expireDate : '2022-08-25',
        notiSoundType: 0
    }
    let Forestelfpkg2022_EXT = {
        title : 'FORESTELFPKG2022_EXT',
        type : 'package',
        target : {
            package : "포레스트 엘프 패키지",
            packageContents : ["포레스트 엘프 크리쳐 상자", "포레스트 엘프 오라 상자", "포레스트 엘프 칭호 상자", "포레스트 엘프 세라 상자", "포레스트 엘프 무기 클론 아바타 상자", "엘프 보물 상자 열쇠", "엘프 보물 상자 열쇠"],
            packageAvatarBox : "포레스트 엘프 아바타 풀세트 상자"
        },
        prefix : '포레스트 엘프',
        additionalRowTag : '아바타 실구매가',
        expectedRowSize : 7,
        expireDate : '2022-08-25',
        notiSoundType: 0
    }
    return (
        <React.Fragment>
            <RealtimeSearch TITLE={Forestelfpkg2022.title} OPTION={Forestelfpkg2022}/>
            <RealtimeSearch TITLE={Forestelfpkg2022_EXT.title} OPTION={Forestelfpkg2022_EXT}/>
        </React.Fragment>
    )
}
unMount.Soulpkg2022 = () => {
    let soulpkg2022 = {
        title : 'SOULPKG2022',
        type : 'package',
        target : {
            package : "초원의 영혼 패키지",
            packageContents : ["초원의 영혼 오라 상자", "초원의 영혼 칭호 상자", "초원의 영혼 크리쳐 상자", "초원의 영혼 세라 상자", "초원의 영혼 보너스 상자"],
            packageAvatarBox : undefined
        },
        prefix : '초원의 영혼',
        additionalRowTag : '구성품 총판매 차익',
        expectedRowSize : 7,
        expireDate : '2022-07-07',
        notiSoundType: 0
    }
    let soulpkg2022_EXT = {
        title : 'SOULPKG2022_EXT',
        type : 'package',
        target : {
            package : "초원의 영혼 아바타 콤보 상자",
            packageContents : ["초원의 영혼 무기 아바타 상자"],
            packageAvatarBox : "초원의 영혼 아바타 풀세트 상자"
        },
        prefix : '초원의 영혼',
        additionalRowTag : '아바타 구매가',
        expectedRowSize : 4,
        expireDate : '2022-07-07',
        notiSoundType: 0
    }

    let goth2022 = {
        title : 'GOTH2022',
        type : 'package',
        target : {
            package : "고스로리 아바타 콤보 상자",
            packageContents : ["장미 무기 아바타 상자"],
            packageAvatarBox : "고스로리 아바타 풀세트 상자"
        },
        prefix : '고스로리',
        additionalRowTag : '아바타 구매가',
        expectedRowSize : 4,
        expireDate : '2022-06-16',
        notiSoundType: 0
    }

    return (
        <React.Fragment>
            <RealtimeSearch TITLE={soulpkg2022.title} OPTION={soulpkg2022}/>
            <RealtimeSearch TITLE={soulpkg2022_EXT.title} OPTION={soulpkg2022_EXT}/>
            <RealtimeSearch TITLE={goth2022.title} OPTION={goth2022}/>
        </React.Fragment>
    )
}
unMount.Dimensionpkg2022 = () => {
    let dimensionpkg2022 = {
        title : 'DIMENSIONPKG2022',
        type : 'package',
        target : {
            package : "차원 여행 패키지",
            packageContents : ["차원 여행 칭호 상자", "차원 여행 무기 클론 아바타 상자", "차원 여행 오라 상자", "차원 여행 세라 상자", "차원 탐색기", "차원 탐색기"],
            packageAvatarBox : undefined
        },
        prefix : '차원 여행',
        additionalRowTag : '구성품 총판매 차익',
        expectedRowSize : 7,
        notiSoundType: 0
    };

    let dimensionpkg2022_EXT = {
        title : 'DIMENSIONPKG2022_EXT',
        type : 'package',
        target : {
            package : "차원 여행 아바타 콤보 상자",
            packageContents : ["차원 탐색기"],
            packageAvatarBox: "차원 여행 아바타 풀세트 상자"
        },
        prefix : '차원 여행|세트',
        expectedRowSize : 4,
        notiSoundType: 0
    };

    let otherItems = {
        title : 'OTHERITEMS',
        type : 'watch',
        target : "퍼펙트 컨트롤",
        prefix : '차원 여행|상자',
        notiSoundType: 0,
        calc: false
    };

    return (
        <React.Fragment>
            <RealtimeSearch TITLE={dimensionpkg2022_EXT.title} OPTION={dimensionpkg2022_EXT}/>
            <RealtimeSearch TITLE={dimensionpkg2022.title} OPTION={dimensionpkg2022}/>

            <RealtimeSearch TITLE={otherItems.title} OPTION={otherItems}/>
        </React.Fragment>
    )
}
unMount.Awakenpkg2022 = () => {

    let awakenpkg2022 = {
        title : 'AWAKENPKG2022',
        type : 'package',
        target : {
            head : "2022 전직의 서 패키지",
            body : ["전직의 서 크리쳐/토큰 선택 상자", "전직의 서 오라 상자", "전직의 서 세라 상자", "대용량 전직의 서 토큰 상자"],
            tail : "ㅡ"
        },
        prefix : '전직의 서',
        calcTag : '구성품 총판매 차익',
        notiSoundType: 0
    };

    let awakenpkg2022b = {
        title : 'AWAKENPKG2022B',
        type : 'package',
        target : {
            head : "전직의 서 아바타 콤보 상자",
            body : ["전직의 서 토큰 상자"],
            tail : "전직의 서 아바타 풀세트 상자"
        },
        prefix : '전직의 서|상자',
        notiSoundType: 0
    };

    return (
        <React.Fragment>
            <RealtimeSearch TITLE={awakenpkg2022.title} AVATAR={awakenpkg2022.target} OPTION={awakenpkg2022}/>
            <RealtimeSearch TITLE={awakenpkg2022b.title} AVATAR={awakenpkg2022b.target} OPTION={awakenpkg2022b}/>
        </React.Fragment>
    )
}
unMount.Revelation2021 = () => {

    let revelation2021 = {
        title : 'REVELATION2021',
        type : 'package',
        target : {
            head : "미드썸머 아라드 패키지",
            body : ["미드썸머 아라드 칭호 상자", "미드썸머 아라드 세라 상자", "미드썸머 아라드 오라 상자", "미드썸머 아라드 크리쳐 상자", "미드썸머 아라드 스페셜 보물 상자"],
            tail : "미드썸머 아라드 아바타 풀세트 상자"
        },
        prefix : '신의 계시',
        notiSoundType: 0
    };

    let revelation2021b = {
        title : 'REVELATION2021B',
        type : 'package',
        target : {
            head : "신의 계시 아바타 콤보 상자",
            body : ["신의 계시 무기 아바타 상자"],
            tail : "신의 계시 아바타 풀세트 상자"
        },
        prefix : '신의 계시',
        notiSoundType: 0
    };


    return (
        <React.Fragment>
            <RealtimeSearch TITLE={revelation2021.title} AVATAR={revelation2021.target} OPTION={revelation2021}/>
            <RealtimeSearch TITLE={revelation2021b.title} AVATAR={revelation2021b.target} OPTION={revelation2021b}/>
        </React.Fragment>
    )
}
unMount.Midsummerpkg2021 = () => {

    let midsummerpkg2021 = {
        title : 'MIDSUMMERPKG2021',
        type : 'package',
        target : {
            head : "미드썸머 아라드 패키지",
            body : ["미드썸머 아라드 칭호 상자", "미드썸머 아라드 세라 상자", "미드썸머 아라드 오라 상자", "미드썸머 아라드 크리쳐 상자", "미드썸머 아라드 스페셜 보물 상자"],
            tail : "미드썸머 아라드 아바타 풀세트 상자"
        },
        prefix : '미드썸머 아라드',
        notiSoundType: 0
    };

    let custom = {
        title : 'CUSTOM',
        type : 'watch',
        target : "낑깡",
        prefix : "레어 무기|클론 아바타",
        notiSoundType: 0
    };


    return (
        <React.Fragment>
            <RealtimeSearch TITLE={midsummerpkg2021.title} AVATAR={midsummerpkg2021.target} OPTION={midsummerpkg2021}/>
            <RealtimeSearch TITLE={custom.title} AVATAR={custom.target} OPTION={custom}/>
        </React.Fragment>
    )
};
unMount.Catpkg2021 = () => {

    let catpkg2021 = {
        title : 'CATPKG2021',
        type : 'package',
        target : {
            head : "고양이 킹덤 패키지",
            body : ["고양이 킹덤 칭호 상자", "고양이 킹덤 세라 상자", "고양이 킹덤 오라 상자", "고양이 킹덤 무기 클론 아바타 상자"],
            tail : "고양이 킹덤 아바타 풀세트 상자"
        },
        prefix : '고양이 킹덤',
        notiSoundType: 0
    };

    let custom = {
        title : 'CUSTOM',
        type : 'watch',
        target : "낑깡",
        prefix : "레어 무기|클론 아바타",
        notiSoundType: 0
    };

    return (
        <React.Fragment>
            {/*<RealtimeSearch TITLE={monster.title} AVATAR={monster.target} OPTION={monster}/>*/}
            <RealtimeSearch TITLE={catpkg2021.title} AVATAR={catpkg2021.target} OPTION={catpkg2021}/>
            <RealtimeSearch TITLE={custom.title} AVATAR={custom.target} OPTION={custom}/>
        </React.Fragment>
    )
};
unMount.Monster = () => {

    let monster = {
        title : 'MONSTER',
        type : 'package',
        target : {
            head : "몬스터 코스프레 패키지",
            body : ["몬스터 코스프레 칭호 상자", "몬스터 코스프레 오라 상자", "몬스터 코스프레 세라 상자"],
            tail : "몬스터 코스프레 아바타 풀세트 상자"
        },
        prefix : '몬스터 코스프레',
        notiSoundType: 0
    };

    let custom = {
        title : 'CUSTOM',
        type : 'watch',
        target : "퍼펙트 컨트롤",
        prefix : '몬스터 코스프레',
        notiSoundType: 1
    };

    return (
        <React.Fragment>
            <RealtimeSearch TITLE={monster.title} AVATAR={monster.target} OPTION={monster}/>
            <RealtimeSearch TITLE={custom.title} AVATAR={custom.target} OPTION={custom}/>
        </React.Fragment>
    )
};
unMount.Ssul = () => {

    let ssulsun = {
        title : 'HEAVENPKG-SUN',
        type : 'package',
        target : {
            head : "태양의 기사 패키지",
            body : ["천상의 기사 칭호 상자", "천상의 기사 오라 상자", "천상의 기사 세라 상자", "천상의 기사 크리쳐 상자", "천상의 기사 스페셜 보물 상자"],
            tail : "태양의 기사 아바타 풀세트 상자"
        },
        prefix : '태양의 기사|천상의 기사',
        notiSoundType: 0
    };

    let ssuldark = {
        title : 'HEAVENPKG-MOON',
        type : 'package',
        target : {
            head : "달의 기사 패키지",
            body : ["천상의 기사 칭호 상자", "천상의 기사 오라 상자", "천상의 기사 세라 상자", "천상의 기사 크리쳐 상자", "천상의 기사 스페셜 보물 상자"],
            tail : "달의 기사 아바타 풀세트 상자"
        },
        prefix : '달의 기사|천상의 기사',
        notiSoundType: 0
    };

    let avatarOnly = {
        title : 'HEAVENPKG-ONLYAVATAR',
        type : 'watch',
        target : '퍼펙트 컨트롤',
        prefix : '의 기사 아바타 풀세트 상자',
        notiSoundType : 1
    };

    return (
        <React.Fragment>
            {/*<RealtimeSearch TITLE={monster.title} AVATAR={monster.target} OPTION={monster}/>*/}
            <RealtimeSearch TITLE={ssulsun.title} AVATAR={ssulsun.target} OPTION={ssulsun}/>
            <RealtimeSearch TITLE={ssuldark.title} AVATAR={ssuldark.target} OPTION={ssuldark}/>
            <RealtimeSearch TITLE={avatarOnly.title} AVATAR={avatarOnly.target} OPTION={avatarOnly}/>
        </React.Fragment>
    )
};
unMount.Custom = () => {
    let TITLE = 'CUSTOM';
    let AVATAR = {
        head : "발할라 패키지",
        body : ["발할라 칭호 상자", "발할라 오라 상자", "발할라 보너스 아바타 상자", "발할라 세라 상자", "무기 클론 아바타 상자"],
        tail : "퍼펙트 컨트롤 합성법"
    };
    return (<RealtimeSearch TITLE={TITLE} AVATAR={AVATAR} OPTION={{calc:true}}/>)
};

export default unit;
