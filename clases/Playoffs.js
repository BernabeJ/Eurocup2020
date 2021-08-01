import Liga from './Liga.js'

export default class Playoffs extends Liga{
    constructor(nombre, equipos = [], config) {
        super(nombre, equipos, config);
        
    }

    setup(config) {
        const defaultConfig = {
            rounds: 1,
            pointsPerWin: 3,
            pointsPerLose: 0,
            
        }
        this.config = Object.assign(defaultConfig, config)
    }

    customizeEquipos(nombreEquipo) {
        //llamamos al metodo padre
        const customizeEquipos = super.customizeEquipos(nombreEquipo);
        //devolver un objeto con las propiedades del padre y añadimos objeto puntos, goles a favot, etc..
        return {
            ...customizeEquipos,
            golesaFavor:0,
            golesEncontra: 0,
            points:0,
        }
    }

    
    iniPlanificacion() {
        this.equiposClasificados = this.equipos.filter(equipo => equipo.points === 0);
        const partidosJornadas = this.equiposClasificados.length / 2;
        const jornada = [];
        for (let j = 0; j < partidosJornadas; j++) {
                const partido = {
                    cruce: `Q${j + 1}`, home: 'Home', away: 'Away', 
                };
                jornada.push(partido);
                };
            

            this.planificacion.push(jornada)
            
    }
    
    generarGoles() {
        return Math.floor(Math.random() * 10);
    }

    play(partido) {
        let golesHome = this.generarGoles();
        let golesAway = this.generarGoles();
        while (golesHome === golesAway) {
            golesHome = this.generarGoles();
            golesAway = this.generarGoles();
        } 
        golesHome = golesHome;
        golesAway = golesAway;
        
            return {
                cruce: partido.cruce,
                home: partido.home,
                golesHome,
                away: partido.away,
                golesAway,
            }
        
    }
    
    
    
    getNombreDeEquipo(nombre) {
        return this.equiposClasificados.find(equipo => equipo.nombre === nombre)
    }
    
    //actualiza las métricas de los equipos en función del marcador
    updateTeams(result) {
        
        var jornada = [];
        const partidosJornadas = this.equiposClasificados.length / 2;
        //quedarnos con los equipos que ganan;
        const home = this.getNombreDeEquipo(result.home);
        const away = this.getNombreDeEquipo(result.away);
        

        //actualizamos metricas de goles
        home.cruce = result.cruce
        away.cruce = result.cruce
        home.golesaFavor += result.golesHome
        home.golesEncontra += result.golesAway
        away.golesaFavor += result.golesAway
        away.golesEncontra += result.golesHome



        console.log(`${result.cruce} - ${home.nombre} : ${home.golesaFavor} VS ${away.nombre} : ${away.golesaFavor}`);

        if (result.golesHome > result.golesAway) {
            home.points += this.config.pointsPerWin;
            away.points += this.config.pointsPerLose;   // si tenemos un valor diferente de 0
            home.partidosGanados++;
            away.partidosPerdidos++;
        } else if (result.golesAway > result.golesHome) {
            away.points += this.config.pointsPerWin;
            home.points += this.config.pointsPerLose; // si tenemos un valor diferente de 0
            home.partidosPerdidos++;
            away.partidosGanados++;

        
            
            
        }
        
        if (result.golesHome > result.golesAway) {
                jornada.push(home)
            } else (
                    jornada.push(away)
                )
                
            console.log('Pasa a la siguiente Ronda', jornada[0].nombre);
       
   
            
            
        jornada = this.equiposClasificados.filter(equipo => equipo.points !== 0);
        
        
    
    }
    

    iniPlanificacionCuartos() {
        let index = 8;
        this.equiposClasificados = this.equiposClasificados.filter(equipo => equipo.points !== 0);
        const jornada = [];
        const partidosJornadas = 8 / 2;
            for (let j = 0; j < partidosJornadas; j++) {
                const partido = {
                    cruce: `Q${j + 1} vs Q${index -j}`, home: 'Home', away: 'Away',
                };
                jornada.push(partido);
            };
        
        this.planificacionCuartos.push(jornada)

    //ordenamos el array de los equipos
        this.equiposClasificados.sort((a, b) => {
            if (a.cruce < b.cruce) {
                return -1;
            }
            if (a.cruce > b.cruce) {
                return 1;
            }
            return 0;
        });

        
        
        
      
     }
   
