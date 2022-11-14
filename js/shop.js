// =================================
//        DECLARE INPUTS
// =================================

const result = document.getElementById("result");
const goBtn = document.getElementById("go-button");

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

// =================================
//        DISPLAY PRODUCTS
// =================================

// This function allows us to display our products from the MongoDB on our app
let showAllProduct = () => {
  $.ajax({
    type: "GET",
    url: "http://localhost:3400/allProduct",
    // your success function contains a object which can be named anything
    success: (products) => {
      console.log(products);
      renderProducts(products);
    },
    error: (error) => {
      console.log(error);
    },
  });
};

// =================================
//  GET PRODUCT COLLECTION FROM AJAX
// =================================

populateProductModal = (productId) => {
  console.log(productId);
  $.ajax({
    url: `http://localhost:3400/product/${productId}`,
    type: "GET",
    success: (productData) => {
      console.log("Product was found!");
      console.log(productData);
      renderProductModal(productData, productId);
    },
    error: () => {
      console.log(error);
    },
  });
};

// =================================
//     PRODUCT MODAL FUNCTIONS
// =================================

const openImage = document.getElementsByClassName("open-image");
const closeModalBtn = document.getElementById("close-modal");
const productModal = document.getElementById("productModal");

let collectProductModals = () => {
  for (let i = 0; i < openImage.length; i++) {
    // This is when the user clicks on the project image

    openImage[i].onclick = () => {
      console.log("You clicked the modal");
      let productId = openImage[i].parentNode.parentNode.parentNode.id;
      console.log(productId);
      populateProductModal(productId);
      productModal.classList.toggle("active");
      putCommentsInModal(productId);
    };
  }
  closeModalBtn.onclick = () => {
    productModal.classList.toggle("active");
  };
};

openImage.onclick = () => {
  console.log("you clicked me");
};

// =================================
//        RENDER PRODUCTS
// =================================

// This function renders our products
let renderProducts = (products) => {
  let productId = products.id;
  console.log("the render products function is working");
  result.innerHTML = "";
  products.forEach((item) => {
    if (item.createdby == sessionStorage.userID) {
      result.innerHTML += `

        <div class="product-container" id="${item._id}">
        <div class="product-item">
            <div class="product-buttons">
            <span class="material-symbols-outlined trash-button" id="delete" data-bs-toggle="modal" data-bs-target="#deleteModal">
disabled_by_default
</span> 
<span class="material-symbols-outlined edit-button" data-bs-toggle="modal" data-bs-target="#editModal"">
edit_square
</span>
            </div>
            <div class="product-image">
                <img src="${item.img_url}" class="open-image" alt="${item.name
        }">
            </div>
            <div class="product-description">
                <h4>${item.name.toUpperCase()}</h4>
                <p>BY ${item.productowner.toUpperCase()}</p> 
                <div id="favourite">
                <h3>$${item.price}</h3>
                </div>
            </div>
        </div>
    </div>
    
        `;
    } else {
      result.innerHTML += `
      <div class="product-container" id="${item._id}">
      <div class="product-item">
      <div class="favourite-button" id="favourite-button">
<span class="material-symbols-outlined favourites-button">
favorite
</span>
      </div>
          <div class="product-image">
              <img src="${item.img_url}" class="open-image" alt="${item.name}">
          </div>
          <div class="product-description">
              <h4>${item.name.toUpperCase()}</h4>
              <p>BY ${item.productowner.toUpperCase()}</p> 
              <div id="favourite">
              <h3>$${item.price}</h3>
              </div>
          </div>
      </div>
  </div>
      `;
    }
  });


  // running collect edit buttons function
  collectEditButtons();
  // running collect delete buttons function
  collectDeleteButtons();
  // running add comment buttons function
  collectCommentButtons();

  collectProductModals();

  collectFavouriteButtons();

  renderFavourites(products);

  let deleteBtn = document.getElementById("submitDelete");
  deleteBtn.onclick = () => {
    console.log(productId);
    populateDeleteModal(productId);
    console.log("you've clicked delete button");
  };
};


