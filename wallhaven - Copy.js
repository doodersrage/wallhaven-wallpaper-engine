let clickTimes = 0, clickTimeout = 0, wallpaperNum = 0, wallpaperUseCnt = 0, wallpaperPage = 1
window.addEventListener('click', (event) => {
    clearTimeout(clickTimeout)
    if (++clickTimes >= 5) {
        clickTimes = 0
        changeWallpaper()
        return
    }
    clickTimeout = setTimeout(() => {
        clickTimes = 0
    }, 300)
})

var intervalTimeout = 0
function init() {
    let lastTime = localStorage.getItem('time')
    let paperPath = localStorage.getItem('paperPath')
    if (lastTime && paperPath) {
        if (randominterval) {
            let pastTime = Date.now() - lastTime
            if (randominterval * 60000 <= pastTime) {
                changeWallpaper()
                return
            }
            intervalTimeout = setTimeout(changeWallpaper, randominterval * 60000 - pastTime)
        }
        document.querySelector('body').style = 'background: url("' + paperPath + '") center center / cover no-repeat;'
    } else {
        changeWallpaper()
    }
}

function resetInterval() {
    clearTimeout(intervalTimeout)
    intervalTimeout = setTimeout(changeWallpaper, randominterval * 60000)
}

function changeWallpaper() {
    fetch(generateURL()).then((response) => {
        if (response.ok) {
            response.json().then((json) => {
                let wallpaperCnt = json.data.length;
                if(sortings == 'random'){
                    wallpaperNum = 0;
                } else {
                    if(wallpaperCnt == 0 || (wallpaperUseCnt >= wallpaperCnt && wallpaperCnt < 24)){
                        wallpaperPage = 1;
                        wallpaperUseCnt = 0;
                    } else {
                        wallpaperUseCnt++;
                    }
                    wallpaperNum = Math.floor(Math.random() * wallpaperCnt);
                }
                document.querySelector('body').style = 'background: url("' + json.data[wallpaperNum].path + '") center center / cover no-repeat;'
                if (randominterval) {
                    resetInterval()
                }
                localStorage.setItem('time', Date.now())
                localStorage.setItem('paperPath', json.data[wallpaperNum].path)
            })
        } else {
            console.log('fetch fail : ' + response.status + ' : ' + response.statusText + ', retry after 1 min.')
            clearTimeout(intervalTimeout)
            intervalTimeout = setTimeout(changeWallpaper, 60000)
        }
    })
}

function generateURL() {
    let url = new URL('https://wallhaven.cc/api/v1/search?purity=')
    //url.searchParams.set('sorting', 'random')

    url.searchParams.set('sorting', sortings)

    if(sortings == 'random'){
        url.searchParams.set('seed', 'p5&Iw8');
        wallpaperUseCnt = 0;
        wallpaperPage = 1;
    } else {
        if(wallpaperUseCnt > 24){
            wallpaperUseCnt = 0;
            wallpaperPage++;
            url.searchParams.set('page', wallpaperPage);
        }
    }

    let categoriesParam = ''
    if (searchText) {
        url.searchParams.set('q', searchText)
    }
    if (categories.general) {
        categoriesParam += '1'
    } else {
        categoriesParam += '0'
    }
    if (categories.anime) {
        categoriesParam += '1'
    } else {
        categoriesParam += '0'
    }
    if (categories.people) {
        categoriesParam += '1'
    } else {
        categoriesParam += '0'
    }
    url.searchParams.set('categories', categoriesParam)

    let purityParam = ''
    if (purity.sfw) {
        purityParam += '1'
    } else {
        purityParam += '0'
    }
    if (purity.sketchy) {
        purityParam += '1'
    } else {
        purityParam += '0'
    }
    if (purity.nsfw && apikey) {
        purityParam += '1'
    } else {
        purityParam += '0'
    }
    url.searchParams.set('purity', purityParam)

    if (!lestwidth)
        lestwidth = window.innerWidth
    if (!lestheight)
        lestheight = window.innerHeight
    url.searchParams.set('atleast', lestwidth + 'x' + lestheight)

    if (ratio) {
        url.searchParams.set('ratios', ratio)
    }

    if (apikey) {
        url.searchParams.set('apikey', apikey)
    }

    return url
}
