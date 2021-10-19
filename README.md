# why-not

## Premise
A what if game pitting impossible heroes against one another.

- Each character will be totally unique, from it's own multiverse
    - each hero's multiverse key can be based off the current time
        - to ensure there is no clashing and an infinite amount of possibilities, 
            use uuidv1, less random more unique 
        - also if there are two registrations at the same nanosecond, one could fail and retry 
            - multiverseInstance = uuidv1
        - If we have run out of possibilities of unique traits, the system needs
            to be smart enough to create it's a new property, having an infinite amount
            of possibilites 
- Heros will be purchased with time shards from The Watcher
- Faction system / alignment
    - superhero or super villian
    - heros will come through time portals

## POC
    - Authentication
        - simple username and password
        - A user can purchase a new hero with currency
    - Store
        - named the watcher
        - currency is time shards 
        - users will start with enough currency to generate a portal
    - One on One PvP
        - no user control
        - similar to auto chess
    - Progression   
        - account xp
        - hero xp
        - level tier

## Tech stack

- Docker
- Node
- GraphQL (Apollo)
- Postgres (Prisma)
- nginx
- Digital Ocean

## Env
- http://137.184.216.37:4000/
- https://whynotga.me/
