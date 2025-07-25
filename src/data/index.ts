//Navbar
import { GiHamburgerMenu } from "react-icons/gi";
export const nav = {
  title: "Reenav Hemaria",
  hamburger: GiHamburgerMenu,
  links: [
    {
      link: "Home",
      to: "home",
    },
    {
      link: "About me",
      to: "about",
    },
    {
      link: "Projects",
      to: "projects",
    },
    {
      link: "Contact me",
      to: "contact",
    },
  ],
};

//Introduction

import Resume from "../file/Reenav_Hemaria_Resume.pdf";
import Profile from "../assets/Reenav.webp";
import ProfileSmall from "../assets/Reenav-small.webp";
import ReactLogo from "../assets/react.svg";
import JavascriptLogo from "../assets/javascript.svg";
import HtmlLogo from "../assets/html.svg";
import TailwindLogo from "../assets/tailwind.svg";
import FirebaseLogo from "../assets/firebase.svg";
import GithubLogo from "../assets/git.svg";

export const intro = {
  name: "Hello, I'm Reenav,",
  designation: "Frontend Developer",
  resume: Resume,
  image: Profile,
  imageSmall: ProfileSmall,
  skills: [
    {
      software: "ReactJS",
      icon: ReactLogo,
    },
    {
      software: "Javascript",
      icon: JavascriptLogo,
    },
    {
      software: "HTML & CSS",
      icon: HtmlLogo,
    },
    {
      software: "TailwindCSS",
      icon: TailwindLogo,
    },
    {
      software: "Firebase",
      icon: FirebaseLogo,
    },
    {
      software: "Github",
      icon: GithubLogo,
    },
  ],
};

//About

export const about =
  "Passionate and driven frontend developer with a strong interest in building exceptional user experiences. " +
  "Equipped with a solid foundation in HTML, CSS, and JavaScript, I am eager to further my skills in modern frontend " +
  "libraries like React and frontend frameworks like Next. Committed to staying updated with the latest industry " +
  "trends and best practices, I strive to create visually appealing, responsive, and intuitive web applications. With a " +
  "keen eye for detail and a collaborative mindset, I am ready to contribute to a dynamic team and make a " +
  "meaningful impact in the world of frontend development.";

//Projects
import PestSolutions from "../assets/pest solutions.webp";
import PestSolutionsSmall from "../assets/pest solutions-small.webp";
import Digicrowd from "../assets/Digicrowd.webp";
import DigicrowdSmall from "../assets/DigiCrowd-small.webp";
import TictacToe from "../assets/tictactoe.webp";
import TictacToeSmall from "../assets/tictactoe-small.webp";
import MRS from "../assets/mrs.webp";
import MRSSmall from "../assets/mrs-small.webp";
import FarmFresh from "../assets/farmfresh.webp";
import FarmFreshSmall from "../assets/farmfresh-small.webp";
import LinkLogo from "../assets/link.svg";
import Flexibuckets from "../assets/flexibuckets.webp"
import FlexibucketsSmall from "../assets/flexibuckets-small.webp"
import Crispymail from "../assets/crispymail.webp"
import CrispymailSmall from "../assets/crispymail-small.webp"

interface Links {
  linkTo: "Github" | "Link";
  logo: string;
  to: string;
}

interface Projects {
  title: string;
  description: string;
  techstack: string[];
  image: string;
  imageSmall: string;
  links: Links[];
}

export const projects: Projects[] = [
  {
    title: "Flexibucket",
    description: `FlexiBuckets is an open-source, self-hosted solution for managing multiple S3-compatible storage buckets in one unified interface. Perfect for developers and teams who work with various S3-compatible storage providers.`,
    techstack: [
      "NextJS",
      "Tanstack Query",
      "Tailwind & shadcn",
      "Zustand",
      "Typescript"
    ],
    image: Flexibuckets,
    imageSmall: FlexibucketsSmall,
    links: [
      {
        linkTo: "Github",
        logo: GithubLogo,
        to: "https://github.com/flexibuckets/flexibuckets",
      },
      {
        linkTo: "Link",
        logo: LinkLogo,
        to: "https://www.flexibuckets.com/",
      },
    ],
  },
  {
    title: "Crispy Mail",
    description: `Crispymail is an AI-powered email assistant designed to enhance productivity by streamlining email management. It helps users save up to 8 hours a week by automatically filtering out low-priority emails, summarizing newsletters with daily TLDRs directly within Gmail, and applying custom rules for inbox organization and response automation.`,
    techstack: [
      "NextJS",
      "Tanstack Query",
      "Tailwind & shadcn",
      "Typescript",
      "Google APIS",
      "Composio"
    ],
    image: Crispymail,
    imageSmall: CrispymailSmall,
    links: [
      {
        linkTo: "Link",
        logo: LinkLogo,
        to: "https://www.flexibuckets.com/",
      },
    ],
  },
  {
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
        to: "https://github.com/Rhemaria01/DigicrowdVite",
      },
    ],
  },
  {
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
        to: "https://github.com/Rhemaria01/MRS",
      },
      {
        linkTo: "Link",
        logo: LinkLogo,
        to: "https://moviesonthego.netlify.app/",
      },
    ],
  },
];

//Certifications
export const certificates = [
  {
    name: "ReactjS with Firebase",
    provider: "LearnCodeOnline",
    completion: "Sept. 2021",
    color: "bg-tertiary",
  },
  {
    name: "MongoDB with NodeJS",
    provider: "Verzeo",
    completion: "Dec. 2021",
    color: "bg-tertiary/75",
  },
  {
    name: "Pyhton Basics & Data Structures",
    provider: "Coursera",
    completion: "Oct. 2020",
    color: "bg-tertiary/50",
  },
];
