// =================================
//        NAV BAR FUNCTIONS
// =================================

const navBar = document.getElementById("nav-bar");
const navSearch = document.getElementById("nav-search");

navSearch.onclick = function () {
  navExpand();
};

function navExpand() {
  navBar.classList.toggle("nav-expand");
}

const filterBtn = document.getElementById("filter");
const filterOptions = document.getElementById("filter-dropdown");

filterBtn.onclick = function () {
  filterExpand();
  console.log("you clicked me");
};

function filterExpand() {
  filterOptions.classList.toggle("filter-expand");
}

populateAccountEditPage = () => {
  userId = sessionStorage.userID;
  $.ajax({
    url: `http://localhost:3400/user/${userId}`,
    type: "GET",
    success: (userData) => {
      console.log("Product was found!");
      console.log(userData);
      fillEditUserInputs(userData, userId);
    },
    error: () => {
      console.log(error);
    },
  });
};

fillEditUserInputs = (user, id) => {
  let username = document.getElementById("username-input");
  let password = document.getElementById("edit-password-input");
  let bio = document.getElementById("bio-input");
  let imageUrl = document.getElementById("profilepic-input");

  username.value = user.username;
  // password.value = user.password;
  if (sessionStorage.bio == "undefined") {
    bio.value = "";
  } else {
    bio.value = user.userdescription;
  }
  imageUrl.value = user.profile_img_url;

  //=================================
  //      EDIT CLICK LISTENER
  //=================================
  $("#edit-button2").click(function () {
    event.preventDefault();
    let editProfileImage = document.getElementById("edit-profile-image");
    let userId = sessionStorage.userID;
    let username = document.getElementById("username-input").value;
    let password = document.getElementById("edit-password-input").value;
    let bio = document.getElementById("bio-input").value;
    let imageUrl = document.getElementById("profilepic-input").value;

    console.log(username, password, imageUrl, bio);

    $.ajax({
      url: `http://localhost:3400/updateUser/${userId}`,
      type: "PATCH",
      data: {
        username: username,
        userdescription: bio,
        profile_img_url: imageUrl,
      },
      success: (data) => {
        console.log(data);
        console.log("Success - user was updated");
        newUsername = username;
        newBio = bio;
        newImageUrl = imageUrl;
        sessionStorage.setItem("userName", newUsername);
        sessionStorage.setItem("profileImg", newImageUrl);
        sessionStorage.setItem("bio", newBio);
        editProfileImage.innerHTML = `
        <img class="profile-image" src="${sessionStorage.profileImg}">
        `;
        console.log(newBio);
        document.location.href = "account.html";
      },
      error: () => {
        console.log("Error not updated");
      },
    });
  });
};

populateAccountEditPage();

let checkLogin = () => {
  const userDetails = document.getElementById("user-details");
  let navContent;
  if (sessionStorage.userID) {
    navContent = `
        <div class="account-button" id="nav-img-acc">
      <span id="username">${sessionStorage.userName.toUpperCase()}</span>
      <span id="dp" style="background-image: url('${
        sessionStorage.profileImg
      }')"></span>
      </div>
      `;
  } else {
    navContent = `<div id="nav-btn-acc">
        <a id="account-symbol" href="login.html"><span class="material-symbols-outlined"> account_circle </span></a>
        <a href="login.html"><button id="account-button">ACCOUNT</button></a>
        </div>
        <div id="nav-img-acc" style="display: none;"></div>
      `;
  }
  // render our logged in elements
  userDetails.innerHTML = navContent;
};

// =======================================
// ADD PROFILE PICTURES FOR ACCOUNT PAGES
// =======================================
let displayProfilePictures = () => {
  let editProfileImage = document.getElementById("edit-profile-image");

  // let userDescription = document.getElementById("profile-description-input").value;
  if (sessionStorage.userID) {
    editProfileImage.innerHTML = `
      <img class="profile-image" src="${sessionStorage.profileImg}">
      `;
  }
};

displayProfilePictures();

checkLogin();

const signoutBtn = document.getElementById("sign-out-button");

let logOut = () => {
  console.log("log out");
  sessionStorage.clear();
  window.location.replace("index.html");
};

if (sessionStorage.userID) {
  signoutBtn.onclick = () => {
    logOut();
  };
}

// const accountBtn = document.getElementById('nav-btn-acc');
const accountImg = document.getElementById("nav-img-acc");
const accountDetails = document.getElementById("account-details");

accountImg.onclick = function () {
  accountExpand();
};

function accountExpand() {
  accountDetails.classList.toggle("account-expand");
}

// =================================
//        FOOTER FUNCTIONS
// =================================

let footerTopInfo1 = document.getElementsByClassName(`footer-top-info1`);

for (let i = 0; i < footerTopInfo1.length; i++) {
  const element = footerTopInfo1[i];

  element.addEventListener("click", function () {
    this.classList.toggle("active");

    console.log("clicked");
  });
}

const passwordModal = document.getElementById("updatePasswordModal");
const openpasswordModalBtn = document.getElementById("edit-button1");
const closepasswordModalBtn1 = document.getElementById("submitDelete");
const closepasswordModalBtn2 = document.getElementById("cancelPasswordModal");

openpasswordModalBtn.onclick = () => {
  openPasswordModal();
};

closepasswordModalBtn1.onclick = () => {
  closePasswordModal();
};

closepasswordModalBtn2.onclick = () => {
  closePasswordModal();
};

function openPasswordModal() {
  passwordModal.classList.toggle("active");
}

function closePasswordModal() {
  passwordModal.classList.toggle("active");
}
