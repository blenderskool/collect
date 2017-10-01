
var collect = localStorage.getItem('appCollect') ? JSON.parse(localStorage.getItem('appCollect')) : {
  timeline: [
  ]
};

var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/* CHARTS */
var deposits = [];
var withdrawals = [];
var netSavings = [];
for (var i = collect.timeline.length >= 7 ? collect.timeline.length - 7 : 0 ; i < collect.timeline.length; i++) {

  var amount = 0;
  /* Adds the previous amount for the starting net amount */
  if (collect.timeline.length >= 7 && i == collect.timeline.length - 7) {
    for (var j=0; j <= collect.timeline.length - 8; j++)
      amount = amount + collect.timeline[j].amount;
  }
  amount = amount + collect.timeline[i].amount;

  if (collect.timeline[i].type == 'deposit') {
    deposits.push(amount);
    if (netSavings.length > 0)
      netSavings.push(netSavings[netSavings.length-1]+amount);
  }
  else {
    withdrawals.push(amount);
    if (netSavings.length > 0)
      netSavings.push(netSavings[netSavings.length-1]-amount);
  }

  if (netSavings.length == 0)
    netSavings.push(amount);

}

var chartOptions = {
    maintainAspectRatio: false,
    elements: {
      point: {
        radius: 0
      }
    },
    scales: {
        yAxes: [{
            ticks: {
              beginAtZero:true
            },
            display : false,
            gridLines : {
              display : false,
              drawBorder: false
            }
        }],
        xAxes: [{
          display : false,
          gridLines : {
              display : false,
              drawBorder: false
            }
        }]
    },
    legend: {
      display: false
    }
};
var chtsav = document.getElementById("chartSavings").getContext('2d');
var chartSavings = new Chart(chtsav, {
    type: 'line',
    data: {
        labels: netSavings,
        datasets: [{
            data: netSavings,
            backgroundColor: [
                'rgba(235, 211, 110, 0.6)'
            ],
            borderColor: [
                'rgba(235, 211, 110, 0.6)'
            ],
            borderWidth: 1
        }]
    },
    options: chartOptions
});

var chtdepo = document.getElementById("chartDeposits").getContext('2d');
var chartDeposits = new Chart(chtdepo, {
    type: 'line',
    data: {
        labels: deposits,
        datasets: [{
            data: deposits,
            backgroundColor: [
                'rgba(136, 222, 140, 0.6)'
            ],
            borderColor: [
                'rgba(136, 222, 140, 0.6)'
            ],
            borderWidth: 1
        }]
    },
    options: chartOptions
});

var chtwithdraw = document.getElementById("chartWithdraw").getContext('2d');
var chartWithdraw = new Chart(chtwithdraw, {
    type: 'line',
    data: {
        labels: withdrawals,
        datasets: [{
            data: withdrawals,
            backgroundColor: [
                'rgba(244, 147, 188, 0.6)'
            ],
            borderColor: [
                'rgba(244, 147, 188, 0.6)'
            ],
            borderWidth: 1
        }]
    },
    options: chartOptions
});


var savings = 0;
for (var i=0; i < collect.timeline.length; i++) {
  var amount = collect.timeline[i].amount;
  if (collect.timeline[i].type == 'deposit')
    savings = savings + amount;
  else
    savings = savings - amount;
}
document.getElementById('txtSavings').innerText = savings.toLocaleString("hi-IN", { style: "currency", currency: "INR"}).split('.')[0];

document.getElementById('btnFeed').addEventListener('click', function() {
  var toggleType = document.getElementById('toggleType');
  var form = toggleType.parentElement.parentElement;
  var btnMenu = document.getElementById('btnMenu');
  var btnClose = document.getElementById('btnClose');

  if (this.innerText == 'FEED') { // Open the Feed Form
    form.style.display = 'block';
    this.innerHTML = '<i class="material-icons">check</i>';

    btnClose.style.display = 'block';
    btnMenu.style.display = 'none';

  }
  else { // Do the Deposit/Withdraw action and close the Form
    var amount = document.getElementById('inpAmount').value;
    var type = toggleType.checked ? 'withdraw' : 'deposit';

    if (amount)
      newFeed(Number(amount), type);

    closeFeedForm();
  }
});

