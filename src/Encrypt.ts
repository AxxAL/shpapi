import { genSalt, hash, compare } from "bcrypt";

export async function hashPass(password: string, saltRounds: number = 10) {
    const salt = await genSalt(saltRounds)
        .catch(error => { throw error; });

    return await hash(password, salt)
        .catch(error => { throw error; });
}

export async function comparePass(password: string, hash: string) {
    return await compare(password, hash)
        .catch(error => { throw error; });
}