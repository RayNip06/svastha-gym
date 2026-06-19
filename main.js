/* =====================
   SVASTHA GYM — main.js
   ===================== */

document.addEventListener('DOMContentLoaded', () => {

  // ---- Navbar: ubah background saat scroll ----
  const nav = document.getElementById('mainNav');

  function updateNav() {
    if (window.scrollY > 60) {
      nav.classList.add('nav-scrolled');
    } else {
      nav.classList.remove('nav-scrolled');
    }
  }

  window.addEventListener('scroll', updateNav, { passive: true });
  updateNav(); // jalankan sekali saat load

  // ---- Scroll reveal animasi elemen ----
  const revealEls = document.querySelectorAll(
    '.feature-card, .stat-item, .membership-card, .branch-card, .section-title, .hero-content'
  );

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealEls.forEach(el => {
    el.classList.add('reveal-ready');
    observer.observe(el);
  });

  // ---- Smooth scroll untuk anchor link ----
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ---- Stat counter animation ----
  animateCounters();

  // ---- Ripple effect pada tombol ----
  document.querySelectorAll('.btn-fire, .btn-outline-fire').forEach(btn => {
    btn.addEventListener('click', function(e) {
      const ripple = document.createElement('span');
      ripple.classList.add('btn-ripple');
      const rect = this.getBoundingClientRect();
      ripple.style.left = `${e.clientX - rect.left}px`;
      ripple.style.top = `${e.clientY - rect.top}px`;
      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
    });
  });

});

let selectedGender = "male";

function selectGender(gender){

    selectedGender = gender;

    document
        .getElementById("genderMale")
        .classList.remove("active");

    document
        .getElementById("genderFemale")
        .classList.remove("active");

    if(gender === "male"){
        document
            .getElementById("genderMale")
            .classList.add("active");
    }else{
        document
            .getElementById("genderFemale")
            .classList.add("active");
    }
}

function calculateBMI(){

    const age =
        parseInt(document.getElementById("ageInput").value);

    const height =
        parseFloat(document.getElementById("heightInput").value);

    const weight =
        parseFloat(document.getElementById("weightInput").value);

    const errorBox =
        document.getElementById("errorMsg");

    if(
        !age ||
        !height ||
        !weight
    ){
        errorBox.classList.remove("d-none");
        return;
    }

    errorBox.classList.add("d-none");

    const meter = height / 100;

    const bmi =
        weight / (meter * meter);

    let kategori = "";
    let rekomendasi = "";

    if(bmi < 18.5){

        kategori = "Kurus";

        rekomendasi =
        "Fokus meningkatkan massa otot dengan latihan beban dan surplus kalori.";

    }else if(bmi < 25){

        kategori = "Normal";

        rekomendasi =
        "BMI ideal. Pertahankan pola makan sehat dan latihan rutin.";

    }else if(bmi < 30){

        kategori = "Kelebihan Berat";

        rekomendasi =
        "Perbanyak latihan cardio dan kontrol asupan kalori.";

    }else{

        kategori = "Obesitas";

        rekomendasi =
        "Disarankan mengikuti program fat loss dengan trainer.";
    }

    const ideal =
        22 * meter * meter;

    document
        .getElementById("resultDefault")
        .classList.add("d-none");

    document
        .getElementById("resultPanel")
        .classList.remove("d-none");

    document
        .getElementById("bmiNumber")
        .textContent = bmi.toFixed(1);

    document
        .getElementById("bmiCategory")
        .textContent = kategori;

    document
        .getElementById("detailHeight")
        .textContent = height + " cm";

    document
        .getElementById("detailWeight")
        .textContent = weight + " kg";

    document
        .getElementById("detailIdeal")
        .textContent = ideal.toFixed(1) + " kg";

    document
        .getElementById("rekomendasiText")
        .textContent = rekomendasi;

    const pointer =
        document.getElementById("bmiPointer");

    let posisi =
        (bmi / 40) * 100;

    posisi =
        Math.max(0, Math.min(100, posisi));

    pointer.style.left =
        posisi + "%";
}

// ---- Counter animation (stat bar) ----
function animateCounters() {
  const statNums = document.querySelectorAll('.stat-num');
  if (!statNums.length) return;

  const counterObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const raw = el.textContent.trim();

      // Kalau format jam (07.30, 22.00) — langsung reveal saja
      if (raw.includes('.') && raw.length <= 5) {
        el.classList.add('counter-done');
        counterObs.unobserve(el);
        return;
      }

      // Kalau ada teks (non-angka murni) — flip reveal
      const num = parseFloat(raw.replace(/[^0-9.]/g, ''));
      const suffix = raw.replace(/[0-9.]/g, '');
      if (isNaN(num)) {
        el.classList.add('counter-done');
        counterObs.unobserve(el);
        return;
      }

      let start = 0;
      const duration = 1200;
      const step = 16;
      const steps = duration / step;
      const increment = num / steps;
      let current = 0;

      const timer = setInterval(() => {
        current += increment;
        if (current >= num) {
          current = num;
          clearInterval(timer);
          el.classList.add('counter-done');
        }
        el.textContent = (Number.isInteger(num)
          ? Math.floor(current)
          : current.toFixed(0)) + suffix;
      }, step);

      counterObs.unobserve(el);
    });
  }, { threshold: 0.5 });

  statNums.forEach(el => counterObs.observe(el));
}

// ---- Active nav link highlight berdasarkan halaman saat ini ----
(function highlightNav() {
  const page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.navbar-nav .nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === page) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
})();