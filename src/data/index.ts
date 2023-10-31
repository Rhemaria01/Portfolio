//Navbar
import {GiHamburgerMenu} from "react-icons/gi"
export const nav = {
    title: "Reenav Hemaria",
    hamburger: GiHamburgerMenu,
    links: [
        {
            link: "Home",
            to: "home"    
        },{
            link: "About me",
            to: "about"
        },
        {
            link: "Projects",
            to: "projects"
        }, 
        {
            link: "Contact me",
            to: "contact"
        },]
}

//Introduction 

import Resume from "../file/Reenav_Hemaria_Resume.pdf"
import Profile from "../assets/Reenav.webp"
import ProfileSmall from "../assets/Reenav-small.webp"
import ReactLogo from "../assets/react.svg"
import JavascriptLogo from "../assets/javascript.svg"
import HtmlLogo from "../assets/html.svg"
import TailwindLogo from "../assets/tailwind.svg"
import FirebaseLogo from "../assets/firebase.svg"
import GithubLogo from "../assets/git.svg"

export const intro = {
    name: "Hello, I'm Reenav,",
    designation: "Frontend Developer",
    resume: Resume,
    image: Profile,
    imageSmall: ProfileSmall,
    skills: [{
        software: "ReactJS",
        icon: ReactLogo,
    },{
        software: "Javascript",
        icon: JavascriptLogo,
    },{
        software: "HTML & CSS",
        icon: HtmlLogo,
    },{
        software: "TailwindCSS",
        icon: TailwindLogo,
    },{
        software: "Firebase",
        icon: FirebaseLogo,
    },{
        software: "Github",
        icon: GithubLogo,
    }]
}

//About 

export const about = 
    "Passionate and driven frontend developer with a strong interest in building exceptional user experiences. "+
    "Equipped with a solid foundation in HTML, CSS, and JavaScript, I am eager to further my skills in modern frontend "+  
    "libraries like React and frontend frameworks like Next. Committed to staying updated with the latest industry "+
    "trends and best practices, I strive to create visually appealing, responsive, and intuitive web applications. With a "+
    "keen eye for detail and a collaborative mindset, I am ready to contribute to a dynamic team and make a "+
    "meaningful impact in the world of frontend development."

//Projects
import PestSolutions from "../assets/pest solutions.webp"
import PestSolutionsSmall from "../assets/pest solutions-small.webp"
import Digicrowd from "../assets/Digicrowd.webp"
import DigicrowdSmall from "../assets/DigiCrowd-small.webp"
import TictacToe from "../assets/tictactoe.webp"
import TictacToeSmall from "../assets/tictactoe-small.webp"
import MRS from "../assets/mrs.webp"
import MRSSmall from "../assets/mrs-small.webp"
import FarmFresh from "../assets/farmfresh.webp"
import FarmFreshSmall from "../assets/farmfresh-small.webp"
import LinkLogo from "../assets/link.svg"
import PdfMate from "../assets/pdfmate.webp"
import PdfMateSmall from "../assets/pdfmate-small.webp"

interface Links{
    linkTo: "Github" | "Link"
    logo: string
    to: string;
}

interface Projects{
    title: string;
    description: string;
    techstack: string[];
    image: string;
    imageSmall: string;
    links: Links[];
}

