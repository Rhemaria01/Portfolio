import {BiSolidCircle} from "react-icons/bi"

type props = {
  end: number,
  current: number
}
const Timeline = ({end,current}: props) => {

  return (
    <div className="flex flex-col h-[54.75rem] xs:h-[48.75rem] sm:h-[44.75rem]  md:h-[52rem] lg:h-[32rem] xl:h-[28rem] items-center " >
      
        <h3 
        className="drop-shadow-glow-circle bullet w-3 opacity-0 aspect-square  z-50"
        style={{animationDelay: current == 0 ? "0" : "2000ms"}}         
        >
          <BiSolidCircle/>
        </h3>

        {current < end && <div  className={`bg-primary increase-height ml-1 w-0.5  z-20`} 
        style={{animationDelay: current == 0 ? "1000ms" : "3500ms"}}></div>}

  
    </div>
  )

}

export default Timeline