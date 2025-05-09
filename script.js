"use strict";

// 983,480 => 5th May 2025

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: "Jonas Schmedtmann",
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    "2019-11-18T21:31:17.178Z",
    "2019-12-23T07:42:02.383Z",
    "2020-01-28T09:15:04.904Z",
    "2020-04-01T10:17:24.185Z",
    "2020-05-08T14:11:59.604Z",
    "2025-05-02T17:01:17.194Z",
    "2025-05-01T23:36:17.929Z",
    "2025-05-06T10:51:36.790Z",
  ],
  currency: "EUR",
  locale: "pt-PT", // de-DE
};

const account2 = {
  owner: "Jessica Davis",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    "2019-11-01T13:15:33.035Z",
    "2019-11-30T09:48:16.867Z",
    "2019-12-25T06:04:23.907Z",
    "2020-01-25T14:18:46.235Z",
    "2020-02-05T16:33:06.386Z",
    "2020-04-10T14:43:26.374Z",
    "2020-06-25T18:49:59.371Z",
    "2020-07-26T12:01:20.894Z",
  ],
  currency: "USD",
  locale: "en-US",
};

const accounts = [account1, account2];

// Elements
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");

const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");

const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");

const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");

const formatMovementDate = function (date, locale) {
  const calDaysPassed = (date1, date2) =>
    Math.round(Math.abs(date2 - date1) / (24 * 60 * 60 * 1000));

  const daysPassed = calDaysPassed(new Date(), date);
  console.log(daysPassed);

  if (daysPassed === 0) return "Today";
  if (daysPassed === 1) return "Yesterday";
  if (daysPassed <= 7) return `${daysPassed} days ago`;

  // const day = `${date.getDate()}`.padStart(2, 0);
  // const month = `${date.getMonth() + 1}`.padStart(2, 0);
  // const year = date.getFullYear();

  // return `${day}/${month}/${year}`;

  return new Intl.DateTimeFormat(locale).format(date);
};

const formatCur = function (value, locale, currency) {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
  }).format(value);
};
// Display Movements

const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = "";

  const combinedMovDates = acc.movements.map((mov, i) => ({
    movement: mov,
    movementDate: acc.movementsDates.at(i),
  }));

  // const movs = sort
  //   ? acc.movements.slice().sort((a, b) => b - a)
  //   : acc.movements;

  if (sort) combinedMovDates.sort((a, b) => a.movement - b.movement);

  combinedMovDates.forEach(function (obj, i) {
    const { movement, movementDate } = obj;
    const type = movement > 0 ? `deposit` : `withdrawal`;

    const date = new Date(movementDate);
    const displayDate = formatMovementDate(date, acc.locale);
    const formattedMov = formatCur(movement, acc.locale, acc.currency);

    const html = `
      <div class="movements__row">
            <div class="movements__type 
            movements__type--${type}">${i + 1} ${type}</div>
            <div class="movements__date">${displayDate}</div>
            <div class="movements__value">${formattedMov}</div>
      </div>`;

    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
};

// Display Balance

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, cur) => acc + cur, 0);
  labelBalance.textContent = formatCur(acc.balance, acc.locale, acc.currency);
};

// Display Summary

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter((mov) => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);

  labelSumIn.textContent = formatCur(incomes, acc.locale, acc.currency);

  const out = acc.movements
    .filter((mov) => mov < 0)
    .reduce((acc, cur) => acc + Math.abs(cur), 0);

  labelSumOut.textContent = formatCur(Math.abs(out), acc.locale, acc.currency);

  const interest = acc.movements
    .filter((mov) => mov > 0)
    .map((deposit) => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      // console.log(arr);
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = formatCur(interest, acc.locale, acc.currency);
};

// Create Usernames

const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(" ")
      .map((name) => name.at(0))
      .join("");
  });
};
createUsernames(accounts);
// console.log(accounts);

const updateUI = function (acc) {
  // Display movements
  displayMovements(acc);
  // Display balance
  calcDisplayBalance(acc);
  // Display summary
  calcDisplaySummary(acc);
};

// Event Handler

let currentAccount;

// FAKE ALWAYS LOGGED IN

currentAccount = account1;
updateUI(currentAccount);
containerApp.style.opacity = 100;

