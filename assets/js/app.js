const data = [
    {
        id: "1",
        cover: "https://picsum.photos/500",
        duration: "5:55",
        name: "Bohemian Rhapsody",
        album: "A Night at the Opera",
        author: "Queen",
    },
    {
        id: "2",
        cover: "https://picsum.photos/500",
        duration: "3:03",
        name: "Imagine",
        album: "Imagine",
        author: "John Lennon",
    },
    {
        id: "3",
        cover: "https://picsum.photos/500",
        duration: "5:01",
        name: "Smells Like Teen Spirit",
        album: "Nevermind",
        author: "Nirvana",
    },
    {
        id: "4",
        cover: "https://picsum.photos/500",
        duration: "4:54",
        name: "Billie Jean",
        album: "Thriller",
        author: "Michael Jackson",
    },
    {
        id: "5",
        cover: "https://picsum.photos/500",
        duration: "6:30",
        name: "Hotel California",
        album: "Hotel California",
        author: "Eagles",
    },
    {
        id: "6",
        cover: "https://picsum.photos/500",
        duration: "3:48",
        name: "Rolling in the Deep",
        album: "21",
        author: "Adele",
    },
    {
        id: "7",
        cover: "https://picsum.photos/500",
        duration: "3:53",
        name: "Shape of You",
        album: "Divide",
        author: "Ed Sheeran",
    },
    {
        id: "8",
        cover: "https://picsum.photos/500",
        duration: "3:20",
        name: "Blinding Lights",
        album: "After Hours",
        author: "The Weeknd",
    },
    {
        id: "9",
        cover: "https://picsum.photos/500",
        duration: "5:26",
        name: "Lose Yourself",
        album: "Curtain Call",
        author: "Eminem",
    },
    {
        id: "10",
        cover: "https://picsum.photos/500",
        duration: "4:18",
        name: "Wonderwall",
        album: "(What's the Story) Morning Glory?",
        author: "Oasis",
    },
];

function renderMusics() {
    const musicWrapper = document.getElementById("music-wrapper");
    musicWrapper.innerHTML = "";

    data.forEach((item) => {
        const music = document.createElement("article");
        music.setAttribute("data-id", item.id);
        music.classList.add("music");
        music.style.backgroundImage = `url(${item.cover})`;
        music.addEventListener("click", () => {
            window.location.href = `detalhes.html?id=${music.getAttribute("data-id")}`;
        });

        const musicInfo = document.createElement("div");
        musicInfo.classList.add("music-info");
        music.appendChild(musicInfo);

        const musicTitle = document.createElement("h3");
        musicTitle.classList.add("music-title");
        musicTitle.textContent = item.name;
        musicInfo.appendChild(musicTitle);

        const musicAuthor = document.createElement("p");
        musicAuthor.classList.add("music-author");
        musicAuthor.textContent = item.author;
        musicTitle.appendChild(musicAuthor);

        musicWrapper.appendChild(music);
    });
}

function filterMusics() {
    const musicSearch = document.getElementById("search-music");
    const musicSearchText = musicSearch.value.toLowerCase();

    const musics = document.querySelectorAll(".music");
    musics.forEach((item) => {
        if (item.textContent.toLowerCase().includes(musicSearchText)) {
            item.style.display = "flex";
        } else {
            item.style.display = "none";
        }
    });
}

function renderDetails() {
    const params = new URLSearchParams(window.location.search);
    const musicId = params.get("id");
    const music = data.find((item) => item.id === musicId);

    const body = document.querySelector("body");
    body.style.backgroundImage = `url(${music.cover})`;

    const musicCover = document.getElementById("cover");
    musicCover.style.backgroundImage = `url(${music.cover})`;

    const musicDuration = document.getElementById("duration");
    musicDuration.textContent = music.duration;

    const musicTitle = document.getElementById("title");
    musicTitle.textContent = music.name;

    const musicAlbum = document.getElementById("album");
    musicAlbum.textContent = music.album;

    const musicAuthor = document.getElementById("author");
    musicAuthor.textContent = music.author;
}

const html = document.documentElement;
const htmlPage = html.getAttribute("page");
if (htmlPage === "main") {
    renderMusics();

    const musicSearch = document.getElementById("search-music");
    musicSearch.addEventListener("input", () => {
        filterMusics();
    });
} else {
    renderDetails();
}
