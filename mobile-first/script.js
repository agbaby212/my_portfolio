// Mobile menu
const menu = document.getElementById("menu");
const menuBtn = document.getElementById("menu_btn");

menuBtn.addEventListener("click", () => {
    const open = menu.classList.toggle("open");
    menuBtn.setAttribute("aria-expanded", open);
});

menu.querySelectorAll("a").forEach(a => a.addEventListener("click", () => {
    menu.classList.remove("open");
    menuBtn.setAttribute("aria-expanded", false);
}));

// Workout tabs
const workouts = {
    beginner: { title: "Beginner Starter", time: "15 minutes, 3 days a week", items: ["Marching on the spot", "Bodyweight squats", "Wall push-ups", "Gentle stretching"] },
    strength: { title: "Full-Body Strength", time: "25 minutes, 4 days a week", items: ["Push-ups", "Lunges", "Plank hold", "Glute bridges"] },
    cardio: { title: "Cardio Burn", time: "20 minutes, 5 days a week", items: ["Jumping jacks", "High knees", "Mountain climbers", "Skipping"] }
};

const panel = document.getElementById("panel");
const tabs = document.querySelectorAll(".tab");

function showWorkout(key) {
    const w = workouts[key];
    panel.innerHTML = `<h3>${w.title}</h3><p class="meta">${w.time}</p><ul>${w.items.map(i => `<li>${i}</li>`).join("")}</ul>`;
}

tabs.forEach(tab => tab.addEventListener("click", () => {
    tabs.forEach(t => t.classList.remove("active"));
    tab.classList.add("active");
    showWorkout(tab.dataset.tab);
}));

showWorkout("beginner");

// Sign-up form
const form = document.getElementById("form");
const msg = document.getElementById("msg");

form.addEventListener("submit", e => {
    e.preventDefault();
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();

    if (!name) {
        msg.textContent = "Enter your name.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        msg.textContent = "Enter a valid email, like name@example.com.";
    } else {
        msg.textContent = `Welcome, ${name}! Check your email to get started.`;
        form.reset();
    }
});