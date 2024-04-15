import { createGun } from "./gun"
import { createTank, fight } from "./tanks"

const kwk36 = createGun("88mm KwK 36", 150.0, 90.0)
const f32 = createGun("76mm F-32", 70.0, 60.0)
const kwk40short = createGun("75mm kwk 37", 35.5, 55.5)
const kwk40Long = createGun("75mm KwK 40", 99.5, 55.5)
const m1a1 = createGun("76mm M1A1", 99.0, 60.0)
const tiger = createTank("Pz.Kpfw. VI Tiger Ausf. E", kwk36, 340.0, 800.0)
const t34 = createTank("T-34/76", f32, 200.0, 400.0)
const p4f = createTank("Pz.Kpfw. IV", kwk40short, 130.0, 350.0)
const p4g = createTank("Pz.Kpfw. IV", kwk40Long, 130.0, 350.0)
const shermanE8 = createTank("M4A3 Sherman E8", m1a1, 220.0, 450.0)

fight(p4g)(t34)