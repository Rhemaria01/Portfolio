import { useState,useEffect } from "react"
import { nav } from "../data"

const Navbar = () => {
  const  [open, setOpen] = useState(false)
  const  [scrolled,setScrolled] = useState(false)
  useEffect(() => {
    window.addEventListener('scroll',  () => {
    if (window.scrollY >= 80) {
      setScrolled(true);
    }
    else {
      setScrolled(false);
    }
  });
  return window.removeEventListener('scroll',  () => {
    if (window.scrollY >= 80) {
      setScrolled(true);
    }
    else {
      setScrolled(false);
    }
  });
  },[])

  const handleClick = (to: string) => {
    const element = document.getElementById(to)
    element?.scrollIntoView()
    setOpen(false)
  }
  return (
    <nav role="navigation" className={`md:h-[5vh] w-[83vw] md:w-full z-[60]  fixed flex justify-evenly ${ scrolled && "bg-[#111111] "} items-center `}>
        <h1 className=" text-white text-3xl  font-bold drop-shadow-glow-white ">
            <a href="/">{nav.title}</a>
        </h1>
        <ul className="hidden md:flex gap-40 ">
          {nav.links.map((link,index)=>{
            return <li key={index} 
            className="text-primary rounded-md px-2 py-1 transition-all duration-500 hover:bg-white hover:drop-shadow-glow-circle 
            hover:text-black font-bold"><button name={link.to + "link"} onClick={()=>handleClick(link.to)}>{link.link}</button></li>
          })}
        </ul>
        <button name="menu button" onClick={()=>setOpen(!open)} className="md:hidden">
          <nav.hamburger/>
        </button>
        {open && <>
        <div className=" rounded-lg absolute top-11 left-1/2 -translate-x-1/2 w-5/6 z-10 drop-shadow-glow-white  bg-white md:hidden">
        <ul className="flex flex-col  items-center justify-center ">
          {nav.links.map((link,index)=>{
            return <li key={index} className="text-black w-full font-bold">
              <button name={link.to + "link"} className="w-full h-8"  onClick={()=>handleClick(link.to)}>
                <label className="w-full">{link.link}</label>
              </button>
              </li>
          })}
        </ul>
        </div>
        </>}
    </nav>
  )
}

export default Navbar