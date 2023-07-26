
import  {projects}  from "../data"
import ProjectImage from "./ProjectImage"
import Timeline from "./Timeline"
import useIsInViewport from "../hooks/useIsInViewport"
import { useState } from "react"

type functionType = {
    ended: () => void;
}
const Projects = ({ended}: functionType) => {
    const timeline = [...Array(projects.length).keys()]
    const [count,setCount] = useState<number>(1)
    const [containerRef, intersected] = useIsInViewport({
        root: null,
        rootMargin: "0px",
        treshhold: 1.0
    });

    const animationEnd = () => {        
        ended()
      }

    

  return (
    <main  ref={containerRef}  className="flex flex-col gap-0 w-5/6 mb-5 conatiner mx-auto" id="projects" >
        <h2 className="text-4xl text-center md:text-left font-medium drop-shadow-glow-white mb-5">Projects</h2>
        <div className="flex flex-row justify-start w-full md:w-full mx-auto min-h-screen">
            
                {intersected  &&
                <>
            <div className="flex flex-col mt-2 ">
                {timeline.slice(0,count).map((time,index) => {
                    return <Timeline current={time} key={index} end={projects.length-1} />
                })}
            </div>

            <div>
                {projects.slice(0,count).map((project,index) => {                   
                    return <div className="flex flex-col gap-8 mb-11  justify-center md:justify-start div-height  md:flex-row md:items-start 
                                           h-[46rem] sm:h-[42rem] md:h-[52rem] lg:h-[32rem] xl:h-[28rem] md:mb-0" 
                                           key={index}>

                            <div className="flex flex-row w-5/6 mx-auto gap-5 h-full md:w-1/2 md:mr-20 md:ml-0 md:gap-0">
                                <div 
                                className="flex flex-col gap-2  mx-auto project-info opacity-0 md:w-full md:ml-5"
                                style={{animationDelay: index == 0 ? "0" : "2000ms"}}
                                onAnimationEnd={() => {if(index<projects.length-1)setCount(count+1);if(index == projects.length -1) animationEnd()}}          
                                >
                                    <h3 
                                    className="text-xl md:text-2xl font-bold">{project.title}</h3>
                                    <p className="text-primary text-md md:text-xl  font-medium">
                                        {project.description}
                                    </p>
                                    
                                    <div className="flex flex-wrap gap-3">
                                        {project.techstack.map((tech,index) => {
                                        return <div 
                                        className="bg-primary py-1 px-8 text-base rounded-2xl  text-center font-normal
                                        hover:bg-white hover:drop-shadow-glow-white 
                                         hover:text-black hover:font-bold transition-all duration-300"
                                         key={index}>
                                        {tech}
                                        </div>
                                        })}
                                    </div>
                                </div>
                            </div>
                            <ProjectImage current={index} image={project.image} smallImg={project.imageSmall} links={project.links} title={project.title}/>
    
                        </div>
                })}
            </div>
            </>
            }   
        </div>
    </main>
  )
}

export default Projects