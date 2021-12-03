// const assert = require("assert");
const index = require("./index");

const myMoney = index.giveMoney(4, 5)

// assert.equal(myMoney, 13) // Crash if test is unsuccessful
// For example if we change the 13 by another value, it'll crash
// assert helps to test code


// We can also use jest
// Don't forget to add the package with "npm install --save-dev jest"
test('adds 1+2 equals to 3', () => {
    const myMoney = index.giveMoney(4, 5)
    expect(myMoney).toBe(13)
})
