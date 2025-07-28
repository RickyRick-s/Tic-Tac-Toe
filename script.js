    const gameboard = (function(){

        const tablero = ['', '', '', '', '', '', '', '', ''];
        const obtenerTablero = () => tablero;
        const colocarSimbolo = (indice, simbolo) => {tablero[indice] = simbolo};
        const reiniciarTablero = () => {
            for (let i = 0; i <= 8; i++){
                tablero[i] = '';
            }
        };
        return {tablero, obtenerTablero, colocarSimbolo, reiniciarTablero};    
    })();

    function jugador(simbolo){
        const obtenerSimbolo = () => simbolo;
        return {obtenerSimbolo};
    };

    const juegoControlador = (function(){
        let victoriasX = 0;
        let victoriasO = 0;
        let empates = 0;
        let jugador1, jugador2, jugadorActual;
        let juegoActivo = true;
        const combinacionesGanadoras = [
        [0,1,2], [3,4,5], [6,7,8],  
        [0,3,6], [1,4,7], [2,5,8],  
        [0,4,8], [2,4,6]            
        ];

        function iniciarJuego(){
            juegoActivo = true;
            jugador1 = jugador('X');
            jugador2 = jugador('O');
            jugadorActual = jugador1;
            gameboard.reiniciarTablero();
        }

        function verificarGanador(){
            const tablero = gameboard.obtenerTablero();
            for (const [a,b,c] of combinacionesGanadoras){
                if(tablero[a] && tablero[a] === tablero[b] && tablero[a] === tablero[c]){
                    juegoActivo = false;
                    return true;
                }
            }
            return false;
        }

        function verificarEmpate() {
            const tablero = gameboard.obtenerTablero();
            if(tablero.every(celda => celda !== '')){
                juegoActivo = false;
                return true;
            }
            return false;
        }

        function cambiarTurno() {
            jugadorActual === jugador1 ? jugadorActual = jugador2 : jugadorActual = jugador1;
        }

        const obtenerJugadorActual = () => jugadorActual;
        const obtenerJuegoActivo = () => juegoActivo;

        const jugarTurno = (indice) => {
            if(gameboard.obtenerTablero()[indice] === '' && juegoActivo){
                gameboard.colocarSimbolo(indice, jugadorActual.obtenerSimbolo());

                if(verificarGanador()){
                    jugadorActual === jugador1 ? victoriasX++ : victoriasO++;
                    return 'ganador';
                }

                if(verificarEmpate()){
                    empates++;
                    return 'empate';
                }

                cambiarTurno();
                return 'turno-cambiado';
            }
            return 'turno-invalido';
        }

        function obtenerEstadisticas() {
            return { victoriasX, victoriasO, empates };
        }

        return {iniciarJuego, verificarGanador, verificarEmpate, cambiarTurno, jugarTurno, obtenerEstadisticas, obtenerJugadorActual, obtenerJuegoActivo};
    })();

    const displayControlador = (function(){
        const celda = document.querySelectorAll('.celda');
        const mensaje = document.querySelector('#mensaje');
        const boton = document.querySelector('#reiniciar');
        const marcador = document.querySelector('#marcador');

        celda.forEach((celda, indice) => {
        celda.addEventListener('click', () => manejarClick(indice));
        });

        const iniciar = () => {
            const estadisticas = juegoControlador.obtenerEstadisticas();
            let marcadorActual = `X ${estadisticas.victoriasX} victorias | O ${estadisticas.victoriasO} victorias | ${estadisticas.empates} Empates`;
            marcador.textContent = marcadorActual;
            celda.forEach(celda => celda.textContent = '');
            juegoControlador.iniciarJuego();
            mensaje.textContent = 'Turno de ' + juegoControlador.obtenerJugadorActual().obtenerSimbolo();
        };

        boton.addEventListener('click', () => iniciar());

        const manejarClick = (indice) => {
            const tablero = gameboard.obtenerTablero();
            if(tablero[indice] !== '' || !juegoControlador.obtenerJuegoActivo()){
                return;
            }
            
            const resultado = juegoControlador.jugarTurno(indice);
            celda[indice].textContent = gameboard.obtenerTablero()[indice];

            if(resultado === 'ganador'){
                mensaje.textContent = juegoControlador.obtenerJugadorActual().obtenerSimbolo() + ' gana!';
            } else if(resultado === 'empate'){
                mensaje.textContent = 'Empate!';
            } else if(resultado === 'turno-cambiado'){
                mensaje.textContent = 'Turno de ' + juegoControlador.obtenerJugadorActual().obtenerSimbolo();
            }
            const estadisticas = juegoControlador.obtenerEstadisticas();
            let marcadorActual = `X ${estadisticas.victoriasX} victorias | O ${estadisticas.victoriasO} victorias | ${estadisticas.empates} Empates`;
            marcador.textContent = marcadorActual;
        };


        iniciar();

    })();
