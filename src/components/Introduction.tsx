import {Suspense, lazy, useState } from "react"
import { intro } from "../data"
import Loader from "./Loader"
const ProfilePic = lazy(() => import("./ProfilePic"))

const Introduction = () => {

  return (
    <main 
    className="h-full md:h-[100vh] container mx-auto w-full flex-col gap-y-28 flex md:flex-row justify-center items-center gap-x-40" 
    id="home">

            <h2 className="flex flex-col gap-2 w-52 mt-16 md:mt-0 text-center md:text-left">
                <span className="text-lg md:text-2xl text-primary">
                    {intro.name}
                </span>
                <span className="text-2xl md:text-4xl drop-shadow-glow-white font-medium">
                    {intro.designation}
                </span>
                <a href={intro.resume} download="Reenav_Hemaria_Resume">
                    <button 
                    name="Resume"
                    className="bg-primary w-28 h-9 rounded-md md:w-40 md:h-12 md:rounded-2xl
                     hover:bg-white hover:drop-shadow-glow-white hover:text-lg hover:text-black hover:font-bold transition-all
                     duration-500 text-[16px] font-extrathin">
                        Resume
                    </button>
                </a>
            </h2>
            <Suspense fallback={<Loader/>}>
                <ProfilePic />
            </Suspense>
            <div>
                <h2 className="text-3xl text-center md:text-4xl drop-shadow-glow-white font-medium mb-2">Skills</h2>
                <ul className="space-y-2">
                {intro.skills.map((skill,index) => {
                    return <li key={index} className="flex items-center gap-2">
                            <img src={skill.icon} alt={skill.software} className="h-4 md:h-5 aspect-square"/>
                        <h3 className="text-base md:text-xl font-normal ">
                            {skill.software}
                        </h3>
                    </li>
                })}
                </ul>
            </div>

    </main>
  )
}

export default Introduction