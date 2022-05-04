'use strict'

const stateToTok = new Map([
  [1, 'lparen'],
  [2, 'rparen'],
  [3, 'mul'],
  [4, 'plus'],
  [5, 'comma'],
  [6, 'minus'],
  [7, 'div'],
  [8, 'pow'],
  [9, 'id'],
  [10, 'number'],
  [11, 'number'],
  [14, 'number'],
  [15, null],
])

const acceptingStatesSet = new Set(stateToTok.keys())

const transitionTable = {
  0: function (ch) {
    if (ch === '(') return 1
    else if (ch === ')') return 2
    else if (ch === '*') return 3
    else if (ch === '+') return 4
    else if (ch === ',') return 5
    else if (ch === '-') return 6
    else if (ch === '/') return 7
    else if (ch === '^') return 8
    else if (ch === '_' || (ch >= 'a' && ch <= 'z')) return 9
    else if ((ch >= '0' && ch <= '9')) return 10
    else if (ch === ' ') return 15
  },
  9: function (ch) {
    if (ch === '_' || (ch >= '0' && ch <= '9') || (ch >= 'a' && ch <= 'z')) return 9
  },
  10: function (ch) {
    if (ch === '.') return 11
    else if (ch === 'E' || ch === 'e') return 12
    else if (ch >= '0' && ch <= '9') return 10
  },
  11: function (ch) {
    if (ch === 'E' || ch === 'e') return 12
    else if (ch >= '0' && ch <= '9') return 11
  },
  12: function (ch) {
    if (ch === '+' || ch === '-') return 13
    else if (ch >= '0' && ch <= '9') return 14
  },
  13: function (ch) {
    if (ch >= '0' && ch <= '9') return 14
  },
  14: function (ch) {
    if (ch >= '0' && ch <= '9') return 14
  },
  15: function (ch) {
    if (ch === ' ') return 15
  },
}

module.exports = function * (input) {
  let curChIx = 0

  for (;;) {
    const startChIx = curChIx
    let lastAccChIx = curChIx
    let accSt = -1
    let curSt = 0
    while (curSt >= 0) {
      if (acceptingStatesSet.has(curSt)) {
        lastAccChIx = curChIx
        accSt = curSt
      }
      if (curChIx >= input.length) break
      curSt = transitionTable[curSt]?.(input[curChIx])
      curChIx+=1
      if (curSt === undefined) break
    }

    const lastReadChIx = curChIx
    let tok = stateToTok.get(accSt)
    curChIx = lastAccChIx
    if (tok) yield [tok, input.substring(startChIx, lastAccChIx)]
    else if (tok === undefined) {
      if (curChIx >= input.length) for(;;) yield ['%eof', null]
      else throw new Error("Unexpected input: " + input.substring(startChIx, lastReadChIx))
    }
  }
}
