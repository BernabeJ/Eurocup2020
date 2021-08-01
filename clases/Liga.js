//definimos clase reutilizable para diferentes clases de Ligas

Array.prototype.shuffle = function () {
    var i = this.length, j, temp;
    if (i == 0) return this;
    while (--i) {
        j = Math.floor(Math.random() * (i + 1));
        temp = this[i];
        this[i] = this[j];
        this[j] = temp;
    }
    return this;
}


export default class Liga{
    constructor(nombre, equipos = [], config = {}) {
        this.nombre = nombre;
        this.planificacion = [];
        this.planificacionCuartos = [];
        this.planificacionSemis = [];
        this.planificacionFinales = [];
        this.setup(config);
        this.setupEquipos(equipos);
    }

    //creamos variable de configuracion por defecto

    setup(config) {
        const defaultConfig = { rounds: 1 }
        this.config = Object.assign(defaultConfig, config)
    }

    setupEquipos(equipos) {
        this.equipos = [];
        this.equiposClasificados = [];
        for (const nombreEquipo of equipos) {
            const equipo = this.customizeEquipos(nombreEquipo);
            this.equipos.push(equipo);
        }

        this.equipos.shuffle();
    }


    customizeEquipos(nombreEquipo) {
        return {
            nombre: nombreEquipo,
            partidosGanados: 0,
            partidosEmpatados: 0,
            partidosPerdidos: 0,
        }
    }

    // método para generar la planificación
    programarJornadas() {
        this.iniPlanificacion();
        this.asignarEquiposLocal();
        this.asignarEquiposvisitante();
        this.alternarEquipos();
        //si hay mas de una ronda
        if (this.config.rounds > 1) {
            //para cada ronda extra
            for (let i = 1; i < this.config.rounds; i++){
                const nuevaRound = [];
                //si la ronda es par
                if (i % 2 !== 0) {
                    for (const diaPartido of this.planificacion) {
                        const nuevoDiaPartido = [];
                        for (const partido of diaPartido) {
                            const copyPartido = {...partido}
                            const equipoLocal = partido.home;
                            partido.home = partido.away;
                            partido.away = equipoLocal;

                            nuevoDiaPartido.push(copyPartido);
                        }

                        nuevaRound.push(nuevoDiaPartido);
                    }
                }
                nuevaRound.forEach(diaPartido => this.planificacion.push(diaPartido));

            }
        }
    }

    crearRonda() {
        const ronda = [];

    }

    iniPlanificacion() {
        const numeroJornadas = this.getTeamNamesForPlanificacion - 1;
        const partidosJornadas = this.equipos.length / 2;

        for (let i = 0; i < numeroJornadas; i++){
            const jornada = []; 
            for (let j = 0; j < partidosJornadas; j++) {
                const partido = {
                    cruce: `Q${j + 1}`,home: 'Home', away: 'Away', 
                };
                jornada.push(partido);
                };
            
                this.planificacion.push(jornada)
        }
    }

    getTeamNames() {
        return this.equiposClasificados.map(equipo => equipo.nombre);
    }

    getTeamNamesForPlanificacion() {
        const nombreEquipos = this.getTeamNames();
        if (this.equiposClasificados.length % 2 === 0) {
            return nombreEquipos;
        } else {
            return [...nombreEquipos, null];
        }
    }

    getMaxEquiposLocal() {
        return this.equiposClasificados.length - 2;
    }

    asignarEquiposLocal() {
        const nombreEquipos = this.getTeamNamesForPlanificacion();
        let equipoIndex = 0;
        const maxEquiposLocal = nombreEquipos.length - 2;
        this.planificacion.forEach(diaPartido => {
            diaPartido.forEach(partido => {
                partido.home = nombreEquipos[equipoIndex];
                equipoIndex++;
                if (equipoIndex > maxEquiposLocal) {
                    equipoIndex = 0;
                }
            })
        })
    }

    asignarEquiposvisitante() {
        const nombreEquipos = this.getTeamNamesForPlanificacion();
        const maxEquiposLocal = this.getMaxEquiposLocal();
        let equipoIndex = maxEquiposLocal;
        this.planificacion.forEach(diaPartido => {
            let primerPartido = true;
            diaPartido.forEach(partido => {
                if (primerPartido) {
                    partido.away = nombreEquipos[nombreEquipos.length - 1]
                    primerPartido = false
                } else {
                    partido.away = nombreEquipos[equipoIndex]
                    equipoIndex--;
                    if (equipoIndex < 0) {
                        equipoIndex = maxEquiposLocal
                    }
                }
            })
        })
        
    }

    alternarEquipos(ronda) {
        let numerodiaPartido = 1;
        this.planificacion.forEach(diaPartido => {
            const primerPartido = diaPartido[0];
            if (numerodiaPartido % 2 === 0) {
                const awayEquipo = primerPartido.away;
                primerPartido.away = primerPartido.home;
                primerPartido.home = awayEquipo;
            }
            numerodiaPartido++;
        })
    }

    start() {
        
        //para cada partido de la eliminatorio
        for (const diaPartido of this.planificacion) {
            for (const partido of diaPartido) {
                const result = this.play(partido);
            
                //actualizamos los equipos que han pasado la eliminatoria
                this.updateTeams(result);
               
                // this.planificacion(jornada);
               
            }
        }  
    }

   
    startCuartos(){
     //para cada partido de la eliminatorio
        for (const diaPartido of this.planificacionCuartos) {
            for (const partido of diaPartido) {
                const result = this.playCuartos(partido);
                
                //actualizamos los equipos que han pasado la eliminatoria
                 this.updateTeamsCuartos(result);
            }
        }
    }
    
    startSemis(){
     //para cada partido de la eliminatorio
        for (const diaPartido of this.planificacionSemis) {
            for (const partido of diaPartido) {
                const result = this.playSemis(partido);
                
                //actualizamos los equipos que han pasado la eliminatoria
                 this.updateTeamsSemis(result);
                     
            }
        }
    }
    

    startFinales(){
     //para cada partido de la eliminatorio
        for (const diaPartido of this.planificacionFinales) {
            for (const partido of diaPartido) {
                const result = this.playFinales(partido);
                
                //actualizamos los equipos que han pasado la eliminatoria
                 this.updateTeamsFinales(result);
                         
            }
        }
}
 

    play(partido) {
        throw new Error('play  method is not implemented')
    }

    updateTeams(result) {
        throw new Error('updateTeams method is not implemented')
    }
}