// =================================
//    RENDER FAVOURITE BUTTON
// =================================

let renderFavourites = (products) => {
  console.log(products);
  let userId = sessionStorage.userID;
  $.ajax({
    type: "GET",
    url: `http://localhost:3400/user/${userId}`,
    success: (user) => {
      checkFavourites(user);
    },
    error: (error) => {
      console.log(error);
    },
  });
};

let checkFavourites = (user) => {
  let renderBtns = document.getElementsByClassName("favourite-button");
  if (renderBtns.length > 0) {
    let favouritesArray = user.favourites;
    if (favouritesArray.length > 0) {
      for (let i = 0; i < renderBtns.length; i++) {
        // console.log(renderBtns[i].parentNode.parentNode.id);
        let currentProductId = renderBtns[i].parentNode.parentNode.id;
        for (let index = 0; index < favouritesArray.length; index++) {
          let currentFavouriteId = favouritesArray[index].product_id;

          if (currentProductId == currentFavouriteId) {
            console.log("There weas a match");
            renderBtns[i].innerHTML = `
                      <span class="material-symbols-outlined favourites-button active-fill">
                  favorite
                  </span>
            `;
          }
        }
      }
    }
  }
};


let renderComments = (product) => {
  if (product.comments.length > 0) {
    let allComments = "";
    product.comments.forEach((comment) => {
      allComments += `
      <li><div class="user-comment-info"><img class="comments-profile-image" src="${comment.profile_img_url}"><h4>${comment.commentedby}</h4></div>
      <div class="user-comment"><p>${comment.text}</p></div>
      <div class="name-underline"></div>
      </li>`;
    });
    return allComments;
  } else {
    return `<div class="no-comment"><p>Be the first to comment!</p></div>`;
  }
};

let putCommentsInModal = (productId) => {
  $.ajax({
    type: "GET",
    url: `http://localhost:3400/product/${productId}`,
    success: (product) => {
      // inner comments html
      let productComments = document.getElementById("product-comments");
      productComments.innerHTML = `
      <ul>${renderComments(product)}</ul>
      `;
    },
    error: (error) => {
      console.log(error);
    },
  });
  let commentBtn = document.getElementById("post-comment");
  commentBtn.onclick = () => {
    console.log(productId);
    $.ajax({
      url: "http://localhost:3400/postComment",
      type: "POST",
      data: {
        text: document.getElementById("comment-input").value,
        product_id: productId,
        commentedby: sessionStorage.userName,
        createdby: sessionStorage.userID,
        profile_img_url: sessionStorage.profileImg,
      },
      success: (commentedby, createdby, profile_img_url) => {
        let commentInput = document.getElementById("comment-input");
        commentInput.value = "";
        console.log("Comment placed successfully");
        showAllProduct();
        putCommentsInModal(productId);
        console.log(commentedby, createdby, profile_img_url);
        // $("#commentModal").modal("hide");
      },
      error: () => {
        console.log("error, can't post comment");
      },
    });
  };
};

// =================================
//COLLECT EDIT BUTTONS & EDIT FUNCTION
// =================================

//this function will ask the backend for data relating to the product we clicked on to edit
populateEditModal = (productId) => {
  console.log(productId);
  $.ajax({
    url: `http://localhost:3400/product/${productId}`,
    type: "GET",
    success: (productData) => {
      console.log("Product was found!");
      console.log(productData);
      fillEditInputs(productData, productId);
    },
    error: () => {
      console.log(error);
    },
  });
};

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

populateDeleteModal = (productId) => {
  $.ajax({
    url: `http://localhost:3400/product/${productId}`,
    type: "GET",
    success: (productData) => {
      console.log("Product was found!");
      console.log(productData);
      renderDeleteModal(productData, productId);
    },
    error: () => {
      console.log(error);
    },
  });
};

let renderDeleteModal = (productData) => {
  let productId = productData._id;
  let deleteBtn = document.getElementById("submitDelete");
  deleteBtn.onclick = () => {
    deleteProduct(productId);
    console.log("you've clicked delete button");
  };
};

