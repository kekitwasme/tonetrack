const Welcome = () => {
    return (
        <div className="block text-center">
            This is the home page
            <br />
            Say something nice to new users
        </div>
    )
}
import SignInForm from "@components/signInForm"
export default () => {
    return (
        <div>
            <Welcome />
            <SignInForm />
        </div>
    )
}