btnLogin.addEventListener("click", function (event) {
  // Prevent form from submitting
  event.preventDefault();

  currentAccount = accounts.find(
    (acc) => acc.username === inputLoginUsername.value
  );
  // console.log(currentAccount);

  if (currentAccount?.pin === +inputLoginPin.value) {
    // Display a UI and welcome message.
    labelWelcome.textContent = `Welcome back, ${currentAccount.owner
      .split(" ")
      .at(0)}`;
    containerApp.style.opacity = 100;

    // const now = new Date();
    // const day = `${now.getDate()}`.padStart(2, 0);
    // const month = `${now.getMonth() + 1}`.padStart(2, 0);
    // const year = now.getFullYear();
    // const hour = `${now.getHours()}`.padStart(2, 0);
    // const min = `${now.getMinutes()}`.padStart(2, 0);
    // labelDate.textContent = `${day}/${month}/${year}, ${hour}:${min}`;

    // Experimenting with API
    const now = new Date();
    const options = {
      hour: "numeric",
      minute: "numeric",
      day: "numeric",
      month: "numeric",
      year: "numeric",
    };
    // const locale = navigator.language;
    // console.log(locale);

    labelDate.textContent = new Intl.DateTimeFormat(
      currentAccount.locale,
      options
    ).format();

    // day/month/year

    // Clear input fields
    inputLoginUsername.value = inputLoginPin.value = "";
    inputLoginPin.blur();

    // Update UI
    updateUI(currentAccount);
  }
});

btnTransfer.addEventListener("click", function (e) {
  e.preventDefault();

  const amount = +inputTransferAmount.value;
  const receiverAcc = accounts.find(
    (acc) => acc.username === inputTransferTo.value
  );

  inputTransferAmount.value = inputTransferTo.value = "";

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    // Doing the transfer.
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    // Add transfer date
    currentAccount.movementsDates.push(new Date());
    receiverAcc.movementsDates.push(new Date().toISOString());

    // Update UI
    updateUI(currentAccount);
  }
});

btnLoan.addEventListener("click", function (e) {
  e.preventDefault();

  const amount = Math.floor(inputLoanAmount.value);

  if (
    amount > 0 &&
    currentAccount.movements.some((mov) => mov >= amount * 0.1)
  ) {
    // Add loan date
    currentAccount.movementsDates.push(new Date().toISOString());

    // Add movement
    currentAccount.movements.push(amount);
    updateUI(currentAccount);
    inputLoanAmount.value = "";
  }
});

btnClose.addEventListener("click", function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    +inputClosePin.value === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      (acc) => acc.username === currentAccount.username
    );
    console.log(index);
    accounts.splice(index, 1);

    // Hide UI
    containerApp.style.opacity = 0;
  }

  inputCloseUsername.value = inputClosePin.value = "";
});

