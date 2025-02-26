
// import { getStorage, ref, uploadBytes } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-storage.js";




import { initializeApp } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-app.js";
import { getStorage, ref, getDownloadURL, uploadBytes } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-storage.js";
import { getDatabase, set, ref as refD, update, get, child } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-database.js";
import { getAuth, updateProfile, signInWithEmailAndPassword, onAuthStateChanged, signOut, GoogleAuthProvider, signInWithRedirect, getRedirectResult, signInWithPopup } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyAs8wqzfMoB1fx1cbwKDUJ5HH9pZmGeaSM",
    authDomain: "iot-project-of-malki.firebaseapp.com",
    databaseURL: "https://iot-project-of-malki-default-rtdb.firebaseio.com",
    projectId: "iot-project-of-malki",
    storageBucket: "iot-project-of-malki.appspot.com",
    messagingSenderId: "1042946587373",
    appId: "1:1042946587373:web:600231fca71a206df16ae4",
    measurementId: "G-4B1MKYBMK4"
};
const app = initializeApp(firebaseConfig);
const database = getDatabase(app)
const auth = getAuth(app);
//const user = auth.currentUser;
const img = new Image()
img.src = ""

const Btn = document.getElementById("btnTakePic");
const canvas = document.getElementById("canvas");
const colors = ['blue', 'red', 'green', 'purple', 'cyan']; const storage = getStorage(app);
const pathReference = ref(storage, 'EspCam/imageTest2.jpg');





document.getElementById("btnTakePic").addEventListener("click", async () => {




    const lastFood = document.getElementById("lastFood")
    const layerlast = document.getElementById("layerLast")
    layerlast.classList.remove("visually-hidden");
    layerlast.style.fill = "#124660"
    const layerBefore = document.getElementById("layerBefore")
    layerBefore.classList.remove("visually-hidden");
    layerBefore.style.fill = "#124660"


    //  lastFood.classList.add("shadowBoxe")
    lastFood.innerHTML = `
        <div class="row  m-0 p-0"> 
             <div class="p-4  col col-12  d-flex justify-content-center  justify-content-lg-around  align-items-center" style=" background-color:#124660" >
                    <div class=" d-flex justify-content-center align-items-center  placeholder-glow  w-100 " id="AiInfo">
                          <span class="placeholder col-3">   </span>
                          <span class="placeholder col-3">   </span>
                          <span class="placeholder col-3">   </span>
                      </div>
            </div>
      </div>`

    Btn.querySelector('div').classList.remove("visually-hidden");
    Btn.querySelector('i').classList.add("visually-hidden");
    Btn.disabled = true;
    Btn.style.background = "#a9a9a9c1";
    Btn.style.border = "#a0a0a0c1";
    Btn.style.color = "#626262c1;";
    Btn.style.pointerEvents = 'none';


    var imageUrl = "http://172.20.10.4/capture";




    ///////////////////////////////////////////////////////////
    const fileRef = ref(storage, '/EspCam/imageTest2.jpg');
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



    ///////////////////////////////////////////////////////
});


//return area of an aliment -------------------------------------------------------
function polygonArea(poly) {
    let area = 0;
    var j = poly.length - 2;

    for (var i = 0; i < poly.length; i += 2) {
        area += (poly[j] + poly[i]) * (poly[j + 1] - poly[i + 1]);
        j = i;
    }

    return Math.abs(area / 2);
}


//draw around the aliment and check if density are present 

async function checkDensity(result, array) {
    console.log('%ccheckDens () --------------', 'color:green')
    let arrD = [];
    // console.log(array)
    let found = false;

    //add density if 1 aliment and its not in the database-----------------------------------
    if (result.segmentation_results.length == 1 || array.length == 3) {
        const dbRef = refD(getDatabase());
        try {
            const snapshot = await get(child(dbRef, `densityArray`));

            let densityArray = !snapshot.val() ? [] : snapshot.val();

            // If densityArray is not an array, initialize it to an empty array
            if (!Array.isArray(densityArray)) {
                densityArray = [];
            }

            // calculate area of each element in the plate ----------------------------------------------

            const item = result.segmentation_results[0]
            const poly = item.polygon;
            //area of each element
            let Air = polygonArea(poly).toFixed(3).padEnd(10);


            //receive ffrrom database when get load cell
            const weight = 1000

            const density = weight / Air;

            //add density if 1 aliment and its not in the database -----------------------------------
            //(array = 3 mean there is one aliement because of gram and date)
            if (array.length == 3) {
                console.log('%c array = 1', 'background-color:cyan')
                if (densityArray.length > 0) {

                    const key = Object.keys(array[2])[0];
                    for (let i = 0; i < densityArray.length; i++) {
                        if ((densityArray[i][0].name === key)) {
                            found = true;
                        }
                    }


                    if (!(found)) {
                        console.log("not found so add")
                        arrD.push({ ["name"]: key, ["density"]: density })
                        densityArray.push(arrD);
                        found = true;
                        set(refD(database, `densityArray`), densityArray)
                        notify('success', key + ' added to database Successfully !');

                        // set(refD(database, `densityArray`), densityArray).then(() => { console.log("densityArray", densityArray) });

                    }
                    found = true
                    return found;
                }
                else {

                    const key = Object.keys(array[2])[0];
                    console.log("first")
                    arrD.push({ ["name"]: key, ["density"]: density })
                    densityArray.push(arrD);
                    set(refD(database, `densityArray`), densityArray)
                    notify('success', key + ' added to database Successfully !');
                    found = true
                    return found;
                }

            }
            else {
                const info = result.segmentation_results[0].recognition_results[0];
                if (densityArray.length > 0) {


                    for (let i = 0; i < densityArray.length; i++) {
                        if ((densityArray[i][0].name === info.name)) {
                            found = true;
                            return found;
                        }
                    }
                    if (!found) {
                        arrD.push({ ["name"]: info.name, ["density"]: density })
                        densityArray.push(arrD);
                        set(refD(database, `densityArray`), densityArray)
                        notify('success', info.name + ' added to database Successfully !');
                        found = true
                        return found;
                    }

                    found = true
                    return found;

                }
                else {


                    console.log("first")

                    arrD.push({ ["name"]: info.name, ["density"]: density })
                    densityArray.push(arrD);
                    set(refD(database, `densityArray`), densityArray)
                    notify('success', info.name + ' added to database Successfully !');
                    found = true
                    return found;

                }

            }


        } catch (error) {
            console.error(error);
        };

    }
    //check if all aliment arr in database-----------------------------------
    else {
        console.log("not alone ")
        found = true;
        const dbRef = refD(getDatabase());
        try {
            const snapshot = await get(child(dbRef, `densityArray`));
            let densityArray = !snapshot.val() ? [] : snapshot.val();

            // If densityArray is not an array, initialize it to an empty array
            if (Array.isArray(densityArray)) {


                let count = 0


                // if (info.name === "grilled entrecote") {
                //     info.name = "schnitzel"
                //     console.log("schhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh")
                // }
                // if (info.name === "roast beef") { info.name = "pasta with cheese sauce" }

                if (array.length > 0) {
                    console.log("array>0")
                    let counter = 0
                    for (let j = 2; j < array.length; j++) {
                        count = 0
                        const key = Object.keys(array[j])[0];

                        console.log(key)

                        for (let i = 0; i < densityArray.length; i++) {


                            if ((densityArray[i][0].name === key)) {
                                console.log(key + " have dens")
                                count++;

                            }

                        }
                        if (count == 0) {
                            console.log(key + " no dens")
                            found = false;
                            return;
                        }


                    }

                }

                else {
                    result.segmentation_results.map(item => {
                        const info = item.recognition_results[0];
                        count = 0;
                        for (let i = 0; i < densityArray.length; i++) {

                            if ((densityArray[i][0].name === info.name)) {
                                console.log(info.name + " have dens")
                                count++;
                            }

                        }
                        if (count == 0) {
                            console.log(info.name + " no dens")
                            found = false;
                            return;
                        }
                    });
                }


            }
        } catch (error) {
            console.error(error);

        };
    }
    console.log("found : " + found)
    return found
}


