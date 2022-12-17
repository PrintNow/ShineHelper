'use strict';

class UserInfo {
    get name() {
        return document.querySelector(".customer_head .name").innerText
    }
}

/**
 * 写入 macro 到剪贴板
 * @param {string} text
 * @returns {Promise<void>}
 */
async function writeMacroToClip(text) {
    let userInfo = new UserInfo();
    text = text.replace(`{{name}}`, userInfo.name)

    await navigator.clipboard.writeText(text)
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
            writeMacroToClip(text).then(() => {
                let inputTextArea = document.querySelector(".inputTextArea");
                inputTextArea.focus()
                closeMacrosPanel($macroPanel)
            })
        }

        $li.innerText = text
        $macroPanelUL.appendChild($li)
    })
}

const macros = [
    'Hi {{name}}, Ashley here🙋‍♀️🙋‍♀️ How are you doing? 😊',
]

const macro_id = `shine-macro`

const $macro = document.createElement("div")
$macro.id = macro_id
$macro.innerHTML = `
<div id="${macro_id}_btn">Macros</div>
<div id="${macro_id}_panel"><ul></ul></div>
`

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
