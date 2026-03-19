let windowID = Math.floor(Math.random() * 9999), 
    clickTimes = 0, 
    clickTimeout = 0, 
    wallpaperNum = 0, 
    wallpaperPage = 1, 
    lastPage = 0, 
    totalWallpapers = 0, 
    selWallpapers = [], 
    maxWallpaperPerPage = 24,
    intervalTimeout = 0;

window.addEventListener('click', (event) => {
    clearTimeout(clickTimeout);
    if (++clickTimes >= 5) {
        clickTimes = 0;
        changeWallpaper();
        return;
    }
    clickTimeout = setTimeout(() => {
        clickTimes = 0;
    }, 300);
});

function init() {
    const lastTime = localStorage.getItem('time'),
        paperPath = localStorage.getItem('paperPath');
    if (lastTime && paperPath) {
        if (randominterval) {
            let pastTime = Date.now() - lastTime;
            if (randominterval * 60000 <= pastTime) {
                changeWallpaper();
                return;
            }
            intervalTimeout = setTimeout(changeWallpaper, randominterval * 60000 - pastTime);
        }
        document.querySelector('body').style = 'background: url("' + paperPath + '") center center / cover no-repeat;';
    } else {
        changeWallpaper();
    }
}

function resetSlideshow() {
    localStorage.removeItem('json'+String(windowID));

    wallpaperPage = 1;
    wallpaperNum = 0;
    lastPage = 0;
    totalWallpapers = 0;
    selWallpapers = [];

    changeWallpaper();
}

function resetInterval() {
    clearTimeout(intervalTimeout);
    intervalTimeout = setTimeout(changeWallpaper, randominterval * 60000);
}

function setPageNum(){
    let curWallPaperCnt = 0;

    switch(localSortings){
        case 'random':
            curWallPaperCnt = selWallpapers.length;
        break;
        case 'descending':
            curWallPaperCnt = maxWallpaperPerPage-wallpaperNum;
        break;
        case 'ascending':
        default:
            curWallPaperCnt = wallpaperNum;
        break;
    }

    if(lastPage == wallpaperPage && (((wallpaperPage-1)*maxWallpaperPerPage)+curWallPaperCnt >= totalWallpapers)){
        selWallpapers = [];
        wallpaperPage = 1;
    } else {
        if(curWallPaperCnt >= maxWallpaperPerPage){
            selWallpapers = [];
            wallpaperPage++;
        }
    }
}

function getRandomInt(wallpaperCnt){

    const randomIndex = Math.floor(Math.random() * wallpaperCnt);

    if(selWallpapers.includes(randomIndex) && (selWallpapers.length <= maxWallpaperPerPage || selWallpapers.length <= wallpaperCnt)){
        return getRandomInt(wallpaperCnt);
    } else {
        selWallpapers.push(randomIndex);

        return randomIndex;
    }
 
}

async function fetchAPIData(){
    try {
        const response = await fetch(generateURL(), {
            // mode: 'no-cors',
            method: 'GET',
            headers: {
                Accept: 'application/json',
            },
        });
        if (response.ok) {
            const json = await response.json();

            // do not store for random search
            let storageData = JSON.stringify([wallpaperPage, sortings, json]);
            localStorage.setItem('json'+String(windowID), storageData);

            lastPage = json.meta.last_page;
            totalWallpapers = json.meta.total;

            return json;
        } else {
            console.log('fetch fail : ' + response.status + ' : ' + response.statusText + ', retry after 1 min.');
            clearTimeout(intervalTimeout);
            intervalTimeout = setTimeout(changeWallpaper, 60000);
            //changeWallpaper();
            return null;
        }
    } catch (error) {
        // Catch any network errors or errors thrown in the try block
        console.error("Fetch error:", error.message);
        // You might return a default value or rethrow the error
        throw error; 
    }
}

 async function getAPIData(){
    let apiData;

    // check cache for all other sort types
    apiData = localStorage.getItem('json'+String(windowID));

    // update local api cache as needed for other sort methods
    if(apiData != null){
        apiData = JSON.parse(apiData);

        // refetch api data if page or sorting method is changed
        if(apiData[0] != wallpaperPage || apiData[1] != sortings){
           apiData = await fetchAPIData();
            return apiData;
        } else {
            return apiData[2];
        }
    } else {
        apiData = await fetchAPIData();
        return apiData;
    }
        
}

async function changeWallpaper() {
    const apiData = await getAPIData();

    if(apiData){

        switch(localSortings){
            case 'random':
                wallpaperNum = getRandomInt(apiData.data.length);
            break;
            case 'descending':
                wallpaperNum--;
                if(wallpaperNum < 0) wallpaperNum = maxWallpaperPerPage;
            break;
            case 'ascending':
            default:
                wallpaperNum++;
                if(wallpaperNum > maxWallpaperPerPage) wallpaperNum = 0;
            break;
        }

        setPageNum();

        document.querySelector('body').style = 'background: url("' + (apiData.data[wallpaperNum].large ? apiData.data[wallpaperNum].large : apiData.data[wallpaperNum].path) + '") center center / cover no-repeat;';
        // used for debugging
        //document.querySelector('body').innerHTML = JSON.stringify(apiData.meta)+' current: '+wallpaperNum +' localSort: '+localSortings;

        if (randominterval) {
            resetInterval();
        }
        localStorage.setItem('time', Date.now());
        localStorage.setItem('paperPath', (apiData.data[wallpaperNum].large ? apiData.data[wallpaperNum].large : apiData.data[wallpaperNum].path));
    }
}

function generateURL() {
    let url = new URL('https://wallhaven.cc/api/v1/search?purity=');
    //url.searchParams.set('sorting', 'random');

    url.searchParams.set('sorting', sortings);
    url.searchParams.set('order', order);

    if(sortings == 'random'){
        url.searchParams.set('seed', 'p5&Iw8');
    }
    url.searchParams.set('page', wallpaperPage);

    let categoriesParam = '';
    if (searchText) {
        url.searchParams.set('q', searchText.trim());
    }
    if (categories.general) {
        categoriesParam += '1';
    } else {
        categoriesParam += '0';
    }
    if (categories.anime) {
        categoriesParam += '1';
    } else {
        categoriesParam += '0';
    }
    if (categories.people) {
        categoriesParam += '1';
    } else {
        categoriesParam += '0';
    }
    url.searchParams.set('categories', categoriesParam);

    let purityParam = '';
    if (purity.sfw) {
        purityParam += '1';
    } else {
        purityParam += '0';
    }
    if (purity.sketchy) {
        purityParam += '1';
    } else {
        purityParam += '0';
    }
    if (purity.nsfw && apikey) {
        purityParam += '1';
    } else {
        purityParam += '0';
    }
    url.searchParams.set('purity', purityParam);

    if (!lestwidth)
        lestwidth = window.innerWidth;
    if (!lestheight)
        lestheight = window.innerHeight;
    url.searchParams.set('atleast', lestwidth + 'x' + lestheight);

    if (ratio) {
        url.searchParams.set('ratios', ratio);
    }

    if (apikey) {
        url.searchParams.set('apikey', apikey.trim());
    }

    return url;
}
