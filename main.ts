// VIKINGGAFFEL – første prototype for MakeCode Arcade.
// Lim hele filen inn i JavaScript-editoren. Ingen utvidelser trengs.
// Venstre/høyre: båten. Opp/ned: vikinggaffelen. A: start / spill igjen.

namespace SpriteKind {
    export const Pynt = SpriteKind.create()
    export const Gaffel = SpriteKind.create()
    export const Horn = SpriteKind.create()
    export const Overflateplast = SpriteKind.create()
    export const Mellomplast = SpriteKind.create()
    export const Bunnplast = SpriteKind.create()
    export const Manet = SpriteKind.create()
    export const Synkende = SpriteKind.create()
}

// Disse tallene kan vi justere etter første prøvetur.
const ANTALL_VIKINGER = 5
const POENG_TOPP = 10
const POENG_MIDT = 25
const POENG_BUNN = 50
const MIN_DYBDE = 49
const MAKS_DYBDE = 94
const BAATFART = 52
const GAFFELFART = 43
const PAUSE_ETTER_TREFF = 1500

let startet = false
let ferdig = false
let poeng = 0
let samlet = 0
let vikinger = ANTALL_VIKINGER
let sprukket = false
let baatX = 57
// Gaffelvikingen har egen sideposisjon, også når båten når kanten.
let fiskerX = 87
let dybde = MIN_DYBDE
let forrigeTid = 0
let startTid = 0
let nestePlast = 0
let nesteManet = 0
let tryggTil = 0
let bytterTil = 0
let sluttTid = 0
let melding = ""
let meldingTil = 0
let fisker: Sprite = null
let horn: Sprite = null
let baat: Sprite = null
let storviking: Sprite = null
let armer: Sprite = null
let hud: Sprite = null
let tittel: Sprite = null
let ventende: Sprite[] = []
let hjelmHel: Image = null
let hjelmSprukket: Image = null
let fiskerHel: Image = null
let fiskerSkadet: Image = null
let manetBilder: Image[] = []

function lagHjelm(delt: boolean): Image {
    let bilde = image.create(15, 11)
    bilde.fillRect(4, 3, 7, 6, 13)
    bilde.fillRect(5, 2, 5, 2, 13)
    bilde.fillRect(4, 7, 7, 2, 4)
    bilde.drawLine(7, 3, 7, 6, 1)
    bilde.drawLine(4, 4, 1, 2, 1)
    bilde.drawLine(1, 2, 1, 0, 1)
    bilde.drawLine(10, 4, 13, 2, 1)
    bilde.drawLine(13, 2, 13, 0, 1)
    if (delt) {
        // To synlige halvdeler med en sprekk midt gjennom hjelmen.
        bilde.drawLine(7, 2, 6, 4, 0)
        bilde.drawLine(6, 4, 8, 5, 0)
        bilde.drawLine(8, 5, 7, 8, 0)
        bilde.setPixel(7, 5, 0)
    }
    return bilde
}

function lagLitenViking(farge: number): Image {
    let bilde = image.create(15, 21)
    bilde.fillRect(4, 17, 3, 4, 15)
    bilde.fillRect(8, 17, 3, 4, 15)
    bilde.fillRect(3, 11, 9, 7, farge)
    bilde.fillRect(1, 12, 3, 4, 4)
    bilde.fillRect(11, 12, 3, 4, 4)
    bilde.fillRect(4, 7, 7, 6, 4)
    bilde.fillRect(4, 11, 7, 3, 14)
    bilde.setPixel(5, 9, 15)
    bilde.setPixel(9, 9, 15)
    bilde.drawTransparentImage(hjelmHel, 0, 0)
    return bilde
}

function lagFisker(skade: boolean): Image {
    let bilde = lagLitenViking(7)
    if (skade) {
        bilde.fillRect(0, 0, 15, 9, 0)
        bilde.drawTransparentImage(hjelmSprukket, 0, 0)
    }
    bilde.flipY()
    return bilde
}

