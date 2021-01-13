const BASE_URL = 'https://lighthouse-user-api.herokuapp.com'
const INDEX_URL = BASE_URL + '/api/v1/users/'

const users = []
let filteredUsers = []

const dataPanel = document.querySelector('#data-panel')
const searchForm = document.querySelector('#search-form')
const searchInput = document.querySelector('#search-input')
const userModalButton = document.querySelector('#user-modal-button')

const USERS_PER_PAGE = 12
const paginator = document.querySelector('#paginator')

document.body.style.backgroundColor = "rgba(147,127,114,0.2)"
function renderUserList(data) {
  let rawHTML = ` `
  data.forEach((item) => {
    rawHTML += `
    <div class="col-4 col-sm-6 col-md-4 col-lg-3 ">
      <div class="avatar d-flex justify-content-around" >
        <img src="${item.avatar}" alt="user-avatar" class="card-img-top rounded-circle border border-secondary img-thumbnail  mt-5  " style="max-width:195px " data-id="${item.id}"data-toggle="modal" data-target ="#user-modal">
      </div>
    </div>`
  })
  dataPanel.innerHTML = rawHTML
}


function showUserModal(id) {
  const modalImage = document.querySelector('#user-modal-image')
  const modalTitle = document.querySelector('#user-modal-title')
  const modalInfo = document.querySelector('#user-modal-info')

  axios.get(INDEX_URL + id).then((response) => {
    const data = response.data
    modalImage.innerHTML = `<img src="${data.avatar
      }" alt="user-poster" class="img-fluid" id="modal-img">`

    modalTitle.innerText = data.name + '    ' + data.surname
    modalInfo.innerHTML = `
    <span>Gender：${data.gender}</span><br>
    <span>Age：${data.age}</span><br>
    <span>Region：${data.region}</span><br>
    <span>Birthday：${data.birthday}</span><br>
    `
    userModalButton.innerHTML = ` 
    <button type = "button" class="btn btn-outline-info ">
    <a href= mailto:"${data.email}" id="user-mail"> ✉</a> </button > 
    <button type = "button" class="btn btn-outline-danger" data-id="${(data.id)}">♡</button >
     <button type="button" class="btn btn-outline-primary" data-dismiss="modal">Close</button>`
  })
}

//加入收藏清單功能
function addToFavorite(id) {
  localStorage.getItem('favoriteProfiles')
  const list = JSON.parse(localStorage.getItem('favoriteProfiles')) || []
  const user = users.find((user) => user.id === Number(id))

  if (list.some((user) => user.id === Number(id))) {
    alert(`${user.name} 已在我的搭伙名單中.`)
  } else {
    list.push(user)
    alert(`Added ${user.name} 已加入我的搭伙名單!`)
  }
  localStorage.setItem('favoriteProfiles', JSON.stringify(list))
}


function renderPaginator(amount) {
  const numberOfPages = Math.ceil(amount / USERS_PER_PAGE)
  let rawHTML = ''
  for (let page = 1; page <= numberOfPages; page++) {
    rawHTML += `<li class="page-item"><a class="page-link" href="#"  data-page="${page}">${page}</a></li>`
  }
  paginator.innerHTML = rawHTML
}

function getUsersByPage(page) {
  const data = filteredUsers.length ? filteredUsers : users
  const startIndex = (page - 1) * USERS_PER_PAGE
  return data.slice(startIndex, startIndex + USERS_PER_PAGE)
}

// listen to data panel
dataPanel.addEventListener('click', function onPanelClicked(event) {
  if (event.target.matches('.card-img-top')) {
    showUserModal(Number(event.target.dataset.id))
  }
})

paginator.addEventListener('click', function onPaginatorClicked(event) {
  if (event.target.tagName !== 'A') return
  const page = Number(event.target.dataset.page)
  renderUserList(getUsersByPage(page))
})


// listen to search form
searchForm.addEventListener('submit', function onSearchFormSubmitted(event) {
  event.preventDefault()
  const keyword = searchInput.value.trim().toLowerCase()
  filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(keyword)
  )
  if (filteredUsers.length === 0) {
    return alert(`您輸入的關鍵字：${keyword} 沒有符合條件的使用者`)
  }
  renderPaginator(filteredUsers.length)
  renderUserList(getUsersByPage(1))
})

// 加入收藏清單按鈕監聽器
userModalButton.addEventListener('click', function onUserModalButtonClicked(event) {
  if (event.target.matches('.btn-outline-danger')) {
    addToFavorite(Number(event.target.dataset.id))
  }
})

// send request to index api
axios
  .get(INDEX_URL)
  .then((response) => {
    users.push(...response.data.results)
    renderPaginator(users.length)
    renderUserList(getUsersByPage(1))
  })
  .catch((err) => console.log(err))