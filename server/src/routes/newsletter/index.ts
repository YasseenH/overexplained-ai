import express from 'express';
import { newsletterSignupHandler } from './signup';

export const createNewsletterRouter = () => {
    const newsletterRouter = express.Router();

    newsletterRouter.post('/newsletter/signup', newsletterSignupHandler());

    return newsletterRouter;
}