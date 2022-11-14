const result = document.getElementById("result");
const accountResult = document.getElementById("account-result");
const goBtn = document.getElementById("go-button");
const gallery0 = document.getElementById(`gallery0`);
const gallerySwiper = document.getElementById(`gallery-swiper`);
const gallery1 = document.getElementById(`gallery1`);
const gallery2 = document.getElementById(`gallery2`);

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
      renderProductsAccount(products);
      renderLandingpageGallery(products);
    },
    error: (error) => {
      console.log(error);
    },
  });
};

const addNewProductDiv = document.getElementById("add-product-div");
// =================================
//        ADD NEW PRODUCTS
// =================================
let addNewProducts = () => {
  goBtn.onclick = () => {
    const nameInput = document.getElementById("name-input");
    const priceInput = document.getElementById("price-input");
    const descriptionInput = document.getElementById("description-input");
    const imageURLInput = document.getElementById("image-url-input");

    $.ajax({
      url: "http://localhost:3400/addProduct",
      // use the post type to create data somewhere
      // requesting to POST our data
      type: "POST",
      // we can send objects through to the backend, using the data argument
      data: {
        // the first property (i.e. the one on the left) called name has to be spelt exactly as the schema
        name: nameInput.value,
        price: priceInput.value,
        description: descriptionInput.value,
        img_url: imageURLInput.value,
        createdby: sessionStorage.userID,
        productowner: sessionStorage.userName,
      },
      success: () => {
        console.log("A new product was added.");
        showAllProduct();
        console.log(sessionStorage.userName);
        console.log(sessionStorage.userID);
      },
      error: () => {
        console.log("Error: cannot reach the backend");
      },
    });
  };
};



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
    //  RENDER COMMENTS
    let renderComments = () => {
      if (item.comments.length > 0) {
        let allComments = "";
        item.comments.forEach((comment) => {
          allComments += `<li>${comment.text}</li>`;
        });
        return allComments;
      } else {
        return "<p>Be the first to place a comment!</p>";
      }
    };

    if (item.createdby == sessionStorage.userID) {
      result.innerHTML += `

        <div class="product-container" id="${item._id}">
        <div class="product-item">
            <div class="product-buttons">
            <i class="bi bi-trash trash-button" id="delete" data-bs-toggle="modal" data-bs-target="#deleteModal"></i>
            <i class="bi bi-pencil edit-button" data-bs-toggle="modal" data-bs-target="#editModal"></i>
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
          <div class="product-buttons">
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

  let deleteBtn = document.getElementById("submitDelete");
  deleteBtn.onclick = () => {
    console.log(productId);
    populateDeleteModal(productId);
  };
};

// =================================
//   RENDER USER ACCOUNT PRODUCTS
// =================================

// This function renders our products
let renderProductsAccount = (products) => {
  let productId = products.id;
  console.log("the render products function is working");
  accountResult.innerHTML = "";
  products.forEach((item) => {
    //  RENDER COMMENTS
    let renderComments = () => {
      if (item.comments.length > 0) {
        let allComments = "";
        item.comments.forEach((comment) => {
          allComments += `<li>${comment.text}</li>`;
        });
        return allComments;
      } else {
        return "<p>Be the first to place a comment!</p>";
      }
    };

    if (item.createdby == sessionStorage.userID) {
      accountResult.innerHTML += `
  
      <div class="product-container" id="${item._id}">
      <div class="product-item">
          <div class="product-buttons">
          <i class="bi bi-trash trash-button" id="delete" data-bs-toggle="modal" data-bs-target="#deleteModal"></i>
          <i class="bi bi-pencil edit-button" data-bs-toggle="modal" data-bs-target="#editModal"></i>
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

  let deleteBtn = document.getElementById("submitDelete");
  deleteBtn.onclick = () => {
    console.log(productId);
    populateDeleteModal(productId);
  };
};

