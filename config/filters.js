module.exports = {
    regex: {
        ddr: /(ddr)\s*([234]{0,1})/gi,
        manufacturer: /(intel)|(amd)/gi,
        box: /(micro|mini)*\s*([a|i]tx)/gi,
        size: /(\d+)\s*(gb|mb)/gi //needs extra check - could be disk size, memory size, motherboard ram max size etc
    },
    categories: {
        1: 'procesory',
        2: 'pamiec_ram',
        3: 'plyty_glowne',
        4: 'dyski_twarde',
        5: 'zasilacze',
        6: 'chlodzenie',
        7: 'karty_graficzne',
        8: 'karty_sieciowe',
        9: 'karty_dzwiekowe',
        10: 'obudowy',
        11: 'napedy',
        12: 'tunery_tv',
        13: 'klawiatury',
        14: 'myszki',
        15: 'monitory'
    },
    categoriesMap: {
        1: [
            {r: 'manufacturer'}
        ],
        2: [
            {r: 'ddr'},
            {r: 'size'}
        ]
    }
};

//TODO - jednolite mapowanie na kategorie w parserze

/*
1. sprawdza z jakiej kategorii jest sprzęt i wyciąga czego szukać
2. najpierw sprawdza czy dane pole pasuje do któregoś regex'a
3. dodatkowo sprawdza czy dla tej kategorii i dla tego regex'a ma być 
    odróżnianie po labelu (jeżeli jeden regex pasuje do dwóch pól bo inaczej dla danej kategorii to będzie wiadomo o co chodzi)
*/
