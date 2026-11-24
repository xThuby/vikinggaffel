// VIKINGGAFFEL for MakeCode Arcade.
// Left/right: the boat. Up/down: the viking fork. A: start / play again.

// ---- Kinds and enums ----

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

enum Phase {
    Title,
    Playing,
    // The last viking is gone. The panel appears at run.endTime.
    GameOver
}

// Slots in the default palette, for text, panels and arms.
enum Ink {
    Clear = 0,
    White = 1,
    Orange = 4,
    Yellow = 5,
    LightBlue = 9,
    Black = 15
}

// Sprite z, back to front.
enum Depth {
    Sinking = 5,
    Plastic = 6,
    Jellyfish = 7,
    WaitingViking = 15,
    BigViking = 20,
    Arms = 24,
    Fisher = 25,
    Boat = 30,
    Popup = 50,
    Hud = 90,
    Panel = 100
}

// ---- Tuning ----

const SCREEN_WIDTH = 160
const SCREEN_HEIGHT = 120

// Vikings. One viking survives two hits. The big viking does not count as a life.
const VIKING_COUNT = 5
const SAFE_TIME_AT_START = 1800
const SAFE_TIME_AFTER_HIT = 1500
const SWAP_TIME = 1100
const GAME_OVER_DELAY = 2200
const BLINK_TIME = 110

// Boat and fisher movement, in pixels and pixels per second.
const BOAT_SPEED = 52
const FORK_SPEED = 43
const BOAT_START_X = 57
const BOAT_MIN_X = 43
const BOAT_MAX_X = 110
const FISHER_START_X = 87
const FISHER_MIN_X = 12
const FISHER_MAX_X = 148
const MIN_DEPTH = 49
const MAX_DEPTH = 94
const MAX_FRAME_SECONDS = 0.05

// Boat layout.
const BOAT_Y = 40
const BOB_TIME = 380
const BIG_VIKING_OFFSET_X = 5
const BIG_VIKING_Y = 29
const WAITING_OFFSET_X = -28
const WAITING_SPACING = 9
const WAITING_Y = 30
const SWAP_END_ABOVE_MIN_DEPTH = 8
const HORNS_OFFSET_Y = 9
const HANDS_ABOVE_FISHER = 9
const HANDS_ABOVE_MIN_DEPTH_IN_SWAP = 10
const ARM_THICKNESS = 4
const LEFT_SHOULDER_X = 13
const LEFT_SHOULDER_Y = 29
const RIGHT_SHOULDER_X = 18
const RIGHT_SHOULDER_Y = 31
const LEFT_ANKLE_OFFSET_X = -3
const RIGHT_ANKLE_OFFSET_X = 3
const LEFT_HAND_OFFSET_X = -5
const RIGHT_HAND_OFFSET_X = 1
const HAND_OFFSET_Y = -2

// Plastic.
const FIRST_PLASTIC_TIME = 350
const PLASTIC_GAP_MIN = 850
const PLASTIC_GAP_MAX = 1250
// Slightly inside the screen edge, otherwise AutoDestroy removes it at once.
const PLASTIC_SPAWN_X = 164
const PLASTIC_SPEED = 24
const PLASTIC_SPEEDUP_TIME = 7000
const MAX_SPEEDUP = 18
const PIECES_PER_JOKE = 8

// Jellyfish.
const FIRST_JELLYFISH_TIME = 3500
const JELLYFISH_GAP_START = 2900
const JELLYFISH_GAP_MIN = 1200
const JELLYFISH_GAP_SHRINK_TIME = 90
const JELLYFISH_SPAWN_X = 166
const JELLYFISH_SPAWN_MIN_Y = 58
const JELLYFISH_SPAWN_MAX_Y = 99
const JELLYFISH_MIN_Y = 55
const JELLYFISH_MAX_Y = 103
const JELLYFISH_SPEED = 28
const JELLYFISH_SPEEDUP_TIME = 9000
const JELLYFISH_FRAME_TIME = 220
const JELLYFISH_WAVE_TIME = 450
const JELLYFISH_WAVE_LENGTH = 30
const JELLYFISH_WAVE_SPEED = 7

// A lost viking.
const SINK_VX = -8
const SINK_VY = 24
const SINK_FLOOR_Y = 104
const SINK_FLOOR_VX = -10
const SINK_LIFESPAN = 5200

