import { db } from '/connectors/firebase';
import { ref, update } from "firebase/database";

const rtdb = ref(db);

const saveData = async (req, res) => {
    const obj = req.body;
    update(rtdb, {[`lossCalc`]: obj})
    res.status(200).json(obj);
}

export default saveData;