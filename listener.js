var firstTime = true
var randominterval = 0
var apikey = ''
var categories = {
    general: true,
    anime: true,
    people: true
}
var purity = {
    sfw: true,
    sketchy: true,
    nsfw: false
}
var lestwidth = ''
var lestheight = ''
var ratio = ''
window.wallpaperPropertyListener = {
    applyUserProperties: function(properties) {
        if (properties.randominterval) {
            randominterval = properties.randominterval.value
            if (!firstTime) {
                resetInterval()
            }
        }
        if (properties.sortings) {
            sortings = properties.sortings.value
        }
        if (properties.searchtext) {
            searchText = properties.searchtext.value
        }
        if (properties.apikey) {
            apikey = properties.apikey.value
        }
        if (properties.general) {
            categories.general = properties.general.value
        }
        if (properties.anime) {
            categories.anime = properties.anime.value
        }
        if (properties.people) {
            categories.people = properties.people.value
        }
        if (properties.sfw) {
            purity.sfw = properties.sfw.value
        }
        if (properties.sketchy) {
            purity.sketchy = properties.sketchy.value
        }
        if (properties.nsfw) {
            purity.nsfw = properties.nsfw.value
        }
        if (properties.lestwidth) {
            lestwidth = properties.lestwidth.value
        }
        if (properties.lestheight) {
            lestheight = properties.lestheight.value
        }
        if (properties.ratio) {
            ratio = properties.ratio.value
        }
        if (properties.ratio) {
            ratio = properties.ratio.value
        }
        if (firstTime) {
            firstTime = false
            init()
        }
    },
    setPaused: function(isPaused) {
        if (isPaused) {
            clearTimeout(intervalTimeout)
        } else {
            init()
        }
    }
};