async function processResult(result, url) {
    console.log('%cprocessResult () ---------------', 'color:green')


    // let totalDens = 0
    let TotalAir = 0;
    //calculate total area of all item in the plate -----

    const dbRef = refD(getDatabase());


    result.segmentation_results.map(async item => {
        const info = item.recognition_results[0];
        const poly = item.polygon;
        TotalAir += polygonArea(poly);

    });

    //how to cereate a div in js?

    let found = false;
    //add density if 1 aliment and its not in the database-----------------------------------
    let test = []

    console.error("checkDens function() firstTime")
    found = await checkDensity(result, test)

    const imgEl = document.createElement('img');
    const row = document.getElementById("row")
    imgEl.setAttribute('src', url);
    imgEl.setAttribute('hidden', '');
    document.body.append(imgEl);

    imgEl.onload = () => {

        canvas.classList.remove("visually-hidden");
        row.classList.remove("visually-hidden");

        Btn.parentNode.removeChild(Btn)

        const c = document.querySelector("canvas");
        c.width = result.processed_image_size.width;
        c.height = result.processed_image_size.height;
        const ctx = c.getContext("2d");
        ctx.drawImage(imgEl, 0, 0, result.processed_image_size.width, result.processed_image_size.height);



        //dessin contour et nom du produit-------------------------------------------------------------------------------------
        result.segmentation_results.map(item => {
            const box = item.contained_bbox;
            const info = item.recognition_results[0];
            const poly = item.polygon;


            if (info.name === "grilled entrecote") {
                info.name = "schnitzel"
                console.log("schhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh")
            }
            if (info.name === "roast beef") { info.name = "pasta with cheese sauce" }

            if (info.name === "cola drink") { info.name = "pepper" }
            if (info.name === "backed potatoes") { info.name = "pasta with cheese sauce" }
            if (info.name === "mashed potato") { info.name = "pasta with cheese sauce" }
            // if (info.name === "chocolate drink") { info.name = "pepper" }
            // if (info.name === "milk") { info.name = "salt" }



            ctx.beginPath();
            ctx.lineWidth = "2";

            ctx.strokeStyle = colors[Math.floor(Math.random() * 10) % colors.length];
            //ctx.rect(box.x, box.y, box.w, box.h);
            ctx.font = "18px Arial";
            ctx.fillStyle = ctx.strokeStyle;
            ctx.textAlign = "center";
            ctx.shadowColor = "black";
            ctx.lineWidth = 3;
            ctx.stroke();


            ctx.moveTo(poly[0], poly[1]);
            for (let i = 2; i < poly.length - 1; i += 2) {
                ctx.lineTo(poly[i], poly[i + 1])

            }
            //close the polygon shape
            ctx.moveTo(poly[poly.length - 2], poly[poly.length - 1]);
            ctx.lineTo(poly[0], poly[1])

            ctx.stroke();
            ctx.closePath();

            ctx.strokeStyle = "white";
            ctx.shadowBlur = 0;
            ctx.strokeText(info.name, box.x + box.w / 2, box.y + box.h / 2);
            ctx.fillText(info.name, box.x + box.w / 2, box.y + box.h / 2);





        });
        let array = []
        let show = false
        infoFood(array, found, show, result, TotalAir);
        // getDensity(result);

    }
}

let arr = []
let FirstTime = false;

