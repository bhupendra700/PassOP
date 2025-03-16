import './App.css'
import Header from './Component/Header'
import Main from './Component/Main'
import About from './Component/About'
import Contact from './Component/Contact'
import Footer from './Component/Footer'
import { createContext, useState } from 'react'
import Delete from './Component/Delete'

const DataContext = createContext();
function App() {
  // let [data , setData] = useState([]);
  let [data , setData] = useState([{id:"dfghjkglh" , userId:"egrhtjykul6" , url:"Bhupendra Yadav" ,username:"bhupendra70" , password:"9764357799" , showPassword:false} , {id:"dfhgmtyigufykutjth" , userId:"egrhtjykul6" , url:"youtube.com" ,username:"ytcomabc" , password:"yt123abc" , showPassword:false} , {id:"wgm876truyhtga" , userId:"egrhtjykul6" , url:"https://google.com" ,username:"google70" , password:"googleabc" , showPassword:false} , {id:"wgm876truyhtga" , userId:"egrhtjykul6" , url:"https://google.com" ,username:"google70" , password:"googleabc" , showPassword:false}, {id:"wgm876truyhtga" , userId:"egrhtjykul6" , url:"https://google.com" ,username:"google70" , password:"googleabc" , showPassword:false}, {id:"wgm876truyhtga" , userId:"egrhtjykul6" , url:"https://google.com" ,username:"google70" , password:"googleabc" , showPassword:false}, {id:"wgm876truyhtga" , userId:"egrhtjykul6" , url:"https://google.com" ,username:"google70" , password:"googleabc" , showPassword:false}, {id:"wgm876truyhtga" , userId:"egrhtjykul6" , url:"https://google.com" ,username:"google70" , password:"googleabc" , showPassword:false}, {id:"wgm876truyhtga" , userId:"egrhtjykul6" , url:"https://google.com" ,username:"google70" , password:"googleabc" , showPassword:false}, {id:"wgm876truyhtga" , userId:"egrhtjykul6" , url:"https://google.com" ,username:"google70" , password:"googleabc" , showPassword:false}, {id:"wgm876truyhtga" , userId:"egrhtjykul6" , url:"https://google.com" ,username:"google70" , password:"googleabc" , showPassword:false}, {id:"wgm876truyhtga" , userId:"egrhtjykul6" , url:"https://google.com" ,username:"google70" , password:"googleabc" , showPassword:false}, {id:"wgm876truyhtga" , userId:"egrhtjykul6" , url:"https://google.com" ,username:"google70" , password:"googleabc" , showPassword:false}]);

  return (
    <DataContext.Provider value={{data , setData}}>
      <Header/>
      <Main/>
      {/* <About /> */}
      {/* <Contact/> */}
      <Delete />
      <Footer/>
    </DataContext.Provider>
  )
}

export {DataContext}
export default App