// Score popup, camera shake and messages.
const POPUP_VY = -16
const POPUP_LIFESPAN = 650
const SHAKE_AMPLITUDE = 2
const SHAKE_TIME = 180
const START_MESSAGE_TIME = 2300
const JOKE_TIME = 1700
const CRACK_MESSAGE_TIME = 1300
const SWAP_MESSAGE_TIME = 1500

// Scrolling scenery.
const FOAM_COUNT = 7
const FOAM_SPACING = 27
const FOAM_Y = 46
const FOAM_TIME = 70
const SEABED_COUNT = 6
const SEABED_SPACING = 35
const SEABED_TOP = 106
const SEABED_TIME = 95
const BUBBLE_COUNT = 6
const BUBBLE_TIME = 100
const BUBBLE_WRAP_X = 195
const BUBBLE_SPACING_X = 29
const BUBBLE_OFFSET_X = -13
const BUBBLE_FLOOR_Y = 101
const BUBBLE_RISE = 45
const BUBBLE_SPACING_Y = 17

// HUD.
const HUD_HEIGHT = 13
const HELMET_X = 2
const HELMET_SPACING = 16
const HELMET_Y = 1
const SCORE_X = 91
const SCORE_Y = 3
const LABEL_X = 2
const CHARACTER_WIDTH = 6
const MESSAGE_Y = 14
const MESSAGE_HEIGHT = 10
const MESSAGE_PADDING = 3

// ---- Assets ----

// Project assets, drawn in the MakeCode asset editor and stored in images.g.jres.
// Change the art there; keep the sizes, or check the layout constants above.
// images.g.ts must come before main.ts in pxt.json, or the images load as null.
const backgroundImage = assets.image`background`
const boatImage = assets.image`boat`
const bigVikingImage = assets.image`bigViking`
const blueVikingImage = assets.image`blueViking`
const greenVikingImage = assets.image`greenViking`
// The fisher hangs upside down.
const fisherImage = assets.image`fisher`
const crackedFisherImage = assets.image`crackedFisher`
const helmetImage = assets.image`helmet`
const crackedHelmetImage = assets.image`crackedHelmet`
// Never shown: its pixels are the area that catches plastic.
const hornsImage = assets.image`horns`
const handImage = assets.image`hand`
const bottleCapImage = assets.image`bottleCap`
const bagImage = assets.image`bag`
const fragmentImage = assets.image`fragment`
const bottleImage = assets.image`bottle`
// Animation frames.
const jellyfishImages = [assets.image`jellyfish1`, assets.image`jellyfish2`]
const foamImage = assets.image`foam`
const seabedImage = assets.image`seabed`
const bubbleImage = assets.image`bubble`

// ---- Data tables ----

interface PlasticTier {
    kind: number
    points: number
    minY: number
    maxY: number
    // Where the point value is printed in the water, clear of the boat.
    labelY: number
    images: Image[]
}

const PLASTIC_TIERS: PlasticTier[] = [
    { kind: SpriteKind.SurfacePlastic, points: 10, minY: 56, maxY: 61, labelY: 57, images: [bottleCapImage, bagImage] },
    { kind: SpriteKind.MidwaterPlastic, points: 25, minY: 77, maxY: 84, labelY: 79, images: [fragmentImage] },
    { kind: SpriteKind.SeabedPlastic, points: 50, minY: 101, maxY: 106, labelY: 102, images: [bottleImage] }
]

const JOKES = ["Dagens fangst: pose!", "Pant, ikke torsk!", "For en korka fangst!", "Valhall kan vente!"]

interface TextLine {
    text: string
    x: number
    y: number
    ink: Ink
}

const TITLE_LINES: TextLine[] = [
    { text: "VIKINGGAFFEL", x: 44, y: 53, ink: Ink.Yellow },
    { text: "Vi fisker fremtiden!", x: 23, y: 66, ink: Ink.White },
    { text: "Venstre/hoyre: baat", x: 22, y: 78, ink: Ink.LightBlue },
    { text: "Opp/ned: viking", x: 35, y: 89, ink: Ink.LightBlue },
    { text: "A: start", x: 56, y: 101, ink: Ink.Yellow }
]

// ---- State ----

class Run {
    phase: Phase
    score: number
    collected: number
    vikingsLeft: number
    cracked: boolean
    // All times are game.runtime() values.
    previousTime: number
    startTime: number
    nextPlasticTime: number
    nextJellyfishTime: number
    safeUntil: number
    swappingUntil: number
    endTime: number
    message: string
    messageUntil: number

