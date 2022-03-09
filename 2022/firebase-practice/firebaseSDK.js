
const collectionNameArticle = 'Article';
const collectionNameAuthor = 'Author';
const collectionNameFriend = 'Friend';

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
    const db = firebase.firestore();
    const collectionRef = db.collection(collectionNameArticle)
    const docRef = collectionRef.doc();
    const data = {
        id: docRef.id,
        author_id: 'Annie',
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

function getInputDataCreateArticle(){
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

function getInputDataSearchId(){
    const searchAuthor = document.getElementById('searchAuthor').value;
    search(searchAuthor);
}

function search(authorEmail){
    let collectionRef = firebase.firestore().collection(collectionNameAuthor);
    let q = collectionRef.where("email","==",authorEmail);
    const result = document.getElementById('friendResult');
    result.innerHTML = '';
    q.get().then(response => {
        response.forEach(doc=>{
            console.log(doc.data());
            renderFriend(doc.data());
        })
    }).then(()=>{console.log(`搜尋完畢`)});
}

function renderFriend(data){
    console.log(`sendInvitation("${data.name}","${data.id}")`);
    const result = document.getElementById('friendResult');
    result.innerHTML = `
        <div>User: ${data.name}</div>
        <div class="button" onclick="sendInvitation('${data.name}','${data.id}')">加為好友</div>
    `;
}

function sendInvitation(receiver, receiverId){
    console.log(receiver);
    console.log(receiverId);
    const db = firebase.firestore();
    const collectionRef = db.collection(collectionNameFriend);
    const docRef = collectionRef.doc();
    const data = {
        key: ['3',receiverId],
        sender:"Annie",
        receiver,
        status: false,
    }
    docRef.set(data,{merge: true}).then(() => {
    console.log(`已發送好友邀請. 邀請函: ${docRef.id}`);
    });
}

function confirmInvitation(name,id){
    console.log(id);
    const db = firebase.firestore();
    const invitation = document.getElementById('invitation');
    const updateFile = db.collection(collectionNameFriend).doc(id);
    // Set the "capital" field of the city 'DC'
    return updateFile.update({
        status: true
    })
    .then(() => {
        console.log(`您已和${name}成為好友`);
    })
    .catch((error) => {
        console.error("Error", error);
    });
}

function instantlyInvitation(){
    const db = firebase.firestore();
    const invitation = document.getElementById('invitation');
    db.collection(collectionNameFriend).where("key", "array-contains", "3").where("status", "==", false)
    .onSnapshot((querySnapshot) => {
        invitation.innerHTML = ``;
        querySnapshot.forEach((doc)=>{
            if(doc.data().key[0] !== '3' &&!(doc.data().status)){
                renderInvitation(doc);
            }
        })
    });
}

function instantlyFriendList(){
    const db = firebase.firestore();
    const friends = document.getElementById('friends');
    db.collection(collectionNameFriend).where("key", "array-contains", "3").where("status", "==",true)
    .onSnapshot((querySnapshot) => {
        friends.innerHTML = ``;
        querySnapshot.forEach((doc)=>{
            renderFriendList(doc);
        })
    });
}

function renderInvitation(data){
    const invitation = document.getElementById('invitation');
    const db = firebase.firestore();
    let name;
    db.collection(collectionNameAuthor).where("id", "==", data.data().key[0]).get().then(response => {
        response.forEach(doc=>{
            name = doc.data().name;
        })
    }).then(() => {
        invitation.insertAdjacentHTML(
            'beforeend',
            `<div class="flex_end">
                <div>${name}</div>
                <div class="button friendbutton" onclick="confirmInvitation('${name}','${data.id}')">Confirm</div>
            </div>
            `
        )
    })
}

function renderFriendList(doc){
    const data = doc.data();
    const friends = document.getElementById('friends');
    let name;
    if(data.key[0] !== '3'){
        name = data.sender;
    }else{
        name = data.receiver;
    }
    friends.insertAdjacentHTML(
        'beforeend',
        `<div class="flex_end">
            <div class="friendName">${name}</div> 
            <div class="button friendbutton" onclick="removeFriend('${doc.id}')">Delet</div>
        </div>
        `
    )
}

function removeFriend(id){
    const db = firebase.firestore();
    db.collection(collectionNameFriend).doc(id).delete().then(() => {
        console.log("Document successfully deleted!");
    }).catch((error) => {
        console.error("Error removing document: ", error);
    });
}

firebaseSDK ();
instantlyInvitation();
instantlyFriendList();

//test
function sendInvitationTest(){
    const db = firebase.firestore();
    const collectionRef = db.collection(collectionNameFriend);
    const docRef = collectionRef.doc();
    const data = {
        key: ['4','3'],
        sender:"four",
        receiver:"Annie",
        status: false,
    }
    docRef.set(data,{merge: true}).then(() => {
    console.log(`已發送好友邀請. 邀請函: ${docRef.id}`);
    });
}