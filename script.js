'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const displayMovements = function (movements, sort = false) {
  containerMovements.innerHTML = '';
  //.textContent = 0

  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const html = `
    <div class="movements__row">
      <div class="movements__type movements__type--${type}"> ${
      i + 1
    } ${type}</div>
     
      <div class="movements__value">${mov}€</div>
    </div>`;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${acc.balance}€`;
};

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes}€`;

  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(out)}€`;

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      console.log(arr);
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `${interest}€`;
};

const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};

createUsernames(accounts);

const updateUI = function (acc) {
  //Display movements
  displayMovements(acc.movements);

  //Display balance
  calcDisplayBalance(acc);

  //Display summary
  calcDisplaySummary(acc);

  //console.log('LOGIN');
};

//Event handler
let currentAccount;

btnLogin.addEventListener('click', function (e) {
  //Prevent form from submitting
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  console.log(currentAccount);

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    //Display UI and messsage
    labelWelcome.textContent = `welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;
    //Clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();
    updateUI(currentAccount);
  }
});
btnTransfer.addEventListener(`click`, function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = '';
  //console.log(amount, receiverAcc);

  if (
    amount > 0 &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    //Doing the transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);
    //console.log('Transfer valid');
    //updateUI
    updateUI(currentAccount);
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Number(inputLoanAmount.value);
  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    //Add movement
    currentAccount.movements.push(amount);
    //Update UI
    updateUI(currentAccount);
  }
  inputLoanAmount.value = '';
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    currentAccount?.username === inputCloseUsername.value &&
    currentAccount?.pin === Number(inputClosePin.value)
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    console.log(index);
    //Delete account
    accounts.splice(index, 1);
    // Hide UI
    containerApp.style.opacity = 0;
  }
  inputCloseUsername.value = inputClosePin.value = '';
});

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  sorted = !sorted;
  displayMovements(currentAccount.movements, sorted);
});
//console.log(accounts); //stw
// console.log(username);
//console.log(containerMovements.innerHTML);

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////

//Simple Array methods

// let arr = ['a', 'b', 'c', 'd', 'e'];
// //slice
// console.log(arr.slice(2));
// console.log(arr.slice(2, 4));
// console.log(arr.slice(-2));

// //splice

// //console.log(arr.splice(2));
// arr.splice(-1);
// console.log(arr);
// arr.splice(1, 2);
// console.log(arr);
// //reverse
// arr = ['a', 'b', 'c', 'd', 'e'];
// const arr2 = ['j', 'i', 'h', 'g', 'f'];
// console.log(arr2.reverse());
// console.log(arr2);

// //concat
// const letters = arr.concat(arr2);
// console.log([...arr, ...arr2]);

// //join
// console.log(letters.join(' - '));

/////////////////////////////
//The new 'at' Method
/*
const arr = [23, 11, 64];
console.log(arr[0]);
console.log(arr.at(0));

//getting last array element
console.log(arr[arr.length - 1]);
console.log(arr.slice(-1)[0]);
console.log(arr.at(-1));

console.log('jonas .at(0)');
console.log('jonas .at(-1)');
*/

//////////////////////////////////

//for each method
// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// for (const movement of movements) {
//   if (movement > 0) {
//     console.log(`You deposited ${movement}`);
//   } else {
//     console.log(`You withdrew ${Math.abs(movement)}`);
//   }
// }
// console.log('-----FOREACH-----');
// movements.forEach(function (mov, i, arr) {
//   if (mov > 0) {
//     console.log(`Movement ${i + 1}: You deposited ${mov}`);
//   } else {
//     console.log(`Movement ${i + 1}: You withdrew ${Math.abs(mov)}`);
//   }
// });

/*
const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

currencies.forEach(function (value, key, map) {
  console.log(`${key}: ${value}`);
});

//set
const currenciesUnique = new Set(['USD', 'GBP', 'USD', 'EUR', 'EUR']);

console.log(currenciesUnique);

currenciesUnique.forEach(function (value, _, map) {
  console.log(`${value}: ${value}`);
});
*/

