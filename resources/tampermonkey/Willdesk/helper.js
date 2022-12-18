// ==UserScript==
// @name         Willdesk Extension Script
// @namespace    https://nowtime.cc
// @version      0.1
// @description  Willdesk 增强型插件
// @author       Shine
// @match        https://app.willdesk.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=willdesk.com
// @run-at       document-body
// ==/UserScript==

function insertScript(url = "http://127.0.0.1:9977/main.js", version = null) {
    const remoteScript = document.createElement('script');
    remoteScript.src = `${url}?_version=${version ?? (+new Date())}`
    document.body.appendChild(remoteScript);
}

function insertStyle(url = "http://127.0.0.1:9977/style.css", version = null) {
    const remoteStyle = document.createElement('link');
    remoteStyle.href = `${url}?_version=${version ?? (+new Date())}`
    remoteStyle.rel = 'stylesheet'
    document.body.appendChild(remoteStyle);
}

insertStyle('https://cdn.jsdelivr.net/npm/toastify-js/src/toastify.min.css', '1.0');
insertScript('https://cdn.jsdelivr.net/npm/toastify-js', '1.0');

(function () {
    'use strict';

    const version = "1.0";
    // insertScript("https://nowtime.cc/tools/willdesk/main.js", version)
    // insertStyle("https://nowtime.cc/tools/willdesk/style.css", version)

    insertScript()
    insertStyle()
})();
