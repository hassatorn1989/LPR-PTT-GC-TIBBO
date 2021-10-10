const hexToBinary = require('hex-to-binary');
const converter = require('hex2dec');

const cv_37bit = (faccode, cardnumber) => {
    /*const faccode = converter.hexToDec(hid.substring(0, 8));
    const cardnumber = converter.hexToDec(hid.substring(8, 16));*/

    // Convert 2 bin And pad 0
    const pad_faccode = parseInt(faccode).toString(2).padStart(16, "0");
    const pad_fcardnumber = parseInt(cardnumber).toString(2).padStart(19, "0");

    const fc_concat = pad_faccode + pad_fcardnumber;

    const fc_left = fc_concat.substr(0, 18)
    const fc_right = fc_concat.substr(fc_concat.length - 18)

    const event_parity = (fc_left.replace(/0/g, '').length % 2) == 0 ? 0 : 1;
    const odd_parity = (fc_right.replace(/0/g, '').length % 2) == 0 ? 1 : 0;

    const concat_all = event_parity + fc_concat + odd_parity;
    
    return '5,0,' + parseInt(concat_all, 2).toString(16) ;
}

module.exports = {
    cv_37bit
}

