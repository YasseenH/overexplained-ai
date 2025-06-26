export const SignupPage = () => {
    return (
        <div>
            <h1>Newsletter Signup</h1>
            <form>
                <label htmlFor="email">Email:</label>
                <input type="email" id="email" name="email" required />
                <button type="submit">Sign Up</button>
            </form>
        </div>
    );
};

export default SignupPage;