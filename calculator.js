function activateInput(inputId){
    document.getElementById(inputId).disabled=false;
}

function deactivateInput(inputId){
    let input=document.getElementById(inputId)
    input.disabled=true;   
    input.value='';
}

function triggerCheckBox(checkBoxId, inputId){
    let checkbox = document.getElementById(checkBoxId);
    if(checkbox.checked){
        activateInput(inputId);
    } else {
        deactivateInput(inputId);
    }
}

function activateEvents(checkBoxId, inputId){
    var cb = document.getElementById(checkBoxId);
    cb.onclick= function(){
        triggerCheckBox(checkBoxId, inputId);
    };    
}

function addProportionalDevolutionOrPayment(dom_day, spa_value, dd_day, mm_month){
    if(dd_day>dom_day){
        if([2,4,6,9,11].includes(mm_month)){
            return (30-dd_day+dom_day)/30*spa_value;
        } else {
            return (31-dd_day+dom_day)/31*spa_value;
        }
    } else {
        if([2,4,6,9,11].includes(mm_month)){
            return (dom_day-dd_day)/30*spa_value;
        } else {
            return (dom_day-dd_day)/31*spa_value;
        }
    }
}

function extractFloat(stringText){
    if(stringText===''){
        return 0;
    } else {
        return parseFloat(stringText);
    }
}

function additionalProportionals(now_int, valor_SVA, dom, mm_month){
    if([2,4,6,9,11].includes(mm_month)){
        if(now_int > dom){
            return valor_SVA*(dom+30-now_int)/30;
        } else {
            return valor_SVA*(dom-now_int)/30;
        }
    } else {
        if(now_int > dom){
            return valor_SVA*(dom+31-now_int)/31;
        } else {
            return valor_SVA*(dom-now_int)/31;
        }
    }
       
}

function calculateProportionals(){
    
    let dom = parseFloat(document.getElementById("DOM").value.replaceAll(".",""));
    let spa = parseFloat(document.getElementById("SPA").value.replaceAll(".",""));
    let spn = parseFloat(document.getElementById("SPN").value.replaceAll(".",""));
    let dcto = document.getElementById("dcto:").value.replaceAll(".","");
    let SVAa = document.getElementById("SVAa:").value.replaceAll(".","");
    let SVAn = document.getElementById("SVAn:").value.replaceAll(".","");
    let CI = document.getElementById("CI:").value.replaceAll(".","");
    let message = "<div id=\"popupCloseButton\" class=\"popupCloseButton\" onclick=\"deactivateMessage();\">&times;</div>";
    message+="<div class=\"scrollable\"><h1 class=\"Title\"> Resultados </h1><br>";
    message += "<table class=\"table table-striped\"><tr><th>Descripción</th><th>Valor</th></tr>";
    let today = new Date();
    let dd = parseFloat(String(today.getDate()).padStart(2, '0'));
    let mm = parseFloat(String(today.getMonth() + 1).padStart(2, '0'));

    /*This code adds the proportional devolution*/
    message+="<tr><td>Monto devolución proporcionales</td><td>"+Number(Number(addProportionalDevolutionOrPayment(dom, spa, dd, mm)).toFixed(0)).toLocaleString()+"</td></tr>";
    message+="<tr><td>Monto cobro proporcionales</td><td>"+Number(Number(addProportionalDevolutionOrPayment(dom, spn, dd, mm)).toFixed(0)).toLocaleString()+"</td></tr>";

    CI=extractFloat(CI);
    SVAa=extractFloat(SVAa);
    if(SVAn===''){
        message+="<tr><td>Proporcional servicio adicional</td><td>No aplica</td></tr>";
        if(dom!==dd){
            message+="<tr><td>Monto total a pagar en la siguiente boleta luego del cambio de plan</td><td>"+Number(Number(spn - addProportionalDevolutionOrPayment(dom, spa, dd, mm) + addProportionalDevolutionOrPayment(dom, spn, dd, mm) + SVAa - dcto + CI).toFixed(0)).toLocaleString()+"</td></tr>";
        } else {
            message+="<tr><td>Como ya se le emitió su boleta con el plan anterior el monto a pagar en su siguiente boleta es</td><td>"+Number(Number(spa + SVAa).toFixed(0)).toLocaleString()+"</td></tr>";
        }
    } else {
        SVAn=extractFloat(SVAn);
        message+="<tr><td>Proporcional servicio adicional</td><td>"+Number(Number(additionalProportionals(dd, SVAn, dom, mm)).toFixed(0)).toLocaleString()+"</td></tr>";
        if(dom!==dd){
            message+="<tr><td>Monto total a pagar en la siguiente boleta luego del cambio de plan</td><td>"+ Number(Number(spn - addProportionalDevolutionOrPayment(dom, spa, dd, mm) + addProportionalDevolutionOrPayment(dom, spn, dd, mm) + additionalProportionals(dd, SVAn, dom, mm) + SVAa-dcto + CI).toFixed(0)).toLocaleString()+"</td></tr>";
        } else {
            message+="<tr><td>Como ya se le emitió su boleta con el plan anterior el monto a pagar en su siguiente boleta es</td><td>"+Number(Number(spa + SVAa).toFixed(0)).toLocaleString()+"</td></tr>";
        }
    }
    message+="</table></div>";
    message = message.replaceAll(".",",");
    if(document.getElementById("DOM").value!=='' && document.getElementById("SPA").value && document.getElementById("SPN").value){
        document.getElementById("message").innerHTML=message;    
        document.getElementById("message").style.display="grid";
        document.getElementById("hover_bkgr_fricc").style.display="block";
    }
    
}

activateEvents("dcto_cb:","dcto:");
activateEvents("SVAa_cb:","SVAa:");
activateEvents("SVAn_cb:","SVAn:");
activateEvents("CI_cb:","CI:");