function lagStorviking(): Image {
    let bilde = image.create(27, 30)
    // Egen bred, firkantet figur med digre never og rødt skjegg.
    bilde.fillRect(5, 25, 7, 5, 15)
    bilde.fillRect(16, 25, 7, 5, 15)
    bilde.fillRect(3, 14, 21, 12, 2)
    bilde.fillRect(3, 23, 21, 3, 14)
    bilde.fillRect(12, 23, 4, 3, 5)
    bilde.fillRect(1, 14, 5, 9, 4)
    bilde.fillRect(22, 14, 5, 9, 4)
    bilde.fillRect(7, 3, 15, 14, 4)
    bilde.fillRect(6, 1, 16, 5, 14)
    bilde.fillRect(6, 6, 3, 8, 14)
    bilde.fillRect(8, 13, 14, 7, 14)
    bilde.fillRect(10, 18, 10, 3, 14)
    bilde.fillRect(11, 7, 3, 2, 15)
    bilde.fillRect(18, 7, 3, 2, 15)
    bilde.setPixel(12, 9, 15)
    bilde.setPixel(19, 9, 15)
    bilde.fillRect(15, 10, 5, 3, 4)
    bilde.fillRect(14, 14, 6, 2, 1)
    return bilde
}

function lagBaat(): Image {
    let bilde = image.create(90, 25)
    // Langskip, skjold og en moderne grønn ryddekasse.
    bilde.drawLine(2, 8, 13, 21, 14)
    bilde.fillRect(10, 9, 64, 9, 14)
    bilde.fillRect(16, 18, 52, 5, 14)
    bilde.fillRect(12, 10, 61, 3, 4)
    bilde.drawLine(13, 17, 69, 17, 4)
    bilde.drawLine(18, 22, 65, 22, 15)
    bilde.drawLine(70, 19, 82, 6, 14)
    bilde.fillRect(77, 1, 6, 13, 14)
    bilde.fillRect(80, 0, 8, 5, 14)
    bilde.setPixel(85, 1, 5)
    bilde.fillRect(84, 5, 4, 2, 4)
    for (let i = 0; i < 4; i++) {
        bilde.fillCircle(24 + i * 12, 14, 4, 2)
        bilde.drawCircle(24 + i * 12, 14, 4, 4)
        bilde.setPixel(24 + i * 12, 14, 13)
    }
    bilde.fillRect(11, 0, 11, 8, 7)
    bilde.fillRect(10, 0, 13, 2, 6)
    bilde.drawLine(14, 4, 19, 4, 1)
    bilde.setPixel(18, 3, 1)
    bilde.setPixel(15, 5, 1)
    return bilde
}

function lagPlast(type: number): Image {
    let bilde = image.create(13, 13)
    if (type == 0) {
        // Kork.
        bilde.fillRect(2, 5, 9, 5, 2)
        bilde.fillRect(3, 4, 7, 2, 4)
        bilde.drawLine(3, 7, 9, 7, 1)
    } else if (type == 1) {
        // Pose, med åpne håndtak.
        bilde.fillRect(2, 4, 9, 8, 1)
        bilde.drawRect(2, 1, 3, 5, 1)
        bilde.drawRect(8, 1, 3, 5, 1)
        bilde.drawLine(4, 7, 5, 10, 9)
        bilde.drawLine(9, 6, 8, 10, 9)
    } else if (type == 2) {
        // Plastbit som driver under overflaten.
        bilde.fillRect(3, 3, 7, 7, 3)
        bilde.fillRect(1, 5, 9, 3, 3)
        bilde.fillRect(6, 8, 5, 3, 3)
        bilde.drawLine(4, 4, 8, 4, 1)
    } else {
        // Vannfylt PET-flaske uten kork.
        bilde.fillRect(5, 0, 3, 3, 9)
        bilde.fillRect(3, 3, 7, 9, 9)
        bilde.fillRect(4, 6, 5, 3, 7)
        bilde.drawLine(4, 4, 4, 5, 1)
        bilde.drawLine(4, 10, 8, 10, 8)
    }
    return bilde
}

function lagManet(ramme: number): Image {
    let bilde = image.create(17, 19)
    bilde.fillCircle(8, 7, 7, 3)
    bilde.fillRect(1, 7, 15, 4, 3)
    bilde.fillRect(4, 3, 8, 2, 1)
    bilde.setPixel(5, 8, 15)
    bilde.setPixel(11, 8, 15)
    for (let i = 0; i < 4; i++) {
        let x = 3 + i * 3
        let knekk = (i + ramme) % 2 == 0 ? 2 : -1
        bilde.drawLine(x, 11, x + knekk, 15, 3)
        bilde.drawLine(x + knekk, 15, x, 18, 3)
    }
    return bilde
}