///////////////////////////
//Coding challenge #1
// const dogsJulia = [9, 16, 6, 8, 3];
// const dogsKate = [10, 5, 6, 1, 4];
// dogsJulia.shift(0);
// dogsJulia.splice(-2);
// const checkDogs = dogsJulia.concat(dogsKate);
// checkDogs.forEach(function (dog, n) {
//   if (dog >= 3) {
//     console.log(`Dog number ${n + 1} is an adult, and is ${dog} years old`);
//   } else if (dog < 3) {
//     console.log(`Dog number ${n + 1} is still a puppy 🐶.`);
//   }
// });

// const checkDogs = function (dogsJulia, dogsKate) {
//   dogsJulia.shift(0);
//   dogsJulia.splice(-2);
//   const totalDogs = dogsJulia.concat(dogsKate);
//   totalDogs.forEach(function (dog, n) {
//     if (dog >= 3) {
//       console.log(`Dog number ${n + 1} is an adult, and is ${dog} years old`);
//     } else if (dog < 3) {
//       console.log(`Dog number ${n + 1} is still a puppy 🐶.`);
//     }
//   });
// };
// console.log('---- Data 1 -----');
// checkDogs([3, 5, 2, 12, 7], [4, 1, 15, 8, 3]);
// console.log('---- Data 2 -----');
// checkDogs([9, 16, 6, 8, 3], [10, 5, 6, 1, 4]);

///////////////////////////////////
// The map method

// const euroToUsd = 1.1;

// const movementsUSD = movements.map(function (mov) {
//   return mov * euroToUsd;
// });
// console.log(movements);
// console.log(movementsUSD);

// const movementsUSDfor = [];
// for (const mov of movements) movementsUSDfor.push(mov * euroToUsd);
// console.log(movementsUSDfor);

// const movementsUSDarrow = movements.map(mov => mov * euroToUsd);
// console.log(movementsUSDarrow);

// const movementsDescriptions = movements.map(
//   (mov, i) =>
//     `Movement ${i + 1}: You ${mov > 0 ? 'deposited' : 'withdrew'} ${Math.abs(
//       mo
//     )}`
// );

// console.log(movementsDescriptions);

/////////////////////////////////////
// The Filter Method

// const deposits = movements.filter(function (mov) {
//   return mov > 0;
// });
// console.log(movements);
// console.log(deposits);

// const depositsFor = [];
// for (const mov of movements) if (mov > 0) depositsFor.push(mov);
// console.log(depositsFor);

// const withDrawals = movements.filter(drawn => drawn < 0);

// console.log(withDrawals);

///////////////////////////////
//reduce

// console.log(movements);

// //accumulator -> snowball
// // const balance = movements.reduce(function (acc, cur, i, arr) {
// //   console.log(`Iteration ${i}: ${acc}`);
// //   return acc + cur;
// // }, 0);

// const balance = movements.reduce((acc, cur) => acc + cur, 0);
// console.log(balance);

// let balance2 = 0;
// for (const mov of movements) balance2 += mov;
// console.log(balance2);

// // Maximum value
// const max = movements.reduce((acc, mov) => {
//   if (acc > mov) return acc;
//   else return mov;
// }, movements[0]);
// console.log(max);

//////////////////////////////
//Coding challenge #2

// const calcAverageHumanAge = function (ageDogs) {
//   const ageHuman = ageDogs.map(ad => {
//     if (ad <= 2) return 2 * ad;
//     else if (ad > 2) return 16 + ad * 4;
//   });
//   console.log(ageHuman);

//   const filterAge = ageHuman.filter(fA => fA >= 18);
//   console.log(filterAge);

//   const averageAge =
//     filterAge.reduce((aA, curr) => aA + curr, 0) / filterAge.length;
//   console.log(averageAge);
// };
// console.log('---------------------------------');
// calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]);
// console.log('---------------------------------');
// calcAverageHumanAge([16, 6, 10, 5, 6, 1, 4]);
// console.log('---------------------------------');
////////////////////////////////////
// The magic of chaining methods

