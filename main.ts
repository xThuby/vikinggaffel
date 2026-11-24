// VIKINGGAFFEL for MakeCode Arcade.
// Left/right: the boat. Up/down: the viking fork. A: start / play again.

// ---- Sprite kinds ----

namespace SpriteKind {
    export const Decoration = SpriteKind.create()
    export const Fork = SpriteKind.create()
    export const Horns = SpriteKind.create()
    export const SurfacePlastic = SpriteKind.create()
    export const MidwaterPlastic = SpriteKind.create()
    export const SeabedPlastic = SpriteKind.create()
    export const Jellyfish = SpriteKind.create()
    export const Sinking = SpriteKind.create()
}

// ---- Constants ----

// Tuning values.
const VIKING_COUNT = 5
const POINTS_SURFACE = 10
const POINTS_MIDWATER = 25
const POINTS_SEABED = 50
const MIN_DEPTH = 49
const MAX_DEPTH = 94
const BOAT_SPEED = 52
const FORK_SPEED = 43
const SAFE_TIME_AFTER_HIT = 1500

// ---- State ----

let started = false
let finished = false
let score = 0
let collected = 0
let vikingsLeft = VIKING_COUNT
let cracked = false
let boatX = 57
// The fork viking has its own horizontal position, also when the boat reaches the edge.
let fisherX = 87
let depth = MIN_DEPTH
let previousTime = 0
let startTime = 0
let nextPlasticTime = 0
let nextJellyfishTime = 0
let safeUntil = 0
let swappingUntil = 0
let endTime = 0
let message = ""
let messageUntil = 0
let fisher: Sprite = null
let horns: Sprite = null
let boat: Sprite = null
let bigViking: Sprite = null
let arms: Sprite = null
let hud: Sprite = null
let titlePanel: Sprite = null
let waitingVikings: Sprite[] = []
let intactHelmet: Image = null
let crackedHelmet: Image = null
let intactFisher: Image = null
let damagedFisher: Image = null
let jellyfishImages: Image[] = []

// ---- Art ----

function makeHelmet(split: boolean): Image {
    let picture = image.create(15, 11)
    picture.fillRect(4, 3, 7, 6, 13)
    picture.fillRect(5, 2, 5, 2, 13)
    picture.fillRect(4, 7, 7, 2, 4)
    picture.drawLine(7, 3, 7, 6, 1)
    picture.drawLine(4, 4, 1, 2, 1)
    picture.drawLine(1, 2, 1, 0, 1)
    picture.drawLine(10, 4, 13, 2, 1)
    picture.drawLine(13, 2, 13, 0, 1)
    if (split) {
        // Two visible halves with a crack through the middle of the helmet.
        picture.drawLine(7, 2, 6, 4, 0)
        picture.drawLine(6, 4, 8, 5, 0)
        picture.drawLine(8, 5, 7, 8, 0)
        picture.setPixel(7, 5, 0)
    }
    return picture
}

function makeSmallViking(color: number): Image {
    let picture = image.create(15, 21)
    picture.fillRect(4, 17, 3, 4, 15)
    picture.fillRect(8, 17, 3, 4, 15)
    picture.fillRect(3, 11, 9, 7, color)
    picture.fillRect(1, 12, 3, 4, 4)
    picture.fillRect(11, 12, 3, 4, 4)
    picture.fillRect(4, 7, 7, 6, 4)
    picture.fillRect(4, 11, 7, 3, 14)
    picture.setPixel(5, 9, 15)
    picture.setPixel(9, 9, 15)
    picture.drawTransparentImage(intactHelmet, 0, 0)
    return picture
}

function makeFisher(damaged: boolean): Image {
    let picture = makeSmallViking(7)
    if (damaged) {
        picture.fillRect(0, 0, 15, 9, 0)
        picture.drawTransparentImage(crackedHelmet, 0, 0)
    }
    picture.flipY()
    return picture
}

