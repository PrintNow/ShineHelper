'use strict';

const macros = [
    'Hi {{name}}, {{accountName}} here🙋‍♀️🙋‍♀️ How are you doing? 😊',
    'Hi there, {{accountName}} here🙋‍♀️🙋‍♀️ How are you doing? 😊',
    "If it's convenient, could you take a minute to leave {{accountName}} a review for the support and service? thank you a lot! 💖💖",
    "May I know have you been redirected to the Shopify store? could you also leave {{accountName}} a review there? thank you! 💞💞",
    "Since you have no response for a long time, this conversation will be closed for now!\nIf you have any other concerns, please feel free to contact us anytime, thank you!",
    "Regarding your concerns, currently our development team is working on this feature, estimated that would be released at the end of this month or the beginning of next month, please kindly rest assured, once we have released the feature, molly will update you the first time!",
    // {
    //     name: "rabbit",
    //     url: ""
    // },
]

const macro_id = `shine-macro`

const $macro = document.createElement("div")
$macro.id = macro_id
$macro.innerHTML = `
<div id="${macro_id}_btn">Macros</div>
<div id="${macro_id}_panel"><ul></ul></div>
`

/*****************************************************************/
/*****************************************************************/
/*****************************************************************/
/*****************************************************************/

window.ShineToast = (text, options = {}) => {
    Toastify({
        text,
        duration: 2000,
        newWindow: true,
        close: false,
        gravity: "top",
        position: "center",
        stopOnFocus: true,
        style: {
            background: `linear-gradient(to right, #00b09b, #96c93d)`,
        },
        ...options
    }).showToast();
}

class UserInfo {
    get customerName() {
        return document.querySelector(".customer_head .name").innerText
    }

    get accountName(){
        return document.querySelector("span.accountName").innerText
    }
}

/**
 * 关闭 Macro 面板
 *
 * @param {Element} $macroPanel
 */
function closeMacrosPanel($macroPanel) {
    if ($macroPanel.classList.contains("open")) {
        $macroPanel.classList.remove("open")
    } else {
        $macroPanel.classList.add("open")
    }
}

/**
 * 渲染 macro 列表
 * @param {Element} $macroPanel
 * @param {string[]} macros
 */
function renderMacroList($macroPanel, macros = []) {
    let $macroPanelUL = $macroPanel.querySelector("ul")
    $macroPanelUL.innerHTML = ""

    macros.forEach(text => {
        let $li = document.createElement("li");
        $li.onclick = () => {
            let $inputTextArea = document.querySelector("div.inputTextArea");

            let userInfo = new UserInfo();
            text = text.replaceAll(`{{name}}`, userInfo.customerName)
                .replaceAll(`{{accountName}}`, userInfo.accountName)

            $inputTextArea.innerHTML += text

            dispatchInputEvent($inputTextArea)
            closeMacrosPanel($macroPanel)
        }

        $li.innerHTML = renderVar(text)
        $macroPanelUL.appendChild($li)
    })
}

/**
 *
 * @param {HTMLDivElement} $inputTextArea
 */
function dispatchInputEvent($inputTextArea){
    $inputTextArea.dispatchEvent(new Event("input"))
    keepLastIndex($inputTextArea)
}

/**
 *
 * @param {HTMLDivElement} ele
 */
function keepLastIndex(ele) {
    ele.focus(); //解决ff不获取焦点无法定位问题

    let range = window.getSelection(); //创建range
    range.selectAllChildren(ele); //range 选择obj下所有子内容
    range.collapseToEnd(); //光标移至最后
}

function renderVar(text) {
    text.match(/\{\{(.+?)\}\}/g)?.forEach(variable => {
        text = text.replaceAll(variable, `<code title="variable" class="shine-variable">${variable}</code>`)
    })

    return text
}

// 面板
let $macroPanel = $macro.querySelector(`#${macro_id}_panel`);
renderMacroList($macroPanel, macros)

// 按钮
let macroBtn = $macro.querySelector(`#${macro_id}_btn`);
macroBtn.addEventListener("click", (e) => {
    e.preventDefault()
    closeMacrosPanel($macroPanel)
})

// 监听点击外面关闭 macro
document.addEventListener("click", (e) => {
    if ($macroPanel.classList.contains("open") && !macroBtn.contains(e.target) && !$macroPanel.contains(e.target)) {
        // console.log("移出")
        $macroPanel.classList.remove("open")
    }
})

// 当观察到变动时执行的回调函数
const callback = function (mutationsList, observer) {
    for (let mutation of mutationsList) {
        if (mutation.target.id === $macro.id) {
            continue;
        }

        if (mutation.target.classList.contains("inputFuncContainer")) {
            const $inputFuncContainer = mutation.target

            if ($inputFuncContainer.querySelector(`#${$macro.id}`)) {
                // console.log('macro:', '重复插入了')
                continue;
            }

            const $inputFunc = $inputFuncContainer.querySelector(".inputFunc")
            $inputFunc.appendChild($macro)
            // console.log('macro:', '插入')
        }
    }
};

// 创建一个观察器实例并传入回调函数
const observer = new MutationObserver(callback);

// 以上述配置开始观察目标节点
observer.observe(document.body, {childList: true, subtree: true, attributes: true});
