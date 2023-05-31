export const getUrlSearchParams = (name, url) => {
    const urls = url || window.location.href
    const reg = new RegExp('(^|&|/?)' + name.toLowerCase() + '=([^&|/?]*)(&|/?|$)', 'i')
    const r = urls.substr(1).match(reg)
    if (r != null) {

        return r[2]
    }
    return null
}