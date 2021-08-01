
import equipos16  from './equipos.js'
import Playoffs from './clases/playoffs.js';


const eurocopa = new Playoffs('Eurocopa', equipos16);


console.log('-----------------------------------');
console.log(`----------${eurocopa.nombre}2020-------------`);
console.log('-----------------------------------');
console.log('                                                              ');

console.log('-------------------------------------------------------------');
console.log(`Da comienzo el sorteo de los octavos de final de la ${eurocopa.nombre}`);
console.log('-------------------------------------------------------------');
console.log('                                                              ');
eurocopa.programarJornadas();
eurocopa.planificacion.forEach((jornada)=> {
    jornada.forEach(partido => {
        console.log(` ${partido.cruce} - ${partido.home} vs ${partido.away}`);
    })
    console.log(`============================`)
});

console.log('                                                              ');
console.log("===== OCTAVOS DE FINAL =====")
console.log('                                                              ');
eurocopa.start();
console.log('                                                              ');
console.log("===== CUARTOS DE FINAL =====")
console.log('                                                              ');

eurocopa.iniPlanificacionCuartos();
eurocopa.setLocalTeamsCuartos();
eurocopa.setAwayTeamsCuartos();
eurocopa.startCuartos();
console.log('                                                              ');
console.log("===== SEMIFINALES =====")
console.log('                                                              ');

eurocopa.iniPlanificacionSemis();
eurocopa.setLocalTeamsSemis();
eurocopa.setAwayTeamsSemis();
eurocopa.startSemis();

console.log('                                                              ');
console.log("===== FINALES =====")
console.log('                                                              ');
eurocopa.iniPlanificacionFinales();
eurocopa.setLocalTeamsFinales();
eurocopa.setAwayTeamsFinales();
eurocopa.startFinales();
console.log('                                                              ');


