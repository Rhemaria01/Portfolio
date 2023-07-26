
import BlurLoad from './BlurLoad';
import { intro } from '../data';
import ProfileLottie from "../lotties/profile.lottie"
const ProfilePic = () => {

   return (
     <div >
        <div className='absolute w-[30rem] md:w-[50rem] -translate-x-1/2 -translate-y-1/2 left-1/2 top-[48%] md:left-[51%]  md:top-1/2  '>
            <dotlottie-player
            src={ProfileLottie}
            loop
            autoplay
            className="h-full w-full"
            speed={0.5}
            />
        </div>
    <BlurLoad 
     img={intro.image} 
     smallImg={intro.imageSmall} 
     alt="profile" 
     style="aspect-square  rounded-full w-52 md:w-80  object-cover ring-white object-left-top"/>
     </div>
   )
 }
 
 export default ProfilePic