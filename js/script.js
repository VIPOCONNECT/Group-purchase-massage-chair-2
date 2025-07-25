
const timerElement = document.getElementById('timer');
const deadline = new Date(Date.now() + 45 * 24 * 60 * 60 * 1000);
function updateTimer() {
  const now = new Date();
  const diff = deadline - now;
  if (diff <= 0) {
    timerElement.textContent = "הקמפיין הסתיים!";
    return;
  }
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / 1000 / 60) % 60);
  timerElement.textContent = `⏱ נותרו ${days} ימים, ${hours} שעות, ${minutes} דקות`;
}
setInterval(updateTimer, 60000);
updateTimer();