// const euroToUsd = 1.1;
// console.log(movements);

// //pipline
// const totalDepositesUSD = movements
//   .filter(mov => mov < 0)
//   .map((mov, i, arr) => {
//     //console.log(arr);
//     return mov * euroToUsd;
//   })
//   //.map(mov => mov * euroToUsd)
//   .reduce((acc, mov) => acc + mov, 0);
// console.log(totalDepositesUSD);

/////////////////////////////////////////
//Coding Challenge #3

// const calcAverageHumanAge2 = ageDogs =>
//   ageDogs
//     .map(ad => (ad <= 2 ? 2 * ad : 16 + ad * 4))
//     .filter(aF => aF >= 18)
//     .reduce((aA, curr, i, arr) => aA + curr / arr.length, 0);

// console.log('---------------------------------');
// console.log(calcAverageHumanAge2([5, 2, 4, 1, 15, 8, 3]));
// console.log('---------------------------------');
// console.log(calcAverageHumanAge2([16, 6, 10, 5, 6, 1, 4]));
// console.log('---------------------------------');

//////////////////////////////////////////////////
// The Find Method

// const firstWithdrawal = movements.find(mov => mov < 0);

// console.log(movements);
// console.log(firstWithdrawal);

// console.log(accounts);

// const account = accounts.find(acc => acc.owner === 'Jessica Davis');

// console.log(account);

///////////////////////////////////////////////////
//Implementing Login

///////////////////////////////////////////////////
// The Findindex Method
/////////////////////////////////////////////////
// some and every

// console.log(movements);

// //equality
// console.log(movements.includes(-130));

// //some: condition
// console.log(movements.some(mov => mov === -130));
// const anyDeposits = movements.some(mov => mov > 1500);
// console.log(anyDeposits);

// // every
// console.log(movements.every(mov => mov > 0));
// console.log(account4.movements.every(mov => mov > 0));

// // Seperate callback
// const deposit = mov => mov > 0;
// console.log(movements.some(deposit));
// console.log(movements.every(deposit));
// console.log(movements.filter(deposit));

/////////////////////////////////////////////
//flat and flatMap

// const arr = [[1, 2, 3], [4, 5, 6], 7, 8];
// console.log(arr.flat());

// const arrDeep = [[[1, 2], 3], [4, [5, 6]], 7, 8];
// console.log(arrDeep.flat(2));

// const accountMovements = accounts.map(acc => acc.movements);
// console.log(accountMovements);
// const allMovements = accountMovements.flat();
// console.log(allMovements);
// const overBallance = allMovements.reduce((acc, mov) => acc + mov, 0);
// console.log(overBallance);
// //flat
// const overalBallance = accounts
//   .map(acc => acc.movements)
//   .flat()
//   .reduce((acc, mov) => acc + mov, 0);
// console.log(overalBallance);

// //flatMap
// const overalBallance2 = accounts
//   .flatMap(acc => acc.movements)
//   .reduce((acc, mov) => acc + mov, 0);
// console.log(overalBallance2);

////////////////////////////////////////////////
//Sorting Arrays

//Strings
//
///////////////////////////////
//more ways of creating arrays

// const arr = [1, 2, 3, 4, 5, 6, 7];
// console.log(new Array(1, 2, 3, 4, 5, 6, 7));

// //empty arrays + fill method
// const x = new Array(7);
// console.log(x);

// x.fill(1, 3, 5);
// console.log(x);

// arr.fill(23, 2, 6);
// console.log(arr);

//array.from

// const y = Array.from({ length: 7 }, () => 1);

// console.log(y);

// const z = Array.from({ length: 7 }, (_, i) => i + 1);

// console.log(z);

// Array.from;

///////////////////////////////////
//Array Methods Practice