function makeBigViking(): Image {
    let picture = image.create(27, 30)
    // A wide, square figure with huge fists and a red beard.
    picture.fillRect(5, 25, 7, 5, 15)
    picture.fillRect(16, 25, 7, 5, 15)
    picture.fillRect(3, 14, 21, 12, 2)
    picture.fillRect(3, 23, 21, 3, 14)
    picture.fillRect(12, 23, 4, 3, 5)
    picture.fillRect(1, 14, 5, 9, 4)
    picture.fillRect(22, 14, 5, 9, 4)
    picture.fillRect(7, 3, 15, 14, 4)
    picture.fillRect(6, 1, 16, 5, 14)
    picture.fillRect(6, 6, 3, 8, 14)
    picture.fillRect(8, 13, 14, 7, 14)
    picture.fillRect(10, 18, 10, 3, 14)
    picture.fillRect(11, 7, 3, 2, 15)
    picture.fillRect(18, 7, 3, 2, 15)
    picture.setPixel(12, 9, 15)
    picture.setPixel(19, 9, 15)
    picture.fillRect(15, 10, 5, 3, 4)
    picture.fillRect(14, 14, 6, 2, 1)
    return picture
}

function makeBoat(): Image {
    let picture = image.create(90, 25)
    // Longship, shields and a modern green litter bin.
    picture.drawLine(2, 8, 13, 21, 14)
    picture.fillRect(10, 9, 64, 9, 14)
    picture.fillRect(16, 18, 52, 5, 14)
    picture.fillRect(12, 10, 61, 3, 4)
    picture.drawLine(13, 17, 69, 17, 4)
    picture.drawLine(18, 22, 65, 22, 15)
    picture.drawLine(70, 19, 82, 6, 14)
    picture.fillRect(77, 1, 6, 13, 14)
    picture.fillRect(80, 0, 8, 5, 14)
    picture.setPixel(85, 1, 5)
    picture.fillRect(84, 5, 4, 2, 4)
    for (let i = 0; i < 4; i++) {
        picture.fillCircle(24 + i * 12, 14, 4, 2)
        picture.drawCircle(24 + i * 12, 14, 4, 4)
        picture.setPixel(24 + i * 12, 14, 13)
    }
    picture.fillRect(11, 0, 11, 8, 7)
    picture.fillRect(10, 0, 13, 2, 6)
    picture.drawLine(14, 4, 19, 4, 1)
    picture.setPixel(18, 3, 1)
    picture.setPixel(15, 5, 1)
    return picture
}

function makePlastic(type: number): Image {
    let picture = image.create(13, 13)
    if (type == 0) {
        // Bottle cap.
        picture.fillRect(2, 5, 9, 5, 2)
        picture.fillRect(3, 4, 7, 2, 4)
        picture.drawLine(3, 7, 9, 7, 1)
    } else if (type == 1) {
        // Bag with open handles.
        picture.fillRect(2, 4, 9, 8, 1)
        picture.drawRect(2, 1, 3, 5, 1)
        picture.drawRect(8, 1, 3, 5, 1)
        picture.drawLine(4, 7, 5, 10, 9)
        picture.drawLine(9, 6, 8, 10, 9)
    } else if (type == 2) {
        // Piece of plastic drifting below the surface.
        picture.fillRect(3, 3, 7, 7, 3)
        picture.fillRect(1, 5, 9, 3, 3)
        picture.fillRect(6, 8, 5, 3, 3)
        picture.drawLine(4, 4, 8, 4, 1)
    } else {
        // Water-filled PET bottle without a cap.
        picture.fillRect(5, 0, 3, 3, 9)
        picture.fillRect(3, 3, 7, 9, 9)
        picture.fillRect(4, 6, 5, 3, 7)
        picture.drawLine(4, 4, 4, 5, 1)
        picture.drawLine(4, 10, 8, 10, 8)
    }
    return picture
}

function makeJellyfish(frame: number): Image {
    let picture = image.create(17, 19)
    picture.fillCircle(8, 7, 7, 3)
    picture.fillRect(1, 7, 15, 4, 3)
    picture.fillRect(4, 3, 8, 2, 1)
    picture.setPixel(5, 8, 15)
    picture.setPixel(11, 8, 15)
    for (let i = 0; i < 4; i++) {
        let x = 3 + i * 3
        let bend = (i + frame) % 2 == 0 ? 2 : -1
        picture.drawLine(x, 11, x + bend, 15, 3)
        picture.drawLine(x + bend, 15, x, 18, 3)
    }
    return picture
}

function makeBackground() {
    let picture = image.create(160, 120)
    picture.fill(9)
    picture.fillCircle(136, 20, 7, 5)
    // Northern Norwegian mountains on the horizon.
    for (let i = 0; i < 60; i++) {
        let height = 14 - Math.abs(i - 25) / 2
        if (height > 0) picture.drawLine(i, 43, i, 43 - height, 6)
    }
    for (let i = 0; i < 53; i++) {
        let height = 18 - Math.abs(i - 24) * 0.7
        if (height > 0) picture.drawLine(i + 46, 43, i + 46, 43 - height, 8)
    }
    picture.fillRect(0, 44, 160, 23, 6)
    picture.fillRect(0, 67, 160, 25, 8)
    picture.fillRect(0, 92, 160, 28, 12)
    picture.drawLine(0, 44, 159, 44, 1)
    picture.fillRect(0, 114, 160, 6, 14)
    picture.drawLine(0, 114, 159, 114, 4)
    scene.setBackgroundImage(picture)
}

