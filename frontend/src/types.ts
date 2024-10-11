export interface Unit {
    id: UnitType;
    name: string;
    image: string;
    cost: number;
    counters?: {
        effectiveAgainst: UnitType[];
        counteredBy: UnitType[];
    };
}

export enum UnitType {
    Farseer = 1,
    Tarantula = 2,
    Sandworm = 3,
    FireBadger = 4,
    Typhoon = 5,
    Sabertooth = 6,
    Scorpion = 7,
    Wraith = 8,
    WarFactory = 9,
    Phoenix = 10,
    Arclight = 11,
    Hacker = 12,
    Sledgehammer = 13,
    Stormcaller = 14,
    Overlord = 15,
    Crawler = 16,
    Fang = 17,
    SteelBall = 18,
    Mustang = 19,
    Wasp = 20,
    Rhino = 21,
    MeltingPoint = 22,
    Marksman = 23,
    Fortress = 24,
    Vulcan = 25,
}
