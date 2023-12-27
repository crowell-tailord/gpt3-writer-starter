import { db } from '/connectors/firebase';
import { ref, update } from "firebase/database";

const rtdb = ref(db);

const saveData = async (req, res) => {
    const obj = req.body;
    const updates = {
        [`lossCalc/items`]: obj
    }

    if(obj.length) {
        updates[`lossCalc/hasItems`] = true
    } else {
        updates[`lossCalc/hasItems`] = false    
    }
    
    update(rtdb, updates)

    res.status(200).json(obj);
}

export default saveData;