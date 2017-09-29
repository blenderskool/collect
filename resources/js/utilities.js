document.getElementById('btnMenu').addEventListener('click', function() {
  var menu = document.getElementById('menu');
  var menuOverlay = document.getElementById('menuOverlay');

  menu.style.transform = 'translateX(0)';
  menuOverlay.style.opacity = '1';
  menuOverlay.style.visibility = 'visible';
});

document.getElementById('menuOverlay').addEventListener('click', closeMenu);

window.addEventListener('keydown', function(e) {
  if (e.keyCode === 27) // ESC key
    closeMenu();
});

function closeMenu() {
  var menu = document.getElementById('menu');
  var menuOverlay = document.getElementById('menuOverlay');

  menu.style.transform = 'translateX(-100%)';
  menuOverlay.style.opacity = '0';
  menuOverlay.style.visibility = 'hidden';
}

// Renders the Timeline
function renderTimeLine(timeline, limit=-1) {
  var lstTimeline = document.getElementById('lstTimeline');
  lstTimeline.innerHTML = '';

  for (var i = timeline.length-1; i >= 0; i--) {

    // Excess Items not shown
    if (i==timeline.length-limit)
      break;

    var item = document.createElement('li');
    item.classList.add(timeline[i].type);

    var numAmount = timeline[i].amount.toLocaleString("hi-IN", { style: "currency", currency: "INR" }).split('.')[0];

    var title = document.createElement('span');
    title.classList.add('title');
    title.innerText = timeline[i].type == 'deposit' ? "Deposit of " + numAmount : "Withdraw of " + numAmount;

    var time = document.createElement('span');
    time.classList.add('time');
    time.innerText = timeline[i].time;

    var amount = document.createElement('span');
    amount.classList.add('amount');
    amount.innerText = numAmount;

    item.appendChild(title);
    item.appendChild(time);
    item.appendChild(amount);

    lstTimeline.appendChild(item);
  }
}
