const BASE_URL = 'https://lighthouse-user-api.herokuapp.com'
const INDEX_URL = BASE_URL + '/api/v1/users/'
const users = JSON.parse(localStorage.getItem('favoriteProfiles'))
const dataPanel = document.querySelector('#data-panel')
const searchForm = document.querySelector('#search-form')
const searchInput = document.querySelector('#search-Input')
const userModalButton = document.querySelector('#user-modal-button')

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
    <button type = "button" class="btn btn-outline-info "><a href= mailto:"${data.email}" id="user-mail" > 
✉</a> </button > 
    <button type = "button" class="btn btn-outline-danger" data-id="${data.id}">♡</button > <button type="button" class="btn btn-outline-primary" data-dismiss="modal">Close</button>`
  })
}
function removeFromFavorite(id) {
  if (!users) return
  const userIndex = users.findIndex((user) => user.id === id)
  if (userIndex === -1) return
  users.splice(userIndex, 1)
  localStorage.setItem('favoriteProfiles', JSON.stringify(users))
  renderUserList(users)

}

// listen to data panel
dataPanel.addEventListener('click', function onPanelClicked(event) {
  if (event.target.matches('.card-img-top')) {
    showUserModal(Number(event.target.dataset.id))
  }
})

// listen to userModalButton
userModalButton.addEventListener('click', function onUserModalButtonClicked(event) {
  if (event.target.matches('.btn-outline-danger')) {
    removeFromFavorite(Number(event.target.dataset.id))
  }
})

renderUserList(users)


