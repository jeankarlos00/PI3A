export default interface Email{
    sendResetPasswordEmail(name: string,  email: string, token: string): Promise<boolean>
}