import { useEffect } from "react"
import {loadImage} from "../utils"
type props = {
    img: string,
    smallImg: string,
    alt: string,
    style: string
}
const BlurLoad = ({img,smallImg,alt,style}: props) =>{
useEffect(() => {
    loadImage()
},[])
    return(
    <div className={`blur-load ${style}`} style={{backgroundImage: `url(${smallImg})`}} >
        <img className={style} src={img} alt={alt} loading="lazy" />
    </div>
)
}
export default BlurLoad