var calculator = document.getElementById("Calculadora");
calculator.onsubmit = function () {
    return false;
};

var submit_button = document.getElementById("submit_button");
submit_button.onclick = function(){
    calculateProportionals();
};

function deactivateMessage(){
    document.getElementById("hover_bkgr_fricc").style.display="none";
}

function adjustText(element, type) {
    if(element.value.includes('-')){
        element.value='';
    }

    if(type=="dom"){
        if ((parseFloat(element.value)<=0) || (parseFloat(element.value)>=31)){
            element.value='';
        }
    }

    element.value = parseInt(element.value.replaceAll(".","")).toLocaleString();
}

var dom = document.getElementById("DOM");

dom.onchange = function () { 
    adjustText(dom, "dom");
};

var spa = document.getElementById("SPA");

spa.onchange = function () { 
    adjustText(spa, "other");
};

var spn = document.getElementById("SPN");

spn.onchange = function () { 
    adjustText(spn, "other");
};

var dcto = document.getElementById("dcto:");


dcto.onchange = function () { 
    adjustText(dcto, "other");
};

var SVAa = document.getElementById("SVAa:");

SVAa.onchange = function () { 
    adjustText(SVAa, "other");
};

var SVAn = document.getElementById("SVAn:");

SVAn.onchange = function () { 
    adjustText(SVAn, "other");
};

var CI = document.getElementById("CI:");

CI.onchange = function () { 
    adjustText(CI, "other");
};

function activateSection(id){
    document.getElementById(id).style.display="block";
}

function deactivateSection(id){
    document.getElementById(id).style.display="none";
}

var SVAa_selected = document.getElementById("SVAa_yes");
SVAa_selected.onclick = function () {
    document.getElementById("SVAa_yes").className="selected_option";
    document.getElementById("SVAa_not").className="unselected_option";
    activateSection("add_SVAa_section");
};

var SVAa_not_selected = document.getElementById("SVAa_not");
SVAa_not_selected.onclick = function () {
    document.getElementById("SVAa_yes").className="unselected_option";
    document.getElementById("SVAa_not").className="selected_option";
    deactivateSection("add_SVAa_section");
};

var SVAn_selected = document.getElementById("SVAn_yes");
SVAn_selected.onclick = function () {
    document.getElementById("SVAn_yes").className="selected_option";
    document.getElementById("SVAn_not").className="unselected_option";
    activateSection("add_SVAn_section");
};

var SVAn_not_selected = document.getElementById("SVAn_not");
SVAn_not_selected.onclick = function () {
    document.getElementById("SVAn_yes").className="unselected_option";
    document.getElementById("SVAn_not").className="selected_option";
    deactivateSection("add_SVAn_section");
};

/**
 * Activate SVA's inputs
 */

activateEvents("SVAa_cb:dbox","SVAa:dbox");
activateEvents("SVAn_cb:dbox","SVAn:dbox");

activateEvents("SVAa_cb:cp","SVAa:cp");
activateEvents("SVAn_cb:cp","SVAn:cp");

activateEvents("SVAa_cb:av","SVAa:av");
activateEvents("SVAn_cb:av","SVAn:av");

activateEvents("SVAa_cb:ex","SVAa:ex");
activateEvents("SVAn_cb:ex","SVAn:ex");

activateEvents("SVAa_cb:ot","SVAa:ot");
activateEvents("SVAn_cb:ot","SVAn:ot");

/**
 * Update the SVA totals with changes
 */

function transformToNumber(string_x){
    if(string_x===''){
        return 0;
    } else {
        return parseFloat(string_x.replaceAll(".",""));
    }
}

function updateSection(type){
    dbox=transformToNumber(document.getElementById(type+"dbox").value);
    premium=transformToNumber(document.getElementById(type+"cp").value);
    assistance=transformToNumber(document.getElementById(type+"av").value);
    extensor=transformToNumber(document.getElementById(type+"ex").value);
    others=transformToNumber(document.getElementById(type+"ot").value);

    document.getElementById(type).value=parseFloat(dbox+premium+assistance+extensor+others).toLocaleString();
}

document.getElementById("SVAa:dbox").onchange = function () {
    updateSection("SVAa:");
    adjustText(document.getElementById("SVAa:dbox"), "other");
};

document.getElementById("SVAn:dbox").onchange = function () {
    updateSection("SVAn:");
    adjustText(document.getElementById("SVAn:dbox"), "other");
};

document.getElementById("SVAa:cp").onchange = function () {
    updateSection("SVAa:");
    adjustText(document.getElementById("SVAa:cp"), "other");
};

document.getElementById("SVAn:cp").onchange = function () {
    updateSection("SVAn:");
    adjustText(document.getElementById("SVAn:cp"), "other");
};

document.getElementById("SVAa:av").onchange = function () {
    updateSection("SVAa:");
    adjustText(document.getElementById("SVAa:av"), "other");
};

document.getElementById("SVAn:av").onchange = function () {
    updateSection("SVAn:");
    adjustText(document.getElementById("SVAn:av"), "other");
};

document.getElementById("SVAa:ex").onchange = function () {
    updateSection("SVAa:");
    adjustText(document.getElementById("SVAa:ex"), "other");
};

document.getElementById("SVAn:ex").onchange = function () {
    updateSection("SVAn:");
    adjustText(document.getElementById("SVAn:ex"), "other");
};

document.getElementById("SVAa:ot").onchange = function () {
    updateSection("SVAa:");
    adjustText(document.getElementById("SVAa:ot"), "other");
};

document.getElementById("SVAn:ot").onchange = function () {
    updateSection("SVAn:");
    adjustText(document.getElementById("SVAn:ot"), "other");
};
