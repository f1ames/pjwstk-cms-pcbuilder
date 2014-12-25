module.exports = {
    regex: {
        ddr: /(ddr)\s*([234]{0,1})/gi,
        manufacturer: /(intel)|(amd)/gi,
        box: /(micro|mini)*\s*([a|i]tx)/gi,
        size: /(\d+)\s*(gb|mb)/gi,
        socket: /(Socket|LGA|FCBGA)\s*(((AM|FM)\d\+*)|(\d{3,4}))/gi,
        frequency: /(\d{3,4})\s*(mhz)*/gi,
        voltage: /(1(\.|,)(35|5))/gi,
        dimension: /([123](\.|,)\d)/gi,
        interface: /(e?S|(Serial\s*))?ATA\s*(\d{3}|[23]|III|II)|(USB\s*\d(\.\d)?)/gi
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
            {regex: 'manufacturer', label: 'Typ'},
            {regex: 'socket', label: 'Złącze'}
        ],
        2: [
            {regex: 'ddr', label: 'Rodzaj'},
            {regex: 'size', label: 'Pojemność'},
            {regex: 'frequency', label: 'Taktowanie'},
            {regex: 'voltage', label: 'Napięcie'}
        ],
        3: [],
        4: [
            {regex: 'dimension', label: 'Rozmiar'},
            {regex: 'interface', label: 'Interfejs'}
        ],
        5: []
    }
};
/*
1. sprawdza z jakiej kategorii jest sprzęt i wyciąga czego szukać
2. najpierw sprawdza czy dane pole pasuje do któregoś regex'a
3. dodatkowo sprawdza czy dla tej kategorii i dla tego regex'a ma być 
    odróżnianie po labelu (jeżeli jeden regex pasuje do dwóch pól bo inaczej dla danej kategorii to będzie wiadomo o co chodzi)
*/
