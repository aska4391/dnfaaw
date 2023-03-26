function getData(string) {
    let array = string.split(/\s|\t/);
    console.log(array);
    let index = ['찬란한 붉은빛 엠블렘[힘]'];
    let result = [];

    index.forEach( async (itemName, idx) => {
        let a = await fetch(`https://api.neople.co.kr/df/auction?itemName=${encodeURIComponent(itemName)}&q=minLevel:<minLevel>,maxLevel:<maxLevel>,rarity:<rarity>,minReinforce:<minReinforce>,maxReinforce:<maxReinforce>,minRefine:<minRefine>,maxRefine:<maxRefine>&sort=unitPrice:<unitPrice>,reinforce:<reinforce>,auctionNo:<auctionNo>&limit=<limit>&wordType=<wordType>&apikey=uUI8kZX3Nx0TNfL4rnuQYJuuly2E0QpX`)
        let b = await a.json();
        result.push(b);
    });

    console.log(result);
}

getData('1 2');