/**
 * TODO:
 * Automatisches Klammern schließen: z.b. "5(3+3" -> "5(3+3)"
 */


/////////////////////////////////////////////////////////////////////////////////////
//                              CALCULATIONS
////////////////////////////////////////////////////////////////////////////////////
var isCalculationCompleted = false;

/**
 * Append Number or Operator to the calculate Label
 * -> If Your Calculation is completed and you type a number, the whole label gets reset
 * -> If your calculation is completed and you type a operator, it gets appended
 */
function appendNumber(number) {
    if (isCalculationCompleted && (number == "0" || number == "1" || number == "2" || number == "3" || number == "4" || number == "5" || number == "6" || number == "7" || number == "9")) {
        document.getElementById("lCalculation").value = number;
    }

    else {
        document.getElementById("lCalculation").value += number;
    }
    isCalculationCompleted = false;
}

/**
 * This function converts a calculation in a way that can be handled by javascripts eval() function.
 * It goes through and only changes one thing at a time -> No Conflicts
 * When everything is correct, the converter finishes and passes the new calculation to the eval() function.
 * Example: Things like 5(2+2) can't be calculated by eval(), so this function will change it to 5*(2+2)
 * @param {*} calculation 
 */
function runConverter(calculation) {

    runAgain = true;

    while (runAgain) {

        /**
         * TODO: CURRENTLY ONLY WORKS WITH ONLY ONE BRACKET PAIR BEHIND "√"  
         * Replaces use of "√";
         * Example: √(5+3*3) -> Math.sqrt(5+3*3);
         */
        if (/\√(.*?)\)/.test(calculation)) {
            var replaceString = /\√(.*?)\)/.exec(calculation)[0];
            var innerCalc = /(?<=\√\()(.*?)(?=\))/.exec(replaceString)[0];
            calculation = calculation.replace(replaceString, "Math.sqrt(" + innerCalc + ")");
        }

        /**
         * TODO: CURRENTLY ONLY WORKS WITH 2 TIMES SINGLE DIGIT, Example for not working: 12^3; 1^14; 1^(2+2)
         * Replaces use of "^"
         * Example: 2^3 -> Math.pow(2,3)
         */
        else if (/[0-9]\^[0-9]/.test(calculation)) {
            var replaceString = /[0-9]\^[0-9]/.exec(calculation)[0];
            var preNumber = /[0-9](?=\^)/.exec(replaceString)[0];
            var afterNumber = /(?<=\^)[0-9]/.exec(replaceString)[0];
            calculation = calculation.replace(replaceString, "Math.pow(" + preNumber + "," + afterNumber + ")");
        }

        /**
         * Searches for a number where a "(" follows directly and replaces it with a "*(" so javascript can calculate it
         * Example: 5(2+2) -> 5*(2+2)
         */
        else if (/[0-9]\(/.test(calculation)) {
            //.exec() saves the search in an array where [0] is the String of the search
            var replaceString = /[0-9]\(/.exec(calculation)[0];
            //Do another exec on the previous exec and get the Number before the "("
            var preNumber = /[0-9]+/.exec(replaceString)[0];
            //Replace the old String
            calculation = calculation.replace(replaceString, preNumber + "*(");
        }

        /**
         * The same as previous but in the case there is 
         * Example: "(3)(3)" -> (3)*(3)
         */
        else if (/\)\(/.test(calculation)) {
            var replaceString = /\)\(/.exec(calculation)[0];
            //Replace the old String
            calculation = calculation.replace(replaceString, ")*(");
        }

        /**
         * Checks for number after closed bracket 
         * Example: (1+1)1 -> (1+1)*1 
         */
        else if (/\)[0-9]/.test(calculation)) {
            var replaceString = /\)[0-9]/.exec(calculation)[0];
            var suffixNumber = /[0-9]+/.exec(replaceString)[0];
            calculation = calculation.replace(replaceString, ")*" + suffixNumber);
        }

        /**
         * Replaces -- with +
         * Example: 5--5 -> 5+5
         */
        else if (calculation.includes("--")) {
            calculation = calculation.replace("--", "+");
        }

        /**
         * Replaces ++ with +
         * Example: 5++5 -> 5+5
         */
        else if (calculation.includes("++")) {
            calculation = calculation.replace("++", "+");
        }
        
        /**
         * Replaces +- with -
         * Example: 5+-5 -> 5-5
         */
        else if (calculation.includes("+-")) {
            calculation = calculation.replace("+-", "-");
        }

        /**
         * Replaces -+ with +
         * Example: 5-+5 -> 5-5
         */
        else if (calculation.includes("-+")) {
            calculation = calculation.replace("-+", "-");
        }

        //When this else is called, everything is done and the converter is finished
        else {
            runAgain = false;
        }
    }

    document.getElementById("lCalculation").value = calculation;
}

