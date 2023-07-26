import BlurLoad from "./BlurLoad";

type propsType = {
    image: string,
    smallImg: string,
    links: {linkTo: string; logo: any; to: string}[]
    title: string,
    current: number
}
const ProjectImage = ({image,smallImg,links,title,current}: propsType) => {

    
  return (
    <div 
    className="p-2 bg-secondary w-5/6 mx-auto md:w-[604px] opacity-0 project-img-section  md:mx-0 rounded-md flex flex-col gap-2"
    style={{animationDelay: current == 0 ? "0" : "2000ms"}}>
        <BlurLoad img={image} smallImg={smallImg} alt={title} style=" md:w-full  aspect-auto rounded-md object-cover" />
        {/* <img src={image} alt={title} className=" md:w-full  aspect-auto rounded-md object-cover" /> */}
        <div className="flex gap-5">
            {links.map((link,index) => {
                return <a href={link.to} target="_blank" className="bg-black rounded-md p-2 flex gap-2" key={index}>
                    <img src={link.logo} alt={link.linkTo} className="aspect-sqaure w-5 "/>
                    {link.linkTo}
                </a>
            })}
        </div>
    </div>
  )
}

export default ProjectImage