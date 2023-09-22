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
function isIOS() {
    const userAgent = navigator.userAgent;
    return /iPad|iPhone|iPod/.test(userAgent) && !window.MSStream;
}

export {
    isDesktop,
    isMobile, 
    isIOS
}