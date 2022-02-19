'use strict'

let obCalculator = {
    arrNums: document.querySelectorAll('.number'),
    arrStates: document.querySelectorAll('.state'),
    arrOperations: document.querySelectorAll('.operation'),
    arrMemoryButtons: document.querySelectorAll('.memoryButton'),
    mainInput: document.querySelector('.input_main'),
    commaButton: document.querySelector('.commaButton'),
    subInput: document.querySelector('.input_sub'),
    changeSingBtn: document.querySelector('.changeSingBtn'),
    backspaceBtn: document.querySelector('.backspace'),
    resultBtn: document.querySelector('.resultButton'),
    cleanAllInputsButton: document.querySelector('.cleanAllInputsButton'),
    cleanMainInputButton: document.querySelector('.cleanMainInputButton'),
    memoryIndicator: document.querySelector('.memoryIndicator-wrapper'),
    enteringStatus: false,
    operationChoice: '',
    singChangeString: '',
    singChangeStatus: false,
    x: 0,
    y: 0,
    result: 0,
    memoryValue: 0,
    floatStatus: false
}
//лисенеры
obCalculator.cleanAllInputsButton.onclick = setZeroState;
obCalculator.cleanMainInputButton.onclick = cleanMainInput;
obCalculator.backspaceBtn.onclick = doMainInputBackspace;
obCalculator.commaButton.onclick = () => {
    if(obCalculator.enteringStatus === false ){
        cleanMainInput();
        addToInput('0,');
        obCalculator.enteringStatus = true;
        obCalculator.floatStatus = true;
    }
    else{
        if(obCalculator.floatStatus === false){
            if (+obCalculator.mainInput.value === 0){
                addToInput('0,');
            }
            else{
                addToInput(',');
            }
            obCalculator.floatStatus = true;
        }
        else{
            obCalculator.floatStatus = true;
        }
    }


}
// obCalculator.mainInput.onpropertychange = () =>{
//     checkInputFont(+obCalculator.mainInput.value.length,obCalculator.mainInput);
// }

obCalculator.resultBtn.onclick = () => {
    if (obCalculator.x === 0 && obCalculator.y === 0) {
        setZeroState();
    } else {
        setYAndChangeCommaToDot(obCalculator.mainInput.value);
        obCalculator.result = getResult(+obCalculator.x, +obCalculator.y);
        setZeroState();
        addToInput(changeDotToComma(obCalculator.result));
    }

};

//лисенеры на цифры
for (let i = 0; i < obCalculator.arrNums.length; i++) {
    obCalculator.arrNums[i].onclick = () => {
        if (obCalculator.enteringStatus === false) {
            obCalculator.mainInput.value = obCalculator.arrNums[i].innerText;
            changeInputEnteringState();
        } else {
            addToInput(+obCalculator.arrNums[i].innerText);

        }
    }
}
//лисенеры на доп операции
for (let i = 0; i < obCalculator.arrStates.length; i++) {
    obCalculator.arrStates[i].onclick = () => {
        switch (obCalculator.arrStates[i].innerText) {
            case '+-':
                obCalculator.mainInput.value = changeNumSing(+obCalculator.mainInput.value);
                setFalseInputEnteringState();
                break;
            case 'qrs':
                addToSubInput(addTextPrefix('sqrt', obCalculator.mainInput.value));
                obCalculator.mainInput.value = Math.sqrt(obCalculator.mainInput.value);
                break;
            case '1/x':
                console.log('1/x');
                break;
        }
    }
}

//лисенеры на память

for (let i = 0; i < obCalculator.arrMemoryButtons.length; i++) {
    obCalculator.arrMemoryButtons[i].onclick = () => {
        switch (obCalculator.arrMemoryButtons[i].innerText) {
            case 'MC':
                getMemoryClean();
                break;
            case 'MR':
                readFromMemory();
                break;
            case 'MS':
                saveInMemory(+obCalculator.mainInput.value);
                break;
            case 'M+':
                addToMemory(+obCalculator.mainInput.value);
                break;
            case 'M-':
                subtractFromMemory(+obCalculator.mainInput.value);
                break;

        }
    }
}

//лисенеры на операции

for (let i = 0; i < obCalculator.arrOperations.length; i++) {

    obCalculator.arrOperations[i].onclick = () => {

        if (obCalculator.operationChoice === '') {
            addToSubInput(obCalculator.mainInput.value);
            setXAndChangeCommaToDot(obCalculator.mainInput.value);
            setCurrentOperation(obCalculator.arrOperations[i].innerText);
            addToSubInput(obCalculator.operationChoice);
            changeInputEnteringState();
            obCalculator.floatStatus = false;
        } else {
            if (obCalculator.enteringStatus === false) {
                doSubInputBackspace();
                setCurrentOperation(obCalculator.arrOperations[i].innerText);
                addToSubInput(obCalculator.operationChoice);
                setFalseInputEnteringState();
                obCalculator.floatStatus = false;

            } else {
                setYAndChangeCommaToDot(+obCalculator.mainInput.value);
                addToSubInput(obCalculator.mainInput.value);
                cleanMainInput();
                obCalculator.result = getResult(obCalculator.x, obCalculator.y);
                addToInput(obCalculator.result);
                setXAndChangeCommaToDot(+obCalculator.result);
                setCurrentOperation(obCalculator.arrOperations[i].innerText);
                addToSubInput(obCalculator.operationChoice);
                changeInputEnteringState();
                obCalculator.floatStatus = false;

            }

        }
    }


}

