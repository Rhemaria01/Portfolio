import { Suspense, lazy, useState } from "react"
import About from "./components/About"
import Navbar from "./components/Navbar"
import Loader from "./components/Loader"
const Introduction = lazy(() => import("./components/Introduction"))
const Projects = lazy(() => import("./components/Projects")) 
const Certifications = lazy(() => import("./components/Certifications"))
const Contact = lazy(() => import("./components/Contact"))
import Background from "./components/Background"
import './App.css'
import'@dotlottie/player-component'
function App() {
  const[animationEnded, setAnimationEnded] = useState(false)

  const ended = () => {
    setTimeout(() => {
      setAnimationEnded(true)
    }, 300);
  }
  return (
    <>

      {/* <Background /> */}

      <Navbar />

      <Suspense fallback={<Loader />}>
        <Introduction />
      </Suspense>

      <About />

      <Suspense fallback={<Loader />}>
        <Projects ended={ended}/>
      </Suspense>

      {animationEnded && <Suspense fallback={<Loader />}>
        <Certifications/>
      </Suspense>}

      {animationEnded && <Suspense fallback={<Loader />}>
        <Contact/>
      </Suspense>}

    </>
  )
}

export default App
