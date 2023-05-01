import bcrypt from 'bcrypt';

export const generatHash = ({ plaintext, saltRound =Number(process.env.saltRound ) } = {}) => {

    const hashing = bcrypt.hashSync(plaintext, saltRound)
    return hashing;
}
export const compareHash = ({ plaintext, encrypted } = {}) => {

    const compare = bcrypt.compareSync(plaintext,encrypted)
    return compare;
}