// ---- Messages and HUD ----

function say(text: string, duration: number) {
    message = text
    messageUntil = game.runtime() + duration
}

function makeDecoration(picture: Image, z: number): Sprite {
    let sprite = sprites.create(picture, SpriteKind.Decoration)
    sprite.setFlag(SpriteFlag.Ghost, true)
    sprite.z = z
    return sprite
}

function drawHud() {
    let picture = hud.image
    picture.fill(0)
    picture.fillRect(0, 0, 160, 13, 15)
    for (let i = 0; i < vikingsLeft; i++) {
        if (cracked && i == vikingsLeft - 1) {
            picture.drawTransparentImage(crackedHelmet, 2 + i * 16, 1)
        } else {
            picture.drawTransparentImage(intactHelmet, 2 + i * 16, 1)
        }
    }
    picture.print("P " + score, 91, 3, 1)
    // Point values in the water, placed clear of the boat.
    picture.print("10", 2, 57, 9)
    picture.print("25", 2, 79, 9)
    picture.print("50", 2, 102, 9)
    if (game.runtime() < messageUntil) {
        let width = message.length * 6 + 6
        let x = Math.max(0, (160 - width) / 2)
        picture.fillRect(x, 14, width, 10, 15)
        picture.print(message, x + 3, 15, 1)
    }
}

// ---- Boat and vikings ----

function updateBoat() {
    let now = game.runtime()
    let bob = Math.sin(now / 380)
    boat.setPosition(boatX, 40 + bob)
    bigViking.setPosition(boatX + 5, 29 + bob)
    for (let i = 0; i < waitingVikings.length; i++) {
        let isWaiting = i < vikingsLeft - 1
        // The next viking is lifted towards the hands during the swap.
        let swapping = now < swappingUntil && i == vikingsLeft - 1
        waitingVikings[i].setFlag(SpriteFlag.Invisible, !isWaiting && !swapping)
        let x = boatX - 28 + i * 9
        let y = 30 + bob
        if (swapping) {
            let progress = 1 - (swappingUntil - now) / 1100
            x = x + (fisherX - x) * progress
            y = y + (MIN_DEPTH - 8 - y) * progress
        }
        waitingVikings[i].setPosition(x, y)
    }
    let swapping = now < swappingUntil || finished
    fisher.setFlag(SpriteFlag.Invisible, swapping || (now < safeUntil && Math.idiv(now, 110) % 2 == 0))
    fisher.setPosition(fisherX, depth)
    horns.setPosition(fisher.x, fisher.y + 9)
    let picture = arms.image
    picture.fill(0)
    if (!finished) {
        let handsY = swapping ? MIN_DEPTH - 10 : fisher.y - 9
        // Two absurdly long arms, gripping the ankles.
        for (let i = 0; i < 4; i++) {
            picture.drawLine(boatX + 13 + i, 29 + bob, fisherX - 3 + i, handsY, 4)
            picture.drawLine(boatX + 18 + i, 31 + bob, fisherX + 3 + i, handsY, 4)
        }
        picture.fillRect(fisherX - 5, handsY - 2, 7, 5, 4)
        picture.fillRect(fisherX + 1, handsY - 2, 7, 5, 4)
    }
}

// ---- Spawning ----

function spawnPlastic() {
    let tier = randint(0, 2)
    let sprite: Sprite = null
    if (tier == 0) {
        sprite = sprites.create(makePlastic(randint(0, 1)), SpriteKind.SurfacePlastic)
        sprite.y = randint(56, 61)
    } else if (tier == 1) {
        sprite = sprites.create(makePlastic(2), SpriteKind.MidwaterPlastic)
        sprite.y = randint(77, 84)
    } else {
        sprite = sprites.create(makePlastic(3), SpriteKind.SeabedPlastic)
        sprite.y = randint(101, 106)
    }
    // Slightly inside the screen edge, otherwise AutoDestroy removes it at once.
    sprite.x = 164
    sprite.vx = -(24 + Math.min(18, (game.runtime() - startTime) / 7000))
    sprite.z = 6
    sprite.setFlag(SpriteFlag.AutoDestroy, true)
}

