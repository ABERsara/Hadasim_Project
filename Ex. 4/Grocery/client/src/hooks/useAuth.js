import {useSelector} from "react-redux"
import { selectedToken } from "../app/auth/authSlice"
import { jwtDecode } from "jwt-decode";
const useAuth = ()=>{
    const token  = useSelector(selectedToken)
    // let isAdmin = false
    // let isUser = false
    if(token){
        const supDecoded = jwtDecode(token)
        const {_id,phoneNumber,companyName,status} = supDecoded
        console.log(`id: ${_id} ,phonenumber: ${phoneNumber}, company name ${companyName}`)
        // isAdmin = permission ==="Admin"
        // isUser = permission ==="User"
        return {_id,phoneNumber,companyName,status}

    }

    return {_id:"",phoneNumber:"",companyName:"",status:""}


}
export default useAuth