import bcrypt from "bcrypt";

const salt = await bcrypt.genSalt(12);
const passwordHash = await bcrypt.hash("123456", salt);

console.log(passwordHash)