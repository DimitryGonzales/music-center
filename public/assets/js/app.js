if (!usuarioCorrente.id) {
    window.location.href = "login.html";
}

const usuariosJson = "/usuarios";
const musicsJson = "/musics";
const favoritesJson = "/favorites";

async function fetchJson(query) {
    try {
        const response = await fetch(query);

        if (!response.ok) {
            console.log(`Status da resposta: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error(error.message);
    }
}

function renderGlideMusics(musics) {
    const glideSlides = document.querySelector(".glide__slides");
    glideSlides.innerHTML = "";

    const glideBullets = document.querySelector(".glide__bullets");
    glideBullets.innerHTML = "";

    const musicsFiltered = musics.filter((item) => item.id <= 3);
    musicsFiltered.forEach((item) => {
        const glideSlide = document.createElement("li");
        glideSlide.classList.add("glide__slide");

        const music = document.createElement("article");
        music.setAttribute("data-id", item.id);
        music.classList.add("music");
        music.classList.add("glide-music");
        music.style.backgroundImage = `url(${item.cover})`;
        music.addEventListener(
            "click",
            () =>
                (window.location.href = `details.html?id=${music.getAttribute("data-id")}`),
        );

        const musicInfo = document.createElement("div");
        musicInfo.classList.add("music-info");
        music.appendChild(musicInfo);

        const musicTitle = document.createElement("h3");
        musicTitle.classList.add("music-title");
        musicTitle.textContent = item.title;
        musicInfo.appendChild(musicTitle);

        const musicAuthor = document.createElement("p");
        musicAuthor.classList.add("music-author");
        musicAuthor.textContent = item.author;
        musicTitle.appendChild(musicAuthor);

        glideSlide.appendChild(music);
        glideSlides.appendChild(glideSlide);

        const glideBullet = document.createElement("button");
        glideBullet.classList.add("glide__bullet");
        glideBullet.setAttribute("data-glide-dir", item.id - 1);
        glideBullets.appendChild(glideBullet);
    });
    new Glide(".glide").mount();
}

async function renderMusics(musics) {
    const musicWrapper = document.getElementById("music-wrapper");
    musicWrapper.innerHTML = "";

    let favorites = await fetchJson(favoritesJson);

    musics.forEach((item) => {
        const music = document.createElement("article");
        music.classList.add("music");
        music.style.backgroundImage = `url(${item.cover})`;
        music.addEventListener(
            "click",
            () => (window.location.href = `details.html?id=${item.id}`),
        );

        const musicInfo = document.createElement("div");
        musicInfo.classList.add("music-info");
        music.appendChild(musicInfo);

        const musicFavorite = document.createElement("button");
        musicFavorite.classList.add("music-favorite");
        const favoriteFound = favorites.find(
            (favorite) =>
                favorite.usuarioId === usuarioCorrente.id &&
                favorite.musicId === item.id,
        );
        if (favoriteFound) {
            musicFavorite.classList.add("favorited");
        }
        musicFavorite.textContent = "";
        musicFavorite.addEventListener("click", async (event) => {
            event.stopPropagation();

            const existingFavorite = favorites.find(
                (favorite) =>
                    favorite.usuarioId === usuarioCorrente.id &&
                    favorite.musicId === item.id,
            );

            if (existingFavorite) {
                await fetch(`${favoritesJson}/${existingFavorite.id}`, {
                    method: "DELETE",
                });

                favorites = favorites.filter(
                    (favorite) => favorite.id !== existingFavorite.id,
                );

                musicFavorite.classList.remove("favorited");
            } else {
                const favorite = {
                    usuarioId: usuarioCorrente.id,
                    musicId: item.id,
                };

                const response = await fetch(favoritesJson, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(favorite),
                });

                const createdFavorite = await response.json();
                favorites.push(createdFavorite);

                musicFavorite.classList.add("favorited");
            }
        });
        musicInfo.appendChild(musicFavorite);

        const musicTitle = document.createElement("h3");
        musicTitle.classList.add("music-title");
        musicTitle.textContent = item.title;
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

    const musics = document.querySelectorAll(".music:not(.glide-music)");
    musics.forEach((item) => {
        if (item.textContent.toLowerCase().includes(musicSearchText)) {
            item.style.display = "flex";
        } else {
            item.style.display = "none";
        }
    });
}

function renderDetails(musics) {
    const params = new URLSearchParams(window.location.search);
    const musicId = params.get("id");
    const music = musics.find((item) => item.id === musicId);

    const body = document.querySelector("body");
    body.style.backgroundImage = `url(${music.cover})`;

    const musicCover = document.getElementById("details-cover");
    musicCover.style.backgroundImage = `url(${music.cover})`;

    const musicDuration = document.getElementById("details-duration");
    musicDuration.textContent = music.duration;

    const musicTitle = document.getElementById("details-title");
    musicTitle.textContent = music.title;

    const musicAlbum = document.getElementById("details-album");
    musicAlbum.textContent = music.album;

    const musicAuthor = document.getElementById("details-author");
    musicAuthor.textContent = music.author;
}

async function initMain() {
    const musics = await fetchJson(musicsJson);
    renderGlideMusics(musics);
    await renderMusics(musics);

    const musicSearch = document.getElementById("search-music");
    musicSearch.addEventListener("input", () => filterMusics());
}

async function initDetails() {
    const musics = await fetchJson(musicsJson);
    renderDetails(musics);
}

async function initFavorites() {
    const favorites = await fetchJson(favoritesJson);
    const musics = await fetchJson(musicsJson);
    const musicsFavorited = musics.filter((music) =>
        favorites.some(
            (favorite) =>
                favorite.usuarioId === usuarioCorrente.id &&
                favorite.musicId === music.id,
        ),
    );

    await renderMusics(musicsFavorited);

    const musicSearch = document.getElementById("search-music");
    musicSearch.addEventListener("input", () => filterMusics());
}

async function initCrud() {
    const newMusicForm = document.getElementById("new-music");
    newMusicForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const newMusic = {
            id: "",
            cover: document.getElementById("new-music-cover").value,
            duration: document.getElementById("new-music-duration").value,
            title: document.getElementById("new-music-title").value,
            album: document.getElementById("new-music-album").value,
            author: document.getElementById("new-music-author").value,
        };

        await fetch(musicsJson, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(newMusic),
        });
    });
}

async function liberarCrud() {
    const users = await fetchJson(usuariosJson);
    const isAdmin = users.find((user) => user.id === usuarioCorrente.id).admin;

    if (window.location.pathname === "/crud.html" && !isAdmin) {
        window.location.href = "/";
    }

    if (isAdmin) {
        const headerLinkWrapper = document.querySelector(
            ".header-link-wrapper",
        );

        const headerLink = document.createElement("a");
        headerLink.setAttribute("href", "crud.html");
        headerLink.classList.add("header-link", "underline-when-hover");
        headerLink.textContent = "CRUD";
        headerLinkWrapper.appendChild(headerLink);
    }
}

const page = document.documentElement.getAttribute("data-page");
if (page === "main") {
    initMain();
} else if (page === "details") {
    initDetails();
} else if (page === "favorites") {
    initFavorites();
} else {
    initCrud();
}

liberarCrud();