//this function will handle all our edits and add a click listener
//if we click on an edit button it will get the id from the parent node (the div around around our prodcuts)
let collectEditButtons = () => {
  // this will return an Array, but it's a slightly different one
  // it returns HTML "nodes" instead
  // Well have to use a regular loop over these
  let editButtonsArray = document.getElementsByClassName("edit-button");
  //this will loop over every edit button
  for (let i = 0; i < editButtonsArray.length; i++) {
    editButtonsArray[i].onclick = () => {
      console.log(editButtonsArray[i].id);
      console.log("edit button clicked");
      let currentId = editButtonsArray[i].parentNode.parentNode.parentNode.id;
      //edit products based on the id
      populateEditModal(currentId);
    };
  }
};

// =================================
//    FAVOURITE BUTTON FUNCTION
// =================================

sendFavouriteId = (productId) => {
  let userId = sessionStorage.userID;
  $.ajax({
    url: "http://localhost:3400/postFavourite",
    type: "POST",
    data: {
      user_id: userId,
      product_id: productId,
    },
    success: (product_id) => {
      console.log("you have sent the favourited item");
      // $("#commentModal").modal("hide");
    },
    error: () => {
      console.log("error, can't post comment");
    },
  });
};

//this function will handle all our edits and add a click listener
//if we click on an edit button it will get the id from the parent node (the div around around our prodcuts)
let collectFavouriteButtons = () => {
  // this will return an Array, but it's a slightly different one
  // it returns HTML "nodes" instead
  // Well have to use a regular loop over these
  let favouriteButtonsArray =
    document.getElementsByClassName("favourites-button");
  //this will loop over every edit button
  console.log(favouriteButtonsArray);
  for (let i = 0; i < favouriteButtonsArray.length; i++) {
    favouriteButtonsArray[i].onclick = () => {
      console.log(favouriteButtonsArray[i].id);
      console.log("favourite button clicked");
      favouriteButtonsArray[i].classList.toggle("active-fill");

      let currentId =
        favouriteButtonsArray[i].parentNode.parentNode.parentNode.id;
      console.log(currentId);
      // edit products based on the id
      sendFavouriteId(currentId);
    };
  }
};

// =================================
//       POPULATE EDIT MODAL
// =================================

fillEditInputs = (product, id) => {
  let productName = document.getElementById("productName");
  let productPrice = document.getElementById("productPrice");
  let productDescription = document.getElementById("productDescription");
  let imageUrl = document.getElementById("imgUrl");

  productName.value = product.name;
  productPrice.value = product.price;
  productDescription.value = product.description;
  imageUrl.value = product.img_url;

  let imagePreview = document.getElementById("image-preview");

  imagePreview.innerHTML = `
    <img class="edit-modal-image" src="${product.img_url}" alt="${productName}">
    `;

  //=================================
  //      EDIT CLICK LISTENER
  //=================================
  $("#updateProduct").click(function () {
    event.preventDefault();
    let productId = id;
    let productName = document.getElementById("productName").value;
    let productPrice = document.getElementById("productPrice").value;
    let productDescription =
      document.getElementById("productDescription").value;
    let imageUrl = document.getElementById("imgUrl").value;

    console.log(
      productId,
      productName,
      productPrice,
      productDescription,
      imageUrl
    );

    $.ajax({
      url: `http://localhost:3400/updateProduct/${productId}`,
      type: "PATCH",
      data: {
        name: productName,
        price: productPrice,
        description: productDescription,
        img_url: imageUrl,
      },
      success: (data) => {
        console.log(data);
        console.log("Success - product was updated");
        showAllProduct();
        $("#updateProduct").off("click");
      },
      error: () => {
        console.log("Error not updated");
      },
    });
  });
};

// =================================
//COLLECT DELETE BUTTONS & DELETE FUNCTION
// =================================