//callthe api to give info for the food element (NUTRITIONIX API) and create arr
async function infoFood(array, found, show, result, TotalAir, savedArr) {

    found = await checkDensity(result, array)

    console.log('%cinfoFood ()----------------', 'color:green')
    getAiInfo(result)



    //array is new arr with 1 item in less when press on delete on item 

    let arr = [];



    if (array.length > 0) {


        console.log('%c array.length > 0', 'color:cyan')
        TotalAir = 0
        let Air = 0

        //calculate totalAir
        result.segmentation_results.map(async item => {
            const info = item.recognition_results[0];
            for (let i = 0; i < array.length; i++) {
                const key = Object.keys(array[i])[0];
                if (info.name === key) {
                    const poly = item.polygon;
                    TotalAir += polygonArea(poly);
                }
            }
        });

        let countItem = 1;

        for (const item of result.segmentation_results) {

            console.log(arr)

            const info = item.recognition_results[0];
            countItem++;

            // let foundInArray = false
            // for (let i = 0; i < array.length; i++) {
            //     const key = Object.keys(array[i])[0];
            //     if (info.name === key) {
            //         foundInArray = true
            //     }
            // }


            let key = Object.keys(array[countItem])[0];

            const poly = item.polygon;
            Air = polygonArea(poly);


            if (key === "meal salad") {
                key = "mixed salad"
            }



            let percent = (Air / TotalAir).toFixed(3);

            let FoundNutrition = false;
            let indexNutrition = 0;

            const weight = 1000;
            const numtoday = [

                "Sunday",
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday"
            ]
            const dbRef = refD(getDatabase());


            //check if food element info is stored in NutritionArray and save index
            try {
                const snapshot = await get(child(dbRef, `NutritionArray`));

                let NutritionArray = !snapshot.val() ? [] : snapshot.val();
                if (NutritionArray.length > 0) {
                    for (let i = 0; i < NutritionArray.length; i++) {
                        //   console.log(NutritionArray[i][0].name  )
                        if (key === NutritionArray[i][0].name) {
                            FoundNutrition = true;
                            indexNutrition = i;

                        }
                    }
                }
            } catch (error) {
                console.error(error);
            };


            //if aliment not found in nutritionArray
            if (!FoundNutrition) {

                console.log("nutritionix")
                await fetch(`https://api.nutritionix.com/v1_1/search/${key}?results=0:1&fields=*&appId=3717a529&appKey=1b0412a361dcb7d3bb1c21ab916a2a36`)
                    .then(response => response.json())
                    .then(async data => {


                        let cal = 0;
                        let prot = 0;
                        let fat = 0;
                        let sugars = 0;
                        let gram = 0;
                        let density = 0;
                        //area of each element



                        //if all ingredient have density in densityArray
                        if (found) {
                            // console.log("   perwWeight")


                            // set aliment info to arr per weight
                            try {

                                const snapshot = await get(child(dbRef, `densityArray`));

                                let densityArray = !snapshot.val() ? [] : snapshot.val();

                                //check density in density array for the righ element to calculate gram
                                for (let i = 0; i < densityArray.length; i++) {

                                    if ((densityArray[i][0].name === key)) {

                                        density = densityArray[i][0].density
                                    }
                                }

                                //set the food nutrition info per weight in arr

                                gram = weight * ((density * percent) / await GetPercentDensT(result, TotalAir, array)).toFixed(3);
                                cal = (data.hits[0].fields.nf_calories * gram / data.hits[0].fields.nf_serving_weight_grams).toFixed(1)
                                prot = (data.hits[0].fields.nf_protein * gram / data.hits[0].fields.nf_serving_weight_grams).toFixed(1)
                                fat = (data.hits[0].fields.nf_total_fat * gram / data.hits[0].fields.nf_serving_weight_grams).toFixed(1)
                                sugars = (data.hits[0].fields.nf_sugars * gram / data.hits[0].fields.nf_serving_weight_grams).toFixed(1)
                                console.log(key + " key    " + prot + " prot    " + fat + " fat    " + sugars + " sugars    " + gram + " gram")


                                arr.push({ [key]: { ["calories"]: cal, ["protein"]: prot, ["fat"]: fat, ["sugars"]: sugars, ["gram"]: gram } })

                                console.log("construction")


                            } catch (error) {
                                console.error(error);
                            }

                        }

                        //if aliment not found in nutrionArray and not found in densityArray
                        else {
                            //  console.log("per 100g")

                            // set aliment info to arr for 100g
                            {
                                cal = (data.hits[0].fields.nf_calories * 100 / data.hits[0].fields.nf_serving_weight_grams).toFixed(1)
                                prot = (data.hits[0].fields.nf_protein * 100 / data.hits[0].fields.nf_serving_weight_grams).toFixed(1)
                                fat = (data.hits[0].fields.nf_total_fat * 100 / data.hits[0].fields.nf_serving_weight_grams).toFixed(1)
                                sugars = (data.hits[0].fields.nf_sugars * 100 / data.hits[0].fields.nf_serving_weight_grams).toFixed(1)

                                console.log(key + " key    " + prot + " prot    " + fat + " fat    " + sugars + " sugars    " + gram + " gram")

                                arr.push({ [key]: { ["calories"]: cal, ["protein"]: prot, ["fat"]: fat, ["sugars"]: sugars, ["gram"]: 100 } })

                                console.log("construction")
                            }


                        }


                        //set item to NutritionInfo Array
                        try {
                            const snapshot = await get(child(dbRef, `NutritionArray`));
                            let NutritionArray = !snapshot.val() ? [] : snapshot.val();
                            //   console.log(info.name + " added to nutArr")
                            let arrayNut = [];

                            const cal = (data.hits[0].fields.nf_calories * 100 / data.hits[0].fields.nf_serving_weight_grams).toFixed(1)
                            const prot = (data.hits[0].fields.nf_protein * 100 / data.hits[0].fields.nf_serving_weight_grams).toFixed(1)
                            const fat = (data.hits[0].fields.nf_total_fat * 100 / data.hits[0].fields.nf_serving_weight_grams).toFixed(1)
                            const sugars = (data.hits[0].fields.nf_sugars * 100 / data.hits[0].fields.nf_serving_weight_grams).toFixed(1)

                            arrayNut.push({ ["name"]: key, ["calories"]: cal, ["protein"]: prot, ["fat"]: fat, ["sugars"]: sugars })
                            NutritionArray.push(arrayNut);
                            await set(refD(database, `NutritionArray`), NutritionArray)


                        } catch (error) {
                            console.error(error);
                        };

                        console.log("array " + array.length + " " + "arr " + arr.length)
                        //if arr of all aliment equal to the number of aliment in plate : set date/per weight and send to append arr
                        if (array.length - 2 == (arr.length)) {
                            const dt = new Date();
                            const minutzformatted = dt.getMinutes() < 10 ? "0" + dt.getMinutes().toString() : dt.getMinutes().toString()
                            const dateData = numtoday[dt.getDay()] + " the " + dt.getDate().toString() + "/" + (dt.getMonth() + 1).toString() + " at " + dt.getHours().toString() + ":" + minutzformatted


                            arr.unshift({ ["mealDate"]: dateData });
                            if (found)
                                arr.unshift({ ["gram"]: " Per weight" });
                            else
                                arr.unshift({ ["gram"]: " Per 100g" });

                            if (array.length > 0) {
                                console.log('%ccheckDens function() infoFood To arr', 'color: blue')
                                found = await checkDensity(result, array)
                            }
                            // else if (FirstTimeFoundCheck) {
                            //     console.error("checkDens function() infoFood To arr when no item delte")
                            //     let test = []
                            //     FirstTimeFoundCheck = false
                            //     found = await checkDensity(result, test)
                            // }

                            appendArr(arr, found, show, result, TotalAir)
                        }

                    }).catch(error => {
                        console.log(error)

                        infoFood(savedArr, found, show, result, TotalAir)

                    }

                    );

            }

            //if aliment found in nutritionArray
            else {
                console.log('%c   no need nutrionix ', 'color:cyan')

                //console.log("nutritionArray")

                let cal = 0;
                let prot = 0;
                let fat = 0;
                let sugars = 0;
                let gram = 0;
                let density = 0;
                const poly = item.polygon;

                //if aliment exist in nutritionArray and have all his ingredient in densityArray
                if (found) {

                    console.log('%c    found Density', 'color:cyan')

                    //check density in density array for the righ element to calculate gram
                    try {
                        const snapshot = await get(child(dbRef, `densityArray`));
                        let densityArray = !snapshot.val() ? [] : snapshot.val();

                        //find the density for the righ element in array


                        for (let i = 0; i < densityArray.length; i++) {
                            if ((densityArray[i][0].name === key)) {
                                density = densityArray[i][0].density
                            }
                        }



                    } catch (error) {
                        console.error(error);
                    }
                    // set aliment info to arr per weight
                    try {
                        const snapshot = await get(child(dbRef, `NutritionArray`));
                        let NutritionArray = !snapshot.val() ? [] : snapshot.val();
                        gram = weight * ((density * percent) / await GetPercentDensT(result, TotalAir, array)).toFixed(3);
                        // console.log(key + "   " + (density) + "dens   " + (percent) + " percent  " + await GetPercentDensT(result, TotalAir, array))

                        cal = (NutritionArray[indexNutrition][0].calories * gram / 100).toFixed(1)
                        prot = (NutritionArray[indexNutrition][0].protein * gram / 100).toFixed(1)
                        fat = (NutritionArray[indexNutrition][0].fat * gram / 100).toFixed(1)
                        sugars = (NutritionArray[indexNutrition][0].sugars * gram / 100).toFixed(1)

                        console.log(key + " key    " + prot + " prot    " + fat + " fat    " + sugars + " sugars    " + gram + " gram")

                        console.log[NutritionArray[indexNutrition]]
                        // console.log(key + " key    " + prot + " prot    " + fat + " fat    " + sugars + " sugars    " + gram + " gram")

                        arr.push({ [key]: { ["calories"]: cal, ["protein"]: prot, ["fat"]: fat, ["sugars"]: sugars, ["gram"]: gram } })

                        console.log("construction found")

                    } catch (error) {
                        console.error(error);
                    };



                }

                //if aliment not exist in nutritionArray and not have all his ingredient in densityArray
                else {

                    // set aliment info to arr per 100g
                    try {
                        const snapshot = await get(child(dbRef, `NutritionArray`));
                        let NutritionArray = !snapshot.val() ? [] : snapshot.val();

                        cal = NutritionArray[indexNutrition][0].calories
                        prot = NutritionArray[indexNutrition][0].protein
                        fat = NutritionArray[indexNutrition][0].fat
                        sugars = NutritionArray[indexNutrition][0].sugars
                        console.log(key + " key    " + prot + " prot    " + fat + " fat    " + sugars + " sugars    " + gram + " gram")

                        if (prot === "infinity" || prot === "NaN" || sugars === "infinity" || sugars === "NaN" || fat === "infinity" || fat === "NaN" || cal === "infinity" || cal === "NaN") {
                            console.log("saveArr infinity")
                            await infoFood(savedArr, found, show, result, TotalAir)
                        }


                        arr.push({ [key]: { ["calories"]: cal, ["protein"]: prot, ["fat"]: fat, ["sugars"]: sugars, ["gram"]: 100 } })

                        console.log("construction")

                    } catch (error) {
                        console.error(error);
                    };



                }
                console.log("array " + array.length + " " + "arr " + arr.length)
                //if arr of all aliment equal to the number of aliment in plate : set date/per weight and send to append arr
                if (arr.length == ((array.length) - 2)) {

                    //     console.log(Vlength + " Vlength")
                    const dt = new Date();
                    const minutzformatted = dt.getMinutes() < 10 ? "0" + dt.getMinutes().toString() : dt.getMinutes().toString()
                    const dateData = numtoday[dt.getDay()] + " the " + dt.getDate().toString() + "/" + (dt.getMonth() + 1).toString() + " at " + dt.getHours().toString() + ":" + minutzformatted


                    arr.unshift({ ["mealDate"]: dateData });
                    if (found)
                        arr.unshift({ ["gram"]: " Per weight" });
                    else
                        arr.unshift({ ["gram"]: " Per 100g" });


                    console.log('%ccheckDens function() infoFood To arr', 'color:cyan')
                    found = await checkDensity(result, array)



                    appendArr(arr, found, show, result, TotalAir)
                }
            }
        }




    }

    else {




        for (const item of result.segmentation_results) {

            const info = item.recognition_results[0];

            if (info.name === "meal salad")
                info.name = "mixed salad"

            if (info.name === "grilled entrecote") {
                info.name = "schnitzel"
                console.log("schhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh")
            }
            if (info.name === "roast beef") { info.name = "pasta with cheese sauce" }

            if (info.name === "cola drink") { info.name = "pepper" }
            if (info.name === "backed potatoes") { info.name = "pasta with cheese sauce" }
            if (info.name === "mashed potato") { info.name = "pasta with cheese sauce" }
            // if (info.name === "chocolate drink") { info.name = "pepper" }
            // if (info.name === "milk") { info.name = "salt" }


            const poly = item.polygon;
            let Air = polygonArea(poly).toFixed(3).padEnd(10);
            let percent = (Air / TotalAir).toFixed(3);

            let FoundNutrition = false;
            let indexNutrition = 0;
            const weight = 1000;
            const numtoday = [

                "Sunday",
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday"
            ]
            const dbRef = refD(getDatabase());


            //check if food element info is stored in NutritionArray and save index
            try {
                const snapshot = await get(child(dbRef, `NutritionArray`));

                let NutritionArray = !snapshot.val() ? [] : snapshot.val();
                if (NutritionArray.length > 0) {
                    for (let i = 0; i < NutritionArray.length; i++) {

                        if (info.name === NutritionArray[i][0].name) {
                            console.log(NutritionArray[i][0].name)
                            FoundNutrition = true;
                            indexNutrition = i;
                        }

                    }
                }
            } catch (error) {
                console.error(error);
            };


            //if aliment not found in nutritionArray
            if (!FoundNutrition) {

                console.log("nutritionix")
                await fetch(`https://api.nutritionix.com/v1_1/search/${info.name}?results=0:1&fields=*&appId=3717a529&appKey=1b0412a361dcb7d3bb1c21ab916a2a36`)
                    .then(response => response.json())
                    .then(async data => {


                        let cal = 0;
                        let prot = 0;
                        let fat = 0;
                        let sugars = 0;
                        let gram = 0;
                        let density = 0;
                        const poly = item.polygon;
                        //area of each element



                        //if all ingredient have density in densityArray
                        if (found) {
                            // console.log("   perwWeight")


                            // set aliment info to arr per weight
                            try {

                                const snapshot = await get(child(dbRef, `densityArray`));

                                let densityArray = !snapshot.val() ? [] : snapshot.val();

                                //check density in density array for the righ element to calculate gram
                                for (let i = 0; i < densityArray.length; i++) {

                                    if ((densityArray[i][0].name === info.name)) {

                                        density = densityArray[i][0].density
                                    }
                                }

                                //set the food nutrition info per weight in arr

                                gram = weight * ((density * percent) / await GetPercentDensT(result, TotalAir, array)).toFixed(3);
                                cal = (data.hits[0].fields.nf_calories * gram / data.hits[0].fields.nf_serving_weight_grams).toFixed(1)
                                prot = (data.hits[0].fields.nf_protein * gram / data.hits[0].fields.nf_serving_weight_grams).toFixed(1)
                                fat = (data.hits[0].fields.nf_total_fat * gram / data.hits[0].fields.nf_serving_weight_grams).toFixed(1)
                                sugars = (data.hits[0].fields.nf_sugars * gram / data.hits[0].fields.nf_serving_weight_grams).toFixed(1)


                                arr.push({ [info.name]: { ["calories"]: cal, ["protein"]: prot, ["fat"]: fat, ["sugars"]: sugars, ["gram"]: gram } })




                            } catch (error) {
                                console.error(error);
                            }

                        }

                        //if aliment not found in nutrionArray and not found in densityArray
                        else {
                            //  console.log("per 100g")

                            // set aliment info to arr for 100g
                            {
                                cal = (data.hits[0].fields.nf_calories * 100 / data.hits[0].fields.nf_serving_weight_grams).toFixed(1)
                                prot = (data.hits[0].fields.nf_protein * 100 / data.hits[0].fields.nf_serving_weight_grams).toFixed(1)
                                fat = (data.hits[0].fields.nf_total_fat * 100 / data.hits[0].fields.nf_serving_weight_grams).toFixed(1)
                                sugars = (data.hits[0].fields.nf_sugars * 100 / data.hits[0].fields.nf_serving_weight_grams).toFixed(1)

                                arr.push({ [info.name]: { ["calories"]: cal, ["protein"]: prot, ["fat"]: fat, ["sugars"]: sugars, ["gram"]: 100 } })
                            }


                        }


                        //set item to NutritionInfo Array
                        try {
                            const snapshot = await get(child(dbRef, `NutritionArray`));
                            let NutritionArray = !snapshot.val() ? [] : snapshot.val();
                            //   console.log(info.name + " added to nutArr")
                            let arrayNut = [];

                            const cal = (data.hits[0].fields.nf_calories * 100 / data.hits[0].fields.nf_serving_weight_grams).toFixed(1)
                            const prot = (data.hits[0].fields.nf_protein * 100 / data.hits[0].fields.nf_serving_weight_grams).toFixed(1)
                            const fat = (data.hits[0].fields.nf_total_fat * 100 / data.hits[0].fields.nf_serving_weight_grams).toFixed(1)
                            const sugars = (data.hits[0].fields.nf_sugars * 100 / data.hits[0].fields.nf_serving_weight_grams).toFixed(1)

                            arrayNut.push({ ["name"]: info.name, ["calories"]: cal, ["protein"]: prot, ["fat"]: fat, ["sugars"]: sugars })
                            NutritionArray.push(arrayNut);
                            await set(refD(database, `NutritionArray`), NutritionArray)


                        } catch (error) {
                            console.error(error);
                        };

                        //if arr of all aliment equal to the number of aliment in plate : set date/per weight and send to append arr
                        if (result.segmentation_results.length == (arr.length)) {
                            const dt = new Date();
                            const minutzformatted = dt.getMinutes() < 10 ? "0" + dt.getMinutes().toString() : dt.getMinutes().toString()
                            const dateData = numtoday[dt.getDay()] + " the " + dt.getDate().toString() + "/" + (dt.getMonth() + 1).toString() + " at " + dt.getHours().toString() + ":" + minutzformatted


                            arr.unshift({ ["mealDate"]: dateData });
                            if (found)
                                arr.unshift({ ["gram"]: " Per weight" });
                            else
                                arr.unshift({ ["gram"]: " Per 100g" });

                            if (array.length > 0) {
                                console.log('%ccheckDens function() infoFood To arr', 'color: blue')
                                found = await checkDensity(result, array)
                            }
                            // else if (FirstTimeFoundCheck) {
                            //     console.error("checkDens function() infoFood To arr when no item delte")
                            //     let test = []
                            //     FirstTimeFoundCheck = false
                            //     found = await checkDensity(result, test)
                            // }

                            appendArr(arr, found, show, result, TotalAir)
                        }

                    }).catch(error => console.log(error));

            }

            //if aliment found in nutritioArray
            else {
                //console.log("nutritionArray")

                let cal = 0;
                let prot = 0;
                let fat = 0;
                let sugars = 0;
                let gram = 0;
                let density = 0;
                const poly = item.polygon;
                //if aliment exist in nutritionArray and have all his ingredient in densityArray
                if (found) {

                    //area of each element
                    let Air = polygonArea(poly).toFixed(3).padEnd(10);
                    let percent = (Air / TotalAir).toFixed(3);


                    //check density in density array for the righ element to calculate gram
                    try {
                        const snapshot = await get(child(dbRef, `densityArray`));
                        let densityArray = !snapshot.val() ? [] : snapshot.val();


                        for (let i = 0; i < densityArray.length; i++) {

                            if ((densityArray[i][0].name === info.name)) {

                                density = densityArray[i][0].density
                            }
                        }


                    } catch (error) {
                        console.error(error);
                    }
                    // set aliment info to arr per weight
                    try {
                        const snapshot = await get(child(dbRef, `NutritionArray`));
                        let NutritionArray = !snapshot.val() ? [] : snapshot.val();
                        gram = weight * ((density * percent) / await GetPercentDensT(result, TotalAir, array)).toFixed(3);

                        cal = (NutritionArray[indexNutrition][0].calories * gram / 100).toFixed(1)
                        prot = (NutritionArray[indexNutrition][0].protein * gram / 100).toFixed(1)
                        fat = (NutritionArray[indexNutrition][0].fat * gram / 100).toFixed(1)
                        sugars = (NutritionArray[indexNutrition][0].sugars * gram / 100).toFixed(1)

                        //  console.log(info.name + " " + cal)

                        //console.info(info.name + " added by database")
                        arr.push({ [info.name]: { ["calories"]: cal, ["protein"]: prot, ["fat"]: fat, ["sugars"]: sugars, ["gram"]: gram } })

                    } catch (error) {
                        console.error(error);
                    };



                }

                //if aliment not exist in nutritionArray and  have all his ingredient in densityArray
                else {


                    // set aliment info to arr per 100g
                    try {
                        const snapshot = await get(child(dbRef, `NutritionArray`));
                        let NutritionArray = !snapshot.val() ? [] : snapshot.val();

                        cal = NutritionArray[indexNutrition][0].calories
                        prot = NutritionArray[indexNutrition][0].protein
                        fat = NutritionArray[indexNutrition][0].fat
                        sugars = NutritionArray[indexNutrition][0].sugars


                        arr.push({ [info.name]: { ["calories"]: cal, ["protein"]: prot, ["fat"]: fat, ["sugars"]: sugars, ["gram"]: 100 } })


                    } catch (error) {
                        console.error(error);
                    };



                }

                //if arr of all aliment equal to the number of aliment in plate : set date/per weight and send to append arr
                // console.log(arr.length + " " + Vlength)
                if (result.segmentation_results.length == (arr.length)) {
                    FirstTime = false

                    //     console.log(Vlength + " Vlength")
                    const dt = new Date();
                    const minutzformatted = dt.getMinutes() < 10 ? "0" + dt.getMinutes().toString() : dt.getMinutes().toString()
                    const dateData = numtoday[dt.getDay()] + " the " + dt.getDate().toString() + "/" + (dt.getMonth() + 1).toString() + " at " + dt.getHours().toString() + ":" + minutzformatted


                    arr.unshift({ ["mealDate"]: dateData });
                    if (found)
                        arr.unshift({ ["gram"]: " Per weight" });
                    else
                        arr.unshift({ ["gram"]: " Per 100g" });

                    if (array.length > 0) {
                        console.log('%ccheckDens function() infoFood To arr', 'color:cyan')
                        found = await checkDensity(result, array)
                    }
                    // else if (FirstTimeFoundCheck) {
                    //     console.error("checkDens function() infoFood To arr when no item delte")
                    //     let test = []
                    //     FirstTimeFoundCheck = false
                    //     found = await checkDensity(result, test)
                    // }
                    appendArr(arr, found, show, result, TotalAir)
                }
            }
        }

    }
}


