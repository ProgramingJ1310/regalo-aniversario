// Configuración de la fecha correcta
const FECHA_CORRECTA = "26/10/2021";

// Auto-formateo del campo de texto (agrega / automáticamente al escribir)
const fechaInput = document.getElementById("fechaInput");
if (fechaInput) {
    fechaInput.addEventListener("input", (e) => {
        let v = e.target.value.replace(/\D/g, "");
        if (v.length >= 2 && v.length < 4) {
            v = v.slice(0, 2) + "/" + v.slice(2);
        } else if (v.length >= 4) {
            v = v.slice(0, 2) + "/" + v.slice(2, 4) + "/" + v.slice(4, 8);
        }
        e.target.value = v;
    });
}

// Función de validación
function validarFecha(event) {
    event.preventDefault();
    const inputVal = fechaInput.value.trim();
    const mensajeError = document.getElementById("mensajeError");

    if (inputVal === FECHA_CORRECTA) {
        mensajeError.classList.remove("error-visible");
        
        // Calcular los días restantes dinámicamente
        calcularDiasAniversario();

        // Transición de pantalla
        document.getElementById("pantalla1").classList.remove("activa");
        document.getElementById("pantalla2").classList.add("activa");
        
        // Iniciar animación del corazón latiendo
        iniciarAnimacionCorazonLatiendo();
    } else {
        mensajeError.classList.add("error-visible");
    }
}

// CÁLCULO DINÁMICO DE DÍAS FALTANTES
function calcularDiasAniversario() {
    const hoy = new Date();
    // Mes 9 representa Octubre en Javascript (0 es Enero, 9 es Octubre)
    let proximoAniversario = new Date(hoy.getFullYear(), 9, 26); 

    // Si la fecha de este año ya pasó, calcular para el próximo año
    if (hoy > proximoAniversario) {
        const unDia = 1000 * 60 * 60 * 24;
        if (Math.floor((hoy - proximoAniversario) / unDia) >= 1) {
            proximoAniversario.setFullYear(hoy.getFullYear() + 1);
        }
    }

    const diferenciaTiempo = proximoAniversario - hoy;
    const diasFaltantes = Math.ceil(diferenciaTiempo / (1000 * 60 * 60 * 24));
    
    document.getElementById("diasContador").textContent = diasFaltantes > 0 ? diasFaltantes : 0;
}

// ANIMACIÓN DE CORAZÓN CON LATIDO RÍTMICO (HEARTBEAT)
function iniciarAnimacionCorazonLatiendo() {
    const canvas = document.getElementById("heartCanvas");
    const ctx = canvas.getContext("2d");

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener("resize", resize);

    const particles = [];
    const numParticles = 420; // Más partículas para mayor densidad
    let pulseAngle = 0.02; // Ángulo para controlar el ritmo del latido

    // Ecuación matemática del corazón
    function getHeartPoint(t) {
        const x = 16 * Math.pow(Math.sin(t), 3);
        const y = -(13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t));
        return { x, y };
    }

    class Particle {
        constructor() {
            this.t = Math.random() * Math.PI * 2;
            this.basePoint = getHeartPoint(this.t);
            
            this.x = canvas.width / 2 + (Math.random() - 0.5) * 60;
            this.y = canvas.height / 2 + (Math.random() - 0.5) * 60;
            
            this.size = Math.random() * 2.5 + 1;
            this.speed = Math.random() * 0.03 + 0.015;
            this.alpha = Math.random() * 0.7 + 0.3;
        }

        update(beatScale) {
            // Aplica el factor de latido (beatScale)
            const baseScale = Math.min(canvas.width, canvas.height) / 36;
            const currentScale = baseScale * beatScale;

            this.targetX = canvas.width / 2 + this.basePoint.x * currentScale;
            this.targetY = canvas.height / 2.3 + this.basePoint.y * currentScale;

            // Movimiento suave hacia el objetivo
            this.x += (this.targetX - this.x) * this.speed;
            this.y += (this.targetY - this.y) * this.speed;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 77, 109, ${this.alpha})`;
            ctx.shadowBlur = 12;
            ctx.shadowColor = "#ff4d6d";
            ctx.fill();
        }
    }

    // Crear las partículas
    for (let i = 0; i < numParticles; i++) {
        particles.push(new Particle());
    }

    // Bucle de animación continuo
  // Bucle de animación continuo con latido pausado
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Disminuimos el incremento a 0.02 para que el ritmo sea más lento
        pulseAngle += 0.02; 
        
        // Mantiene la expansión suave del corazón
        const beatScale = 1 + 0.07 * Math.pow(Math.sin(pulseAngle), 3);

        particles.forEach(p => {
            p.update(beatScale);
            p.draw();
        });

        requestAnimationFrame(animate);
    }

    animate();
}

// FUNCIONES DE LA CARTA
function abrirCarta() {
    const modal = document.getElementById("modalCarta");
    modal.classList.add("activo");
}

function cerrarCarta() {
    const modal = document.getElementById("modalCarta");
    modal.classList.remove("activo");
}