let sorted = false;
btnSort.addEventListener("click", function (e) {
  e.preventDefault();
  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

// const currencies = new Map([
//   ['USD', 'United States dollar'],
//   ['EUR', 'Euro'],
//   ['GBP', 'Pound sterling'],
// ]);

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////

// let arr = ['a', 'b', 'c', 'd', 'e'];

// SLICE
// console.log(arr.slice(2, 4));
// console.log(arr.slice(-2));
// console.log(arr.slice(0, -3));
// console.log(arr.slice());
// console.log([...arr]);

// SPLICE

// changes the array

// console.log(arr.splice(2));
// arr.splice(1, 2);
// console.log(arr);
// console.log(arr);

// REVERSE

// const arr2 = ['j', 'i', 'h', 'g', 'f'];
// console.log(arr2.reverse());
// console.log(arr2);

// CONCAT

// const letters = arr.concat(arr2);
// console.log(letters);
// console.log([...arr, ...arr2]);

// JOIN
// console.log(letters.join(' - '));

// const arr = [23, 11, 64];
// console.log(arr[0]);
// console.log(arr.at(0));
// console.log(arr[arr.length - 1]);
// console.log(arr.slice(-1)[0]);
// console.log(arr.at(1));

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// for (const [index, move] of movements.entries()) {
//   if (move > 0) {
//     console.log(`Movement ${index + 1}: You deposited ${move}`);
//   } else {
//     console.log(`Movement ${index + 1}: You withdrew ${Math.abs(move)}`);
//   }
// }

// movements.forEach(function (move, i, array) {
//   if (move > 0) {
//     console.log(`Movement ${i + 1}: You deposited ${move}`);
//   } else {
//     console.log(`Movement ${i + 1}: You withdrew ${Math.abs(move)}`);
//   }
// });

// const currencies = new Map([
//   ["USD", "United States dollar"],
//   ["EUR", "Euro"],
//   ["GBP", "Pound sterling"],
// ]);

// // MAP
// currencies.forEach(function (value, key, map) {
//   console.log(`${key}: ${value}`);
// });

// // SET

// const currenciesUnique = new Set(["USD", "GBP", "USD", "EUR", "EUR"]);
// console.log(currenciesUnique);
// currenciesUnique.forEach(function (value, _, set) {
//   console.log(`${value}: ${value}`);
// });

///////////////////////////////////////
// Coding Challenge #1

/* 
Julia and Kate are doing a study on dogs. So each of them asked 5 dog owners about their dog's age, and stored the data into an array (one array for each). For now, they are just interested in knowing whether a dog is an adult or a puppy. A dog is an adult if it is at least 3 years old, and it's a puppy if it's less than 3 years old.

Create a function 'checkDogs', which accepts 2 arrays of dog's ages ('dogsJulia' and 'dogsKate'), and does the following things:

1. Julia found out that the owners of the FIRST and the LAST TWO dogs actually have cats, not dogs! So create a shallow copy of Julia's array, and remove the cat ages from that copied array (because it's a bad practice to mutate function parameters)
2. Create an array with both Julia's (corrected) and Kate's data
3. For each remaining dog, log to the console whether it's an adult ("Dog number 1 is an adult, and is 5 years old") or a puppy ("Dog number 2 is still a puppy 🐶")
4. Run the function for both test datasets

HINT: Use tools from all lectures in this section so far 😉

TEST DATA 1: Julia's data [3, 5, 2, 12, 7], Kate's data [4, 1, 15, 8, 3]
TEST DATA 2: Julia's data [9, 16, 6, 8, 3], Kate's data [10, 5, 6, 1, 4]

GOOD LUCK 😀
*/

// const dogsJulia = [3, 5, 2, 12, 7];
// const dogsKate = [4, 1, 15, 8, 3];

// const dogsJulia = [9, 16, 6, 8, 3];
// const dogsKate = [10, 5, 6, 1, 4];
// const checkDogs = function (dogsJulia, dogsKate) {
//   const newDogsJulia = dogsJulia.slice(1, -2);
//   const allDogs = newDogsJulia.concat(dogsKate);

//   allDogs.forEach(function (dog, index, arr) {
//     if (dog >= 3) {
//       console.log(
//         `Dog number ${index + 1} is an adult, and is ${dog} years old`
//       );
//     } else {
//       console.log(`Dog number ${index + 1} is still a puppy 🐶`);
//     }
//   });
// };
// checkDogs(dogsJulia, dogsKate);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

const eurToUsd = 1.1;

// MAP

const movementsUsd = movements.map(function (mov) {
  return mov * eurToUsd;
});

const movementsUsdA = movements.map((mov) => mov * eurToUsd);

// console.log(movements);
// console.log(movementsUsd);
// console.log("arrow", movementsUsdA);

const movementUsdFor = [];
for (const mov of movements) {
  movementUsdFor.push(mov * eurToUsd);
}
// console.log(movementUsdFor);

const movementsDescription = movements.map(
  (move, index) =>
    `Movement ${index + 1}: You ${
      move > 0 ? "deposited" : "withdrew"
    } ${Math.abs(move)}`
);

// console.log(movementsDescription);

// FILTER

// const deposits = movements.filter(function (mov) {
//   return mov > 0;
// });
// console.log(movements);
// console.log(deposits);

// const deposit = [];
// for (const mov of movements) {
//   if (mov > 0) {
//     deposit.push(mov);
//   }
// }
// console.log(deposit);

// const withdrawals = movements.filter((mov) => mov < 0);
// console.log(withdrawals);

// REDUCE

// console.log(movements);

// accumulator -> SNOWBALL

// const balance = movements.reduce(function (accumulator, current, index, arr) {
//   console.log(`Iteration ${index}: ${accumulator}`);
//   return accumulator + current;
// }, 0);

// const balance = movements.reduce((acc, cur) => acc + cur, 0);

// console.log(balance);

// Maximum value

// const max = movements.reduce((accu, mov) => {
//   if (accu > mov) {
//     return accu;
//   } else {
//     return mov;
//   }
// }, movements[0]);
// console.log(max);

///////////////////////////////////////
// Coding Challenge #2

/* 
Let's go back to Julia and Kate's study about dogs. This time, they want to convert dog ages to human ages and calculate the average age of the dogs in their study.

Create a function 'calcAverageHumanAge', which accepts an arrays of dog's ages ('ages'), and does the following things in order:

1. Calculate the dog age in human years using the following formula: if the dog is <= 2 years old, humanAge = 2 * dogAge. If the dog is > 2 years old,
 humanAge = 16 + dogAge * 4.
2. Exclude all dogs that are less than 18 human years old (which is the same as keeping dogs that are at least 18 years old)
3. Calculate the average human age of all adult dogs (you should already know from other challenges how we calculate averages 😉)
4. Run the function for both test datasets

TEST DATA 1: [5, 2, 4, 1, 15, 8, 3]
TEST DATA 2: [16, 6, 10, 5, 6, 1, 4]

GOOD LUCK 😀
*/

// const calcAverageHumanAge = function (dogsJulia, dogsKate) {
//   const allDogs = dogsJulia.concat(dogsKate);

//   const humanAges = allDogs.map((dogAge) => {
//     if (dogAge <= 2) return 2 * dogAge;
//     else return 16 + dogAge * 4;
//   });

//   const filterAges = humanAges.filter((ages) => ages >= 18);

//   const aveAge =
//     filterAges.reduce((accu, cur) => accu + cur, 0) / filterAges.length;
//   return aveAge;
// };

// console.log(
//   calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3], [16, 6, 10, 5, 6, 1, 4])
// );

// PIPELINE

// const eurToUsds = 1.1;
// const totalDeposites = movements
//   .filter((move) => move > 0)
//   .map((mov) => mov * eurToUsds)
//   .reduce((acc, mov) => acc + mov, 0);

// console.log(totalDeposites);

// const calcAverageHumanAge = function (dogsJulia, dogsKate) {
//   const allDogs = dogsJulia.concat(dogsKate);

//   const aveAge = allDogs
//     .map((dogAge) => {
//       dogAge <= 2 ? 2 * dogAge : 16 + dogAge * 4;
//     })
//     .filter((ages) => ages >= 18)
//     .reduce((accu, cur, i, arr) => accu + cur / arr.length, 0);
// };

// FIND

// const firstWithdrawal = movements.find((mov) => mov < 0);
// console.log(movements);
// console.log(firstWithdrawal);

// console.log(accounts);

// const account = accounts.find((acc) => acc.owner === "Jessica Davis");
// console.log(account);

// let _account = {};
// for (const acc of accounts) {
//   if (acc.owner === "Jessica Davis") {
//     _account = acc;
//   }
// }
// console.log(_account);

// FINDLAST

// console.log(movements);
// const lastWithdrawal = movements.findLast((mov) => mov < 0 && mov < -130);
// console.log(lastWithdrawal);

// FINDLASTINDEX

// `You latest large movement was X movements ago`;

const latestLargeMovementIndex = movements.findLastIndex(
  (mov) => Math.abs(mov) > 2000
);

// console.log(
//   `You latest large movement was ${
//     movements.length - latestLargeMovementIndex
//   } movements ago`
// );

// // EQUALITY
// console.log(movements);
// console.log(movements.includes(-130));

// // CONDITION
const anyDeposits = movements.some((mov) => mov > 1500);
// console.log(anyDeposits);

// // EVERY
// console.log(movements.every((mov) => mov > 0));
// console.log(account4.movements.every((mov) => mov > 0));

// // Separate callback
const deposit = (mov) => mov > 0;
// console.log(movements.some(deposit));

// // FLAT
const arr1 = [[1, 2, 3], [4, 5, 6], 7, 8];
// console.log(arr1.flat());

const arrDeep = [[[1, 2], 3], [4, [5, 6]], 7, 8];
// console.log(arrDeep.flat(2));

const accountMovements = accounts.map((acc) => acc.movements);
// console.log(accountMovements);

// const allMovements = accountMovements.flat();
// console.log(allMovements);
// const overallBalance = allMovements.reduce((acc, cur) => acc + cur, 0);
// console.log(overallBalance);

const overallBalance = accounts
  .map((acc) => acc.movements)
  .flat()
  .reduce((acc, cur) => acc + cur, 0);
// console.log(overallBalance);

// // FLATMAP

const overallBalance2 = accounts
  .flatMap((acc) => acc.movements)
  .reduce((acc, cur) => acc + cur, 0);
// console.log(overallBalance2);

///////////////////////////////////////
// Coding Challenge #4

// This time, Julia and Kate are studying the activity levels of different dog breeds.

const breeds = [
  {
    breed: "German Shepherd",
    averageWeight: 32,
    activities: ["fetch", "swimming"],
  },
  {
    breed: "Dalmatian",
    averageWeight: 24,
    activities: ["running", "fetch", "agility"],
  },
  {
    breed: "Labrador",
    averageWeight: 28,
    activities: ["swimming", "fetch"],
  },
  {
    breed: "Beagle",
    averageWeight: 12,
    activities: ["digging", "fetch"],
  },
  {
    breed: "Husky",
    averageWeight: 26,
    activities: ["running", "agility", "swimming"],
  },
  {
    breed: "Bulldog",
    averageWeight: 36,
    activities: ["sleeping"],
  },
  {
    breed: "Poodle",
    averageWeight: 18,
    activities: ["agility", "fetch"],
  },
];

// // YOUR TASKS:
// // 1. Store the the average weight of a "Husky" in a variable "huskyWeight"

const huskyWeight = breeds.find((bre) => bre.breed === "Husky").averageWeight;
// // console.log(huskyWeight);

// // 2. Find the name of the only breed that likes both "running" and "fetch" ("dogBothActivities" variable)
const dogBothActivities = breeds.find(
  (bre) =>
    bre.activities.includes("running") && bre.activities.includes("fetch")
).breed;
// // console.log(dogBothActivities);

// // 3. Create an array "allActivities" of all the activities of all the dog breeds
const allActivities = breeds.flatMap((bre) => bre.activities);
// console.log(allActivities);

// // 4. Create an array "uniqueActivities" that contains only the unique activities (no activity repetitions).
// // HINT: Use a technique with a special data structure that we studied a few sections ago.

const uniqueActivities = [...new Set(breeds.flatMap((bre) => bre.activities))];
// console.log(uniqueActivities);

// // 5. Many dog breeds like to swim. What other activities do these dogs like?
// // Store all the OTHER activities these breeds like to do, in a unique array called "swimmingAdjacent".

const swimmingAdjacent = [
  ...new Set(
    breeds
      .filter((bre) => bre.activities.includes("swimming"))
      .flatMap((bre) => bre.activities)
  ),
];

// // console.log(swimmingAdjacent);

const index = swimmingAdjacent.findIndex((act) => act === "swimming");
// // console.log(index);
swimmingAdjacent.splice(index, 1);
// // console.log(swimmingAdjacent);

// // 6. Do all the breeds have an average weight of 10kg or more? Log to the console whether "true" or "false".

const everyDog = breeds.every((bre) => bre.averageWeight >= 10);
// console.log(everyDog);

// // 7. Are there any breeds that are "active"? "Active" means that the dog has 3 or more activities. Log to the console whether "true" or "false".

const anyDogs = breeds.some((bre) => bre.activities.length >= 3);
// console.log(anyDogs);

// // BONUS: What's the average weight of the heaviest breed that likes to fetch? HINT: Use the "Math.max" method along with the ... operator.

const heaviestDog = breeds
  .filter((bre) => bre.activities.includes("fetch"))
  .map((bre) => bre.averageWeight);
// console.log(Math.max(...heaviestDog));

// // TEST DATA:

// Array Grouping

// console.log(movements);
const groupedMovements = Object.groupBy(movements, (movements) =>
  movements > 0 ? "deposits" : "withdrawals"
);
// console.log(groupedMovements);

const groupedByActivity = Object.groupBy(accounts, (account) => {
  const movementCount = account.movements.length;

  if (movementCount >= 8) return "very active";
  if (movementCount >= 4) return "active";
  if (movementCount >= 1) return "moderate";
  return "inactive";
});
// console.log(groupedByActivity);

// const groupedAccounts = Object.groupBy(accounts, (account) => account.type);
// const groupedAccounts = Object.groupBy(accounts, ({ type }) => type);
// console.log(groupedAccounts);

const arr = [1, 2, 3, 4, 5, 6, 7];
// console.log(new Array(1, 2, 3, 4, 5, 6, 7));

const x = new Array(7);
// console.log(x);
x.fill(1);
x.fill(1, 3, 5);
// console.log(x);

arr.fill(23, 4, 6);
// console.log(arr);

// Array.from

const y = Array.from({ length: 7 }, () => 1);
// console.log(y);

const z = Array.from({ length: 7 }, (_, i) => i + 1);
// console.log(z);

const rndDiceRolls = Array.from(
  { length: 100 },
  () => Math.floor(Math.random() * 6) + 1
);

// console.log(rndDiceRolls);

const movementsUI = Array.from(document.querySelectorAll(".movements__value"));

// console.log(movementsUI);

labelBalance.addEventListener("click", function (e) {
  e.preventDefault();
  const movementsUI = Array.from(
    document.querySelectorAll(".movements__value")
  );
  console.log(movementsUI.map((el) => el.textContent.replace("€", "")));
});

/////////////////////////////////////////////////////
// Non-destructive alternative: toReversed, toSorted, toSpliced, with

// console.log(movements);
// const reversedMov = movements.toReversed();
// console.log(reversedMov);
// console.log(movements);

//

const newMovements = movements.with(1, 200);
// console.log(newMovements);

// 1.
const bankDepositSum = accounts
  .map((acc) => acc.movements)
  .flat()
  .filter((mov) => mov > 0)
  .reduce((sum, cur) => sum + cur, 0);
// console.log(bankDepositSum);

// 2.
// const numDeposits100 = accounts
//   .flatMap((acc) => acc.movements)
//   .filter((mov) => mov > 1000).length;
// console.log(numDeposits100);

const numDeposits100 = accounts
  .flatMap((acc) => acc.movements)
  .reduce((count, cur) => (cur >= 1000 ? count + 1 : count), 0);
// console.log(numDeposits100);

// 3

const { deposits, withdrawals } = accounts
  .flatMap((acc) => acc.movements)
  .reduce(
    (sums, cur) => {
      // cur > 0 ? (sums.deposits += cur) : (sums.withdrawals += cur);
      sums[cur > 0 ? "deposits" : "withdrawals"] += cur;
      return sums;
    },
    { deposits: 0, withdrawals: 0 }
  );

// console.log(deposits, withdrawals);

// 4

// this is a nice title -> This Is a Nice Title

const convertTitleCase = function (title) {
  const capitalize = (str) => str[0].toUpperCase() + str.slice(1);
  const exceptions = ["a", "and", "an", "the", "but", "or", "on", "in", "with"];

  const titleCase = title
    .toLowerCase()
    .split(" ")
    .map((word) => (exceptions.includes(word) ? word : capitalize(word)))
    .join(" ");
  return capitalize(titleCase);
};

// console.log(convertTitleCase("this is a nice title"));
// console.log(convertTitleCase("this is a LONG title but not too long"));
// console.log(convertTitleCase("and here is another title with an EXAMPLE"));

///////////////////////////////////////
// Coding Challenge #4

const dogs = [
  { weight: 22, curFood: 250, owners: ["Alice", "Bob"] },
  { weight: 8, curFood: 200, owners: ["Matilda"] },
  { weight: 13, curFood: 275, owners: ["Sarah", "John"] },
  { weight: 32, curFood: 340, owners: ["Michael"] },
];

// Julia and Kate are still studying dogs, and this time they are studying if dogs are eating too much or too little.
// Eating too much means the dog's current food portion is larger than the recommended portion, and eating too little is the opposite.
// Eating an okay amount means the dog's current food portion is within a range 10% above and 10% below the recommended portion (see hint).

// 1. Loop over the array containing dog objects, and for each dog, calculate the recommended food portion and add it to the object as a new property.
// Do NOT create a new array, simply loop over the array. Forumla: recommendedFood = weight ** 0.75 * 28. (The result is in grams of food, and the weight needs to be in kg)

dogs.forEach((dog) => {
  dog.recommendedFood = Math.floor(dog.weight ** 0.75 * 28);
});
// console.log(dogs);

// 2. Find Sarah's dog and log to the console whether it's eating too much or too little. HINT: Some dogs have multiple owners,
// so you first need to find Sarah in the owners array, and so this one is a bit tricky (on purpose) 🤓
const dogSarah = dogs.find((dog) => dog.owners.includes("Sarah"));

// console.log(
//   `Sarah's dog is eating too ${
//     dogSarah.curFood < dogSarah.recommendedFood ? "little" : "much"
//   }`
// );

// 3. Create an array containing all owners of dogs who eat too much ('ownersEatTooMuch') and an array with all owners of dogs who eat too little ('ownersEatTooLittle').

const ownersEatTooMuch = dogs
  .filter((dog) => dog.curFood > dog.recommendedFood)
  .flatMap((dog) => dog.owners);
// console.log(ownersEatTooMuch);

const ownersEatTooLittle = dogs
  .filter((dog) => dog.curFood < dog.recommendedFood)
  .flatMap((dog) => dog.owners);
// console.log(ownersEatTooLittle);

// 4. Log a string to the console for each array created in 3., like this: "Matilda and Alice and Bob's dogs eat too much!" and "Sarah and
// John and Michael's dogs eat too little!"

// console.log(
//   `${ownersEatTooMuch.join(
//     " and "
//   )}'s dogs eat too much and ${ownersEatTooLittle.join(" and ")}`
// );

// 5. Log to the console whether there is any dog eating EXACTLY the amount of food that is recommended (just true or false)

// const exactlyRec = dogs.some((dog) => dog.curFood === dog.recommendedFood);
// console.log(exactlyRec);

// 6. Log to the console whether there is any dog eating an OKAY amount of food (just true or false)
const okayRec = dogs.some(
  (dog) =>
    dog.curFood > dog.recommendedFood * 0.9 &&
    dog.curFood < dog.recommendedFood * 1.1
);
// console.log(okayRec);

// 7. Create an array containing the dogs that are eating an OKAY amount of food (try to reuse the condition used in 6.)
const okayDogs = dogs.filter(
  (dog) =>
    dog.curFood > dog.recommendedFood * 0.9 &&
    dog.curFood < dog.recommendedFood * 1.1
);
// console.log(okayDogs);

// 8. Create a shallow copy of the dogs array and sort it by recommended food portion in an ascending order
//  (keep in mind that the portions are inside the array's objects)

// const dogsArr = dogs.slice();
// console.log(dogsArr.sort((a, b) => a.recommendedFood - b.recommendedFood));

// HINT 1: Use many different tools to solve these challenges, you can use the summary lecture to choose between them 😉
// HINT 2: Being within a range 10% above and below the recommended portion means: current > (recommended * 0.90) && current < (recommended * 1.10).
// Basically, the current portion should be between 90% and 110% of the recommended portion.

// TEST DATA:
// const dogs = [
//   { weight: 22, curFood: 250, owners: ["Alice", "Bob"] },
//   { weight: 8, curFood: 200, owners: ["Matilda"] },
//   { weight: 13, curFood: 275, owners: ["Sarah", "John"] },
//   { weight: 32, curFood: 340, owners: ["Michael"] },
// ];

// GOOD LUCK 😀

////////////////////////////////////////////
///////////////////////////////////////////
// LECTURES

// console.log(23 === 23.0);
// console.log(0.2 + 0.2);

// console.log(typeof +"23");

// // Parsing
// console.log(Number.parseInt("30px", 10));
// console.log(Number.parseInt("e30", 10));

// // Reading a value from a string
// console.log(Number.parseInt(" 2.5rem"));
// console.log(Number.parseFloat("2.5rem"));

// console.log(!Number.isNaN(20));

// // Checking if value is a number
// console.log(Number.isFinite(20));
// console.log(Number.isFinite(20 / 0));

// console.log(Number.isInteger(23));
// console.log(Number.isInteger(23.0));
// console.log(Number.isInteger(23 / 0));

// console.log(Math.sqrt(25));
// console.log(25 ** (1 / 2));
// console.log(8 ** (1 / 3));

// console.log(Math.max(5, 8, 23, 11, 2));
// console.log(Math.max(5, 8, "23", 11, 2));
// console.log(Math.max(5, 8, "23px", 11, 2));

// console.log(Math.min(5, 8, "23", 11, 2));

// console.log(Math.PI * Number.parseFloat("10px") ** 2);

// console.log(Math.trunc(Math.random() * 6) + 1);

const randomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1) + min);