    setLocalTeamsCuartos() {
        const teamNames = this.getTeamNamesForPlanificacion();
       
        let teamIndex = 0;
        const maxHomeTeams = 6;
        this.planificacionCuartos.forEach(partido => {
            partido.forEach(partido => {
                partido.home = teamNames[teamIndex];
                teamIndex++;
                if (teamIndex > maxHomeTeams) {
                    teamIndex = 0;
                }
            }
                 
             )
         })
     }
  
    setAwayTeamsCuartos() {
        const maxHomeTeams = 6;
        const teamsNames = this.getTeamNamesForPlanificacion();
        let teamIndex = maxHomeTeams;
        this.planificacionCuartos.forEach(partido => {
            let isFirstMatch = true;
            partido.forEach(partido => {
                if (isFirstMatch) {
                    partido.away = teamsNames[teamsNames.length - 1];
                    isFirstMatch = false;
                } else {
                    partido.away = teamsNames[teamIndex]
                    teamIndex--;
                    if (teamIndex < 0) {
                        teamIndex = 6
                    }
                }
                })
        })
    }

  

    playCuartos(partido) {
        let golesHomeCuartos = this.generarGoles();
        let golesAwayCuartos = this.generarGoles();
        if (golesHomeCuartos!== golesAwayCuartos) {
            golesHomeCuartos = golesHomeCuartos;
            golesAwayCuartos = golesAwayCuartos;
        } else {
            golesHomeCuartos = this.generarGoles();
            golesAwayCuartos = this.generarGoles();
        }
            return {
                cruce: partido.cruce,
                home: partido.home,
                golesHomeCuartos,
                away: partido.away,
                golesAwayCuartos,
            }
        
    }

     getNombreDeEquipoCuartos(nombre) {
        return this.equiposClasificados.find(equipo => equipo.nombre === nombre)
    }
    
    //actualiza las métricas de los equipos en función del marcador
    updateTeamsCuartos(result) {
        
        var equipo = [];
        var jornadaSemis = [];
        const partidosJornadas = this.equiposClasificados.length / 2;
        //quedarnos con los equipos que ganan;
        const home = this.getNombreDeEquipoCuartos(result.home);
        const away = this.getNombreDeEquipoCuartos(result.away);
        

        //actualizamos metricas de goles
        home.cruce = result.cruce
        away.cruce = result.cruce
        home.golesaFavor = result.golesHomeCuartos
        home.golesEncontra = result.golesAwayCuartos
        away.golesaFavor = result.golesAwayCuartos
        away.golesEncontra = result.golesHomeCuartos



        console.log(`${result.cruce} - ${home.nombre} : ${home.golesaFavor} VS ${away.nombre} : ${away.golesaFavor}`);

        if (result.golesHomeCuartos > result.golesAwayCuartos) {
            home.points += this.config.pointsPerWin;
            away.points += this.config.pointsPerLose;   // si tenemos un valor diferente de 0
            home.partidosGanados++;
            away.partidosPerdidos++;
        } else if (result.golesAwayCuartos > result.golesHomeCuartos) {
            away.points += this.config.pointsPerWin;
            home.points += this.config.pointsPerLose; // si tenemos un valor diferente de 0
            home.partidosPerdidos++;
            away.partidosGanados++;

        
            
            
        }
        
        if (result.golesHomeCuartos > result.golesAwayCuartos) {
                jornadaSemis.push(home)
            } else (
                    jornadaSemis.push(away)
                )
                
            console.log('Pasa a Semifinales', jornadaSemis[0].nombre);
       
   
            
            
        jornadaSemis = this.equiposClasificados.filter(equipo => equipo.partidosGanados !== 1);

        
        
    
    }

    //iniciamos Semifinales

