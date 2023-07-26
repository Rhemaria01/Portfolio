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
    
  }
  return (
    <nav role="navigation" className={`md:h-[5vh] z-[60]  w-full fixed flex justify-around ${ scrolled && "bg-[#111111] "} items-center `}>
        <h1 className=" text-white text-3xl font-bold drop-shadow-glow-white ">
            <a href="/">{nav.title}</a>
        </h1>
        <ul className="hidden md:flex gap-40 ">
          {nav.links.map((link,index)=>{
            return <li key={index} 
            className="text-primary rounded-md px-2 transition-all duration-500 hover:bg-white hover:drop-shadow-glow-circle 
            hover:text-black font-bold"><button onClick={()=>handleClick(link.to)}>{link.link}</button></li>
          })}
        </ul>
        <button name="hamburger" onClick={()=>setOpen(!open)} className="md:hidden">
          <nav.hamburger/>
        </button>
        {open && <>
        <div className="py-5 rounded-lg absolute top-11 left-1/2 -translate-x-1/2 w-5/6 z-10 drop-shadow-glow-white  bg-white md:hidden">
        <ul className="flex flex-col gap-8 items-center justify-center ">
          {nav.links.map((link,index)=>{
            return <li key={index} className="text-black font-bold">
              <button name="link" onClick={()=>handleClick(link.to)}>
                {link.link}
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