// console.log(randomInt(10, 20));
// console.log(randomInt(0, 3));

// Rounding integers

// console.log(Math.trunc(23.3));

// console.log(Math.round(23.3));
// console.log(Math.round(23.9));

// console.log(Math.ceil(23.9));
// console.log(Math.ceil(23.9));

// console.log(Math.floor(23.9));
// console.log(Math.floor(23.9));

// // Roundig decimals

// console.log(+(2.7).toFixed(0));
// console.log((2.7).toFixed(3));
// console.log((2.7).toFixed(0));

// console.log(5 % 2);
// console.log(5 / 2);

const isEven = (n) => n % 2 === 0;

// console.log(isEven(8));
// console.log(isEven(23));
// console.log(isEven(212));

// labelBalance.addEventListener("click", function () {
//   [...document.querySelectorAll(".movements__row")].forEach(function (row, i) {
//     if (i % 2 === 0) row.style.backgroundColor = "orangered";
//     if (i % 3 === 0) {
//       row.style.backgroundColor = "blue";
//     }
//   });
// });

/// Numeric Separators

// 287,460,000,000
// const diameter = 287_460_000_000;
// console.log(diameter);

// const price = 345_99;
// console.log(price);

// const transferFee1 = 15_00;
// const transferFee2 = 1_500;