/**
 * Calculate Decimal
 */
function printResultDecimal() {
    try {
        runConverter(document.getElementById("lCalculation").value);

        calculation = document.getElementById("lCalculation").value;
        //************************************************************************
        //******************* EQUALS CHECK AND CALCULATION ***********************
        //************************************************************************

        //If it doesn't include a "=" it gets calculated normaly
        if (!calculation.includes("=")) {
            //Append the solution
            document.getElementById("lCalculation").value += " = " + eval(calculation);
        }

        //If it does have a "=" it takes the calculation behind it and calculates it
        else {
            splitter = document.getElementById("lCalculation").value.split("=");
            newEquation = splitter[1];
            document.getElementById("lCalculation").value = newEquation + " = " + eval(newEquation);
        }

        writeInTable();
        document.getElementById("error").innerHTML = "";
        isCalculationCompleted = true;
    }

    catch (error) {
        document.getElementById("error").innerHTML = error;
    }
}

/////////////////////////////////////////////////////////////////////////////////////
//                              CONTROLS
////////////////////////////////////////////////////////////////////////////////////

/**
 * Listenes for Key Input
 */
function keyListener() {
    document.addEventListener('keydown', function (event) {
        if (event.keyCode == 13) {
            printResultDecimal();
        }
        //****************Delete All on shift+back****************
        if (event.shiftKey && event.keyCode == 8) {
            deleteAll();
        }
    });
}

/**
 * Deletes last char of Calculation Array
 */
function deleteLast() {
    //Get Calculation String
    calcuation = document.getElementById("lCalculation").value;
    //Slice off the last Char in the String
    calcuation = calcuation.slice(0, -1);
    //print the new Calculation String
    document.getElementById("lCalculation").value = calcuation;
}

/**
 * Deletes All
 */
function deleteAll() {
    //Get Calculation String and replace it with a blank space
    document.getElementById("lCalculation").value = "";
}

/////////////////////////////////////////////////////////////////////////////////////
//                              TIME
/////////////////////////////////////////////////////////////////////////////////////

/**
 * Gets the current time 
 */
function getTime() {
    var date = new Date(),
        h = date.getHours(),
        m = date.getMinutes(),
        s = date.getSeconds();
    h = ZeroInFront(h);
    m = ZeroInFront(m);
    s = ZeroInFront(s);
    time = h + ':' + m + ':' + s
    return time;
}

/**
 * Puts 0 in front of a number (in my case hours, minutes and seconds) if it is smaller than 10 
 */
function ZeroInFront(number) {
    number = (number < 10 ? '0' : '') + number;
    return number;
}

/////////////////////////////////////////////////////////////////////////////////////
//                              HISTORY
/////////////////////////////////////////////////////////////////////////////////////

//Writes Calculation in the History Table
function writeInTable() {
    //Save Solution in String
    completedCalculation = document.getElementById("lCalculation").value;
    //GetRowCount for id of td
    var rowCount = document.getElementById("historyContainer").getElementsByTagName("tr").length;
    //Write it in History
    document.getElementById("historyContainer").innerHTML += '<tr> <td id="row' + rowCount + '">' + completedCalculation + '</td> <td>' + getTime() + '</td> </tr >';
    tableListener();
    setCookie();
}

/**
 * Clears History
 */
function clearHistory() {
    document.getElementById("historyContainer").innerHTML = "";
    tableListener();
    deleteCookie();
}

/**
 * Click to insert table content in the calculation label
 */
function tableListener() {

    var rows = document.getElementById("historyContainer").childNodes;

    for (let i = 0; i < rows.length; i++) {

        var cells = rows[i].childNodes;

        for (let j = 1; j < cells.length; j += 4) {

            cells[j].addEventListener("click", function () {
                console.log("CLICKED (" + i + "): " + rows[i].childNodes[1].innerHTML);
                document.getElementById("lCalculation").value = rows[i].childNodes[1].innerHTML;
            });
            cells[j].style.cursor = "pointer";
        }
    }
}

/////////////////////////////////////////////////////////////////////////////////////
//                              COOKIE
/////////////////////////////////////////////////////////////////////////////////////

function setCookie() {
    document.cookie = document.getElementById("historyContainer").innerHTML;
    console.log("Setting Cookie: " + document.cookie);
}

function getCookie() {
    document.getElementById("historyContainer").innerHTML = document.cookie;
    console.log("Getting Cookie: " + document.cookie);
}

function deleteCookie() {
    document.cookie = "";
    console.log("Deleting Cookie: " + document.cookie);
}