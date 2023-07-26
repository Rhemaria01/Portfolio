import BGLottie from "../lotties/background.lottie"


const Background = () => {

      return (
        <div role="status" className="h-full w-full
        md:translate-x-0 md:w-full md:right-0 bottom-0 fixed -z-50 opacity-50">
      <dotlottie-player 
      src={BGLottie}
	    autoplay
      loop
      className='h-full w-full'
      />
    
        </div>
      )
}

export default Background