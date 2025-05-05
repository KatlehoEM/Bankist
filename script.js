"use strict";

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: "Jonas Schmedtmann",
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
  type: "premium",
};

const account2 = {
  owner: "Jessica Davis",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
  type: "standard",
};

const account3 = {
  owner: "Steven Thomas Williams",
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
  type: "premium",
};

const account4 = {
  owner: "Sarah Smith",
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
  type: "basic",
};

const accounts = [account1, account2, account3, account4];

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

// Display Movements

const displayMovements = function (movements, sort = false) {
  containerMovements.innerHTML = "";

  const movs = sort ? movements.slice().sort((a, b) => b - a) : movements;

  movs.forEach(function (move, i) {
    const type = move > 0 ? `deposit` : `withdrawal`;
    const html = `
      <div class="movements__row">
            <div class="movements__type 
            movements__type--${type}">${i + 1} ${type}</div>
            <div class="movements__value">${move}€</div>
      </div>`;

    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
};

// Display Balance

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, cur) => acc + cur, 0);
  labelBalance.textContent = `${acc.balance}€`;
};

// Display Summary

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter((mov) => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes}€`;

  const expenses = acc.movements
    .filter((mov) => mov < 0)
    .reduce((acc, cur) => acc + Math.abs(cur), 0);

  labelSumOut.textContent = `${expenses}€`;

  const interest = acc.movements
    .filter((mov) => mov > 0)
    .map((deposit) => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      // console.log(arr);
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `${interest}€`;
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
  displayMovements(acc.movements);
  // Display balance
  calcDisplayBalance(acc);
  // Display summary
  calcDisplaySummary(acc);
};

// Event Handler

let currentAccount;
btnLogin.addEventListener("click", function (event) {
  // Prevent form from submitting
  event.preventDefault();

  currentAccount = accounts.find(
    (acc) => acc.username === inputLoginUsername.value
  );
  // console.log(currentAccount);

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // Display a UI and welcome message.
    labelWelcome.textContent = `Welcome back, ${currentAccount.owner
      .split(" ")
      .at(0)}`;
    containerApp.style.opacity = 100;

    // Clear input fields
    inputLoginUsername.value = inputLoginPin.value = "";
    inputLoginPin.blur();

    // Update UI
    updateUI(currentAccount);
  }
});

btnTransfer.addEventListener("click", function (e) {
  e.preventDefault();

  const amount = Number(inputTransferAmount.value);
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

    // Update UI
    updateUI(currentAccount);
  }
});

btnLoan.addEventListener("click", function (e) {
  e.preventDefault();

  const amount = Number(inputLoanAmount.value);

  if (
    amount > 0 &&
    currentAccount.movements.some((mov) => mov >= amount * 0.1)
  ) {
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
    Number(inputClosePin.value) === currentAccount.pin
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
  displayMovements(currentAccount.movements, !sorted);
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

const calcAverageHumanAge = function (dogsJulia, dogsKate) {
  const allDogs = dogsJulia.concat(dogsKate);

  const aveAge = allDogs
    .map((dogAge) => {
      dogAge <= 2 ? 2 * dogAge : 16 + dogAge * 4;
    })
    .filter((ages) => ages >= 18)
    .reduce((accu, cur, i, arr) => accu + cur / arr.length, 0);
};

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

// const latestLargeMovementIndex = movements.findLastIndex(
//   (mov) => Math.abs(mov) > 2000
// );

// console.log(
//   `You latest large movement was ${
//     movements.length - latestLargeMovementIndex
//   } movements ago`
// );

// // EQUALITY
// console.log(movements);
// console.log(movements.includes(-130));

// // CONDITION
// const anyDeposits = movements.some((mov) => mov > 1500);
// console.log(anyDeposits);

// // EVERY
// console.log(movements.every((mov) => mov > 0));
// console.log(account4.movements.every((mov) => mov > 0));

// // Separate callback
// const deposit = (mov) => mov > 0;
// console.log(movements.some(deposit));

// // FLAT
// const arr = [[1, 2, 3], [4, 5, 6], 7, 8];
// console.log(arr.flat());

// const arrDeep = [[[1, 2], 3], [4, [5, 6]], 7, 8];
// console.log(arrDeep.flat(2));

// const accountMovements = accounts.map((acc) => acc.movements);
// console.log(accountMovements);

// const allMovements = accountMovements.flat();
// console.log(allMovements);
// const overallBalance = allMovements.reduce((acc, cur) => acc + cur, 0);
// console.log(overallBalance);

// const overallBalance = accounts
//   .map((acc) => acc.movements)
//   .flat()
//   .reduce((acc, cur) => acc + cur, 0);
// console.log(overallBalance);

// // FLATMAP

// const overallBalance2 = accounts
//   .flatMap((acc) => acc.movements)
//   .reduce((acc, cur) => acc + cur, 0);
// console.log(overallBalance2);

///////////////////////////////////////
// Coding Challenge #4

// This time, Julia and Kate are studying the activity levels of different dog breeds.

// const breeds = [
//   {
//     breed: "German Shepherd",
//     averageWeight: 32,
//     activities: ["fetch", "swimming"],
//   },
//   {
//     breed: "Dalmatian",
//     averageWeight: 24,
//     activities: ["running", "fetch", "agility"],
//   },
//   {
//     breed: "Labrador",
//     averageWeight: 28,
//     activities: ["swimming", "fetch"],
//   },
//   {
//     breed: "Beagle",
//     averageWeight: 12,
//     activities: ["digging", "fetch"],
//   },
//   {
//     breed: "Husky",
//     averageWeight: 26,
//     activities: ["running", "agility", "swimming"],
//   },
//   {
//     breed: "Bulldog",
//     averageWeight: 36,
//     activities: ["sleeping"],
//   },
//   {
//     breed: "Poodle",
//     averageWeight: 18,
//     activities: ["agility", "fetch"],
//   },
// ];

// // YOUR TASKS:
// // 1. Store the the average weight of a "Husky" in a variable "huskyWeight"

// const huskyWeight = breeds.find((bre) => bre.breed === "Husky").averageWeight;
// // console.log(huskyWeight);

// // 2. Find the name of the only breed that likes both "running" and "fetch" ("dogBothActivities" variable)
// const dogBothActivities = breeds.find(
//   (bre) =>
//     bre.activities.includes("running") && bre.activities.includes("fetch")
// ).breed;
// // console.log(dogBothActivities);

// // 3. Create an array "allActivities" of all the activities of all the dog breeds
// const allActivities = breeds.flatMap((bre) => bre.activities);
// console.log(allActivities);

// // 4. Create an array "uniqueActivities" that contains only the unique activities (no activity repetitions).
// // HINT: Use a technique with a special data structure that we studied a few sections ago.

// const uniqueActivities = [...new Set(breeds.flatMap((bre) => bre.activities))];
// console.log(uniqueActivities);

// // 5. Many dog breeds like to swim. What other activities do these dogs like?
// // Store all the OTHER activities these breeds like to do, in a unique array called "swimmingAdjacent".

// const swimmingAdjacent = [
//   ...new Set(
//     breeds
//       .filter((bre) => bre.activities.includes("swimming"))
//       .flatMap((bre) => bre.activities)
//   ),
// ];

// // console.log(swimmingAdjacent);

// const index = swimmingAdjacent.findIndex((act) => act === "swimming");
// // console.log(index);
// swimmingAdjacent.splice(index, 1);
// // console.log(swimmingAdjacent);

// // 6. Do all the breeds have an average weight of 10kg or more? Log to the console whether "true" or "false".

// const everyDog = breeds.every((bre) => bre.averageWeight >= 10);
// console.log(everyDog);

// // 7. Are there any breeds that are "active"? "Active" means that the dog has 3 or more activities. Log to the console whether "true" or "false".

// const anyDogs = breeds.some((bre) => bre.activities.length >= 3);
// console.log(anyDogs);

// // BONUS: What's the average weight of the heaviest breed that likes to fetch? HINT: Use the "Math.max" method along with the ... operator.

// const heaviestDog = breeds
//   .filter((bre) => bre.activities.includes("fetch"))
//   .map((bre) => bre.averageWeight);
// console.log(Math.max(...heaviestDog));

// // TEST DATA:

// Array Grouping

console.log(movements);
const groupedMovements = Object.groupBy(movements, (movements) =>
  movements > 0 ? "deposits" : "withdrawals"
);
console.log(groupedMovements);

const groupedByActivity = Object.groupBy(accounts, (account) => {
  const movementCount = account.movements.length;

  if (movementCount >= 8) return "very active";
  if (movementCount >= 4) return "active";
  if (movementCount >= 1) return "moderate";
  return "inactive";
});
console.log(groupedByActivity);

// const groupedAccounts = Object.groupBy(accounts, (account) => account.type);
const groupedAccounts = Object.groupBy(accounts, ({ type }) => type);
console.log(groupedAccounts);