function spawnJellyfish() {
    let sprite = sprites.create(jellyfishImages[0], SpriteKind.Jellyfish)
    sprite.setPosition(166, randint(58, 99))
    sprite.vx = -(28 + Math.min(18, (game.runtime() - startTime) / 9000))
    sprite.z = 7
    sprite.setFlag(SpriteFlag.AutoDestroy, true)
}

// ---- Collecting and hits ----

function collect(plastic: Sprite, value: number) {
    if (!started || finished || game.runtime() < swappingUntil) return
    score += value
    collected += 1
    let text = image.create(23, 9)
    text.print("+" + value, 0, 0, 5)
    let popup = makeDecoration(text, 50)
    popup.setPosition(plastic.x, plastic.y)
    popup.vy = -16
    popup.lifespan = 650
    plastic.destroy()
    if (collected % 8 == 0) {
        let jokes = ["Dagens fangst: pose!", "Pant, ikke torsk!", "For en korka fangst!", "Valhall kan vente!"]
        say(jokes[randint(0, jokes.length - 1)], 1700)
    }
}

function hitJellyfish(jellyfish: Sprite) {
    let now = game.runtime()
    if (!started || finished || now < safeUntil || now < swappingUntil) return
    safeUntil = now + SAFE_TIME_AFTER_HIT
    jellyfish.destroy()
    scene.cameraShake(2, 180)
    if (!cracked) {
        cracked = true
        fisher.setImage(damagedFisher)
        say("AU! Hjelmen sprakk!", 1300)
    } else {
        // One viking survives two hits. The big viking does not count as a life.
        vikingsLeft -= 1
        cracked = false
        let sinker = sprites.create(damagedFisher.clone(), SpriteKind.Sinking)
        sinker.setPosition(fisher.x, fisher.y)
        sinker.vy = 24
        sinker.vx = -8
        sinker.z = 5
        sinker.setFlag(SpriteFlag.Ghost, true)
        sinker.lifespan = 5200
        swappingUntil = now + 1100
        fisher.setImage(intactFisher)
        depth = MIN_DEPTH
        if (vikingsLeft == 0) {
            finished = true
            endTime = now + 2200
            say("Tomt for gaffelvikinger!", 2200)
        } else {
            say("Nestemann! Hold pusten!", 1500)
            // The new viking gets time to settle in before he can be hit.
            safeUntil = swappingUntil + SAFE_TIME_AFTER_HIT
        }
    }
}

// ---- Screens ----

function showGameOver() {
    let picture = titlePanel.image
    picture.fill(0)
    picture.fillRect(7, 27, 146, 72, 15)
    picture.drawRect(7, 27, 146, 72, 4)
    picture.print("TOMT FOR VIKINGER!", 26, 34, 5)
    picture.print("Havet fikk hjelp:", 29, 49, 1)
    picture.print(collected + " plastbiter", 40, 61, 9)
    picture.print(score + " poeng", 49, 73, 5)
    picture.print("A: ny rydderunde", 34, 87, 1)
    titlePanel.setFlag(SpriteFlag.Invisible, false)
}

function startGame() {
    started = true
    titlePanel.setFlag(SpriteFlag.Invisible, true)
    startTime = game.runtime()
    previousTime = startTime
    nextPlasticTime = startTime + 350
    nextJellyfishTime = startTime + 3500
    safeUntil = startTime + 1800
    say("Fisk plast. Ikke maneter!", 2300)
}

// ---- Setup ----

intactHelmet = makeHelmet(false)
crackedHelmet = makeHelmet(true)
intactFisher = makeFisher(false)
damagedFisher = makeFisher(true)
jellyfishImages = [makeJellyfish(0), makeJellyfish(1)]
makeBackground()
boat = makeDecoration(makeBoat(), 30)
bigViking = makeDecoration(makeBigViking(), 20)
arms = makeDecoration(image.create(160, 120), 24)
arms.setPosition(80, 60)
for (let i = 0; i < VIKING_COUNT - 1; i++) {
    waitingVikings.push(makeDecoration(makeSmallViking(i % 2 == 0 ? 8 : 7), 15))
}
fisher = sprites.create(intactFisher, SpriteKind.Fork)
fisher.z = 25
horns = sprites.create(image.create(11, 4), SpriteKind.Horns)
horns.image.fill(1)
horns.setFlag(SpriteFlag.Invisible, true)
hud = makeDecoration(image.create(160, 120), 90)
hud.setPosition(80, 60)
titlePanel = makeDecoration(image.create(160, 120), 100)
titlePanel.setPosition(80, 60)
titlePanel.image.fillRect(5, 49, 150, 63, 15)
titlePanel.image.drawRect(5, 49, 150, 63, 4)
titlePanel.image.print("VIKINGGAFFEL", 44, 53, 5)
titlePanel.image.print("Vi fisker fremtiden!", 23, 66, 1)
titlePanel.image.print("Venstre/hoyre: baat", 22, 78, 9)
titlePanel.image.print("Opp/ned: viking", 35, 89, 9)
titlePanel.image.print("A: start", 56, 101, 5)

