function setIndex(strIndex) {
    // ad listener and pass index, index type
    let str = 'a['+strIndex+']';
    let arr = document.querySelectorAll(str);
    for(let i=0; i < arr.length; i++) {
        arr[i].addEventListener("click",function() {
            myF(this.attributes[0].value, strIndex, str)});
    } 
    // activ index storing in localStorade
    let ind = localStorage.getItem(strIndex)*1;
    let a = arr[ind].classList.add("active"); 
}

function myF(index, strIndex,str) {
    // index - selected new index
    // strIndex - type of index and variable name in localStorage 
    // str - 'a['+strIndex+']'

    // read old index from localStorade
    let indRemove = localStorage.getItem(strIndex)*1;
    // determine new activ index
    let indAct = parseInt(index);

    let arr = document.querySelectorAll(str);
    arr[indRemove].classList.remove("active"); 
    arr[indAct].classList.add("active"); 
    localStorage.setItem(strIndex, indAct);
   
 }

setIndex('sort-index');
setIndex('seach-index');
setIndex('bed-index');
setIndex('bath-index');