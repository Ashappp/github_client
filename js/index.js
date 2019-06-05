const form = document.querySelector(".boxForm");
const ul = document.querySelector(".ulAllCard");
const input = document.querySelector(".inputFetch");
const sortName = document.querySelector(".sortName");
const sortStar = document.querySelector(".sortStar");
const showFork = document.querySelector(".showFork");
const showAlll = document.querySelector(".showAll");
const showSources = document.querySelector(".showSources");
const starFiltering = document.querySelector(".inputStarFiltering");
const showResult = document.querySelector(".formFilter");
const filterByStar = document.querySelector(".inputStarFiltering");
const showMoreButton = document.querySelector(".showMore");

form.addEventListener("submit", FetchAllRepositorys);
showResult.addEventListener("submit", filterAndSort);
showMoreButton.addEventListener("click", FetchAllRepositorys);

let dataFetch = [];
let showMoreCountStart = 0;
let showMoreCountEnd = 3;

function FetchAllRepositorys(e) {
  e.preventDefault();
  const value = input.value;
  const URL = `https://api.github.com/search/repositories?q=user:${value}+fork:true`;
  fetch(URL)
    .then(send => send.json())
    .then(data => {
      renderOwner(data.items[0].owner);
      showMoreCard(data.items);
      drawAllRepositories(dataFetch);
      console.log(dataFetch);
    })
    .catch(error => console.log(error));
}

function renderOwner(owner) {
  const userPic = `<div class='ownerInfo'><img class = 'userPic' src =${
    owner.avatar_url
  }>
      <h2 class='ownerName'>${owner.login}</h2></div>`;
  ul.innerHTML = userPic;
}

function drawAllRepositories(arr) {
  const li = arr.reduce(
    (acc, el) =>
      acc +
      `<li class='oneCard'>
      <a class='spanTitle' href=${el.html_url}>${el.name}</a>
      <span class='span'>Description: ${el.description}</span>
      <span class='span'>Fork:  ${el.fork}</span>
      <span class='span'>Star: ${el.stargazers_count}</span>
      <span class='span'>Date update: ${el.updated_at.substr(0, 10)}</span>
      <span class='span'>Language: ${el.language}</span></li>`,
    ""
  );
  ul.innerHTML += li;
}

function showMoreCard(arr) {
  let copyArray = arr.slice(`${showMoreCountStart}`, `${showMoreCountEnd}`);
  dataFetch.push(...copyArray);
  showMoreCountStart += 3;
  showMoreCountEnd += 3;
}

function filterAndSort(e) {
  e.preventDefault();
  let filterSources = dataFetch;
  if (!dataFetch.length) {
    return;
  }
  if (showAlll.checked) {
    filterSources = filterSources;
  } else if (showFork.checked) {
    filterSources = filterSources.filter(el => el.fork);
  } else if (showSources.checked) {
    filterSources = filterSources.filter(el => !el.fork);
  }

  if (sortName.checked) {
    filterSources.sort((a, b) => a.name.localeCompare(b.name));
  }
  if (sortStar.checked) {
    filterSources.sort((a, b) => b.stargazers_count - a.stargazers_count);
  }

  if (filterByStar.value) {
    filterSources = filterSources.filter(
      el => el.stargazers_count >= Number(filterByStar.value)
    );
  }
  sortName.checked = false;
  sortStar.checked = false;
  drawAllRepositories(filterSources);
}
