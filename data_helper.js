import axios from 'axios';
export default class DataHelper {    
    constructor() { 
        var _this = this;
        this.TIMEOUT = 8500;
        this.COOKIE_NAME = 'COOKIE_NAME';        
    }
    /**
     * set a new timeout value for axios.
     * @param {Number} value the timeout.
     */
    setTimeout(value) {
        this.TIMEOUT = value;
    }
    /**
     * sets a new cookie name.
     * @param {String} value the cookie name.
     */
    setCookieName(value) {
        this.COOKIE_NAME = value;
    }
    /**
     * Generates a cross api way of connection.
     * @returns {Object} object needed for header formation.
     */
    generateHeader() {
        return {
            "Content-Type" : "application/json",
            "Authorization" : "Bearer " + this.getBakedCookie(this.COOKIE_NAME) 
        };
    }
    /**
     * a standard axios promise based ajax for post.
     * @param {String} url the url to post.
     * @param {Object} param param payload.  
     * @param {Object} customHeader custom header as object.
     * @return {Promise} to be handled with thenc (then-catch-then).  
     * 
     */
    async postTo(url, param, customHeader = null) {
        var headerInfo = {};
        if (!customHeader) {
            headerInfo = { "timeout": this.TIMEOUT };
        } else {
            if (customHeader == "auto") {
                customHeader = {
                    "Content-Type" : "application/json",
                    "Authorization" : "Bearer " + this.getBakedCookie(this.COOKIE_NAME) 
                }
            }
            headerInfo = { "timeout": this.TIMEOUT, "headers": customHeader };
        }
        return await axios.post(url, JSON.stringify(param), headerInfo);
    }
    /**
     * Retrieve system cookie
     * @param {String} ckname the cookie name.
     * @returns {String} the cookie session.
     */
    getBakedCookie(ckname) {
        return this.getCookie(ckname).split('-')[1];
    }
    /**
     * a standard axios promise based ajax for get.
     * @param {String} url the url to post.
     * @param {Object} customHeader custom header as object.
     * @return {Promise} to be handled with thenc (then-catch-then).  
     * 
     */
    async getFrom(url, customHeader = null) {
        if (customHeader == "auto") {
            customHeader = {
                "Content-Type" : "application/json",
                "Authorization" : "Bearer " + this.getBakedCookie(this.COOKIE_NAME) 
            }
        }
        return await axios.get(url, customHeader)
    }
     /**
     * convert number into string with formatted comma.
     * @param {Number} num the number.
     * @return {String} the formatted number.  
     * 
     */
    formatNumber(num) {
        return String(num).replace(/(.)(?=(\d{3})+$)/g,'$1,')
    }
    /**
     * shift converts the string of message to an unreadable format hashed by unixtimestamp.
     * @param {String} msg the message itself.
     * @return {String} the hashed format of the message.  
     * @example
     * let str = "The quick brown FOX jumps over Lazy Dog! 0123456789";
        let dh = new DataHelper();
        var cook = dh.shift(str);
        console.log('cook is',cook);
     */
    shift(msg) {
        let utstamp = new Date().getTime();
        let plain = `${utstamp}__${msg}`;
        return plain.split("").map(c => c.charCodeAt(0).toString(16).padStart(2, "0")).join("");
    }
    /**
     * reverse undo what shift did.
     * @param {String} msg the hashed itself.
     * @return {String} the unhased version.  
     * @example
     * 
        let dh = new DataHelper();
        var rev = dh.reverse(str);        
     */
    reverse(msg) {
        let plain = msg.split(/(\w\w)/g).filter(p => !!p).map(c => String.fromCharCode(parseInt(c, 16))).join("");
        return plain.split("__")[1];
    }
    /**
     * setSessionStorage - stores usually a json object to session storage. Session Storage get destroyed if browsers (mobile is inactive given timelapsed) or browser window quits.
     * @param {String} key 
     * @param {Object} value 
     */
    setSessionStorage(key, value) {
        sessionStorage.setItem(key, value);
    }
    /**
     * getSessionStorage - retrieve a json object to session storage. Session Storage get destroyed if browsers (mobile is inactive given timelapsed) or browser window quits.
     * @param {String} key 
     * @return {Object} value 
     */
    getSessionStorage(key) {
        return sessionStorage.getItem(key);
    }
    /**
     * setLocalStorage - similar to session storage stores usually a json object to localstorage. Localstorage do not get deleted even if user close or clear cache.
     * @param {String} key 
     * @param {Object} value 
     */
    setLocalStorage(key, value) {
        localStorage.setItem(key, value);
    }
    /**
     * getLocalStorage - obtain the localstorage data with the key. Best practice is to store it as object.
     * @param {String} key 
     * @return {Object}
     */
    getLocalStorage(key) {
        return localStorage.getItem(key);
    }
    /**
     * erasecookie - nuff said , erased the cookie name per say.
     * @param {String} name is the name of the cookie.
     */
    eraseCookie(name) {   
        document.cookie = name+'=; Max-Age=0;';  
    }
    /**
     * getCookie - nuff said , get cookie name per say.
     * @param {Any} ckname cookie name itself.
     */
    getCookie (ckname) {
        var name = ckname + "=";
        var decodedCookie = decodeURIComponent(document.cookie);
        var ca = decodedCookie.split(";");
        for (var i = 0; i < ca.length; i++) {
          var c = ca[i];
          while (c.charAt(0) == " ") {
            c = c.substring(1);
          }
          if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
          }
        }
        return "";
    }
    /**
     * setCookie - create cookie.
     * @param {Any} ckname cookie name itself 
     * @param {Any} value cookie content 
     * @param {String} exp cookie timelapse 
     */
    setCookie(ckname, value, exp) {
        let date = new Date();
        date.setTime(date.getTime() + (exp * 24 * 60 * 60 * 1000));
        const expires = "expires=" + date.toUTCString();
        document.cookie = ckname + "=" + value + "; " + expires + "; path=/";
    }
    /**
     * hide partial of the email to display for user.
     * @param {String} email full value of the string 
     */
    hideEmail (email) {
        const [name, domain] = email.split('@');
        return `${name[0]}${new Array(name.length).join('*')}@${domain}`;
    }
     /**
     * broadcast - a universa dispatch event, used to update specific listening UI.
     * @param {String} uxname  of the cookie.
     */    
    broadCast (uxname, param) {
        window.dispatchEvent(
            new CustomEvent(uxname, {
                bubbles: true,
                detail: { data: param },
            })
        ); 
    }
}