//1
// const bankDepositSum = accounts
//   .flatMap(acc => acc.movements)
//   .filter(mov => mov > 0)
//   .reduce((sum, cur) => sum + cur, 0);

// console.log(bankDepositSum);

// //2
// // const numDeposits1000 = accounts
// //   .flatMap(acc => acc.movements)
// //   .filter(mov => mov > 1000).length;

// // console.log(numDeposits1000);

// const numDeposits1000 = accounts
//   .flatMap(acc => acc.movements)
//   .reduce((count, cur) => (cur >= 1000 ? ++count : count), 0);

// console.log(numDeposits1000);

// //prefixed ++ operator
// let a = 10;
// console.log(++a);
// console.log(a);

// //3
// const { deposits, withdrawals } = accounts
//   .flatMap(acc => acc.movements)
//   .reduce(
//     (sums, cur) => {
//       // cur > 0 ? (sums.deposits += cur) : (sums.withdrawals += cur);
//       sums[cur > 0 ? 'deposits' : 'withdrawals'] += cur;
//       return sums;
//     },
//     { deposits: 0, withdrawals: 0 }
//   );
// console.log(deposits, withdrawals);

// //4

// //title case

// const convertTitleCase = function (title) {
//   const capitalize = str => str[0].toUpperCase() + str.slice(1);
//   const exceptions = ['a', 'an', 'the', 'but', 'or', 'on', 'in', 'with'];

//   const titleCase = title
//     .toLowerCase()
//     .split(' ')
//     .map(word =>
//       exceptions.includes(word) ? word : word[0].toUpperCase() + word.slice(1)
//     )
//     .join(' ');
//   return capitalize(titleCase);
// };

// console.log(convertTitleCase('this is a nice title'));
// console.log(convertTitleCase('this is a LONG title but not to long'));
// console.log(convertTitleCase('this is a LONG title but n ot too long'));
// console.log(convertTitleCase('and here is another title with an EXAMPLE'));

