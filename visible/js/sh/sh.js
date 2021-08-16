var NUM_SH_BANDS = 5;
// Axes (with checkbox?)
// Implement cubemap thing

var SH = function(scene) {
    var specmaterial, diffusematerial, shapematerial;
    var gamma = 1;
    var monochrome = false;
    var currsh = Array(25*3).fill(0);
    for (var i = 0; i < 3; i++) currsh[i] = 1;

    var shcoef = getSHCoefficients();
    var dshcoef = getDiffuseSHCoefficients();
    var currexposure = 1.;
    var exposurestruct = {type: "f", value: currexposure};
    var gammastruct = {type: "f", value: gamma};
    var currmat = 0;
    var axes = new THREE.AxisHelper(2);
    var updatelisteners = [];

    var monosh = Array(25).fill(0);
    monosh[0] = 1;

    var shapes = Array(3);
    var geometry = new THREE.SphereGeometry(1, 64, 64);
    var specmaterial = new THREE.ShaderMaterial({
            uniforms: {
                sh: {type: "fv", value: currsh },
                shc: {type: "fv1", value: shcoef },
                exposure: exposurestruct,
                gamma: gammastruct,
            },
        vertexShader: document.getElementById("SHVertexShader").textContent,
        fragmentShader: document.getElementById("fragmentShader").textContent
        });
    var diffusematerial = new THREE.ShaderMaterial({
            uniforms: {
                sh: {type: "fv", value: currsh },
                shc: {type: "fv1", value: dshcoef },
                exposure: exposurestruct,
                gamma: gammastruct,
            },
        vertexShader: document.getElementById("SHVertexShader").textContent,
        fragmentShader: document.getElementById("fragmentShader").textContent
        });
    var shapematerial = new THREE.ShaderMaterial({
            uniforms: {
                sh: {type: "fv1", value: monosh },
                shc: {type: "fv1", value: shcoef }
            },
        vertexShader: document.getElementById("SHShapeVertexShader").textContent,
        fragmentShader: document.getElementById("LitFragmentShader").textContent
        });

    shapes[0] = new THREE.Mesh(geometry, diffusematerial); 
    shapes[1] = new THREE.Mesh(geometry, specmaterial); 
    shapes[2] = new THREE.Mesh(geometry, shapematerial); 
    scene.add(shapes[currmat]);
    scene.add(axes);

    var update = function() {
        specmaterial.sh = currsh;
        exposurestruct.value = currexposure;
        diffusematerial.sh = currsh;
        exposurestruct.value = currexposure;
        gammastruct.value = gamma;
        for (var i = 0; i < currsh.length; i+=3) monosh[i/3] = currsh[i];
        shapematerial.sh = monosh;
        for (var i = 0; i < updatelisteners.length; i++) {
            updatelisteners[i](currsh, currexposure, currmat);
        }
    };
    var that = {
        updateSHCoefs: function(coefs) {
            for (var i = 0; i < coefs.length; i++) currsh[i] = coefs[i];
            update();
        },
        updateChannelSHCoefs: function(coefs, ch) {
            for (var i = 0; i < coefs.length; i++) currsh[3*i+ch] = coefs[i];
            update();
        },
        switchMaterial: function(material) {
            scene.remove(shapes[currmat]);
            currmat = material;
            scene.add(shapes[currmat]);
        },
        updateExposure: function(e) {
            currexposure = e;
            update();
        },
        setMonochrome: function(mono) {
            monochrome = mono;
            if (monochrome) {
                for (var i = 0; i < currsh.length; i+= 3) {
                    currsh[i+1] = currsh[i];
                    currsh[i+2] = currsh[i];
                }
                update();
            }
        },
        setGamma: function(g) {
            gamma = g;
            update();
        },
        isMonochrome: function() {
            return monochrome;
        },
        getAsURLQueryParams: function() {
            var ret = "sh=" + currsh.join();
            ret += "&exposure=" + currexposure;
            if (currmat > 0) ret += "&viewtype=" + currmat;
            if (gamma != 1) ret += "&gamma=" + gamma;
            return ret;
        },
        onUpdate: function(f) {
            updatelisteners.push(f);
        },

    };
    return that;
};

var init = function(scene) {
};

var remap = function(s) {
    var f = parseFloat(s);
    var fv = Math.abs(f);
    if (fv >= 1) fv = Math.pow(2, fv-1);
    if (f < 0) fv = -fv;
    return fv;
};
var iremap = function(v) {
    var fv = Math.abs(v);
    if (fv >= 1) fv = Math.log(fv)/Math.log(2) + 1;
    if (v < 0) fv = -fv;
    return fv;
};
var populateSliders = function(el, arr, updatefn) {
    var rows = el.getElementsByTagName("tr");
    var z = 0;
    for (var i = 0; i < rows.length; i++) {
        var l = parseInt(rows[i].getAttribute("shl"));
        var m = parseInt(rows[i].getAttribute("shm"));
        var sliderel = rows[i].getElementsByTagName("input")[0];
        var textel = rows[i].getElementsByClassName("slidervalue")[0];
        sliderel.oninput = (function(sel, tel) {
            var fn = (function(idx) {
                return function(v) {
                    arr[idx] = v;
                    updatefn();
                }})(z++);
            return function(e) {
                var v = remap(sel.value);
                fn(v);
                tel.innerHTML = v.toFixed(3);
            };
        })(sliderel, textel);

    }
};
var updateSliderValues = function(el, arr, ch) {
    var rows = el.getElementsByTagName("tr");
    var z = 0;
    for (var i = 0; i < rows.length; i++) {
        var l = parseInt(rows[i].getAttribute("shl"));
        var m = parseInt(rows[i].getAttribute("shm"));
        var idx = l*l+m+l;
        if (ch >= 0) idx = 3*idx + ch;

        var sliderel = rows[i].getElementsByTagName("input")[0];
        var textel = rows[i].getElementsByClassName("slidervalue")[0];

        sliderel.value = iremap(arr[idx]);
        textel.innerHTML = arr[idx].toFixed(3);
    }
};