//append new arr to the big array and display the new arr
let buttonPress = false

async function appendArr(arr, found, show, result, TotalAir) {
    console.log('%cappendArr ()--------------- ', 'color:green')



    auth.onAuthStateChanged(async user => {


        const userId = user?.uid;
        const dbRef = refD(getDatabase());
        try {

            const snapshot = await get(child(dbRef, `users/${userId}/bigArray`));

            //let bigArray = snapshot.val() || [];
            let bigArray = !snapshot.val() ? [] : snapshot.val();
            // If bigArray is not an array, initialize it to an empty array
            if (!Array.isArray(bigArray)) {
                bigArray = [];
            }

            // Append the new array to bigArray
            bigArray.unshift(arr);
            // Update bigArray in the database


            await set(refD(database, `users/${userId}/bigArray`), bigArray);




            // Iterate through the array of objects

            const outerObj = bigArray[0];
            const rowElement = document.createElement('div');
            const collapseElement = document.createElement('div');
            collapseElement.className = 'collapse ';
            const colButton = document.createElement('div');
            const colDate = document.createElement('div');
            const Date = document.createElement('div');
            const colGram = document.createElement('div');
            const gram = document.createElement('div');
            Date.className = 'ms-2 '

            colDate.className = ' col col-4  d-flex align-items-center p-3'
            colGram.className = ' col col-4  d-flex align-items-center p-3 d-flex justify-content-center'
            colButton.className = ' col col-4 d-flex align-items-center justify-content-end '


            rowElement.className = 'row gx-0';
            const layerlast = document.getElementById("layerLast")
            const layerBefore = document.getElementById("layerBefore")
            collapseElement.style.animation = "lastFoodGlow 4.4s  ease-in "
            rowElement.style.animation = "lastFoodGlow 5s  ease-in ";
            rowElement.style.background = "#124660";
            rowElement.style.color = "white";
            layerlast.style.animation = "lastFoodGlowWave 5s  ease-in  "
            layerBefore.style.animation = "lastFoodGlowWave 5s   ease-in "













            // Create a button to open the collapse
            const buttonElement = document.createElement('button');
            buttonElement.innerHTML = 'Show details  <i class=" ms-2 fa-light fa-memo-circle-info"></i>';
            buttonElement.className = 'btn btn-outline-light me-2'
            const idCollapse = "collapse";
            const dataBsTarget = "#" + idCollapse;
            buttonElement.setAttribute('type', 'button'); // add type attribute
            buttonElement.setAttribute('data-bs-toggle', 'collapse'); // add data-bs-toggle attribute
            buttonElement.setAttribute('data-bs-target', dataBsTarget); // add data-bs-target attribute
            buttonElement.setAttribute('aria-expanded', 'false'); // add aria-expanded attribute
            buttonElement.setAttribute('aria-controls', 'collapseExample'); // add aria-controls attribute

            const buttonSpace = document.createElement('button');
            buttonSpace.innerHTML = '<i class="fa-light fa-trash" ></i>'
            buttonSpace.className = 'btn  me-2 text-light opacity-0'


            // Create a collapse element to display prot and cal



            const table = document.createElement('table');
            collapseElement.setAttribute('id', idCollapse)
            if (show)
                collapseElement.classList.add("show")


            const headerRow = document.createElement('tr');
            // Iterate through the properties of the object and create a new element for each name
            let count = 0;
            for (const innerKey in outerObj) {
                const innerObj = outerObj[innerKey];

                count++;

                if (innerKey == 0) {

                    // create header cells
                    let headers = [];

                    headers = ['', '', 'food name', 'calories (g)', 'fat (g)', 'sugars (g)', 'protein (g)', 'weight (g)'];


                    for (const header of headers) {
                        const headerCell = document.createElement('th');
                        headerCell.className = "m-2 pe-1 pe-md-5 pt-3"
                        headerCell.textContent = header;
                        headerCell.style.color = "rgb(0 250 255)"
                        headerCell.style.fontWeight = "bold";
                        headerRow.appendChild(headerCell);
                        table.appendChild(headerRow);
                    }
                }



                // create data rows
                for (const key in innerObj) {
                    const buttonDelete = document.createElement('button');
                    const dataRow = document.createElement('tr');

                    const buttonEdit = document.createElement('button');


                    if (key != 'mealDate' && key != 'gram') {

                        buttonDelete.innerHTML = '<i class="fa-light fa-trash " ></i>'
                        const deleteCell = document.createElement('td');
                        deleteCell.appendChild(buttonDelete)
                        deleteCell.className = "me-1 pe-1 pe-md-1 "
                        buttonDelete.className = "m-1 btn btn-outline-danger border-0 "
                        deleteCell.style.fontWeight = "bold";
                        deleteCell.style.fontWeight = "110%"
                        dataRow.appendChild(deleteCell);


                        buttonEdit.innerHTML = '<i class="fa-light fa-edit " ></i>'
                        const EditCell = document.createElement('td');
                        EditCell.appendChild(buttonEdit)
                        EditCell.className = "me-2 pe-1 pe-md-5 "
                        buttonEdit.className = "m-1 btn btn-outline-primary border-0 "
                        EditCell.style.fontWeight = "bold";
                        EditCell.style.fontWeight = "110%"
                        dataRow.appendChild(EditCell);


                        const nameCell = document.createElement('td');
                        nameCell.textContent = key;
                        nameCell.className = "me-2 pe-1 pe-md-5 "
                        nameCell.style.color = "rgb(0 210 215)"
                        // nameCell.style.fontWeight = "bold";
                        dataRow.appendChild(nameCell);

                        const calorieCell = document.createElement('td');
                        calorieCell.textContent = innerObj[key].calories;
                        dataRow.appendChild(calorieCell);

                        const fatCell = document.createElement('td');
                        fatCell.textContent = innerObj[key].fat;
                        dataRow.appendChild(fatCell);

                        const sugarCell = document.createElement('td');
                        sugarCell.textContent = innerObj[key].sugars;
                        dataRow.appendChild(sugarCell);

                        const proteinCell = document.createElement('td');
                        proteinCell.textContent = innerObj[key].protein;
                        dataRow.appendChild(proteinCell);



                        const WeightCell = document.createElement('td');
                        WeightCell.textContent = innerObj[key].gram;
                        dataRow.appendChild(WeightCell);


                        if (outerObj.length == count) {
                            nameCell.className = "me-2 pe-1 pe-md-5 pb-3"
                            nameCell.className = "me-2 pe-1 pe-md-5 pb-3"
                            WeightCell.className = "pb-3"
                            calorieCell.className = "pb-3"
                            fatCell.className = "pb-3"
                            sugarCell.className = "pb-3"
                            proteinCell.className = "pb-3"
                            deleteCell.className = "pb-3"
                            EditCell.className = "pb-3"


                        }

                        table.appendChild(dataRow);
                    }
                    else {
                        if (key === "gram") {
                            gram.textContent = innerObj[key];
                            colGram.appendChild(gram);
                        }
                        else {
                            const newer = "NEW"


                            //  Date.textContent = innerObj[key] + "   " + newer;

                            Date.innerHTML = `<p class="d-flex align-items-center m-0">${innerObj[key]}<span class="opacity-0">hhh</span ><span class="fa-beat" style="font-size:120% ;color:yellow; font-weight:bold; --fa-animation-duration: 4s; --fa-beat-opacity: 1; --fa-beat-scale: 1.1;">${newer}</span></p>`;

                            colDate.appendChild(Date);
                        }

                    }


                    buttonDelete.addEventListener('click', async () => {

                        console.log('%cdelete////////////////////// ', 'color:yellow')

                        let index = (innerKey);
                        arr.splice(index, 1);
                        buttonDelete.innerHTML = ``;
                        buttonDelete.classList.add("spinner-border")
                        buttonDelete.classList.remove("border-0")


                        console.error(innerKey + "  indexxxxxx")
                        // Remove the element at the given index using splice()
                        const list = document.getElementById('list')
                        const lastFood = document.getElementById('lastFood')
                        // bigArray.splice(0, 1);
                        // await set(refD(database, `users/${userId}/bigArray`), bigArray);

                        //   lastFood.innerHTML = ""

                        show = true;
                        buttonPress = true;
                        // appendArr(arr, found, show, result, TotalAir)
                        //  console.log("arr appendARRrrrrrrrrrrrr")
                        // console.log(arr)

                        console.error("checkDens function() buttonDelete")
                        found = await checkDensity(result, arr)
                        console.log(found)
                        console.log(arr)
                        const before = document.getElementById('layerBefore')
                        const last = document.getElementById('layerLast')
                        before.style.animation = "none"
                        last.style.animation = "none"

                        console.log(result.segmentation_results)


                        const indexOf = result.segmentation_results.findIndex(item => {
                            return item.recognition_results[0].name === key;
                        });

                        if (indexOf !== -1) {
                            // Update the name property with newAliment

                            result.segmentation_results.splice(indexOf, 1);

                        }


                        infoFood(arr, found, show, result, TotalAir);

                    })



                    buttonEdit.addEventListener('click', async () => {


                        console.log('%edittt//////////////// ', 'color:yellow')

                        const EditName = document.getElementById("EditName")
                        const EditSaveBtn = document.getElementById("EditSaveBtn")



                        EditName.innerHTML = " Edit " + key;
                        const modalEdit = new bootstrap.Modal(document.getElementById("modalEdit"));

                        modalEdit.show();



                        EditSaveBtn.addEventListener('click', async () => {

                            collapseElement.classList.add("show")


                            const newAliment = document.getElementById("editInput").value;
                            modalEdit.hide();

                            let savedArr = arr;

                            let lastAliment = key;
                            let index = innerKey; // Get the index of the object within the outerObj array





                            // Update the value in the arr array
                            arr[index][newAliment] = arr[index][lastAliment];
                            delete arr[index][lastAliment];

                            console.log("arr updated")
                            console.log(arr)
                            buttonEdit.innerHTML = ``;
                            buttonEdit.classList.add("spinner-border");
                            buttonEdit.classList.remove("border-0");

                            const indexOf = result.segmentation_results.findIndex(item => {
                                return item.recognition_results[0].name === lastAliment;
                            });

                            if (indexOf !== -1) {
                                // Update the name property with newAliment
                                console.log("last aliment result " + result.segmentation_results[indexOf].recognition_results[0].name)

                                result.segmentation_results[indexOf].recognition_results[0].name = newAliment;

                                console.log("after aliment result " + result.segmentation_results[indexOf].recognition_results[0].name)
                            }


                            const box = result.segmentation_results[indexOf].contained_bbox

                            const c = document.querySelector("canvas");

                            const ctx = c.getContext("2d");
                            ctx.strokeText("", box.x + box.w / 2, box.y + box.h / 2);
                            ctx.strokeText(newAliment, box.x + box.w / 2, box.y + box.h / 2);
                            ctx.fillText("", box.x + box.w / 2, box.y + box.h / 2);
                            ctx.fillText(newAliment, box.x + box.w / 2, box.y + box.h / 2);


                            infoFood(arr, found, show, result, TotalAir, savedArr);
                        });




                        // console.log('%c//////////////////////////////////// ', 'color:yellow')

                        // let index = (innerKey);
                        // arr.splice(index, 1);
                        // buttonDelete.innerHTML = ``;
                        // buttonDelete.classList.add("spinner-border")
                        // buttonDelete.classList.remove("border-0")



                        // console.error(innerKey + "  indexxxxxx")
                        // // Remove the element at the given index using splice()
                        // const list = document.getElementById('list')
                        // const lastFood = document.getElementById('lastFood')
                        // // bigArray.splice(0, 1);
                        // // await set(refD(database, `users/${userId}/bigArray`), bigArray);

                        // //   lastFood.innerHTML = ""

                        // show = true;
                        // buttonPress = true;
                        // // appendArr(arr, found, show, result, TotalAir)
                        // //  console.log("arr appendARRrrrrrrrrrrrr")
                        // // console.log(arr)

                        // console.error("checkDens function() buttonDelete")
                        // found = await checkDensity(result, arr)
                        // console.log(found)
                        // console.log(arr)
                        // const before = document.getElementById('layerBefore')
                        // const last = document.getElementById('layerLast')
                        // before.style.animation = "none"
                        // last.style.animation = "none"

                        // infoFood(arr, found, show, result, TotalAir);

                    })


                }

                collapseElement.appendChild(table);
                //  collapseElement.style.background = "rgb(133, 197, 246)"

                collapseElement.style.background = "#124660"
            }

            // Add the button and collapse to the row element

            //    rowElement.appendChild(colFoodName);
            rowElement.appendChild(colDate);
            rowElement.appendChild(colGram)
            rowElement.appendChild(colButton);
            colButton.appendChild(buttonElement);
            rowElement.appendChild(colButton);
            colButton.appendChild(buttonSpace);

            // colFoodName.appendChild(FoodName);
            rowElement.appendChild(collapseElement);
            const lastFood = document.getElementById("lastFood");
            lastFood.innerHTML = ``;
            // Add the row element to the list
            document.querySelector('#lastFood').appendChild(rowElement);



        } catch (error) {
            console.error(error);
        };
    })



}

