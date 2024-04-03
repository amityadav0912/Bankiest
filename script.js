'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
// Data

// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
  owner: 'Amit Yadav',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2020-07-11T23:36:17.929Z',
    '2022-07-12T10:51:36.790Z',
  ],
  currency: 'USD',
  locale: 'en-US', // de-DE
};

const account2 = {
  owner: 'Harsh gupta',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};
const account3 = {
  owner: 'Pratham Mittal',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7, // %
  pin: 3333,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US', // de-DE
};
const account4 = {
  owner: 'Ayush Soni',
  movements: [1000, -18,-18, -18,1000,-18,-18,-18],
  interestRate: 1, // %
  pin: 4444,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2020-07-11T23:36:17.929Z',
    '2022-07-12T10:51:36.790Z',
  ],
  currency: 'USD',
  locale: 'en-US', // de-DE
};
const accounts = [account1, account2,account3,account4];

/////////////////////////////////////////////////
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

/////////////////////////////////////////////////
// Functions

const formatMovementDate = function(date,locale)
{
  const calcDaysPassed = (date1,date2) => 
  Math.round(Math.abs(date2-date1)/(1000*60*60*24));

  const daysPassed  = calcDaysPassed(new Date(),date);
  
  if(daysPassed === 0) return 'Today';
  if(daysPassed === 1) return 'Yesterday';
  if(daysPassed <= 7)  return `${daysPassed} days ago`;
  // const day = `${date.getDate()}`.padStart(2,0);
  // const month = `${date.getMonth()+1}`.padStart(2,0);
  // const year = date.getFullYear();
  // return `${day}/${month}/${year}`;
  return new Intl.DateTimeFormat(locale).format(date);
};

const fomatCur = function(value,locale,currency)
{
   return new Intl.NumberFormat(locale,{
    style:'currency',
    currency: currency,
  }).format(value);
}

const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort ? acc.movements.slice().sort((a, b) => a - b) : acc.movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';


    const date = new Date(acc.movementsDates[i]);

    const displayDate = formatMovementDate(date,acc.locale);
    
    const formattedMov = fomatCur(mov,acc.locale,acc.currency);

    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
    <div class="movements__date">${displayDate}</div>
        <div class="movements__value">${formattedMov}</div>
      </div>
    `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = fomatCur(acc.balance,acc.locale,acc.currency);
};

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = fomatCur(incomes,acc.locale,acc.currency);

  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = fomatCur(out,acc.locale,acc.currency);

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      // console.log(arr);
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = fomatCur(interest,acc.locale,acc.currency);
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
  // Display movements
  displayMovements(acc);

  // Display balance
  calcDisplayBalance(acc);

  // Display summary
  calcDisplaySummary(acc);
};


const startLogOutTimer = function()
{ 
  const tick = function()
  {
  
    const min = String(Math.trunc(time/60)).padStart(2,0);
    const second = String(Math.trunc(time%60)).padStart(2,0);
     // in call print reemaintg time to ui 
    labelTimer.textContent=`${min}:${second}`;
     // when 0 second left log out
     if(time===0)
     {
       clearInterval(timer);
       labelWelcome.textContent =  'Log in to get Started';
      containerApp.style.opacity = 0;
     }
    // decrease 1 second
    time--;
    
  };
   // set time to 5 minutes 
  let time = 300;
   // call the timer every second 
   tick();
const timer = setInterval(tick,1000);
return timer;
};
///////////////////////////////////////
// Event handlers
let currentAccount,timer;

// currentAccount = account1;
// updateUI(currentAccount);
// containerApp.style.opacity=100;

btnLogin.addEventListener('click', function (e) {
  // Prevent form from submitting
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  console.log(currentAccount);

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // Display UI and message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;
    
    // create current date and time 
const now = new Date();
const options = {
  hour:'numeric',
  minute:'numeric',
  day:'numeric',
  month:'numeric',
  year:'numeric',
  weekday:'long'
};
//const locale = navigator.language;

// const day = `${now.getDate()}`.padStart(2,0);
// const month = `${now.getMonth()+1}`.padStart(2,0);
// const year = now.getFullYear();
// const hour = `${now.getHours()}`.padStart(2,0);
// const min = `${now.getMinutes()}`.padStart(2,0);

labelDate.textContent= new Intl.DateTimeFormat(currentAccount.locale,options).format(now);
    // Clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();
    
    if(timer) clearInterval(timer);
    timer = startLogOutTimer();
    // Update UI
    updateUI(currentAccount);
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = '';

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    // Doing the transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);
    
    // updating dates 
    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAcc.movementsDates.push(new Date().toISOString());
    // Update UI
    updateUI(currentAccount);
    // reset timer
    clearInterval(timer);
    timer=startLogOutTimer();
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Math.floor(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
   
   setTimeout(function()
   {
    // Add movement
    currentAccount.movements.push(amount);
    currentAccount.movementsDates.push(new Date().toISOString());
    // Update UI
    updateUI(currentAccount);
  },2500); 
}
clearInterval(timer);
timer=startLogOutTimer();
inputLoanAmount.value = '';
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    console.log(index);
    // .indexOf(23)

    // Delete account
    accounts.splice(index, 1);

    // Hide UI
    containerApp.style.opacity = 0;
  }

  inputCloseUsername.value = inputClosePin.value = '';
});

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

// console.log(23 === 23.0)



// // 
// console.log(Math.sqrt(25));
// console.log(8 ** 1/3);

// console.log(Math.trunc(Math.random()*6)+1);

// const randomInt = (min,max)=>
// Math.trunc(Math.random()*(max-min)+1)+min;
// console.log(randomInt(10,30));


// create an date 

// const now = new Date();

// console.log(now);


// const future = new Date(2033,10,19,15,23);
// console.log(+future);

// const calcDaysPassed = (date1,date2) => 
// Math.abs(date2-date1)/(1000*60*60*24);
// const days1 = calcDaysPassed(new Date(2022,3,4),new Date(2022,3,8));
// console.log(days1);

// const num = 2884764.23;
// console.log(new Intl.NumberFormat('en-US')).format(num);


// setTimeout(()=> console.log('Here is yout pizza🍕'),3*1000);

// setInterval(function()
// {
//   const now = new Date();
//   console.log(`${now.getHours()} : ${now.getMinutes()} : ${now.getSeconds()}`);
// },1000);

// const now = new Date();
// console.log(`${now.getHours()} : ${now.getMinutes()} : ${now.getSeconds()}`);