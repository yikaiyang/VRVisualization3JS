class MathUtil{
    static roundNumber(number, digits){
        return +number.toFixed(digits);
    }

    static midValue(number1, number2){
        return number1 + (number2 - number1) / 2;
    }
}

export default MathUtil;
    
