
const collectionName = 'Article';
let testData;

function firebaseSDK (){   
    // Your web app's Firebase configuration
    // For Firebase JS SDK v7.20.0 and later, measurementId is optional
    const firebaseConfig = {
    apiKey: "AIzaSyChtVdMbLs3oq2Ls31XUn4l1KqXZXrIIr4",
    authDomain: "appworks-bed54.firebaseapp.com",
    projectId: "appworks-bed54",
    storageBucket: "appworks-bed54.appspot.com",
    messagingSenderId: "136719333777",
    appId: "1:136719333777:web:f5fb1d36c7f069f2f2c230",
    measurementId: "G-4LPN6NFZLP"
    };
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
}

function setData(title,content,tag){
    let collectionRef = firebase.firestore().collection(collectionName)
    let docRef = collectionRef.doc();
    let data = {
        id: docRef.id,
        authorId: 'Annie',
        content, 
        created_time: new Date(), 
        tag,
        title
    }
    docRef.set(data,{merge: true}).then(() => {
    console.log(`set data successful. ID: ${docRef.id}`);
    });
    collectionRef.get().then(response => {
        response.forEach(doc=>{
            console.log(doc.data());
        })
        testData = response;
    })
    alert(`set data successful. ID: ${docRef.id}`);
}

function singleTimeAnswer(input) {
    const checkbox = document.querySelectorAll('.inputBox');
    for (let i = 0; i < checkbox.length; i++) {
      checkbox[i].checked = false;
    }
    input.checked = true;
  }


function search(authorId){
    let collectionRef = firebase.firestore().collection(collectionName);
    let q = collectionRef.where("authorId","==",authorId);
    q.get().then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            console.log(doc.data());
        });
    })
}

function getInputData(){
    const title = document.getElementById('title').value;
    const content = document.getElementById('content').value;
    const beauty = document.getElementById('beauty').checked;
    const gossiping = document.getElementById('gossiping').checked;
    const schoolLife = document.getElementById('schoolLife').checked;
    let tag;
    if(beauty){
        tag ='Beauty';
    }else if (gossiping){
        tag ='Gossiping';
    }else if (schoolLife){
        tag ='SchoolLife';
    }
    console.log(`${title} ${content} ${tag}`);
    setData(title,content,tag);
}

firebaseSDK ();