    constructor() {
        this.phase = Phase.Title
        this.score = 0
        this.collected = 0
        this.vikingsLeft = VIKING_COUNT
        this.cracked = false
        this.previousTime = 0
        this.startTime = 0
        this.nextPlasticTime = 0
        this.nextJellyfishTime = 0
        this.safeUntil = 0
        this.swappingUntil = 0
        this.endTime = 0
        this.message = ""
        this.messageUntil = 0
    }
}

class World {
    boatX: number
    // The fork viking has its own horizontal position, also when the boat reaches the edge.
    fisherX: number
    depth: number
    boat: Sprite
    bigViking: Sprite
    arms: Sprite
    waitingVikings: Sprite[]
    fisher: Sprite
    // Invisible: only for catching plastic.
    horns: Sprite
    hud: Sprite
    panel: Sprite

    constructor() {
        this.boatX = BOAT_START_X
        this.fisherX = FISHER_START_X
        this.depth = MIN_DEPTH
        this.boat = makeDecoration(boatImage, Depth.Boat)
        this.bigViking = makeDecoration(bigVikingImage, Depth.BigViking)
        this.arms = makeOverlay(Depth.Arms)
        this.waitingVikings = []
        for (let i = 0; i < VIKING_COUNT - 1; i++) {
            this.waitingVikings.push(makeDecoration(i % 2 == 0 ? blueVikingImage : greenVikingImage, Depth.WaitingViking))
        }
        this.fisher = sprites.create(fisherImage, SpriteKind.Fork)
        this.fisher.z = Depth.Fisher
        this.horns = sprites.create(hornsImage, SpriteKind.Horns)
        this.horns.setFlag(SpriteFlag.Invisible, true)
        this.hud = makeOverlay(Depth.Hud)
        this.panel = makeOverlay(Depth.Panel)
    }

    destroy() {
        const kinds = [SpriteKind.Decoration, SpriteKind.Fork, SpriteKind.Horns, SpriteKind.SurfacePlastic,
            SpriteKind.MidwaterPlastic, SpriteKind.SeabedPlastic, SpriteKind.Jellyfish, SpriteKind.Sinking]
        for (let kind of kinds) {
            for (let sprite of sprites.allOfKind(kind)) sprite.destroy()
        }
    }
}

let run: Run = null
let world: World = null

function makeDecoration(picture: Image, z: number): Sprite {
    let sprite = sprites.create(picture, SpriteKind.Decoration)
    sprite.setFlag(SpriteFlag.Ghost, true)
    sprite.z = z
    return sprite
}

// A transparent full-screen sprite to draw on.
function makeOverlay(z: number): Sprite {
    let sprite = makeDecoration(image.create(SCREEN_WIDTH, SCREEN_HEIGHT), z)
    sprite.setPosition(SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2)
    return sprite
}

// ---- Messages and HUD ----

function say(text: string, duration: number) {
    run.message = text
    run.messageUntil = game.runtime() + duration
}

function drawHud() {
    let picture = world.hud.image
    picture.fill(Ink.Clear)
    picture.fillRect(0, 0, SCREEN_WIDTH, HUD_HEIGHT, Ink.Black)
    for (let i = 0; i < run.vikingsLeft; i++) {
        let helmet = run.cracked && i == run.vikingsLeft - 1 ? crackedHelmetImage : helmetImage
        picture.drawTransparentImage(helmet, HELMET_X + i * HELMET_SPACING, HELMET_Y)
    }
    picture.print("P " + run.score, SCORE_X, SCORE_Y, Ink.White)
    for (let tier of PLASTIC_TIERS) {
        picture.print("" + tier.points, LABEL_X, tier.labelY, Ink.LightBlue)
    }
    if (game.runtime() < run.messageUntil) {
        let width = run.message.length * CHARACTER_WIDTH + 2 * MESSAGE_PADDING
        let x = Math.max(0, (SCREEN_WIDTH - width) / 2)
        picture.fillRect(x, MESSAGE_Y, width, MESSAGE_HEIGHT, Ink.Black)
        picture.print(run.message, x + MESSAGE_PADDING, MESSAGE_Y + 1, Ink.White)
    }
}

// ---- Boat and vikings ----

