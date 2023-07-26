import {certificates} from "../data"
import useIsInViewport from "../hooks/useIsInViewport"


const Certifications = () => {
  const [containerRef, intersected] = useIsInViewport({
    root: null,
    rootMargin: "0px",
    treshhold: 1.0
  });
  return (
    <article ref={containerRef}  className='mb-20 mt-10 container mx-auto'>
        <h2 className="text-4xl drop-shadow-glow-white text-center md:text-left">Certifications</h2>
        <div className="flex justify-evenly items-center  flex-wrap gap-y-10 mt-20 text-center">
          {intersected &&
        certificates.map((certificate,index)=>{
          return <div  key={index}
          className={`rounded-md ${certificate.color}  text-[24px] 
          group/certificate hover:bg-white certificate hover:drop-shadow-glow-white hover:font-bold
          transition-colors duration-300 font-medium h-64  w-72 items-center opacity-0
          flex flex-col justify-between py-2`} 
          style={{animationDelay: (index*300).toString()+"ms"}}
          >
              <h3 className="text-3xl  group-hover/certificate:text-black ">{certificate.name}</h3>
              <h3 className="text-white/75 group-hover/certificate:text-black/75">{certificate.provider}</h3>
              <h3 className="text-white/50 group-hover/certificate:text-black/50">{certificate.completion}</h3>
          </div>
        })
      }
        </div>
    </article>
  )
}

export default Certifications