function lagBakgrunn() {
    let bilde = image.create(160, 120)
    bilde.fill(9)
    bilde.fillCircle(136, 20, 7, 5)
    // Nordnorske fjell i horisonten.
    for (let i = 0; i < 60; i++) {
        let hoyde = 14 - Math.abs(i - 25) / 2
        if (hoyde > 0) bilde.drawLine(i, 43, i, 43 - hoyde, 6)
    }
    for (let i = 0; i < 53; i++) {
        let hoyde = 18 - Math.abs(i - 24) * 0.7
        if (hoyde > 0) bilde.drawLine(i + 46, 43, i + 46, 43 - hoyde, 8)
    }
    bilde.fillRect(0, 44, 160, 23, 6)
    bilde.fillRect(0, 67, 160, 25, 8)
    bilde.fillRect(0, 92, 160, 28, 12)
    bilde.drawLine(0, 44, 159, 44, 1)
    bilde.fillRect(0, 114, 160, 6, 14)
    bilde.drawLine(0, 114, 159, 114, 4)
    scene.setBackgroundImage(bilde)
}

function si(tekst: string, varighet: number) {
    melding = tekst
    meldingTil = game.runtime() + varighet
}

function lagPynt(bilde: Image, z: number): Sprite {
    let figur = sprites.create(bilde, SpriteKind.Pynt)
    figur.setFlag(SpriteFlag.Ghost, true)
    figur.z = z
    return figur
}

function tegnHud() {
    let bilde = hud.image
    bilde.fill(0)
    bilde.fillRect(0, 0, 160, 13, 15)
    for (let i = 0; i < vikinger; i++) {
        if (sprukket && i == vikinger - 1) {
            bilde.drawTransparentImage(hjelmSprukket, 2 + i * 16, 1)
        } else {
            bilde.drawTransparentImage(hjelmHel, 2 + i * 16, 1)
        }
    }
    bilde.print("P " + poeng, 91, 3, 1)
    // Poengnøkler i vannet, plassert unna båten.
    bilde.print("10", 2, 57, 9)
    bilde.print("25", 2, 79, 9)
    bilde.print("50", 2, 102, 9)
    if (game.runtime() < meldingTil) {
        let bredde = melding.length * 6 + 6
        let x = Math.max(0, (160 - bredde) / 2)
        bilde.fillRect(x, 14, bredde, 10, 15)
        bilde.print(melding, x + 3, 15, 1)
    }
}

function oppdaterBaat() {
    let tid = game.runtime()
    let dupp = Math.sin(tid / 380)
    baat.setPosition(baatX, 40 + dupp)
    storviking.setPosition(baatX + 5, 29 + dupp)
    for (let i = 0; i < ventende.length; i++) {
        let vis = i < vikinger - 1
        // Den neste vikingen løftes mot hendene under byttet.
        let bytter = tid < bytterTil && i == vikinger - 1
        ventende[i].setFlag(SpriteFlag.Invisible, !vis && !bytter)
        let x = baatX - 28 + i * 9
        let y = 30 + dupp
        if (bytter) {
            let andel = 1 - (bytterTil - tid) / 1100
            x = x + (fiskerX - x) * andel
            y = y + (MIN_DYBDE - 8 - y) * andel
        }
        ventende[i].setPosition(x, y)
    }
    let bytter = tid < bytterTil || ferdig
    fisker.setFlag(SpriteFlag.Invisible, bytter || (tid < tryggTil && Math.idiv(tid, 110) % 2 == 0))
    fisker.setPosition(fiskerX, dybde)
    horn.setPosition(fisker.x, fisker.y + 9)
    let bilde = armer.image
    bilde.fill(0)
    if (!ferdig) {
        let handY = bytter ? MIN_DYBDE - 10 : fisker.y - 9
        // To overdrevent lange armer, med grep rundt anklene.
        for (let i = 0; i < 4; i++) {
            bilde.drawLine(baatX + 13 + i, 29 + dupp, fiskerX - 3 + i, handY, 4)
            bilde.drawLine(baatX + 18 + i, 31 + dupp, fiskerX + 3 + i, handY, 4)
        }
        bilde.fillRect(fiskerX - 5, handY - 2, 7, 5, 4)
        bilde.fillRect(fiskerX + 1, handY - 2, 7, 5, 4)
    }
}

function plastInn() {
    let nivaa = randint(0, 2)
    let figur: Sprite = null
    if (nivaa == 0) {
        figur = sprites.create(lagPlast(randint(0, 1)), SpriteKind.Overflateplast)
        figur.y = randint(56, 61)
    } else if (nivaa == 1) {
        figur = sprites.create(lagPlast(2), SpriteKind.Mellomplast)
        figur.y = randint(77, 84)
    } else {
        figur = sprites.create(lagPlast(3), SpriteKind.Bunnplast)
        figur.y = randint(101, 106)
    }
    // Litt innenfor skjermkanten, ellers fjerner AutoDestroy den straks.
    figur.x = 164
    figur.vx = -(24 + Math.min(18, (game.runtime() - startTid) / 7000))
    figur.z = 6
    figur.setFlag(SpriteFlag.AutoDestroy, true)
}

