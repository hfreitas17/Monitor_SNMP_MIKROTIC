var unidadeTX = "";
var unidadeRX = "";
var intervaloSegundos = 3;

async function carregarDadosTX() {
    //const intervaloSegundos = 5;
    const responseTX = await fetch("\\taxaTX.txt"); // Lendo arquivo TXT (Transmissão)
    const texto = await responseTX.text();
    const linhas = texto.trim().split('\n');

    const horariosTX = [];
    const taxaTX = [];
    
    linhas.forEach((linha, i) => {
        if(i == 0){
            taxaTX.push(0);
        }
        else{
            const [horario, valorAtual] = linha.split(',').map(item => item.trim());            
            const [_, valorAnterior] = linhas[i-1].split(',').map(item => item.trim());
            
            const deltaBytes = valorAtual - valorAnterior;
            const deltaBits = deltaBytes * 8;
            const Mbps = deltaBits / intervaloSegundos / 1_000_000;

            let texto_Tx;
            let taxa;
            
            if (Mbps < 1) {
                taxa = (Mbps * 1000).toFixed(1);
                texto_Tx = "Tx: " + taxa + " Kbps";
                unidadeTX = " Kbps";
            } else {
                taxa = Mbps.toFixed(3);
                texto_Tx = "Tx: " + taxa + " Mbps";
                unidadeTX = " Mbps";
            }
            horariosTX.push(horario);
            
            taxaTX.push(taxa);             
            document.getElementById('taxa_Tx').innerText = texto_Tx;
        }
    });

    return { 
        horariosTX: horariosTX.slice(-30), 
        taxaTX: taxaTX.slice(-30) 
    }; // // Retorna apenas as 20 últimas leituras
    
}

async function carregarDadosRX() {
    //const intervaloSegundos = 5;
    const responseRX = await fetch("\\taxaRX.txt"); // Lendo arquivo TXT (Recepção)
    const texto = await responseRX.text();
    const linhas = texto.trim().split('\n');
    const horariosRX = [];
    const taxaRX = [];

    linhas.forEach((linha, i) => {
        if(i == 0){
            taxaRX.push(0);
        }
        else{
            const [horario, valorAtual] = linha.split(',').map(item => item.trim());
            const [_, valorAnterior] = linhas[i-1].split(',').map(item => item.trim());

            const deltaBytes = valorAtual - valorAnterior;
            const deltaBits = deltaBytes * 8;
            const Mbps = deltaBits / intervaloSegundos / 1_000_000; 

            let texto_Rx;
            let taxa;
            if (Mbps < 1) {
                taxa = (Mbps * 1000).toFixed(1);
                texto_Rx = "Tx: " + taxa + " Kbps";
                unidadeRX = " Kbps";
            } else {
                taxa = Mbps.toFixed(3);
                texto_Rx = "Tx: " + taxa + " Mbps";
                unidadeRX = " Mbps";
            }            
            horariosRX.push(horario);

            taxaRX.push(taxa);
            document.getElementById('taxa_Rx').innerText = texto_Rx;
        }
    });
    return { 
        horariosRX: horariosRX.slice(-20) , 
        taxaRX: taxaRX.slice(-20) 
    }; // Retorna os dados lidos
}

// Inicialização dos gráficos após carregar os dados
async function iniciarGraficos() {
    const { horariosTX, taxaTX } = await carregarDadosTX();
     const { horariosRX, taxaRX } = await carregarDadosRX();

    var ctx1 = document.getElementById("grafico_1").getContext("2d");
    var grafico1 = new Chart(ctx1, {
        type: 'line',
        data: {
            labels: horariosTX,
            datasets: [{
                label: 'Tx',
                data: taxaTX,
                backgroundColor: 'rgba(50, 51, 51, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
                fill: true,
                pointRadius: 0                
            }]
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    title: {
                        display: false,
                        text: "Tempo (s)",
                        font: {
                            size: 10, 
                            family: 'Arial',
                            weight: 'bold'
                        }
                    },
                     ticks: {
                        display: true, 
                    },
                    grid: { 
                        display: false 
                    }
                },
                y: {
                    min: 0,
                    beginAtZero: true,                    
                    title: {
                        display: true,
                        text: unidadeTX,
                        align: "center",
                        font: {
                            size: 20,
                            family: 'Arial', 
                            weight: 'normal' 
                        }
                    },
                    ticks: {
                        font: {
                            size: 16,
                        },
                        display: true
                    }
                }
            },
            plugins: {
                legend: {
                display: false
                }
            },
            animation: {
                duration: 1000, 
                easing: 'easeInOutQuad'           
            }
        }
    });

    var ctx2 = document.getElementById("grafico_2").getContext("2d");
    var grafico2 = new Chart(ctx2, {
        type: 'line',
        data: {
            labels: horariosRX,
            datasets: [{ 
                label: 'Rx',
                data: taxaRX,
                backgroundColor: 'rgba(243, 224, 162, 0.2)',                
                borderColor: 'rgb(177, 174, 40)',
                borderWidth: 1,
                fill: true,
                pointRadius: 0                
            }],
        },
        options: { 
            responsive: true,
            scales: {
                x: {
                    title: {
                        display: false,
                        text: "Tempo (s)",
                        font: {
                            size: 10,
                            family: 'Arial',
                            weight: 'bold'
                        }
                    },
                    ticks: {
                        display: true, 
                    },
                    grid: { 
                        display: false 
                    }
                },
                y: {
                    min: 0,
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: unidadeRX,
                        align: "center",
                        font: {
                            size: 20,
                            family: 'Arial', 
                            weight: 'normal'
                        }
                    },
                    ticks: {
                        font: {
                            size: 16,
                        },
                        display: true
                    }
                }
            },
            plugins: {
                legend: {
                display: false
                }
            },
            animation: {
                duration: 1000, 
                easing: 'easeInOutQuad'
            }            
        }    
    });

    // Atualizar a cada x segundos
    setInterval(() => atualizarGraficos(grafico1, grafico2), 1000);

    function updateChart(chart, newData) {
    chart.data.datasets[0].data = newData;
    chart.update();
}
}
// Função para atualizar os gráficos
function atualizarGraficos(grafico1, grafico2) {
    carregarDadosTX().then(({ horariosTX, taxaTX }) => {
        grafico1.data.labels = horariosTX;
        grafico1.data.datasets[0].data = taxaTX;        
        grafico1.update('none');        
    })

    carregarDadosRX().then(({ horariosRX, taxaRX }) => {
        grafico2.data.labels = horariosRX;
        grafico2.data.datasets[0].data = taxaRX;
        grafico2.update('none');        
    })
}

// Inicializar os gráficos
iniciarGraficos();
