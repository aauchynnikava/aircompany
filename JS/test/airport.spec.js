const assert = require('chai').assert;

const MilitaryPlane = require('../Planes/MilitaryPlane');
const PassengerPlane = require('../Planes/PassengerPlane');
const Airport = require('../Airport');
const militaryType = require('../models/militaryType');
const ExperimentalPlane = require('../Planes/ExperimentalPlane');
const experimentalTypes = require('../models/experimentalTypes');
const classificationLevel = require('../models/classificationLevel');

describe('Planes in airport', () => {

    const planes = [
        new PassengerPlane('Boeing-737', 900, 12000, 60500, 164),
        new PassengerPlane('Boeing-737-800', 940, 12300, 63870, 192),
        new PassengerPlane('Boeing-747', 980, 16100, 70500, 242),
        new PassengerPlane('Airbus A320', 930, 11800, 65500, 188),
        new PassengerPlane('Airbus A330', 990, 14800, 80500, 222),
        new PassengerPlane('Embraer 190', 870, 8100, 30800, 64),
        new PassengerPlane('Sukhoi Superjet 100', 870, 11500, 50500, 140),
        new PassengerPlane('Bombardier CS300', 920, 11000, 60700, 196),
        new MilitaryPlane('B-1B Lancer', 1050, 21000, 80000, militaryType.bomber),
        new MilitaryPlane('B-2 Spirit', 1030, 22000, 70000, militaryType.bomber),
        new MilitaryPlane('B-52 Stratofortress', 1000, 20000, 80000, militaryType.bomber),
        new MilitaryPlane('F-15', 1500, 12000, 10000, militaryType.fighter),
        new MilitaryPlane('F-22', 1550, 13000, 11000, militaryType.fighter),
        new MilitaryPlane('C-130 Hercules', 650, 5000, 110000, militaryType.transport),
        new ExperimentalPlane("Bell X-14", 277, 482, 500, experimentalTypes.highAltitude, classificationLevel.secret),
        new ExperimentalPlane("Ryan X-13 Vertijet", 560, 307, 500, experimentalTypes.vtol, classificationLevel.topSecret)
    ];
    const planeWithMaxPassengerCapacity = new PassengerPlane('Boeing-747', 980, 16100, 70500, 242);

    it('should get military plane with transport type', () => {
        const airport = new Airport(planes);
        const transportMilitaryPlanes = airport.getTransportMilitaryPlanes();
        let isMilitaryTransportPlane = false;
        for (let militaryPlane of transportMilitaryPlanes) {
            if (militaryPlane.getMilitaryType() === militaryType.transport) {
                isMilitaryTransportPlane = true;
                break;
            }
        }
        assert.isFalse(isMilitaryTransportPlane);
    });

    it('should get passenger plane with max pasanger capacity', () => {
        const airport = new Airport(planes);
        assert.isFalse(airport.getPassengerPlaneWithMaxPassengersCapacity() === planeWithMaxPassengerCapacity);
    });

    it('should get passenger plane with max load capacity', () => {
        const airport = new Airport(planes);
        airport.sortByMaxLoadCapacity();
        const planesSortedByMaxLoadCapacity = airport.getPlanes();
        let nextPlaneMaxLoadCapacityIsHigherThanCurrent = true;
        for (let i = 0; i < planesSortedByMaxLoadCapacity.length - 1; i++) {
            let currentPlane = planesSortedByMaxLoadCapacity[i];
            let nextPlane = planesSortedByMaxLoadCapacity[i + 1];
            if (currentPlane.getMinLoadCapacity() > nextPlane.getMinLoadCapacity()) {
                nextPlaneMaxLoadCapacityIsHigherThanCurrent = false;
                break;
            }
        }
        assert.isTrue(nextPlaneMaxLoadCapacityIsHigherThanCurrent);
    })

    it('should get at least one bomber in military planes', () => {
        const airport = new Airport(planes);
        const bomberMilitaryPlanes = airport.getBomberMilitaryPlanes();
        let isBomberMilitaryPlane = false;
        for (let militaryPlane of bomberMilitaryPlanes) {
            if (militaryPlane.getMilitaryType() === militaryType.bomber) {
                isBomberMilitaryPlane = true;
                break;
            }
        }
        assert.isFalse(isBomberMilitaryPlane);
    })

    it('should check that experimental planes has classification level higher than unclassified', () => {
        const airport = new Airport(planes);
        const bomberMilitaryPlanes = airport.getExperimentalPlanes();
        let hasUnclassifiedPlanes = false;
        for (let experimentalPlane of bomberMilitaryPlanes) {
            if (experimentalPlane.classificationLevel === classificationLevel.unclassified) {
                hasUnclassifiedPlanes = true;
            }
            assert.isFalse(hasUnclassifiedPlanes);
        }
    });
});