function updateBoat() {
    let now = game.runtime()
    let bob = Math.sin(now / BOB_TIME)
    let boatX = world.boatX
    let fisherX = world.fisherX
    let fisher = world.fisher
    world.boat.setPosition(boatX, BOAT_Y + bob)
    world.bigViking.setPosition(boatX + BIG_VIKING_OFFSET_X, BIG_VIKING_Y + bob)
    for (let i = 0; i < world.waitingVikings.length; i++) {
        let isWaiting = i < run.vikingsLeft - 1
        // The next viking is lifted towards the hands during the swap.
        let swapping = now < run.swappingUntil && i == run.vikingsLeft - 1
        world.waitingVikings[i].setFlag(SpriteFlag.Invisible, !isWaiting && !swapping)
        let x = boatX + WAITING_OFFSET_X + i * WAITING_SPACING
        let y = WAITING_Y + bob
        if (swapping) {
            let progress = 1 - (run.swappingUntil - now) / SWAP_TIME
            x = x + (fisherX - x) * progress
            y = y + (MIN_DEPTH - SWAP_END_ABOVE_MIN_DEPTH - y) * progress
        }
        world.waitingVikings[i].setPosition(x, y)
    }
    let gameOver = run.phase == Phase.GameOver
    let swapping = now < run.swappingUntil || gameOver
    fisher.setFlag(SpriteFlag.Invisible, swapping || (now < run.safeUntil && Math.idiv(now, BLINK_TIME) % 2 == 0))
    fisher.setPosition(fisherX, world.depth)
    world.horns.setPosition(fisher.x, fisher.y + HORNS_OFFSET_Y)
    let picture = world.arms.image
    picture.fill(Ink.Clear)
    if (!gameOver) {
        let handsY = swapping ? MIN_DEPTH - HANDS_ABOVE_MIN_DEPTH_IN_SWAP : fisher.y - HANDS_ABOVE_FISHER
        // Two absurdly long arms, gripping the ankles.
        for (let i = 0; i < ARM_THICKNESS; i++) {
            picture.drawLine(boatX + LEFT_SHOULDER_X + i, LEFT_SHOULDER_Y + bob, fisherX + LEFT_ANKLE_OFFSET_X + i, handsY, Ink.Orange)
            picture.drawLine(boatX + RIGHT_SHOULDER_X + i, RIGHT_SHOULDER_Y + bob, fisherX + RIGHT_ANKLE_OFFSET_X + i, handsY, Ink.Orange)
        }
        picture.drawTransparentImage(handImage, fisherX + LEFT_HAND_OFFSET_X, handsY + HAND_OFFSET_Y)
        picture.drawTransparentImage(handImage, fisherX + RIGHT_HAND_OFFSET_X, handsY + HAND_OFFSET_Y)
    }
}

// ---- Spawning ----

// Speed gained since the start of the run, one pixel per second for every stepTime.
function speedup(stepTime: number): number {
    return Math.min(MAX_SPEEDUP, (game.runtime() - run.startTime) / stepTime)
}

function spawnPlastic() {
    let tier = PLASTIC_TIERS[randint(0, PLASTIC_TIERS.length - 1)]
    let picture = tier.images[0]
    if (tier.images.length > 1) picture = tier.images[randint(0, tier.images.length - 1)]
    let sprite = sprites.create(picture, tier.kind)
    sprite.setPosition(PLASTIC_SPAWN_X, randint(tier.minY, tier.maxY))
    sprite.vx = -(PLASTIC_SPEED + speedup(PLASTIC_SPEEDUP_TIME))
    sprite.z = Depth.Plastic
    sprite.setFlag(SpriteFlag.AutoDestroy, true)
}

function spawnJellyfish() {
    let sprite = sprites.create(jellyfishImages[0], SpriteKind.Jellyfish)
    sprite.setPosition(JELLYFISH_SPAWN_X, randint(JELLYFISH_SPAWN_MIN_Y, JELLYFISH_SPAWN_MAX_Y))
    sprite.vx = -(JELLYFISH_SPEED + speedup(JELLYFISH_SPEEDUP_TIME))
    sprite.z = Depth.Jellyfish
    sprite.setFlag(SpriteFlag.AutoDestroy, true)
}

// ---- Collecting and hits ----