let renderLandingpageGallery = (products) => {
  // trending items
  let startTrendingItems;
  let endTrendingItems = 4;
  let trendingItems = products
    .slice(startTrendingItems, endTrendingItems)
    .map((item, i) => {
      return item;
    });

  trendingItems.forEach((item) => {
    let renderComments = () => {
      if (item.comments.length > 0) {
        let allComments = "";
        item.comments.forEach((comment) => {
          allComments += `<li>${comment.text}</li>`;
        });
        return allComments;
      } else {
        return "<p>Be the first to place a comment!</p>";
      }
    };

    if (item.createdby == sessionStorage.userID) {
      gallery0.innerHTML += `
    <div class="product-container" id="${item._id}">
        <div class="product-item">
            <div class="product-buttons">
            <i class="bi bi-trash trash-button" id="delete" data-bs-toggle="modal" data-bs-target="#deleteModal"></i>
            <i class="bi bi-pencil edit-button" data-bs-toggle="modal" data-bs-target="#editModal"></i>
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
      gallery0.innerHTML += `
      <div class="product-container" id="${item._id}">
      <div class="product-item">
          <div class="product-buttons">
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

  // new items
  let swiperItemsStart = 10;
  let swiperItemsEnd = 15;
  let swiperItems = products
    .slice(swiperItemsStart, swiperItemsEnd)
    .map((item, i) => {
      return item;
    });

  swiperItems.forEach((item) => {
    if (item.createdby == sessionStorage.userID) {
      gallerySwiper.innerHTML += `
      <div class="swiper-slide">
      <div class="product-container" id="${item._id}">
          <div class="product-item">
              <div class="product-image">
                  <img src="${item.img_url}" alt="${item.name}">
              </div>
          </div>
      </div>
  </div>
    `;
    } else {
      gallerySwiper.innerHTML += `
      <div class="swiper-slide">
      <div class="product-container" id="${item._id}">
          <div class="product-item">
              <div class="product-image">
                  <img src="${item.img_url}" alt="${item.name}">
              </div>
          </div>
      </div>
  </div>
    `;
    }
  });
  // new items
  let startNewItems = 5;
  let endNewItems = 6;
  let newItems = products.slice(startNewItems, endNewItems).map((item, i) => {
    return item;
  });

  newItems.forEach((item) => {
    let renderComments = () => {
      if (item.comments.length > 0) {
        let allComments = "";
        item.comments.forEach((comment) => {
          allComments += `<li>${comment.text}</li>`;
        });
        return allComments;
      } else {
        return "<p>Be the first to place a comment!</p>";
      }
    };

    if (item.createdby == sessionStorage.userID) {
      gallery1.innerHTML += `
    <div class="product-container" id="${item._id}">
      <div class="product-item">
          
          <div class="product-image">
              <img src="${item.img_url}" alt="${item.name}">
          </div>
          <div class="product-logo">
            <img src="../frontend/media/logo_papori_white.svg" alt="logo_papori_white">
          </div>
      </div>
  </div>
    `;
    } else {
      gallery1.innerHTML += `
    <div class="product-container" id="${item._id}">
    <div class="product-item">  
        <div class="product-image">
            <img src="${item.img_url}" alt="${item.name}">
        </div>
    </div>
    <div class="product-logo">
      <img src="../frontend/media/logo_papori_white.svg" alt="logo_papori_white">
    </div>
</div>
    `;
    }
  });

  // top sellers
  let startTopSellers = 8;
  let endTopSellers = 11;
  let topSellerItems = products
    .slice(startTopSellers, endTopSellers)
    .map((item, i) => {
      return item;
    });

  topSellerItems.forEach((item) => {
    let renderComments = () => {
      if (item.comments.length > 0) {
        let allComments = "";
        item.comments.forEach((comment) => {
          allComments += `<li>${comment.text}</li>`;
        });
        return allComments;
      } else {
        return "<p>Be the first to place a comment!</p>";
      }
    };

    if (item.createdby == sessionStorage.userID) {
      gallery2.innerHTML += `
    <div class="product-container" id="${item._id}">
      <div class="product-item">
          <div class="product-buttons">
          <i class="bi bi-trash trash-button" id="delete" data-bs-toggle="modal" data-bs-target="#deleteModal"></i>
          <i class="bi bi-pencil edit-button" data-bs-toggle="modal" data-bs-target="#editModal"></i>
          </div>
          <div class="product-image">
              <img src="${item.img_url}" alt="${item.name}">
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
      gallery2.innerHTML += `
    <div class="product-container" id="${item._id}">
    <div class="product-item">
        <div class="product-buttons">
        </div>
        <div class="product-image">
            <img src="${item.img_url}" alt="${item.name}">
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

  let deleteBtn = document.getElementById("submitDelete");
  deleteBtn.onclick = () => {
    console.log(productId);
    populateDeleteModal(productId);
  };
};

// =================================
//      ADD COMMENT FUNCTION
// =================================
// This function will send the id to the onclick listener of the submit button
let addComment = (productId) => {
  const commentBtn = document.getElementById("submitComment");
  // add a listener for the add comment button
  commentBtn.onclick = () => {
    console.log(productId);
    $.ajax({
      url: "http://localhost:3400/postComment",
      type: "POST",
      data: {
        text: document.getElementById("productComment").value,
        product_id: productId,
      },
      success: () => {
        console.log("Comment placed successfully");
        showAllProduct();
        $("#commentModal").modal("hide");
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
    console.log(productId);
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

fillEditUserInputs = (user, id) => {
  let username = document.getElementById("username-input");
  let password = document.getElementById("edit-password-input");
  let bio = document.getElementById("bio-input");
  let imageUrl = document.getElementById("profilepic-input");

  username.value = user.username;
  password.value = user.password;
  if (sessionStorage.bio == "undefined") {
    bio.value = "";
  } else {
    bio.value = user.userdescription;
  };
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
        password: password,
        userdescription: bio,
        profile_img_url: imageUrl,
      },
      success: (data) => {
        console.log(data);
        console.log("Success - user was updated");
        newUsername = username;
        newBio = bio;
        // newDescription = description;
        newImageUrl = imageUrl;
        sessionStorage.setItem("userName", newUsername);
        sessionStorage.setItem("profileImg", newImageUrl);
        sessionStorage.setItem("userdescription", newBio);
        editProfileImage.innerHTML = `
        <img class="profile-image" src="${sessionStorage.profileImg}">
        `;
        console.log(newBio);
      },
      error: () => {
        console.log("Error not updated");
      },
    });
  });
};

populateAccountEditPage();

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
    addNewProducts();
    navContent = `
        <div class="account-button" id="nav-img-acc">
      <span id="username">${sessionStorage.userName.toUpperCase()}</span>
      <span id="dp" style="background-image: url('${sessionStorage.profileImg
      }')"></span>
      </div>
      `;
    //   <a id="sign-out-button" href="#">Sign Out</a>
    addNewProductDiv.innerHTML = `
      <form id="add-project-form" action="javascript:void(0)">
      <label for="name-input">Product Name: </label>
      <input id="name-input" name="name-input" type="text">
      <label for="price-input">Product Price: </label>
      <input id="price-input" name="price-input" type="text">
      <label for="description-input">Product Description: </label>
      <input id="description-input" name="description-input" type="text">
      <label for="image-url-input">Product Image URL:</label>
      <input id="image-url-input" name="image-url-input" type="text">
  </form>
      `;
  } else {
    postProductBtnDiv.innerHTML = `
        <a href="login.html"><button id="go-button">Post New Product</button></a>
        `;
    navContent = `<div id="nav-btn-acc">
        <a id="account-symbol" href="signup.html"><span class="material-symbols-outlined"> account_circle </span></a>
        <button id="account-button">ACCOUNT</button>
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
  let accountProfileHeader = document.getElementById("account-profile-header");
  let accountBio = document.getElementById("account-bio");

  // let userDescription = document.getElementById("profile-description-input").value;
  if (sessionStorage.userID) {
    addNewProducts();
    editProfileImage.innerHTML = `
      <img class="profile-image" src="${sessionStorage.profileImg}">
      `;
    accountProfileHeader.innerHTML = `
      <img class="profile-image" src="${sessionStorage.profileImg}">
      <p id="username-account">${sessionStorage.userName.toUpperCase()}</p>
      `;
    if (sessionStorage.bio == "undefined") {
      accountBio.innerHTML =
        `
      <p id="bio-account">No bio yet!</p>
      `;
    } else {
      accountBio.innerHTML =
        `
    <p id="bio-account">${sessionStorage.bio}</p>
    `;
    };
  }
}

displayProfilePictures();

checkLogin();

const signoutBtn = document.getElementById("sign-out-button");

let logOut = () => {
  console.log("log out");
  sessionStorage.clear();
  window.location.reload();
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

  // ==============================
  //  COLLECT PRODUCT MODAL
  // ==============================

  // Render the inner HTML for the modal
}

let renderProductModal = (projectData) => {
  let productOwner = document.getElementById("product-owner");
  let inquryOwner = document.getElementById("inquiry-owner");
  let productName = document.getElementById("product-name");
  let productDescription = document.getElementById("modal-description");
  let productImage = document.getElementById("product-image");
  let productComments = document.getElementById("product-comments");
  console.log(projectData.productowner);
  let currentId = projectData._id;

  inquryOwner.innerHTML = `
<p>${projectData.productowner.toUpperCase()}</p>
`

  productName.innerHTML = `
<h2>${projectData.name.toUpperCase()}</h2>
<h2>$${projectData.price}</h2>
`;

  productDescription.innerHTML = `
  <div class="name-underline"></div>
  <div class="description-flex">
  <div class="description-type">
  <h4>DESCRIPTION</H4>
  <p>This is where the description will go</p>
  </div>
  <div class="inquire">
<button>INQUIRE</button>
</div>

  `;

  productImage.innerHTML = `
<img src="${projectData.img_url}" alt="${projectData.name}">
`;
  productOwner.innerHTML = `
<h3>${projectData.productowner.toUpperCase()}</h3>
`;
};


