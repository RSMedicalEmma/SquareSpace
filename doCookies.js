function getCookie(cName){
    const NAME = cName + "=";
    const C_DECODED = decodeURIComponent(document.cookie);
    const C_ARR = C_DECODED.split("; ");
    let value = null;
    C_ARR.forEach(val => {
        if(val.indexOf(NAME) === 0) value = val.substring(NAME.length);      
    })
    if(typeof value === 'undefined'){
        value = null;
    }
    return value;
} 
function setCookie(cName, cValue){
    if(cName && cValue){
        document.cookie = cName + "=" + cValue + "; path=/";
    }
}