       iniPlanificacionSemis() {
        this.equiposClasificados = this.equiposClasificados.filter(equipo => equipo.partidosGanados !== 1);
        const jornada = [];
        const partidosJornadas = 4 / 2;
            for (let j = 0; j < partidosJornadas; j++) {
                const partido = {
                    cruce: `Semifinales ${j + 1}`, home: 'Home', away: 'Away',
                };
                jornada.push(partido);
            };
        
        this.planificacionSemis.push(jornada)
        
    //Ordenamos de nuevo el array de equipos
        this.equiposClasificados.sort((a, b) => {
            if (a.cruce < b.cruce) {
                return -1;
            }
            if (a.cruce > b.cruce) {
                return 1;
            }
            return 0;
        });
        
       
        
        
      
     }
   
    setLocalTeamsSemis() {
        const teamNames = this.equiposClasificados.map(equipo => equipo.nombre);
        let teamIndex = 0;
        const maxHomeTeams = 2;
        this.planificacionSemis.forEach(partido => {
            partido.forEach(partido => {
                partido.home = teamNames[teamIndex];
                teamIndex++;
                if (teamIndex > maxHomeTeams) {
                    teamIndex = 0;
                }
            }
                 
             )
         })
     }
  
    setAwayTeamsSemis() {
        const maxHomeTeams = 2;
        const teamsNames = this.equiposClasificados.map(equipo => equipo.nombre);
        let teamIndex = maxHomeTeams;
        this.planificacionSemis.forEach(partido => {
            let isFirstMatch = true;
            partido.forEach(partido => {
                if (isFirstMatch) {
                    partido.away = teamsNames[teamsNames.length - 1];
                    isFirstMatch = false;
                } else {
                    partido.away = teamsNames[teamIndex]
                    teamIndex--;
                    if (teamIndex < 0) {
                        teamIndex = 2
                    }
                }
                })
            })        
    }

   
    playSemis(partido) {
        let golesHomeSemis = this.generarGoles();
        let golesAwaySemis = this.generarGoles();
        if (golesHomeSemis!== golesAwaySemis) {
            golesHomeSemis = golesHomeSemis;
            golesAwaySemis = golesAwaySemis;
        } else {
            golesHomeSemis = this.generarGoles();
            golesAwaySemis = this.generarGoles();
        }
            return {
                cruce: partido.cruce,
                home: partido.home,
                golesHomeSemis,
                away: partido.away,
                golesAwaySemis,
            }
        
    }

     getNombreDeEquipoSemis(nombre) {
        return this.equiposClasificados.find(equipo => equipo.nombre === nombre)
    }
    
    //actualiza las métricas de los equipos en función del marcador
    updateTeamsSemis(result) {
        
        var jornadaFinal = [];
        const partidosJornadas = this.equiposClasificados.length / 2;
        //quedarnos con los equipos que ganan;
        const home = this.getNombreDeEquipoSemis(result.home);
        const away = this.getNombreDeEquipoSemis(result.away);
        

        //actualizamos metricas de goles
        home.cruce = result.cruce
        away.cruce = result.cruce
        home.golesaFavor = result.golesHomeSemis
        home.golesEncontra = result.golesAwaySemis
        away.golesaFavor = result.golesAwaySemis
        away.golesEncontra = result.golesHomeSemis



        console.log(`${result.cruce} - ${home.nombre} : ${home.golesaFavor} VS ${away.nombre} : ${away.golesaFavor}`);

        if (result.golesHomeSemis > result.golesAwaySemis) {
            home.points += this.config.pointsPerWin;
            away.points += this.config.pointsPerLose;   // si tenemos un valor diferente de 0
            home.partidosGanados++;
            away.partidosPerdidos++;
        } else if (result.golesAwaySemis > result.golesHomeSemis) {
            away.points += this.config.pointsPerWin;
            home.points += this.config.pointsPerLose; // si tenemos un valor diferente de 0
            home.partidosPerdidos++;
            away.partidosGanados++;

        
            
            
        }
        
        if (result.golesHomeSemis > result.golesAwaySemis) {
                jornadaFinal.push(home)
            } else (
                    jornadaFinal.push(away)
                )
                
            console.log('Pasa a la Final', jornadaFinal[0].nombre);
       
   
            
            
        jornadaFinal = this.equiposClasificados.filter(equipo => equipo.partidosGanados !== 2);

        
        
    
    }

      //iniciamos Finales

