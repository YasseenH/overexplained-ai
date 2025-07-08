import { Request, Response } from 'express';
import { isEmailValid } from '../../utils/email';

interface SignupBody {
    email?: string;
}

export const newsletterSignupHandler = () => (req: Request, res: Response) => {
    try {
        const {email = ""} = req.body as SignupBody;

        if (!email) {
            throw new Error("Email is required");
        }
        if (!isEmailValid(email)) {
            throw new Error("Email is invalid");
        }

        // IMPLETMENT SIGNUP LOGIC HERE
        
        return res.status(200).json({message: "Signed up successfully"});
    } catch (error) {
        throw new Error();
    }
}