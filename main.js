let scenegraph = require("scenegraph");
const { Text } = require("scenegraph"); // [2]
const { editDocument } = require("application"); // [3]

let panel;

function create() {
    // [1]
    const html = `
<style>
    .break {
        flex-wrap: wrap;
    }
    .row{
        flex-wrap: wrap;
    }
    label.row > span {
        color: #8E8E8E;
        width: 100%;
        font-size: 11px;
        margin-bottom: 0;
        margin-top: 20px;
    }
    label.row input {
        flex: 1 1 auto;
    }
    form {
        padding: 0px;
    }
    .show {
        display: block;
    }
    .hide {
        display: none;
    }
</style>

<form method="dialog" id="main">
    <header><button id="setEn" type="button" uxp-variant="cta">Get EN Font</button><button id="setJa" type="button" uxp-variant="cta">Get JP Font</button></header>
    <hr>
    <div class="row break">
        <label class="row">
            <span>欧文・数字</span>
            <input type="text" uxp-quiet="true" id="txtEn" value="Georgia" placeholder="English" />
            <input type="text" uxp-quiet="true" id="txtEnW" value="Bold" placeholder="Weight" />
        </label>
        <label class="row">
            <span>和文・全角文字</span>
            <input type="text" uxp-quiet="true" id="txtJa" value="FOT-TsukuARdGothic Std" placeholder="Japanese" />
            <input type="text" uxp-quiet="true" id="txtJaW" value="B" placeholder="Weight" />
        </label>
    </div>
    <footer><button id="ok" type="submit" uxp-variant="cta">Change Fonts</button></footer>
</form>

<p id="warning">テキストオブジェクトを選択してください</p>
`;
    function changeTypeSetting(){
        // [2]
        const textEnglish = document.querySelector("#txtEn").value; // [4]
        const textEnglishW = document.querySelector("#txtEnW").value; // [4]
        const textJapanese = document.querySelector("#txtJa").value; // [5]
        const textJapaneseW = document.querySelector("#txtJaW").value; // [5]
        editDocument({ editLabel: "Increase rectangle size" }, function (
            selection
        ) {
            const selecteds = selection.items;
            const regEn = /^[a-zA-Z0-9!-/:-@¥[-`{-~]*$/;

            selecteds.forEach(function(selected){
                //文字の情報
                const text = selected.text;
                //行間設定があればそれを取得しておく（自動設定値の場合無理）
                const paragraphSpacing = selected.paragraphSpacing;
                let textData = [];
                for (let i = 0; i < text.split("").length; i++) {
                    const textT = text.split("")[i];
                    if (textT.match(regEn)) {
                        //正規表現にマッチした時は半角英数字記号用の設定
                        textData.push({text:textT,fontFamily:textEnglish,fontStyle:textEnglishW});
                    } else {
                        textData.push({text:textT,fontFamily:textJapanese,fontStyle:textJapaneseW});
                    }
                }
                selected.styleRanges = textData.map((item) => ({
                    // [3]
                    length: item.text.length,
                    fontFamily: item.fontFamily,
                    fontStyle: item.fontStyle,
                }));
                selected.paragraphSpacing = paragraphSpacing;
            })
        });

    }

    function getTypeSettingEn(){
        // [2]
        let textEnglish = document.querySelector("#txtEn"); // [4]
        let textEnglishW = document.querySelector("#txtEnW"); // [4]
        editDocument({ editLabel: "GetEnglish" }, function (
            selection
        ) {
            const selected = selection.items[0];
            const font = selected.fontFamily;
            const weight = selected.fontStyle;
            console.log(font);
            textEnglish.value = font;
            textEnglishW.value = weight;
        });
    }

    function getTypeSettingJa(){
        // [2]
        let textJapanese = document.querySelector("#txtJa"); // [4]
        let textJapaneseW = document.querySelector("#txtJaW"); // [4]
        editDocument({ editLabel: "GetJapanese" }, function (
            selection
        ) {
            const selected = selection.items[0];
            const font = selected.fontFamily;
            const weight = selected.fontStyle;
            console.log(font);
            textJapanese.value = font;
            textJapaneseW.value = weight;
        });
    }

    panel = document.createElement("div"); // [9]
    panel.innerHTML = html; // [10]
    panel.querySelector("#setEn").addEventListener("click", getTypeSettingEn); // [11]
    panel.querySelector("#setJa").addEventListener("click", getTypeSettingJa); // [11]
    panel.querySelector("form").addEventListener("submit", changeTypeSetting); // [11]

    return panel; // [12]
}

function show(event) {
    // [1]
    if (!panel) event.node.appendChild(create()); // [2]
}

function update(selection) {
    // [1]

    const form = document.querySelector("form"); // [3]
    const warning = document.querySelector("#warning"); // [4]

    if (!selection || !(selection.items[0] instanceof Text)) {
        // [5]
        form.className = "hide";
        warning.className = "show";
    } else {
        form.className = "show";
        warning.className = "hide";
    }
}
module.exports = {
    panels: {
        typesetting: {
            show,
            update,
        },
    },
};