       iniPlanificacionFinales() {
        this.equiposClasificados = this.equiposClasificados.filter(equipo => equipo.partidosGanados !== 2);
       
        const jornada = [];
        const partidosJornadas = 1;
            for (let j = 0; j < partidosJornadas; j++) {
                const partido = {
                    cruce: `Final ${j + 1}`, home: 'Home', away: 'Away',
                };
                jornada.push(partido);
            };
        
        this.planificacionFinales.push(jornada)
        
        
        
      
     }
   
    setLocalTeamsFinales() {
        const teamNames = this.equiposClasificados.map(equipo => equipo.nombre);
        let teamIndex = 0;
        const maxHomeTeams = 1;
        this.planificacionFinales.forEach(partido => {
            partido.forEach(partido => {
                partido.home = teamNames[teamIndex];
                teamIndex++;
                if (teamIndex > maxHomeTeams) {
                    teamIndex = 0;
                }
            }
                 
             )
         })
     }
  
    setAwayTeamsFinales() {
        const maxHomeTeams = 1;
        const teamsNames = this.equiposClasificados.map(equipo => equipo.nombre);
        let teamIndex = maxHomeTeams;
        this.planificacionFinales.forEach(partido => {
            let isFirstMatch = true;
            partido.forEach(partido => {
                if (isFirstMatch) {
                    partido.away = teamsNames[teamsNames.length - 1];
                    isFirstMatch = false;
                } else {
                    partido.away = teamsNames[teamIndex]
                    teamIndex--;
                    if (teamIndex < 0) {
                        teamIndex = 1
                    }
                }
                })
            })        
    }

    //     generarGoles() {
    //     return Math.floor(Math.random() * 10);Semis
    playFinales(partido) {
        let golesHomeFinales = this.generarGoles();
        let golesAwayFinales = this.generarGoles();
        if (golesHomeFinales!== golesAwayFinales) {
            golesHomeFinales = golesHomeFinales;
            golesAwayFinales = golesAwayFinales;
        } else {
            golesHomeFinales = this.generarGoles();
            golesAwayFinales = this.generarGoles();
        }
            return {
                cruce: partido.cruce,
                home: partido.home,
                golesHomeFinales,
                away: partido.away,
                golesAwayFinales,
            }
        
    }

     getNombreDeEquipoFinales(nombre) {
        return this.equiposClasificados.find(equipo => equipo.nombre === nombre)
    }
    
    //actualiza las métricas de los equipos en función del marcador
    updateTeamsFinales(result) {
        
        
        var jornadaGanador = [];
        const partidosJornadas = this.equiposClasificados.length / 2;
        //quedarnos con los equipos que ganan;
        const home = this.getNombreDeEquipoFinales(result.home);
        const away = this.getNombreDeEquipoFinales(result.away);
        

        //actualizamos metricas de goles
        home.cruce = result.cruce
        away.cruce = result.cruce
        home.golesaFavor = result.golesHomeFinales
        home.golesEncontra = result.golesAwayFinales
        away.golesaFavor = result.golesAwayFinales
        away.golesEncontra = result.golesHomeFinales



        console.log(`${result.cruce} - ${home.nombre} : ${home.golesaFavor} VS ${away.nombre} : ${away.golesaFavor}`);

        if (result.golesHomeSemis > result.golesAwaySemis) {
            home.points += this.config.pointsPerWin;
            away.points += this.config.pointsPerLose;   // si tenemos un valor diferente de 0
            home.partidosGanados++;
            away.partidosPerdidos++;
        } else if (result.golesAwaySemis > result.golesHomeSemis) {
            away.points += this.config.pointsPerWin;
            home.points += this.config.pointsPerLose; // si tenemos un valor diferente de 0
            home.partidosPerdidos++;
            away.partidosGanados++;

        
            
            
        }
        
        if (result.golesHomeFinales > result.golesAwayFinales) {
                jornadaGanador.push(home)
            } else (
                    jornadaGanador.push(away)
                )
                
        console.log('                                                              ');
        console.log('==================================================');
        console.log('  El Campeon de la EUROCOPA 2020 es :', jornadaGanador[0].nombre.toUpperCase());
        console.log('==================================================');
   
            
            
        jornadaGanador = this.equiposClasificados.filter(equipo => equipo.partidosGanados !== 3);

        
        
    
    }


    
}