// ---- Input and collisions ----

controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
    if (!started) startGame()
    else if (finished && game.runtime() >= endTime) game.reset()
})

sprites.onOverlap(SpriteKind.Horns, SpriteKind.SurfacePlastic, function (hitter, plastic) {
    collect(plastic, POINTS_SURFACE)
})
sprites.onOverlap(SpriteKind.Horns, SpriteKind.MidwaterPlastic, function (hitter, plastic) {
    collect(plastic, POINTS_MIDWATER)
})
sprites.onOverlap(SpriteKind.Horns, SpriteKind.SeabedPlastic, function (hitter, plastic) {
    collect(plastic, POINTS_SEABED)
})
sprites.onOverlap(SpriteKind.Fork, SpriteKind.Jellyfish, function (victim, jellyfish) {
    hitJellyfish(jellyfish)
})

// ---- Update and paint ----

game.onUpdate(function () {
    let now = game.runtime()
    let dt = Math.min(0.05, Math.max(0, (now - previousTime) / 1000))
    previousTime = now
    if (started && !finished) {
        if (controller.left.isPressed()) {
            boatX -= BOAT_SPEED * dt
            fisherX -= BOAT_SPEED * dt
        }
        if (controller.right.isPressed()) {
            boatX += BOAT_SPEED * dt
            fisherX += BOAT_SPEED * dt
        }
        boatX = Math.constrain(boatX, 43, 110)
        fisherX = Math.constrain(fisherX, 12, 148)
        if (now >= swappingUntil) {
            if (controller.up.isPressed()) depth -= FORK_SPEED * dt
            if (controller.down.isPressed()) depth += FORK_SPEED * dt
            depth = Math.constrain(depth, MIN_DEPTH, MAX_DEPTH)
        }
        if (now >= nextPlasticTime) {
            spawnPlastic()
            nextPlasticTime = now + randint(850, 1250)
        }
        if (now >= nextJellyfishTime) {
            spawnJellyfish()
            nextJellyfishTime = now + Math.max(1200, 2900 - (now - startTime) / 90)
        }
    }
    for (let sinker of sprites.allOfKind(SpriteKind.Sinking)) {
        if (sinker.y >= 104) {
            sinker.y = 104
            sinker.vy = 0
            sinker.vx = -10
        }
    }
    for (let jellyfish of sprites.allOfKind(SpriteKind.Jellyfish)) {
        jellyfish.setImage(jellyfishImages[Math.idiv(now, 220) % 2])
        jellyfish.vy = Math.sin(now / 450 + jellyfish.x / 30) * 7
        jellyfish.y = Math.constrain(jellyfish.y, 55, 103)
    }
    updateBoat()
    drawHud()
    if (finished && now >= endTime) showGameOver()
})

// Sea foam, bubbles and seabed, constantly drifting left.
game.onPaint(function () {
    let now = game.runtime()
    let foam = Math.idiv(now, 70) % 27
    for (let i = 0; i < 7; i++) {
        let x = i * 27 - foam
        screen.drawLine(x, 46, x + 8, 46, 9)
    }
    let seabed = Math.idiv(now, 95) % 35
    for (let i = 0; i < 6; i++) {
        let x = i * 35 - seabed
        screen.drawLine(x, 113, x + 2, 106, 7)
        screen.drawLine(x + 2, 106, x + 5, 110, 7)
        screen.setPixel(x + 14, 117, 4)
    }
    for (let i = 0; i < 6; i++) {
        let x = (195 + i * 29 - Math.idiv(now, 100) % 195) % 195 - 12
        let y = 102 - (Math.idiv(now, 100) + i * 17) % 45
        screen.drawCircle(x, y, 1, 6)
    }
})

updateBoat()
drawHud()

