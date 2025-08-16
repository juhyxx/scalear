const C = 0;
const Cis = 1;
const D = 2;
const Dis = 3;
const E = 4;
const F = 5;
const Fis = 6;
const G = 7;
const Gis = 8;
const A = 9;
const Ais = 10;
const B = 11;

const instruments = [
    {
        name: 'Guitar Standard',
        group: 'guitar',
        tunning: [E, B, G, D, A, E]
    },
    {
        name: 'Guitar Open D',
        group: 'guitar',
        tunning: [D, A, D, Fis, A, D]
    },
    {
        name: 'Guitar Open C',
        group: 'guitar',
        tunning: [C, E, G, C, E, G]
    },
    {
        name: 'Guitar Open G',
        group: 'guitar',
        tunning: [D, G, D, G, B, D]
    },
    {
        name: 'Guitar Drop D',
        group: 'guitar',
        tunning: [E, B, G, D, A, D]
    },
    {
        name: 'Guitar 7-string',
        group: 'guitar',
        tunning: [E, B, G, D, A, E, B]
    },
    {
        name: 'Piano',
        group: 'piano'
    },
    {
        group: 'bass',
        name: 'Bass Standard',
        tunning: [G, D, A, E]
    },
    {
        group: 'bass',
        name: 'Bass 5-string',
        tunning: [G, D, A, E, B]
    },
    {
        group: 'bass',
        name: 'Bass 6-string',
        tunning: [C, G, D, A, E, B]
    },
    {
        group: 'ukulele',
        name: 'Ukulele GCEA',
        tunning: [A, E, C, G]
    },
    {
        group: 'ukulele',
        name: 'Ukulele DGBE',
        tunning: [E, B, G, Cis]
    },

    // {
    // 	group: 'ukulele',
    // 	name: 'Ukulele ADG♭B',
    // 	tunning: [B, Fis, D, A]
    // },

    {
        group: 'other',
        name: 'Violin',
        tunning: [E, A, D, G],
        fretless: true
    },
    {
        group: 'other',
        name: 'Cello',
        tunning: [A, D, G, C],
        fretless: true
    },
    {
        group: 'other',
        name: 'Mandolin GDAE',
        tunning: [E, A, D, G]
    }
];

instruments.forEach((item, index) => {
    item.id = index;
});

const instrumentsGrouped = [
    {
        name: 'Guitar',
        group: 'guitar',
        options: (function () {
            return instruments.filter(function (item) {
                return item.group === 'guitar' ? item : undefined;
            });
        })()
    },
    {
        name: 'Piano',
        group: 'piano',
        options: (function () {
            return instruments.filter(function (item) {
                return item.group === 'piano' ? item : undefined;
            });
        })()
    },
    {
        name: 'Bass',
        group: 'bass',
        options: (function () {
            return instruments.filter(function (item) {
                return item.group === 'bass' ? item : undefined;
            });
        })()
    },
    {
        name: 'Ukulele',
        group: 'ukulele',
        options: (function () {
            return instruments.filter(function (item) {
                return item.group === 'ukulele' ? item : undefined;
            });
        })()
    },
    {
        name: 'Other',
        group: 'other',
        options: (function () {
            return instruments.filter(function (item) {
                return item.group === 'other' ? item : undefined;
            });
        })()
    }
];

export { instruments, instrumentsGrouped };