// // this function gets run when we click on a delete button
let deleteProduct = (productId) => {
  // use ajax and go to the delete route
  $.ajax({
    // Let's go to our route
    url: `http://localhost:3400/deleteProduct/${productId}`,
    type: "DELETE",
    success: () => {
      // at this point, we can assume that the delete was successful
      showAllProduct();
    },
    error: () => {
      console.log("Cannot call API");
    },
  });
};

// this function will handle all our deletes
let collectDeleteButtons = () => {
  // this will return an Array, but it's a slightly different one
  // it returns HTML "nodes" instead
  // we'll have use a regular loop to loop over these
  let deleteButtonsArray = document.getElementsByClassName("trash-button");
  // this will loop over every delete button
  for (let i = 0; i < deleteButtonsArray.length; i++) {
    deleteButtonsArray[i].onclick = () => {
      let productId = deleteButtonsArray[i].parentNode.parentNode.parentNode.id;
      populateDeleteModal(productId);
      // delete product based on the id
    };
  }
};

// ==============================================
//         COLLECT POST COMMENT BUTTONS
// ==============================================
// this function will handle all our comments
let collectCommentButtons = () => {
  // this will return an Array, but it's a slightly different one
  // it returns HTML "nodes" instead
  // we'll have use a regular loop to loop over these
  let commentButtonsArray = document.getElementsByClassName("comment-button");
  // this will loop over every delete button
  for (let i = 0; i < commentButtonsArray.length; i++) {
    commentButtonsArray[i].onclick = () => {
      let currentId = commentButtonsArray[i].parentNode.id;
      addComment(currentId);
    };
  }
};

// ==============================================
//   RUNNING THE FUNCTION TO SHOW ALL PRODUCTS
// ==============================================
showAllProduct();

const postProductBtnDiv = document.getElementById("add-product-button");
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

// =================================
//        ACCOUNT FUNCTIONS
// =================================

// const accountBtn = document.getElementById('nav-btn-acc');
const accountImg = document.getElementById("nav-img-acc");
const accountDetails = document.getElementById("account-details");

accountImg.onclick = function () {
  accountExpand();
};

function accountExpand() {
  accountDetails.classList.toggle("account-expand");

  // ==============================
  //  COLLECT PRODUCT MODAL
  // ==============================

  // Render the inner HTML for the modal
}

let renderProductModal = (projectData) => {
  let productOwner = document.getElementById("product-owner");
  let productName = document.getElementById("product-name");
  let productDescription = document.getElementById("description-type");
  let productImage = document.getElementById("product-image");
  // let productComments = document.getElementById("product-comments");
  let currentId = projectData._id;
  productOwner.innerHTML = `
<h3>${projectData.productowner.toUpperCase()}</h3>
`;

  productName.innerHTML = `
<h2>${projectData.name.toUpperCase()}</h2>
<h2>$${projectData.price}</h2>
`;

  productDescription.innerHTML = `
  <h4>DESCRIPTION</H4>
  <p>${projectData.description}</p>
  `;

  productImage.innerHTML = `
<img src="${projectData.img_url}" alt="${projectData.name}">
`;

  productOwner.innerHTML = `
<h3>${projectData.productowner.toUpperCase()}</h3>
`;
};

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

const modalDescription = document.getElementById("modal-description");
const modalMessage = document.getElementById("modal-message");
const inquireBtn = document.getElementById("inquire-button");
const backBtn = document.getElementById("back-button");

const sendBtn = document.getElementById("send-button");
const titleInput = document.getElementById("inquire-title-input");
const messageInput = document.getElementById("inquire-title-message");

inquireBtn.onclick = function () {
  modalDescription.classList.toggle("display");
  modalMessage.classList.toggle("display");
  console.log("you clicked this button");
};

backBtn.onclick = function () {
  modalDescription.classList.toggle("display");
  modalMessage.classList.toggle("display");
};

sendBtn.onclick = function () {
  titleInput.value = "";
  messageInput.value = "";
  modalDescription.classList.toggle("display");
  modalMessage.classList.toggle("display");
};