//show arr of the previous meal
function showArr() {

    auth.onAuthStateChanged(user => {

        const userId = user?.uid;
        const dbRef = refD(getDatabase());
        get(child(dbRef, `users/${userId}/bigArray`)).then((snapshot) => {

            //let bigArray = snapshot.val() || [];
            let bigArray = !snapshot.val() ? [] : snapshot.val();
            // If bigArray is not an array, initialize it to an empty array




            let countDelete = 0;
            // Iterate through the array of objects
            for (const outerKey in bigArray) {
                const firstArrayLen = bigArray.length;
                let count = 0;
                const outerObj = bigArray[outerKey];
                // Create a new row element
                const rowElement = document.createElement('div');
                const colButton = document.createElement('div');
                //  const colFoodName = document.createElement('div');
                const FoodName = document.createElement('div');
                const colDate = document.createElement('div');
                const Date = document.createElement('div');
                const colGram = document.createElement('div');
                const gram = document.createElement('div');
                Date.className = 'ms-2 '
                gram.className = " d-flex justify-content-center"


                colDate.className = 'col col-4 p-3 '
                colGram.className = 'col col-4  d-flex align-items-center p-3'
                colButton.className = 'col col-4 d-flex align-items-center justify-content-end'
                rowElement.className = 'row m-0';
                rowElement.style.background = "white";
                // Create a button to open the collapse
                const buttonElement = document.createElement('button');
                const buttonDelete = document.createElement('button');
                buttonElement.innerHTML = 'Show details  <i class=" ms-2 fa-light fa-memo-circle-info"></i>';
                buttonDelete.innerHTML = '<i class="fa-light fa-trash" ></i>'



                if (outerKey % 2 === 0) {
                    if (outerKey == 0) {
                        colDate.className = 'greenDark col col-4 p-3  '
                        colGram.className = 'greenDark col col-4 p-3 '
                        colButton.className = 'greenDark col col-4 d-flex align-items-center justify-content-end  '
                        buttonElement.className = 'btn btn-outline-light me-2'
                        buttonDelete.className = 'btn  me-2 text-light'
                    }
                    else {
                        colDate.className = 'greenDark col col-4 p-3 bg-gradient'
                        colGram.className = 'greenDark col col-4 p-3 bg-gradient'
                        colButton.className = 'greenDark col col-4 d-flex align-items-center justify-content-end bg-gradient'
                        buttonElement.className = 'btn btn-outline-light me-2'
                        buttonDelete.className = 'btn  me-2 text-light'
                    }
                }
                else {
                    colDate.className = 'greenLight col col-4 p-3 bg-gradient'
                    colGram.className = 'greenLight col col-4 p-3 bg-gradient'
                    colButton.className = 'greenLight col col-4 d-flex align-items-center justify-content-end bg-gradient'
                    buttonElement.className = 'btn btn-outline-success me-2'
                    buttonDelete.className = 'btn  me-2 text-success'


                }

                const idCollapse = "collapse" + outerKey;
                const dataBsTarget = "#" + idCollapse;
                buttonElement.setAttribute('type', 'button'); // add type attribute
                buttonElement.setAttribute('data-bs-toggle', 'collapse'); // add data-bs-toggle attribute
                buttonElement.setAttribute('data-bs-target', dataBsTarget); // add data-bs-target attribute
                buttonElement.setAttribute('aria-expanded', 'false'); // add aria-expanded attribute
                buttonElement.setAttribute('aria-controls', 'collapseExample'); // add aria-controls attribute




                // Create a collapse element to display prot and cal
                const collapseElement = document.createElement('div');
                collapseElement.className = 'collapse ';
                const table = document.createElement('table');
                collapseElement.setAttribute('id', idCollapse)

                const headerRow = document.createElement('tr');
                // Iterate through the properties of the object and create a new element for each name
                for (const innerKey in outerObj) {
                    count++;
                    const innerObj = outerObj[innerKey];
                    //   console.log("date  " + outerObj[innerKey].mealDate)

                    // create data rows
                    for (const key in innerObj) {



                        if (innerKey == 2) {
                            let headers = [];
                            // create header cells




                            headers = ['food name', 'calories (g)', 'fat (g)', 'sugars (g)', 'protein (g)', 'weight (g)'];


                            for (const header of headers) {
                                const headerCell = document.createElement('th');
                                headerCell.className = "m-5 pe-1 pe-md-5 pt-3"
                                headerCell.textContent = header;
                                headerRow.appendChild(headerCell);
                                table.appendChild(headerRow);
                            }
                        }

                        if (key != 'mealDate' && key != 'gram') {
                            const dataRow = document.createElement('tr');

                            const nameCell = document.createElement('td');
                            nameCell.textContent = key;
                            nameCell.className = "me-2 pe-1 pe-md-5 "
                            nameCell.style.color = "#09ad03"
                            nameCell.style.fontWeight = "bold";
                            dataRow.appendChild(nameCell);

                            const calorieCell = document.createElement('td');
                            calorieCell.textContent = innerObj[key].calories;
                            dataRow.appendChild(calorieCell);

                            const fatCell = document.createElement('td');
                            fatCell.textContent = innerObj[key].fat;
                            dataRow.appendChild(fatCell);

                            const sugarCell = document.createElement('td');
                            sugarCell.textContent = innerObj[key].sugars;
                            dataRow.appendChild(sugarCell);

                            const proteinCell = document.createElement('td');
                            proteinCell.textContent = innerObj[key].protein;
                            dataRow.appendChild(proteinCell);


                            const WeightCell = document.createElement('td');
                            WeightCell.textContent = innerObj[key].gram;
                            dataRow.appendChild(WeightCell);




                            if (outerObj.length == count) {
                                nameCell.className = "me-2 pe-1 pe-md-5 pb-3"
                                WeightCell.className = "pb-3"
                                calorieCell.className = "pb-3"
                                fatCell.className = "pb-3"
                                sugarCell.className = "pb-3"
                                proteinCell.className = "pb-3"

                            }



                            table.appendChild(dataRow);
                        }
                        else {

                            if (key === "gram") {
                                gram.textContent = innerObj[key];
                                colGram.appendChild(gram);
                            }
                            else {
                                Date.textContent = innerObj[key];
                                colDate.appendChild(Date);
                            }

                        }

                    }

                    collapseElement.appendChild(table);

                }

                // Add the button and collapse to the row element

                //    rowElement.appendChild(colFoodName);
                rowElement.appendChild(colDate);
                rowElement.appendChild(colGram);
                rowElement.appendChild(colButton);
                colButton.appendChild(buttonElement);
                colButton.appendChild(buttonDelete);


                // colFoodName.appendChild(FoodName);
                rowElement.appendChild(collapseElement);

                // Add the row element to the list
                document.querySelector('#list').appendChild(rowElement);

                buttonDelete.addEventListener('click', () => {
                    let index = Number(outerKey);
                    // Remove the element at the given index using splice()
                    const list = document.getElementById('list')
                    const lastFood = document.getElementById('lastFood')

                    if (lastFood.innerHTML.trim() === '') {
                        bigArray.splice(index, 1);

                        //  console.log("list is empty")
                    }

                    else {


                        bigArray.splice((index), 1);
                        //   console.log("list is not empty")

                    }
                    //  console.log(index)

                    set(refD(database, `users/${userId}/bigArray`), bigArray)
                    list.innerHTML = "";
                    showArr();

                })
            }





            // Append the new array to bigArray

            // Update bigArray in the database



        }).catch((error) => {
            console.error(error);
        });


    })

}
showArr();


