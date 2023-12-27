import { db } from '/connectors/firebase';
import { ref, get, child } from "firebase/database";
const rtdb = ref(db);


export default async function handler(req, res) {
    const reference = child(rtdb,'/');
    const snapshot = await get(reference);
    if (!snapshot.exists()) {
        console.error('No database found!')
        res.status(500).json({ error: 'error fetching db table' })
    } else {
        const d = snapshot.val();
        res.status(200).json(d.lossCalc)
    }
}