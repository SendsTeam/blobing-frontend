const BREAK_POINT = 768
function isMobile() {
    if (window.screen.width < BREAK_POINT)
        return true
    else return false
}
function isDesktop() {
    if (window.screen.width > BREAK_POINT)
        return true
    else return false
}

export {
    isDesktop,
    isMobile
}