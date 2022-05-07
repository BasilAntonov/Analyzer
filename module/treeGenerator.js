// export function treeGenerator(tokens) {
//     let patterns = Object.assign([], tokens);
//     patterns.push({ type: 'EOF' });
//     let list = {
//         pos: 0,
//         tokens: patterns,
//         next: function () { return this.tokens[this.pos++]; },
//         back: function () { this.pos--; }
//     };
//     return addsub(list, true);
// }

// function addsub(tokens, flag = false) {
//     let value = muldiv(tokens);
//     while (true) {
//         let token = tokens.next();
//         switch (token.type) {
//             case 'Operator':
//                 if (token.value == '+' || token.value == '-') {
//                     value = [token].concat(value, muldiv(tokens));
//                 }
//                 break;
//             case 'EOF':
//                 return value;
//             case 'RParen':
//                 if (!flag) {
//                     tokens.back();
//                     return value;
//                 } else {
//                     throw 'Expected token eof, but got TokenType.Tok_rp';
//                 }
//         }
//     }
// }

// function muldiv(tokens) {
//     let value = exp(tokens);
//     while (true) {
//         let token = tokens.next();
//         switch (token.type) {
//             case 'Operator':
//                 if (token.value == '*' || token.value == '/') {
//                     value = [token].concat(value, exp(tokens));
//                     break;
//                 }
//             case 'EOF':
//             case 'RParen':
//                 tokens.back();
//                 return value;
//         }
//     }
// }

// function exp(tokens) {
//     let answer = [term(tokens)];
//     while (true) {
//         let token = tokens.next();
//         switch (token.type) {
//             case 'Operator':
//                 if (token.value == '^') {
//                     answer.push([token]);
//                     answer.push(term(tokens));
//                     break;
//                 }
//             case 'EOF':
//             case 'RParen':
//                 tokens.back();
//                 let result = [];
//                 for (let i = 0; i < answer.length / 2 - 1; i++) {
//                     result = result.concat(answer[2 * i + 1], answer[2 * i]);
//                 }
//                 return result.concat(answer[answer.length - 1]);
//             case 'Number':
//                 throw 'Expected token operator, but got TokenType.Tok_num'
//         }
//     }
// }

// function term(tokens) {
//     let token = tokens.next();
//     switch (token.type) {
//         case 'Number':
//         case 'Identifier':
//             return [token];
//         case 'LParen':
//             let value = addsub(tokens);
//             token = tokens.next();
//             if (!token || token.type != 'RParen') {
//                 throw 'Expected token Tok_rp, but got TokenType.eof';
//             }
//             return value;
//         case 'Operator':
//             switch (token.value) {
//                 case '-':
//                     return [{ type: 'Neg' }].concat(term(tokens));
//                 case '+':
//                     throw 'No alternative matched while parsing nonterminal F:TokenType.Tok_add';
//                 case '*':
//                     throw 'No alternative matched while parsing nonterminal F:TokenType.Tok_mul';
//                 case '/':
//                     throw 'No alternative matched while parsing nonterminal F:TokenType.Tok_div';
//                 case '^':
//                     throw 'No alternative matched while parsing nonterminal F:TokenType.Tok_exp';
//             }
//             break;
//         case 'EOF':
//             throw 'No alternative matched while parsing nonterminal F:TokenType.eof';
//     }
// }

export function outTree(tree) {
    let tokens = Object.assign([], tree);
    let list = {
        pos: 0,
        tokens: tokens,
        next: function () { return this.tokens[this.pos++]; },
    }
    console.log(printTree(list));
}

function printTree(tree) {
    let token = tree.next();
    switch (token.type) {
        case 'Number':
            return Number(token.value).toExponential();
        case 'Identifier':
            return token.value;
        case 'Operator':
            return `${token.value}(${printTree(tree)}, ${printTree(tree)})`;
        case 'Neg':
            return `neg(${printTree(tree)})`;
    }
}

export function interpretErexpression(tree) {
    let tokens = Object.assign([], tree);
    let list = {
        pos: 0,
        tokens: tokens,
        next: function () { return this.tokens[this.pos++]; },
    }
    return calculate(list);
}

function calculate(tree) {
    let token = tree.next();
    switch (token.type) {
        case 'Number':
            return Number(token.value);
        case 'Identifier':
            return getIdetifier(token.value);
        case 'Operator':
            switch (token.value) {
                case '+':
                    return calculate(tree) + calculate(tree);
                case '-':
                    return calculate(tree) - calculate(tree);
                case '*':
                    return calculate(tree) * calculate(tree);
                case '/':
                    return calculate(tree) / calculate(tree);
                case '^':
                    return Math.pow(calculate(tree), calculate(tree));
            }
            break;
        case 'Neg':
            return -calculate(tree);
    }
}

function getIdetifier(identifier) {
    if (/e|E|exp|EXP|Exp/.test(identifier)) {
        return Math.E;
    } else if (/pi|PI|Pi/.test(identifier)) {
        return Math.PI;
    } else {
        throw `Unknown variable ${identifier}`;
    }
}