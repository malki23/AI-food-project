const fileRef = ref(storage, '/EspCam/image.jpg');
// 'file' comes from the Blob or File AP



// const imageUrl = 'http://192.168.0.52/capture';

fetch(imageUrl)
  .then(response => response.blob())
  .then(blob => {
    // Upload the file to Firebase Storage
    uploadBytes(fileRef, blob).then((snapshot) => {
      console.log('Uploaded a file to Firebase Storage!');
    });
  })
  .catch(error => {
    console.error('Error downloading the file:', error);
  });


getDownloadURL(fileRef)
  .then((url) => {
    console.log(url)
    // processResult(mock, url);

    const xhr = new XMLHttpRequest();
    xhr.responseType = 'blob';
    xhr.onload = (event) => {
      const blob = xhr.response;

      var myHeaders = new Headers();
      // myHeaders.append("Authorization", "Bearer 922d3aa9f5ad9b4cbcf2a5052ad2052940da15f7");
      // myHeaders.append("Authorization", "Bearer fee25a3e972b31738a231a8c5e9b95cf75ad76fc")
      // myHeaders.append("Authorization", "Bearer 1702dd1fe6a8cf04e7adecfa1779514b812487d6")
      myHeaders.append("Authorization", "Bearer a5d788b9e565aa855a86c8d2c2d815037596c0bc")



      var formdata = new FormData();
      formdata.append("image", blob, "image.jpg");

      var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: formdata,
        redirect: 'follow'
      };

      fetch("https://api.logmeal.es/v2/image/segmentation/complete/v1.0", requestOptions)
        .then(response => response.json())
        .then(result => {
          processResult(result, url);
        })
        .catch(error => console.log('error', error));

    };
    xhr.open('GET', url);
    xhr.send();

  });






///with camera 





fetch(imageUrl)
  .then(response => response.blob())
  .then(blob => {
    // Upload the file to Firebase Storage
    return uploadBytes(fileRef, blob);
  })
  .then((snapshot) => {
    console.log('Uploaded a file to Firebase Storage!');

    // Get the download URL
    return getDownloadURL(fileRef);
  })
  .then((url) => {
    console.log(url);

    // processResult(mock, url);
    const xhr = new XMLHttpRequest();
    xhr.responseType = 'blob';
    xhr.onload = (event) => {
      const blob = xhr.response;

      var myHeaders = new Headers();
      myHeaders.append("Authorization", "Bearer a5d788b9e565aa855a86c8d2c2d815037596c0bc");

      var formdata = new FormData();
      formdata.append("image", blob, "image.jpg");

      var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: formdata,
        redirect: 'follow'
      };

      fetch("https://api.logmeal.es/v2/image/segmentation/complete/v1.0", requestOptions)
        .then(response => response.json())
        .then(result => {
          processResult(result, url);
        })
        .catch(error => console.log('error', error));
    };
    xhr.open('GET', url);
    xhr.send();
  })
  .catch(error => {
    console.error('Error:', error);
  });














  