function manetInn() {
    let figur = sprites.create(manetBilder[0], SpriteKind.Manet)
    figur.setPosition(166, randint(58, 99))
    figur.vx = -(28 + Math.min(18, (game.runtime() - startTid) / 9000))
    figur.z = 7
    figur.setFlag(SpriteFlag.AutoDestroy, true)
}

function plukk(plast: Sprite, verdi: number) {
    if (!startet || ferdig || game.runtime() < bytterTil) return
    poeng += verdi
    samlet += 1
    let tekst = image.create(23, 9)
    tekst.print("+" + verdi, 0, 0, 5)
    let popup = lagPynt(tekst, 50)
    popup.setPosition(plast.x, plast.y)
    popup.vy = -16
    popup.lifespan = 650
    plast.destroy()
    if (samlet % 8 == 0) {
        let vitser = ["Dagens fangst: pose!", "Pant, ikke torsk!", "For en korka fangst!", "Valhall kan vente!"]
        si(vitser[randint(0, vitser.length - 1)], 1700)
    }
}

function manetTreff(maneten: Sprite) {
    let tid = game.runtime()
    if (!startet || ferdig || tid < tryggTil || tid < bytterTil) return
    tryggTil = tid + PAUSE_ETTER_TREFF
    maneten.destroy()
    scene.cameraShake(2, 180)
    if (!sprukket) {
        sprukket = true
        fisker.setImage(fiskerSkadet)
        si("AU! Hjelmen sprakk!", 1300)
    } else {
        // Ett individ tåler to treff. Storvikingen teller ikke som et liv.
        vikinger -= 1
        sprukket = false
        let synker = sprites.create(fiskerSkadet.clone(), SpriteKind.Synkende)
        synker.setPosition(fisker.x, fisker.y)
        synker.vy = 24
        synker.vx = -8
        synker.z = 5
        synker.setFlag(SpriteFlag.Ghost, true)
        synker.lifespan = 5200
        bytterTil = tid + 1100
        fisker.setImage(fiskerHel)
        dybde = MIN_DYBDE
        if (vikinger == 0) {
            ferdig = true
            sluttTid = tid + 2200
            si("Tomt for gaffelvikinger!", 2200)
        } else {
            si("Nestemann! Hold pusten!", 1500)
            // Ny viking får tid til å komme på plass før han kan bli truffet.
            tryggTil = bytterTil + PAUSE_ETTER_TREFF
        }
    }
}

function visSlutt() {
    let bilde = tittel.image
    bilde.fill(0)
    bilde.fillRect(7, 27, 146, 72, 15)
    bilde.drawRect(7, 27, 146, 72, 4)
    bilde.print("TOMT FOR VIKINGER!", 26, 34, 5)
    bilde.print("Havet fikk hjelp:", 29, 49, 1)
    bilde.print(samlet + " plastbiter", 40, 61, 9)
    bilde.print(poeng + " poeng", 49, 73, 5)
    bilde.print("A: ny rydderunde", 34, 87, 1)
    tittel.setFlag(SpriteFlag.Invisible, false)
}

function startSpill() {
    startet = true
    tittel.setFlag(SpriteFlag.Invisible, true)
    startTid = game.runtime()
    forrigeTid = startTid
    nestePlast = startTid + 350
    nesteManet = startTid + 3500
    tryggTil = startTid + 1800
    si("Fisk plast. Ikke maneter!", 2300)
}

