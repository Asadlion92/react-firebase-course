import { useEffect, useState } from 'react'
import './App.css'
import { Auth } from './componets/auth'
import { db, auth, storage } from './config/firebase'
import { getDocs, collection, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore'
import { ref, uploadBytes } from 'firebase/storage'

function App() {
  const [movieList, setMovieList] = useState([])

  //New Movie State
  const [newMovieTitle, setNewMovieTitle] = useState("")
  const [newReleaseDate, setNewReleaseDate] = useState(0)
  const [isNewMovieOscar, setIsNewMovieOscar] = useState(false)

  //Update Title State
  const [updatedTitle, setUpdatedTitle] = useState("")

  //File Upload State
  const [fileUpload, setFileUpload] = useState(null)

  const moviesCollectionRef = collection(db, "movies")

  const getMovieList = async () => {
    try {
    const data = await getDocs(moviesCollectionRef);
    const filteredData = data.docs.map((doc) => ({ //Here we are getting the docs from the data and mapping it
      ...doc.data(), 
      id: doc.id}))
    setMovieList(filteredData)
    } catch (err) {
      console.error(err)
    }
  }



  const onSubmitMovie = async () => {
    try {
      await addDoc(moviesCollectionRef, {
        title: newMovieTitle, 
        releaseDate: newReleaseDate, 
        receivedAnOscar: isNewMovieOscar,
        userId: auth?.currentUser?.uid 
        //uid is not recognized above
      });
      getMovieList();
    } catch(err) {
      console.error(err);
    }
  }

  const deleteMovie = async (id) => {
    const movieDoc = doc(db, "movies", id)
    await deleteDoc(movieDoc);
    getMovieList();
  }

  const updateMovieTitle = async (id) => {
    const movieDoc = doc(db, "movies", id)
    await updateDoc(movieDoc, {title: updatedTitle});
  }

  const uploadFile = async () => {
    if (!fileUpload) return;
    const filesFolderRef = ref(storage, `projectFiles/${fileUpload.name}`);
    try {
      await uploadBytes(filesFolderRef, fileUpload);
    } catch (err) {
      console.error(err);
    }

  }

  useEffect(() => {
    getMovieList();
  }, [])

  return (
    <div className='App'><Auth />
      <div>
        <input 
          placeholder='Movie title...' 
          onChange={(e) => setNewMovieTitle(e.target.value)} 
        />
        <input 
          placeholder='Release Date...' 
          type='number'
          onChange={(e) => setNewReleaseDate(Number(e.target.value))}  
        />
        <input 
          type='checkbox'
          checked={isNewMovieOscar}
          onChange={(e) => setIsNewMovieOscar(e.target.checked)} 
        />
        <label>Received An Oscar</label>
        <button onClick={onSubmitMovie}>Submit Movie</button>
      </div>
      <div>
        {movieList.map((movie, index) => (
          <div key={index}>
            <h1 style={{color: movie.receivedAnOscar ? "green" : "red"}}>{movie.title}</h1>
            <p>Date: {movie.releaseDate}</p>
            <button onClick={() => deleteMovie(movie.id)}>Delete Movie</button>
            <input 
              placeholder='new title...'
              onChange={(e) => setUpdatedTitle(e.target.value)} 
            />
            <button onClick={() => updateMovieTitle(movie.id)}>Update Title</button>
          </div>
        ))}
      </div>
      <div>
        <input type="file" onChange={(e) => setFileUpload(e.target.files[0])} />
        <button onClick={uploadFile}>Upload File</button>
      </div>
    </div>
  )
}

export default App
