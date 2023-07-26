type InputProps = {
    type: string,
    fieldname: string,
    value: string,
    handleChange:  (fieldname: string, value: string) => void,
    style: string
}
const Input = ({type, fieldname, value, handleChange, style}: InputProps ) => {

  return (
    <>    
        <input 
        type={type} 
        value={value} 
        placeholder={fieldname}
        onChange={(e)=>handleChange(fieldname.toLowerCase(),e.target.value)}
        className={style}
        name={fieldname}
         required
         />
    </>

  )
}

export default Input