function collect(plastic: Sprite, value: number) {
    if (run.phase != Phase.Playing || game.runtime() < run.swappingUntil) return
    run.score += value
    run.collected += 1
    let text = image.create(23, 9)
    text.print("+" + value, 0, 0, Ink.Yellow)
    let popup = makeDecoration(text, Depth.Popup)
    popup.setPosition(plastic.x, plastic.y)
    popup.vy = POPUP_VY
    popup.lifespan = POPUP_LIFESPAN
    plastic.destroy()
    if (run.collected % PIECES_PER_JOKE == 0) {
        say(JOKES[randint(0, JOKES.length - 1)], JOKE_TIME)
    }
}

function hitJellyfish(jellyfish: Sprite) {
    let now = game.runtime()
    if (run.phase != Phase.Playing || now < run.safeUntil || now < run.swappingUntil) return
    run.safeUntil = now + SAFE_TIME_AFTER_HIT
    jellyfish.destroy()
    scene.cameraShake(SHAKE_AMPLITUDE, SHAKE_TIME)
    if (!run.cracked) {
        run.cracked = true
        world.fisher.setImage(crackedFisherImage)
        say("AU! Hjelmen sprakk!", CRACK_MESSAGE_TIME)
    } else {
        loseViking(now)
    }
}

function loseViking(now: number) {
    run.vikingsLeft -= 1
    run.cracked = false
    let sinker = sprites.create(crackedFisherImage, SpriteKind.Sinking)
    sinker.setPosition(world.fisher.x, world.fisher.y)
    sinker.vy = SINK_VY
    sinker.vx = SINK_VX
    sinker.z = Depth.Sinking
    sinker.setFlag(SpriteFlag.Ghost, true)
    sinker.lifespan = SINK_LIFESPAN
    run.swappingUntil = now + SWAP_TIME
    world.fisher.setImage(fisherImage)
    world.depth = MIN_DEPTH
    if (run.vikingsLeft == 0) {
        run.phase = Phase.GameOver
        run.endTime = now + GAME_OVER_DELAY
        say("Tomt for gaffelvikinger!", GAME_OVER_DELAY)
    } else {
        say("Nestemann! Hold pusten!", SWAP_MESSAGE_TIME)
        // The new viking gets time to settle in before he can be hit.
        run.safeUntil = run.swappingUntil + SAFE_TIME_AFTER_HIT
    }
}

// ---- Screens ----

function drawLines(picture: Image, lines: TextLine[]) {
    for (let line of lines) picture.print(line.text, line.x, line.y, line.ink)
}

function showTitle() {
    let picture = world.panel.image
    picture.fillRect(5, 49, 150, 63, Ink.Black)
    picture.drawRect(5, 49, 150, 63, Ink.Orange)
    drawLines(picture, TITLE_LINES)
}

function showGameOver() {
    let picture = world.panel.image
    picture.fill(Ink.Clear)
    picture.fillRect(7, 27, 146, 72, Ink.Black)
    picture.drawRect(7, 27, 146, 72, Ink.Orange)
    drawLines(picture, [
        { text: "TOMT FOR VIKINGER!", x: 26, y: 34, ink: Ink.Yellow },
        { text: "Havet fikk hjelp:", x: 29, y: 49, ink: Ink.White },
        { text: run.collected + " plastbiter", x: 40, y: 61, ink: Ink.LightBlue },
        { text: run.score + " poeng", x: 49, y: 73, ink: Ink.Yellow },
        { text: "A: ny rydderunde", x: 34, y: 87, ink: Ink.White }
    ])
    world.panel.setFlag(SpriteFlag.Invisible, false)
}

// ---- Run lifecycle ----

// A new run and world, waiting on the title screen.
function newGame() {
    if (world) world.destroy()
    run = new Run()
    world = new World()
    showTitle()
    updateBoat()
    drawHud()
}

function startRun() {
    let now = game.runtime()
    run.phase = Phase.Playing
    world.panel.setFlag(SpriteFlag.Invisible, true)
    run.startTime = now
    run.previousTime = now
    run.nextPlasticTime = now + FIRST_PLASTIC_TIME
    run.nextJellyfishTime = now + FIRST_JELLYFISH_TIME
    run.safeUntil = now + SAFE_TIME_AT_START
    say("Fisk plast. Ikke maneter!", START_MESSAGE_TIME)
}

// ---- Setup ----

scene.setBackgroundImage(backgroundImage)
newGame()

// ---- Input and collisions ----

controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
    if (run.phase == Phase.Title) startRun()
    else if (run.phase == Phase.GameOver && game.runtime() >= run.endTime) newGame()
})