function changeInputEnteringState() {
    obCalculator.enteringStatus = !obCalculator.enteringStatus;
}

function setFalseInputEnteringState() {
    obCalculator.enteringStatus = false;
}

function getResult(x, y) {
    x = +changeCommaToDot(x);
    y = +changeCommaToDot(y);
    switch (obCalculator.operationChoice) {
        case '+':
            return getSum(x, y);
        case '*':
            return getMultyply(x, y);
        case '-':
            return getMinus(x,y);
        case '/':
            return getDevide(x,y);
        case '':
            return obCalculator.mainInput.value;
    }
}

function checkInputFont(value, input) {
    if (value > 12)
        input.classList.add('mainInputMiniFontSize');
    else
        input.classList.remove('mainInputMiniFontSize');
}

//TODO сделать возможным ввод с клавиатуры

// document.onkeydown = (e) => {
//     // if (isNaN(+(e.key))) {
//     //     console.log(isNaN(+(e.key)));
//     //     mainInput.value += 'asd';
//     // }
// }
function isNumber(value) {
    return typeof value === 'number' && isFinite(value);
}

function doMainInputBackspace() {
    if (obCalculator.mainInput.value.length === 1)
        obCalculator.mainInput.value = '0';
    else
        obCalculator.mainInput.value = obCalculator.mainInput.value.slice(0, -1);
}

function doSubInputBackspace() {
    if (obCalculator.subInput.value.length === 1)
        obCalculator.subInput.value = '';
    else
        obCalculator.subInput.value = obCalculator.subInput.value.slice(0, -2);
}


function setCurrentOperation(operation) {

    obCalculator.operationChoice = operation;
}

function setXAndChangeCommaToDot(value) {
    obCalculator.x = +changeCommaToDot(value);
}

function setYAndChangeCommaToDot(value) {
    obCalculator.y = +changeCommaToDot(value);
}

function getSum(x, y) {
    return +(+x + +y);
}

function getMultyply(x, y) {
    return +(+x * +y);
}

function getMinus(x, y) {
    return +(x - y);
}

function getDevide(x, y) {
    return +(x / y);
}

function cleanAllInputs() {
    cleanMainInput();
    cleanSubInput();
}

function setZeroState() {
    cleanMainInput();
    cleanSubInput();
    setCurrentOperation('');
    setXAndChangeCommaToDot(0);
    setYAndChangeCommaToDot(0);
    obCalculator.floatStatus = false;
}

function cleanMainInput() {
    obCalculator.mainInput.value = '0';
    obCalculator.floatStatus = false;
}

function cleanSubInput() {
    obCalculator.subInput.value = '';
}

function addToInput(value) {
    if (obCalculator.mainInput.value === '0')
        obCalculator.mainInput.value = value;
    else
        obCalculator.mainInput.value += value;
}

function addToSubInput(value) {
    if (obCalculator.subInput.value === '')
        obCalculator.subInput.value = value + ' ';
    else
        obCalculator.subInput.value += value + ' ';
}

function getOppositeNumber(value) {
    return -value;
}

function getReciproc() {

}

function addToMemory(value) {
    obCalculator.memoryValue += value;
    isMemoryEmpty();
}

function getMemoryClean() {
    obCalculator.memoryValue = 0;
    isMemoryEmpty();
}

function subtractFromMemory(value) {
    obCalculator.memoryValue -= value;
    isMemoryEmpty();
}

function readFromMemory() {
    obCalculator.mainInput.value = obCalculator.memoryValue;
    isMemoryEmpty();
}

function saveInMemory(value) {
    obCalculator.memoryValue = value;
    isMemoryEmpty();
}

function isMemoryEmpty() {
    if (obCalculator.memoryValue === 0) {
        obCalculator.memoryIndicator.classList.remove('memoryIndicator_enable');
    } else {
        obCalculator.memoryIndicator.classList.add('memoryIndicator_enable');
    }
}

function changeNumSing(value) {
    return value * -1;
}

function addTextPrefix(string, value) {
    return `${string}(${value})`;
}

function changeDotToComma(string) {
    return string.toString().replace(/[.]/g, ',');
}
function changeCommaToDot(string) {
    return string.toString().replace(/,/g, '.');

}