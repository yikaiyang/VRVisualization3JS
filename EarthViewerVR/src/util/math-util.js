/**
 * Some helper functions 
 * @author Yikai Yang
 */

class MathUtil{
    /**
     * Roundnumber rounds a given number to a given number of decimal places.
     * @param {*} number    the number to be rounded
     * @param {*} digits    the number of decimal places
     */
    static roundNumber(number, digits){
        return +number.toFixed(digits);
    }

    /**
     * Arithmetic mean of two numbers.
     * @param {*} number1   first number
     * @param {*} number2   second number
     */
    static midValue(number1, number2){
        return number1 + (number2 - number1) / 2;
    }
}

export default MathUtil;
    
