// init vars
let firstTime = true,
    randominterval = 0,
    apikey = '',
    categories = {
        general: true,
        anime: true,
        people: true
    },
    purity = {
        sfw: true,
        sketchy: true,
        nsfw: false
    },
    lestwidth = '',
    lestheight = '',
    localSortings = '',
    sortings = '',
    ratio = '',
    order = '';

window.wallpaperPropertyListener = {
    applyUserProperties: function(properties) {
        if (properties.randominterval) {
            randominterval = properties.randominterval.value;
            if (!firstTime) {
                resetInterval()
            }
        }
        if (properties.sortings) {
            sortings = properties.sortings.value;
        }
        if (properties.localSortings) {
            localSortings = properties.localSortings.value;
        }
        if (properties.order) {
            order = properties.order.value;
        }
        if (properties.searchtext) {
            searchText = properties.searchtext.value;
        }
        if (properties.apikey) {
            apikey = properties.apikey.value;
        }
        if (properties.general) {
            categories.general = properties.general.value;
        }
        if (properties.anime) {
            categories.anime = properties.anime.value;
        }
        if (properties.people) {
            categories.people = properties.people.value;
        }
        if (properties.sfw) {
            purity.sfw = properties.sfw.value;
        }
        if (properties.sketchy) {
            purity.sketchy = properties.sketchy.value;
        }
        if (properties.nsfw) {
            purity.nsfw = properties.nsfw.value;
        }
        if (properties.lestwidth) {
            lestwidth = properties.lestwidth.value;
        }
        if (properties.lestheight) {
            lestheight = properties.lestheight.value;
        }
        if (properties.ratio) {
            ratio = properties.ratio.value;
        }
        if (firstTime) {
            firstTime = false;
            init();
        } else {
            resetSlideshow();
        }
    },
    setPaused: function(isPaused) {
        if (isPaused) {
            clearTimeout(intervalTimeout);
        } else {
            init();
        }
    }
};