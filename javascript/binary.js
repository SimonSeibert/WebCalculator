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
         * Searches for a number where a "(" follows directly and replaces it with a "*(" so javascript can calculate it
         * Example: 5(2+2) -> 5*(2+2)
         */
        if (/[0-9]\(/.test(calculation)) {
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
 * Calculate Binary
 */
function printResultBinary() {
    try {
        //Converts the calculation
        runConverter(document.getElementById("lCalculation").value);
        //Get Calculation String
        calculation = document.getElementById("lCalculation").value;

        if (!calculation.includes("=")) {
            //Set Seperators (Regex + Escapes)
            var separators = [' ', '\\\+', '-', '\\\(', '\\\)', '\\*', '/', ':', '\\\?', '%'];
            //Split it so you have only the Binary numbers
            var binaryNumbers = calculation.split(new RegExp(separators.join('|'), 'g'));

            //Go Through Each Binary Number
            binaryNumbers.forEach(binaryNumber => {
                //if the binaryNumber is "Empty" (can happen because of the Splitter in the Else clause) nothing should be done
                if (binaryNumber === "") {

                }

                else {
                    //Convert each Number to Decimal
                    decimalNumber = changeBase(binaryNumber, 2, 10);

                    if (calculation.includes(binaryNumber)) {
                        //Replace every Binary Number in the Calculation with the Decimal equivalent
                        calculation = calculation.replace(binaryNumber, decimalNumber);
                    }
                }
            });

            //Calculate the Decimal Solution
            solutionInDec = eval(calculation);
            //Filter negative solutions
            if (solutionInDec.toString().includes("-")) {
                document.getElementById("lCalculation").value = "";
                document.getElementById("error").innerHTML = "Error: No negative binary Numbers";
            } else {
                //Convert the Decimal Solution to Binary
                solutionInBin = changeBase(solutionInDec, 10, 2);
                //Add leading Zeros
                solutionInBin = "0000".substr(solutionInBin.length) + solutionInBin;
                //Append it to the TextField
                document.getElementById("lCalculation").value += " = " + solutionInBin;
                writeInTable();
                document.getElementById("error").innerHTML = "";
                isCalculationCompleted = true;
            }
        }

        //If it does have a "=" it takes the calculation behind it and calculates it
        else {
            splitter = document.getElementById("lCalculation").value.split("=");
            newEquation = splitter[1];
            document.getElementById("lCalculation").value = newEquation;
            printResultBinary();
        }
    }

    catch (error) {
        document.getElementById("error").innerHTML = error;
    }
}

/**
 * This function can convert between Hexadecimal, Decimal and Binary in any Order
 * Example: If you want to convert from Decimal to Binary -> Numer = Any Number, fromBase = 10, toBase = 2
 * @param {*} number 
 * @param {*} fromBase 
 * @param {*} toBase 
 */
function changeBase(number, fromBase, toBase) {
    return parseInt(number, fromBase).toString(toBase);
}

/**
 * Converts Decimal to binary, binary to decimal, binary to hexa, hexa to decimal etc. (for the converter)
 */
function converter(number, style) {
    switch (style) {
        //Enter Decimal
        case 1:
            toBinary = changeBase(number, 10, 2);
            toHexadecimal = changeBase(number, 10, 16);

            decimalNumber = document.getElementById("tBinary").value = toBinary;
            decimalNumber = document.getElementById("tHexadecimal").value = toHexadecimal;
            break;

        //Enter Binary
        case 2:
            toDecimal = changeBase(number, 2, 10);
            toHexadecimal = changeBase(number, 2, 16);

            decimalNumber = document.getElementById("tDecimal").value = toDecimal;
            decimalNumber = document.getElementById("tHexadecimal").value = toHexadecimal;
            break;

        //Enter Hexadecimal 
        case 3:
            toDecimal = changeBase(number, 16, 10);
            toBinary = changeBase(number, 16, 2);

            decimalNumber = document.getElementById("tDecimal").value = toDecimal;
            decimalNumber = document.getElementById("tBinary").value = toBinary;
            break;

        default:
            break;
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
            // Prints the result when pressing enter
            printResultBinary();
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
////////////////////////////////////////////////////////////////////////////////////

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
////////////////////////////////////////////////////////////////////////////////////

//Writes Calculation in the History Table
function writeInTable() {
    //Save Solution in String
    completedCalculation = document.getElementById("lCalculation").value;
    //Write it in History
    document.getElementById("historyContainer").innerHTML += '<tr> <td>' + completedCalculation + '</td> <td>' + getTime() + '</td> </tr >';
    tableListener();
}

/**
 * Clears History
 */
function clearHistory() {
    document.getElementById("historyContainer").innerHTML = "";
    tableListener();
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

/**
 * CONFLICTS WIT DECIMAL COOKIE
 */

/////////////////////////////////////////////////////////////////////////////////////
//                              COOKIE
/////////////////////////////////////////////////////////////////////////////////////

//function setCookie() {
//    document.cookie = document.getElementById("historyContainer").innerHTML;
//    console.log("Setting Cookie: " + document.cookie);
//}
//
//function getCookie() {
//    document.getElementById("historyContainer").innerHTML = document.cookie;
//    console.log("Getting Cookie: " + document.cookie);
//}
//
//function deleteCookie() {
//    document.cookie = "";
//    console.log("Deleting Cookie: " + document.cookie);
//}