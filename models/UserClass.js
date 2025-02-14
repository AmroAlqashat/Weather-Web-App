export default class UserClass{

    #email;
    #hashedPassword;

    constructor(email,hashedPassword){
        this.#email = email;
        this.#hashedPassword = hashedPassword;
    }

    getEmail() {
        return this.#email;
    }
    getHashedPassword() {
        return this.#hashedPassword;
    }
    setEmail(email) {
        this.#email = email;
    }
    setHashedPassword(hashedPassword) {
        this.#hashedPassword = hashedPassword;
    }
}