const uploadBtn = document.querySelector("#uploadBtn");
const addTitle = document.querySelector("#add_title");
const addInfo = document.querySelector("#add_info");
const addPrice = document.querySelector("#add_price");
const productDiv = document.querySelector("#products .productlist");
const cartItems = document.querySelector(".cart-items")

// Array som allt sparas i
//PRODUCT LIST stringifyed för att local storage sa fungera

let PRODUCT_LIST = [];
let SHOPPING_CART = [];

//För delete och edit knappar 

const DELETE = "delete", EDIT = "edit", ADDTOCART = "addCartBtn";

// Kollar om det finns sparad data i localstorage

//PRODUCT_LIST = JSON.parse(localStorage.getItem("productList")) || [];



//eventlistener för knappar

productDiv.addEventListener("click", deleteEditCart);
uploadBtn.addEventListener("click" , newProduct);

//api funktion för bilder


 async function searchPhotos(e) {
  e.preventDefault();
  let accessKey = "zezTGXrl1WoKFEPFjbTOknYNWy0Im-5v_XUkLheIxR4";
  let query = document.getElementById("search").value;
  let url = "https://api.unsplash.com/photos/?client_id=" + accessKey + "&query="+query;
  
  // request till api

  let apiArray = []

  await fetch(url)
  .then(function (data) {
      return data.json();
  })
  .then(function(data) {
      

     data.map(photo => {
         
          let result = `${photo.urls.small}`;
          
          apiArray.push(result);
           
      });
      
  });
  let randomNum = getRandom(0,9);
  console.log(apiArray[randomNum]);
  return apiArray[randomNum];
  
}  


/* async function addToCart () {

  let imgUrl = await searchPhotos();
 let obj = {
     imageUrl: imgUrl,
     name: "shoer"
 }

 console.log(obj)
} */

/* // klicklyssnare
addToCart() */

// funktion som returnerar ett random nummer mellan min och max


function getRandom (min , max){
  return Math.floor(Math.random()*(max-min))+min;
}   

// Function för att pusha allt till array när uploadknappen är klickad
//async

let productItem = {};

async function newProduct(e){ 
  e.preventDefault();
  console.log(e);
  //if statement för att alla fält måste vara ifyllda
if(!addTitle.value || !addInfo.value || !addPrice.value) return;
  // spara allt i PRODUCT_LIST
  //parseInt för att få price till Number
  let imgUrl = await searchPhotos(e);
  
      productItem.img = imgUrl;
      productItem.title = addTitle.value;
      productItem.description = addInfo.value;
      productItem.price = parseInt(addPrice.value);
  
  PRODUCT_LIST.push(productItem);
   console.log(productItem);
  const localProductData = localStorage.getItem("productList");

  const existingProductData = JSON.parse(localProductData);

  const cleanedProductData = existingProductData ? existingProductData.concat(PRODUCT_LIST) : PRODUCT_LIST ;

  localStorage.setItem("productList", JSON.stringify(cleanedProductData)); 

  
  clearInput( [addTitle, addInfo, addPrice] );

  location.reload();
  
}



//delete or edit function, kollar efter vilket id som stämmer och väljer parentnode som har knappen

function deleteEditCart(event){
  const targetBtn = event.target;

  const product = targetBtn.parentNode;
  
  if ( targetBtn.id == DELETE ){
    deleteProduct(product);

  }else if(targetBtn.id == EDIT ){
    editProduct(product);
  }else if(targetBtn.id == ADDTOCART ){
    localStorageCart(product);
  }

}


// delete och edit och addToCart functions


//delete function för att tabort rätt product i arrayen, väljer efter id
function deleteProduct(product){
  PRODUCT_LIST = JSON.parse(localStorage.getItem("productList"));
  PRODUCT_LIST.splice( product.id, 1);
   
   localStorage.setItem("productList" , JSON.stringify (PRODUCT_LIST));
   location.reload();
}

//edit function som gör att man kan ändra alla inputs och tar bort produkten man vill ändra
function editProduct(product){
  let PRODUCT = PRODUCT_LIST[product.id];

  addTitle.value = PRODUCT.title;
  addInfo.value = PRODUCT.description;
  addPrice.value = PRODUCT.price;

  deleteProduct(product);
}

//För att lägga till producter i lokalstorage cart

let cartItem={}

function localStorageCart(product){
  
  let productTitle = product.querySelector(".product_title");
  let productPrice = product.querySelector(".product_price");
  let productImg = product.querySelector(".product_img");
  
  cartItem.title = productTitle.innerHTML
  cartItem.price = parseInt(productPrice.innerHTML)


  SHOPPING_CART.push(cartItem);

  const localData = localStorage.getItem("cartList");

  const existingData = JSON.parse(localData);

  console.log(existingData)

  const cleanedData = existingData ? existingData.concat(SHOPPING_CART) : SHOPPING_CART ;

  localStorage.setItem("cartList", JSON.stringify(cleanedData)); 


  /* showCart(); */

  location.reload();
  
}


/* function updateUI(){

  

    //Rensar input fälten i productDiv
    clearElement( [productDiv] ) ;
  
    //kör showproduct function och visar den i productDiv, index för att få id på varje produkt
    PRODUCT_LIST.forEach( (product, index) => {
      showproduct(productDiv, product.title, product.description, product.price, index)
  
    })
  
  
    //sparar product på local storage
    localStorage.setItem("PRODUCT_LIST", JSON.stringify(PRODUCT_LIST));
    
  
  
  } */

// Showproduct function
 
function showproduct(){
  
  const productData = localStorage.getItem("productList")
  const parsedProductData = JSON.parse(productData)
  Object.values(parsedProductData).map((item , index) => {
    productDiv.innerHTML += `
                        <div id="${index}" class="product-card">
                        <img class="product_img" src="${item.img}" alt="painting">
                        <h2 class="product_title">${item.title}</h2>
                        <p class="product_description">${item.description}</p>
                        <p class="product_price">${item.price}</p>
                        <span>kr</span>
                        <button id="addCartBtn">Lägg till i varukorg</button>
                        <button id="edit">edit</button>
                        <button id="delete">delete</button>
                  
    
    
    
                   </div>`;
  
    // afterbegin för att få senast tillagda product först               
    //const position = "afterbegin";
  
   // div.insertAdjacentHTML(position, product);
  })
} 

  

function clearElement(elements){
    elements.forEach ( element => {
      element.innerHTML = "";
  
    })
}
  
  
  
function clearInput(inputs){
    inputs.forEach( input => {
      input.value = "";
    })
}

/* When the user clicks on the button,
toggle between hiding and showing the dropdown content */
function myFunction() {
  document.getElementById("myDropdown").classList.toggle("show");
}

// Close the dropdown menu if the user clicks outside of it
window.onclick = function(event) {
  if (!event.target.matches('.dropbtn')) {
    var dropdowns = document.getElementsByClassName("dropdown-content");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }
}

function addToCart() {
  const data = localStorage.getItem("cartList")
  const parsedData = JSON.parse(data)
  const itemContainer = document.querySelector(".cart-items")
  Object.values(parsedData).map(item => {
    itemContainer.innerHTML += `
      <div class="cart-item>
        <img class="cart_product_img" src="">
      <span class="cart_product_title">${item.title}</span>
      <span class="cart_product_price">${item.price}</span>
      <input class="cart-quantity-input" type="number" value="1">
      <button class="cart_delete" type="button">REMOVE</button>
  </div>`
 
  })
}

let products = JSON.parse(localStorage.getItem("productList"))
console.log(products)
if(products.length>0){
showproduct();
}