// const PI = 3.14_15;
// console.log(PI);

// console.log(Number("230_000"));
// console.log(parseInt("230_000"));

// Big Int

// console.log(2 ** 53 - 1);
// console.log(Number.MAX_SAFE_INTEGER);

// console.log(23453255353534534535234534534523535);
// console.log(23453255353534534535234534534523535n);
// console.log(BigInt(23453255353534534535234534534523535));

// // Operations

// console.log(10000n + 10000n);
// console.log(2342342343242342334234334n * 1000n);
// console.log(2342342343242342334234334n * 120020030000400000n);

// Dates and Time

// Create a date.

// const now = new Date();
// console.log(now);

// console.log(new Date("Wed May 07 2025 15:08:03"));
// console.log(new Date("December 24, 2015"));

// console.log(new Date(account1.movementsDates[0]));

// console.log(new Date(2027, 10, 19, 15, 13, 5));
// console.log(new Date(2027, 10, 31, 15, 13, 5));
// console.log(new Date(2027, 10, 35, 15, 13, 5));

// console.log(new Date(0));
// console.log(new Date(3 * 24 * 60 * 60 * 1000));

// // Working with dates
const future = new Date(2037, 10, 19, 15, 23);
// console.log(future);
// console.log(future.getFullYear());
// // console.log(future.getYear());
// console.log(future.getDate());
// console.log(future.getDate());
// console.log(future.getHours());
// console.log(future.getHours());
// console.log(future.getMinutes());
// console.log(future.getSeconds());
// console.log(future.toISOString());

