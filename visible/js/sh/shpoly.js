var RP2 = 1/(2*Math.sqrt(Math.PI));

var getSHCoefficients = function() {
    var shcoef = Array(36);
    // Band 0
    shcoef[0] = 1;
    // Band 1
    shcoef[1] = -Math.sqrt(3);
    shcoef[2] = Math.sqrt(3);
    shcoef[3] = -Math.sqrt(3);
    // Band 2
    shcoef[4] = Math.sqrt(15);
    shcoef[5] = -Math.sqrt(15);
    shcoef[6] = Math.sqrt(5)/2;
    shcoef[7] = -Math.sqrt(15);
    shcoef[8] = Math.sqrt(15)/2;
    // Band 3
    shcoef[9] = -Math.sqrt(70)/4;
    shcoef[10] = Math.sqrt(105);
    shcoef[11] = -Math.sqrt(42)/4;
    shcoef[12] = Math.sqrt(7)/2;
    shcoef[13] = -Math.sqrt(42)/4;
    shcoef[14] = Math.sqrt(105)/2;
    shcoef[15] = -Math.sqrt(70)/4;
    // Band 4
    shcoef[16] = Math.sqrt(35)*1.5;
    shcoef[17] = -Math.sqrt(70)*0.75;
    shcoef[18] = Math.sqrt(5)*1.5;
    shcoef[19] = -Math.sqrt(10)*0.75;
    shcoef[20] = 0.375;
    shcoef[21] = -Math.sqrt(10)*0.75;
    shcoef[22] = Math.sqrt(5)*0.75;
    shcoef[23] = -Math.sqrt(70)*0.75;
    shcoef[24] = Math.sqrt(35)*0.375;
    for (var i = 0; i < shcoef.length; i++) shcoef[i] *= RP2;
    return shcoef;
};
var getDiffuseSHCoefficients = function() {
    var dshcoef = getSHCoefficients().slice(0);
    // Band 0
    dshcoef[0] *= Math.PI;
    // Band 1
    dshcoef[1] *= 2*Math.PI/3;
    dshcoef[2] *= 2*Math.PI/3;
    dshcoef[3] *= 2*Math.PI/3;
    // Band 2
    dshcoef[4] *= Math.PI/4;
    dshcoef[5] *= Math.PI/4;
    dshcoef[6] *= Math.PI/4;
    dshcoef[7] *= Math.PI/4;
    dshcoef[8] *= Math.PI/4;
    // Band 3
    dshcoef[9] = 0;
    dshcoef[10] = 0;
    dshcoef[11] = 0;
    dshcoef[12] = 0;
    dshcoef[13] = 0;
    dshcoef[14] = 0;
    dshcoef[15] = 0;
    // Band 4
    dshcoef[16] *= -Math.PI/24;
    dshcoef[17] *= -Math.PI/24;
    dshcoef[18] *= -Math.PI/24;
    dshcoef[19] *= -Math.PI/24;
    dshcoef[20] *= -Math.PI/24;
    dshcoef[21] *= -Math.PI/24;
    dshcoef[22] *= -Math.PI/24;
    dshcoef[23] *= -Math.PI/24;
    dshcoef[24] *= -Math.PI/24;
    return dshcoef;
};
