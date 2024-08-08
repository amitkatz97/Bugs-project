import { authService } from "./auth.service.js"
import { loggerService } from "../../services/logger.service.js"
import { error } from "pdf-lib"



export async function login(req, res){
    const {username , password} = req.body

    try {
        const user = await authService.login(username, password)
        // create the token
        const loginToken = authService.getLoginToken(user)
        loggerService.info('user login:', user)
        
        //send the tokem to the clinet
        res.cookie('loginToken', loginToken, { sameSite: 'None', secure: true })
        res.json(user)
    } catch (err) {
        loggerService.error("Failed to login", err)
        res.status(401).send({ err: 'Failed to Login' })
    }

}

export async function signup(req, res){
    const credentials = req.body
    try {
        const newUser = await authService.signup(credentials)

        const loginToken = authService.getLoginToken(newUser)
        loggerService.info(' new user login:', newUser)

        res.cookie('loginToken', loginToken, { sameSite: 'None', secure: true })
        res.json(newUser)
    } catch (err) {
        loggerService.error("Faild in siging up:", err)
        res.status(401).send({err: "Failed to sign up"})
    }
}

export async function logout(req, res){
    try {
        res.clearCookie('loginToken')
        res.status(200).send("logout Succefully")
    } catch (error) {
        res.status(401).send("Cant logout", error)
    }
 
}