// console.log(new Date(Date.now()));

future.setFullYear(2040);
// console.log(future);

// const future = new Date(2037, 10, 19, 15, 23);
// console.log(+future);

const calDaysPassed = (date1, date2) =>
  Math.abs(date2 - date1) / (24 * 60 * 60 * 1000);
const days1 = calDaysPassed(new Date(2037, 3, 4), new Date(2037, 3, 14));
// console.log(days1);

///////////////////////////////////
////
// Internationalisation of numbers

// const num = 23234223.233;

// const options = {
//   style: "unit",
//   unit: "mile-per-hour",
// };
// console.log("US:", new Intl.NumberFormat("en-US", options).format(num));
// console.log("Germany:", new Intl.NumberFormat("de-DE", options).format(num));
// console.log("Syria:", new Intl.NumberFormat("ar-SY", options).format(num));

// setTimeout(() => console.log("Here is your pizza"), 3000);
// console.log("waiting...");

// setTimeout(
//   (ing1, ing2) => console.log(`Here is your pizza with ${ing1} and ${ing2}`),
//   3000,
//   "olive",
//   "spinach"
// );
// console.log("waiting...");

const ingredients = ["olive", "spinach"];
const pizzaTimer = setTimeout(
  (ing1, ing2) => console.log(`Here is your pizza with ${ing1} and ${ing2}`),
  3000,
  ...ingredients
);
console.log("waiting...");

if (ingredients.includes("spinach")) clearInterval(pizzaTimer);

// // setInterval()
// setInterval(function () {
//   const now = new Date();
//   console.log(now);
// }, 1000);

// setInterval(function () {
//   const now = new Date();
//   const hour = now.getHours();
//   const minute = now.getMinutes();
//   const second = now.getSeconds().toString();
//   console.log(`${hour}:${minute}:${second.padStart(2, "0")}`);
// }, 1000);

// console.log("5".padStart(2, "0"));