//math to calculate weight of each aliment
async function GetPercentDensT(result, TotalAir, array) {



    const dbRef = refD(getDatabase());
    let percentDensT = 0;

    try {
        const snapshot = await get(child(dbRef, `densityArray`));

        let densityArray = !snapshot.val() ? [] : snapshot.val();

        if (array.length > 0) {

            for (let i = 0; i < result.segmentation_results.length; i++) {
                for (let j = 0; j < array.length; j++) {
                    const key = Object.keys(array[j])[0];
                    if (result.segmentation_results[i].recognition_results[0].name === key) {
                        for (let j = 0; j < densityArray.length; j++) {
                            if ((densityArray[j][0].name === result.segmentation_results[i].recognition_results[0].name)) {

                                percentDensT += densityArray[j][0].density * (polygonArea(result.segmentation_results[i].polygon) / TotalAir)
                            }
                        }
                    }
                }
            }
        }

        else {
            for (let i = 0; i < result.segmentation_results.length; i++) {

                for (let j = 0; j < densityArray.length; j++) {
                    if ((densityArray[j][0].name === result.segmentation_results[i].recognition_results[0].name)) {

                        percentDensT += densityArray[j][0].density * (polygonArea(result.segmentation_results[i].polygon) / TotalAir)
                    }
                }
            }

        }
    } catch (error) {
        console.error(error);

    }
    return percentDensT;

}


