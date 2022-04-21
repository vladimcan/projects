// Initialize button with user's preferred color
let changeColor = document.getElementById("changeColor");

/* chrome.storage.sync.get("color", (data) => {
  changeColor.style.backgroundColor = data.color;
}); */

// When the button is clicked, inject setPageBackgroundColor into current page
changeColor.addEventListener("click", async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
   if(tab.url.includes("www.strawhomes.com")) {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: readList, 
    });
   } else {
     alert("Work only with WWW.STRAWHOMES.COM");
   }
  
});

// The body of this function will be executed as a content script inside the
// current page
/* function setPageBackgroundColor() {
  chrome.storage.sync.get("color", ({ color }) => {
    document.body.style.backgroundColor = color;
  });
} */

function readList() {
  /* alert("Work ..."); */
  let page = [];
  let list = document.querySelectorAll("div[itemscope]");
  for(let i=0; i< list.length; i++){
    let price = list[i].querySelector('.item-price').innerHTML;
    let adress = list[i].querySelector('span[itemprop]').innerHTML;
    let typeHouse= list[i].querySelector('div.amenities p').innerHTML;
    let adTimeAgo = list[i].querySelector('p.prop-date').lastChild.nodeValue;

    let a= list[i].querySelector('div.amenities p span');

    let bed="", bath = "", bultYear="", sq="";
    if(a !== null){
      bed = a.innerHTML;
      bath = a.nextSibling.innerHTML;
      bultYear = a.nextSibling.nextSibling.innerHTML; 
      sq = a.nextSibling.nextSibling.nextSibling.innerHTML; 
    }
    let per = adTimeAgo.split(' '); 
    let publish = adDate(adTimeAgo);
    console.log(i, price, adress, typeHouse, bed, bath, bultYear, sq, publish, per);
    
  page.push({price, adress, typeHouse, bed, bath, bultYear, sq, publish });
  } /*end for(){}*/
  /* console.log(page); */
  
  /** save in storage*/
  chrome.storage.sync.set({ page });
  /* chrome.storage.sync.clear(); */

  /* send message background.js */
  chrome.runtime.sendMessage({"message": "open_new_tab"});

  function adDate(str){
    /*
    input: ' ago 7 hours'
    output: obj Date of advertizinf
    */
    let currentDate = Date.now();
    let ago = 0;
    let per = str.split(' '); /* ['', 'ago', '7', 'hours'] */
    
    switch(per[3]){
        case 'days':
        case 'day':
            ago = per[2]*1000*60*60*24;
            break;
        case 'weeks':
        case 'week':
            ago = per[2]*1000*60*60*24*7;
            break;
        case 'months':
        case 'month':
            ago = per[2]*1000*60*60*24*30;
            break;
        case 'years':
        case 'year':
            ago = per[2]*1000*60*60*24*365;
            break;
        default:
            ago = 0;
    }
    
    let adTime = new Date(currentDate - ago).toISOString().substring(0,10);

    return adTime;
  } /* end adDate */
  
} /* end readList */

