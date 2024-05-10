const audio = document.getElementById("audio");
const playButton = document.getElementById("play_pause");

loadDataMusik();

playButton.addEventListener("click", () => {
  const isPause = audio.paused;
  if (isPause) {
    audio.play();
  } else {
    audio.pause();
  }
});

audio.addEventListener("durationchange", (e) => {
  document.getElementById("total_duration").innerText = formatTime(
    e.target.duration
  );
});
audio.addEventListener("timeupdate", (e) => {
  document.getElementById("current_duration").innerText = formatTime(
    e.target.currentTime
  );

  const progress = (e.target.currentTime / e.target.duration) * 100;

  document
    .querySelector(".progress .bar")
    .style.setProperty("--progress-length", `${progress}%`);
});

function formatTime(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = Math.floor(totalSeconds % 60);

  const formatDuration = `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;

  return formatDuration;
}

audio.addEventListener("play", () => {
  document.querySelector("#play_pause .ph-play").classList.add("hidden");
  document.querySelector("#play_pause .ph-pause").classList.remove("hidden");
  document.querySelector(".player .album").classList.add("berputar");
  document.querySelector(".player .album").classList.remove("pause");
});

audio.addEventListener("pause", () => {
  document.querySelector("#play_pause .ph-play").classList.remove("hidden");
  document.querySelector("#play_pause .ph-pause").classList.add("hidden");
  document.querySelector(".player .album").classList.add("pause");
});

document.getElementById("next").addEventListener("click", async (e) => {
  const currentPlay = audio.getAttribute("data-id");
  const dataMusik = await getDataMusik();

  const nextIndex = dataMusik.data.findIndex((m) => m.id == currentPlay) + 1;

  const nextMusik = dataMusik.data[nextIndex];

  updateMusicInfo(nextMusik);
});

document.getElementById("previous").addEventListener("click", async (e) => {
  const currentPlay = audio.getAttribute("data-id");
  const dataMusik = await getDataMusik();

  const nextIndex = dataMusik.data.findIndex((m) => m.id == currentPlay) - 1;

  const nextMusik = dataMusik.data[nextIndex];

  updateMusicInfo(nextMusik);
});


async function loadDataMusik() {
  const dataMusik = await getDataMusik();

  console.log(dataMusik);

  const ulElement = document.querySelector(".playlist ul");

  console.log(ulElement);

  const listMusik = dataMusik.data
    .map((musik) => {
      return `<li data-id="${musik.id}">${musik.title}</li>`;
    })
    .join("");

  console.log(listMusik);

  ulElement.innerHTML = listMusik;

  const li = document.querySelectorAll(".playlist ul li");
  li.forEach((item) => {
    addEventListener("click", (e) => {
      const dataMusikIni = dataMusik.data.filter((musik) => {
        return musik.id == e.target.getAttribute("data-id");
      })[0];
      console.log(dataMusikIni);

      updateMusicInfo(dataMusikIni);
    });
  });
}

async function getDataMusik() {
  const response = await fetch("data.json");
  const dataMusik = await response.json();

  return dataMusik;
}

function updateMusicInfo(dataMusik) {
  document.querySelector(".player .info h2").innerText = dataMusik.title;
  document.querySelector(".player .info p").innerText = dataMusik.artist;
  document
    .querySelector(".player .album img")
    .setAttribute("src", dataMusik.album_cover);
  audio.setAttribute("src", dataMusik.url);
  audio.play();
  audio.setAttribute("data-id", dataMusik.id);

  document.querySelectorAll(".playlist ul li").forEach((li) => {
    li.classList.remove("active");
  });

  document
    .querySelector(`.playlist ul li[data-id='${dataMusik.id}']`)
    .classList.add("active");
}