function getAiInfo(result) {

    let food = "";
    let info = "";
    const AiInfo = document.getElementById("AiInfo")
    AiInfo.classList.remove("visually-hidden");
    AiInfo.style.backgroundColor = "none"

    result.segmentation_results.map(item => {
        const info = item.recognition_results[0];
        food += (", " + info.name)
    })
    //  const apiKey ="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" //stockX api
    // const apiKey = "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"; //malki api
    const apiKey = "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"; // iotmalki23
    //  const prompt = `density of ${name} very important return only numerical value without unit (must be between 0 and 2)`;
    let prompt = ``;
    if (result.segmentation_results.length == 1)
        prompt = ` give me info about the health of  ${food}`;
    else
        prompt = ` give me info about the health of my meal: ${food}`;


    const url = "https://api.openai.com/v1/engines/text-davinci-003/completions"; // API endpoint

    fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify({
            prompt,
            max_tokens: 300,
        })
    })
        .then(response => response.json())
        // .then(data => console.log(data.choices[0].text))
        .then((data) => {
            //  typewriter(data.choices[0].text);
            AiInfo.style.textAlign = "justify"
            AiInfo.style.alignSelf = "center"
            AiInfo.innerHTML = `${data.choices[0].text}<br/>`

            // info = data.choices[0].text
            // typewriter(info)
        })
        .catch(error => console.error(error));




}