hjelmHel = lagHjelm(false)
hjelmSprukket = lagHjelm(true)
fiskerHel = lagFisker(false)
fiskerSkadet = lagFisker(true)
manetBilder = [lagManet(0), lagManet(1)]
lagBakgrunn()
baat = lagPynt(lagBaat(), 30)
storviking = lagPynt(lagStorviking(), 20)
armer = lagPynt(image.create(160, 120), 24)
armer.setPosition(80, 60)
for (let i = 0; i < ANTALL_VIKINGER - 1; i++) {
    ventende.push(lagPynt(lagLitenViking(i % 2 == 0 ? 8 : 7), 15))
}
fisker = sprites.create(fiskerHel, SpriteKind.Gaffel)
fisker.z = 25
horn = sprites.create(image.create(11, 4), SpriteKind.Horn)
horn.image.fill(1)
horn.setFlag(SpriteFlag.Invisible, true)
hud = lagPynt(image.create(160, 120), 90)
hud.setPosition(80, 60)
tittel = lagPynt(image.create(160, 120), 100)
tittel.setPosition(80, 60)
tittel.image.fillRect(5, 49, 150, 63, 15)
tittel.image.drawRect(5, 49, 150, 63, 4)
tittel.image.print("VIKINGGAFFEL", 44, 53, 5)
tittel.image.print("Vi fisker fremtiden!", 23, 66, 1)
tittel.image.print("Venstre/hoyre: baat", 22, 78, 9)
tittel.image.print("Opp/ned: viking", 35, 89, 9)
tittel.image.print("A: start", 56, 101, 5)

controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
    if (!startet) startSpill()
    else if (ferdig && game.runtime() >= sluttTid) game.reset()
})

sprites.onOverlap(SpriteKind.Horn, SpriteKind.Overflateplast, function (treff, plast) {
    plukk(plast, POENG_TOPP)
})
sprites.onOverlap(SpriteKind.Horn, SpriteKind.Mellomplast, function (treff, plast) {
    plukk(plast, POENG_MIDT)
})
sprites.onOverlap(SpriteKind.Horn, SpriteKind.Bunnplast, function (treff, plast) {
    plukk(plast, POENG_BUNN)
})
sprites.onOverlap(SpriteKind.Gaffel, SpriteKind.Manet, function (viking, maneten) {
    manetTreff(maneten)
})

game.onUpdate(function () {
    let tid = game.runtime()
    let dt = Math.min(0.05, Math.max(0, (tid - forrigeTid) / 1000))
    forrigeTid = tid
    if (startet && !ferdig) {
        if (controller.left.isPressed()) {
            baatX -= BAATFART * dt
            fiskerX -= BAATFART * dt
        }
        if (controller.right.isPressed()) {
            baatX += BAATFART * dt
            fiskerX += BAATFART * dt
        }
        baatX = Math.constrain(baatX, 43, 110)
        fiskerX = Math.constrain(fiskerX, 12, 148)
        if (tid >= bytterTil) {
            if (controller.up.isPressed()) dybde -= GAFFELFART * dt
            if (controller.down.isPressed()) dybde += GAFFELFART * dt
            dybde = Math.constrain(dybde, MIN_DYBDE, MAKS_DYBDE)
        }
        if (tid >= nestePlast) {
            plastInn()
            nestePlast = tid + randint(850, 1250)
        }
        if (tid >= nesteManet) {
            manetInn()
            nesteManet = tid + Math.max(1200, 2900 - (tid - startTid) / 90)
        }
    }
    for (let synker of sprites.allOfKind(SpriteKind.Synkende)) {
        if (synker.y >= 104) {
            synker.y = 104
            synker.vy = 0
            synker.vx = -10
        }
    }
    for (let maneten of sprites.allOfKind(SpriteKind.Manet)) {
        maneten.setImage(manetBilder[Math.idiv(tid, 220) % 2])
        maneten.vy = Math.sin(tid / 450 + maneten.x / 30) * 7
        maneten.y = Math.constrain(maneten.y, 55, 103)
    }
    oppdaterBaat()
    tegnHud()
    if (ferdig && tid >= sluttTid) visSlutt()
})

// Sjøskum, bobler og bunn som hele tiden driver mot venstre.
game.onPaint(function () {
    let tid = game.runtime()
    let skum = Math.idiv(tid, 70) % 27
    for (let i = 0; i < 7; i++) {
        let x = i * 27 - skum
        screen.drawLine(x, 46, x + 8, 46, 9)
    }
    let bunn = Math.idiv(tid, 95) % 35
    for (let i = 0; i < 6; i++) {
        let x = i * 35 - bunn
        screen.drawLine(x, 113, x + 2, 106, 7)
        screen.drawLine(x + 2, 106, x + 5, 110, 7)
        screen.setPixel(x + 14, 117, 4)
    }
    for (let i = 0; i < 6; i++) {
        let x = (195 + i * 29 - Math.idiv(tid, 100) % 195) % 195 - 12
        let y = 102 - (Math.idiv(tid, 100) + i * 17) % 45
        screen.drawCircle(x, y, 1, 6)
    }
})

oppdaterBaat()
tegnHud()