function registerPlasticOverlap(tier: PlasticTier) {
    sprites.onOverlap(SpriteKind.Horns, tier.kind, function (horns, plastic) {
        collect(plastic, tier.points)
    })
}
for (let tier of PLASTIC_TIERS) registerPlasticOverlap(tier)

sprites.onOverlap(SpriteKind.Fork, SpriteKind.Jellyfish, function (fisher, jellyfish) {
    hitJellyfish(jellyfish)
})

// ---- Update and paint ----

game.onUpdate(function () {
    let now = game.runtime()
    let dt = Math.min(MAX_FRAME_SECONDS, Math.max(0, (now - run.previousTime) / 1000))
    run.previousTime = now
    if (run.phase == Phase.Playing) {
        if (controller.left.isPressed()) {
            world.boatX -= BOAT_SPEED * dt
            world.fisherX -= BOAT_SPEED * dt
        }
        if (controller.right.isPressed()) {
            world.boatX += BOAT_SPEED * dt
            world.fisherX += BOAT_SPEED * dt
        }
        world.boatX = Math.constrain(world.boatX, BOAT_MIN_X, BOAT_MAX_X)
        world.fisherX = Math.constrain(world.fisherX, FISHER_MIN_X, FISHER_MAX_X)
        if (now >= run.swappingUntil) {
            if (controller.up.isPressed()) world.depth -= FORK_SPEED * dt
            if (controller.down.isPressed()) world.depth += FORK_SPEED * dt
            world.depth = Math.constrain(world.depth, MIN_DEPTH, MAX_DEPTH)
        }
        if (now >= run.nextPlasticTime) {
            spawnPlastic()
            run.nextPlasticTime = now + randint(PLASTIC_GAP_MIN, PLASTIC_GAP_MAX)
        }
        if (now >= run.nextJellyfishTime) {
            spawnJellyfish()
            run.nextJellyfishTime = now + Math.max(JELLYFISH_GAP_MIN, JELLYFISH_GAP_START - (now - run.startTime) / JELLYFISH_GAP_SHRINK_TIME)
        }
    }
    for (let sinker of sprites.allOfKind(SpriteKind.Sinking)) {
        if (sinker.y >= SINK_FLOOR_Y) {
            sinker.y = SINK_FLOOR_Y
            sinker.vy = 0
            sinker.vx = SINK_FLOOR_VX
        }
    }
    for (let jellyfish of sprites.allOfKind(SpriteKind.Jellyfish)) {
        jellyfish.setImage(jellyfishImages[Math.idiv(now, JELLYFISH_FRAME_TIME) % jellyfishImages.length])
        jellyfish.vy = Math.sin(now / JELLYFISH_WAVE_TIME + jellyfish.x / JELLYFISH_WAVE_LENGTH) * JELLYFISH_WAVE_SPEED
        jellyfish.y = Math.constrain(jellyfish.y, JELLYFISH_MIN_Y, JELLYFISH_MAX_Y)
    }
    updateBoat()
    drawHud()
    if (run.phase == Phase.GameOver && now >= run.endTime) showGameOver()
})

// Sea foam, bubbles and seabed, constantly drifting left.
game.onPaint(function () {
    let now = game.runtime()
    let foam = Math.idiv(now, FOAM_TIME) % FOAM_SPACING
    for (let i = 0; i < FOAM_COUNT; i++) {
        let x = i * FOAM_SPACING - foam
        screen.drawTransparentImage(foamImage, x, FOAM_Y)
    }
    let seabed = Math.idiv(now, SEABED_TIME) % SEABED_SPACING
    for (let i = 0; i < SEABED_COUNT; i++) {
        let x = i * SEABED_SPACING - seabed
        screen.drawTransparentImage(seabedImage, x, SEABED_TOP)
    }
    let drift = Math.idiv(now, BUBBLE_TIME)
    for (let i = 0; i < BUBBLE_COUNT; i++) {
        let x = (BUBBLE_WRAP_X + i * BUBBLE_SPACING_X - drift % BUBBLE_WRAP_X) % BUBBLE_WRAP_X + BUBBLE_OFFSET_X
        let y = BUBBLE_FLOOR_Y - (drift + i * BUBBLE_SPACING_Y) % BUBBLE_RISE
        screen.drawTransparentImage(bubbleImage, x, y)
    }
})
