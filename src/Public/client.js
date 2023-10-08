let store = Immutable.Map({
  user: Immutable.Map({ name: "Student" }),
  apod: "",
  rovers: Immutable.List([
    "Curiosity",
    "Opportunity",
    "Spirit",
    "Perseverance",
  ]),
  current: "",
});

const root = document.getElementById("root");

const renderApp = async (root, state) => {
  root.innerHTML = App(state);
};

window.addEventListener("load", () => {
  renderApp(root, store);
});

const updateStore = (store, newState) => {
  store = Object.assign(store, newState);
  renderApp(root, store);
};

const App = (state) => {
  const header = `
      <header>
        <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
          <div class="container">
            <a class="navbar-brand" href="#" onclick="handleResetStore()">Mars Dashboard</a>
            <button onClick="showNav()" class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav"
              aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
              <span class="navbar-toggler-icon" ></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNav">
              <ul class="navbar-nav">
                ${MenuNavItems(state)}
              </ul>
            </div>
          </div>
        </nav>
      </header>
    `;

  const footer = `
      <footer class="bg-dark text-white mt-5">
        <div class="container">
          <div class="row">
            <div class="col-md-6">
              <p class="name">Course Udacity with project Mars Dashboard </p>
              <p class="email">TRUNGTV20@fpt.com</p>
            </div>
          </div>
        </div>
      </footer>
    `;

  if (!state.get("current")) {
    return `
        ${header}
        <main class="container mt-5">
          <section>
            ${ImageOfDay(state)}
          </section>
        </main>
        ${footer}
      `;
  } else {
    return `
        ${header}
        <main class="container mt-5">
          <section id="section" class="row">
            ${showImageRecover(state)}
          </section>
        </main>
        ${footer}
      `;
  }
};

const ImageOfDay = (state) => {
  const apod = state.get("apod");
  if (!apod) {
    getImageOfDay(store);
  }

  if (apod.media_type === "video") {
    return `
        <div class="container mt-5">
          <p>See today's featured video <a href="${apod.url}">here</a></p>
          <p>${apod.title}</p>
          <p>${apod.explanation}</p>
        </div>
      `;
  } else {
    return `
        <div class="container mt-5">
          <img src="${apod.url}" class="img-fluid" alt="Image of the Day">
          <p>${apod.explanation}</p>
        </div>
      `;
  }
};

const handleResetStore = () => {
  updateStore(store, store.set("current", ""));
};

function handleClickItem(event) {
  const { id } = event.currentTarget;
  if (!!id) {
    getImageRecover(store, id)
      .then((result) => {})
      .catch((error) => {
        console.error("Error:", error);
      });
  }
}

const MenuNavItems = (state) => {
  return state
    .get("rovers")
    .map(
      (item) => `
        <li class="nav-item">
          <a href="#${item}" id="${item}" class="nav-link" onclick="handleClickItem(event)">${item}</a>
        </li>
        `
    )
    .join("");
};

const getImageOfDay = async (state) => {
  let { apod } = state;
  try {
    const response = await axios.get(`http://localhost:5000/apod`);
    apod = response.data;

    updateStore(store, store.set("apod", apod.data));
    return apod;
  } catch (error) {
    console.error("Error:", error);
    //Handle errors if any
    return null;
  }
};

const showImageRecover = (state) => {
  return state
    .get("current")
    .latest_photos.map(
      (item) => `
        <div class="col-md-4 mb-4">
        <div class="card">
          <img src="${item.img_src}" class="card-img-top" alt="Rover Image">
          <div class="card-body">
            <h5 class="card-title">Image Date: ${item.earth_date}</h5>
            <p class="card-text"><span class="font-weight-bold">Rover:</span> ${item.rover.name}</p>
            <p class="card-text"><span class="font-weight-bold">State of the Rover:</span> ${item.rover.status}</p>
            <p class="card-text"><span class="font-weight-bold">Launch Date:</span> ${item.rover.launch_date}</p>
            <p class="card-text"><span class="font-weight-bold">Landing Date:</span> ${item.rover.landing_date}</p>
          </div>
        </div>
      </div>
            `
    )
    .join("");
};

const getImageRecover = async (store, name) => {
  try {
    const response = await axios.get(`http://localhost:5000/rovers/${name}`);
    const current = response.data;
    updateStore(store, store.set("current", current));
    return current;
  } catch (error) {
    console.error("Error:", error);
    //Handle errors if any
    return null;
  }
};

const showNav = () => {
  const navbarCollapse = document.getElementById("navbarNav");
  if (navbarCollapse.classList.contains("show")) {
    navbarCollapse.classList.remove("show");
  } else {
    navbarCollapse.classList.add("show");
  }
};
