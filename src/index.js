import { initializeApp } from 'firebase/app'
import {
  getFirestore, collection, onSnapshot,
  addDoc, deleteDoc, doc,
  query, where,
  orderBy, serverTimestamp,
  getDoc, updateDoc
} from 'firebase/firestore'

import {
  getAuth,
  createUserWithEmailAndPassword,
  signOut, signInWithEmailAndPassword,
  onAuthStateChanged 
} from 'firebase/auth'

const firebaseConfig = {
    apiKey: "AIzaSyBEqeVzcDkuWUQb9-Rsaj1ADWe8zL9UQQM",
    authDomain: "fir-9-dojo-bf97d.firebaseapp.com",
    projectId: "fir-9-dojo-bf97d",
    storageBucket: "fir-9-dojo-bf97d.appspot.com",
    messagingSenderId: "852627275963",
    appId: "1:852627275963:web:19d55c90621a23a6cea99e"
  }

// init firebase
initializeApp(firebaseConfig)

// init services
const db = getFirestore()
const auth = getAuth()

// collection ref
const colRef = collection(db, 'books')

const q=query(colRef , orderBy('createdAt'))

// get  realtime collection data

  const unsubCol= onSnapshot(q, (snapshot) => {
    let books = []
    snapshot.docs.forEach(doc => {
      books.push({ ...doc.data(), id: doc.id })
    })
    console.log(books)
  
  })

  //adding document
  const addBookForm = document.querySelector('.add')
  addBookForm.addEventListener('submit',(e)=>{
    e.preventDefault()

    addDoc(colRef,{
      title: addBookForm.title.value,
      author: addBookForm.author.value,
      createdAt: serverTimestamp()
    })

    .then(()=>{
      addBookForm.reset()
    })
  })

  //deleting documents
  const deleteBookForm=document.querySelector('.delete')
  deleteBookForm.addEventListener('submit',(e)=>{
    e.preventDefault()

    const docRef = doc(db, 'books' , deleteBookForm.id.value )
    deleteDoc(docRef)
      .then(() =>{
        deleteBookForm.reset()
      })
  })


  //get a single document
  const docRef= doc(db,'books','V1OGS18aXEb25vjAJJse')

   const unsubDoc = onSnapshot(docRef,(doc)=>{
      console.log(doc.data(),doc.id)
    })

    //updating a form
    const updateForm = document.querySelector('.update')
    deleteBookForm.addEventListener('submit',(e)=>{
      e.preventDefault()
      const docRef = doc(db, 'books' , updateForm.id.value )
      updateDoc(docRef, {
        title: 'updated title'
      })

      .then(() =>{
        updateForm.reset()
      })

    })

    //signing users up
    const signupForm = document.querySelector('.signup')
    signupForm.addEventListener('submit',(e)=>{
      e.preventDefault()

      const email = signupForm.email.value
      const password = signupForm.password.value

      createUserWithEmailAndPassword(auth, email, password )
        .then((cred)=>{
          //console.log('user created:', cred.user)
          signupForm.reset()
        })

        .catch((err)=>{
          console.log(err.message)
        })
    })

    //logging in and log out

    const logoutButton = document.querySelector('.logout')
    logoutButton.addEventListener('click', ()=>{
        signOut(auth)
          .then(()=>{
            //console.log('The User signed out')
          })

          .catch((err)=>{
            console.log(err.message)
          })
    })

    const loginForm = document.querySelector('.login')
    loginForm.addEventListener('submit', (e) =>{
        e.preventDefault()

        const email= loginForm.email.value
        const password = loginForm.password.value
        signInWithEmailAndPassword(auth, email, password)
          .then((cred)=>{
            //console.log('user logged in:', cred.user)
          })

          .catch((err)=>{
            console.log(err.message)
          })
    })

    //subscribing to auth changes
    const unsubAuth = onAuthStateChanged(auth, (user)=>{
        console.log('user status changed:', user)
    })

    //unsubscribe from changes (auth/db)
    const unsubButton = document.querySelector('.unsub')
    unsubButton.addEventListener('click', ()=>{
      console.log('unsubscribing')
      unsubCol()
      unsubDoc()
      unsubAuth()
    })
