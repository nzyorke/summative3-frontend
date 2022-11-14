
const footerTopInfo1 = document.getElementsByClassName(`footer-top-info1`);

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


// ==============================================
//      CHECK IF USER IS LOGGED IN OR NOT
// ==============================================
// this function checks if the users logged in
// if they are, show the username and their profile image

let checkLogin = () => {
    const userDetails = document.getElementById("user-details");
    let navContent;
    if (sessionStorage.userID) {
        // console.log("You're logged in")
        // console.log(sessionStorage.userName)
        navContent = `
          <div class="account-button" id="nav-img-acc">
        <span id="username">${sessionStorage.userName.toUpperCase()}</span>
        <span id="dp" style="background-image: url('${sessionStorage.profileImg
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


// ==============
//    FOOTER
// ==============

for (let i = 0; i < footerTopInfo1.length; i++) {

    const element = footerTopInfo1[i];

    element.addEventListener("click", function () {

        this.classList.toggle("active");

        console.log("clicked");

    });

}

const accountImg = document.getElementById("nav-img-acc");
const accountDetails = document.getElementById("account-details");

accountImg.onclick = function () {
  accountExpand();
};

function accountExpand() {
  accountDetails.classList.toggle("account-expand");
}
