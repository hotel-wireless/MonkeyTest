class BitHelper {
    static rightShift(num, count) {
        const numStr = num.toString(2);
        const numShiftStr = numStr.slice(0, -count);
        return parseInt(numShiftStr, 2);
    }

    static leftShift(num, count) {
        const numStr = num.toString(2);
        const numShiftStr = numStr + "0".repeat(count);
        return parseInt(numShiftStr, 2);
    }

    static or(leftNum, rightNum) {
        let result = "";
        let leftNumStr = leftNum.toString(2);
        let rightNumStr = rightNum.toString(2);

        if(leftNumStr.length > rightNumStr.length) {
            rightNumStr = "0".repeat(leftNumStr.length - rightNumStr.length) + rightNumStr;
        } else if(leftNumStr.length < rightNumStr.length) {
            leftNumStr = "0".repeat(rightNumStr.length - leftNumStr.length) + leftNumStr;
        }

        for(let i=0, l=leftNumStr.length; i<l; ++i) {
            result += rightNumStr[i] === "1" ? "1" : leftNumStr[i];
        }

        return parseInt(result, 2);
    }

    static and(leftNum, rightNum) {
        let result = "";
        let leftNumStr = leftNum.toString(2);
        let rightNumStr = rightNum.toString(2);

        if(leftNumStr.length > rightNumStr.length) {
            rightNumStr = "0".repeat(leftNumStr.length - rightNumStr.length) + rightNumStr;
        } else if(leftNumStr.length < rightNumStr.length) {
            leftNumStr = "0".repeat(rightNumStr.length - leftNumStr.length) + leftNumStr;
        }

        for(let i=0, l=leftNumStr.length; i<l; ++i) {
            result += rightNumStr[i] === "0" ? "0" : leftNumStr[i];
        }

        return parseInt(result, 2);
    }
}

// 绑定到Number的原型
Object.assign(Number.prototype, {
    rightShift(count) {
        return BitHelper.rightShift(this, count);
    },

    leftShift(count) {
        return BitHelper.leftShift(this, count);
    },

    or(rightNum) {
        return BitHelper.or(this, rightNum);
    },

    and(rightNum) {
        return BitHelper.and(this, rightNum);
    }
});

module.exports = BitHelper;