document.getElementById('inpAmount').addEventListener('keydown', function(e) {
  if (e.keyCode === 13) {
    var type = document.getElementById('toggleType').checked ? 'withdraw' : 'deposit';
    if (this.value)
      newFeed(Number(this.value), type);

    closeFeedForm();
  }
});

document.getElementById('toggleType').addEventListener('change', function() {
  var parent = this.parentElement;
  var button = document.getElementById('btnFeed');
  if (this.checked) { // Withdraw Action
    parent.children[2].style.color = '#f393bc';
    button.style.backgroundColor = '#f393bc';
    parent.children[0].style.color = 'rgba(201, 179, 189, 0.52)';
  }
  else { // Deposit Action
    parent.children[0].style.color = '#89de8d';
    button.style.backgroundColor = '#89de8d';
    parent.children[2].style.color = 'rgba(201, 179, 189, 0.52)';

  }
});

document.getElementById('btnClose').addEventListener('click', closeFeedForm);

renderTimeLine(collect.timeline, 6);

// New Feed to the app
function newFeed(amount, type) {

  if (type == 'withdraw' && savings < amount)
    return;

  var date = new Date();
  var item = {
    'time': months[date.getMonth()] + " " + date.getDate()+"th, " + date.getFullYear(),
    'amount': amount,
    'type': type
  };
  collect.timeline.push(item);

  if (type == 'deposit') {
    savings = savings + amount;
    deposits.push(amount);
    if (netSavings.length>0)
      netSavings.push(netSavings[netSavings.length-1]+amount);
  }
  else {
    savings = savings - amount;
    withdrawals.push(amount);
    if (netSavings.length > 0)
      netSavings.push(netSavings[netSavings.length-1]-amount);
  }
  if (netSavings.length == 0) // Starting amount
    netSavings.push(amount);

  document.getElementById('txtSavings').innerText = savings.toLocaleString("hi-IN", { style: "currency", currency: "INR"}).split('.')[0];

  renderTimeLine(collect.timeline, 6); // Renders the Timeline again
  reloadCharts(deposits, withdrawals, netSavings); // Renders the Charts again
  localStorage.setItem('appCollect', JSON.stringify(collect));
}

function reloadCharts(dataDeposits, dataWithdrawals, dataNetSavings) {
  chartDeposits.config.data.labels = dataDeposits;
  chartDeposits.config.data.datasets[0].data = dataDeposits;
  chartDeposits.update();

  chartWithdraw.config.data.labels = dataWithdrawals;
  chartWithdraw.config.data.datasets[0].data = dataWithdrawals;
  chartWithdraw.update();

  chartSavings.config.data.labels = dataNetSavings;
  chartSavings.config.data.datasets[0].data = dataNetSavings;
  chartSavings.update();

}

function closeFeedForm() {
  var toggleType = document.getElementById('toggleType');
  var form = toggleType.parentElement.parentElement;
  var btnMenu = document.getElementById('btnMenu');
  var btnClose = document.getElementById('btnClose');
  var amount = document.getElementById('inpAmount').value;
  var button = document.getElementById('btnFeed');

  form.style.display = 'none';
  button.innerHTML = 'feed';
  document.getElementById('inpAmount').value = '';

  btnClose.style.display = 'none';
  btnMenu.style.display = 'block';

  if (button.style.backgroundColor != 'rgb(137, 222, 141)') { // Reset the form from withdraw to deposit action
    button.style.backgroundColor = '#89de8d';
    toggleType.checked = false;
    toggleType.dispatchEvent(new Event('change'));

  }
}