function notify(type, message) {
    (() => {
        let n = document.createElement("div");
        let id = Math.random().toString(36).substr(2, 10);
        n.setAttribute("id", id);
        n.classList.add("notification", type);

        n.innerText = message;
        document.getElementById("notification-area").appendChild(n);

        if (type === "error") {
            var audio = new Audio('/sound/error.mp3');
            audio.play();
        }
        else if (type === "info") {
            var audio = new Audio("/sound/warning.mp3");
            audio.play();
            console.log('warning')
        }
        else if (type === "success") {
            var audio = new Audio('/sound/success.mp3');
            audio.play();
        }

        setTimeout(() => {
            var notifications = document.getElementById("notification-area").getElementsByClassName("notification");
            for (let i = 0; i < notifications.length; i--) {
                if (notifications[i].getAttribute("id") == id) {
                    notifications[i].remove();
                    break;
                }
            }
        }, 1000);
    })();
}





// document.getElementById('btn').onclick = function () {


//     const dbRef = ref(getDatabase());
//     get(child(dbRef, `test2/`)).then((snapshot) => {
//         if (snapshot.exists()) {
//             const captureIp = "http://" + snapshot.val().photo.substring(0, snapshot.val().photo.length - 10) + "/capture";
//             console.log("captureip" + captureIp)
//             const ip = "http://" + snapshot.val().photo;//http://127.0.0.1/iot-project/html/10.9.24.125:81/stream
//             ip_text.innerText = ip;
//             const imgURL = document.getElementById("imgEsp")
//             imgURL.src = ip

//             console.log(ip)
//             // imgEsp.setAttribute('src', ip);

//         } else {
//             notify("error", "No data available");
//         }
//     }).catch((error) => {
//         console.error(error);
//     });




//     src = 'http://webpage.com/images/',
//         img = document.createElement('img');

//     img.src = src;
//     document.body.appendChild(img);
// }