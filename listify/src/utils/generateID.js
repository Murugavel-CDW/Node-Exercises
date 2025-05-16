import ShortUniqueId from "short-unique-id";

const uid = new ShortUniqueId({ length: 10 });

const generateUniqueID = () => {
    return uid.rnd();
}

export default generateUniqueID;