export const projects: Projects[] = [
    {
        title: "PdfMate",
        description: `PDFMate transforms your PDF interactions. You can upload your documents and have dynamic conversations with them
                      via an intuitive chat interface. The platform is constructed using the NextJS framework, with support from 
                      Tanstack Query and TRPC for data communication. Utilizing frontend libraries like Tailwind CSS and Shadcn ensures a seamless, elegant, and cohesive
                      user interface. Uploadthing manages file storage, Pinecone handles file indexing, and, lastly, OpenAI API and Langchain
                      facilitate seamless integration with OpenAI services.`,
        techstack: ["NextJS","TRPC","Tanstack Query","Tailwind","shadcn","UploadThing","Pinecone","OpenAI API","Langchain"],
        image: PdfMate,
        imageSmall: PdfMateSmall,
        links: [{
            linkTo: "Github",
            logo: GithubLogo,
            to: "https://github.com/Rhemaria01/PDFMate"
        },{
            linkTo: "Link",
            logo: LinkLogo,
            to: "https://pdf-mate.vercel.app/"
        }]
    },
    {
        title: "Pest solutions",
        description: `The Pest Solutions Marketing Website is a dynamic platform built using the React library, 
                      specifically designed to promote and market pest control services. The website aims to attract potential customers,
                      provide comprehensive information about the offered services, and generate leads for the pest solutions business.`,
        techstack: ["ReactJS","CSS", "SEO", "Image Optimization", "Responsive"],
        image: PestSolutions,
        imageSmall: PestSolutionsSmall,
        links: [
            {   
                linkTo: "Github",
                logo: GithubLogo,
                to:"https://github.com/Rhemaria01/pestcontrolwebsite"
            },
            {
                linkTo: "Link",
                logo: LinkLogo,
                to: "https://pestsolutions.netlify.app/"
            }
        ]   
    },{
        title: "Digicrowd",
        description: `This is a decentralized crowdfunding platform built on the Ethereum blockchain.
                      The project uses ReactJS with Vite for the frontend, Solidity for smart contract development,
                      and Thirdweb for deploying the smart contract to the Ethereum network. IPFS, also provided by Thirdweb,
                      is used to store files.`,
        techstack: ["ReactJS", "Solidity", "Ganache", "TailwindCSS"],
        image: Digicrowd,
        imageSmall: DigicrowdSmall, 
        links: [
            {   
                linkTo: "Github",
                logo: GithubLogo,
                to:"https://github.com/Rhemaria01/DigicrowdVite"
            },
        ]   
    },{
        title: "Async Tic Tac Toe (Mobile Only)",
        description: `This is an asynchronous tic-tac-toe game built with ReactJS and Firebase.
                      Users can log in using their email addresses and play in real-time with friends.
                      The game board updates dynamically as players make their moves, and Firebase stores the game
                      state to ensure users can pick up where they left off.`,
        techstack: ["ReactJS", "Firebase-auth", "Firebase-databse", "Firestore", "CSS"],
        image: TictacToe,
        imageSmall: TictacToeSmall,
        links: [
            {   
                linkTo: "Github",
                logo: GithubLogo,
                to:"https://github.com/Rhemaria01/AsyncTicTacToe"
            },
            {
                linkTo: "Link",
                logo: LinkLogo,
                to: "https://asynctictactoe.netlify.app/"
            }
        ]   
    },{
        title: "Movies Recommendation System",
        description: `Movie Recommendation System: A dynamic movie recommendation system developed with ReactJS for the frontend
                      and Flask for the backend, providing personalized movie suggestions based on user preferences and viewing history`,
        techstack: ["ReactJS", "Python", "Flask", "Jupyter", "CSS"],
        image: MRS,
        imageSmall: MRSSmall,
        links: [
            {   
                linkTo: "Github",
                logo: GithubLogo,
                to:"https://github.com/Rhemaria01/MRS"
            },
            {
                linkTo: "Link",
                logo: LinkLogo,
                to: "https://moviesonthego.netlify.app/"
            }
        ]   
    },{
        title: "Farm Fresh",
        description: `Farm Fresh is a revolutionary farmer's portal built with ReactJS and powered by Firebase,
                      dedicated to fostering a direct and transparent connection between farmers and consumers. 
                      By eliminating the middle man, we empower farmers to sell their fresh, organic produce directly to consumers,
                      ensuring fair prices for both parties. No more excessive markups or hidden costs! `,
        techstack: ["ReactJS", "Firebase", "CSS"],
        image: FarmFresh,
        imageSmall: FarmFreshSmall,
        links: [
            {   
                linkTo: "Github",
                logo: GithubLogo,
                to:"https://github.com/Rhemaria01/MRS"
            },
            {
                linkTo: "Link",
                logo: LinkLogo,
                to: "https://moviesonthego.netlify.app/"
            }
        ]   
    },
]

//Certifications
export const certificates = [
    {
        name: "ReactjS with Firebase",
        provider: "LearnCodeOnline",
        completion: "Sept. 2021",
        color: "bg-tertiary",
    },{
        name: "MongoDB with NodeJS",
        provider: "Verzeo",
        completion: "Dec. 2021",
        color: "bg-tertiary/75",         
    },{
        name: "Pyhton Basics & Data Structures",
        provider: "Coursera",
        completion: "Oct. 2020",
        color: "bg-tertiary/50",        
    }
]
