import LoaderLottie from "../lotties/loading.lottie"
const Loader = () => {

  return (
    <div role="status" className="flex justify-center items-center h-screen">
      <dotlottie-player 
      src={LoaderLottie}
	    autoplay
      loop
      className='h-full w-full'
      />

</div>
  )
}

export default Loader