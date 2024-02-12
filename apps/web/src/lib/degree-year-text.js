"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.degreeYearText = void 0;
function degreeYearText(degreeYears) {
    var degreeYearTextSidebar = "";
    if (degreeYears.length == 0) {
        degreeYearTextSidebar = "alle";
    }
    return degreeYearTextSidebar;
}
exports.degreeYearText = degreeYearText;
function findSequence() {
}
console.log(degreeYearText([]));
