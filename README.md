# what-if

## Premise
A what if game pitting impossible heroes against one another.

- Each chacter will be totally unique, from it's own multiverse
    - multiverses can be the same but should be generated so they can be infinitly large
    - each hero's multiverse key can be based off the current time
        - to ensure there is no clashing and an infinite amount of possibilities,
        I could put a queue in front of this, to ensure only one creation every 
        nanosecond
        - also if there are two registrations at the same nanosecond, one could fail
        and go backwards in time 
            - multiverseInstance = Date.now().toInt()
        - If we have run out of possibilities of unique traits, the system needs
        to be smart enough to create it's a new property, having an infinite amount
        of possibilites 

## Tech stack

- Docker
- Node
- GraphQL (Apollo)
- Postgres
- DB (Prisma)