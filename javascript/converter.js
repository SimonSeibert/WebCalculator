//Becomes a boolean and checks, if the conventions of decimal, binary, and hexa numbers are fullfilled
var isCorrect;

/**
 * Looks for KeyDown Events in the Converter Text Fields
 */
function converterChangeListener() {
    $('#tDecimal').keyup(function () {
        decimalNumber = document.getElementById("tDecimal").value;
        correctCkeck(decimalNumber, 1);
        converter(decimalNumber, 1);
    });
    $('#tBinary').keyup(function () {
        binaryNumber = document.getElementById("tBinary").value;
        correctCkeck(binaryNumber, 2);
        converter(binaryNumber, 2);
    });
    $('#tHexadecimal').keyup(function () {
        hexadecimalNumber = document.getElementById("tHexadecimal").value;
        correctCkeck(hexadecimalNumber, 3);
        converter(hexadecimalNumber, 3);
    });
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
            if (isCorrect) {
                toBinary = changeBase(number, 10, 2);
                toHexadecimal = changeBase(number, 10, 16);

                decimalNumber = document.getElementById("tBinary").value = toBinary;
                decimalNumber = document.getElementById("tHexadecimal").value = toHexadecimal;
                break;
            }

            else {
                document.getElementById("tBinary").value = NaN;
                document.getElementById("tHexadecimal").value = NaN;
                break;
            }

        //Enter Binary
        case 2:
            if (isCorrect) {
                toDecimal = changeBase(number, 2, 10);
                toHexadecimal = changeBase(number, 2, 16);

                decimalNumber = document.getElementById("tDecimal").value = toDecimal;
                decimalNumber = document.getElementById("tHexadecimal").value = toHexadecimal;
                break;
            }

            else {
                document.getElementById("tDecimal").value = NaN;
                document.getElementById("tHexadecimal").value = NaN;
                break;
            }

        //Enter Hexadecimal 
        case 3:
            if (isCorrect) {
                toDecimal = changeBase(number, 16, 10);
                toBinary = changeBase(number, 16, 2);

                decimalNumber = document.getElementById("tDecimal").value = toDecimal;
                decimalNumber = document.getElementById("tBinary").value = toBinary;
                break;
            }

            else {
                document.getElementById("tDecimal").value = NaN;
                document.getElementById("tBinary").value = NaN;
                break;
            }

        default:
            break;
    }
}


/**
 * Checks if there are letters in decimal field etc.
 * @param {*} number 
 * @param {*} style 
 */
function correctCkeck(number, style) {
    switch (style) {
        case 1:
            /**
             * This is a regex expression
             * "/" = Always wrapped around Regex expression
             * "^" = Marks Beginning
             * "[0-9]" = Range -> Only Numbers from 0 to 9 
             * "+" = Quantifier -> You can write as long as you want to (Without the + you can only write 1 char)
             * "&" = Marks Ending
             * 
             * ==> It goes only in the if statement, when there aren't numbers from 0 to 9 (Because of the "!" in the beginning)
             */
            if (! /^[0-9]+$/.test(number)) {
                isCorrect = false;
            } else {
                isCorrect = true;
            }
            break;

        case 2:
            if (! /^[0-1]+$/.test(number)) {
                isCorrect = false;
            } else {
                isCorrect = true;
            }
            break;

        case 3:
            if (! /^[a-fA-F0-9]+$/.test(number)) {
                isCorrect = false;
            } else {
                isCorrect = true;
            }
            break;

        default:
            break;
    }
}