function eval() {
    // Do not use eval!!!
    return;
}

function clean(array) {
  for (let i = 0; i < array.length; i++) {
    if (array[i] === "") {
      array.splice(i, 1);
    }
  }
  return array;
}


function isNumeric(token) {
  return !isNaN(parseFloat(token)) && isFinite(token);
}

function expressionCalculator(expr) {
    let brackets = {
      '(' : 0,
      ')' : 0
    }

    for (let i = 0; i < expr.length; i++) {
        switch (expr[i]) {
            case '(':
                brackets["("]++;
                break;

            case ')':
                brackets[")"]++;
                break;

            default:
                break;
        }
    }

    if (brackets[')'] != brackets['(']) {
      throw new Error("ExpressionError: Brackets must be paired");
    }

    let result = infixToPostfix(expr);
    result = solvePostfix(result);

    return result;
}

module.exports = {
    expressionCalculator
}

function infixToPostfix(infix) {
    let outputQueue = "";
    let operatorStack = [];
    let operators = {
      "^": {
        precedence: 4,
        associativity: "Right"
      },
      "/": {
        precedence: 3,
        associativity: "Left"
      },
      "*": {
        precedence: 3,
        associativity: "Left"
      },
      "+": {
        precedence: 2,
        associativity: "Left"
      },
      "-": {
        precedence: 2,
        associativity: "Left"
      }
    }
    infix = infix.replace(/\s+/g, "");
    infix = clean(infix.split(/([\+\-\*\/\^\(\)])/));
    for (let i = 0; i < infix.length; i++) {
      let token = infix[i];
      if (isNumeric(token)) {
        outputQueue += token + " ";
      } else if ("^*/+-".indexOf(token) !== -1) {
        let o1 = token;
        let o2 = operatorStack[operatorStack.length - 1];
        while ("^*/+-".indexOf(o2) !== -1 && ((operators[o1].associativity === "Left" && operators[o1].precedence <= operators[o2].precedence) || (operators[o1].associativity === "Right" && operators[o1].precedence < operators[o2].precedence))) {
          outputQueue += operatorStack.pop() + " ";
          o2 = operatorStack[operatorStack.length - 1];
        }
        operatorStack.push(o1);
      } else if (token === "(") {
        operatorStack.push(token);
      } else if (token === ")") {
        while (operatorStack[operatorStack.length - 1] !== "(") {
          outputQueue += operatorStack.pop() + " ";
        }
        operatorStack.pop();
      }
    }
    while (operatorStack.length > 0) {
      outputQueue += operatorStack.pop() + " ";
    }
    return outputQueue.trim();
  }

function solvePostfix(postfix) {
    let resultStack = [];
    postfix = postfix.trim().split(/\s+/);
    for (let i = 0; i < postfix.length; i++) {
      const current = postfix[i];
      if (isNumeric(current)) {
        resultStack.push(current);
      } else {
        let a = Number(resultStack.pop());
        let b = Number(resultStack.pop());
        if (current === "+") {
          resultStack.push(a + b);
        } else if (current === "-") {
          resultStack.push(b - a);
        } else if (current === "*") {
          resultStack.push(a * b);
        } else if (current === "/") {
          if (a === 0) {
            throw Error("TypeError: Devision by zero.")
          }
          resultStack.push(b / a);
        } else if (current === "^") {
          resultStack.push(Math.pow(b, a));
        }
      }
    }
    if (resultStack.length > 1) {
      return "error";
    } else {
      return Number(resultStack.pop());
    }
  }
