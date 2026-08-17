// !!! เปลี่ยน URL ตรงนี้เป็น Web App URL ที่คุณได้จาก Google Apps Script !!!
const GAS_URL = "https://script.google.com/macros/s/ใส่_ID_WEB_APP_ของคุณ/exec";
const REFRESH_MS = 3000;

function tickClock() {
  const now = new Date();
  document.getElementById('clock').textContent = now.toLocaleTimeString('th-TH', { hour12: false });
}
setInterval(tickClock, 1000); tickClock();

function updateUI(slots) {
  let available = 0;
  slots.forEach((slot, i) => {
    const n = i + 1;
    const car = document.getElementById('car' + n);
    const beam = document.getElementById('beam' + n);
    const statusText = document.getElementById('status' + n);
    const distText = document.getElementById('dist' + n);
    const tag = document.getElementById('tag' + n);
    const card = document.getElementById('card' + n);

    distText.textContent = slot.distance !== "" ? parseFloat(slot.distance).toFixed(1) : '--';
    
    if (slot.occupied) {
      car.setAttribute('opacity', '1');
      beam.classList.add('occupied');
      statusText.textContent = 'มีรถ';
      statusText.style.fill = '#ffb400';
      tag.textContent = 'มีรถ';
      tag.className = 'readout-tag occupied';
      card.classList.add('occupied');
    } else {
      available++;
      car.setAttribute('opacity', '0');
      beam.classList.remove('occupied');
      statusText.textContent = 'ว่าง';
      statusText.style.fill = '#35e28c';
      tag.textContent = 'ว่าง';
      tag.className = 'readout-tag';
      card.classList.remove('occupied');
    }
  });

  const pill = document.getElementById('availablePill');
  pill.textContent = `${available} / 2 ว่าง`;
  pill.classList.toggle('full', available === 0);
  document.getElementById('fullBanner').setAttribute('opacity', available === 0 ? '1' : '0');
}

async function fetchStatus() {
  try {
    const res = await fetch(GAS_URL); // ดึงข้อมูลจาก Cloud
    if (!res.ok) throw new Error('Bad Response');
    const data = await res.json();
    
    // จัดฟอร์แมตข้อมูลจาก GAS
    const slots = [
      { distance: data.distance1, occupied: (data.status1 === 'มีรถ') },
      { distance: data.distance2, occupied: (data.status2 === 'มีรถ') }
    ];

    updateUI(slots);
    
    document.getElementById('linkDot').className = 'dot online';
    document.getElementById('linkLabel').textContent = 'เชื่อมต่อ Cloud สำเร็จ';
    document.getElementById('lastUpdate').textContent = data.timestamp;
  } catch (err) {
    document.getElementById('linkDot').className = 'dot offline';
    document.getElementById('linkLabel').textContent = 'ขาดการเชื่อมต่อกับ Cloud';
  }
}

fetchStatus();
setInterval(fetchStatus, REFRESH_MS);