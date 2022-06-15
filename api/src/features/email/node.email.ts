import Email from "./interfaces/email.interface";
import * as nodemailer from "nodemailer";
import HttpException from "../../exceptions/http.exceptions";
import validateEnv from "../../utils/validateEnv";

export default class NodeMail implements Email{
    private _email: string;
    private _transporter: nodemailer.Transporter;

    constructor(){
        this._email = validateEnv.EMAIL_USER;
        this.initialize();
    }
    private initialize(){
        try {
            this._transporter = nodemailer.createTransport({
                host: validateEnv.EMAIL_HOST,
                port: validateEnv.EMAIL_PORT,
                secure: true,
                auth: {
                    user: validateEnv.EMAIL_USER,
                    pass: validateEnv.EMAIL_PASS
                },
                requireTLS: true,
            });
        } catch (error) {
            if (error instanceof HttpException){
                throw new HttpException(404, "Send Mail Error: " + error.message);
            } else{
                throw error;
            }
        }
    }
    async sendResetPasswordEmail(name: string,  email: string, token: string): Promise<boolean>{
        try {
            const info = await this._transporter.sendMail({
                from: `Intelligent Garden Co.<${this._email}>`,
                to: email,
                subject: `${name}, your password reset is ready ✔`,
                html: this.resetEmailTemplate(name,token),
              });    

            if (info) {
                return true;
            } else{
                return false;
            }

        } catch (error) {
            if (error instanceof HttpException){
                throw new HttpException(404, "Send Mail Error: " + error.message);
            } else{
                throw error;
            }
        }          
    }

    private resetEmailTemplate(name: string,token: string): string{
        return (
            `
            <!doctype html>
            <html lang="en-US">
            
            <head>
                <meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
                <title>Redefine Your Password</title>
                <meta name="description" content="Redefine Your Password.">
                <style type="text/css">
                    a:hover {text-decoration: underline !important;}
                </style>
            </head>
            
            <body marginheight="0" topmargin="0" marginwidth="0" style="margin: 0px; background-color: #f2f3f8;" leftmargin="0">
                <!--100% body table-->
                <table cellspacing="0" border="0" cellpadding="0" width="100%" bgcolor="#f2f3f8"
                    style="@import url(https://fonts.googleapis.com/css?family=Rubik:300,400,500,700|Open+Sans:300,400,600,700); font-family: 'Open Sans', sans-serif;">
                    <tr>
                        <td>
                            <table style="background-color: #f2f3f8; max-width:670px;  margin:0 auto;" width="100%" border="0"
                                align="center" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td style="height:80px;">&nbsp;</td>
                                </tr>
                                <tr>
                                    <td style="height:20px;">&nbsp;</td>
                                </tr>
                                <tr>
                                    <td>
                                        <table width="95%" border="0" align="center" cellpadding="0" cellspacing="0"
                                            style="max-width:670px;background:#fff; border-radius:3px; text-align:center;-webkit-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);-moz-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);box-shadow:0 6px 18px 0 rgba(0,0,0,.06);">
                                            <tr>
                                                <td style="height:40px;">&nbsp;</td>
                                            </tr>
                                            <tr>
                                                <td style="padding:0 35px;">
                                                    <h1 style="color:#1e1e2d; font-weight:500; margin:0;font-size:32px;font-family:'Rubik',sans-serif;"> ${name}, you have requested to reset your password</h1>
                                                    <span
                                                        style="display:inline-block; vertical-align:middle; margin:29px 0 26px; border-bottom:1px solid #cecece; width:100px;"></span>
                                                    <p style="color:#455056; font-size:15px;line-height:24px; margin:0;">
                                                        We cannot simply send you your old password. A unique link to reset your
                                                        password has been generated for you. To reset your password, click the
                                                        following link and follow the instructions.
                                                    </p>
                                                    <a href="https://api-pdm-pia3.herokuapp.com/api/v1/auth/reset-password/${token}"
                                                        style="background:#20e277;text-decoration:none !important; font-weight:500; margin-top:35px; color:#fff;text-transform:uppercase; font-size:14px;padding:10px 24px;display:inline-block;border-radius:50px;">Reset Password</a>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="height:40px;">&nbsp;</td>
                                            </tr>
                                        </table>
                                    </td>
                                <tr>
                                    <td style="height:20px;">&nbsp;</td>
                                </tr>
                                <tr>
                                    <td style="text-align:center;">
                                        <p style="font-size:14px; color:rgba(69, 80, 86, 0.7411764705882353); line-height:18px; margin:0 0 0;">&copy; <strong>www.api-pdm-pia3.herokuapp.com/</strong></p>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="height:80px;">&nbsp;</td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
                <!--/100% body table-->
            </body>
            
            </html>`
        )
    }
}
