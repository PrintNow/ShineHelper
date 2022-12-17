// ==UserScript==
// @name         Willdesk Extension Script
// @namespace    https://nowtime.cc
// @version      0.1
// @description  给 Willdesk 添加 Macros
// @author       Shine
// @match        https://app.willdesk.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=willdesk.com
// ==/UserScript==

function insertScript(url = "http://127.0.0.1:9977/main.js", version = null) {
    const remoteScript = document.createElement('script');
    remoteScript.src = `${url}?version=${version ?? (+new Date())}`
    document.body.appendChild(remoteScript);
}

function insertStyle(url = "http://127.0.0.1:9977/style.css", version = null) {
    const remoteStyle = document.createElement('link');
    remoteStyle.href = `${url}?version=${version ?? (+new Date())}`
    remoteStyle.rel = 'stylesheet'
    document.body.appendChild(remoteStyle);
}

(function () {
    'use strict';

    const version = "1.0"
    insertScript("https://nowtime.cc/tools/willdesk/main.js", version)
    insertStyle("https://nowtime.cc/tools/willdesk/style.css", version)
})();
