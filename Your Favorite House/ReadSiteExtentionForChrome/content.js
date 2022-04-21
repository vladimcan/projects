chrome.storage.sync.get(['page'], function(result) {
    let textArea = document.querySelector('#siteContent');
    let text ="";
    for(item of result.page ){
        text = text+item.price+"="+item.adress+"="+item.typeHouse+"="+item.bed+"="+item.bath+"="+item.bultYear+"="+item.sq+"="+item.publish+"?";
    }
    textArea.innerHTML = text;
    document.querySelector('#btn').click();
  });

