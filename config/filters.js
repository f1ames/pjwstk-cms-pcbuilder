var trim = require('trim');

module.exports = {
    regex: {
        ddr: /(ddr)\s*([234]{0,1})/gi,
        manufacturer: /(intel|amd)/gi,
        box: /(micro|mini)*\s*([a|i]tx)/gi,
        size: /^\s*(\d+)\s*(gb|mb)\s*/gi,
        socket: /(Socket|LGA|FCBGA)\s*(((AM|FM)\d\+*)|(\d{3,4}))/gi,
        frequency: /^\s*(\d{3,4})\s*(mhz)*\s*$/gi,
        voltage: /(1|2)(\.|,)(\d{1,2})/gi,
        dimension: /^\s*(([123])(\.|,)(\d))/gi,
        interface: /(Serial)?\s*(ATA|SATA|eSATA|USB)\s*(\/?\d{3}|[23]|III|II)/gi,
        graphic_socket: /(pci)(-e)?(xpress)?\s*(\d\.\d)*\s*(x\d+)*/gi
    },
    /**
    l - to lower
    u - to upper
    t - trim
    L - lower first
    U - upper first
    n - to numeric (e.g. II -> 2)
    */
    format: {
        ddr: 'DDR {2}',
        manufacturer: '{1u}',
        box: '{1U} {2u}',
        size: '{1} {2u}',
        socket: '{1} {2}',
        frequency: '{1} MHz',
        voltage: '{1}.{3}',
        dimension: '{2}.{4}',
        interface: '{1} {2U} {3n}',
        graphic_socket: 'PCI{2u} {5}'
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
            {regex: 'manufacturer', label: 'Typ', amount: 1},
            {regex: 'socket', label: 'Złącze', amount: 1}
        ],
        2: [
            {regex: 'ddr', label: 'Rodzaj', amount: 1},
            {regex: 'size', label: 'Pojemność', amount: 1},
            {regex: 'frequency', label: 'Taktowanie'},
            {regex: 'voltage', label: 'Napięcie', amount: 1}
        ],
        3: [],
        4: [
            {regex: 'dimension', label: 'Rozmiar'},
            {regex: 'interface', label: 'Interfejs'}
        ],
        5: [
            {regex: 'box', label: 'Rozmiar'}
        ],
        6: [], //na razie puste
        7: [
            {regex: 'graphic_socket', label: 'Złącze'}
        ],
        8: [],
        9: [],
        10: [],
        11: [],
        12: [],
        13: [],
        14: [],
        15: []
    },
    matches: function(regexName, value) {
        if (!this.regex[regexName]) {
            return false;
        }
        return value.search(this.regex[regexName]) !== -1;
    },
    formatValue: function(regexName, value) {
        if (!this.regex[regexName]) {
            return value;
        }
        return this._formatValue(regexName, (new RegExp(this.regex[regexName])).exec(value), value);
    },
    _formatValue: function(regexName, regexResult, value) {
        if (!this.format[regexName]) {
            return regexResult[0] || value;
        }

        var result = this.format[regexName],
            matches = result.match(/{\d\w*}/gi);
        for (var i in matches) {
            var inside = matches[i].substr(1, matches[i].length - 2),
                index = inside[0],
                value = regexResult[index] || '';

            if (value.length) {
                inside = inside.substr(1);
                for (var j in inside) {
                    value = this._postFormat(value, inside[j]);
                }
            }
            result = result.replace(matches[i], value);
        }
        return trim(result);
    },
    _postFormat: function(value, action) {
        var newValue = value;
        switch(action) {
            case 'l':
                newValue = newValue.toLowerCase();
                break;
            case 'L':
                newValue = newValue.charAt(0).toLowerCase() + newValue.slice(1);
                break;
            case 'u':
                newValue = newValue.toUpperCase();
                break;
            case 'U':
                newValue = newValue.charAt(0).toUpperCase() + newValue.slice(1);
                break;
            case 't':
                newValue = trim(newValue);
                break;
            case 'n':
                newValue = this._toNumeric(newValue);
                break;
        }
        return newValue;
    },
    _toNumeric: function(value) {
        return value.replace(/i/gi, '').length == 0 ? value.length : value;
    }
};
/*
1. sprawdza z jakiej kategorii jest sprzęt i wyciąga czego szukać
2. najpierw sprawdza czy dane pole pasuje do któregoś regex'a
3. dodatkowo sprawdza czy dla tej kategorii i dla tego regex'a ma być 
    odróżnianie po labelu (jeżeli jeden regex pasuje do dwóch pól bo inaczej dla danej kategorii to będzie wiadomo o co chodzi)
*/
