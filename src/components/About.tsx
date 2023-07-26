import { about } from "../data"
const About = () => {
  return (
    <article className="mb-20 mt-10 container mx-auto" id="about">
        <h2 className="text-4xl drop-shadow-glow-white text-center md:text-left">About</h2>
        <p className="text-primary text-base md:text-xl text-justify font-medium w-80 mx-auto md:w-full">
            {about}
        </p>
    </article>
  )
}

export default About