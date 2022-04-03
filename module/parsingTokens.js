export function parsingTokens(input) {
    const tokens = [];
    let state = 0;
    let token = '';
    let i = 0;
    try {
        while (i < input.length) {
            let c = input[i];
            switch (state) {
                case 0:
                    token = '';
                    state = initState(c);
                    if (state == 0) { i++; }
                    break;
                case 1:
                    state = s1(c);
                    switch (state) {
                        case 1:
                        case 2:
                        case 3:
                            token += c;
                            i++;
                            break;
                        case 0:
                            tokens.push({
                                type: 'Number',
                                value: token
                            });
                            break;
                    }
                    break;
                case 2:
                    state = s2(c);
                    switch (state) {
                        case 2:
                        case 3:
                            token += c;
                            i++;
                            break;
                        case 0:
                            tokens.push({
                                type: 'Number',
                                value: token
                            });
                            break;
                    }
                    break;
                case 3:
                    state = s3(c);
                    switch (state) {
                        case 4:
                        case 5:
                            token += c;
                            i++;
                            break;
                        case 7:
                            tokens.push({
                                type: 'Number',
                                value: token.slice(0, -1)
                            });
                            token = token[token.length - 1] + c;
                            i++;
                            break;
                        case 0:
                            tokens.push({
                                type: 'Number',
                                value: token.slice(0, -1)
                            });
                            tokens.push({
                                type: 'Identifier',
                                value: token[token.length - 1]
                            });
                            i++;
                            break;
                    }
                    break;
                case 4:
                    if (/\d/.test(c)) {
                        token += c;
                        state = 5;
                        i++;
                    } else {
                        throw c;
                    }
                    break;
                case 5:
                    if (/\d/.test(c)) {
                        token += c;
                        i++;
                    } else {
                        state = 0;
                        tokens.push({
                            type: 'Number',
                            value: token
                        });
                    }
                    break;
                case 6:
                    state = 0;
                    tokens.push({
                        type: 'Operator',
                        value: c
                    });
                    i++;
                    break;
                case 7:
                    if (/\w/.test(c)) {
                        token += c;
                        i++;
                    } else {
                        state = 0;
                        tokens.push({
                            type: 'Identifier',
                            value: token
                        });
                    }
                    break;
                case 8:
                    state = 0;
                    pushSeparator(c, tokens);
                    i++;
                    break;
            }
        }

        switch (state) {
            case 1:
            case 2:
            case 5:
                tokens.push({
                    type: 'Number',
                    value: token
                });
                break;
            case 3:
                tokens.push({
                    type: 'Number',
                    value: token.slice(0, -1)
                });
                tokens.push({
                    type: 'Identifier',
                    value: token[token.length - 1]
                });
                break;
            case 4:
                tokens.push({
                    type: 'Number',
                    value: token.slice(0, -2)
                });
                tokens.push({
                    type: 'Identifier',
                    value: token[token.length - 2]
                });
                tokens.push({
                    type: 'Operator',
                    value: token[token.length - 1]
                });
                break;
            case 7:
                tokens.push({
                    type: 'Identifier',
                    value: token
                });
                break;
        }
    } catch (e) {
        throw `Encountered unexpected character ${e} while parsing pattern ${input}`
    }

    return tokens;
}

function initState(c) {
    if (/\d/.test(c)) {
        return 1;
    } else if (/[+*/^-]/.test(c)) {
        return 6;
    } else if (/[a-zA-Z_]/.test(c)) {
        return 7;
    } else if (/[\(\)\,]/.test(c)) {
        return 8;
    } else if (/\s/.test(c)) {
        return 0;
    } else {
        throw c;
    }
}

export function tokensOut(tokens) {
    tokens.forEach(function (item) {
        switch (item.type) {
            case 'Number':
                console.log(`(${item.type}, ${Number(item.value).toExponential()}); `);
                break;
            case 'Operator':
                console.log(`(${item.type}, '${(item.value)}'); `);
                break;
            case 'Identifier':
                console.log(`(${item.type}, "${(item.value)}"); `);
                break;
            case 'LParen':
            case 'RParen':
            case 'Comma':
                console.log(`(${item.type}); `)
                break;
        }
    });
}

function s1(c) {
    if (/\d/.test(c)) {
        return 1;
    } else if (/\./.test(c)) {
        return 2;
    } else if (/[eE]/.test(c)) {
        return 3;
    } else {
        return 0;
    }
}

function s2(c) {
    if (/\d/.test(c)) {
        return 2;
    } else if (/[eE]/.test(c)) {
        return 3;
    } else if (/\w|[+*/^-]|\s/.test(c)) {
        return 0;
    } else {
        throw c;
    }
}

function s3(c) {
    if (/[+-]/.test(c)) {
        return 4;
    } else if (/\d/.test(c)) {
        return 5;
    } else if (/\w/.test(c)) {
        return 7;
    } else if (/\s/.test(c)) {
        return 0;
    } else {
        throw c;
    }
}

function pushSeparator(c, arr) {
    switch (c) {
        case '(':
            arr.push({ type: 'LParen', });
            break;
        case ')':
            arr.push({ type: 'RParen', });
            break;
        case ',':
            arr.push({ type: 'Comma', });
            break;
    }
}