/////////////////////////////////////////////////////////
//challenge #4
const dogs = [
  { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
  { weight: 8, curFood: 200, owners: ['Matilda'] },
  { weight: 13, curFood: 275, owners: ['Sarah', 'John'] },
  { weight: 32, curFood: 340, owners: ['Michael'] },
];

// //original attempts
// //1
// dogs.forEach(function (dog) {
//   const recommendedFood = dog.weight ** 0.75 * 28;
//   dog.recFood = Math.trunc(recommendedFood);
// });
// console.log(...dogs);

// //2
// const findSarah = dogs.find(arr => arr.owners.find(name => name === 'Sarah'));

// if (findSarah.curFood > findSarah.recFood) {
//   console.log('Overfeeding');
// } else {
//   console.log('Underfeeding');
// }

// //console.log(findSarah);

// //3 - 4
// const ownersEatTooMuch = [];
// const ownersEatTooLittle = [];
// const moreOrLess = dogs.forEach(function (dog) {
//   if (dog.curFood > dog.recFood) return ownersEatTooMuch.push(dog.owners);
//   else return ownersEatTooLittle.push(dog.owners);
// });

// const ETM = ownersEatTooMuch.flat();
// const ETL = ownersEatTooLittle.flat();

// console.log(`${ETM[0]} and ${ETM[1]} and ${ETM[2]}'s dogs eat too much!`);
// console.log(`${ETL[0]} and ${ETL[1]} and ${ETL[2]}'s dogs eat too little!`);

// //5

// const sameAmount = dogs.forEach(dog =>
//   dog.curFood === dog.recFood ? console.log('true') : console.log('false')
// );

// //6
// const okayAmount = dogs.forEach(dog =>
//   dog.curFood > dog.recFood * 0.9 && dog.curFood < dog.recFood * 1.1
//     ? console.log('true')
//     : console.log('false')
// );

// //7
// const dogsEatOkay = [];

// const okayAmount2 = dogs.forEach(dog =>
//   dog.curFood > dog.recFood * 0.9 && dog.curFood < dog.recFood * 1.1
//     ? dogsEatOkay.push(dog)
//     : console.log('false')
// );
// console.log(...dogsEatOkay);

// //8
// const sortDogs = [];

// sortDogs.push(...dogs);

// sortDogs.sort((a, b) => a.recFood - a.recFood);

// console.log(...sortDogs);

//imporvements
//1
// dogs.forEach(function (dog) {
//   const recommendedFood = dog.weight ** 0.75 * 28;
//   dog.recFood = Math.trunc(recommendedFood);
// });
// console.log(...dogs);

// //2
// const findSarah = dogs.find(arr => arr.owners.find(name => name === 'Sarah'));

// if (findSarah.curFood > findSarah.recFood) {
//   console.log('Overfeeding');
// } else {
//   console.log('Underfeeding');
// }

// //console.log(findSarah);

// //3
// // const ownersEatTooMuch = [];
// // const ownersEatTooLittle = [];
// // const moreOrLess = dogs.forEach(function (dog) {
// //   if (dog.curFood > dog.recFood) return ownersEatTooMuch.push(dog.owners);
// //   else return ownersEatTooLittle.push(dog.owners);
// // });

// const more = dogs
//   .filter(dog => dog.curFood > dog.recFood)
//   .flatMap(own => own.owners);
// const less = dogs
//   .filter(dog => dog.curFood < dog.recFood)
//   .flatMap(own => own.owners);

// // const ETM = .flat();
// // const ETL = ownersEatTooLittle.flat();

// //4

// console.log(` ${more.join(' and ')}'s dogs eat too much!`);
// console.log(`${less.join(' and ')}'s dogs eat too little!`);

// //5

// const sameAmount = dogs.some(dog => dog.curFood === dog.recFood);

// console.log(sameAmount);
// //6
// const okayAmount = dogs.some(
//   dog => dog.curFood > dog.recFood * 0.9 && dog.curFood < dog.recFood * 1.1
// );
// console.log(okayAmount);
// //7

// const eatOkay = dogs.filter(
//   dog => dog.curFood > dog.recFood * 0.9 && dog.curFood < dog.recFood * 1.1
// );
// console.log(...eatOkay);

// //8

// const sortDogs = dogs.sort((a, b) => a.recFood - b.recFood);

// console.log(...sortDogs);

//

//
//
/////////////////////////////////////////
////////////
/////////////////
///////////////
///////////
/////////////////
/////////////////

//do challenge #4 again with out looking at code.

//1

dogs.forEach(dog => (dog.recFood = Math.trunc(dog.weight ** 0.75 * 28)));

console.log(...dogs);

//2

const findSarah = dogs.find(dog => dog.owners.find(name => name === 'Sarah'));

findSarah.curFood > findSarah.recFood
  ? console.log('Overfeeding')
  : console.log('Underfeeding');

console.log(findSarah);

//3 - 4
const tooMuch = dogs
  .filter(dog => dog.curFood > dog.recFood)
  .flatMap(dog => dog.owners)
  .join(' and ');
const tooLittle = dogs
  .filter(dog => dog.curFood < dog.recFood)
  .flatMap(dog => dog.owners)
  .join(' and ');

console.log(`${tooMuch}'s dogs eat too much!`);
console.log(`${tooLittle}'s dogs eat too little!`);

//5

const sameAmount = dogs.some(dog => dog.curFood === dog.recFood);

console.log(sameAmount);

//6
const okayAmount = dogs.some(
  dog => dog.curFood > dog.recFood * 0.9 && dog.curFood < dog.recFood * 1.1
);
console.log(okayAmount);

//7

const okayAmount2 = dogs.filter(
  dog => dog.curFood > dog.recFood * 0.9 && dog.curFood < dog.recFood * 1.1
);

console.log(...okayAmount2);

//8

const recAscending = dogs.sort((a, b) => a.recFood - b.recFood);

console.log(...recAscending);
