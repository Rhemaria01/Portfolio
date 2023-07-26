import  { useState } from 'react'
import Input from './Input'

import ContactLottie from "../lotties/contact.lottie"
const Contact = () => {
    const[form,setForm] = useState({
        name: "",
        email: "",
        message: ""
    })

    const handleChange = (fieldname: string, value: string) => {
        setForm({
            ...form,
            [fieldname]: value
        })
    }

        {/* 
        Step 1: Change email variable to your actual email address on which u want to receive email.
        Step 2: Fill the form and send it.
        Step 3: You will receive an email from FormSubmit, Activate your account through the email received
        Step 4 (Optional): Email from Formsubmit also includes random string (like one used below) to hide your email
        */}
        {/*Checkout this youtube video to know how this form works  https://youtu.be/iYWdtO3eT1E */}
        {/* Link to FormSubmit website: https://formsubmit.co/ */}

    const email = "722b0aaff3632fa3cfbd0c1dc1823108"
    
  return (
    <article className='mb-20 mt-10  mx-auto w-[83vw] space-y-10 md:space-y-0' id="contact">
        <h2 className="text-4xl drop-shadow-glow-white text-center md:text-left ">Contact me</h2>
        <div className='flex md:h-[50rem] flex-col md:flex-row items-center justify-center'>
        <form
        action={`https://formsubmit.co/${email}`}
        method="POST"
        className='flex flex-col justify-center w-full items-center gap-y-11 h-full md:w-1/2'>
            <Input 
            type='text'
            fieldname={"Name"}
            value={form.name} 
            handleChange={handleChange}
            style=' bg-input/50 w-5/6 rounded-md py-2 pl-5 focus:outline focus:outline-1 focus:outline-white'
            />
            <Input 
            type='email'
            fieldname={"Email"}
            value={form.email} 
            handleChange={handleChange}
            style=' bg-input/75 w-5/6 rounded-md py-2 pl-5 focus:outline focus:outline-1 focus:outline-white'
            />
            <textarea 
            value={form.message} 
            placeholder='Message'
            onChange={(e) => handleChange("message",e.target.value)}
            className=' bg-input w-5/6 rounded-md h-80 py-2 pl-5'
            name='Message'
            />
            <button 
            type='submit'
            name="contact me"
            className="bg-primary w-28 h-9 rounded-md md:w-40 md:h-12 md:rounded-2xl
          hover:bg-white hover:drop-shadow-glow-white hover:text-lg hover:text-black hover:font-bold transition-all
            duration-500 text-[16px] font-extrathin">
                Contact me
            </button>
        </form>
        <div className='w-5/6 md:w-1/2 '>
        <dotlottie-player
        src={ContactLottie}
        autoplay
        loop
        style={{height: "100%",width: "100%" }}
        />
        </div>
        </div>
    </article>
  )
}

export default Contact