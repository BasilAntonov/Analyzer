export function treeGenerator(tokens) {
    const patterns = Object.assign([], tokens);
    patterns.push({ type: 'EOF' });
    const list = {
        pos: 0,
        tokens: patterns,
        next: function () { this.pos++; },
        el: function () { return this.tokens[this.pos]; }
    };
    return E(list);
}

function E(list) {
    const t = T(list);
    return E1(list, t);
}

function E1(list, t1) {
    const el = list.el();
    if (el.type == 'Operator' && (el.value == '+' || el.value == '-')) {
        list.next();
        const t2 = T(list);
        return E1(list, [el].concat(t1, t2));
    } else {
        return t1;
    }
}

function T(list) {
    const f = F(list);
    return T1(list, f);
}

function T1(list, f1) {
    const el = list.el();
    if (el.type == 'Operator' && (el.value == '*' || el.value == '/')) {
        list.next();
        const f2 = T(list);
        return T1(list, [el].concat(f1, f2));
    } else {
        return f1;
    }
}

function F(list) {
    const v = V(list);
    return F1(list, v);
}

function F1(list, v) {
    const el = list.el();
    if (el.type == 'Operator' && el.value == '^') {
        list.next();
        const f = F(list);
        return [el].concat(v, f);
    } else {
        return v;
    }
}

function V(list) {
    let result = null;
    switch (list.el().type) {
        case 'LParen':
            list.next();
            result = E(list);
            if (list.el().type != 'RParen') {
                throw 'Expected token Tok_rp, but got TokenType.eof';
            }
            list.next();
            return result;
        case 'Identifier':
            result = list.el();
            list.next()
            return [result];
        case 'Number':
            result = list.el();
            list.next();
            return [result];
        case 'Operator':
            switch (list.el().value) {
                case '-':
                    list.next();
                    return [{ type: 'Neg' }].concat(V(list));
                case '+':
                    throw 'No alternative matched while parsing nonterminal F:TokenType.Tok_add';
                case '*':
                    throw 'No alternative matched while parsing nonterminal F:TokenType.Tok_mul';
                case '/':
                    throw 'No alternative matched while parsing nonterminal F:TokenType.Tok_div';
                case '^':
                    throw 'No alternative matched while parsing nonterminal F:TokenType.Tok_exp';
            }
        default:
            throw 'No alternative matched while parsing nonterminal F:TokenType.eof';
    }
}